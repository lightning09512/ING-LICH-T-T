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
import { getRankTier } from '../types/ranked';
import { RankTier, PromoSeries, MatchRecord, RANK_ORDER } from '../types/ranked';

export interface LearningProgress {
  grammarProgress: Record<string, number>;
  vocabUnlockedDay: number;
  vocabDayStars: Record<number, number>;
  vocabChapter2UnlockedDay: number;
  vocabChapter2DayStars: Record<number, number>;
  streakDays: number;
  lastStudyDate: string;
  hearts: number;
  lastHeartRefillTime: number;
  // Ranked mode
  rankTier: RankTier;
  rankLp: number;
  rankPromo: PromoSeries | null;
  rankMatchesPlayed: number;
  rankWins: number;
  rankWinStreak: number;
  rankHistory: MatchRecord[];
}

export type SyncStatus = 'local' | 'syncing' | 'saved' | 'error';

interface ProgressContextValue {
  user: User | null;
  progress: LearningProgress;
  authLoading: boolean;
  syncStatus: SyncStatus;
  authError: string | null;
  firebaseConfigured: boolean;
  streakDays: number;
  lastStudyDate: string;
  hearts: number;
  rankTier: RankTier;
  rankLp: number;
  rankPromo: PromoSeries | null;
  rankMatchesPlayed: number;
  rankWins: number;
  rankWinStreak: number;
  rankHistory: MatchRecord[];
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleRedirect: () => Promise<boolean>;
  createEmailAccount: (email: string, password: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  saveGrammarScore: (topicId: string, score: number) => void;
  saveVocabularyProgress: (unlockedDay: number, dayStars: Record<number, number>, chapter?: 1 | 2) => void;
  recordStudyActivity: () => void;
  loseHeart: () => boolean;
  refillHearts: () => void;
  saveRankMatchResult: (match: {
    tier: RankTier;
    score: number;
    total: number;
    accuracy: number;
    isWin: boolean;
  }) => {
    lpChange: number;
    newTier: RankTier;
    newLp: number;
    promoSeries: PromoSeries | null;
    isPromoted: boolean;
    isDemoted: boolean;
  };
}

const DEFAULT_PROGRESS: LearningProgress = {
  grammarProgress: {},
  vocabUnlockedDay: 1,
  vocabDayStars: {},
  vocabChapter2UnlockedDay: 1,
  vocabChapter2DayStars: {},
  streakDays: 5,
  lastStudyDate: '',
  hearts: 3,
  lastHeartRefillTime: Date.now(),
  rankTier: 'BRONZE',
  rankLp: 0,
  rankPromo: null,
  rankMatchesPlayed: 0,
  rankWins: 0,
  rankWinStreak: 0,
  rankHistory: [],
};

const LEGACY_KEYS = {
  grammar: 'ing_grammar_progress',
  unlockedDay: 'ing_lich_unlocked_day',
  dayStars: 'ing_lich_day_stars',
  chapter2UnlockedDay: 'ing_lich_v2_unlocked_day',
  chapter2DayStars: 'ing_lich_v2_day_stars',
  streak: 'ing_lich_streak_days',
  lastStudyDate: 'ing_lich_last_study_date',
  hearts: 'ing_lich_hearts',
  lastHeartRefillTime: 'ing_lich_heart_refill_time',
  rankTier: 'ing_rank_tier',
  rankLp: 'ing_rank_lp',
  rankPromo: 'ing_rank_promo',
  rankMatches: 'ing_rank_matches',
  rankWins: 'ing_rank_wins',
  rankStreak: 'ing_rank_streak',
  rankHistory: 'ing_rank_history',
};

function getLocalDateString(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

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
  const rawChapter2Unlocked = Number(raw.vocabChapter2UnlockedDay);
  const vocabChapter2UnlockedDay = Number.isFinite(rawChapter2Unlocked) ? Math.max(1, Math.min(13, rawChapter2Unlocked)) : 1;
  const vocabChapter2DayStars = Object.fromEntries(
    Object.entries(raw.vocabChapter2DayStars ?? {}).filter(([, stars]) => Number.isFinite(stars) && stars >= 0)
  );
  const rawStreak = Number(raw.streakDays);
  const streakDays = Number.isFinite(rawStreak) && rawStreak >= 0 ? rawStreak : 5;
  const lastStudyDate = typeof raw.lastStudyDate === 'string' ? raw.lastStudyDate : '';
  const rawHearts = Number(raw.hearts);
  const hearts = Number.isFinite(rawHearts) ? Math.max(0, Math.min(3, rawHearts)) : 3;
  const rawRefill = Number(raw.lastHeartRefillTime);
  const lastHeartRefillTime = Number.isFinite(rawRefill) ? rawRefill : Date.now();

  const rankTier: RankTier = raw.rankTier && RANK_ORDER.includes(raw.rankTier) ? raw.rankTier : 'BRONZE';
  const rawLp = Number(raw.rankLp);
  const rankLp = Number.isFinite(rawLp) ? Math.max(0, Math.min(100, rawLp)) : 0;
  const rankPromo: PromoSeries | null = raw.rankPromo && typeof raw.rankPromo === 'object' && raw.rankPromo.active ? raw.rankPromo : null;
  const rankMatchesPlayed = Number.isFinite(Number(raw.rankMatchesPlayed)) ? Math.max(0, Number(raw.rankMatchesPlayed)) : 0;
  const rankWins = Number.isFinite(Number(raw.rankWins)) ? Math.max(0, Number(raw.rankWins)) : 0;
  const rankWinStreak = Number.isFinite(Number(raw.rankWinStreak)) ? Math.max(0, Number(raw.rankWinStreak)) : 0;
  const rankHistory: MatchRecord[] = Array.isArray(raw.rankHistory) ? raw.rankHistory : [];

  return {
    grammarProgress,
    vocabUnlockedDay: Number.isFinite(unlockedDay) ? Math.max(1, Math.min(26, unlockedDay)) : 1,
    vocabDayStars,
    vocabChapter2UnlockedDay,
    vocabChapter2DayStars,
    streakDays,
    lastStudyDate,
    hearts,
    lastHeartRefillTime,
    rankTier,
    rankLp,
    rankPromo,
    rankMatchesPlayed,
    rankWins,
    rankWinStreak,
    rankHistory,
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
    result.vocabChapter2UnlockedDay = Math.max(result.vocabChapter2UnlockedDay ?? 1, item.vocabChapter2UnlockedDay ?? 1);
    for (const [day, stars] of Object.entries(item.vocabChapter2DayStars ?? {})) {
      const numericDay = Number(day);
      if (Number.isFinite(numericDay)) {
        result.vocabChapter2DayStars = result.vocabChapter2DayStars || {};
        result.vocabChapter2DayStars[numericDay] = Math.max(result.vocabChapter2DayStars[numericDay] ?? 0, stars);
      }
    }
    result.streakDays = Math.max(result.streakDays, item.streakDays);
    if (item.lastStudyDate && (!result.lastStudyDate || item.lastStudyDate > result.lastStudyDate)) {
      result.lastStudyDate = item.lastStudyDate;
    }
    if (typeof item.hearts === 'number') {
      result.hearts = item.hearts;
    }
    if (typeof item.lastHeartRefillTime === 'number') {
      result.lastHeartRefillTime = item.lastHeartRefillTime;
    }
    // Merge rank: choose highest rank tier or higher LP
    const currentTierIdx = RANK_ORDER.indexOf(result.rankTier);
    const itemTierIdx = RANK_ORDER.indexOf(item.rankTier);
    if (itemTierIdx > currentTierIdx) {
      result.rankTier = item.rankTier;
      result.rankLp = item.rankLp;
      result.rankPromo = item.rankPromo;
    } else if (itemTierIdx === currentTierIdx) {
      result.rankLp = Math.max(result.rankLp, item.rankLp);
      if (item.rankPromo) result.rankPromo = item.rankPromo;
    }
    result.rankMatchesPlayed = Math.max(result.rankMatchesPlayed, item.rankMatchesPlayed);
    result.rankWins = Math.max(result.rankWins, item.rankWins);
    result.rankWinStreak = Math.max(result.rankWinStreak, item.rankWinStreak);
    if (item.rankHistory && item.rankHistory.length > 0) {
      const existingIds = new Set(result.rankHistory.map(h => h.id));
      const combined = [...result.rankHistory];
      for (const h of item.rankHistory) {
        if (!existingIds.has(h.id)) {
          combined.push(h);
        }
      }
      result.rankHistory = combined.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
    }
    return result;
  }, { ...DEFAULT_PROGRESS, grammarProgress: {}, vocabDayStars: {} });

  return merged;
}

function readGuestProgress(): LearningProgress {
  try {
    const grammar = localStorage.getItem(LEGACY_KEYS.grammar);
    const unlockedDay = localStorage.getItem(LEGACY_KEYS.unlockedDay);
    const dayStars = localStorage.getItem(LEGACY_KEYS.dayStars);
    const chapter2Unlocked = localStorage.getItem(LEGACY_KEYS.chapter2UnlockedDay);
    const chapter2Stars = localStorage.getItem(LEGACY_KEYS.chapter2DayStars);
    const streak = localStorage.getItem(LEGACY_KEYS.streak);
    const lastDate = localStorage.getItem(LEGACY_KEYS.lastStudyDate);
    const hearts = localStorage.getItem(LEGACY_KEYS.hearts);
    const refill = localStorage.getItem(LEGACY_KEYS.lastHeartRefillTime);
    const rankTier = localStorage.getItem(LEGACY_KEYS.rankTier) as RankTier | null;
    const rankLp = localStorage.getItem(LEGACY_KEYS.rankLp);
    const rankPromo = localStorage.getItem(LEGACY_KEYS.rankPromo);
    const rankMatches = localStorage.getItem(LEGACY_KEYS.rankMatches);
    const rankWins = localStorage.getItem(LEGACY_KEYS.rankWins);
    const rankStreak = localStorage.getItem(LEGACY_KEYS.rankStreak);
    const rankHistory = localStorage.getItem(LEGACY_KEYS.rankHistory);

    return normalizeProgress({
      grammarProgress: grammar ? JSON.parse(grammar) : {},
      vocabUnlockedDay: unlockedDay ? Number.parseInt(unlockedDay, 10) : 1,
      vocabDayStars: dayStars ? JSON.parse(dayStars) : {},
      vocabChapter2UnlockedDay: chapter2Unlocked ? Number.parseInt(chapter2Unlocked, 10) : 1,
      vocabChapter2DayStars: chapter2Stars ? JSON.parse(chapter2Stars) : {},
      streakDays: streak ? Number.parseInt(streak, 10) : 5,
      lastStudyDate: lastDate || '',
      hearts: hearts ? Number.parseInt(hearts, 10) : 3,
      lastHeartRefillTime: refill ? Number.parseInt(refill, 10) : Date.now(),
      rankTier: rankTier || 'BRONZE',
      rankLp: rankLp ? Number.parseInt(rankLp, 10) : 0,
      rankPromo: rankPromo ? JSON.parse(rankPromo) : null,
      rankMatchesPlayed: rankMatches ? Number.parseInt(rankMatches, 10) : 0,
      rankWins: rankWins ? Number.parseInt(rankWins, 10) : 0,
      rankWinStreak: rankStreak ? Number.parseInt(rankStreak, 10) : 0,
      rankHistory: rankHistory ? JSON.parse(rankHistory) : [],
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
    localStorage.setItem(LEGACY_KEYS.chapter2UnlockedDay, String(progress.vocabChapter2UnlockedDay ?? 1));
    localStorage.setItem(LEGACY_KEYS.chapter2DayStars, JSON.stringify(progress.vocabChapter2DayStars ?? {}));
    localStorage.setItem(LEGACY_KEYS.streak, String(progress.streakDays));
    localStorage.setItem(LEGACY_KEYS.lastStudyDate, progress.lastStudyDate);
    localStorage.setItem(LEGACY_KEYS.hearts, String(progress.hearts));
    localStorage.setItem(LEGACY_KEYS.lastHeartRefillTime, String(progress.lastHeartRefillTime));
    localStorage.setItem(LEGACY_KEYS.rankTier, progress.rankTier);
    localStorage.setItem(LEGACY_KEYS.rankLp, String(progress.rankLp));
    localStorage.setItem(LEGACY_KEYS.rankPromo, JSON.stringify(progress.rankPromo));
    localStorage.setItem(LEGACY_KEYS.rankMatches, String(progress.rankMatchesPlayed));
    localStorage.setItem(LEGACY_KEYS.rankWins, String(progress.rankWins));
    localStorage.setItem(LEGACY_KEYS.rankStreak, String(progress.rankWinStreak));
    localStorage.setItem(LEGACY_KEYS.rankHistory, JSON.stringify(progress.rankHistory));
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

  const saveVocabularyProgress = useCallback((unlockedDay: number, dayStars: Record<number, number>, chapter: 1 | 2 = 1) => {
    commitProgress(current => {
      const isChap2 = chapter === 2;
      const targetStars = isChap2 ? { ...(current.vocabChapter2DayStars || {}) } : { ...(current.vocabDayStars || {}) };

      for (const [day, stars] of Object.entries(dayStars)) {
        const numericDay = Number(day);
        if (Number.isFinite(numericDay)) {
          targetStars[numericDay] = Math.max(targetStars[numericDay] ?? 0, stars);
        }
      }

      if (isChap2) {
        return {
          ...current,
          vocabChapter2UnlockedDay: Math.max(current.vocabChapter2UnlockedDay ?? 1, unlockedDay),
          vocabChapter2DayStars: targetStars,
        };
      }

      return {
        ...current,
        vocabUnlockedDay: Math.max(current.vocabUnlockedDay, unlockedDay),
        vocabDayStars: targetStars,
      };
    });
  }, [commitProgress]);

  const recordStudyActivity = useCallback(() => {
    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    commitProgress(current => {
      if (current.lastStudyDate === today) {
        return current;
      }

      let nextStreak = current.streakDays;
      if (current.lastStudyDate === yesterday) {
        nextStreak = (current.streakDays || 0) + 1;
      } else if (!current.lastStudyDate) {
        nextStreak = Math.max(1, current.streakDays || 1);
      } else {
        // Missed at least one day
        nextStreak = 1;
      }

      return {
        ...current,
        streakDays: nextStreak,
        lastStudyDate: today,
      };
    });
  }, [commitProgress]);

  const loseHeart = useCallback(() => {
    let alive = true;
    commitProgress(current => {
      const nextHearts = Math.max(0, (current.hearts ?? 3) - 1);
      alive = nextHearts > 0;
      return {
        ...current,
        hearts: nextHearts,
        lastHeartRefillTime: current.hearts === 3 ? Date.now() : current.lastHeartRefillTime || Date.now(),
      };
    });
    return alive;
  }, [commitProgress]);

  const refillHearts = useCallback(() => {
    commitProgress(current => ({
      ...current,
      hearts: 3,
      lastHeartRefillTime: Date.now(),
    }));
  }, [commitProgress]);

  // Tự động hồi phục 1 tim mỗi 20 phút nếu chưa đầy 3 tim
  useEffect(() => {
    const checkRefill = () => {
      const cur = progressRef.current;
      if ((cur.hearts ?? 3) < 3) {
        const elapsed = Date.now() - (cur.lastHeartRefillTime || Date.now());
        const REFILL_MS = 20 * 60 * 1000;
        const heartsToAdd = Math.floor(elapsed / REFILL_MS);
        if (heartsToAdd > 0) {
          commitProgress(current => {
            const nextHearts = Math.min(3, (current.hearts ?? 0) + heartsToAdd);
            return {
              ...current,
              hearts: nextHearts,
              lastHeartRefillTime: nextHearts === 3 ? Date.now() : (current.lastHeartRefillTime || Date.now()) + heartsToAdd * REFILL_MS,
            };
          });
        }
      }
    };

    checkRefill();
    const interval = setInterval(checkRefill, 60000);
    return () => clearInterval(interval);
  }, [commitProgress]);

  const saveRankMatchResult = useCallback((match: {
    tier: RankTier;
    score: number;
    total: number;
    accuracy: number;
    isWin: boolean;
  }) => {
    let finalLpChange = 0;
    let finalNewTier = match.tier;
    let finalNewLp = 0;
    let finalPromo: PromoSeries | null = null;
    let isPromoted = false;
    let isDemoted = false;

    commitProgress(current => {
      const curTier = current.rankTier || 'BRONZE';
      const curLp = current.rankLp ?? 0;
      const curPromo = current.rankPromo ? { ...current.rankPromo } : null;
      const curStreak = match.isWin ? (current.rankWinStreak ?? 0) + 1 : 0;
      const tierIdx = RANK_ORDER.indexOf(curTier);

      if (curPromo && curPromo.active) {
        // In Bo3 Promo Series!
        if (match.isWin) {
          curPromo.wins += 1;
        } else {
          curPromo.losses += 1;
        }

        if (curPromo.wins >= 2) {
          // PROMOTION SUCCESS!
          isPromoted = true;
          finalNewTier = curPromo.targetTier;
          finalNewLp = 0;
          finalPromo = null;
          finalLpChange = 0;
        } else if (curPromo.losses >= 2) {
          // PROMOTION FAILED
          finalNewTier = curTier;
          finalNewLp = 75; // reset to 75 LP
          finalPromo = null;
          finalLpChange = -25;
        } else {
          // Promo series ongoing
          finalNewTier = curTier;
          finalNewLp = 100;
          finalPromo = curPromo;
          finalLpChange = 0;
        }
      } else {
        // Normal Match LP calculation
        if (match.isWin) {
          const streakBonus = Math.min((current.rankWinStreak ?? 0) * 2, 8);
          let baseLp = 40 + streakBonus;
          if (curTier === 'BRONZE') baseLp = 40 + streakBonus;
          else if (curTier === 'SILVER') baseLp = 35 + streakBonus;
          else if (curTier === 'GOLD') baseLp = 28 + streakBonus;
          else if (curTier === 'PLATINUM') baseLp = 24 + streakBonus;
          else if (curTier === 'DIAMOND') baseLp = 20 + streakBonus;
          else baseLp = 18 + streakBonus;
          finalLpChange = baseLp;

          const nextLp = curLp + baseLp;
          if (nextLp >= 100) {
            if (tierIdx < RANK_ORDER.length - 1) {
              // Enter Bo3 Promo Series!
              finalNewTier = curTier;
              finalNewLp = 100;
              finalPromo = {
                active: true,
                wins: 0,
                losses: 0,
                targetTier: RANK_ORDER[tierIdx + 1]
              };
            } else {
              finalNewTier = curTier;
              finalNewLp = 100;
              finalPromo = null;
            }
          } else {
            finalNewTier = curTier;
            finalNewLp = nextLp;
            finalPromo = null;
          }
        } else {
          // Loss Penalty
          let lossPenalty = -5;
          if (curTier === 'BRONZE') lossPenalty = -5;
          else if (curTier === 'SILVER') lossPenalty = -8;
          else if (curTier === 'GOLD') lossPenalty = -14;
          else if (curTier === 'PLATINUM') lossPenalty = -16;
          else if (curTier === 'DIAMOND') lossPenalty = -18;
          else lossPenalty = -20;
          finalLpChange = lossPenalty;

          finalNewTier = curTier;
          finalNewLp = Math.max(0, curLp + lossPenalty);
          finalPromo = null;
        }
      }

      const newRecord: MatchRecord = {
        id: `match_${Date.now()}`,
        timestamp: Date.now(),
        tier: curTier,
        score: match.score,
        total: match.total,
        accuracy: match.accuracy,
        lpChange: finalLpChange,
        isWin: match.isWin,
        isPromoMatch: !!(current.rankPromo?.active)
      };

      const updatedHistory = [newRecord, ...(current.rankHistory || [])].slice(0, 20);

      return {
        ...current,
        rankTier: finalNewTier,
        rankLp: finalNewLp,
        rankPromo: finalPromo,
        rankMatchesPlayed: (current.rankMatchesPlayed ?? 0) + 1,
        rankWins: (current.rankWins ?? 0) + (match.isWin ? 1 : 0),
        rankWinStreak: curStreak,
        rankHistory: updatedHistory,
      };
    });

    return {
      lpChange: finalLpChange,
      newTier: finalNewTier,
      newLp: finalNewLp,
      promoSeries: finalPromo,
      isPromoted,
      isDemoted,
    };
  }, [commitProgress]);

  const value: ProgressContextValue = {
    user,
    progress,
    authLoading,
    syncStatus,
    authError,
    firebaseConfigured,
    streakDays: progress.streakDays ?? 5,
    lastStudyDate: progress.lastStudyDate ?? '',
    hearts: progress.hearts ?? 3,
    rankTier: progress.rankTier || 'BRONZE',
    rankLp: progress.rankLp ?? 0,
    rankPromo: progress.rankPromo || null,
    rankMatchesPlayed: progress.rankMatchesPlayed ?? 0,
    rankWins: progress.rankWins ?? 0,
    rankWinStreak: progress.rankWinStreak ?? 0,
    rankHistory: progress.rankHistory || [],
    signInWithEmail,
    signInWithGoogle,
    signInWithGoogleRedirect,
    createEmailAccount,
    sendPasswordReset,
    signOut,
    clearAuthError: () => setAuthError(null),
    saveGrammarScore,
    saveVocabularyProgress,
    recordStudyActivity,
    loseHeart,
    refillHearts,
    saveRankMatchResult,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export function useLearningProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useLearningProgress must be used inside ProgressProvider');
  return context;
}
