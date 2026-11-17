import React, { useState, useEffect } from 'react';
import { 
  TOEIC_WRITING_PARTS, 
  TOEIC_WRITING_QUESTIONS, 
  TOEIC_WRITING_TESTS,
  WritingQuestion 
} from '../data/toeicWritingData';
import { 
  gradeWritingWithAi, 
  AiEvaluationResult, 
  getStoredGeminiApiKey, 
  saveStoredGeminiApiKey 
} from '../utils/aiGrader';
import { sounds } from '../utils/soundEffects';
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
  TrendingUp,
  Trophy,
  PenTool,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicWritingExamScreenProps {
  testId: string;
  onBack: () => void;
  nickname: string;
}

export const ToeicWritingExamScreen: React.FC<ToeicWritingExamScreenProps> = ({ 
  testId, 
  onBack, 
  nickname 
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testId || 'study4-wr-01');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userText, setUserText] = useState('');
  
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

  // Filter questions for the selected test
  const questionsInTest = TOEIC_WRITING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const currentQuestion: WritingQuestion = questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_WRITING_QUESTIONS[0];
  const currentTestMeta = TOEIC_WRITING_TESTS.find(t => t.id === selectedTestId) || TOEIC_WRITING_TESTS[0];

  // Sync testId prop
  useEffect(() => {
    if (testId && testId !== selectedTestId) {
      setSelectedTestId(testId);
      setCurrentQuestionIndex(0);
    }
  }, [testId]);

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

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sounds.playWrong();
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

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;

  const handleGradeWithAi = async () => {
    if (!userText.trim()) {
      alert('Vui lòng nhập bài viết trước khi yêu cầu AI chấm điểm!');
      return;
    }

    setIsGrading(true);
    sounds.playClick();

    try {
      const partType = currentQuestion.part === 1 ? 'SENTENCE'
        : currentQuestion.part === 2 ? 'EMAIL'
        : 'ESSAY';

      const result = await gradeWritingWithAi({
        partType,
        prompt: currentQuestion.promptText,
        userSubmission: userText,
        keywords: currentQuestion.keywords,
        referenceModel: currentQuestion.modelAnswer
      });

      setEvaluationResult(result);
      if (result.score >= 7) {
        sounds.playCorrect();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
    } catch (error) {
      alert('Chấm điểm thất bại. Vui lòng kiểm tra lại mạng hoặc API Key Gemini!');
    } finally {
      setIsGrading(false);
    }
  };

  const handleSaveApiKey = () => {
    saveStoredGeminiApiKey(apiKeyInput.trim());
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setApiKeyModalOpen(false);
    sounds.playCorrect();
  };

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full">
      
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 bg-white p-3 sm:p-4 rounded-2xl border-3 border-black shadow-neo">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Danh Sách Đề
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">✍️</span>
          <div className="text-left hidden sm:block">
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              Phòng Thi TOEIC Writing
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              {currentTestMeta.name} • 8 câu hỏi chuẩn format ETS
            </p>
          </div>
        </div>

        <button
          onClick={() => setApiKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-neo-sm cursor-pointer transition-all ${
            hasApiKey 
              ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200' 
              : 'bg-yellow-200 text-yellow-950 hover:bg-yellow-300 animate-pulse'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{hasApiKey ? 'Gemini AI Sẵn Sàng' : 'Cài API Key'}</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Test & Questions Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Test Selector */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <label className="block text-xs uppercase font-black tracking-wider text-gray-600 mb-2">
              Bộ Đề Thi Writing:
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => {
                sounds.playClick();
                setSelectedTestId(e.target.value);
                setCurrentQuestionIndex(0);
              }}
              className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {TOEIC_WRITING_TESTS.map(test => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Grid (1 - 8) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                Bảng Câu Hỏi (8 Câu):
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-black">
                {currentQuestion.partTitle.split(':')[0]}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {questionsInTest.map((q, idx) => {
                const isActive = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`p-3 rounded-xl border-2 border-black font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#FFDE59] text-black shadow-neo-sm scale-105' 
                        : 'bg-gray-50 hover:bg-amber-50 text-gray-800'
                    }`}
                  >
                    <span className="text-[10px] text-gray-400 font-bold">P{q.part}</span>
                    <span>Q{q.questionNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips Box for this Question */}
          <div className="bg-[#FFF9C4] p-4 rounded-2xl border-3 border-black shadow-neo text-xs text-gray-900">
            <div className="flex items-center gap-1.5 font-black text-xs uppercase mb-2 text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400" />
              Mẹo Làm Bài Đạt Điểm Cao:
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
              {currentQuestion.tipsVi.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Question Content & Writing Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Question Details Header */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b-2 border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-[#FFDE59] border border-black font-mono">
                  {currentQuestion.partTitle}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1 font-heading text-black">
                  Câu hỏi số {currentQuestion.questionNumber} / 8
                </h2>
              </div>

              {/* Timer Bar */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs sm:text-sm ${
                isTimerRunning ? 'bg-amber-300 animate-pulse' : 'bg-gray-100'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsRemaining)}</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase rounded cursor-pointer hover:bg-gray-800"
                >
                  {isTimerRunning ? 'Dừng' : 'Bắt Đầu'}
                </button>
              </div>
            </div>

            {/* Vietnamese Directions */}
            <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-800/20 text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
              👉 <span className="underline">Yêu cầu đề bài:</span> {currentQuestion.directionsVi}
            </div>

            {/* PART 1: Image & Required Keywords */}
            {currentQuestion.part === 1 && (
              <div className="flex flex-col gap-3">
                {currentQuestion.imageUrl && (
                  <div className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-xl border-2 border-black overflow-hidden max-h-[340px]">
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt="TOEIC Writing Part 1" 
                      className="max-h-[320px] w-auto object-contain rounded-lg shadow-sm"
                      onError={(e) => {
                        (e.target as any).src = '/images/part1/p1_01.jpg';
                      }}
                    />
                  </div>
                )}

                {currentQuestion.keywords && (
                  <div className="flex items-center gap-2 flex-wrap p-3 bg-yellow-50 rounded-xl border-2 border-amber-300">
                    <span className="font-black text-xs uppercase text-amber-900">
                      2 Từ Khóa Bắt Buộc:
                    </span>
                    {currentQuestion.keywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-black text-yellow-300 font-black text-xs rounded-lg font-mono border border-black shadow-neo-sm">
                        {kw}
                      </span>
                    ))}
                    <span className="text-[11px] text-gray-500 ml-auto">
                      (Có thể đổi thì/dạng từ, viết đúng 1 câu)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* PART 2: Email Context */}
            {currentQuestion.part === 2 && currentQuestion.emailContext && (
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-black text-xs sm:text-sm flex flex-col gap-2 font-mono">
                <div className="flex flex-col gap-1 pb-2 border-b border-gray-300 text-gray-700">
                  <div><strong>From:</strong> {currentQuestion.emailContext.from}</div>
                  <div><strong>To:</strong> {currentQuestion.emailContext.to}</div>
                  <div><strong>Date:</strong> {currentQuestion.emailContext.date}</div>
                  <div><strong>Subject:</strong> <span className="text-black font-black">{currentQuestion.emailContext.subject}</span></div>
                </div>
                <div className="whitespace-pre-line text-gray-800 leading-relaxed font-sans pt-1">
                  {currentQuestion.emailContext.body}
                </div>
                
                {/* Requirements */}
                <div className="mt-2 p-3 bg-cyan-50 rounded-lg border border-cyan-300 font-sans text-xs">
                  <div className="font-black text-cyan-950 uppercase mb-1">
                    Nhiệm Vụ Cần Trả Lời Trong Thư:
                  </div>
                  <ul className="space-y-1 text-cyan-900 font-bold">
                    {currentQuestion.emailContext.requirementsVi.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span>✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* PART 3: Essay Topic */}
            {currentQuestion.part === 3 && currentQuestion.essayPrompt && (
              <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-300 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs uppercase text-orange-900">
                    Chủ Đề Bài Luận (Tối Thiểu 300 Từ):
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-orange-300 font-bold">
                    Thời gian: 30 Phút
                  </span>
                </div>
                <h3 className="font-black text-base text-gray-900">
                  {currentQuestion.essayPrompt.topic}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {currentQuestion.promptText}
                </p>
              </div>
            )}
          </div>

          {/* Text Editor Workspace */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-3">
            
            <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                Khung Soạn Thảo Bài Viết:
              </span>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="bg-gray-100 px-2.5 py-1 rounded-lg border border-black/20">
                  Độ dài: <strong className="text-black">{wordCount}</strong> từ
                </span>
                {currentQuestion.part === 3 && (
                  <span className={wordCount >= 300 ? 'text-emerald-600' : 'text-amber-600'}>
                    (Mục tiêu: 300+ từ)
                  </span>
                )}
              </div>
            </div>

            <textarea
              rows={currentQuestion.part === 1 ? 3 : currentQuestion.part === 2 ? 8 : 14}
              placeholder={
                currentQuestion.part === 1 
                  ? "Nhập 1 câu miêu tả hoàn chỉnh có chứa 2 từ khóa..." 
                  : currentQuestion.part === 2 
                  ? "Dear Mr./Ms...,\n\nThank you for your email...\n\nSincerely," 
                  : "Write your 300-word opinion essay here (Introduction, Body 1, Body 2, Conclusion)..."
              }
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl font-sans text-sm sm:text-base leading-relaxed text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-400"
            />

            {/* Action Bar: Templates, Model Answers & AI Grading */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                {currentQuestion.templateVi && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowTemplate(!showTemplate);
                    }}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 border-2 border-black font-black text-xs rounded-lg shadow-neo-sm transition-all cursor-pointer"
                  >
                    {showTemplate ? 'Ẩn Dàn Bài Gợi Ý' : '💡 Xem Dàn Bài Gợi Ý'}
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowModelAnswer(!showModelAnswer);
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black font-black text-xs rounded-lg shadow-neo-sm transition-all cursor-pointer"
                >
                  {showModelAnswer ? 'Ẩn Bài Mẫu ETS' : '📖 Xem Bài Mẫu ETS'}
                </button>
              </div>

              <button
                onClick={handleGradeWithAi}
                disabled={isGrading || !userText.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer ${
                  isGrading || !userText.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FF9800] hover:bg-[#fb8c00] text-black'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isGrading ? 'animate-spin' : 'text-amber-950 fill-amber-300'}`} />
                {isGrading ? 'AI Đang Chấm & Sửa Câu...' : 'Chấm Điểm & Sửa Câu Bằng AI'}
              </button>
            </div>

            {/* Expandable Template */}
            {showTemplate && currentQuestion.templateVi && (
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-amber-300 text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed font-sans mt-2 animate-fadeIn">
                <div className="font-black text-amber-950 uppercase mb-1">
                  Khung Dàn Bài Chuẩn (Suggested Outline):
                </div>
                {currentQuestion.templateVi}
              </div>
            )}

            {/* Expandable Model Answer */}
            {showModelAnswer && (
              <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed font-sans mt-2 animate-fadeIn">
                <div className="font-black text-emerald-950 uppercase mb-1">
                  Bài Viết Mẫu Chuẩn Điểm Tuyệt Đối (ETS Model Answer):
                </div>
                {currentQuestion.modelAnswer}
              </div>
            )}
          </div>

          {/* AI Evaluation Results */}
          {evaluationResult && (
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] animate-fadeIn flex flex-col gap-4">
              <div className="bg-gradient-to-r from-amber-200 via-yellow-200 to-emerald-200 p-4 rounded-xl border-3 border-black flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-black tracking-wider text-black/70">
                    Kết Quả Đánh Giá Bài Viết (Writing)
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black flex items-baseline gap-2 mt-0.5">
                    <span>{evaluationResult.score} / {evaluationResult.maxScore} Điểm</span>
                    <span className="text-sm font-bold bg-black text-[#FFDE59] px-2.5 py-0.5 rounded-full">
                      Dự kiến TOEIC Writing: {evaluationResult.estimatedToeicBand} / 200
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-300 flex items-start gap-3">
                <span className="text-2xl">👸</span>
                <div>
                  <div className="font-black text-xs uppercase text-pink-900">Nhận Xét Từ Huấn Luyện Viên:</div>
                  <p className="text-xs sm:text-sm text-pink-950 font-bold mt-0.5 leading-relaxed">
                    "{evaluationResult.coachComment}"
                  </p>
                </div>
              </div>

              {/* Grammar Corrections */}
              {evaluationResult.grammarCorrections && evaluationResult.grammarCorrections.length > 0 && (
                <div className="p-4 bg-rose-50 rounded-xl border-2 border-rose-300">
                  <div className="font-black text-xs text-rose-950 uppercase mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Các Lỗi Ngữ Pháp & Từ Vựng Cần Chỉnh Sửa:
                  </div>
                  <div className="space-y-2">
                    {evaluationResult.grammarCorrections.map((corr, cIdx) => (
                      <div key={cIdx} className="bg-white p-2.5 rounded-lg border border-rose-200 text-xs">
                        <div className="text-rose-700 line-through">❌ {corr.original}</div>
                        <div className="text-emerald-700 font-bold mt-0.5">➔ Sửa thành: {corr.corrected}</div>
                        <div className="text-gray-500 text-[11px] mt-0.5">{corr.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-300">
                  <div className="font-black text-xs text-emerald-950 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ưu Điểm Bài Viết:
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {evaluationResult.strengths.map((str, i) => (
                      <li key={i}>• {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-300">
                  <div className="font-black text-xs text-amber-950 uppercase flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Gợi Ý Cải Thiện:
                  </div>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {evaluationResult.improvements.map((imp, i) => (
                      <li key={i}>• {imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border-4 border-black p-6 rounded-2xl max-w-md w-full shadow-neo flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base sm:text-lg uppercase">Cài Đặt Gemini API Key</h3>
              <button 
                onClick={() => setApiKeyModalOpen(false)}
                className="font-black text-lg p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-gray-700 font-bold leading-relaxed">
              Nhập Google Gemini API Key để kích hoạt tính năng AI sửa lỗi ngữ pháp, gợi ý nâng cấp câu văn và chấm điểm chuẩn TOEIC Writing band 200. Khóa được lưu an toàn tại trình duyệt của bạn (Local Storage).
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl border-2 border-black font-black text-xs bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs bg-[#FFDE59] hover:bg-yellow-400 shadow-neo-sm cursor-pointer"
              >
                Lưu API Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
