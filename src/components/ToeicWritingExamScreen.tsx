import React, { useState, useEffect, useMemo } from 'react';
import {
  TOEIC_WRITING_QUESTIONS,
  TOEIC_WRITING_TESTS,
  WritingQuestion,
} from '../data/toeicWritingData';
import {
  gradeWritingWithAi,
  AiEvaluationResult,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
  checkKeywordUsed,
  saveSwExamHistory,
} from '../utils/aiGrader';
import { sounds } from '../utils/soundEffects';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Lightbulb,
  TrendingUp,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicWritingExamScreenProps {
  testId: string;
  initialMode?: 'FULL' | 'PRACTICE';
  initialPartFilter?: number | null;
  onBack: () => void;
  nickname: string;
}

type TimerBucketKey = 'PART1' | 'Q6' | 'Q7' | 'Q8';

const DEFAULT_TIMERS: Record<TimerBucketKey, number> = {
  PART1: 8 * 60, // 8 minutes shared for Questions 1-5 (official ETS rule)
  Q6: 10 * 60, // 10 minutes for Question 6
  Q7: 10 * 60, // 10 minutes for Question 7
  Q8: 30 * 60, // 30 minutes for Question 8 (300-word Essay)
};

function getBucketForQuestion(q: WritingQuestion): TimerBucketKey {
  if (q.part === 1) return 'PART1';
  if (q.questionNumber === 6) return 'Q6';
  if (q.questionNumber === 7) return 'Q7';
  return 'Q8';
}

export const ToeicWritingExamScreen: React.FC<ToeicWritingExamScreenProps> = ({
  testId,
  initialMode = 'FULL',
  initialPartFilter = null,
  onBack,
  nickname,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testId || 'study4-wr-01');
  const [partFilter, setPartFilter] = useState<number | null>(initialPartFilter);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Persistent per-question drafts & evaluations (auto-saved to localStorage — ZERO data loss when switching Q1..Q8!)
  const [draftsByQid, setDraftsByQid] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(`toeic_wr_drafts_${testId || 'study4-wr-01'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [evalsByQid, setEvalsByQid] = useState<Record<string, AiEvaluationResult>>({});

  // Official ETS bucketed timers (Part 1 shares 8m across Q1-Q5!)
  const [timersByBucket, setTimersByBucket] = useState<Record<TimerBucketKey, number>>({
    ...DEFAULT_TIMERS,
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(initialMode === 'FULL');

  // UI Toggles & Settings
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiApiKey());
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredGeminiApiKey()));
  const [showTemplate, setShowTemplate] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // AI Grading State
  const [isGrading, setIsGrading] = useState(false);
  const [isGradingFullTest, setIsGradingFullTest] = useState(false);
  const [fullTestSummaryBand, setFullTestSummaryBand] = useState<number | null>(null);

  const questionsInTest = useMemo(() => {
    const base = TOEIC_WRITING_QUESTIONS.filter((q) => q.testId === selectedTestId);
    if (partFilter) {
      const filtered = base.filter((q) => q.part === partFilter);
      return filtered.length > 0 ? filtered : base;
    }
    return base;
  }, [selectedTestId, partFilter]);

  const currentQuestion: WritingQuestion =
    questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_WRITING_QUESTIONS[0];

  const currentTestMeta =
    TOEIC_WRITING_TESTS.find((t) => t.id === selectedTestId) || TOEIC_WRITING_TESTS[0];

  const currentDraft = draftsByQid[currentQuestion.id] || '';
  const currentEvaluation = evalsByQid[currentQuestion.id] || null;
  const currentBucket = getBucketForQuestion(currentQuestion);
  const secondsRemaining = timersByBucket[currentBucket];

  useEffect(() => {
    if (testId && testId !== selectedTestId) {
      setSelectedTestId(testId);
      setCurrentQuestionIndex(0);
    }
  }, [testId]);

  // Load saved drafts from localStorage when switching tests
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`toeic_wr_drafts_${selectedTestId}`);
      setDraftsByQid(saved ? JSON.parse(saved) : {});
    } catch {
      setDraftsByQid({});
    }
    setEvalsByQid({});
    setTimersByBucket({ ...DEFAULT_TIMERS });
    setFullTestSummaryBand(null);
  }, [selectedTestId]);

  // Auto-save drafts to localStorage on every edit
  useEffect(() => {
    try {
      localStorage.setItem(`toeic_wr_drafts_${selectedTestId}`, JSON.stringify(draftsByQid));
    } catch {}
  }, [draftsByQid, selectedTestId]);

  // Hide template/model hints when switching question, WITHOUT clearing drafts or resetting Part 1's shared 8-minute timer!
  useEffect(() => {
    setShowTemplate(false);
    setShowModelAnswer(false);
  }, [currentQuestion.id]);

  // Active bucket countdown
  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimersByBucket((prev) => {
        const cur = prev[currentBucket];
        if (cur <= 1) {
          setIsTimerRunning(false);
          sounds.playWrong();
          return { ...prev, [currentBucket]: 0 };
        }
        return { ...prev, [currentBucket]: cur - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsRemaining, currentBucket]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = currentDraft.trim() ? currentDraft.trim().split(/\s+/).length : 0;

  const updateCurrentDraft = (val: string) => {
    setDraftsByQid((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  const evaluateSingleWritingQuestion = async (q: WritingQuestion, submission: string) => {
    const partType = q.part === 1 ? 'SENTENCE' : q.part === 2 ? 'EMAIL' : 'ESSAY';
    const fullPrompt =
      q.part === 2 && q.emailContext
        ? `Received Email:\nSubject: ${q.emailContext.subject}\n${q.emailContext.body}\n\nDirections: ${q.promptText}`
        : q.promptText;

    return gradeWritingWithAi({
      partType,
      prompt: fullPrompt,
      userSubmission: submission,
      keywords: q.keywords,
      referenceModel: q.modelAnswer,
    });
  };

  const handleGradeCurrentQuestion = async () => {
    if (!currentDraft.trim()) {
      alert('Vui lòng nhập bài viết vào ô soạn thảo trước khi chấm điểm AI!');
      return;
    }

    setIsGrading(true);
    sounds.playClick();

    try {
      const result = await evaluateSingleWritingQuestion(currentQuestion, currentDraft);
      const nextEvals = { ...evalsByQid, [currentQuestion.id]: result };
      setEvalsByQid(nextEvals);

      const gradedValues = Object.values(nextEvals);
      if (gradedValues.length > 0) {
        const avgBand =
          Math.round(
            gradedValues.reduce((acc, r) => acc + r.estimatedToeicBand, 0) /
              gradedValues.length /
              10
          ) * 10;
        saveSwExamHistory({
          testId: selectedTestId,
          skill: 'WRITING',
          estimatedBand: avgBand,
          answeredCount: gradedValues.length,
          totalQuestions: questionsInTest.length,
          updatedAt: new Date().toISOString(),
        });
      }

      if (result.estimatedToeicBand >= 150) {
        sounds.playCorrect();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
    } catch {
      alert('Chấm điểm thất bại. Vui lòng thử lại!');
    } finally {
      setIsGrading(false);
    }
  };

  const handleSubmitFullTest = async () => {
    const answeredQuestions = questionsInTest.filter(
      (q) => (draftsByQid[q.id] || '').trim().length > 0
    );
    if (answeredQuestions.length === 0) {
      alert('Bạn chưa viết câu trả lời nào trong đề này để nộp bài!');
      return;
    }

    setIsGradingFullTest(true);
    sounds.playClick();
    try {
      const updatedEvals = { ...evalsByQid };
      for (const q of answeredQuestions) {
        if (!updatedEvals[q.id]) {
          updatedEvals[q.id] = await evaluateSingleWritingQuestion(q, draftsByQid[q.id]);
        }
      }
      setEvalsByQid(updatedEvals);

      const bands = answeredQuestions.map((q) => updatedEvals[q.id]?.estimatedToeicBand || 0);
      const overallBand =
        Math.round(bands.reduce((a, b) => a + b, 0) / bands.length / 10) * 10;
      setFullTestSummaryBand(overallBand);

      saveSwExamHistory({
        testId: selectedTestId,
        skill: 'WRITING',
        estimatedBand: overallBand,
        answeredCount: answeredQuestions.length,
        totalQuestions: questionsInTest.length,
        updatedAt: new Date().toISOString(),
      });

      sounds.playCorrect();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } finally {
      setIsGradingFullTest(false);
    }
  };

  const handleSaveApiKey = () => {
    saveStoredGeminiApiKey(apiKeyInput.trim());
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setApiKeyModalOpen(false);
    sounds.playCorrect();
  };

  const answeredCount = questionsInTest.filter(
    (q) => (draftsByQid[q.id] || '').trim().length > 0
  ).length;

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto w-full">
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 bg-white p-3 sm:p-4 rounded-2xl border-3 border-black shadow-neo flex-wrap">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Danh Sách Đề Study4
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">✍️</span>
          <div>
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              {currentTestMeta.name}{' '}
              <span className="text-xs font-mono bg-black text-[#FFDE59] px-2 py-0.5 rounded ml-1">
                #{currentTestMeta.study4Id}
              </span>
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              Đã viết: {answeredCount}/{questionsInTest.length} câu • Tự động lưu nháp khi chuyển câu
            </p>
          </div>
        </div>

        <button
          onClick={() => setApiKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-neo-sm cursor-pointer ${
            hasApiKey ? 'bg-emerald-100 text-emerald-950' : 'bg-yellow-200 text-yellow-950'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{hasApiKey ? 'Gemini AI Sẵn Sàng' : 'Cài API Key'}</span>
        </button>
      </div>

      {/* Full-Test Overall Score Banner */}
      {fullTestSummaryBand !== null && (
        <div className="w-full mb-4 bg-gradient-to-r from-amber-200 via-yellow-200 to-emerald-200 border-3 border-black p-4 rounded-2xl shadow-neo flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-700 shrink-0" />
            <div>
              <div className="text-xs font-black uppercase text-gray-800">
                Tổng Kết Đề Thi {currentTestMeta.name}
              </div>
              <div className="text-xl sm:text-2xl font-black text-black">
                Band Điểm Ước Tính: {fullTestSummaryBand} / 200 Điểm TOEIC Writing
              </div>
            </div>
          </div>
          <span className="text-xs font-black bg-black text-[#FFDE59] px-3 py-1.5 rounded-xl">
            Đã lưu lịch sử làm bài ✓
          </span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Test & Part Switcher */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo space-y-3">
            <div>
              <label className="block text-xs uppercase font-black tracking-wider text-gray-600 mb-1.5">
                Đổi Bộ Đề Study4 (10 Đề Gốc):
              </label>
              <select
                value={selectedTestId}
                onChange={(e) => {
                  sounds.playClick();
                  setSelectedTestId(e.target.value);
                  setCurrentQuestionIndex(0);
                }}
                className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs sm:text-sm focus:outline-none"
              >
                {TOEIC_WRITING_TESTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (#{t.study4Id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-black text-gray-500 mb-1">
                Chế Độ Phần Thi:
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => {
                    setPartFilter(null);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer ${
                    partFilter === null ? 'bg-black text-[#FFDE59]' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Full (8 câu)
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPartFilter(p);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer ${
                      partFilter === p ? 'bg-black text-[#FFDE59]' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Grid (1 - 8) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-600">
                Bảng Câu Hỏi ({questionsInTest.length} Câu):
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-black">
                Part {currentQuestion.part}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {questionsInTest.map((q, idx) => {
                const isActive = idx === currentQuestionIndex;
                const hasDraft = Boolean((draftsByQid[q.id] || '').trim());
                const hasGraded = Boolean(evalsByQid[q.id]);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`p-3 rounded-xl border-2 border-black font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#FFDE59] text-black shadow-neo-sm scale-105'
                        : hasGraded
                        ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                        : hasDraft
                        ? 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                        : 'bg-gray-50 hover:bg-amber-50 text-gray-800'
                    }`}
                  >
                    <span className="text-[10px] opacity-70 font-bold">P{q.part}</span>
                    <span>Q{q.questionNumber}</span>
                    {hasGraded && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmitFullTest}
              disabled={isGradingFullTest || answeredCount === 0}
              className={`mt-4 w-full py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs uppercase shadow-neo-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isGradingFullTest || answeredCount === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF9800] hover:bg-[#fb8c00] text-black'
              }`}
            >
              <Trophy className="w-4 h-4" />
              {isGradingFullTest
                ? 'Đang Chấm Tổng Đề...'
                : `Nộp Đề & Chấm Tổng Điểm (${answeredCount}/${questionsInTest.length})`}
            </button>
          </div>

          {/* ETS Tips */}
          <div className="bg-[#FFF9C4] p-4 rounded-2xl border-3 border-black shadow-neo text-xs">
            <div className="flex items-center gap-1.5 font-black uppercase mb-2 text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400" />
              Mẹo Ăn Điểm Tuyệt Đối ETS:
            </div>
            <ul className="space-y-1.5 text-amber-950 font-medium">
              {currentQuestion.tipsVi.map((tip, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="font-black">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Prompt Card */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b-2 border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-[#FFDE59] font-mono">
                  {currentQuestion.partTitle}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1 font-heading text-black">
                  Câu {currentQuestion.questionNumber} / 8
                </h2>
              </div>

              {/* Official ETS Timer */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs sm:text-sm ${
                    isTimerRunning ? 'bg-amber-300' : 'bg-gray-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>
                    {currentBucket === 'PART1' ? 'Cụm Q1–Q5: ' : ''}
                    {formatTimer(secondsRemaining)}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsTimerRunning(!isTimerRunning);
                    }}
                    className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase rounded cursor-pointer"
                  >
                    {isTimerRunning ? 'Tạm dừng' : 'Chạy giờ'}
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setTimersByBucket((prev) => ({
                        ...prev,
                        [currentBucket]: DEFAULT_TIMERS[currentBucket],
                      }));
                    }}
                    className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                    title="Đặt lại đồng hồ phần này"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-800/20 text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
              👉 {currentQuestion.directionsVi}
            </div>

            {/* PART 1: Authentic Study4 Image + Realtime Keyword Checker Pills */}
            {currentQuestion.part === 1 && (
              <div className="flex flex-col gap-3">
                {currentQuestion.imageUrl && (
                  <div className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl border-2 border-black overflow-hidden">
                    <img
                      src={currentQuestion.imageUrl}
                      alt={`TOEIC Writing ${currentQuestion.testName} Q${currentQuestion.questionNumber}`}
                      className="max-h-[380px] w-auto object-contain rounded-lg bg-white"
                      onError={(e) => {
                        const imgEl = e.currentTarget;
                        if (
                          currentQuestion.cdnImageUrl &&
                          imgEl.src !== currentQuestion.cdnImageUrl
                        ) {
                          imgEl.src = currentQuestion.cdnImageUrl;
                        }
                      }}
                    />
                  </div>
                )}

                {currentQuestion.keywords && (
                  <div className="flex items-center gap-2 flex-wrap p-3.5 bg-yellow-50 rounded-xl border-2 border-black">
                    <span className="font-black text-xs uppercase text-gray-900">
                      2 Từ Khóa Gốc Study4 (Tự động kiểm tra realtime):
                    </span>
                    {currentQuestion.keywords.map((kw, i) => {
                      const used = checkKeywordUsed(currentDraft, kw);
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1 font-black text-xs rounded-lg font-mono border-2 border-black shadow-neo-sm transition-all flex items-center gap-1.5 ${
                            used
                              ? 'bg-emerald-300 text-emerald-950'
                              : 'bg-black text-yellow-300'
                          }`}
                        >
                          <span>{used ? '✓' : '○'}</span>
                          <span>{kw}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PART 2: Authentic Study4 Email & Verbatim Directions */}
            {currentQuestion.part === 2 && currentQuestion.emailContext && (
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-black text-xs sm:text-sm flex flex-col gap-3">
                <div className="flex flex-col gap-1 pb-2.5 border-b-2 border-gray-200 font-mono text-gray-800">
                  <div>
                    <strong>From:</strong> {currentQuestion.emailContext.from}
                  </div>
                  <div>
                    <strong>To:</strong> {currentQuestion.emailContext.to}
                  </div>
                  <div>
                    <strong>Subject:</strong>{' '}
                    <span className="font-black text-black">
                      {currentQuestion.emailContext.subject}
                    </span>
                  </div>
                  <div>
                    <strong>Sent:</strong> {currentQuestion.emailContext.date}
                  </div>
                </div>
                <div className="whitespace-pre-line text-gray-900 leading-relaxed font-medium">
                  {currentQuestion.emailContext.body}
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl border-2 border-cyan-500 text-xs sm:text-sm text-cyan-950 font-bold">
                  <div className="uppercase font-black text-[11px] text-cyan-900 mb-1">
                    📌 Directions Gốc Từ Đề Thi Study4:
                  </div>
                  {currentQuestion.emailContext.directions || currentQuestion.promptText}
                </div>
              </div>
            )}

            {/* PART 3: Verbatim Study4 Opinion Essay Prompt */}
            {currentQuestion.part === 3 && (
              <div className="p-4 bg-orange-50 rounded-xl border-2 border-black flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-black text-xs uppercase text-orange-950">
                    📝 Đề Bài Luận Gốc Study4 (Mục tiêu ≥ 300 Từ • 30 Phút):
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed font-bold">
                  "{currentQuestion.promptText}"
                </p>
              </div>
            )}
          </div>

          {/* Writing Editor Workspace */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100 flex-wrap gap-2">
              <span className="font-black text-xs uppercase tracking-wider text-gray-600">
                Bài Làm Câu {currentQuestion.questionNumber} (Đã Bật Auto-Save Chống Mất Bài):
              </span>
              <div className="flex items-center gap-2 text-xs font-black">
                <span
                  className={`px-3 py-1 rounded-lg border-2 border-black transition-colors ${
                    currentQuestion.part === 3 && wordCount >= 300
                      ? 'bg-emerald-300 text-emerald-950'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  Số từ: {wordCount} từ
                  {currentQuestion.part === 3
                    ? wordCount >= 300
                      ? ' ✓ Đạt chuẩn 300+'
                      : ' / 300 từ tối thiểu'
                    : ''}
                </span>
              </div>
            </div>

            <textarea
              rows={currentQuestion.part === 1 ? 3 : currentQuestion.part === 2 ? 9 : 14}
              placeholder={
                currentQuestion.part === 1
                  ? 'Nhập 1 câu hoàn chỉnh miêu tả bức tranh có chứa đủ 2 từ khóa...'
                  : currentQuestion.part === 2
                  ? 'Dear ...,\n\nThank you for your e-mail...\n\nBest regards,'
                  : 'Write your opinion essay (300+ words) with clear Introduction, Body Paragraphs, and Conclusion...'
              }
              value={currentDraft}
              onChange={(e) => updateCurrentDraft(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl font-sans text-sm sm:text-base leading-relaxed text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                {currentQuestion.templateVi && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowTemplate(!showTemplate);
                    }}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 border-2 border-black font-black text-xs rounded-lg shadow-neo-sm cursor-pointer"
                  >
                    {showTemplate ? 'Ẩn Khung Dàn Ý' : '💡 Khung Dàn Ý'}
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowModelAnswer(!showModelAnswer);
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black font-black text-xs rounded-lg shadow-neo-sm cursor-pointer"
                >
                  {showModelAnswer ? 'Ẩn Bài Mẫu' : '📖 Bài Mẫu Band 200'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGradeCurrentQuestion}
                  disabled={isGrading || !currentDraft.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo transition-all cursor-pointer ${
                    isGrading || !currentDraft.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FF9800] hover:bg-[#fb8c00] text-black'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isGrading ? 'animate-spin' : ''}`} />
                  {isGrading ? 'AI Đang Sửa Bài...' : 'Chấm & Sửa Câu Này'}
                </button>

                {currentQuestionIndex < questionsInTest.length - 1 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex((i) => i + 1);
                    }}
                    className="px-4 py-2.5 rounded-xl border-3 border-black bg-gray-100 hover:bg-gray-200 font-black text-xs sm:text-sm uppercase shadow-neo cursor-pointer"
                  >
                    Câu Tiếp ➔
                  </button>
                )}
              </div>
            </div>

            {showTemplate && currentQuestion.templateVi && (
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-amber-300 text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed mt-2">
                <div className="font-black text-amber-950 uppercase mb-1">
                  Khung Dàn Bài Gợi Ý:
                </div>
                {currentQuestion.templateVi}
              </div>
            )}

            {showModelAnswer && (
              <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed mt-2">
                <div className="font-black text-emerald-950 uppercase mb-1">
                  Bài Viết Mẫu Tham Khảo (Band 190–200 ETS):
                </div>
                {currentQuestion.modelAnswer}
              </div>
            )}
          </div>

          {/* Side-by-Side Comparison & AI Evaluation Result */}
          {currentEvaluation && (
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-amber-200 via-yellow-200 to-emerald-200 p-4 rounded-xl border-3 border-black flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-black text-black/70">
                    Kết Quả Chấm AI — Câu {currentQuestion.questionNumber}
                  </div>
                  <div className="text-2xl font-black text-black flex items-baseline gap-2 mt-0.5 flex-wrap">
                    <span>
                      {currentEvaluation.score} / {currentEvaluation.maxScore} Điểm Rubric
                    </span>
                    <span className="text-sm font-bold bg-black text-[#FFDE59] px-2.5 py-0.5 rounded-full">
                      Quy đổi Band: {currentEvaluation.estimatedToeicBand} / 200
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-300 text-xs sm:text-sm text-pink-950 font-bold">
                💬 "{currentEvaluation.coachComment}"
              </div>

              {/* Side-by-Side: Your Submission vs Reference Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border-2 border-black bg-gray-50">
                  <div className="font-black text-xs uppercase text-gray-700 mb-1.5">
                    ✍️ Bài Viết Của Bạn:
                  </div>
                  <div className="text-xs text-gray-900 whitespace-pre-line leading-relaxed">
                    {currentDraft}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/70">
                  <div className="font-black text-xs uppercase text-emerald-900 mb-1.5">
                    🏆 Bài Mẫu Chuẩn ETS / AI Đề Xuất:
                  </div>
                  <div className="text-xs text-emerald-950 whitespace-pre-line leading-relaxed">
                    {currentEvaluation.modelAnswer || currentQuestion.modelAnswer}
                  </div>
                </div>
              </div>

              {/* Grammar Corrections */}
              {currentEvaluation.grammarCorrections &&
                currentEvaluation.grammarCorrections.length > 0 && (
                  <div className="p-4 bg-rose-50 rounded-xl border-2 border-rose-300">
                    <div className="font-black text-xs text-rose-950 uppercase mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Sửa Lỗi Ngữ Pháp Chi Tiết:
                    </div>
                    <div className="space-y-2">
                      {currentEvaluation.grammarCorrections.map((corr, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-white p-2.5 rounded-lg border border-rose-200 text-xs"
                        >
                          <div className="text-rose-700 line-through">❌ {corr.original}</div>
                          <div className="text-emerald-700 font-bold mt-0.5">
                            ➔ {corr.corrected}
                          </div>
                          <div className="text-gray-600 text-[11px] mt-0.5">{corr.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Vocab Upgrades C1 */}
              {currentEvaluation.vocabUpgrades && currentEvaluation.vocabUpgrades.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
                  <div className="font-black text-xs text-purple-950 uppercase mb-2">
                    🚀 Nâng Cấp Từ Vựng Thương Mại Band C1:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentEvaluation.vocabUpgrades.map((up, uIdx) => (
                      <div
                        key={uIdx}
                        className="bg-white p-2.5 rounded-lg border border-purple-200 text-xs"
                      >
                        <div>
                          <span className="text-gray-500">{up.originalWord}</span> ➔{' '}
                          <strong className="text-purple-900">{up.betterWord}</strong>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5">{up.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-300">
                  <div className="font-black text-xs text-emerald-950 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ưu Điểm:
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {currentEvaluation.strengths.map((str, i) => (
                      <li key={i}>• {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-300">
                  <div className="font-black text-xs text-amber-950 uppercase flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Hướng Cải Thiện:
                  </div>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {currentEvaluation.improvements.map((imp, i) => (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border-4 border-black p-6 rounded-2xl max-w-md w-full shadow-neo flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase">Cài Đặt Gemini API Key</h3>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="font-black text-lg p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-700 font-bold leading-relaxed">
              Nhập khóa Google Gemini API để chấm bài viết, phát hiện lỗi ngữ pháp và gợi ý nâng cấp từ vựng C1 theo Rubric ETS (lưu an toàn tại trình duyệt của bạn).
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl border-2 border-black font-black text-xs bg-gray-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs bg-[#FFDE59] shadow-neo-sm cursor-pointer"
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
