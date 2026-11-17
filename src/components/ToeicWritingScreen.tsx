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
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Key, 
  Lightbulb, 
  BookOpen, 
  RefreshCw, 
  Send, 
  Award, 
  HelpCircle,
  TrendingUp,
  FileText,
  ChevronRight,
  ChevronLeft,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicWritingScreenProps {
  onBack: () => void;
  nickname: string;
  onOpenRevision?: () => void;
}

export const ToeicWritingScreen: React.FC<ToeicWritingScreenProps> = ({ onBack, nickname, onOpenRevision }) => {
  const [selectedTestId, setSelectedTestId] = useState<string>('study4-wr-01');
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
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

  // Filter questions for the selected test and part
  const questionsInTest = TOEIC_WRITING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const questionsInPart = questionsInTest.filter(q => q.part === selectedPart);
  const currentQuestion: WritingQuestion = questionsInPart[currentQuestionIndex] || questionsInTest[0] || TOEIC_WRITING_QUESTIONS[0];

  // Reset state when switching question
  useEffect(() => {
    setUserText('');
    setEvaluationResult(null);
    setShowTemplate(false);
    setShowModelAnswer(false);
    setIsTimerRunning(false);
    if (currentQuestion) {
      setSecondsRemaining(currentQuestion.timeLimitMinutes * 60);
    }
  }, [selectedPart, currentQuestionIndex]);

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

    const partType = selectedPart === 1 ? 'SENTENCE' : selectedPart === 2 ? 'EMAIL' : 'ESSAY';

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
              ✍️ Luyện Thi TOEIC Writing
              <span className="hidden sm:inline-block text-xs bg-black text-[#FFDE59] px-2.5 py-1 rounded-full font-bold">
                AI Chấm Trực Tiếp
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold">
              Chào Nóc Nhà <span className="text-pink-600 font-black">{nickname}</span>! Cùng luyện viết câu, email và bài luận chuẩn ETS nhé!
            </p>
          </div>
        </div>

        {/* API Key & AI Engine Status */}
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

      {/* Study4 Test Selector & Revision Shortcut */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-2xl border-3 border-black shadow-neo">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase text-gray-500 mr-1 flex items-center gap-1 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Bộ Đề STUDY4:
          </span>
          {TOEIC_WRITING_TESTS.map(test => (
            <button
              key={test.id}
              onClick={() => {
                setSelectedTestId(test.id);
                setCurrentQuestionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedTestId === test.id
                  ? 'bg-black text-[#FFDE59] shadow-none'
                  : 'bg-gray-100 hover:bg-orange-100 text-black shadow-[2px_2px_0px_#000]'
              }`}
            >
              <span>{test.name}</span>
              <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded border border-black font-bold">
                {test.badge}
              </span>
            </button>
          ))}
        </div>

        {onOpenRevision && (
          <button
            onClick={onOpenRevision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-black bg-[#FFDE59] text-xs font-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-black" />
            Lộ Trình Ôn Tập (Ms Hoa)
          </button>
        )}
      </div>

      {/* Part Navigation Tabs */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {TOEIC_WRITING_PARTS.map(part => {
          const isActive = selectedPart === part.id;
          return (
            <button
              key={part.id}
              onClick={() => {
                setSelectedPart(part.id as 1 | 2 | 3);
                setCurrentQuestionIndex(0);
              }}
              className={`p-3.5 rounded-2xl border-3 border-black text-left transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#FF6B6B] text-white shadow-neo translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-white hover:bg-amber-100 shadow-[2px_2px_0px_#000]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{part.icon}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
                  Part {part.id}
                </span>
              </div>
              <div className="font-black text-sm">{part.name}</div>
              <div className={`text-xs mt-0.5 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>{part.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Question Selector Sub-pills & Timer Bar */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border-3 border-black shadow-neo">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase text-gray-500 mr-1">Chọn Đề:</span>
          {questionsInPart.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer ${
                currentQuestionIndex === idx
                  ? 'bg-black text-[#FFDE59] shadow-none'
                  : 'bg-gray-100 hover:bg-amber-200 text-black shadow-[2px_2px_0px_#000]'
              }`}
            >
              Câu {idx + 1}
            </button>
          ))}
        </div>

        {/* Timer Control */}
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

      {/* Main Workspace Layout */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left Column: Question Prompt & Stimulus (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Question Directions Card */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black bg-rose-200 text-rose-950 px-2.5 py-1 rounded-full border border-black uppercase">
                {currentQuestion.partTitle}
              </span>
              <span className="text-xs text-gray-500 font-bold">
                Thời gian gợi ý: {currentQuestion.timeLimitMinutes} phút
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed mt-2 bg-amber-50 p-3 rounded-xl border border-black/20">
              💡 <span className="font-bold">Yêu cầu:</span> {currentQuestion.directionsVi}
            </p>

            {/* Stimulus 1: Image for Part 1 */}
            {selectedPart === 1 && currentQuestion.imageUrl && (
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
                {/* 2 Required Keywords */}
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
            {selectedPart === 2 && currentQuestion.emailContext && (
              <div className="mt-4 bg-[#F8FAFC] border-2 border-black rounded-xl p-4 shadow-sm text-xs font-sans">
                <div className="border-b border-gray-300 pb-2 mb-2 space-y-1">
                  <div><strong className="text-gray-500">From:</strong> {currentQuestion.emailContext.from}</div>
                  <div><strong className="text-gray-500">To:</strong> {currentQuestion.emailContext.to}</div>
                  <div><strong className="text-gray-500">Date:</strong> {currentQuestion.emailContext.date}</div>
                  <div><strong className="text-gray-500">Subject:</strong> <span className="font-black text-indigo-900">{currentQuestion.emailContext.subject}</span></div>
                </div>
                <div className="whitespace-pre-line text-gray-800 leading-relaxed font-mono text-xs bg-white p-3 rounded-lg border border-gray-200">
                  {currentQuestion.emailContext.body}
                </div>
                {/* Requirements Checklist */}
                <div className="mt-3 bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                  <div className="font-black text-amber-950 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    Các ý bắt buộc phải có trong thư trả lời:
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
            {selectedPart === 3 && (
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

          {/* Useful Tips Accordion */}
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

        {/* Right Column: Writing Input & Grading Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Writing Card */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo flex flex-col">
            
            {/* Toolbar above textarea */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-gray-200">
              <div className="flex items-center gap-3">
                <span className="font-black text-xs uppercase tracking-wider text-gray-500">Bài Làm Của Bạn:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border border-black ${
                  selectedPart === 3 
                    ? wordCount >= 300 ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {wordCount} từ • {charCount} ký tự {selectedPart === 1 && `• ${sentenceCount} câu`}
                </span>
              </div>

              {/* Template / Model Buttons */}
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

            {/* Template Drawer */}
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

            {/* Model Answer Drawer */}
            {showModelAnswer && (
              <div className="mb-3 p-3 bg-amber-50 rounded-xl border-2 border-amber-300 text-xs text-amber-950 font-sans">
                <div className="font-black uppercase flex items-center gap-1 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  Bài Viết Mẫu Chuẩn Điểm Tuyệt Đối (ETS Band 200)
                </div>
                <div className="whitespace-pre-line text-xs bg-white p-3 rounded border border-amber-200 leading-relaxed text-gray-800 font-serif">
                  {currentQuestion.modelAnswer}
                </div>
              </div>
            )}

            {/* Writing Textarea */}
            <div className="relative">
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder={
                  selectedPart === 1
                    ? "Nhập đúng MỘT câu miêu tả bức tranh có chứa cả 2 từ khóa..."
                    : selectedPart === 2
                    ? "Dear Mr./Ms. ...\n\nThank you for reaching out..."
                    : "Write your 300-word essay here. Structure it into Introduction, Body 1, Body 2, and Conclusion..."
                }
                rows={selectedPart === 1 ? 4 : selectedPart === 2 ? 10 : 16}
                className="w-full p-4 rounded-xl border-3 border-black text-sm sm:text-base font-sans focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all shadow-[inner_0_2px_4px_rgba(0,0,0,0.06)] resize-y"
              />
            </div>

            {/* Action Bar */}
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

          {/* AI EVALUATION RESULTS PANEL */}
          {evaluationResult && (
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] animate-fadeIn flex flex-col gap-5">
              
              {/* Score Header Card */}
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

                <div className="bg-white px-4 py-2 rounded-xl border-2 border-black font-black text-center shadow-[2px_2px_0px_#000]">
                  <div className="text-[10px] text-gray-500 uppercase">Xếp Loại</div>
                  <div className="text-sm sm:text-base text-pink-600">
                    {evaluationResult.score === evaluationResult.maxScore ? '🌟 Xuất Sắc' : evaluationResult.score >= (evaluationResult.maxScore * 0.7) ? '👍 Rất Tốt' : '💪 Đang Tiến Bộ'}
                  </div>
                </div>
              </div>

              {/* Coach Comment for Nóc Nhà */}
              <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-300 flex items-start gap-3">
                <span className="text-2xl">👸</span>
                <div>
                  <div className="font-black text-xs uppercase text-pink-900">Lời Nhắn Từ Huấn Luyện Viên:</div>
                  <p className="text-xs sm:text-sm text-pink-950 font-bold mt-0.5 leading-relaxed">
                    "{evaluationResult.coachComment}"
                  </p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-300">
                  <div className="font-black text-xs text-emerald-950 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Điểm Sáng Của Bài Viết:
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {evaluationResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-300">
                  <div className="font-black text-xs text-amber-950 uppercase flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Điểm Cần Khắc Phục:
                  </div>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {evaluationResult.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grammar Corrections */}
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

              {/* Vocabulary Upgrades */}
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

              {/* Model Answer from AI */}
              {evaluationResult.modelAnswer && (
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-300">
                  <div className="font-black text-xs text-gray-700 uppercase mb-1.5">
                    Bài Viết Tham Khảo Hoàn Hảo:
                  </div>
                  <div className="whitespace-pre-line text-xs font-serif leading-relaxed text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                    {evaluationResult.modelAnswer}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

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
