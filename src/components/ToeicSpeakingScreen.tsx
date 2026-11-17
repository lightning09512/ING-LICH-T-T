import React, { useState, useEffect, useRef } from 'react';
import { 
  TOEIC_SPEAKING_PARTS, 
  TOEIC_SPEAKING_QUESTIONS, 
  TOEIC_SPEAKING_TESTS,
  SpeakingQuestion 
} from '../data/toeicSpeakingData';
import { 
  TOEIC_REVISION_ROADMAP, 
  RevisionUnit 
} from '../data/toeicRevisionData';
import { 
  gradeSpeakingWithAi, 
  AiEvaluationResult, 
  getStoredGeminiApiKey, 
  saveStoredGeminiApiKey 
} from '../utils/aiGrader';
import { sounds } from '../utils/soundEffects';
import { FormattedContent } from './FormattedContent';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Volume2, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  Clock, 
  Key, 
  Lightbulb, 
  Award, 
  RefreshCw, 
  TrendingUp,
  VolumeX,
  Radio,
  BookOpen,
  Trophy,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicSpeakingScreenProps {
  onBack: () => void;
  nickname: string;
}

export const ToeicSpeakingScreen: React.FC<ToeicSpeakingScreenProps> = ({ onBack, nickname }) => {
  // Top Level Mode: 'TEST_PRACTICE' vs 'REVISION'
  const [activeTab, setActiveTab] = useState<'TEST_PRACTICE' | 'REVISION'>('TEST_PRACTICE');

  // Test Practice State
  const [selectedTestId, setSelectedTestId] = useState<string>('study4-sp-01');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Settings
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiApiKey());
  const [hasApiKey, setHasApiKey] = useState(Boolean(getStoredGeminiApiKey()));

  // Speech Recognition & Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [isSpeakingNative, setIsSpeakingNative] = useState(false);

  // Timers: Prep Time & Speak Time
  const [prepSeconds, setPrepSeconds] = useState(45);
  const [isPrepRunning, setIsPrepRunning] = useState(false);
  const [speakSeconds, setSpeakSeconds] = useState(45);
  const [isSpeakRunning, setIsSpeakRunning] = useState(false);

  // AI Evaluation State
  const [isGrading, setIsGrading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AiEvaluationResult | null>(null);

  // Revision / Theory State (Speaking Units)
  const speakingUnits = TOEIC_REVISION_ROADMAP.filter(u => u.skill === 'SPEAKING');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(speakingUnits[0]?.id || 'sp-unit-01');
  const currentUnit: RevisionUnit = speakingUnits.find(u => u.id === selectedUnitId) || speakingUnits[0];
  const [quizAnswers, setQuizAnswers] = useState<{ [quizIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [quizIdx: number]: boolean }>({});

  // Refs for Speech Recognition & MediaRecorder
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Filter questions for the selected test
  const questionsInTest = TOEIC_SPEAKING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const currentQuestion: SpeakingQuestion = questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_SPEAKING_QUESTIONS[0];

  // Reset state when switching questions or test
  useEffect(() => {
    stopRecording();
    stopNativeSpeech();
    setTranscription('');
    setRecordedAudioUrl(null);
    setEvaluationResult(null);
    setRecognitionError(null);
    setIsPrepRunning(false);
    setIsSpeakRunning(false);
    if (currentQuestion) {
      setPrepSeconds(currentQuestion.prepTimeSeconds);
      setSpeakSeconds(currentQuestion.speakTimeSeconds);
    }
  }, [selectedTestId, currentQuestionIndex]);

  // Handle Prep Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPrepRunning && prepSeconds > 0) {
      timer = setInterval(() => {
        setPrepSeconds(prev => {
          if (prev <= 1) {
            setIsPrepRunning(false);
            sounds.playCorrect();
            // Automatically switch to Speak timer
            setIsSpeakRunning(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPrepRunning, prepSeconds]);

  // Handle Speak Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSpeakRunning && speakSeconds > 0) {
      timer = setInterval(() => {
        setSpeakSeconds(prev => {
          if (prev <= 1) {
            setIsSpeakRunning(false);
            if (isRecording) {
              stopRecording();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSpeakRunning, speakSeconds, isRecording]);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
        setTranscription(fullTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError('Vui lòng cấp quyền Micro trên trình duyệt để ghi âm bài nói.');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setRecognitionError('Trình duyệt chưa hỗ trợ Web Speech API. Bạn vẫn có thể gõ nội dung bài nói trực tiếp để AI chấm điểm!');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const startRecording = async () => {
    setRecognitionError(null);
    audioChunksRef.current = [];
    setRecordedAudioUrl(null);

    // 1. Start browser speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }

    // 2. Start MediaRecorder
    try {
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
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (!isSpeakRunning) {
        setIsSpeakRunning(true);
      }
    } catch (err) {
      console.error('Media stream error:', err);
      setRecognitionError('Không thể mở micro. Bạn hãy kiểm tra quyền micro trên trình duyệt nhé!');
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }

    setIsRecording(false);
  };

  const playNativeModelAudio = (textToSpeak: string) => {
    if (isSpeakingNative) {
      stopNativeSpeech();
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ phát âm.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
    if (usVoice) utterance.voice = usVoice;

    utterance.onstart = () => setIsSpeakingNative(true);
    utterance.onend = () => setIsSpeakingNative(false);
    utterance.onerror = () => setIsSpeakingNative(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopNativeSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingNative(false);
  };

  const handleSaveApiKey = () => {
    saveStoredGeminiApiKey(apiKeyInput);
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setApiKeyModalOpen(false);
  };

  const handleGradeWithAi = async () => {
    if (!transcription.trim()) {
      alert("Nóc nhà ơi, hãy bấm micro thu âm hoặc gõ nội dung câu trả lời trước khi chấm điểm nhé! ❤️");
      return;
    }

    setIsGrading(true);
    setEvaluationResult(null);

    const partType = currentQuestion.part === 1 ? 'READ_ALOUD' 
      : currentQuestion.part === 2 ? 'DESCRIBE_PICTURE'
      : currentQuestion.part === 3 || currentQuestion.part === 4 ? 'RESPOND_QUESTIONS'
      : 'EXPRESS_OPINION';

    try {
      const result = await gradeSpeakingWithAi({
        partType,
        prompt: currentQuestion.promptText,
        transcription: transcription,
        targetScript: currentQuestion.targetScript,
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
      alert("Có lỗi khi kết nối AI. Đang chuyển sang bộ chấm điểm Speaking Heuristic tích hợp!");
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

  return (
    <div className="min-h-screen bg-[#F4F9F9] text-black p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      
      {/* Top App Bar */}
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
              🎙️ TOEIC Speaking Hub
              <span className="hidden sm:inline-block text-xs bg-black text-[#5CE1E6] px-2.5 py-1 rounded-full font-bold">
                Study4 & AI
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold">
              Chào Nóc Nhà <span className="text-pink-600 font-black">{nickname}</span>! Luyện đề thi thật hoặc tra cứu cẩm nang 16 bài học nhé!
            </p>
          </div>
        </div>

        {/* API Key Modal Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-3 border-black text-xs font-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer ${
              hasApiKey ? 'bg-emerald-300 text-emerald-950' : 'bg-amber-200 text-amber-950'
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
              ? 'bg-[#5CE1E6] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
              : 'bg-white hover:bg-cyan-50 shadow-[2px_2px_0px_#000] text-gray-700'
          }`}
        >
          <Trophy className="w-5 h-5 text-amber-600" />
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
          <span>📖 Cẩm Nang Ôn Luyện (16 Unit)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LUYỆN ĐỀ THI STUDY4                                */}
      {/* ======================================================== */}
      {activeTab === 'TEST_PRACTICE' && (
        <div className="flex flex-col gap-6">
          
          {/* Study4 Test Selector Cards */}
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TOEIC_SPEAKING_TESTS.map(test => {
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
                      ? 'bg-black text-[#5CE1E6] shadow-neo translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white hover:bg-cyan-50 text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black ${
                      isSelected ? 'bg-[#5CE1E6] text-black' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.badge}
                    </span>
                    <span className="text-xs font-mono font-bold">11 Câu • 20 Phút</span>
                  </div>
                  <div className="font-black text-sm leading-snug">{test.name}</div>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>{test.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Question Navigator Palette (1 -> 11) */}
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
                        ? 'bg-black text-[#5CE1E6] shadow-none scale-105'
                        : 'bg-gray-100 hover:bg-cyan-100 text-black shadow-[1px_1px_0px_#000]'
                    }`}
                    title={q.partTitle}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Timers */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {currentQuestion.prepTimeSeconds > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border-2 border-black">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">Chuẩn bị:</span>
                  <span className="font-mono font-black text-xs text-amber-950">{prepSeconds}s</span>
                  <button
                    onClick={() => setIsPrepRunning(!isPrepRunning)}
                    className="text-[11px] font-black bg-amber-300 px-2 py-0.5 rounded border border-black hover:bg-amber-400 cursor-pointer ml-1"
                  >
                    {isPrepRunning ? 'Dừng' : 'Bật'}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border-2 border-black">
                <Radio className={`w-3.5 h-3.5 ${isRecording ? 'text-red-600 animate-pulse' : 'text-rose-700'}`} />
                <span className="text-xs font-bold text-rose-900">Nói:</span>
                <span className={`font-mono font-black text-xs ${speakSeconds <= 10 ? 'text-red-600 animate-pulse' : 'text-rose-950'}`}>
                  {speakSeconds}s
                </span>
                <button
                  onClick={() => setIsSpeakRunning(!isSpeakRunning)}
                  className="text-[11px] font-black bg-rose-300 px-2 py-0.5 rounded border border-black hover:bg-rose-400 cursor-pointer ml-1"
                >
                  {isSpeakRunning ? 'Dừng' : 'Bật'}
                </button>
              </div>

              <button
                onClick={() => {
                  setPrepSeconds(currentQuestion.prepTimeSeconds);
                  setSpeakSeconds(currentQuestion.speakTimeSeconds);
                  setIsPrepRunning(false);
                  setIsSpeakRunning(false);
                }}
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
                  <span className="text-xs font-black bg-cyan-200 text-cyan-950 px-2.5 py-1 rounded-full border border-black uppercase">
                    Câu {currentQuestionIndex + 1}/11 • {currentQuestion.partTitle}
                  </span>
                  <span className="text-xs text-gray-500 font-bold">
                    {currentQuestion.speakTimeSeconds}s trả lời
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed mt-2 bg-blue-50 p-3 rounded-xl border border-black/20">
                  📢 <span className="font-bold">Yêu cầu:</span> {currentQuestion.directionsVi}
                </p>

                {/* Stimulus 1: Read Aloud Script */}
                {currentQuestion.part === 1 && currentQuestion.targetScript && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border-2 border-black text-sm sm:text-base font-serif leading-relaxed text-gray-900 shadow-sm">
                    "{currentQuestion.targetScript}"
                  </div>
                )}

                {/* Stimulus 2: Picture */}
                {currentQuestion.part === 2 && currentQuestion.imageUrl && (
                  <div className="mt-4">
                    <div className="rounded-xl overflow-hidden border-3 border-black shadow-neo bg-gray-100 flex items-center justify-center max-h-72">
                      <img
                        src={currentQuestion.imageUrl}
                        alt="TOEIC Speaking Picture"
                        className="w-full h-auto object-cover max-h-72"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Stimulus 3: Respond to Questions */}
                {(currentQuestion.part === 3 || currentQuestion.part === 5) && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-900/30">
                    <div className="text-xs font-black uppercase text-indigo-950 mb-1">Câu Hỏi:</div>
                    <p className="font-black text-sm sm:text-base text-indigo-950 leading-relaxed">
                      "{currentQuestion.promptText}"
                    </p>
                  </div>
                )}

                {/* Stimulus 4: Table / Agenda */}
                {currentQuestion.part === 4 && currentQuestion.tableData && (
                  <div className="mt-4 bg-[#F8FAFC] border-2 border-black rounded-xl p-3 text-xs overflow-x-auto">
                    <div className="font-black text-gray-800 uppercase mb-2">📋 Lịch Trình Hội Thảo:</div>
                    <table className="w-full border-collapse">
                      <tbody>
                        {currentQuestion.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-200">
                            <td className="py-1.5 px-2 font-black text-gray-600 w-1/3">{row.time || row["Thời gian"] || Object.keys(row)[0]}</td>
                            <td className="py-1.5 px-2 font-medium text-gray-900">{row.event || row["Nội dung"] || Object.values(row)[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Native Speaker Model Voice */}
                <div className="mt-4 pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-black text-gray-600 uppercase">Giọng Bản Xứ Mẫu:</span>
                  <button
                    onClick={() => playNativeModelAudio(currentQuestion.modelAnswer || currentQuestion.targetScript || currentQuestion.promptText)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                      isSpeakingNative 
                        ? 'bg-rose-400 text-white animate-pulse' 
                        : 'bg-[#FFDE59] hover:bg-amber-300 text-black shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    {isSpeakingNative ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {isSpeakingNative ? 'Dừng Giọng Bản Xứ' : 'Nghe Phát Âm Mẫu'}
                  </button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-[#EBFBEE] p-4 rounded-2xl border-3 border-black shadow-neo">
                <h3 className="font-black text-xs uppercase tracking-wide text-emerald-950 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  Mẹo Ghi Điểm Tuyệt Đối:
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

            {/* Right Column: Audio Recording, Transcription & AI Results */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-wider text-gray-500">Thu Âm Giọng Nói:</span>
                    {isRecording && (
                      <span className="flex items-center gap-1 text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        Đang Ghi Âm...
                      </span>
                    )}
                  </div>

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-3 border-black font-black text-xs uppercase tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer ${
                      isRecording 
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                        : 'bg-[#FF6B6B] hover:bg-rose-400 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Dừng Ghi Âm' : 'Bắt Đầu Nói (Micro)'}
                  </button>
                </div>

                {recognitionError && (
                  <div className="mb-3 p-3 bg-rose-50 rounded-xl border border-rose-300 text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{recognitionError}</span>
                  </div>
                )}

                {recordedAudioUrl && (
                  <div className="mb-3 p-3 bg-cyan-50 rounded-xl border-2 border-cyan-300 flex items-center justify-between gap-3">
                    <div className="text-xs font-black text-cyan-950 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-cyan-800" />
                      Nghe Lại Giọng Của Bạn:
                    </div>
                    <audio src={recordedAudioUrl} controls className="h-8 max-w-xs" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Văn Bản Nhận Diện Từ Giọng Nói:</span>
                    <span>{transcription.trim().split(/\s+/).filter(Boolean).length} từ</span>
                  </div>
                  <textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    placeholder="Bấm 'Bắt Đầu Nói' và nói vào micro bằng tiếng Anh..."
                    rows={5}
                    className="w-full p-4 rounded-xl border-3 border-black text-sm font-sans focus:outline-none focus:ring-4 focus:ring-cyan-200 transition-all shadow-[inner_0_2px_4px_rgba(0,0,0,0.06)] resize-y"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setTranscription('');
                      setRecordedAudioUrl(null);
                    }}
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
                        : 'bg-[#5CE1E6] hover:bg-[#48cbd0] text-black'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${isGrading ? 'animate-spin' : 'text-amber-500 fill-amber-400'}`} />
                    {isGrading ? 'AI Đang Phân Tích Giọng Nói...' : 'Chấm Điểm Bài Nói Bằng AI'}
                  </button>
                </div>
              </div>

              {/* AI Evaluation Results */}
              {evaluationResult && (
                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] animate-fadeIn flex flex-col gap-4">
                  <div className="bg-gradient-to-r from-cyan-200 via-emerald-200 to-amber-200 p-4 rounded-xl border-3 border-black flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase font-black tracking-wider text-black/70">
                        Kết Quả Đánh Giá Bài Nói (Speaking)
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-black flex items-baseline gap-2 mt-0.5">
                        <span>{evaluationResult.score} / {evaluationResult.maxScore} Điểm</span>
                        <span className="text-sm font-bold bg-black text-[#5CE1E6] px-2.5 py-0.5 rounded-full">
                          Dự kiến TOEIC Speaking: {evaluationResult.estimatedToeicBand} / 200
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-300">
                      <div className="font-black text-xs text-emerald-950 uppercase flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Ưu Điểm Giọng Nói:
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
                        Cần Cải Thiện:
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

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CẨM NANG ÔN LUYỆN KỸ NĂNG NÓI (16 UNIT CHUẨN ETS)     */}
      {/* ======================================================== */}
      {activeTab === 'REVISION' && (
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 16 Units Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
                <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                  16 Bài Học Speaking:
                </span>
                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full border border-black">
                  Level 0 - 100+
                </span>
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {speakingUnits.map(unit => {
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
                      className={`w-full p-3 rounded-xl border-2 border-black text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected 
                          ? 'bg-[#FFDE59] text-black shadow-neo-sm translate-x-1 font-bold' 
                          : 'bg-gray-50 hover:bg-cyan-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-black">
                          {unit.badge}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">
                          Unit {unit.unitNumber}
                        </span>
                      </div>
                      <div className="font-black text-xs leading-snug line-clamp-2 mt-0.5">
                        {unit.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Formatted Lesson Reader (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Unit Header */}
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-black text-[#5CE1E6] border border-black">
                  {currentUnit.badge}
                </span>
                <span className="text-xs font-black text-gray-500">
                  Cẩm Nang Speaking Chuẩn ETS
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight font-heading">
                {currentUnit.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                {currentUnit.subtitle}
              </p>

              <div className="bg-cyan-50 p-4 rounded-xl border-2 border-cyan-800/20 text-xs sm:text-sm text-cyan-950 leading-relaxed font-medium">
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
                    Công Thức Vàng Cần Thuộc Lòng:
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
                          let btnStyle = 'bg-gray-50 hover:bg-cyan-50 border-gray-300 text-gray-800';
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
              Nhập mã API Key của bạn từ Google AI Studio để kích hoạt mô hình <strong>Gemini 2.5 Flash</strong> chấm điểm bài nói, phân tích độ chuẩn xác và phản hồi trực tiếp.
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
                className="w-full p-3 rounded-xl border-2 border-black text-sm font-mono focus:outline-none focus:ring-3 focus:ring-cyan-300"
              />
            </div>

            <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-300 text-[11px] text-cyan-950 mb-5 leading-relaxed">
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
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs uppercase bg-[#5CE1E6] shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
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
