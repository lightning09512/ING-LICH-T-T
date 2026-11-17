import React, { useState, useEffect } from 'react';
import { 
  TOEIC_WRITING_PARTS, 
  TOEIC_WRITING_QUESTIONS, 
  TOEIC_WRITING_TESTS,
  WritingQuestion 
} from '../data/toeicWritingData';
import { 
  TOEIC_REVISION_ROADMAP, 
  RevisionUnit 
} from '../data/toeicRevisionData';
import { 
  gradeWritingWithAi, 
  AiEvaluationResult, 
  getStoredGeminiApiKey, 
  saveStoredGeminiApiKey 
} from '../utils/aiGrader';
import { sounds } from '../utils/soundEffects';
import { FormattedContent } from './FormattedContent';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  Clock, 
  Key, 
  Lightbulb, 
  BookOpen, 
  RefreshCw, 
  Award, 
  HelpCircle,
  TrendingUp,
  Trophy,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicWritingScreenProps {
  onBack: () => void;
  nickname: string;
  initialTestId?: string;
}

export const ToeicWritingScreen: React.FC<ToeicWritingScreenProps> = ({ onBack, nickname, initialTestId }) => {
  // Top Level Mode: 'TEST_PRACTICE' vs 'REVISION'
  const [activeTab, setActiveTab] = useState<'TEST_PRACTICE' | 'REVISION'>('TEST_PRACTICE');

  // Test Practice State
  const [selectedTestId, setSelectedTestId] = useState<string>(initialTestId || 'study4-wr-01');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userText, setUserText] = useState('');

  // Sync initialTestId if changed
  useEffect(() => {
    if (initialTestId) {
      setSelectedTestId(initialTestId);
      setCurrentQuestionIndex(0);
      setActiveTab('TEST_PRACTICE');
    }
  }, [initialTestId]);
  
  // Settings & Helpers
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiApiKey());
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredGeminiApiKey()));
  const [showTemplate, setShowTemplate] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  
  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // AI Evaluation State
  const [isGrading, setIsGrading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AiEvaluationResult | null>(null);

  // Revision / Theory State (Writing Units)
  const writingUnits = TOEIC_REVISION_ROADMAP.filter(u => u.skill === 'WRITING');
  const [selectedPartFilter, setSelectedPartFilter] = useState<number | 'ALL'>('ALL');
  const filteredWritingUnits = selectedPartFilter === 'ALL'
    ? writingUnits
    : writingUnits.filter(u => u.partNumber === selectedPartFilter);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(writingUnits[0]?.id || 'wr-unit-01');
  const currentUnit: RevisionUnit = writingUnits.find(u => u.id === selectedUnitId) || writingUnits[0];
  const [quizAnswers, setQuizAnswers] = useState<{ [quizIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [quizIdx: number]: boolean }>({});

  // Filter questions for the selected test
  const questionsInTest = TOEIC_WRITING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const currentQuestion: WritingQuestion = questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_WRITING_QUESTIONS[0];

  // Reset state when switching question or test
  useEffect(() => {
    setUserText('');
    setEvaluationResult(null);
    setShowTemplate(false);
    setShowModelAnswer(false);
    setIsTimerRunning(false);
    if (currentQuestion) {
      setSecondsRemaining(currentQuestion.timeLimitMinutes * 60);
    }
  }, [selectedTestId, currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, secondsRemaining]);

  // Word count & stats
  const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = userText.length;
  const sentenceCount = userText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const handleSaveApiKey = () => {
    saveStoredGeminiApiKey(apiKeyInput);
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setApiKeyModalOpen(false);
  };

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleInsertTemplate = () => {
    if (currentQuestion.templateVi) {
      if (userText && !window.confirm("Chèn dàn ý sẽ ghi đè nội dung bạn vừa viết. Bạn có chắc không?")) {
        return;
      }
      setUserText(currentQuestion.templateVi);
      setShowTemplate(false);
    }
  };

  const handleGradeWithAi = async () => {
    if (!userText.trim()) {
      alert("Nóc nhà ơi, viết ít nhất một vài câu rồi hãy bấm chấm điểm nhé! ❤️");
      return;
    }

    setIsGrading(true);
    setEvaluationResult(null);

    const partType = currentQuestion.part === 1 ? 'SENTENCE' : currentQuestion.part === 2 ? 'EMAIL' : 'ESSAY';

    try {
      const result = await gradeWritingWithAi({
        partType,
        prompt: currentQuestion.promptText,
        userSubmission: userText,
        keywords: currentQuestion.keywords,
        referenceModel: currentQuestion.modelAnswer
      });

      setEvaluationResult(result);
      if (result.score >= (result.maxScore * 0.7)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi kết nối AI. Đang chuyển sang bộ chấm điểm Heuristic tích hợp!");
    } finally {
      setIsGrading(false);
    }
  };

  const handleSelectQuizOption = (quizIdx: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }));
    setQuizSubmitted(prev => ({ ...prev, [quizIdx]: true }));

    const quiz = currentUnit.quickQuiz[quizIdx];
    if (quiz && optionIdx === quiz.correctIndex) {
      sounds.playCorrect();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      sounds.playWrong();
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      
      {/* Top Navigation & App Bar */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b-4 border-black mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-[#FFDE59] px-4 py-2.5 rounded-xl border-3 border-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-black text-sm uppercase tracking-wide cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Về Menu Chính
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              ✍️ TOEIC Writing Hub
              <span className="hidden sm:inline-block text-xs bg-black text-[#FFDE59] px-2.5 py-1 rounded-full font-bold">
                Study4 & AI
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold">
              Chào Nóc Nhà <span className="text-pink-600 font-black">{nickname}</span>! Cùng luyện đề thi thật hoặc tra cứu cẩm nang 8 bài học viết nhé!
            </p>
          </div>
        </div>

        {/* API Key Modal Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-3 border-black text-xs font-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer ${
              hasApiKey ? 'bg-emerald-300 text-emerald-950' : 'bg-cyan-200 text-cyan-950'
            }`}
          >
            <Key className="w-4 h-4" />
            {hasApiKey ? 'Gemini 2.5 AI: Hoạt Động' : 'Cài Đặt Gemini Key'}
          </button>
        </div>
      </div>

      {/* Main Top Segmented Control (Luyện Đề vs Cẩm Nang Ôn Tập) */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('TEST_PRACTICE');
          }}
          className={`py-3.5 px-4 rounded-2xl border-4 border-black font-black text-sm sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'TEST_PRACTICE'
              ? 'bg-[#FF9800] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
              : 'bg-white hover:bg-orange-50 shadow-[2px_2px_0px_#000] text-gray-700'
          }`}
        >
          <Trophy className="w-5 h-5 text-amber-900" />
          <span>🎯 Luyện Đề Thi Study4</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('REVISION');
          }}
          className={`py-3.5 px-4 rounded-2xl border-4 border-black font-black text-sm sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'REVISION'
              ? 'bg-[#FFDE59] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
              : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0px_#000] text-gray-700'
          }`}
        >
          <BookOpen className="w-5 h-5 text-black" />
          <span>📖 Cẩm Nang Ôn Luyện (8 Unit)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LUYỆN ĐỀ THI STUDY4                                */}
      {/* ======================================================== */}
      {activeTab === 'TEST_PRACTICE' && (
        <div className="flex flex-col gap-6">
          
          {/* Study4 Test Selector Cards */}
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOEIC_WRITING_TESTS.map(test => {
              const isSelected = selectedTestId === test.id;
              return (
                <button
                  key={test.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTestId(test.id);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`p-3.5 rounded-2xl border-3 border-black text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-black text-[#FFDE59] shadow-neo translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white hover:bg-orange-50 text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black ${
                      isSelected ? 'bg-[#FFDE59] text-black' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.badge}
                    </span>
                    <span className="text-xs font-mono font-bold">8 Câu • 60 Phút</span>
                  </div>
                  <div className="font-black text-sm leading-snug">{test.name}</div>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>{test.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Question Navigator Palette (1 -> 8) */}
          <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-xs font-black uppercase text-gray-500 mr-1 shrink-0">Bảng Câu Hỏi:</span>
              {questionsInTest.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`w-9 h-9 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-black text-[#FFDE59] shadow-none scale-105'
                        : 'bg-gray-100 hover:bg-amber-100 text-black shadow-[1px_1px_0px_#000]'
                    }`}
                    title={q.partTitle}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-mono font-black text-sm bg-gray-100 px-3 py-1.5 rounded-xl border-2 border-black">
                <Clock className={`w-4 h-4 ${secondsRemaining <= 30 ? 'text-red-500 animate-spin' : 'text-black'}`} />
                <span className={secondsRemaining <= 30 ? 'text-red-600 font-black animate-pulse' : 'text-black'}>
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
              <button
                onClick={handleStartTimer}
                className="text-xs font-black bg-[#5CE1E6] px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#4bcad0] cursor-pointer"
              >
                {isTimerRunning ? 'Tạm Dừng' : 'Bấm Giờ'}
              </button>
              <button
                onClick={() => setSecondsRemaining(currentQuestion.timeLimitMinutes * 60)}
                className="p-1.5 bg-gray-200 rounded-xl border-2 border-black hover:bg-gray-300 cursor-pointer"
                title="Reset đồng hồ"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Test Practice Workspace (5 cols left + 7 cols right) */}
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Stimulus */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black bg-rose-200 text-rose-950 px-2.5 py-1 rounded-full border border-black uppercase">
                    Câu {currentQuestionIndex + 1}/8 • {currentQuestion.partTitle}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">
                    Gợi ý: {currentQuestion.timeLimitMinutes} phút
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed mt-2 bg-amber-50 p-3 rounded-xl border border-black/20">
                  💡 <span className="font-bold">Yêu cầu:</span> {currentQuestion.directionsVi}
                </p>

                {/* Stimulus 1: Image for Part 1 */}
                {currentQuestion.part === 1 && currentQuestion.imageUrl && (
                  <div className="mt-4">
                    <div className="rounded-xl overflow-hidden border-3 border-black shadow-neo bg-gray-100 flex items-center justify-center max-h-72">
                      <img
                        src={currentQuestion.imageUrl}
                        alt="TOEIC Writing Question Picture"
                        className="w-full h-auto object-cover max-h-72"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    {currentQuestion.keywords && (
                      <div className="mt-3 p-3 bg-purple-100 rounded-xl border-2 border-black flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase text-purple-950">2 Từ Bắt Buộc:</span>
                        {currentQuestion.keywords.map((kw, i) => (
                          <span key={i} className="text-xs font-black bg-white px-3 py-1 rounded-lg border-2 border-black text-purple-900 shadow-[1px_1px_0px_#000]">
                            ⭐ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Stimulus 2: Email Viewer for Part 2 */}
                {currentQuestion.part === 2 && currentQuestion.emailContext && (
                  <div className="mt-4 bg-[#F8FAFC] border-2 border-black rounded-xl p-4 shadow-sm text-xs font-sans">
                    <div className="border-b border-gray-300 pb-2 mb-2 space-y-1">
                      <div><strong className="text-gray-500">From:</strong> {currentQuestion.emailContext.from}</div>
                      <div><strong className="text-gray-500">To:</strong> {currentQuestion.emailContext.to}</div>
                      <div><strong className="text-gray-500">Subject:</strong> <span className="font-black text-indigo-900">{currentQuestion.emailContext.subject}</span></div>
                    </div>
                    <div className="whitespace-pre-line text-gray-800 leading-relaxed font-mono text-xs bg-white p-3 rounded-lg border border-gray-200">
                      {currentQuestion.emailContext.body}
                    </div>
                    <div className="mt-3 bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                      <div className="font-black text-amber-950 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                        Các ý bắt buộc phải có:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                        {currentQuestion.emailContext.requirementsVi.map((req, rIdx) => (
                          <li key={rIdx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Stimulus 3: Essay Prompt for Part 3 */}
                {currentQuestion.part === 3 && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-900/40">
                      <div className="text-xs uppercase font-black text-indigo-950 mb-1">Đề Bài Luận:</div>
                      <p className="font-black text-sm text-indigo-900 leading-snug">
                        "{currentQuestion.promptText}"
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span>Mục tiêu độ dài:</span>
                      <span className="bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-800 font-black">
                        Tối thiểu 300 từ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-[#EBFBEE] p-4 rounded-2xl border-3 border-black shadow-neo">
                <h3 className="font-black text-xs uppercase tracking-wide text-emerald-950 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  Mẹo Giúp Nóc Nhà Đạt Điểm Cao:
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-800">
                  {currentQuestion.tipsVi.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Writing Input & AI Results */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xs uppercase tracking-wider text-gray-500">Bài Làm Của Bạn:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border border-black ${
                      currentQuestion.part === 3 
                        ? wordCount >= 300 ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {wordCount} từ • {charCount} ký tự {currentQuestion.part === 1 && `• ${sentenceCount} câu`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentQuestion.templateVi && (
                      <button
                        onClick={() => setShowTemplate(!showTemplate)}
                        className="text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 px-2.5 py-1 rounded-lg border border-black flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {showTemplate ? 'Ẩn Dàn Ý' : 'Dàn Bài Gợi Ý'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowModelAnswer(!showModelAnswer)}
                      className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg border border-black flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {showModelAnswer ? 'Ẩn Bài Mẫu' : 'Bài Mẫu ETS'}
                    </button>
                  </div>
                </div>

                {showTemplate && currentQuestion.templateVi && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-300 text-xs text-purple-950 font-sans">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black uppercase flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                        Khung Dàn Ý Gợi Ý
                      </span>
                      <button
                        onClick={handleInsertTemplate}
                        className="px-2 py-0.5 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 text-[11px] cursor-pointer"
                      >
                        Chép Khung Này Vào Bài
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs bg-white p-2.5 rounded border border-purple-200 leading-relaxed text-gray-800">
                      {currentQuestion.templateVi}
                    </pre>
                  </div>
                )}

                {showModelAnswer && (
                  <div className="mb-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-300 text-xs text-amber-950 font-sans">
                    <div className="font-black uppercase flex items-center gap-1 mb-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      Bài Viết Mẫu Chuẩn Điểm Tuyệt Đối
                    </div>
                    <div className="whitespace-pre-line text-xs bg-white p-3 rounded border border-amber-200 leading-relaxed text-gray-800 font-serif">
                      {currentQuestion.modelAnswer}
                    </div>
                  </div>
                )}

                <textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder={
                    currentQuestion.part === 1
                      ? "Nhập đúng MỘT câu miêu tả bức tranh có chứa cả 2 từ khóa..."
                      : currentQuestion.part === 2
                      ? "Dear Mr./Ms. ...\n\nThank you for reaching out..."
                      : "Write your 300-word essay here..."
                  }
                  rows={currentQuestion.part === 1 ? 4 : currentQuestion.part === 2 ? 10 : 16}
                  className="w-full p-4 rounded-xl border-3 border-black text-sm sm:text-base font-sans focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all shadow-[inner_0_2px_4px_rgba(0,0,0,0.06)] resize-y"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setUserText('')}
                    className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl border border-transparent hover:border-black transition-all cursor-pointer"
                  >
                    Xóa làm lại
                  </button>

                  <button
                    onClick={handleGradeWithAi}
                    disabled={isGrading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border-3 border-black font-black text-sm uppercase tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer ${
                      isGrading 
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                        : 'bg-[#00E5FF] hover:bg-[#00c9e0] text-black'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${isGrading ? 'animate-spin' : 'text-amber-500 fill-amber-400'}`} />
                    {isGrading ? 'AI Đang Chấm & Phân Tích...' : 'Chấm Điểm & Sửa Văn AI'}
                  </button>
                </div>
              </div>

              {/* AI Results */}
              {evaluationResult && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] animate-fadeIn flex flex-col gap-4">
                  <div className="bg-gradient-to-r from-amber-200 via-pink-200 to-cyan-200 p-4 rounded-xl border-3 border-black flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase font-black tracking-wider text-black/70">
                        Kết Quả Đánh Giá Bài Viết
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-black flex items-baseline gap-2 mt-0.5">
                        <span>{evaluationResult.score} / {evaluationResult.maxScore} Điểm</span>
                        <span className="text-sm font-bold bg-black text-white px-2.5 py-0.5 rounded-full">
                          Dự kiến TOEIC Writing: {evaluationResult.estimatedToeicBand} / 200
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-300 flex items-start gap-3">
                    <span className="text-2xl">👸</span>
                    <div>
                      <div className="font-black text-xs uppercase text-pink-900">Lời Nhắn Từ Huấn Luyện Viên:</div>
                      <p className="text-xs sm:text-sm text-pink-950 font-bold mt-0.5 leading-relaxed">
                        "{evaluationResult.coachComment}"
                      </p>
                    </div>
                  </div>

                  {evaluationResult.grammarCorrections && evaluationResult.grammarCorrections.length > 0 && (
                    <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-300">
                      <div className="font-black text-xs text-rose-950 uppercase flex items-center gap-1.5 mb-3">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Lỗi Ngữ Pháp & Cách Sửa Cụ Thể:
                      </div>
                      <div className="space-y-3">
                        {evaluationResult.grammarCorrections.map((corr, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-rose-200 text-xs">
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-red-500 line-through font-mono font-bold">"{corr.original}"</span>
                              <span className="text-gray-400">➔</span>
                              <span className="text-emerald-700 font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded">"{corr.corrected}"</span>
                            </div>
                            <p className="text-gray-600 mt-1 italic">
                              💡 <span className="font-semibold">Giải thích:</span> {corr.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {evaluationResult.vocabUpgrades && evaluationResult.vocabUpgrades.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-300">
                      <div className="font-black text-xs text-purple-950 uppercase flex items-center gap-1.5 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Gợi Ý Nâng Cấp Từ Vựng Học Thuật C1/C2:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evaluationResult.vocabUpgrades.map((v, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-purple-200 text-xs">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <span className="text-gray-500">{v.originalWord}</span>
                              <span className="text-purple-600">➔</span>
                              <span className="text-purple-950 bg-purple-100 px-1.5 py-0.5 rounded font-black">{v.betterWord}</span>
                            </div>
                            <p className="text-[11px] text-gray-600">{v.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CẨM NANG ÔN LUYỆN KỸ NĂNG VIẾT (8 UNIT CHUẨN ETS)     */}
      {/* ======================================================== */}
      {activeTab === 'REVISION' && (
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 8 Units Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
              <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-gray-100">
                <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                  Lộ Trình 8 Bài Học:
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-black">
                  Level 0 - 100+
                </span>
              </div>

              {/* Part Filter Buttons */}
              <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b-2 border-gray-100">
                <button
                  onClick={() => setSelectedPartFilter('ALL')}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                    selectedPartFilter === 'ALL'
                      ? 'bg-black text-[#FFDE59] shadow-neo-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tất cả ({writingUnits.length})
                </button>
                <button
                  onClick={() => setSelectedPartFilter(1)}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                    selectedPartFilter === 1
                      ? 'bg-black text-[#FFDE59] shadow-neo-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Part 1 (Q1-5)
                </button>
                <button
                  onClick={() => setSelectedPartFilter(2)}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                    selectedPartFilter === 2
                      ? 'bg-black text-[#FFDE59] shadow-neo-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Part 2 (Q6-7)
                </button>
                <button
                  onClick={() => setSelectedPartFilter(3)}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                    selectedPartFilter === 3
                      ? 'bg-black text-[#FFDE59] shadow-neo-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Part 3 (Q8)
                </button>
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filteredWritingUnits.map(unit => {
                  const isSelected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedUnitId(unit.id);
                        setQuizAnswers({});
                        setQuizSubmitted({});
                      }}
                      className={`w-full p-3 rounded-xl border-2 border-black text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-[#FFDE59] text-black shadow-neo-sm translate-x-1 font-bold' 
                          : 'bg-gray-50 hover:bg-orange-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black text-[#FFDE59] border border-black font-mono">
                          PART {unit.partNumber}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-black/30">
                          {unit.questionCoverageVi}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold ml-auto">
                          Unit {unit.unitNumber}
                        </span>
                      </div>
                      <div className="font-black text-xs leading-snug line-clamp-2">
                        {unit.title}
                      </div>
                      <div className="text-[10px] text-gray-500 font-bold truncate">
                        {unit.partNameVi}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Formatted Lesson Reader (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Unit Header with prominent Part Badge */}
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-3">
              {/* Part & Questions Indicator Bar */}
              <div className="bg-[#FFFDE7] p-3 rounded-xl border-2 border-black flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-black text-[#FFDE59] font-black text-xs uppercase rounded-lg border border-black shadow-neo-sm font-mono">
                    🎯 PART {currentUnit.partNumber}: {currentUnit.partNameVi}
                  </span>
                  <span className="px-2.5 py-1 bg-white text-black font-black text-xs rounded-lg border-2 border-black">
                    📌 Phạm vi: {currentUnit.questionCoverageVi}
                  </span>
                  <span className="px-2 py-0.5 bg-yellow-200 text-yellow-950 font-bold text-xs rounded-md border border-black/40">
                    {currentUnit.badge}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-600">
                  Unit {currentUnit.unitNumber} / 8
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight font-heading mt-1">
                {currentUnit.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                {currentUnit.subtitle}
              </p>

              <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-800/20 text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                💡 <span className="font-bold">Mục tiêu bài học:</span> {currentUnit.overviewVi}
              </div>
            </div>

            {/* Clean Formatted Sections */}
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-6">
              {currentUnit.contentSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black uppercase border-b-2 border-black pb-1.5 text-indigo-950 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    {sec.heading}
                  </h3>

                  {/* Clean Formatted Content - Zero raw markdown! */}
                  <FormattedContent content={sec.bodyMarkdown} />

                  {sec.highlightBox && (
                    <div className="p-4 rounded-xl border-2 border-black bg-emerald-50 text-emerald-950 text-xs mt-2">
                      <div className="font-black uppercase mb-1 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        {sec.highlightBox.title}
                      </div>
                      <p className="font-medium leading-relaxed">
                        {sec.highlightBox.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Formulas */}
              {currentUnit.keyFormulas && currentUnit.keyFormulas.length > 0 && (
                <div className="mt-2 pt-4 border-t-2 border-gray-200">
                  <h3 className="text-sm font-black uppercase text-purple-950 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Công Thức Ghép Câu & Mẫu Câu Quan Trọng:
                  </h3>
                  <div className="space-y-3">
                    {currentUnit.keyFormulas.map((form, fIdx) => (
                      <div key={fIdx} className="bg-purple-50 p-4 rounded-xl border-2 border-purple-300 text-xs">
                        <div className="font-black text-purple-950 uppercase mb-1">{form.name}:</div>
                        <div className="bg-white p-2.5 rounded-lg border border-purple-200 font-mono font-bold text-purple-900 mb-2">
                          {form.structure}
                        </div>
                        <div className="space-y-1 text-gray-700">
                          <div>🇺🇸 <strong>Ví dụ:</strong> <em>"{form.exampleEn}"</em></div>
                          <div>🇻🇳 <strong>Dịch:</strong> <span>{form.exampleVi}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Interactive Mini Quiz */}
            {currentUnit.quickQuiz && currentUnit.quickQuiz.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h3 className="font-black text-sm uppercase flex items-center gap-2 text-rose-950">
                    <HelpCircle className="w-4 h-4 text-rose-600" />
                    Mini Quiz: Kiểm Tra Hiểu Bài Tức Thì
                  </h3>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-md border border-black">
                    1 Câu Hỏi
                  </span>
                </div>

                {currentUnit.quickQuiz.map((quiz, qIdx) => {
                  const selectedOpt = quizAnswers[qIdx];
                  const isAnswered = quizSubmitted[qIdx];
                  const isCorrect = selectedOpt === quiz.correctIndex;

                  return (
                    <div key={qIdx} className="space-y-3">
                      <p className="font-black text-sm text-gray-900 leading-snug">
                        {quiz.questionText}
                      </p>

                      <div className="space-y-2">
                        {quiz.options.map((opt, oIdx) => {
                          let btnStyle = 'bg-gray-50 hover:bg-orange-50 border-gray-300 text-gray-800';
                          if (isAnswered) {
                            if (oIdx === quiz.correctIndex) {
                              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                            } else if (oIdx === selectedOpt) {
                              btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 line-through';
                            } else {
                              btnStyle = 'bg-gray-100 opacity-60 text-gray-500';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isAnswered}
                              onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                              className={`w-full p-3 rounded-xl border-2 text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-black shrink-0">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isAnswered && oIdx === quiz.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                              {isAnswered && oIdx === selectedOpt && oIdx !== quiz.correctIndex && (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div className={`p-3.5 rounded-xl border-2 text-xs leading-relaxed animate-fadeIn ${
                          isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                        }`}>
                          <div className="font-black uppercase mb-1 flex items-center gap-1.5">
                            {isCorrect ? '🎉 Hoan hô Nóc Nhà! Bạn trả lời đúng rồi!' : '😅 Chưa chính xác rồi, cùng xem giải thích nhé:'}
                          </div>
                          <p>{quiz.explanationVi}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* GEMINI API KEY MODAL */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg uppercase flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                Cài Đặt Gemini API Key
              </h3>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold hover:bg-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              Nhập mã API Key của bạn từ Google AI Studio để kích hoạt mô hình <strong>Gemini 2.5 Flash</strong> chấm điểm trực tiếp, sửa ngữ pháp thông minh và gợi ý từ vựng xịn sò.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-black uppercase text-gray-600 mb-1">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-xl border-2 border-black text-sm font-mono focus:outline-none focus:ring-3 focus:ring-amber-300"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-[11px] text-amber-950 mb-5 leading-relaxed">
              💡 <strong>Lưu ý:</strong> Khóa API chỉ được lưu bảo mật trong trình duyệt của bạn (localStorage). Nếu để trống, hệ thống sẽ tự động dùng <em>Bộ Chấm Điểm Heuristic Tích Hợp Sẵn</em> hoàn toàn miễn phí!
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setApiKeyInput('');
                  saveStoredGeminiApiKey('');
                  setHasApiKey(false);
                  setApiKeyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl border-2 border-black font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                Dùng Offline Engine
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs uppercase bg-[#FFDE59] shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                Lưu Khóa API
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
