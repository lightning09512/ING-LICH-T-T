import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
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
  if (code === 'auth/email-already-in-use') return 'Email này đã có tài khoản. Hãy đăng nhập hoặc dùng email khác.';
  if (code === 'auth/invalid-email') return 'Địa chỉ email chưa hợp lệ.';
  if (code === 'auth/weak-password') return 'Mật khẩu cần có ít nhất 6 ký tự.';
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return 'Email hoặc mật khẩu chưa đúng.';
  }
  if (code === 'auth/operation-not-allowed') return 'Firebase chưa bật phương thức đăng nhập này.';
  if (code === 'auth/popup-closed-by-user') return 'Cửa sổ đăng nhập Google đã bị đóng.';
  if (code === 'auth/popup-blocked') return 'Trình duyệt đã chặn cửa sổ Google. Cho phép cửa sổ bật lên rồi thử lại.';
  if (code === 'auth/cancelled-popup-request') return 'Đang có một yêu cầu đăng nhập Google khác. Thử lại nhé.';
  if (code === 'auth/too-many-requests') return 'Có quá nhiều lần thử. Hãy đợi một lúc rồi thử lại.';
  if (code === 'auth/unauthorized-domain') return 'Tên miền hiện tại chưa được thêm vào danh sách Authorized domains trong Firebase.';
  if (code === 'auth/network-request-failed') return 'Không kết nối được Firebase. Hãy kiểm tra mạng rồi thử lại.';
  return 'Yêu cầu chưa thành công. Hãy thử lại nhé.';
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
    if (!auth || !db) {
      setAuthLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let disposed = false;

    // Resolve a pending Google redirect before subscribing so redirect errors
    // remain visible after returning to the app.
    void getRedirectResult(auth)
      .catch(error => {
        if (!disposed) setAuthError(getErrorMessage(error));
      })
      .finally(() => {
        if (disposed) return;

        unsubscribe = onAuthStateChanged(auth, nextUser => {
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
              console.error('Could not sync learning progress:', error);
              setSyncStatus('error');
              setAuthError('Đã đăng nhập, nhưng chưa đồng bộ được tiến trình. Kiểm tra cấu hình Firestore và quyền truy cập.');
            } finally {
              if (requestId === authRequestRef.current) setAuthLoading(false);
            }
          })();
        });
      });

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được kết nối Firebase. Cần cấu hình project trước khi tạo tài khoản.');
      return false;
    }

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return true;
    } catch (error) {
      setAuthError(getErrorMessage(error));
      return false;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    if (!firebaseAuth) {
      setAuthError('Ứng dụng chưa được kết nối Firebase. Cần cấu hình project trước khi đăng nhập.');
      return false;
    }

    try {
      await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
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

    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
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

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
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
