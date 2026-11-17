import React, { useState, useEffect } from 'react';
import { FloatingTrollfaces } from './components/FloatingTrollfaces';
import { Navbar } from './components/Navbar';
import { TitleScreen } from './components/TitleScreen';
import { MenuScreen } from './components/MenuScreen';
import { VocabGameMap } from './components/VocabGameMap';
import { ReviewSurvivalScreen } from './components/ReviewSurvivalScreen';
import { GrammarScreen } from './components/GrammarScreen';
import { ToeicExamScreen } from './components/ToeicExamScreen';
import { TestSelectScreen } from './components/TestSelectScreen';
import { RankedExamScreen } from './components/RankedExamScreen';
import { ToeicSpeakingScreen } from './components/ToeicSpeakingScreen';
import { ToeicWritingScreen } from './components/ToeicWritingScreen';
import { LofiPlayer } from './components/LofiPlayer';
import { AccountModal } from './components/AccountModal';
import { StreakModal } from './components/StreakModal';
import { HeartsModal } from './components/HeartsModal';
import { initialVocabList, initialTest, VocabItem, ToeicTest } from './data/initialData';
import { sounds } from './utils/soundEffects';
import { useLearningProgress } from './contexts/ProgressContext';

type ScreenState = 'TITLE' | 'MENU' | 'LEARN' | 'GRAMMAR' | 'REVIEW' | 'SELECT_TEST' | 'EXAM' | 'RANKED' | 'SPEAKING' | 'WRITING';

export function App() {
  const {
    user,
    authLoading,
    syncStatus,
    authError,
    streakDays,
    lastStudyDate,
    studyDates,
    hearts,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOut,
    clearAuthError,
    refillHearts,
  } = useLearningProgress();
  const [screen, setScreen] = useState<ScreenState>('TITLE');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nickname, setNickname] = useState('Mập địch');
  const [vocabList, setVocabList] = useState<VocabItem[]>(initialVocabList);
  const [vocabChapter, setVocabChapter] = useState<1 | 2>(1);
  const [currentTest, setCurrentTest] = useState<ToeicTest>(initialTest);
  const [loadingTest, setLoadingTest] = useState(false);
  const [isLofiOpen, setIsLofiOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isHeartsModalOpen, setIsHeartsModalOpen] = useState(false);
  const [selectedSwTestId, setSelectedSwTestId] = useState<string | undefined>(undefined);


  // Chỉ tự động vào MENU nếu người dùng vừa hoàn tất đăng nhập bằng Google Redirect
  useEffect(() => {
    if (user) {
      try {
        if (sessionStorage.getItem('ing_signing_in_redirect') === '1') {
          sessionStorage.removeItem('ing_signing_in_redirect');
          sounds.playCorrect();
          setScreen('MENU');
        }
      } catch {}
    }
  }, [user]);

  // Sync with NoSQL Backend or static fallback for Vercel deployment
  useEffect(() => {
    // 1. Fetch profile
    fetch('/api/profile')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Not JSON');
        return res.json();
      })
      .then(data => {
        if (data.success && data.data) {
          if (data.data.nickname) setNickname(data.data.nickname);
        }
      })
      .catch(() => {
        // Fallback to static public data
        fetch('/data/profile.json')
          .then(res => res.json())
          .then(data => {
            if (data && data.nickname) setNickname(data.nickname);
          })
          .catch(() => {});
      });

    // 2. Fetch vocabularies
    fetch('/api/vocab')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Not JSON');
        return res.json();
      })
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setVocabList(data.data);
        }
      })
      .catch(() => {
        fetch('/data/vocabularies.json')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              setVocabList(data);
            }
          })
          .catch(() => {});
      });
  }, []);

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  const handleSelectTest = (testId: string) => {
    setLoadingTest(true);

    const loadFromStatic = () => {
      // 1. Try direct test JSON from public/data/tests/{testId}.json
      fetch(`/data/tests/${testId}.json`)
        .then(res => {
          if (!res.ok) throw new Error('Static test file not found');
          return res.json();
        })
        .then(testData => {
          if (testData && testData.questions && testData.questions.length > 0) {
            setCurrentTest(testData);
            setScreen('EXAM');
          } else {
            throw new Error('Invalid test data');
          }
        })
        .catch(() => {
          // 2. Try looking up inside public/data/tests.json
          fetch('/data/tests.json')
            .then(res => res.json())
            .then(allTests => {
              const found = allTests.find((t: any) => t._id === testId || t.code === testId);
              if (found) {
                setCurrentTest(found);
                setScreen('EXAM');
              } else {
                setCurrentTest(initialTest);
                setScreen('EXAM');
              }
            })
            .catch(() => {
              setCurrentTest(initialTest);
              setScreen('EXAM');
            });
        })
        .finally(() => {
          setLoadingTest(false);
        });
    };

    // Try fullstack Express server first
    fetch(`/api/tests/${testId}`)
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Not JSON');
        return res.json();
      })
      .then(data => {
        if (data.success && data.data) {
          setCurrentTest(data.data);
          setScreen('EXAM');
          setLoadingTest(false);
        } else {
          loadFromStatic();
        }
      })
      .catch(() => {
        loadFromStatic();
      });
  };

  return (
    <div className="min-h-screen bg-neoBg text-neoDark relative font-comic overflow-x-hidden">
      {/* Background Interactive Floating Trollfaces */}
      {screen !== 'EXAM' && <FloatingTrollfaces />}

      {/* Persistent Navbar */}
      {screen !== 'TITLE' && (
        <Navbar
          onGoHome={() => setScreen('TITLE')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          nickname={nickname}
          streakDays={streakDays}
          hearts={hearts}
          onOpenStreak={() => setIsStreakModalOpen(true)}
          onOpenHearts={() => setIsHeartsModalOpen(true)}
          onToggleLofi={() => setIsLofiOpen(!isLofiOpen)}
          isLofiOpen={isLofiOpen}
          user={user}
          authLoading={authLoading}
          syncStatus={syncStatus}
          onOpenAccount={() => setIsAccountModalOpen(true)}
          onSignOut={() => { void signOut(); }}
        />
      )}

      {authError && !isAccountModalOpen && (
        <div role="alert" className="fixed top-3 right-3 z-50 max-w-sm bg-white border-2 border-black shadow-neo px-4 py-3 text-sm font-bold flex items-start gap-3">
          <span>{authError}</span>
          <button onClick={clearAuthError} className="shrink-0 underline" aria-label="Đóng thông báo">Đóng</button>
        </div>
      )}

      {/* Screen Router */}
      <main className="relative z-10">
        {screen === 'TITLE' && (
          <TitleScreen
            nickname={nickname}
            onStart={() => setScreen('MENU')}
            user={user}
            authLoading={authLoading}
            syncStatus={syncStatus}
            authError={authError}
            onOpenAccount={() => setIsAccountModalOpen(true)}
            onSignOut={() => { void signOut(); }}
            onGoogleSignIn={async () => {
              const success = await signInWithGoogle();
              if (success) {
                sounds.playCorrect();
                setScreen('MENU');
              }
              return success;
            }}
            onGoogleRedirectSignIn={signInWithGoogleRedirect}
          />
        )}

        {screen === 'MENU' && (
          <MenuScreen
            nickname={nickname}
            user={user}
            syncStatus={syncStatus}
            onOpenAccount={() => setIsAccountModalOpen(true)}
            onSelectMode={(mode, chapter, testId) => {
              if (chapter) {
                setVocabChapter(chapter);
              }
              setSelectedSwTestId(testId);
              if (mode === 'EXAM') {
                setScreen('SELECT_TEST');
              } else if (mode === 'RANKED') {
                setScreen('RANKED');
              } else {
                setScreen(mode);
              }
            }}
            onBack={() => setScreen('TITLE')}
          />
        )}

        {screen === 'LEARN' && (
          <VocabGameMap
            onBack={() => setScreen('MENU')}
            nickname={nickname}
            initialChapter={vocabChapter}
          />
        )}

        {screen === 'GRAMMAR' && (
          <GrammarScreen
            onBack={() => setScreen('MENU')}
            nickname={nickname}
          />
        )}

        {screen === 'REVIEW' && (
          <ReviewSurvivalScreen
            vocabList={vocabList}
            onBack={() => setScreen('MENU')}
            nickname={nickname}
          />
        )}

        {screen === 'SELECT_TEST' && (
          <TestSelectScreen
            onSelectTest={handleSelectTest}
            onBack={() => setScreen('MENU')}
            nickname={nickname}
            onGoToRanked={() => setScreen('RANKED')}
          />
        )}

        {screen === 'EXAM' && (
          <ToeicExamScreen
            test={currentTest}
            onBack={() => setScreen('SELECT_TEST')}
            nickname={nickname}
          />
        )}

        {screen === 'RANKED' && (
          <RankedExamScreen
            onBack={() => setScreen('MENU')}
            nickname={nickname}
          />
        )}

        {screen === 'SPEAKING' && (
          <ToeicSpeakingScreen
            onBack={() => setScreen('MENU')}
            nickname={nickname}
            initialTestId={selectedSwTestId}
          />
        )}

        {screen === 'WRITING' && (
          <ToeicWritingScreen
            onBack={() => setScreen('MENU')}
            nickname={nickname}
            initialTestId={selectedSwTestId}
          />
        )}
      </main>

      {/* Tiny bottom footer watermark */}
      <footer className="relative z-10 py-3 text-center text-xs font-bold text-gray-500 border-t border-black/10 mt-10">
        © 2026 Ing Lịch Tét • Dành trọn tình yêu & tiếng cười cho Nóc Nhà
      </footer>

      {/* Persistent Background Lofi Chill Music Player */}
      <LofiPlayer
        nickname={nickname}
        isOpen={isLofiOpen}
        onToggleOpen={() => setIsLofiOpen(!isLofiOpen)}
      />

      {isAccountModalOpen && (
        <AccountModal
          onClose={() => setIsAccountModalOpen(false)}
          onSuccess={() => {
            sounds.playCorrect();
            if (screen === 'TITLE') {
              setScreen('MENU');
            }
          }}
        />
      )}

      {/* Streak Details Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakDays={streakDays}
        lastStudyDate={lastStudyDate}
        studyDates={studyDates}
        nickname={nickname}
        onStartLearning={() => {
          setIsStreakModalOpen(false);
          setScreen('LEARN');
        }}
      />

      {/* Hearts / Lives Modal */}
      <HeartsModal
        isOpen={isHeartsModalOpen}
        onClose={() => setIsHeartsModalOpen(false)}
        hearts={hearts}
        nickname={nickname}
        onRefillHearts={refillHearts}
      />
    </div>
  );
}

export default App;
