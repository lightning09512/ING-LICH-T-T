import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ToeicTest, ToeicQuestion } from '../data/initialData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, RotateCcw, FastForward, Flag, CheckCircle, 
  HelpCircle, Clock, Volume2, ArrowLeft, Send, Sparkles, BookOpen,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ToeicExamScreenProps {
  test: ToeicTest;
  onBack: () => void;
  nickname: string;
}

interface QuestionGroup {
  groupId: string;
  part: number;
  title: string;
  passage?: string;
  imageUrl?: string;
  questions: ToeicQuestion[];
}

export const ToeicExamScreen: React.FC<ToeicExamScreenProps> = ({
  test,
  onBack,
  nickname
}) => {
  // Current active part tab: 1 to 7
  const [activePart, setActivePart] = useState<number>(1);
  const [answers, setAnswers] = useState<{ [questionId: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [flagged, setFlagged] = useState<{ [questionId: number]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Real MP3 Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  const [showTranscript, setShowTranscript] = useState<{ [questionId: number]: boolean }>({});
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [highlightedQId, setHighlightedQId] = useState<number | null>(null);

  const activeAudioUrl = test.audioUrl || test.questions[0]?.audioUrl;
  const isListeningPart = activePart <= 4;

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

  // Sync audio playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatAudioTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Audio Controls
  const toggleAudio = () => {
    sounds.playClick();
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch(err => {
        console.warn("Audio autoplay blocked:", err);
      });
    }
  };

  const seekAudio = (delta: number) => {
    if (!audioRef.current) return;
    sounds.playClick();
    const target = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = target;
    setAudioCurrentTime(target);
  };

  const handleSelectOption = (qId: number, opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    sounds.playClick();
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const toggleFlag = (id: number) => {
    sounds.playClick();
    setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Scroll to a question when clicked on palette
  const scrollToQuestion = (qId: number, part: number) => {
    sounds.playClick();
    if (activePart !== part) {
      setActivePart(part);
    }
    setHighlightedQId(qId);
    setTimeout(() => {
      const el = document.getElementById(`question-${qId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    setTimeout(() => setHighlightedQId(null), 2500);
  };

  const handleSubmit = () => {
    sounds.playVictory();
    setIsTimerRunning(false);
    setIsSubmitted(true);
    setShowResultModal(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
    }
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    fetch(`/api/tests/${test._id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        timeSpentSeconds: test.durationMinutes * 60 - timeLeft,
        nickname
      })
    }).catch(err => console.warn("Submit log failed:", err));
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

  let rankBadge = "Chiến Thần Đỉnh Nóc";
  let roastComment = "Nóc nhà mãi đỉnh! Tối nay được bạn trai khao lẩu và trà sữa ngập mồm!";
  if (totalToeicScore < 450) {
    rankBadge = "Mập Địch Sơ Sinh";
    roastComment = "Học hành thế đấy à? Trừ 2 ly trà sữa và phải chép phạt 50 từ vựng nhé!";
  } else if (totalToeicScore < 750) {
    rankBadge = "Tập Sự Khá Bảnh";
    roastComment = "Tạm tha, nhưng vẫn còn nhiều câu bấm lụi lắm nha Mập địch!";
  }

  // GROUP QUESTIONS BY PART & PASSAGE
  const currentPartGroups = useMemo<QuestionGroup[]>(() => {
    const partQuestions = test.questions.filter(q => q.part === activePart);
    if (partQuestions.length === 0) return [];

    if (activePart === 1) {
      // Part 1: Each question is its own card, all together on Part 1 page
      return [{
        groupId: 'part-1-all',
        part: 1,
        title: 'Part 1: Photographs (Tranh mô tả - Câu 1 đến 6)',
        questions: partQuestions
      }];
    }

    if (activePart === 2) {
      // Part 2: All 25 questions on Part 2 page
      return [{
        groupId: 'part-2-all',
        part: 2,
        title: 'Part 2: Question - Response (Hỏi đáp - Câu 7 đến 31)',
        questions: partQuestions
      }];
    }

    if (activePart === 3 || activePart === 4) {
      // Group conversations/talks in sets of 3 questions
      const groups: QuestionGroup[] = [];
      const partName = activePart === 3 ? 'Hội thoại' : 'Bài nói ngắn';
      for (let i = 0; i < partQuestions.length; i += 3) {
        const slice = partQuestions.slice(i, i + 3);
        const first = slice[0].id;
        const last = slice[slice.length - 1].id;
        const groupImg = slice.find(q => !!q.imageUrl)?.imageUrl;
        groups.push({
          groupId: `p${activePart}-grp-${first}-${last}`,
          part: activePart,
          title: `Part ${activePart}: ${partName} (Câu ${first} - ${last})`,
          imageUrl: groupImg,
          questions: slice
        });
      }
      return groups;
    }

    if (activePart === 5) {
      // Part 5: All 30 incomplete sentences on Part 5 page
      return [{
        groupId: 'part-5-all',
        part: 5,
        title: 'Part 5: Incomplete Sentences (Điền vào câu - Câu 101 đến 130)',
        questions: partQuestions
      }];
    }

    if (activePart === 6 || activePart === 7) {
      // Part 6 & 7: GROUP BY PASSAGE!
      // All questions sharing the exact same passage appear in the SAME group
      const groups: QuestionGroup[] = [];
      let currentPassage: string | null = null;
      let currentSlice: ToeicQuestion[] = [];

      partQuestions.forEach((q) => {
        const p = q.passage || '';
        if (p !== currentPassage) {
          if (currentSlice.length > 0) {
            const first = currentSlice[0].id;
            const last = currentSlice[currentSlice.length - 1].id;
            groups.push({
              groupId: `p${activePart}-p-${first}-${last}`,
              part: activePart,
              title: activePart === 6 
                ? `Đoạn văn điền từ: Câu ${first} - ${last}`
                : `Bài đọc hiểu: Câu ${first} - ${last}`,
              passage: currentPassage || undefined,
              questions: currentSlice
            });
          }
          currentPassage = p;
          currentSlice = [q];
        } else {
          currentSlice.push(q);
        }
      });

      if (currentSlice.length > 0) {
        const first = currentSlice[0].id;
        const last = currentSlice[currentSlice.length - 1].id;
        groups.push({
          groupId: `p${activePart}-p-${first}-${last}`,
          part: activePart,
          title: activePart === 6 
            ? `Đoạn văn điền từ: Câu ${first} - ${last}`
            : `Bài đọc hiểu: Câu ${first} - ${last}`,
          passage: currentPassage || undefined,
          questions: currentSlice
        });
      }

      return groups;
    }

    return [{
      groupId: `part-${activePart}`,
      part: activePart,
      title: `Part ${activePart}`,
      questions: partQuestions
    }];
  }, [test.questions, activePart]);

  // Questions count per part for badges
  const partQuestionCounts = useMemo(() => {
    const map: { [p: number]: { total: number; done: number } } = {};
    for (let p = 1; p <= 7; p++) {
      const pQs = test.questions.filter(q => q.part === p);
      const done = pQs.filter(q => !!answers[q.id]).length;
      map[p] = { total: pQs.length, done };
    }
    return map;
  }, [test.questions, answers]);

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-6 pb-28 md:pb-12">
      {/* Hidden Global Audio Element for persistent continuous playback */}
      {activeAudioUrl && (
        <audio
          ref={audioRef}
          src={activeAudioUrl}
          preload="auto"
          onTimeUpdate={() => {
            if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setAudioDuration(audioRef.current.duration);
          }}
          onPlay={() => setAudioPlaying(true)}
          onPause={() => setAudioPlaying(false)}
          onEnded={() => setAudioPlaying(false)}
        />
      )}

      {/* TOP HEADER BAR */}
      <div className="bg-white border-4 border-black p-3 sm:p-4 mb-3 shadow-neo-sm flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <button
            onClick={() => { 
              sounds.playClick(); 
              if (audioRef.current) audioRef.current.pause();
              onBack(); 
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-2 border-black font-bold text-xs sm:text-sm shadow-neo-sm hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5 min-h-[44px] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Đổi Đề
          </button>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg md:text-xl uppercase leading-tight line-clamp-1">
              {test.title}
            </h2>
            <p className="text-xs font-bold text-gray-500">
              Mã đề: {test.code} • 200 câu • 120 phút
            </p>
          </div>
        </div>

        {/* Quick Submit & Status */}
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-100 border-2 border-black px-3 py-1.5 text-xs font-black shadow-neo-sm">
            Đã làm: <span className="text-neoPink font-mono text-sm">{Object.keys(answers).length}</span>/200
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-neoPink text-white border-2 border-black font-heading font-black text-xs sm:text-sm uppercase shadow-neo-sm hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Nộp Bài
            </button>
          )}
        </div>
      </div>

      {/* STICKY PART TABS BAR (7 PARTS) */}
      <div className="sticky top-2 z-30 bg-white border-4 border-black p-2 mb-4 shadow-neo flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7].map(part => {
          const isActive = activePart === part;
          const stat = partQuestionCounts[part] || { total: 0, done: 0 };
          const isDone = stat.done === stat.total && stat.total > 0;

          return (
            <button
              key={part}
              onClick={() => {
                sounds.playClick();
                setActivePart(part);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 border-2 border-black font-black text-xs sm:text-sm uppercase shadow-neo-sm whitespace-nowrap min-h-[42px] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                isActive 
                  ? 'bg-neoYellow text-black -translate-y-0.5 shadow-neo' 
                  : isDone
                  ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <span>Part {part}</span>
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded border ${
                isActive ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-400'
              }`}>
                {stat.done}/{stat.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* STICKY AUDIO BAR FOR LISTENING PARTS (PARTS 1 to 4) */}
      {isListeningPart && activeAudioUrl && (
        <div className="sticky top-[68px] z-20 bg-amber-200 border-4 border-black p-3 mb-4 shadow-neo flex flex-col gap-2 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-black text-xs sm:text-sm uppercase shadow-neo-sm min-h-[44px] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                  audioPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-neoGreen text-black hover:bg-emerald-400'
                }`}
              >
                {audioPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-black" />}
                <span>{audioPlaying ? "Tạm Dừng" : "Phát Audio Nghe"}</span>
              </button>

              <button
                onClick={() => seekAudio(-5)}
                className="px-2.5 py-2 bg-white border-2 border-black font-black text-xs shadow-neo-sm hover:bg-gray-100 min-h-[44px] cursor-pointer"
                title="Lùi 5 giây"
              >
                -5s
              </button>
              <button
                onClick={() => seekAudio(5)}
                className="px-2.5 py-2 bg-white border-2 border-black font-black text-xs shadow-neo-sm hover:bg-gray-100 min-h-[44px] cursor-pointer"
                title="Tới 5 giây"
              >
                +5s
              </button>

              <span className="text-xs sm:text-sm font-black font-mono bg-white border-2 border-black px-2.5 py-2 shadow-neo-sm">
                {formatAudioTime(audioCurrentTime)} / {formatAudioTime(audioDuration)}
              </span>
            </div>

            {/* Speed Controls */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold mr-1">Tốc độ:</span>
              {[0.8, 1.0, 1.25].map(speed => (
                <button
                  key={speed}
                  onClick={() => { sounds.playClick(); setAudioSpeed(speed); }}
                  className={`px-2 py-1 text-xs font-black border-2 border-black min-h-[32px] min-w-[34px] cursor-pointer transition-all ${
                    audioSpeed === speed ? 'bg-black text-white shadow-neo-sm' : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="flex items-center gap-2 w-full pt-0.5">
            <input
              type="range"
              min={0}
              max={audioDuration || 1}
              step={0.5}
              value={audioCurrentTime}
              onChange={e => {
                const val = Number(e.target.value);
                setAudioCurrentTime(val);
                if (audioRef.current) audioRef.current.currentTime = val;
              }}
              className="w-full accent-black cursor-pointer h-2.5 bg-white rounded border border-black"
            />
          </div>
        </div>
      )}

      {/* 2-COLUMN LAYOUT: MAIN QUESTIONS AREA (COL 8) & STICKY PALETTE (COL 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: SCROLLABLE QUESTIONS IN THIS PART */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Part Header Banner */}
          <div className="bg-neoYellow/30 border-3 border-black p-4 shadow-neo-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading uppercase text-black">
                Part {activePart}: {
                  activePart === 1 ? "Photographs (6 câu)" :
                  activePart === 2 ? "Question - Response (25 câu)" :
                  activePart === 3 ? "Short Conversations (39 câu)" :
                  activePart === 4 ? "Short Talks (30 câu)" :
                  activePart === 5 ? "Incomplete Sentences (30 câu)" :
                  activePart === 6 ? "Text Completion (16 câu)" :
                  "Reading Comprehension (54 câu)"
                }
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                Lướt xuống để làm toàn bộ câu hỏi của Part này. Nhấp vào bảng câu hỏi bên phải để nhảy nhanh!
              </p>
            </div>
          </div>

          {/* QUESTION GROUPS (CLUSTERS) */}
          {currentPartGroups.map(group => (
            <div 
              key={group.groupId} 
              className="bg-white border-4 border-black p-4 sm:p-6 shadow-neo-lg flex flex-col gap-6"
            >
              {/* Group Title Banner */}
              <div className="bg-gray-100 border-2 border-black p-3 flex items-center justify-between">
                <span className="font-heading font-black text-sm sm:text-base uppercase text-black flex items-center gap-2">
                  📌 {group.title}
                </span>
                <span className="text-xs font-black bg-white border border-black px-2 py-0.5">
                  {group.questions.length} câu
                </span>
              </div>

              {/* Shared Diagram / Chart Image (Part 3 & Part 4) */}
              {group.imageUrl && (
                <div className="border-3 border-black p-2 bg-gray-50 flex flex-col items-center shadow-neo-sm">
                  <span className="text-xs font-black text-gray-500 uppercase mb-1">
                    📊 Biểu đồ / Hình ảnh liên quan cho nhóm câu hỏi này:
                  </span>
                  <img
                    src={group.imageUrl}
                    alt={group.title}
                    className="max-h-80 w-auto object-contain border border-black bg-white rounded"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Shared Reading Passage (Part 6 & Part 7) */}
              {group.passage && (
                <div className="bg-amber-50/90 border-3 border-black p-4 sm:p-6 text-sm sm:text-base font-serif leading-relaxed whitespace-pre-line shadow-neo-sm max-h-[500px] overflow-y-auto">
                  <div className="font-sans font-black text-xs uppercase text-pink-700 mb-2 border-b-2 border-pink-300 pb-1 flex items-center gap-2">
                    📖 Đọc văn bản sau để trả lời các câu hỏi:
                  </div>
                  {group.passage}
                </div>
              )}

              {/* QUESTIONS LIST INSIDE THIS GROUP */}
              <div className="flex flex-col gap-8">
                {group.questions.map((q) => {
                  const isSelected = answers[q.id];
                  const isFlagged = flagged[q.id];
                  const isFocused = highlightedQId === q.id;

                  return (
                    <div 
                      key={q.id}
                      id={`question-${q.id}`}
                      className={`pt-4 border-t-2 border-dashed border-gray-300 first:pt-0 first:border-none transition-all duration-300 ${
                        isFocused ? 'ring-4 ring-neoPink p-3 bg-pink-50/60 rounded' : ''
                      }`}
                    >
                      {/* Individual Question Meta Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-black text-white font-black text-xs sm:text-sm uppercase rounded shadow-neo-sm">
                            Câu #{q.id}
                          </span>
                          {answers[q.id] && (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-500 px-2 py-0.5 rounded">
                              ✓ Đã chọn ({answers[q.id]})
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleFlag(q.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black text-xs font-bold shadow-neo-sm min-h-[34px] transition-all cursor-pointer ${
                            isFlagged ? 'bg-yellow-300 text-black font-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5 fill-current" />
                          <span>{isFlagged ? "Đã cờ" : "Gắn cờ"}</span>
                        </button>
                      </div>

                      {/* Part 1 Individual Photograph */}
                      {q.part === 1 && q.imageUrl && (
                        <div className="border-3 border-black p-2 bg-gray-50 flex flex-col items-center shadow-neo-sm mb-4">
                          <img
                            src={q.imageUrl}
                            alt={`Photo No. ${q.id}`}
                            className="max-h-72 w-auto object-contain border border-black bg-white rounded"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Question Text */}
                      <div className="text-base sm:text-lg font-black font-heading text-black mb-3">
                        {q.questionText}
                      </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {q.options.map(opt => {
                          const isOptionSelected = answers[q.id] === opt.label;
                          const isCorrect = q.correctAnswer === opt.label;

                          let optionStyle = "bg-white hover:bg-yellow-50 border-3 border-black";
                          if (isSubmitted) {
                            if (isCorrect) optionStyle = "bg-emerald-200 border-3 border-black font-black";
                            else if (isOptionSelected && !isCorrect) optionStyle = "bg-rose-200 border-3 border-black line-through";
                          } else if (isOptionSelected) {
                            optionStyle = "bg-neoYellow border-3 border-black font-black shadow-neo-sm";
                          }

                          return (
                            <button
                              key={opt.label}
                              onClick={() => handleSelectOption(q.id, opt.label)}
                              disabled={isSubmitted}
                              className={`w-full p-3 sm:p-4 text-left transition-all flex items-center gap-3.5 cursor-pointer select-none min-h-[52px] active:scale-[0.99] ${optionStyle}`}
                            >
                              <span className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black shrink-0 text-sm ${
                                isOptionSelected ? 'bg-black text-white' : 'bg-gray-100 text-black'
                              }`}>
                                {opt.label}
                              </span>
                              <span className="font-bold text-sm sm:text-base">
                                {opt.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Post-submit official answers */}
                      {isSubmitted && (
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-400">
                          <button
                            onClick={() => setShowTranscript(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            className="text-xs font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            {showTranscript[q.id] ? "Ẩn đáp án chi tiết" : "Xem đáp án chính thức & giải thích"}
                          </button>
                          {showTranscript[q.id] && (
                            <div className="mt-2 bg-yellow-50 border-2 border-black p-3 text-xs sm:text-sm font-bold">
                              <span className="text-emerald-700 font-black block">
                                Đáp án chính thức: ({q.correctAnswer})
                              </span>
                              <p className="text-gray-800 mt-1">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))}

          {/* BOTTOM PART NAVIGATION BAR */}
          <div className="bg-white border-4 border-black p-4 shadow-neo flex items-center justify-between gap-3 mt-4">
            <button
              disabled={activePart === 1}
              onClick={() => {
                sounds.playClick();
                setActivePart(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white border-2 border-black font-black text-xs sm:text-sm uppercase disabled:opacity-30 hover:bg-gray-100 shadow-neo-sm min-h-[46px] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Part {activePart - 1}
            </button>

            {activePart < 7 ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  setActivePart(prev => Math.min(7, prev + 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 sm:px-8 py-3 bg-neoYellow border-2 border-black font-black text-xs sm:text-sm uppercase hover:bg-yellow-300 shadow-neo-sm min-h-[46px] cursor-pointer"
              >
                <span>Chuyển sang Part {activePart + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 sm:px-10 py-3 bg-neoPink text-white border-2 border-black font-heading font-black text-sm uppercase shadow-neo hover:bg-pink-600 min-h-[46px] cursor-pointer"
              >
                <Send className="w-4 h-4" /> Nộp Toàn Bộ Bài Thi
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY QUESTION PALETTE ON TABLET & DESKTOP */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-4">
          
          {/* Timer Card */}
          <div className="bg-white border-4 border-black p-4 shadow-neo flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600 animate-spin" />
              <span className="font-heading font-black text-2xl font-mono">
                {formatTime(timeLeft)}
              </span>
            </div>
            
            {!isSubmitted && (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3.5 py-1.5 bg-gray-100 border-2 border-black font-bold text-xs sm:text-sm shadow-neo-sm hover:bg-gray-200 min-h-[38px] cursor-pointer"
              >
                {isTimerRunning ? "Tạm dừng" : "Tiếp tục"}
              </button>
            )}
          </div>

          {/* PALETTE MATRIX */}
          <div className="bg-white border-4 border-black p-4 shadow-neo-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <h3 className="font-heading font-black text-sm sm:text-base uppercase">
                Bảng 200 Câu Hỏi
              </h3>
              <span className="text-xs font-black bg-neoYellow border border-black px-2 py-0.5">
                {Object.keys(answers).length}/200
              </span>
            </div>

            {/* Quick Part Jumper Buttons */}
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(p => (
                <button
                  key={p}
                  onClick={() => {
                    sounds.playClick();
                    setActivePart(p);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`py-1 text-xs font-black border border-black transition-all cursor-pointer ${
                    activePart === p ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-yellow-200'
                  }`}
                >
                  P{p}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold text-gray-600 pt-1 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-200 border border-black inline-block"></span>
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-neoGreen border border-black inline-block"></span>
                <span>Đã chọn</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-300 border border-black inline-block"></span>
                <span>Cờ</span>
              </div>
            </div>

            {/* Questions Grid 1 -> 200 */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 max-h-[380px] overflow-y-auto p-1 scrollbar-none border border-gray-300">
              {test.questions.map(q => {
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];
                const isInActivePart = q.part === activePart;

                let boxClass = "bg-gray-100 hover:bg-gray-200 border border-black";
                if (isSubmitted) {
                  const isCorrect = answers[q.id] === q.correctAnswer;
                  boxClass = isCorrect ? "bg-neoGreen border-2 border-black font-black" : "bg-red-300 border-2 border-black font-black";
                } else if (isFlagged) {
                  boxClass = "bg-yellow-300 border-2 border-black font-black";
                } else if (isAnswered) {
                  boxClass = "bg-neoGreen border-2 border-black font-black";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id, q.part)}
                    className={`h-9 text-xs font-bold flex items-center justify-center relative shadow-neo-sm transition-all active:scale-95 cursor-pointer ${boxClass} ${
                      isInActivePart ? 'ring-1 ring-black' : 'opacity-70 hover:opacity-100'
                    }`}
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
                className="w-full py-3.5 bg-neoPink text-white border-3 border-black font-heading font-black text-base uppercase shadow-neo hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Send className="w-4 h-4" />
                <span>Nộp Bài Thi</span>
              </button>
            ) : (
              <button
                onClick={() => setShowResultModal(true)}
                className="w-full py-3.5 bg-neoYellow border-3 border-black font-heading font-black text-sm uppercase shadow-neo hover:bg-yellow-300 cursor-pointer mt-1"
              >
                🏆 Xem Bảng Điểm & Xếp Hạng
              </button>
            )}

          </div>

        </div>

      </div>

      {/* MOBILE QUICK BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-black p-2 flex items-center justify-between gap-2 shadow-neo-lg">
        <button
          disabled={activePart === 1}
          onClick={() => { sounds.playClick(); setActivePart(prev => Math.max(1, prev - 1)); }}
          className="flex-1 py-2.5 px-2 bg-white border-2 border-black font-black text-xs uppercase disabled:opacity-30 active:scale-95 text-center cursor-pointer"
        >
          ← Part {activePart - 1}
        </button>

        <button
          onClick={() => { sounds.playClick(); setShowMobilePalette(true); }}
          className="flex-1 py-2.5 px-2 bg-neoCyan border-2 border-black font-black text-xs uppercase active:scale-95 shadow-neo-sm text-center cursor-pointer"
        >
          Bảng 200 Câu 📋
        </button>

        <button
          disabled={activePart === 7}
          onClick={() => { sounds.playClick(); setActivePart(prev => Math.min(7, prev + 1)); }}
          className="flex-1 py-2.5 px-2 bg-neoYellow border-2 border-black font-black text-xs uppercase disabled:opacity-30 active:scale-95 text-center cursor-pointer"
        >
          Part {activePart + 1} →
        </button>
      </div>

      {/* MOBILE PALETTE MODAL */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-lg bg-white border-4 border-black p-5 shadow-neo-lg flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <h3 className="font-heading font-black text-base uppercase">
                Bảng 200 Câu Hỏi ({Object.keys(answers).length}/200)
              </h3>
              <button
                onClick={() => setShowMobilePalette(false)}
                className="w-8 h-8 bg-neoPink text-white border-2 border-black font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Part Jumper */}
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(p => (
                <button
                  key={p}
                  onClick={() => {
                    sounds.playClick();
                    setActivePart(p);
                  }}
                  className={`py-1.5 text-xs font-black border border-black ${
                    activePart === p ? 'bg-black text-white' : 'bg-gray-100 text-black'
                  }`}
                >
                  P{p}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto p-1">
              {test.questions.map(q => {
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let boxClass = "bg-gray-100 border border-black";
                if (isFlagged) boxClass = "bg-yellow-300 border-2 border-black font-black";
                else if (isAnswered) boxClass = "bg-neoGreen border-2 border-black font-black";

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setShowMobilePalette(false);
                      scrollToQuestion(q.id, q.part);
                    }}
                    className={`h-10 text-xs font-bold flex items-center justify-center relative cursor-pointer ${boxClass}`}
                  >
                    <span>{q.id}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowMobilePalette(false);
                handleSubmit();
              }}
              className="w-full py-3 bg-neoPink text-white border-3 border-black font-black uppercase text-sm cursor-pointer"
            >
              Nộp Toàn Bộ Bài Thi
            </button>
          </div>
        </div>
      )}

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
                className="px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300 cursor-pointer"
              >
                Xem Lại Từng Câu & Giải Thích
              </button>
              <button
                onClick={() => { 
                  sounds.playClick(); 
                  if (audioRef.current) audioRef.current.pause();
                  onBack(); 
                }}
                className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
              >
                Về Kho Đề Thi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
