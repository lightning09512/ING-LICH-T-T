import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface AccountUser {
  id: string;
  username: string;
}

export interface LearningProgress {
  grammarProgress: Record<string, number>;
  vocabUnlockedDay: number;
  vocabDayStars: Record<number, number>;
}

export type SyncStatus = 'local' | 'syncing' | 'saved' | 'error';

interface ProgressContextValue {
  user: AccountUser | null;
  progress: LearningProgress;
  authLoading: boolean;
  syncStatus: SyncStatus;
  authError: string | null;
  signInWithUsername: (username: string, password: string) => Promise<boolean>;
  createUsernameAccount: (username: string, password: string) => Promise<boolean>;
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
  if (!value || typeof value !== 'object') return { ...DEFAULT_PROGRESS, grammarProgress: {}, vocabDayStars: {} };
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
  return items.map(normalizeProgress).reduce<LearningProgress>((result, item) => {
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
    return { ...DEFAULT_PROGRESS, grammarProgress: {}, vocabDayStars: {} };
  }
}

function readUserCache(userId: string): LearningProgress | null {
  try {
    const saved = localStorage.getItem(`ing_progress_${userId}`);
    return saved ? normalizeProgress(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

function writeLocalProgress(progress: LearningProgress, userId: string | null) {
  try {
    if (userId) {
      localStorage.setItem(`ing_progress_${userId}`, JSON.stringify(progress));
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
    // Ignore storage restrictions; account progress is cached separately.
  }
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return await response.json() as Record<string, unknown>;
  } catch {
    return {};
  }
}

function responseMessage(data: Record<string, unknown>, fallback: string): string {
  return typeof data.message === 'string' ? data.message : fallback;
}

export const ProgressProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(readGuestProgress);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [authError, setAuthError] = useState<string | null>(null);
  const progressRef = useRef(progress);
  const guestProgressRef = useRef(progress);
  const userRef = useRef<AccountUser | null>(null);
  const authRequestRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const syncUserProgress = useCallback(async (activeUser: AccountUser, requestId: number) => {
    const cachedProgress = readUserCache(activeUser.id);
    const initialProgress = mergeProgress(cachedProgress ?? DEFAULT_PROGRESS, guestProgressRef.current);
    progressRef.current = initialProgress;
    setProgress(initialProgress);
    setSyncStatus('syncing');

    try {
      const response = await fetch('/api/progress', { credentials: 'same-origin', cache: 'no-store' });
      const result = await readJson(response);
      if (requestId !== authRequestRef.current) return false;
      if (!response.ok || !result.success) throw new Error(responseMessage(result, 'Không tải được tiến trình từ máy chủ.'));

      const remoteProgress = normalizeProgress(result.data);
      const merged = mergeProgress(remoteProgress, readUserCache(activeUser.id) ?? initialProgress, guestProgressRef.current);
      const saveResponse = await fetch('/api/progress', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
      const saveResult = await readJson(saveResponse);
      if (requestId !== authRequestRef.current) return false;
      if (!saveResponse.ok || !saveResult.success) throw new Error(responseMessage(saveResult, 'Không lưu được tiến trình lên máy chủ.'));

      progressRef.current = merged;
      setProgress(merged);
      writeLocalProgress(merged, activeUser.id);
      clearGuestProgress();
      guestProgressRef.current = { ...DEFAULT_PROGRESS, grammarProgress: {}, vocabDayStars: {} };
      setSyncStatus('saved');
      setAuthError(null);
      return true;
    } catch (error) {
      if (requestId !== authRequestRef.current) return false;
      console.error('Could not sync learning progress:', error);
      setSyncStatus('error');
      setAuthError(error instanceof Error ? error.message : 'Không đồng bộ được tiến trình.');
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++authRequestRef.current;

    void (async () => {
      try {
        const response = await fetch('/api/auth', { credentials: 'same-origin', cache: 'no-store' });
        const result = await readJson(response);
        if (cancelled) return;
        if (response.ok && result.success && result.user && typeof result.user === 'object') {
          const activeUser = result.user as AccountUser;
          userRef.current = activeUser;
          setUser(activeUser);
          await syncUserProgress(activeUser, requestId);
        }
      } catch {
        // Keep local progress available when the online SQL database is not configured.
      } finally {
        if (!cancelled && requestId === authRequestRef.current) setAuthLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [syncUserProgress]);

  const runAccountAction = useCallback(async (action: 'login' | 'register', username: string, password: string) => {
    setAuthError(null);
    setAuthLoading(true);
    setSyncStatus('syncing');
    const requestId = ++authRequestRef.current;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username, password }),
      });
      const result = await readJson(response);
      if (!response.ok || !result.success || !result.user || typeof result.user !== 'object') {
        throw new Error(responseMessage(result, 'Không đăng nhập được. Hãy thử lại.'));
      }

      const activeUser = result.user as AccountUser;
      userRef.current = activeUser;
      setUser(activeUser);
      return await syncUserProgress(activeUser, requestId);
    } catch (error) {
      if (requestId === authRequestRef.current) {
        setSyncStatus(userRef.current ? 'error' : 'local');
        setAuthError(error instanceof Error ? error.message : 'Không đăng nhập được. Hãy thử lại.');
      }
      return false;
    } finally {
      if (requestId === authRequestRef.current) setAuthLoading(false);
    }
  }, [syncUserProgress]);

  const signInWithUsername = useCallback((username: string, password: string) => (
    runAccountAction('login', username, password)
  ), [runAccountAction]);

  const createUsernameAccount = useCallback((username: string, password: string) => (
    runAccountAction('register', username, password)
  ), [runAccountAction]);

  const signOut = useCallback(async () => {
    setAuthError(null);
    const requestId = ++authRequestRef.current;
    setAuthLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      const result = await readJson(response);
      if (!response.ok || !result.success) throw new Error(responseMessage(result, 'Không đăng xuất được.'));
      userRef.current = null;
      setUser(null);
      progressRef.current = guestProgressRef.current;
      setProgress(guestProgressRef.current);
      setSyncStatus('local');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Không đăng xuất được.');
    } finally {
      if (requestId === authRequestRef.current) setAuthLoading(false);
    }
  }, []);

  const commitProgress = useCallback((update: (current: LearningProgress) => LearningProgress) => {
    const next = normalizeProgress(update(progressRef.current));
    progressRef.current = next;
    setProgress(next);

    const activeUser = userRef.current;
    writeLocalProgress(next, activeUser?.id ?? null);
    if (!activeUser) {
      guestProgressRef.current = next;
      setSyncStatus('local');
      return;
    }

    const requestId = authRequestRef.current;
    setSyncStatus('syncing');
    void fetch('/api/progress', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).then(async response => {
      const result = await readJson(response);
      if (!response.ok || !result.success) throw new Error(responseMessage(result, 'Không lưu được tiến trình.'));
      if (requestId !== authRequestRef.current) return;
      setSyncStatus('saved');
      setAuthError(null);
    }).catch(error => {
      if (requestId !== authRequestRef.current) return;
      console.error('Could not save learning progress:', error);
      setSyncStatus('error');
      setAuthError(error instanceof Error ? error.message : 'Không lưu được tiến trình.');
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
    signInWithUsername,
    createUsernameAccount,
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
