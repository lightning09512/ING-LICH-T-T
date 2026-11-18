import React, { useState, useEffect } from 'react';
import { VocabItem } from '../data/initialData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Heart, Timer, ArrowLeft, RefreshCw, Trophy, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';
import { useLearningProgress } from '../contexts/ProgressContext';
import { DoodleCheck, DoodleTrophy, MascotSticker } from './DoodleIcons';

interface ReviewSurvivalScreenProps {
  vocabList: VocabItem[];
  onBack: () => void;
  nickname: string;
}

interface QuizItem {
  vocab: VocabItem;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const ReviewSurvivalScreen: React.FC<ReviewSurvivalScreenProps> = ({
  vocabList,
  onBack,
  nickname
}) => {
  const { recordStudyActivity, loseHeart } = useLearningProgress();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [roastMessage, setRoastMessage] = useState<string | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  // Generate 5-10 random multiple choice questions from vocab list
  const initGame = () => {
    const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
    const generated: QuizItem[] = shuffled.slice(0, 8).map(v => {
      // 3 unique wrong distractors with distinct meanings
      const otherMeanings = Array.from(
        new Set(vocabList.map(w => w.meaning).filter(m => m && m.trim() !== v.meaning.trim()))
      );
      const wrong = otherMeanings.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [...wrong, v.meaning].sort(() => 0.5 - Math.random());

      return {
        vocab: v,
        question: `Từ "${v.word.toUpperCase()}" (${v.ipa}) có nghĩa là gì?`,
        options,
        correctAnswer: v.meaning
      };
    });

    setQuizzes(generated);
    setCurrentIndex(0);
    setHearts(3);
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setGameWon(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setRoastMessage(null);
  };

  useEffect(() => {
    initGame();
  }, [vocabList]);

  // Countdown timer
  useEffect(() => {
    if (gameOver || gameWon || isAnswered || quizzes.length === 0) return;

    if (timeLeft <= 0) {
      handleWrong("Hết thời gian 15s rồi! Chậm chạp thế hả Mập địch?");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, gameWon, isAnswered, quizzes]);

  const handleWrong = (msg?: string) => {
    sounds.playWrong();
    setIsAnswered(true);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);

    const roasts = [
      "Ủa alo? Học hành thế đấy à Mập địch?",
      "Chọn bừa đúng không? Bắt quả tang nhé!",
      "Trừ 1 ly trà sữa trân châu đường đen!",
      "Nhìn Trollface cười chưa? Mau học lại đi!",
      "Từ này vừa học xong mà cũng quên được, chịu luôn!"
    ];
    setRoastMessage(msg || roasts[Math.floor(Math.random() * roasts.length)]);

    const newHearts = hearts - 1;
    setHearts(newHearts);
    loseHeart();

    if (newHearts <= 0) {
      setTimeout(() => {
        setGameOver(true);
      }, 1500);
    }
  };

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuiz = quizzes[currentIndex];
    if (option === currentQuiz.correctAnswer) {
      sounds.playCorrect();
      setScore(score + 100);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      handleWrong();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setRoastMessage(null);
    } else {
      sounds.playVictory();
      setGameWon(true);
      recordStudyActivity();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  if (quizzes.length === 0) return null;
  const currentQuiz = quizzes[currentIndex];

  return (
    <div className={`relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => { sounds.playClick(); onBack(); }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-100 min-h-[38px]"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        {/* Hearts HP Bar */}
        <div className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white border-2 sm:border-3 border-black shadow-neo-sm min-h-[38px]">
          {[1, 2, 3].map(h => (
            <Heart
              key={h}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                h <= hearts ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-300 fill-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 border-2 sm:border-3 border-black font-black font-mono shadow-neo-sm min-h-[38px] text-xs sm:text-base ${
          timeLeft <= 5 ? 'bg-red-400 text-white animate-pulse' : 'bg-neoYellow'
        }`}>
          <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* GAME OVER MODAL */}
      {gameOver ? (
        <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-8 text-center shadow-neo sm:shadow-neo-lg flex flex-col items-center gap-4 sm:gap-6 animate-bounceSlow">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 border-3 border-black rounded-2xl flex items-center justify-center shadow-neo-sm">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-red-600 font-heading uppercase leading-tight">
            GAME OVER RỒI MẬP ĐỊCH!
          </h2>
          <p className="font-bold text-gray-700 text-sm sm:text-base max-w-md">
            Hết 3 tim rồi! Cần phải vào mục "Học bài" ôn lại ngay và luôn, không thì đừng mơ đòi đi ăn lẩu nhé!
          </p>
          <div className="px-4 sm:px-6 py-2 bg-neoPink text-white border-2 border-black font-black text-xs sm:text-sm">
            Điểm số đạt được: {score} điểm
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 mt-2 w-full sm:w-auto">
            <button
              onClick={() => { sounds.playClick(); initGame(); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-neoGreen border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" /> Thử Thách Lại
            </button>
            <button
              onClick={() => { sounds.playClick(); onBack(); }}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo hover:bg-gray-100"
            >
              Về Menu
            </button>
          </div>
        </div>
      ) : gameWon ? (
        /* GAME WON MODAL */
        <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-8 text-center shadow-neo sm:shadow-neo-lg flex flex-col items-center gap-4 sm:gap-5">
          <MascotSticker src="/doodles/mascot-victory.png" alt="Mèo nâng cúp" size={104} className="w-24 h-24 sm:w-28 sm:h-28" />
          <h2 className="text-2xl sm:text-4xl font-black text-emerald-600 font-heading uppercase leading-tight">
            XUẤT SẮC QUÁ {nickname}!
          </h2>
          <p className="font-bold text-gray-700 text-sm sm:text-base max-w-md">
            Bạn đã sống sót qua toàn bộ câu hỏi và bảo toàn được mạng sống! Xứng danh Nóc nhà quyền lực!
          </p>
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-neoYellow border-2 sm:border-3 border-black font-black text-base sm:text-xl shadow-neo-sm inline-flex items-center gap-2">
            <DoodleTrophy size={22} />
            <span>Tổng điểm: {score} Điểm</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 mt-2 w-full sm:w-auto">
            <button
              onClick={() => { sounds.playClick(); initGame(); }}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-neoGreen border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo"
            >
              Chơi Lại Trận Nữa
            </button>
            <button
              onClick={() => { sounds.playClick(); onBack(); }}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo"
            >
              Về Menu
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ CARD */
        <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-neo-lg flex flex-col gap-6">
          {/* Question Index */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-neoCyan border-2 border-black font-black text-xs uppercase">
              Câu {currentIndex + 1} / {quizzes.length}
            </span>
            <span className="font-bold text-sm text-gray-600">
              Điểm: <strong className="text-black font-black">{score}</strong>
            </span>
          </div>

          {/* Question text */}
          <div className="bg-yellow-50 border-3 border-black p-5 text-center">
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-black">
              {currentQuiz.question}
            </h3>
            <p className="text-sm font-comic text-gray-600 italic mt-2">
              "{currentQuiz.vocab.exampleEn}"
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQuiz.correctAnswer;
              
              let btnClass = "bg-white hover:bg-yellow-50 border-3 border-black";
              if (isAnswered) {
                if (isCorrect) btnClass = "bg-neoGreen border-3 border-black text-black font-black";
                else if (isSelected) btnClass = "bg-red-300 border-3 border-black text-black font-black line-through";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left font-bold text-base shadow-neo-sm transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <DoodleCheck size={18} />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-700 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Roast popup if wrong */}
          {roastMessage && (
            <div className="bg-red-50 border-3 border-red-500 p-4 flex items-center gap-3 animate-wiggle">
              <img src="/trollface.png" alt="Troll" className="w-10 h-10 object-contain" />
              <p className="font-black text-red-600 text-sm">
                {roastMessage}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && hearts > 0 && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-neoYellow border-3 border-black font-black text-lg uppercase shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              {currentIndex + 1 < quizzes.length ? (
                <>
                  <span>Câu Tiếp Theo</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <DoodleTrophy size={22} />
                  <span>Xem Tổng Kết</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
