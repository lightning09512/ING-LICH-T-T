import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseConfigured, firestore } from '../firebase';

export interface LearningProgress {
  grammarProgress: Record<string, number>;
  vocabUnlockedDay: number;
  vocabDayStars: Record<number, number>;
}

export type SyncStatus = 'local' | 'syncing' | 'saved' | 'error';

interface ProgressContextValue {
  user: User | null;
  progress: LearningProgress;
  authLoading: boolean;
  syncStatus: SyncStatus;
  authError: string | null;
  firebaseConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleRedirect: () => Promise<boolean>;
  createEmailAccount: (email: string, password: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  saveGrammarScore: (topicId: string, score: number) => void;
  saveVocabularyProgress: (unlockedDay: number, dayStars: Record<number, number>) => void;
}

const DEFAULT_PROGRESS: LearningProgress = {
  grammarProgress: {},
  vocabUnlockedDay: 1,
  vocabDayStars: {},
};

const LEGACY_KEYS = {
  grammar: 'ing_grammar_progress',
  unlockedDay: 'ing_lich_unlocked_day',
  dayStars: 'ing_lich_day_stars',
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function normalizeProgress(value: unknown): LearningProgress {
  if (!value || typeof value !== 'object') return { ...DEFAULT_PROGRESS };

  const raw = value as Partial<LearningProgress>;
  const grammarProgress = Object.fromEntries(
    Object.entries(raw.grammarProgress ?? {}).filter(([, score]) => Number.isFinite(score) && score >= 0)
  );
  const vocabDayStars = Object.fromEntries(
    Object.entries(raw.vocabDayStars ?? {}).filter(([, stars]) => Number.isFinite(stars) && stars >= 0)
  );
  const unlockedDay = Number(raw.vocabUnlockedDay);

  return {
    grammarProgress,
    vocabUnlockedDay: Number.isFinite(unlockedDay) ? Math.max(1, Math.min(26, unlockedDay)) : 1,
    vocabDayStars,
  };
}

function mergeProgress(...items: LearningProgress[]): LearningProgress {
  const merged = items.map(normalizeProgress).reduce<LearningProgress>((result, item) => {
    for (const [topicId, score] of Object.entries(item.grammarProgress)) {
      result.grammarProgress[topicId] = Math.max(result.grammarProgress[topicId] ?? 0, score);
    }
    for (const [day, stars] of Object.entries(item.vocabDayStars)) {
      const numericDay = Number(day);
      if (Number.isFinite(numericDay)) {
        result.vocabDayStars[numericDay] = Math.max(result.vocabDayStars[numericDay] ?? 0, stars);
      }
    }
    result.vocabUnlockedDay = Math.max(result.vocabUnlockedDay, item.vocabUnlockedDay);
    return result;
  }, { ...DEFAULT_PROGRESS, grammarProgress: {}, vocabDayStars: {} });

  return merged;
}

function readGuestProgress(): LearningProgress {
  try {
    const grammar = localStorage.getItem(LEGACY_KEYS.grammar);
    const unlockedDay = localStorage.getItem(LEGACY_KEYS.unlockedDay);
    const dayStars = localStorage.getItem(LEGACY_KEYS.dayStars);
    return normalizeProgress({
      grammarProgress: grammar ? JSON.parse(grammar) : {},
      vocabUnlockedDay: unlockedDay ? Number.parseInt(unlockedDay, 10) : 1,
      vocabDayStars: dayStars ? JSON.parse(dayStars) : {},
    });
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function readUserCache(uid: string): LearningProgress | null {
  try {
    const saved = localStorage.getItem(`ing_progress_${uid}`);
    return saved ? normalizeProgress(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

function writeLocalProgress(progress: LearningProgress, uid: string | null) {
  try {
    if (uid) {
      localStorage.setItem(`ing_progress_${uid}`, JSON.stringify(progress));
      return;
    }

    localStorage.setItem(LEGACY_KEYS.grammar, JSON.stringify(progress.grammarProgress));
    localStorage.setItem(LEGACY_KEYS.unlockedDay, String(progress.vocabUnlockedDay));
    localStorage.setItem(LEGACY_KEYS.dayStars, JSON.stringify(progress.vocabDayStars));
  } catch (error) {
    console.error('Could not save learning progress locally:', error);
  }
}

function clearGuestProgress() {
  try {
    Object.values(LEGACY_KEYS).forEach(key => localStorage.removeItem(key));
  } catch {
    // Ignore storage restrictions; the signed-in user's cache is separate.
  }
}

function getErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const message = (error as { message?: string })?.message;

  if (!code && !message) return 'Yêu cầu chưa thành công. Hãy thử lại nhé.';

  const cleanCode = code?.toLowerCase() || '';

  if (cleanCode.includes('api-key-not-valid') || cleanCode.includes('invalid-api-key')) {
    return 'Lỗi: API Key Firebase không hợp lệ. Vui lòng vào Firebase Console > Project settings (biểu tượng ⚙️) để copy đúng Web API Key và cập nhật lại biến VITE_FIREBASE_API_KEY trên Vercel.';
  }
  if (cleanCode.includes('unauthorized-domain')) {
    return 'Lỗi: Tên miền chưa được cấp phép. Vui lòng vào Firebase Console > Authentication > Settings > Authorized domains và thêm "ing-lich-tet.vercel.app".';
  }
  if (cleanCode.includes('operation-not-allowed')) {
    return 'Lỗi: Chưa bật phương thức đăng nhập này. Vui lòng vào Firebase Console > Authentication > Sign-in method và bật "Google" (và Email/Password).';
  }
  if (cleanCode.includes('email-already-in-use')) {
    return 'Email này đã có tài khoản. Hãy chuyển sang Đăng nhập hoặc dùng email khác.';
  }
  if (cleanCode.includes('invalid-email')) {
    return 'Địa chỉ email chưa đúng định dạng (ví dụ: yourname@gmail.com).';
  }
  if (cleanCode.includes('weak-password')) {
    return 'Mật khẩu cần có ít nhất 6 ký tự.';
  }
  if (
    cleanCode.includes('invalid-credential') ||
    cleanCode.includes('user-not-found') ||
    cleanCode.includes('wrong-password')
  ) {
    return 'Email hoặc mật khẩu chưa đúng.';
  }
  if (cleanCode.includes('popup-closed-by-user')) {
    return 'Cửa sổ đăng nhập Google đã bị đóng.';
  }
  if (cleanCode.includes('popup-blocked')) {
    return 'Trình duyệt đã chặn cửa sổ đăng nhập Google. Hãy cho phép popup hoặc thử lại.';
  }
  if (cleanCode.includes('cancelled-popup-request')) {
    return 'Đang có một yêu cầu đăng nhập khác đang mở. Vui lòng thử lại.';
  }
  if (cleanCode.includes('too-many-requests')) {
    return 'Thử đăng nhập quá nhiều lần liên tiếp. Hãy đợi ít phút rồi thử lại.';
  }
  if (cleanCode.includes('network-request-failed')) {
    return 'Không kết nối được Firebase. Hãy kiểm tra kết nối mạng của bạn.';
  }

  return `Lỗi đăng nhập (${code || 'unknown'}): ${message || 'Yêu cầu chưa thành công.'}`;
}

export const ProgressProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(readGuestProgress);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [authError, setAuthError] = useState<string | null>(null);
  const progressRef = useRef(progress);
  const guestProgressRef = useRef(progress);
  const userRef = useRef<User | null>(null);
  const authRequestRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const auth = firebaseAuth;
    const db = firestore;
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    let disposed = false;

    // Check redirect result in background without blocking onAuthStateChanged
    void getRedirectResult(auth)
      .then(result => {
        if (!disposed && result?.user) {
          userRef.current = result.user;
          setUser(result.user);
          setSyncStatus('saved');
        }
      })
      .catch(error => {
        if (!disposed && error?.code !== 'auth/null-user') {
          console.warn('getRedirectResult error:', error);
          setAuthError(getErrorMessage(error));
        }
      });

    // Attach onAuthStateChanged immediately so session restores instantaneously
    const unsubscribe = onAuthStateChanged(auth, nextUser => {
      const requestId = ++authRequestRef.current;
      userRef.current = nextUser;
      setUser(nextUser);
      if (nextUser) setAuthError(null);

      if (!nextUser) {
        progressRef.current = guestProgressRef.current;
        setProgress(guestProgressRef.current);
        setSyncStatus('local');
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);
      setSyncStatus('syncing');
      const cachedProgress = readUserCache(nextUser.uid);
      const initialProgress = mergeProgress(cachedProgress ?? DEFAULT_PROGRESS, guestProgressRef.current);
      progressRef.current = initialProgress;
      setProgress(initialProgress);

      if (!db) {
        setSyncStatus('local');
        setAuthLoading(false);
        return;
      }

      void (async () => {
        try {
          const progressDoc = doc(db, 'users', nextUser.uid, 'progress', 'learning');
          const remoteSnapshot = await getDoc(progressDoc);
          if (requestId !== authRequestRef.current) return;

          const latestCache = readUserCache(nextUser.uid) ?? initialProgress;
          const remoteProgress = remoteSnapshot.exists()
            ? normalizeProgress(remoteSnapshot.data())
            : DEFAULT_PROGRESS;
          const merged = mergeProgress(remoteProgress, latestCache, guestProgressRef.current);

          await setDoc(progressDoc, { ...merged, updatedAt: serverTimestamp() }, { merge: true });
          if (requestId !== authRequestRef.current) return;

          progressRef.current = merged;
          setProgress(merged);
          writeLocalProgress(merged, nextUser.uid);
          clearGuestProgress();
          guestProgressRef.current = { ...DEFAULT_PROGRESS };
          setSyncStatus('saved');
        } catch (error) {
          if (requestId !== authRequestRef.current) return;
          console.error('Could not sync learning progress with Firestore:', error);
          setSyncStatus('error');
          // Không văng lỗi chặn người dùng, chỉ ghi chú nhẹ
        } finally {
          if (requestId === authRequestRef.current) setAuthLoading(false);
        }
      })();
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được kết nối Firebase. Cần cấu hình project trước khi tạo tài khoản.');
      return false;
    }

    const validEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`;

    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, validEmail, password);
      if (cred?.user) {
        userRef.current = cred.user;
        setUser(cred.user);
        setSyncStatus('saved');
      }
      return true;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      // Nếu tài khoản chưa có, tự động tạo mới luôn để người dùng không phải đổi tab
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        try {
          const createCred = await createUserWithEmailAndPassword(firebaseAuth, validEmail, password);
          if (createCred?.user) {
            userRef.current = createCred.user;
            setUser(createCred.user);
            setSyncStatus('saved');
          }
          return true;
        } catch {
          setAuthError(getErrorMessage(error));
          return false;
        }
      }
      setAuthError(getErrorMessage(error));
      return false;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được cấu hình Firebase. Hãy kiểm tra biến môi trường VITE_FIREBASE_* trên Vercel.');
      return false;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      // Ưu tiên mở popup: mượt mà, không load lại trang
      const cred = await signInWithPopup(firebaseAuth, provider);
      if (cred?.user) {
        userRef.current = cred.user;
        setUser(cred.user);
        setSyncStatus('saved');
      }
      return true;
    } catch (popupError: unknown) {
      console.warn('Google signInWithPopup error, checking fallback:', popupError);
      const code = (popupError as { code?: string })?.code;
      // Nếu trình duyệt chặn popup, tự động chuyển sang redirect
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          try { sessionStorage.setItem('ing_signing_in_redirect', '1'); } catch {}
          await signInWithRedirect(firebaseAuth, provider);
          return true;
        } catch (redirectError) {
          setAuthError(getErrorMessage(redirectError));
          return false;
        }
      }
      setAuthError(getErrorMessage(popupError));
      return false;
    }
  }, []);

  const signInWithGoogleRedirect = useCallback(async () => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được cấu hình Firebase. Hãy kiểm tra biến môi trường VITE_FIREBASE_* trên Vercel.');
      return false;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      try { sessionStorage.setItem('ing_signing_in_redirect', '1'); } catch {}
      await signInWithRedirect(firebaseAuth, provider);
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    }
  }, []);

  const createEmailAccount = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được kết nối Firebase. Cần cấu hình project trước khi tạo tài khoản.');
      return false;
    }

    const validEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`;

    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, validEmail, password);
      if (cred?.user) {
        userRef.current = cred.user;
        setUser(cred.user);
        setSyncStatus('saved');
      }
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được kết nối Firebase. Cần cấu hình project trước khi đặt lại mật khẩu.');
      return false;
    }

    const validEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`;

    try {
      await sendPasswordResetEmail(firebaseAuth, validEmail);
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!firebaseAuth) return;
    setAuthError(null);
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  }, []);

  const commitProgress = useCallback((update: (current: LearningProgress) => LearningProgress) => {
    const next = normalizeProgress(update(progressRef.current));
    progressRef.current = next;
    setProgress(next);

    const uid = userRef.current?.uid ?? null;
    writeLocalProgress(next, uid);
    if (!uid) {
      guestProgressRef.current = next;
      setSyncStatus('local');
      return;
    }

    if (!firestore) {
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    void setDoc(doc(firestore, 'users', uid, 'progress', 'learning'), {
      ...next,
      updatedAt: serverTimestamp(),
    }, { merge: true })
      .then(() => {
        setSyncStatus('saved');
        setAuthError(null);
      })
      .catch(error => {
        console.error('Could not save learning progress to Firestore:', error);
        setSyncStatus('error');
        setAuthError('Tiến trình đã lưu trên thiết bị này, nhưng chưa đồng bộ được lên tài khoản. Kiểm tra kết nối và quyền Firestore.');
      });
  }, []);

  const saveGrammarScore = useCallback((topicId: string, score: number) => {
    commitProgress(current => ({
      ...current,
      grammarProgress: {
        ...current.grammarProgress,
        [topicId]: Math.max(current.grammarProgress[topicId] ?? 0, score),
      },
    }));
  }, [commitProgress]);

  const saveVocabularyProgress = useCallback((unlockedDay: number, dayStars: Record<number, number>) => {
    commitProgress(current => {
      const mergedStars = { ...current.vocabDayStars };
      for (const [day, stars] of Object.entries(dayStars)) {
        const numericDay = Number(day);
        if (Number.isFinite(numericDay)) {
          mergedStars[numericDay] = Math.max(mergedStars[numericDay] ?? 0, stars);
        }
      }

      return {
        ...current,
        vocabUnlockedDay: Math.max(current.vocabUnlockedDay, unlockedDay),
        vocabDayStars: mergedStars,
      };
    });
  }, [commitProgress]);

  const value: ProgressContextValue = {
    user,
    progress,
    authLoading,
    syncStatus,
    authError,
    firebaseConfigured,
    signInWithEmail,
    signInWithGoogle,
    signInWithGoogleRedirect,
    createEmailAccount,
    sendPasswordReset,
    signOut,
    clearAuthError: () => setAuthError(null),
    saveGrammarScore,
    saveVocabularyProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export function useLearningProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useLearningProgress must be used inside ProgressProvider');
  return context;
}
