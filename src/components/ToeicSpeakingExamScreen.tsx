import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TOEIC_SPEAKING_QUESTIONS,
  TOEIC_SPEAKING_TESTS,
  SpeakingQuestion,
} from '../data/toeicSpeakingData';
import {
  gradeSpeakingWithAi,
  AiEvaluationResult,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
  saveSwExamHistory,
} from '../utils/aiGrader';
import { sounds } from '../utils/soundEffects';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Play,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Lightbulb,
  TrendingUp,
  VolumeX,
  Radio,
  Trophy,
  Headphones,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DoodleMic,
  DoodlePin,
  DoodleBook,
  DoodleBulb,
  DoodleStar,
  MascotSticker,
} from './DoodleIcons';

interface ToeicSpeakingExamScreenProps {
  testId: string;
  initialMode?: 'FULL' | 'PRACTICE';
  initialPartFilter?: number | null;
  onBack: () => void;
  nickname: string;
}

interface QuestionAttemptState {
  transcription: string;
  recordedAudioUrl: string | null;
  evaluation: AiEvaluationResult | null;
}

function playExamBeep(freq = 880, durationMs = 220) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {}
}

export const ToeicSpeakingExamScreen: React.FC<ToeicSpeakingExamScreenProps> = ({
  testId,
  initialMode = 'FULL',
  initialPartFilter = null,
  onBack,
  nickname,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testId || 'study4-sp-01');
  const [partFilter, setPartFilter] = useState<number | null>(initialPartFilter);
  const [autoFlowEnabled, setAutoFlowEnabled] = useState<boolean>(initialMode === 'FULL');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Persistent per-question state so switching Q1..Q11 NEVER erases user recordings/transcripts!
  const [attemptsByQid, setAttemptsByQid] = useState<Record<string, QuestionAttemptState>>({});

  // Settings
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiApiKey());
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredGeminiApiKey()));

  // Active Recording & Audio Playback State
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [isSpeakingModelTts, setIsSpeakingModelTts] = useState(false);
  const [isPlayingPromptAudio, setIsPlayingPromptAudio] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Timers
  const [prepSeconds, setPrepSeconds] = useState(45);
  const [isPrepRunning, setIsPrepRunning] = useState(false);
  const [speakSeconds, setSpeakSeconds] = useState(45);
  const [isSpeakRunning, setIsSpeakRunning] = useState(false);

  // AI Grading State
  const [isGrading, setIsGrading] = useState(false);
  const [isGradingFullTest, setIsGradingFullTest] = useState(false);
  const [fullTestSummaryBand, setFullTestSummaryBand] = useState<number | null>(null);

  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const promptAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeQidRef = useRef<string>('');

  const questionsInTest = useMemo(() => {
    const base = TOEIC_SPEAKING_QUESTIONS.filter((q) => q.testId === selectedTestId);
    if (partFilter) {
      const filtered = base.filter((q) => q.part === partFilter);
      return filtered.length > 0 ? filtered : base;
    }
    return base;
  }, [selectedTestId, partFilter]);

  const currentQuestion: SpeakingQuestion =
    questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_SPEAKING_QUESTIONS[0];

  activeQidRef.current = currentQuestion.id;

  const currentAttempt: QuestionAttemptState = attemptsByQid[currentQuestion.id] || {
    transcription: '',
    recordedAudioUrl: null,
    evaluation: null,
  };

  const currentTestMeta =
    TOEIC_SPEAKING_TESTS.find((t) => t.id === selectedTestId) || TOEIC_SPEAKING_TESTS[0];

  const updateAttempt = (qid: string, patch: Partial<QuestionAttemptState>) => {
    setAttemptsByQid((prev) => {
      const existing = prev[qid] || { transcription: '', recordedAudioUrl: null, evaluation: null };
      return {
        ...prev,
        [qid]: { ...existing, ...patch },
      };
    });
  };

  useEffect(() => {
    if (testId && testId !== selectedTestId) {
      setSelectedTestId(testId);
      setCurrentQuestionIndex(0);
    }
  }, [testId]);

  // Reset only active timers/players on question switch — keep attemptsByQid 100% preserved!
  useEffect(() => {
    stopRecording();
    stopModelTts();
    if (promptAudioRef.current) {
      promptAudioRef.current.pause();
      promptAudioRef.current.currentTime = 0;
    }
    setIsPlayingPromptAudio(false);
    setRecognitionError(null);
    setShowModelAnswer(false);
    setIsPrepRunning(false);
    setIsSpeakRunning(false);
    if (currentQuestion) {
      setPrepSeconds(currentQuestion.prepTimeSeconds);
      setSpeakSeconds(currentQuestion.speakTimeSeconds);
    }
    const nextQuestion = questionsInTest[currentQuestionIndex + 1];
    sounds.enqueuePrefetch([
      currentQuestion?.targetScript,
      currentQuestion?.modelAnswer,
      currentQuestion?.promptText,
      nextQuestion?.targetScript,
      nextQuestion?.modelAnswer,
    ]);
  }, [selectedTestId, currentQuestionIndex, partFilter]);

  useEffect(() => {
    return () => {
      sounds.stopSpeaking();
    };
  }, []);

  // Prep Timer Countdown
  useEffect(() => {
    if (!isPrepRunning || prepSeconds <= 0) return;
    const timer = setInterval(() => {
      setPrepSeconds((prev) => {
        if (prev <= 1) {
          setIsPrepRunning(false);
          playExamBeep(1046, 280);
          if (autoFlowEnabled) {
            void startRecording();
          } else {
            setIsSpeakRunning(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPrepRunning, prepSeconds, autoFlowEnabled]);

  // Speak Timer Countdown
  useEffect(() => {
    if (!isSpeakRunning || speakSeconds <= 0) return;
    const timer = setInterval(() => {
      setSpeakSeconds((prev) => {
        if (prev <= 1) {
          setIsSpeakRunning(false);
          playExamBeep(660, 300);
          if (isRecording) {
            stopRecording();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSpeakRunning, speakSeconds, isRecording]);

  // Web Speech API Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const qid = activeQidRef.current;
        if (qid) {
          updateAttempt(qid, { transcription: fullTranscript.trim() });
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setRecognitionError(`Lỗi nhận diện giọng nói: ${event.error}`);
        }
      };

      recognitionRef.current = recognition;
    }
    return () => {
      stopRecording();
      stopModelTts();
    };
  }, []);

  const startIigAutoFlowForCurrentQuestion = () => {
    stopModelTts();
    sounds.playClick();
    setPrepSeconds(currentQuestion.prepTimeSeconds);
    setSpeakSeconds(currentQuestion.speakTimeSeconds);
    if (currentQuestion.audioUrl && promptAudioRef.current) {
      setIsPlayingPromptAudio(true);
      promptAudioRef.current.currentTime = 0;
      promptAudioRef.current
        .play()
        .catch(() => {
          setIsPlayingPromptAudio(false);
          playExamBeep(880, 200);
          setIsPrepRunning(true);
        });
    } else {
      playExamBeep(880, 200);
      setIsPrepRunning(true);
    }
  };

  const startRecording = async () => {
    stopModelTts();
    if (promptAudioRef.current && !promptAudioRef.current.paused) {
      promptAudioRef.current.pause();
      setIsPlayingPromptAudio(false);
    }
    try {
      const qid = currentQuestion.id;
      setRecognitionError(null);
      updateAttempt(qid, { transcription: '', recordedAudioUrl: null });
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        updateAttempt(qid, { recordedAudioUrl: audioUrl });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setSpeakSeconds(currentQuestion.speakTimeSeconds);
      setIsSpeakRunning(true);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch {
      setRecognitionError(
        'Không thể truy cập Microphone. Bạn cũng có thể gõ/chỉnh sửa trực tiếp nội dung câu trả lời vào ô bên dưới để chấm thử bằng AI!'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    setIsSpeakRunning(false);
  };

  const playModelTts = (text: string) => {
    if (!text) return;
    if (promptAudioRef.current && !promptAudioRef.current.paused) {
      promptAudioRef.current.pause();
      setIsPlayingPromptAudio(false);
    }
    sounds.playClick();
    setIsSpeakingModelTts(true);
    sounds.speakEnglish(text).finally(() => {
      setIsSpeakingModelTts(false);
    });
  };

  const stopModelTts = () => {
    sounds.stopSpeaking();
    setIsSpeakingModelTts(false);
  };

  const evaluateSingleQuestion = async (q: SpeakingQuestion, transcriptText: string) => {
    const partType =
      q.part === 1
        ? 'READ_ALOUD'
        : q.part === 2
        ? 'DESCRIBE_PICTURE'
        : q.part === 5
        ? 'EXPRESS_OPINION'
        : 'RESPOND_QUESTIONS';

    return gradeSpeakingWithAi({
      partType,
      prompt: q.contextText ? `${q.contextText}\nQuestion: ${q.promptText}` : q.promptText,
      transcription: transcriptText || 'No clear speech detected',
      targetScript: q.targetScript,
      referenceModel: q.modelAnswer,
      scheduleContext: q.scheduleTranscript,
    });
  };

  const handleGradeCurrentQuestion = async () => {
    const q = currentQuestion;
    const textToEvaluate = currentAttempt.transcription.trim();
    if (!textToEvaluate) {
      alert('Bạn hãy thu âm giọng nói (hoặc nhập bản ghi câu trả lời) trước khi chấm điểm AI nhé!');
      return;
    }
    setIsGrading(true);
    sounds.playClick();
    try {
      const result = await evaluateSingleQuestion(q, textToEvaluate);
      updateAttempt(q.id, { evaluation: result });

      // Update saved test history
      const allEvals = { ...attemptsByQid, [q.id]: { ...currentAttempt, evaluation: result } };
      const gradedList = questionsInTest
        .map((item) => allEvals[item.id]?.evaluation)
        .filter(Boolean) as AiEvaluationResult[];
      if (gradedList.length > 0) {
        const avgBand =
          Math.round(
            gradedList.reduce((acc, r) => acc + r.estimatedToeicBand, 0) / gradedList.length / 10
          ) * 10;
        saveSwExamHistory({
          testId: selectedTestId,
          skill: 'SPEAKING',
          estimatedBand: avgBand,
          answeredCount: gradedList.length,
          totalQuestions: questionsInTest.length,
          updatedAt: new Date().toISOString(),
        });
      }

      if (result.estimatedToeicBand >= 150) {
        sounds.playCorrect();
        confetti({ particleCount: 45, spread: 65, origin: { y: 0.65 } });
      }
    } catch {
      alert('Chấm điểm thất bại. Vui lòng thử lại!');
    } finally {
      setIsGrading(false);
    }
  };

  const handleSubmitFullTestGrading = async () => {
    const answeredQuestions = questionsInTest.filter(
      (q) => (attemptsByQid[q.id]?.transcription || '').trim().length > 0
    );
    if (answeredQuestions.length === 0) {
      alert('Bạn chưa thu âm/trả lời câu hỏi nào trong đề này để nộp bài!');
      return;
    }

    setIsGradingFullTest(true);
    sounds.playClick();
    try {
      const updatedMap = { ...attemptsByQid };
      for (const q of answeredQuestions) {
        if (!updatedMap[q.id]?.evaluation) {
          const ev = await evaluateSingleQuestion(q, updatedMap[q.id].transcription);
          updatedMap[q.id] = { ...updatedMap[q.id], evaluation: ev };
        }
      }
      setAttemptsByQid(updatedMap);

      const bands = answeredQuestions.map(
        (q) => updatedMap[q.id]?.evaluation?.estimatedToeicBand || 0
      );
      const overallBand =
        Math.round(bands.reduce((a, b) => a + b, 0) / bands.length / 10) * 10;
      setFullTestSummaryBand(overallBand);

      saveSwExamHistory({
        testId: selectedTestId,
        skill: 'SPEAKING',
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
    (q) => (attemptsByQid[q.id]?.transcription || '').trim().length > 0
  ).length;

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto w-full">
      {/* Top Bar */}
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

        <div className="flex items-center gap-2.5">
          <DoodleMic size={26} />
          <div>
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              {currentTestMeta.name}{' '}
              <span className="text-xs font-mono bg-black text-[#5CE1E6] px-2 py-0.5 rounded ml-1">
                #{currentTestMeta.study4Id}
              </span>
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              Đã trả lời: {answeredCount}/{questionsInTest.length} câu • Lưu tự động khi chuyển câu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setAutoFlowEnabled(!autoFlowEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-neo-sm cursor-pointer ${
              autoFlowEnabled ? 'bg-[#5CE1E6] text-black' : 'bg-gray-100 text-gray-700'
            }`}
            title="Tự động chạy Nghe đề -> Chuẩn bị -> Bíp thu âm chuẩn phòng thi IIG"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Flow IIG: {autoFlowEnabled ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs shadow-neo-sm cursor-pointer ${
              hasApiKey ? 'bg-emerald-100 text-emerald-950' : 'bg-yellow-200 text-yellow-950'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini AI' : 'Cài API Key'}</span>
          </button>
        </div>
      </div>

      {/* Full-Test Overall Score Banner */}
      {fullTestSummaryBand !== null && (
        <div className="w-full mb-4 bg-gradient-to-r from-cyan-200 via-emerald-200 to-yellow-200 border-3 border-black p-4 rounded-2xl shadow-neo flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MascotSticker src="/doodles/mascot-victory.png" alt="Tổng kết Speaking" size={56} className="shrink-0" />
            <div>
              <div className="text-xs font-black uppercase text-gray-800">
                Tổng Kết Đề Thi {currentTestMeta.name}
              </div>
              <div className="text-xl sm:text-2xl font-black text-black">
                Band Điểm Ước Tính: {fullTestSummaryBand} / 200 Điểm TOEIC Speaking
              </div>
            </div>
          </div>
          <span className="text-xs font-black bg-black text-[#FFDE59] px-3 py-1.5 rounded-xl">
            Đã lưu lịch sử làm bài ✓
          </span>
        </div>
      )}

      {/* Main Grid */}
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
                  setFullTestSummaryBand(null);
                }}
                className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs sm:text-sm focus:outline-none"
              >
                {TOEIC_SPEAKING_TESTS.map((t) => (
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
                    partFilter === null ? 'bg-black text-[#5CE1E6]' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Full (11 câu)
                </button>
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPartFilter(p);
                      setCurrentQuestionIndex(0);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer ${
                      partFilter === p ? 'bg-black text-[#5CE1E6]' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-600">
                Bảng Câu Hỏi ({questionsInTest.length} Câu):
              </span>
              <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full border border-black">
                Part {currentQuestion.part}
              </span>
            </div>

            <div className="grid grid-cols-6 lg:grid-cols-4 gap-2">
              {questionsInTest.map((q, idx) => {
                const isActive = idx === currentQuestionIndex;
                const att = attemptsByQid[q.id];
                const hasDone = Boolean(att?.transcription?.trim() || att?.recordedAudioUrl);
                const hasGraded = Boolean(att?.evaluation);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`aspect-square rounded-xl border-2 border-black font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#5CE1E6] text-black shadow-neo-sm scale-105'
                        : hasGraded
                        ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
                        : hasDone
                        ? 'bg-yellow-100 text-yellow-950 hover:bg-yellow-200'
                        : 'bg-gray-50 hover:bg-cyan-50 text-gray-800'
                    }`}
                  >
                    <span className="text-[9px] opacity-70 font-bold">P{q.part}</span>
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
              onClick={handleSubmitFullTestGrading}
              disabled={isGradingFullTest || answeredCount === 0}
              className={`mt-4 w-full py-2.5 px-3 rounded-xl border-2 border-black font-black text-xs uppercase shadow-neo-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isGradingFullTest || answeredCount === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FFDE59] hover:bg-yellow-400 text-black'
              }`}
            >
              <Trophy className="w-4 h-4" />
              {isGradingFullTest
                ? 'Đang Chấm Tổng Đề...'
                : `Nộp Bài & Chấm Tổng Điểm (${answeredCount}/${questionsInTest.length})`}
            </button>
          </div>

          {/* ETS Tips */}
          <div className="bg-[#FFF9C4] p-4 rounded-2xl border-3 border-black shadow-neo text-xs">
            <div className="flex items-center gap-1.5 font-black uppercase mb-2 text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-400" />
              Mẹo Thi Thật ETS:
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
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-[#5CE1E6] font-mono">
                  {currentQuestion.partTitle}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1 font-heading text-black">
                  Câu {currentQuestion.questionNumber} / 11
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={startIigAutoFlowForCurrentQuestion}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-[#FFDE59] hover:bg-yellow-400 font-black text-xs shadow-neo-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Bắt Đầu Lượt Thi IIG
                </button>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs ${
                    isPrepRunning ? 'bg-amber-300 animate-pulse' : 'bg-gray-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Chuẩn bị: {prepSeconds}s</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs ${
                    isSpeakRunning ? 'bg-rose-300 animate-pulse' : 'bg-gray-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Nói: {speakSeconds}s</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 p-3 rounded-xl border-2 border-cyan-800/20 text-xs sm:text-sm text-cyan-950 font-bold">
              → {currentQuestion.directionsVi}
            </div>

            {/* Shared Context for Part 3 & Part 4 */}
            {currentQuestion.contextText && (
              <div className="p-3.5 bg-purple-50 rounded-xl border-2 border-purple-300 text-xs sm:text-sm text-purple-950 font-medium leading-relaxed">
                <div className="font-black text-[11px] uppercase text-purple-900 mb-1 flex items-center gap-1.5">
                  <DoodlePin size={14} />
                  <span>Ngữ cảnh tình huống (Study4 Context):</span>
                </div>
                {currentQuestion.contextText}
              </div>
            )}

            {/* Part 1 Reading Passage */}
            {currentQuestion.part === 1 && currentQuestion.targetScript && (
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-black font-serif text-base sm:text-lg leading-relaxed text-gray-900">
                "{currentQuestion.targetScript}"
              </div>
            )}

            {/* Part 2 Picture */}
            {currentQuestion.imageUrl && (
              <div className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-xl border-2 border-black overflow-hidden">
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Speaking Test ${currentQuestion.testName} Q${currentQuestion.questionNumber}`}
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                  onError={(e) => {
                    const imgEl = e.currentTarget;
                    if (currentQuestion.cdnImageUrl && imgEl.src !== currentQuestion.cdnImageUrl) {
                      imgEl.src = currentQuestion.cdnImageUrl;
                    }
                  }}
                />
              </div>
            )}

            {/* Part 4 Schedule Image (Tests 2-10) */}
            {currentQuestion.infoImageUrl && (
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl border-2 border-black overflow-hidden">
                <div className="text-[11px] font-black uppercase text-gray-600 mb-2 self-start flex items-center gap-1.5">
                  <DoodleBook size={15} />
                  <span>Bảng thông tin / lịch trình gốc từ Study4:</span>
                </div>
                <img
                  src={currentQuestion.infoImageUrl}
                  alt={`Part 4 Schedule ${currentQuestion.testName}`}
                  className="max-h-[460px] w-auto object-contain rounded-lg border border-gray-300 bg-white"
                  onError={(e) => {
                    const imgEl = e.currentTarget;
                    if (
                      currentQuestion.cdnInfoImageUrl &&
                      imgEl.src !== currentQuestion.cdnInfoImageUrl
                    ) {
                      imgEl.src = currentQuestion.cdnInfoImageUrl;
                    }
                  }}
                />
              </div>
            )}

            {/* Part 4 Schedule HTML Table (Test 1 - Danville City Tours) */}
            {currentQuestion.tableData && (
              <div className="rounded-xl border-2 border-black bg-white p-3.5 space-y-2.5">
                {currentQuestion.infoHeaderText && (
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed">
                    {currentQuestion.infoHeaderText}
                  </p>
                )}
                <div className="overflow-x-auto rounded-lg border border-black">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-black text-[#5CE1E6] uppercase font-black text-[11px]">
                      <tr>
                        {Object.keys(currentQuestion.tableData[0] || {}).map((header, hIdx) => (
                          <th key={hIdx} className="p-2">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentQuestion.tableData.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((val, vIdx) => (
                            <td key={vIdx} className="p-2 font-bold text-gray-800">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {currentQuestion.infoFooterText && (
                  <p className="text-xs italic text-gray-700 font-medium">
                    {currentQuestion.infoFooterText}
                  </p>
                )}
              </div>
            )}

            {/* Authentic Study4 MP3 Question Audio Player (Part 3, 4, 5) */}
            {currentQuestion.audioUrl && (
              <div className="p-3.5 bg-indigo-50 rounded-xl border-2 border-indigo-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase">
                  <Headphones className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span>Audio Câu Hỏi Gốc Study4 {isPlayingPromptAudio ? '(Đang phát...)' : ''}:</span>
                </div>
                <audio
                  ref={promptAudioRef}
                  key={currentQuestion.id}
                  controls
                  src={currentQuestion.audioUrl}
                  onPlay={() => {
                    stopModelTts();
                    setIsPlayingPromptAudio(true);
                  }}
                  onEnded={() => {
                    setIsPlayingPromptAudio(false);
                    if (autoFlowEnabled) {
                      playExamBeep(880, 200);
                      setIsPrepRunning(true);
                    }
                  }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (currentQuestion.cdnAudioUrl && el.src !== currentQuestion.cdnAudioUrl) {
                      el.src = currentQuestion.cdnAudioUrl;
                    }
                  }}
                  className="h-9 w-full sm:w-72"
                />
              </div>
            )}

            {/* Question Text for Part 3, 4, 5 */}
            {currentQuestion.part >= 3 && (
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-amber-300 font-bold text-sm sm:text-base text-gray-900">
                <div className="text-[11px] uppercase text-amber-900 font-black mb-1">
                  Câu Hỏi Đề Thi (Verbatim Study4):
                </div>
                "{currentQuestion.promptText}"
              </div>
            )}

            {/* Reference Model Answer & TTS */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowModelAnswer(!showModelAnswer);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-lg text-xs font-black shadow-neo-sm cursor-pointer"
              >
                <DoodleBook size={15} />
                <span>{showModelAnswer ? 'Ẩn Đáp Án Mẫu Tham Khảo' : 'Xem Đáp Án Mẫu Band 200'}</span>
              </button>

              <button
                onPointerEnter={() => {
                  const sample = currentQuestion.targetScript || currentQuestion.modelAnswer;
                  if (sample) sounds.prefetchEnglish(sample);
                }}
                onClick={() => {
                  if (isSpeakingModelTts) {
                    stopModelTts();
                  } else {
                    playModelTts(currentQuestion.targetScript || currentQuestion.modelAnswer);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 border-2 border-black rounded-lg text-xs font-black shadow-neo-sm cursor-pointer"
              >
                {isSpeakingModelTts ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600" />
                    <span>Dừng Đọc Mẫu</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-700" />
                    <span>Nghe Phát Âm Mẫu</span>
                  </>
                )}
              </button>
            </div>

            {showModelAnswer && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border-2 border-emerald-300 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                <div className="font-black uppercase text-[11px] text-emerald-900 mb-1">
                  Bài Nói Mẫu Tham Khảo (Band 180–200 ETS):
                </div>
                "{currentQuestion.modelAnswer}"
              </div>
            )}
          </div>

          {/* Recording & Editable Transcript Station */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <Radio
                  className={`w-4 h-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`}
                />
                Bài Thu Âm Câu {currentQuestion.questionNumber} (Tự Động Giữ Bài Khi Chuyển Câu):
              </span>
              {isRecording && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                  ● ĐANG GHI ÂM...
                </span>
              )}
            </div>

            {recognitionError && (
              <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{recognitionError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase font-black text-gray-500 mb-1">
                Bản Chép Lời Giọng Nói (Speech-to-Text • Có thể chỉnh sửa bổ sung):
              </label>
              <textarea
                rows={3}
                value={currentAttempt.transcription}
                onChange={(e) => updateAttempt(currentQuestion.id, { transcription: e.target.value })}
                placeholder="Nhấn 'Bắt Đầu Nói / Thu Âm' để giọng nói tự động chuyển thành chữ tại đây..."
                className="w-full p-3 rounded-xl border-2 border-black bg-gray-50 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {currentAttempt.recordedAudioUrl && (
              <div className="p-3 bg-cyan-50 rounded-xl border-2 border-cyan-800/30 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-black text-cyan-950 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-cyan-800 shrink-0" />
                  <span>Bản thu âm Câu {currentQuestion.questionNumber} của bạn:</span>
                </span>
                <audio src={currentAttempt.recordedAudioUrl} controls className="h-8 max-w-full" />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-3 border-black bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                  {currentAttempt.recordedAudioUrl ? 'Thu Âm Lại Câu Này' : 'Bắt Đầu Nói / Thu Âm'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-3 border-black bg-black text-[#5CE1E6] font-black text-xs sm:text-sm uppercase shadow-neo cursor-pointer animate-pulse"
                >
                  <MicOff className="w-5 h-5 text-rose-400" />
                  Dừng Thu Âm
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGradeCurrentQuestion}
                  disabled={isGrading}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo transition-all cursor-pointer ${
                    isGrading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#5CE1E6] hover:bg-[#48cbd0] text-black'
                  }`}
                >
                  <DoodleStar size={17} className={isGrading ? 'animate-spin' : ''} />
                  {isGrading ? 'AI Đang Chấm...' : 'Chấm Câu Này Bằng AI'}
                </button>

                {currentQuestionIndex < questionsInTest.length - 1 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex((i) => i + 1);
                    }}
                    className="px-4 py-3 rounded-xl border-3 border-black bg-gray-100 hover:bg-gray-200 font-black text-xs sm:text-sm uppercase shadow-neo cursor-pointer"
                  >
                    Câu Tiếp ➔
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Per-Question AI Evaluation Result */}
          {currentAttempt.evaluation && (
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200 p-4 rounded-xl border-3 border-black flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-black text-black/70">
                    Kết Quả Chấm AI — Câu {currentQuestion.questionNumber}
                  </div>
                  <div className="text-2xl font-black text-black flex items-baseline gap-2 mt-0.5 flex-wrap">
                    <span>
                      {currentAttempt.evaluation.score} / {currentAttempt.evaluation.maxScore} Điểm Rubric
                    </span>
                    <span className="text-sm font-bold bg-black text-[#5CE1E6] px-2.5 py-0.5 rounded-full">
                      Quy đổi Band: {currentAttempt.evaluation.estimatedToeicBand} / 200
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-300 text-xs sm:text-sm text-pink-950 font-bold flex items-start gap-2">
                <DoodleBulb size={18} className="mt-0.5 shrink-0" />
                <span>"{currentAttempt.evaluation.coachComment}"</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-300">
                  <div className="font-black text-xs text-emerald-950 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Điểm Mạnh:
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-900">
                    {currentAttempt.evaluation.strengths.map((str, i) => (
                      <li key={i}>• {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-xl border-2 border-amber-300">
                  <div className="font-black text-xs text-amber-950 uppercase flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    Cần Cải Thiện:
                  </div>
                  <ul className="space-y-1 text-xs text-amber-900">
                    {currentAttempt.evaluation.improvements.map((imp, i) => (
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
              Nhập khóa Google Gemini API để chấm điểm phát âm, ngữ điệu và độ chính xác lịch trình theo Rubric ETS (lưu cục bộ tại trình duyệt của bạn).
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
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs bg-[#5CE1E6] shadow-neo-sm cursor-pointer"
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
