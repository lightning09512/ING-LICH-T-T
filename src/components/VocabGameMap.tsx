import React, { useState, useEffect } from 'react';
import { getDayData, getCumulativeWords, VocabWord, DayLesson } from '../data/vocabDays';
import { sounds } from '../utils/soundEffects';
import { useLearningProgress } from '../contexts/ProgressContext';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Lock, Star, Volume2, RotateCcw, ArrowRight, 
  CheckCircle2, AlertCircle, Trophy, Sparkles, BookOpen, List, Play,
  Maximize, Minimize
} from 'lucide-react';

interface VocabGameMapProps {
  onBack: () => void;
  nickname: string;
}

type VocabView = 'MAP' | 'STUDY' | 'QUIZ';

interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
}

export const VocabGameMap: React.FC<VocabGameMapProps> = ({ onBack, nickname }) => {
  const [chapter, setChapter] = useState<1 | 2>(1);
  const [view, setView] = useState<VocabView>('MAP');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const { progress, saveVocabularyProgress, recordStudyActivity, loseHeart } = useLearningProgress();

  const isChap2 = chapter === 2;
  const maxDay = isChap2 ? 13 : 26;
  const unlockedDay = isChap2
    ? (progress.vocabChapter2UnlockedDay ?? 1)
    : (progress.vocabUnlockedDay ?? 1);
  const dayStars = isChap2
    ? (progress.vocabChapter2DayStars ?? {})
    : (progress.vocabDayStars ?? {});
  
  // Flashcard state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAllWordsModal, setShowAllWordsModal] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [index: number]: string }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [shakeDay, setShakeDay] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSelectDay = (day: number) => {
    if (day > unlockedDay) {
      sounds.playWrong();
      setShakeDay(day);
      setTimeout(() => setShakeDay(null), 500);
      return;
    }
    sounds.playClick();
    setSelectedDay(day);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setView('STUDY');
  };

  const currentLesson: DayLesson | null = getDayData(selectedDay, chapter);
  const currentWord: VocabWord | undefined = currentLesson?.words[flashcardIndex];

  useEffect(() => {
    if (view === 'STUDY' && currentWord?.word) sounds.prefetchEnglish(currentWord.word);
  }, [view, currentWord?.word]);

  useEffect(() => {
    const currentQuizWord = quizQuestions[quizIndex]?.word.word;
    if (view === 'QUIZ' && currentQuizWord) sounds.prefetchEnglish(currentQuizWord);
  }, [view, quizIndex, quizQuestions]);

  // Touch Swipe for Flashcard
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && currentLesson && flashcardIndex < currentLesson.words.length - 1) {
      sounds.playClick();
      setFlashcardIndex(flashcardIndex + 1);
      setIsFlipped(false);
    } else if (diff < -50 && flashcardIndex > 0) {
      sounds.playClick();
      setFlashcardIndex(flashcardIndex - 1);
      setIsFlipped(false);
    }
    setTouchStartX(null);
  };

  // Start Cumulative Quiz for selectedDay: 20 words from current lesson + 10 random words from past lessons
  const startQuiz = () => {
    sounds.playClick();
    const currentDayWords = currentLesson?.words || [];

    // Get all words strictly from previous lessons (Day 1 up to Day selectedDay - 1)
    const pastDaysPool = selectedDay > 1 ? getCumulativeWords(selectedDay - 1, chapter) : [];

    // Filter out words that share the same word text with current day
    const currentWordSet = new Set(currentDayWords.map(w => w.word.trim().toLowerCase()));
    const pastWords = pastDaysPool.filter(w => !currentWordSet.has(w.word.trim().toLowerCase()));

    // Shuffle current day words and past words
    const shuffledCurrent = [...currentDayWords].sort(() => 0.5 - Math.random());
    const shuffledPast = [...pastWords].sort(() => 0.5 - Math.random());

    // 1. Pick 20 words from current day's lesson (or all if lesson has fewer than 20)
    const currentPickCount = Math.min(20, shuffledCurrent.length);
    const currentPicked = shuffledCurrent.slice(0, currentPickCount);

    // 2. Pick 10 random words from previous lessons (or more if current day has < 20, aiming for 30 questions)
    const neededPast = selectedDay > 1 ? Math.max(10, 30 - currentPickCount) : 0;
    const pastPickCount = Math.min(neededPast, shuffledPast.length);
    const pastPicked = shuffledPast.slice(0, pastPickCount);

    // Combine: 20 current + 10 past (for Day 1: 20 questions; Day 2+: exactly 30 questions)
    const targetWords: VocabWord[] = [...currentPicked, ...pastPicked];

    // Shuffle all target words so current and past questions appear randomly mixed
    const finalWords = targetWords.sort(() => 0.5 - Math.random());

    // Generate 4 multiple choices for each from cumulative pool
    const cumulativePool = getCumulativeWords(selectedDay, chapter);
    const allMeanings = Array.from(new Set(cumulativePool.map(w => w.meaning)));

    const generated: QuizQuestion[] = finalWords.map(word => {
      const wrong = allMeanings
        .filter(m => m !== word.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [...wrong, word.meaning].sort(() => 0.5 - Math.random());

      return {
        word,
        options,
        correctAnswer: word.meaning
      };
    });

    setQuizQuestions(generated);
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizFinished(false);
    setView('QUIZ');
  };

  // Handle quiz option select
  const handleSelectQuizAnswer = (option: string) => {
    sounds.playClick();
    setQuizAnswers(prev => ({ ...prev, [quizIndex]: option }));
  };

  // Finish Quiz and Calculate Score
  const handleFinishQuiz = () => {
    const total = quizQuestions.length;
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 80;

    if (passed) {
      sounds.playVictory();
      recordStudyActivity();
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

      let stars = 1;
      if (percent === 100) stars = 3;
      else if (percent >= 90) stars = 2;

      const newStars = { ...dayStars, [selectedDay]: Math.max(dayStars[selectedDay] || 0, stars) };

      const nextUnlocked = Math.max(unlockedDay, Math.min(maxDay, selectedDay + 1));
      saveVocabularyProgress(nextUnlocked, newStars, chapter);
    } else {
      sounds.playWrong();
      loseHeart();
    }

    setQuizFinished(true);
  };

  const totalEarnedStars = Object.values(dayStars).reduce((a, b) => a + b, 0);

  // ==================== 1. ANGRY BIRDS MAP VIEW ====================
  if (view === 'MAP') {
    return (
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" /> Về Menu
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {/* Fullscreen Button - Hidden on small mobile */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-neoYellow border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:bg-yellow-300 min-h-[40px] cursor-pointer"
              title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Full màn hình"}</span>
            </button>

            {/* Stars counter */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-neoYellow border-2 sm:border-3 border-black font-black text-xs sm:text-sm shadow-neo-sm min-h-[40px]">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 animate-spin" />
              <span>{totalEarnedStars} / {maxDay * 3} ⭐</span>
            </div>

            {/* Unlocked status */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-neoGreen border-2 sm:border-3 border-black font-black shadow-neo-sm text-xs sm:text-sm min-h-[40px] flex items-center">
              Đã mở: {unlockedDay}/{maxDay} Màn
            </div>
          </div>
        </div>

        {/* Chapter Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => {
              if (chapter !== 1) {
                sounds.playClick();
                setChapter(1);
                setSelectedDay(1);
              }
            }}
            className={`w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo transition-all cursor-pointer ${
              chapter === 1
                ? 'bg-neoYellow -translate-y-0.5 sm:-translate-y-1 shadow-neo sm:shadow-neo-lg ring-2 ring-black text-black'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            📘 Chương 1: 26 Ngày Cơ Bản (Day 1 - 26)
          </button>

          <button
            onClick={() => {
              if (chapter !== 2) {
                sounds.playClick();
                setChapter(2);
                setSelectedDay(1);
              }
            }}
            className={`w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo transition-all cursor-pointer relative ${
              chapter === 2
                ? 'bg-neoCyan -translate-y-0.5 sm:-translate-y-1 shadow-neo sm:shadow-neo-lg ring-2 ring-black text-black'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="absolute -top-2.5 -right-1 sm:-top-3 sm:-right-2 bg-neoPink text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 border border-black rotate-12 shadow-neo-sm">
              MỚI 🔥
            </span>
            🚀 Chương 2: ETS 2019 & New Economy (13 Bài)
          </button>
        </div>

        {/* Title Banner */}
        <div className="text-center mb-5 sm:mb-8">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-neoPink text-white border-2 border-black font-black text-[11px] sm:text-xs uppercase shadow-neo-sm rotate-[-2deg]">
            {isChap2 ? 'BỘ TỪ VỰNG ETS 2019 & NEW ECONOMY' : 'BẢN ĐỒ 26 NGÀY TOEIC CĂN BẢN'}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 font-heading leading-tight">
            {isChap2 ? 'Từ Vựng Sát Đề Thi Thật (13 Bài)' : 'Vượt Màn Học Từ Vựng (Day 1 - 26)'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1 max-w-lg mx-auto">
            {isChap2
              ? `Bộ từ vựng trọng điểm trích trực tiếp từ đề ETS 2019 và New Economy! Mỗi bài test gồm 20 từ bài đó + 10 câu ngẫu nhiên dồn từ các bài trước!`
              : `Học flashcard rồi làm bài test để mở khóa màn tiếp theo! Mỗi bài test gồm 20 từ bài hiện tại + 10 câu ngẫu nhiên từ các bài trước!`}
          </p>
        </div>

        {/* ANGRY BIRDS STAGE GRID */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5 sm:gap-4 md:gap-5 bg-white border-3 sm:border-4 border-black p-3.5 sm:p-6 md:p-8 shadow-neo sm:shadow-neo-lg rounded-2xl relative">
          {Array.from({ length: maxDay }, (_, i) => i + 1).map(day => {
            const isUnlocked = day <= unlockedDay;
            const isCompleted = (dayStars[day] || 0) > 0;
            const stars = dayStars[day] || 0;
            const isCurrent = day === unlockedDay;
            const isShaking = shakeDay === day;
            const lessonInfo = getDayData(day, chapter);

            return (
              <div
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl border-3 sm:border-4 border-black transition-all cursor-pointer select-none group min-h-[96px] sm:min-h-[110px] ${
                  isShaking ? 'animate-shake' : ''
                } ${
                  isCompleted
                    ? 'bg-neoGreen shadow-neo hover:-translate-y-1'
                    : isCurrent
                    ? 'bg-neoYellow shadow-neo sm:shadow-neo-lg animate-bounceSlow'
                    : isUnlocked
                    ? 'bg-neoCyan shadow-neo hover:-translate-y-1'
                    : 'bg-gray-200 border-gray-500 opacity-60 cursor-not-allowed shadow-none'
                }`}
              >
                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <div className="flex flex-col items-center text-center w-full px-1">
                    <span className="text-xl sm:text-3xl font-black font-heading text-black leading-tight">
                      {day}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-gray-800 line-clamp-1 w-full truncate mt-0.5">
                      {isChap2 ? (lessonInfo?.title.replace(' ETS 2019', '') || `Bài ${day}`) : `Bài ${day}`}
                    </span>
                    {isChap2 && lessonInfo && (
                      <span className="text-[9px] font-bold text-gray-600">
                        {lessonInfo.totalWords} từ
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    <span className="text-[10px] font-bold">Khóa</span>
                  </div>
                )}

                {/* Stars Indicator */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-gray-300 fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Current Stage Indicator */}
                {isCurrent && !isCompleted && (
                  <div className="absolute -top-3 -right-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black border border-black rounded-full uppercase animate-pulse">
                    Mới!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Hint */}
        <div className="mt-6 text-center text-xs sm:text-sm font-bold text-gray-600 bg-amber-50 border-2 border-dashed border-black p-3">
          {isChap2
            ? `💡 Mẹo Chương 2: Mỗi bài test gồm 20 từ mới + 10 câu ôn tập ngẫu nhiên từ các bài trước để nhớ sâu từ vựng nha ${nickname}!`
            : `💡 Mẹo: Mỗi bài test gồm 20 từ của bài hiện tại + 10 câu ngẫu nhiên từ các bài trước giúp ${nickname} không bao giờ bị quên từ cũ!`}
        </div>
      </div>
    );
  }

  // ==================== 2. FLASHCARD STUDY VIEW ====================
  if (view === 'STUDY' && currentLesson && currentWord) {
    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => { sounds.playClick(); setView('MAP'); }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:bg-gray-100 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Bản Đồ Màn
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {/* Fullscreen Button - Hidden on small screens */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neoYellow border-2 border-black font-black text-xs shadow-neo-sm hover:bg-yellow-300 min-h-[38px] cursor-pointer"
              title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Full màn hình"}</span>
            </button>

            <span className="px-2.5 sm:px-4 py-1 sm:py-1.5 bg-neoPurple border-2 sm:border-3 border-black font-black text-xs sm:text-sm shadow-neo-sm uppercase">
              {currentLesson.title} ({currentLesson.totalWords} từ)
            </span>

            <button
              onClick={() => setShowAllWordsModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-100 min-h-[38px]"
            >
              <List className="w-4 h-4" /> <span className="hidden xs:inline">Xem</span> tất cả từ
            </button>
          </div>
        </div>

        {/* Flashcard Component */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => { sounds.playClick(); setIsFlipped(!isFlipped); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-xl md:max-w-2xl min-h-[380px] sm:min-h-[420px] md:min-h-[460px] bg-white border-3 sm:border-4 border-black p-4 sm:p-7 md:p-10 shadow-neo sm:shadow-neo-lg cursor-pointer select-none transition-all hover:-translate-y-1 relative flex flex-col justify-between"
          >
            {/* Top Card Info */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 sm:px-3 py-1 bg-neoCyan border-2 border-black text-[10px] sm:text-xs font-black uppercase shadow-neo-sm">
                {currentLesson.title} • #{currentWord.id}
              </span>

              {/* Phần phát âm lên góc phải */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-bold text-gray-500">
                  {flashcardIndex + 1} / {currentLesson.words.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    sounds.speakEnglish(currentWord.word);
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neoYellow border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 transition-all group cursor-pointer min-h-[36px]"
                  title="Phát âm từ vựng (giọng Mỹ chuẩn)"
                >
                  <Volume2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
                  <span>Phát âm</span>
                </button>
              </div>
            </div>

            {/* Card Content */}
            {!isFlipped ? (
              /* Front: English Word + IPA + Câu minh họa */
              <div className="my-auto py-4 sm:py-8 text-center flex flex-col items-center gap-2.5 sm:gap-4 w-full">
                <h2 
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    sounds.speakEnglish(currentWord.word);
                  }}
                  className="text-3xl sm:text-5xl md:text-6xl font-black font-heading text-black tracking-wide cursor-pointer hover:text-indigo-800 transition-colors"
                  title="Nhấn để nghe phát âm từ"
                >
                  {currentWord.word}
                </h2>

                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  {currentWord.ipa && (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        sounds.speakEnglish(currentWord.word);
                      }}
                      className="text-base sm:text-xl md:text-2xl font-mono font-bold text-gray-700 bg-yellow-100/90 px-3 sm:px-4 py-1 sm:py-1.5 border-2 border-black rounded-lg shadow-neo-sm cursor-pointer hover:bg-yellow-200 transition-all"
                      title="Phiên âm IPA (nhấn để nghe)"
                    >
                      {currentWord.ipa}
                    </span>
                  )}
                  {currentWord.partOfSpeech && (
                    <span 
                      className="text-xs sm:text-base font-black px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neoCyan text-black border-2 border-black rounded-lg shadow-neo-sm"
                      title="Từ loại"
                    >
                      {currentWord.partOfSpeech}
                    </span>
                  )}
                </div>

                {/* Phần câu minh họa ngữ cảnh */}
                {currentWord.exampleEn ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-neoYellow border-2 sm:border-3 border-black px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-neo-sm text-left mt-2 flex items-center justify-between gap-2.5 sm:gap-3 transition-all"
                  >
                    <p className="font-bold text-xs sm:text-base text-black leading-snug flex-1">
                      "{currentWord.exampleEn}"
                    </p>

                    {/* Nút nghe đọc câu ví dụ */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        sounds.speakEnglish(currentWord.exampleEn!);
                      }}
                      className="p-1.5 sm:p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 shrink-0 group transition-all"
                      title="Nghe đọc câu ví dụ"
                    >
                      <Volume2 className="w-4 h-4 text-black group-hover:scale-125 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-lg bg-yellow-50 border-2 border-dashed border-gray-400 p-2.5 rounded-xl text-xs text-gray-500 font-bold mt-2">
                    Đang nạp câu minh họa...
                  </div>
                )}

                {/* Hướng dẫn lật thẻ */}
                <p className="text-[11px] sm:text-sm text-gray-400 font-bold mt-1 sm:mt-2">
                  (Chạm để xem nghĩa)
                </p>
              </div>
            ) : (
              /* Back: Vietnamese Definition + Illustration Image on BACK */
              <div className="my-auto py-3 sm:py-4 text-center flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 bg-neoPink text-white border-2 border-black uppercase">
                    Ý NGHĨA TIẾNG VIỆT
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-emerald-700 font-heading">
                  {currentWord.meaning}
                </h3>

                {/* Illustration Image on Back Side */}
                {currentWord.imageUrl && (
                  <div className="w-40 h-28 sm:w-64 sm:h-44 border-2 sm:border-3 border-black bg-white rounded-xl overflow-hidden shadow-neo flex items-center justify-center p-1.5 sm:p-2 my-1 hover:scale-105 transition-transform">
                    <img
                      src={currentWord.imageUrl}
                      alt={currentWord.word}
                      className="max-w-full max-h-full object-contain rounded"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <p className="text-[11px] sm:text-xs text-gray-400 font-bold mt-1">
                  (Chạm để lật lại mặt tiếng Anh)
                </p>
              </div>
            )}

            {/* Bottom Card Navigation Tip */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-gray-500 pt-2.5 sm:pt-3 border-t-2 border-dashed border-gray-300">
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Chạm lật thẻ
              </span>
              <span className="text-pink-600 font-bold truncate ml-2">
                Đạt 80% test mới qua màn nhé {nickname}!
              </span>
            </div>
          </div>

          {/* Flashcard Next/Prev Controls */}
          <div className="w-full max-w-xl md:max-w-2xl flex items-center gap-2.5 sm:gap-4 mt-4 sm:mt-6">
            <button
              disabled={flashcardIndex === 0}
              onClick={() => {
                sounds.playClick();
                setFlashcardIndex(flashcardIndex - 1);
                setIsFlipped(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100 disabled:opacity-40 min-h-[44px] sm:min-h-[48px] active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Từ trước
            </button>

            <button
              disabled={flashcardIndex === currentLesson.words.length - 1}
              onClick={() => {
                sounds.playClick();
                setFlashcardIndex(flashcardIndex + 1);
                setIsFlipped(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-neoYellow border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-yellow-300 disabled:opacity-40 min-h-[44px] sm:min-h-[48px] active:scale-95 transition-all"
            >
              Từ sau <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* BIG CTA BUTTON: GO TO QUIZ */}
          <div className="w-full max-w-xl md:max-w-2xl mt-6 sm:mt-8">
            <button
              onClick={startQuiz}
              className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-neoPink text-white border-3 sm:border-4 border-black text-sm sm:text-lg md:text-xl font-black font-heading uppercase shadow-neo sm:shadow-neo-lg hover:bg-pink-600 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 sm:gap-3 group min-h-[54px] sm:min-h-[60px]"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white group-hover:scale-125 transition-transform" />
              <span>Làm Bài Test Bài {selectedDay} Mở Màn</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            </button>
            <p className="text-center text-[11px] sm:text-xs font-bold text-gray-500 mt-1.5 sm:mt-2">
              {selectedDay === 1
                ? `(Bài test gồm 20 câu hỏi trọng tâm của Bài 1)`
                : `(Bài test gồm 20 từ trọng tâm Bài ${selectedDay} + 10 câu ngẫu nhiên từ các bài trước)`}
            </p>
          </div>
        </div>

        {/* MODAL: VIEW ALL WORDS */}
        {showAllWordsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white border-4 border-black p-6 shadow-neo-lg flex flex-col gap-4 max-h-[85vh]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <h3 className="font-heading font-black text-xl uppercase">
                  Tất Cả Từ Vựng {currentLesson.title} ({currentLesson.words.length} từ)
                </h3>
                <button
                  onClick={() => setShowAllWordsModal(false)}
                  className="w-8 h-8 bg-neoPink text-white border-2 border-black font-black flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh] flex flex-col gap-2 p-1">
                {currentLesson.words.map((w, idx) => (
                  <div
                    key={w.id}
                    className="p-3 bg-yellow-50/70 border-2 border-black flex items-center justify-between gap-3 shadow-neo-sm"
                  >
                    <div className="flex items-center gap-3">
                      {w.imageUrl ? (
                        <div className="w-12 h-12 border-2 border-black rounded bg-white p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={w.imageUrl} alt={w.word} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-base font-black text-black">{w.word}</strong>
                          {w.ipa && (
                            <span className="text-xs font-mono font-bold text-gray-600 bg-yellow-100 px-1.5 py-0.5 border border-black rounded">
                              {w.ipa}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-emerald-800">{w.meaning}</p>
                        {w.exampleEn && (
                          <p className="text-xs text-gray-700 font-medium italic mt-0.5">
                            "{w.exampleEn}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => { sounds.playClick(); sounds.speakEnglish(w.word); }}
                      className="p-2 border-2 border-black bg-white hover:bg-yellow-100 rounded shadow-neo-sm"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4 text-black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== 3. CUMULATIVE QUIZ TESTING VIEW ====================
  if (view === 'QUIZ' && quizQuestions.length > 0) {
    const currentQ = quizQuestions[quizIndex];
    const totalQ = quizQuestions.length;
    const answeredCount = Object.keys(quizAnswers).length;

    // Calculate score if finished
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correctCount++;
    });
    const percent = Math.round((correctCount / totalQ) * 100);
    const passed = percent >= 80;

    return (
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { sounds.playClick(); setView('STUDY'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" /> Về Học Bài
          </button>

          <div className="px-4 py-1.5 bg-neoPurple border-2 border-black font-black text-xs uppercase shadow-neo-sm">
            {selectedDay === 1
              ? `Bài Test Bài 1 (20 câu)`
              : `Bài Test Bài ${selectedDay} (30 câu: 20 từ bài này + 10 từ dồn)`}
          </div>

          <span className="font-bold text-xs text-gray-600">
            Câu {quizIndex + 1} / {totalQ}
          </span>
        </div>

        {/* RESULTS SCREEN */}
        {quizFinished ? (
          <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-8 text-center shadow-neo sm:shadow-neo-lg flex flex-col items-center gap-4 sm:gap-6 animate-bounceSlow">
            {passed ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-3 border-black rounded-2xl flex items-center justify-center shadow-neo-sm">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 animate-bounce" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 border-3 border-black rounded-2xl flex items-center justify-center shadow-neo-sm">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600 animate-pulse" />
              </div>
            )}

            {passed ? (
              <>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-current animate-bounce" />
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-emerald-600 font-heading uppercase">
                  QUA MÀN THÀNH CÔNG!
                </h2>

                <p className="font-bold text-gray-700 text-sm sm:text-base max-w-md">
                  Xuất sắc quá {nickname}! Đạt <strong>{correctCount}/{totalQ} câu ({percent}%)</strong>. Bài tiếp theo đã được mở khóa trên bản đồ!
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 mt-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (selectedDay < maxDay) {
                        setSelectedDay(selectedDay + 1);
                        setFlashcardIndex(0);
                        setIsFlipped(false);
                        setView('STUDY');
                      } else {
                        setView('MAP');
                      }
                    }}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-neoGreen border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-emerald-300 active:scale-95"
                  >
                    Học Tiếp Bài {selectedDay + 1} 👉
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setView('MAP'); }}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100 active:scale-95"
                  >
                    Về Bản Đồ
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-4xl font-black text-red-600 font-heading uppercase">
                  TRƯỢT RỒI MẬP ĐỊCH ƠI!
                </h2>

                <p className="font-bold text-gray-700 text-sm sm:text-base max-w-md">
                  Chỉ đúng được <strong>{correctCount}/{totalQ} câu ({percent}%)</strong> thôi! Phải đạt tối thiểu <strong>80%</strong> mới được mở khóa Bài tiếp theo!
                </p>

                <div className="p-3 bg-red-100 border-2 border-black font-bold text-xs text-red-800">
                  ⚠️ Phạt: Mau vào ôn lại flashcard rồi thi lại ngay, không được lười biếng!
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 mt-2 w-full sm:w-auto">
                  <button
                    onClick={startQuiz}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-neoYellow border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-yellow-300 active:scale-95"
                  >
                    Thi Lại Ngay ⚡
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setView('STUDY'); }}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100 active:scale-95"
                  >
                    Ôn Lại Flashcard
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* QUESTION CARD */
          <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-neo-lg flex flex-col gap-6">
            {/* Word Banner with Audio button */}
            <div className="bg-yellow-50 border-3 border-black p-5 text-center flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Từ vựng tiếng Anh
              </span>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-black">
                {currentQ.word.word}
              </h3>
              {currentQ.word.ipa && (
                <span className="text-base sm:text-lg font-mono font-bold text-gray-600 bg-white px-3 py-0.5 border border-black rounded shadow-neo-sm">
                  {currentQ.word.ipa}
                </span>
              )}
              <button
                onClick={() => { sounds.playClick(); sounds.speakEnglish(currentQ.word.word); }}
                className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-neoYellow border-2 border-black text-xs font-black shadow-neo-sm hover:bg-yellow-300"
              >
                <Volume2 className="w-4 h-4" /> Nghe phát âm
              </button>
            </div>

            <p className="text-sm font-bold text-gray-700 text-center">
              Chọn nghĩa tiếng Việt chính xác nhất:
            </p>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = quizAnswers[quizIndex] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizAnswer(opt)}
                    className={`w-full p-4 text-left font-bold text-base sm:text-lg border-3 border-black transition-all flex items-center justify-between min-h-[56px] ${
                      isSelected
                        ? 'bg-neoYellow shadow-neo -translate-y-0.5'
                        : 'bg-white hover:bg-gray-50 shadow-neo-sm'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <span className="text-black font-black">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Quiz Navigation */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-black">
              <button
                disabled={quizIndex === 0}
                onClick={() => { sounds.playClick(); setQuizIndex(quizIndex - 1); }}
                className="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase disabled:opacity-40 hover:bg-gray-100"
              >
                ← Câu trước
              </button>

              {quizIndex + 1 < totalQ ? (
                <button
                  disabled={!quizAnswers[quizIndex]}
                  onClick={() => { sounds.playClick(); setQuizIndex(quizIndex + 1); }}
                  className="px-6 py-2.5 bg-neoYellow border-2 border-black font-black text-xs uppercase disabled:opacity-40 hover:bg-yellow-300 shadow-neo-sm"
                >
                  Câu tiếp →
                </button>
              ) : (
                <button
                  disabled={answeredCount < totalQ}
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 bg-neoPink text-white border-2 border-black font-black text-xs uppercase disabled:opacity-40 hover:bg-pink-600 shadow-neo-sm"
                >
                  Nộp Bài Chấm Điểm 🏆
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
