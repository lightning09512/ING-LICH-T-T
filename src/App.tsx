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
import { initialVocabList, initialTest, VocabItem, ToeicTest } from './data/initialData';
import { sounds } from './utils/soundEffects';

type ScreenState = 'TITLE' | 'MENU' | 'LEARN' | 'GRAMMAR' | 'REVIEW' | 'SELECT_TEST' | 'EXAM';

export function App() {
  const [screen, setScreen] = useState<ScreenState>('TITLE');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nickname, setNickname] = useState('Mập địch');
  const [streakDays, setStreakDays] = useState(5);
  const [vocabList, setVocabList] = useState<VocabItem[]>(initialVocabList);
  const [currentTest, setCurrentTest] = useState<ToeicTest>(initialTest);
  const [loadingTest, setLoadingTest] = useState(false);

  // Sync with NoSQL Backend if available
  useEffect(() => {
    // Fetch profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.nickname) setNickname(data.data.nickname);
          if (data.data.streakDays) setStreakDays(data.data.streakDays);
        }
      })
      .catch(() => {});

    // Fetch vocabularies from NoSQL
    fetch('/api/vocab')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setVocabList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  const handleSelectTest = (testId: string) => {
    setLoadingTest(true);
    fetch(`/api/tests/${testId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCurrentTest(data.data);
          setScreen('EXAM');
        } else {
          alert('Không thể tải đề thi này!');
        }
      })
      .catch(err => {
        console.error('Fetch test detail error:', err);
        alert('Lỗi kết nối khi tải đề thi!');
      })
      .finally(() => {
        setLoadingTest(false);
      });
  };

  return (
    <div className="min-h-screen bg-neoBg text-neoDark relative font-comic overflow-x-hidden">
      {/* Background Interactive Floating Trollfaces */}
      <FloatingTrollfaces />

      {/* Persistent Navbar */}
      {screen !== 'TITLE' && (
        <Navbar
          onGoHome={() => setScreen('TITLE')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          nickname={nickname}
          streakDays={streakDays}
        />
      )}

      {/* Screen Router */}
      <main className="relative z-10">
        {screen === 'TITLE' && (
          <TitleScreen
            nickname={nickname}
            onStart={() => setScreen('MENU')}
          />
        )}

        {screen === 'MENU' && (
          <MenuScreen
            nickname={nickname}
            onSelectMode={(mode) => {
              if (mode === 'EXAM') {
                setScreen('SELECT_TEST');
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
          />
        )}

        {screen === 'EXAM' && (
          <ToeicExamScreen
            test={currentTest}
            onBack={() => setScreen('SELECT_TEST')}
            nickname={nickname}
          />
        )}
      </main>

      {/* Tiny bottom footer watermark */}
      <footer className="relative z-10 py-3 text-center text-xs font-bold text-gray-500 border-t border-black/10 mt-10">
        © 2026 Ing Lịch Tét • Dành trọn tình yêu & tiếng cười cho Nóc Nhà
      </footer>
    </div>
  );
}

export default App;
