import React, { useState, useEffect } from 'react';
import { getDayData, getCumulativeWords, VocabWord, DayLesson } from '../data/vocabDays';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Lock, Star, Volume2, RotateCcw, ArrowRight, 
  CheckCircle2, AlertCircle, Trophy, Sparkles, BookOpen, List, Play
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
  const [view, setView] = useState<VocabView>('MAP');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [unlockedDay, setUnlockedDay] = useState<number>(1);
  const [dayStars, setDayStars] = useState<{ [day: number]: number }>({});
  
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

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('ing_lich_unlocked_day');
      if (savedUnlocked) {
        setUnlockedDay(Math.max(1, parseInt(savedUnlocked, 10)));
      }
      const savedStars = localStorage.getItem('ing_lich_day_stars');
      if (savedStars) {
        setDayStars(JSON.parse(savedStars));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save progress
  const saveProgress = (newUnlocked: number, starsUpdate: { [day: number]: number }) => {
    try {
      localStorage.setItem('ing_lich_unlocked_day', newUnlocked.toString());
      localStorage.setItem('ing_lich_day_stars', JSON.stringify(starsUpdate));
    } catch (e) {
      console.error(e);
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

  const currentLesson: DayLesson | null = getDayData(selectedDay);
  const currentWord: VocabWord | undefined = currentLesson?.words[flashcardIndex];

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

  // Start Cumulative Quiz for selectedDay
  const startQuiz = () => {
    sounds.playClick();
    const cumulativePool = getCumulativeWords(selectedDay);
    const currentDayWords = currentLesson?.words || [];

    // Calculate number of questions: Day 1: 10, scales up to 25
    const questionCount = Math.min(25, 10 + Math.floor(selectedDay * 0.7));

    // Sample half from today, half from past days (if available)
    const shuffledCurrent = [...currentDayWords].sort(() => 0.5 - Math.random());
    const pastWords = cumulativePool.filter(w => !currentDayWords.some(cw => cw.id === w.id));
    const shuffledPast = [...pastWords].sort(() => 0.5 - Math.random());

    const targetWords: VocabWord[] = [];
    const currentPickCount = Math.min(shuffledCurrent.length, Math.ceil(questionCount * 0.6));
    targetWords.push(...shuffledCurrent.slice(0, currentPickCount));

    const pastPickCount = questionCount - targetWords.length;
    if (shuffledPast.length > 0) {
      targetWords.push(...shuffledPast.slice(0, pastPickCount));
    } else {
      targetWords.push(...shuffledCurrent.slice(currentPickCount, questionCount));
    }

    // Shuffle final target words
    const finalWords = targetWords.sort(() => 0.5 - Math.random());

    // Generate 4 multiple choices for each
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
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

      let stars = 1;
      if (percent === 100) stars = 3;
      else if (percent >= 90) stars = 2;

      const newStars = { ...dayStars, [selectedDay]: Math.max(dayStars[selectedDay] || 0, stars) };
      setDayStars(newStars);

      const nextUnlocked = Math.max(unlockedDay, Math.min(26, selectedDay + 1));
      setUnlockedDay(nextUnlocked);
      saveProgress(nextUnlocked, newStars);
    } else {
      sounds.playWrong();
    }

    setQuizFinished(true);
  };

  const totalEarnedStars = Object.values(dayStars).reduce((a, b) => a + b, 0);

  // ==================== 1. ANGRY BIRDS MAP VIEW ====================
  if (view === 'MAP') {
    return (
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-3 border-black font-black text-sm uppercase shadow-neo-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" /> Về Menu
          </button>

          <div className="flex items-center gap-3">
            {/* Stars counter */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-neoYellow border-3 border-black font-black shadow-neo-sm">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-spin" />
              <span>{totalEarnedStars} / 78 ⭐</span>
            </div>

            {/* Unlocked status */}
            <div className="px-4 py-2 bg-neoGreen border-3 border-black font-black shadow-neo-sm text-sm">
              Đã mở: {unlockedDay} / 26 Màn
            </div>
          </div>
        </div>

        {/* Title Banner */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 bg-neoPink text-white border-2 border-black font-black text-xs uppercase shadow-neo-sm rotate-[-2deg]">
            BẢN ĐỒ CHINH PHỤC TOEIC
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 font-heading">
            Vượt Màn Học Từ Vựng (Day 1 - 26)
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-1 max-w-lg mx-auto">
            Học flashcard rồi làm bài test để mở khóa màn tiếp theo! Bài kiểm tra sẽ dồn từ của tất cả các bài trước đó để {nickname} không bao giờ bị quên từ!
          </p>
        </div>

        {/* ANGRY BIRDS STAGE GRID (26 Levels) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6 bg-white border-4 border-black p-6 sm:p-8 shadow-neo-lg rounded-2xl relative">
          {Array.from({ length: 26 }, (_, i) => i + 1).map(day => {
            const isUnlocked = day <= unlockedDay;
            const isCompleted = (dayStars[day] || 0) > 0;
            const stars = dayStars[day] || 0;
            const isCurrent = day === unlockedDay;
            const isShaking = shakeDay === day;

            return (
              <div
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-4 border-black transition-all cursor-pointer select-none group min-h-[105px] ${
                  isShaking ? 'animate-shake' : ''
                } ${
                  isCompleted
                    ? 'bg-neoGreen shadow-neo hover:-translate-y-1'
                    : isCurrent
                    ? 'bg-neoYellow shadow-neo-lg animate-bounceSlow'
                    : isUnlocked
                    ? 'bg-neoCyan shadow-neo hover:-translate-y-1'
                    : 'bg-gray-200 border-gray-500 opacity-60 cursor-not-allowed shadow-none'
                }`}
              >
                {/* Level Number or Lock */}
                {isUnlocked ? (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black font-heading text-black">
                      {day}
                    </span>
                    <span className="text-[10px] font-black uppercase text-gray-800 -mt-1">
                      Bài {day}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <Lock className="w-7 h-7 text-gray-600" />
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

        {/* Bottom Troll Hint */}
        <div className="mt-6 text-center text-xs sm:text-sm font-bold text-gray-600 bg-amber-50 border-2 border-dashed border-black p-3">
          💡 Mẹo: Ở các bài sau (ví dụ Bài 15), bài kiểm tra sẽ bao gồm cả từ của Bài 1 đến Bài 15. Hãy học thật kỹ trước khi ấn làm test nha {nickname}!
        </div>
      </div>
    );
  }

  // ==================== 2. FLASHCARD STUDY VIEW ====================
  if (view === 'STUDY' && currentLesson && currentWord) {
    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => { sounds.playClick(); setView('MAP'); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Bản Đồ Màn
          </button>

          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-neoPurple border-3 border-black font-black text-sm shadow-neo-sm uppercase">
              {currentLesson.title} ({currentLesson.totalWords} từ vựng)
            </span>

            <button
              onClick={() => setShowAllWordsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-100"
            >
              <List className="w-4 h-4" /> Xem tất cả từ
            </button>
          </div>
        </div>

        {/* Flashcard Component */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => { sounds.playClick(); setIsFlipped(!isFlipped); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-xl md:max-w-2xl min-h-[380px] bg-white border-4 border-black p-8 md:p-10 shadow-neo-lg cursor-pointer select-none transition-all hover:-translate-y-1 relative flex flex-col justify-between"
          >
            {/* Top Card Info */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-neoCyan border-2 border-black text-xs font-black uppercase">
                {currentLesson.title} • Từ #{currentWord.id}
              </span>
              <span className="text-xs font-bold text-gray-500">
                {flashcardIndex + 1} / {currentLesson.words.length}
              </span>
            </div>

            {/* Card Content */}
            {!isFlipped ? (
              /* Front: English Word + IPA + Speaker */
              <div className="my-auto py-8 text-center flex flex-col items-center gap-3">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-black tracking-wide">
                  {currentWord.word}
                </h2>

                {currentWord.ipa && (
                  <span className="text-lg sm:text-2xl font-mono font-bold text-gray-700 bg-yellow-100/90 px-4 py-1 border-2 border-black rounded-lg shadow-neo-sm">
                    {currentWord.ipa}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    sounds.speakEnglish(currentWord.word);
                  }}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-neoYellow border-3 border-black font-black text-sm uppercase shadow-neo-sm hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 group min-h-[44px]"
                >
                  <Volume2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  <span>Phát âm giọng Mỹ chuẩn</span>
                </button>

                <p className="text-xs text-gray-400 font-bold mt-2">
                  (Chạm vào thẻ để xem nghĩa tiếng Việt • Vuốt ngang để chuyển từ)
                </p>
              </div>
            ) : (
              /* Back: Vietnamese Definition */
              <div className="my-auto py-8 text-center flex flex-col items-center gap-4">
                <span className="text-xs font-bold px-3 py-1 bg-neoPink text-white border-2 border-black uppercase">
                  Ý NGHĨA TIẾNG VIỆT
                </span>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-700 font-heading">
                  {currentWord.meaning}
                </h3>

                <p className="text-xs text-gray-400 font-bold mt-3">
                  (Chạm để lật lại mặt tiếng Anh)
                </p>
              </div>
            )}

            {/* Bottom Card Navigation Tip */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-3 border-t-2 border-dashed border-gray-300">
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Chạm để lật thẻ
              </span>
              <span className="text-pink-600 font-bold">
                Cố lên {nickname}! Đạt 80% test mới qua màn nhé!
              </span>
            </div>
          </div>

          {/* Flashcard Next/Prev Controls */}
          <div className="flex items-center gap-3 sm:gap-4 mt-6">
            <button
              disabled={flashcardIndex === 0}
              onClick={() => {
                sounds.playClick();
                setFlashcardIndex(flashcardIndex - 1);
                setIsFlipped(false);
              }}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-white border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100 disabled:opacity-40 min-h-[48px]"
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
              className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-neoYellow border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-yellow-300 disabled:opacity-40 min-h-[48px]"
            >
              Từ sau <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* BIG CTA BUTTON: GO TO QUIZ */}
          <div className="w-full max-w-xl mt-8">
            <button
              onClick={startQuiz}
              className="w-full py-4 px-6 bg-neoPink text-white border-4 border-black text-lg sm:text-xl font-black font-heading uppercase shadow-neo-lg hover:bg-pink-600 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group min-h-[60px]"
            >
              <Play className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
              <span>Vào Làm Bài Test Bài {selectedDay} Để Mở Khóa Màn Sau</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </button>
            <p className="text-center text-xs font-bold text-gray-500 mt-2">
              (Bài test sẽ gồm các từ của Bài {selectedDay} + dồn từ của các bài trước đó)
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
                      <span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
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
            Bài Test Vượt Màn {selectedDay} (Dồn Bài 1 → {selectedDay})
          </div>

          <span className="font-bold text-xs text-gray-600">
            Câu {quizIndex + 1} / {totalQ}
          </span>
        </div>

        {/* RESULTS SCREEN */}
        {quizFinished ? (
          <div className="bg-white border-4 border-black p-8 text-center shadow-neo-lg flex flex-col items-center gap-6 animate-bounceSlow">
            <img src="/trollface.png" alt="Troll" className="w-20 h-20 object-contain animate-wiggle" />

            {passed ? (
              <>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-8 h-8 fill-current" />
                  <Star className="w-10 h-10 fill-current animate-bounce" />
                  <Star className="w-8 h-8 fill-current" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-emerald-600 font-heading uppercase">
                  QUA MÀN THÀNH CÔNG!
                </h2>

                <p className="font-bold text-gray-700 text-base max-w-md">
                  Xuất sắc quá {nickname}! Đạt <strong>{correctCount}/{totalQ} câu ({percent}%)</strong>. Bài tiếp theo đã được mở khóa trên bản đồ!
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (selectedDay < 26) {
                        setSelectedDay(selectedDay + 1);
                        setFlashcardIndex(0);
                        setIsFlipped(false);
                        setView('STUDY');
                      } else {
                        setView('MAP');
                      }
                    }}
                    className="px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300"
                  >
                    Học Tiếp Bài {selectedDay + 1} 👉
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setView('MAP'); }}
                    className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100"
                  >
                    Về Bản Đồ
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-black text-red-600 font-heading uppercase">
                  TRƯỢT RỒI MẬP ĐỊCH ƠI!
                </h2>

                <p className="font-bold text-gray-700 text-base max-w-md">
                  Chỉ đúng được <strong>{correctCount}/{totalQ} câu ({percent}%)</strong> thôi! Phải đạt tối thiểu <strong>80%</strong> mới được mở khóa Bài tiếp theo!
                </p>

                <div className="p-3 bg-red-100 border-2 border-black font-bold text-xs text-red-800">
                  ⚠️ Phạt: Mau vào ôn lại flashcard rồi thi lại ngay, không được lười biếng!
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 bg-neoYellow border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-yellow-300"
                  >
                    Thi Lại Ngay ⚡
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); setView('STUDY'); }}
                    className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100"
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
            <div className="bg-yellow-50 border-3 border-black p-6 text-center flex flex-col items-center gap-2">
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
