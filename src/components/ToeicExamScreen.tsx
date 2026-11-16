import React, { useState, useEffect } from 'react';
import { ToeicTest, ToeicQuestion } from '../data/initialData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, RotateCcw, FastForward, Flag, CheckCircle, 
  HelpCircle, Clock, Volume2, ArrowLeft, Send, Sparkles, BookOpen 
} from 'lucide-react';

interface ToeicExamScreenProps {
  test: ToeicTest;
  onBack: () => void;
  nickname: string;
}

export const ToeicExamScreen: React.FC<ToeicExamScreenProps> = ({
  test,
  onBack,
  nickname
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [flagged, setFlagged] = useState<{ [questionId: number]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<{ [questionId: number]: boolean }>({});
  const [selectedPartFilter, setSelectedPartFilter] = useState<number | 'ALL'>('ALL');

  const currentQ = test.questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play audio for current question (uses speech synthesis for listening parts)
  const handlePlayAudio = () => {
    if (!currentQ.audioText) return;
    if (isPlayingAudio) {
      sounds.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      sounds.playClick();
      setIsPlayingAudio(true);
      sounds.speakEnglish(currentQ.audioText, playbackSpeed).then(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
  };

  const toggleFlag = (id: number) => {
    sounds.playClick();
    setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    sounds.playVictory();
    setIsTimerRunning(false);
    setIsSubmitted(true);
    setShowResultModal(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Calculate scores
  const totalQuestions = test.questions.length;
  let correctCount = 0;
  let listeningCorrect = 0;
  let readingCorrect = 0;

  test.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
      if (q.part <= 4) listeningCorrect++;
      else readingCorrect++;
    }
  });

  const listeningTotal = test.questions.filter(q => q.part <= 4).length || 1;
  const readingTotal = test.questions.filter(q => q.part >= 5).length || 1;
  const listeningScore = Math.round((listeningCorrect / listeningTotal) * 495);
  const readingScore = Math.round((readingCorrect / readingTotal) * 495);
  const totalToeicScore = listeningScore + readingScore;

  // Troll rank evaluation
  let rankBadge = "Chiến Thần Đỉnh Nóc";
  let roastComment = "Nóc nhà mãi đỉnh! Tối nay được bạn trai khao lẩu và trà sữa ngập mồm!";
  if (totalToeicScore < 450) {
    rankBadge = "Mập Địch Sơ Sinh";
    roastComment = "Học hành thế đấy à? Trừ 2 ly trà sữa và phải chép phạt 50 từ vựng nhé!";
  } else if (totalToeicScore < 750) {
    rankBadge = "Tập Sự Khá Bảnh";
    roastComment = "Tạm tha, nhưng vẫn còn nhiều câu bấm lụi lắm nha Mập địch!";
  }

  // Filter questions for display
  const filteredQuestions = selectedPartFilter === 'ALL'
    ? test.questions
    : test.questions.filter(q => q.part === selectedPartFilter);

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-4">
      {/* Top Test Header Bar */}
      <div className="bg-white border-4 border-black p-4 mb-4 shadow-neo-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4" /> Thoát Đề
          </button>
          <div>
            <h2 className="font-heading font-black text-lg md:text-xl uppercase">
              {test.title}
            </h2>
            <p className="text-xs font-bold text-gray-500">
              Mã đề: {test.code} • Đầy đủ 7 Part TOEIC
            </p>
          </div>
        </div>

        {/* Part Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { sounds.playClick(); setSelectedPartFilter('ALL'); }}
            className={`px-2.5 py-1 text-xs font-bold border-2 border-black ${
              selectedPartFilter === 'ALL' ? 'bg-neoYellow' : 'bg-white'
            }`}
          >
            Tất cả
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map(part => (
            <button
              key={part}
              onClick={() => { sounds.playClick(); setSelectedPartFilter(part); }}
              className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                selectedPartFilter === part ? 'bg-neoCyan' : 'bg-white'
              }`}
            >
              Part {part}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question Details & Audio Player (Cols 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-white border-4 border-black p-6 shadow-neo-lg flex flex-col gap-6">
            
            {/* Question Meta Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-neoPink text-white border-2 border-black font-black text-xs uppercase">
                  Part {currentQ.part}
                </span>
                <span className="font-bold text-sm text-gray-700">
                  Câu hỏi #{currentQ.id}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black text-xs font-bold shadow-neo-sm ${
                  flagged[currentQ.id] ? 'bg-yellow-300 text-black' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5 fill-current" />
                <span>{flagged[currentQ.id] ? "Đã gắn cờ" : "Gắn cờ xem lại"}</span>
              </button>
            </div>

            {/* Part Direction */}
            {currentQ.direction && (
              <div className="bg-blue-50 border-2 border-dashed border-blue-400 p-3 text-xs md:text-sm font-bold text-blue-950">
                📌 {currentQ.direction}
              </div>
            )}

            {/* AUDIO PLAYER (For Part 1, 2, 3, 4) */}
            {currentQ.audioText && (
              <div className="bg-neoYellow/40 border-3 border-black p-4 flex flex-wrap items-center justify-between gap-3 shadow-neo-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayAudio}
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-black text-xs uppercase shadow-neo-sm ${
                      isPlayingAudio ? 'bg-red-400 text-white animate-pulse' : 'bg-neoGreen text-black'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-black" />}
                    <span>{isPlayingAudio ? "Đang phát Audio..." : "Phát Audio Nghe"}</span>
                  </button>

                  <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                    <Volume2 className="w-4 h-4" /> Giọng bản xứ US
                  </span>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold mr-1">Tốc độ:</span>
                  {[0.8, 1.0, 1.2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => { sounds.playClick(); setPlaybackSpeed(speed); }}
                      className={`px-2 py-0.5 text-xs font-black border border-black ${
                        playbackSpeed === speed ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image (Part 1) */}
            {currentQ.imageUrl && (
              <div className="border-3 border-black p-2 bg-gray-50 flex flex-col items-center">
                <img
                  src={currentQ.imageUrl}
                  alt={`Part 1 Photo #${currentQ.id}`}
                  className="max-h-64 object-contain border border-black"
                />
              </div>
            )}

            {/* Passage Text (Part 6 & Part 7) */}
            {currentQ.passage && (
              <div className="bg-amber-50/60 border-3 border-black p-5 text-sm md:text-base font-serif leading-relaxed whitespace-pre-line shadow-neo-sm">
                {currentQ.passage}
              </div>
            )}

            {/* Question Text */}
            <div className="text-lg md:text-xl font-black font-heading text-black">
              {currentQ.questionText}
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {currentQ.options.map(opt => {
                const isSelected = answers[currentQ.id] === opt.label;
                const isCorrect = currentQ.correctAnswer === opt.label;
                
                let optionStyle = "bg-white hover:bg-yellow-50 border-3 border-black";
                if (isSubmitted) {
                  if (isCorrect) optionStyle = "bg-emerald-200 border-3 border-black font-black";
                  else if (isSelected && !isCorrect) optionStyle = "bg-rose-200 border-3 border-black line-through";
                } else if (isSelected) {
                  optionStyle = "bg-neoYellow border-3 border-black font-black -translate-y-0.5 shadow-neo-sm";
                }

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    disabled={isSubmitted}
                    className={`w-full p-4 text-left transition-all flex items-start gap-4 cursor-pointer select-none ${optionStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black shrink-0 ${
                      isSelected ? 'bg-black text-white' : 'bg-gray-100 text-black'
                    }`}>
                      {opt.label}
                    </span>
                    <span className="font-bold text-sm sm:text-base pt-1">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Transcript & Explanation Toggle (Visible after submit) */}
            {isSubmitted && (
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-400 flex flex-col gap-3">
                <button
                  onClick={() => setShowTranscript(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  className="flex items-center gap-2 px-4 py-2 bg-neoPurple border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:bg-purple-300 w-fit"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showTranscript[currentQ.id] ? "Ẩn Giải Thích & Transcript" : "Xem Giải Thích & Transcript"}</span>
                </button>

                {showTranscript[currentQ.id] && (
                  <div className="bg-yellow-50 border-3 border-black p-4 text-sm flex flex-col gap-2 shadow-neo-sm">
                    {currentQ.transcript && (
                      <div>
                        <strong className="text-black font-black block">📝 Transcript:</strong>
                        <p className="italic text-gray-700">{currentQ.transcript}</p>
                      </div>
                    )}
                    <div>
                      <strong className="text-emerald-700 font-black block">💡 Giải thích đáp án ({currentQ.correctAnswer}):</strong>
                      <p className="font-bold text-gray-800">{currentQ.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons inside card */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-black">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => { sounds.playClick(); setCurrentQuestionIndex(currentQuestionIndex - 1); }}
                className="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase disabled:opacity-40 hover:bg-gray-100 shadow-neo-sm"
              >
                ← Câu trước
              </button>
              
              <span className="text-xs font-bold text-gray-500">
                Câu {currentQuestionIndex + 1} trên {test.questions.length}
              </span>

              <button
                disabled={currentQuestionIndex === test.questions.length - 1}
                onClick={() => { sounds.playClick(); setCurrentQuestionIndex(currentQuestionIndex + 1); }}
                className="px-4 py-2 bg-neoYellow border-2 border-black font-bold text-xs uppercase disabled:opacity-40 hover:bg-yellow-300 shadow-neo-sm"
              >
                Câu sau →
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Question Palette & Timer (Cols 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Timer Card */}
          <div className="bg-white border-4 border-black p-4 shadow-neo flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600 animate-spin" />
              <span className="font-heading font-black text-xl md:text-2xl font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>
            
            {!isSubmitted && (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1 bg-gray-100 border-2 border-black font-bold text-xs shadow-neo-sm hover:bg-gray-200"
              >
                {isTimerRunning ? "Tạm dừng" : "Tiếp tục"}
              </button>
            )}
          </div>

          {/* Question Palette Matrix (Study4 style) */}
          <div className="bg-white border-4 border-black p-5 shadow-neo-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <h3 className="font-heading font-black text-base uppercase">
                Danh Sách Câu Hỏi
              </h3>
              <span className="text-xs font-bold text-gray-500">
                Đã làm: {Object.keys(answers).length}/{totalQuestions}
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-gray-200 border border-black inline-block"></span>
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-neoGreen border border-black inline-block"></span>
                <span>Đã chọn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-yellow-300 border border-black inline-block"></span>
                <span>Gắn cờ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-neoCyan border-2 border-black inline-block"></span>
                <span>Đang xem</span>
              </div>
            </div>

            {/* Questions Grid 1 -> N */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 scrollbar-none">
              {test.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let boxClass = "bg-gray-100 hover:bg-gray-200 border-2 border-black";
                if (isSubmitted) {
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  boxClass = isCorrect ? "bg-neoGreen border-2 border-black font-black" : "bg-red-300 border-2 border-black font-black";
                } else if (isCurrent) {
                  boxClass = "bg-neoCyan border-3 border-black font-black scale-105";
                } else if (isFlagged) {
                  boxClass = "bg-yellow-300 border-2 border-black font-black";
                } else if (isAnswered) {
                  boxClass = "bg-neoGreen border-2 border-black font-black";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => { sounds.playClick(); setCurrentQuestionIndex(idx); }}
                    className={`h-10 text-xs font-bold flex items-center justify-center relative shadow-neo-sm transition-all ${boxClass}`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Big Submit Button */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-neoPink text-white border-3 border-black font-heading font-black text-lg uppercase shadow-neo hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Nộp Bài Thi</span>
              </button>
            ) : (
              <button
                onClick={() => setShowResultModal(true)}
                className="w-full py-4 bg-neoYellow border-3 border-black font-heading font-black text-base uppercase shadow-neo hover:bg-yellow-300"
              >
                🏆 Xem Bảng Điểm & Troll Rank
              </button>
            )}

          </div>

        </div>

      </div>

      {/* RESULT MODAL */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border-4 border-black p-6 sm:p-8 shadow-neo-lg flex flex-col items-center text-center gap-6 animate-bounceSlow relative">
            
            <img src="/trollface.png" alt="Trollface" className="w-20 h-20 object-contain animate-wiggle" />

            <div>
              <span className="px-3 py-1 bg-neoYellow border-2 border-black font-black text-xs uppercase shadow-neo-sm">
                KẾT QUẢ TOEIC CỦA {nickname.toUpperCase()}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase text-black mt-2">
                {rankBadge}
              </h2>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-blue-50 border-3 border-black p-3 shadow-neo-sm">
                <span className="text-xs font-bold text-gray-500 block">Listening</span>
                <span className="text-2xl font-black text-blue-700 font-mono">{listeningScore}</span>
                <span className="text-[10px] font-bold text-gray-400 block">/ 495</span>
              </div>
              <div className="bg-emerald-50 border-3 border-black p-3 shadow-neo-sm">
                <span className="text-xs font-bold text-gray-500 block">Reading</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">{readingScore}</span>
                <span className="text-[10px] font-bold text-gray-400 block">/ 495</span>
              </div>
              <div className="bg-neoYellow border-3 border-black p-3 shadow-neo-sm">
                <span className="text-xs font-bold text-gray-700 block">Tổng Điểm</span>
                <span className="text-3xl font-black text-black font-mono">{totalToeicScore}</span>
                <span className="text-[10px] font-bold text-gray-600 block">/ 990</span>
              </div>
            </div>

            {/* Roast Feedback for girlfriend */}
            <div className="bg-yellow-50 border-3 border-black p-4 w-full shadow-neo-sm text-left">
              <strong className="text-xs font-black text-pink-600 uppercase block">
                💌 Lời nhắn từ Trollface & Bạn trai:
              </strong>
              <p className="font-bold text-gray-800 text-sm mt-1">
                "{roastComment}"
              </p>
              <p className="text-xs text-gray-500 font-bold mt-2">
                Đúng: {correctCount}/{totalQuestions} câu ({Math.round((correctCount/totalQuestions)*100)}%)
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300"
              >
                Xem Lại Từng Câu & Transcript
              </button>
              <button
                onClick={() => { sounds.playClick(); onBack(); }}
                className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100"
              >
                Về Menu Chính
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
