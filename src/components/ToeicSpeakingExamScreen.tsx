import React, { useState, useEffect, useRef } from 'react';
import { 
  TOEIC_SPEAKING_PARTS, 
  TOEIC_SPEAKING_QUESTIONS, 
  TOEIC_SPEAKING_TESTS,
  SpeakingQuestion 
} from '../data/toeicSpeakingData';
import { 
  gradeSpeakingWithAi, 
  AiEvaluationResult, 
  getStoredGeminiApiKey, 
  saveStoredGeminiApiKey 
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
  Trophy,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicSpeakingExamScreenProps {
  testId: string;
  onBack: () => void;
  nickname: string;
}

export const ToeicSpeakingExamScreen: React.FC<ToeicSpeakingExamScreenProps> = ({ 
  testId, 
  onBack, 
  nickname 
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testId || 'study4-sp-01');
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

  // Refs for Speech Recognition & MediaRecorder
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Filter questions for the selected test
  const questionsInTest = TOEIC_SPEAKING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const currentQuestion: SpeakingQuestion = questionsInTest[currentQuestionIndex] || questionsInTest[0] || TOEIC_SPEAKING_QUESTIONS[0];

  const currentTestMeta = TOEIC_SPEAKING_TESTS.find(t => t.id === selectedTestId) || TOEIC_SPEAKING_TESTS[0];

  // Sync testId prop
  useEffect(() => {
    if (testId && testId !== selectedTestId) {
      setSelectedTestId(testId);
      setCurrentQuestionIndex(0);
    }
  }, [testId]);

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
        if (event.error !== 'no-speech') {
          setRecognitionError(`Lỗi nhận diện: ${event.error}`);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setRecognitionError('Trình duyệt chưa hỗ trợ Web Speech API. Bạn vẫn có thể ghi âm và chấm AI bình thường.');
    }
  }, []);

  const startRecording = async () => {
    try {
      sounds.playClick();
      setRecognitionError(null);
      setTranscription('');
      setRecordedAudioUrl(null);
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
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      if (!isSpeakRunning) {
        setIsSpeakRunning(true);
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    } catch (err: any) {
      setRecognitionError('Không thể truy cập Microphone. Vui lòng cấp quyền micro cho trình duyệt!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const playNativeSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    setIsSpeakingNative(true);
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

  const handleGradeWithAi = async () => {
    const textToEvaluate = transcription.trim() || 'No clear speech detected';
    setIsGrading(true);
    sounds.playClick();

    try {
      const partType = currentQuestion.part === 1 ? 'READ_ALOUD' 
        : currentQuestion.part === 2 ? 'DESCRIBE_PICTURE'
        : currentQuestion.part === 5 ? 'EXPRESS_OPINION'
        : 'RESPOND_QUESTIONS';

      const result = await gradeSpeakingWithAi({
        partType,
        prompt: currentQuestion.promptText,
        transcription: textToEvaluate,
        targetScript: currentQuestion.targetScript,
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
          <span className="text-xl sm:text-2xl">🎙️</span>
          <div className="text-left hidden sm:block">
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              Phòng Thi TOEIC Speaking
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              {currentTestMeta.name} • 11 câu hỏi chuẩn format ETS
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

      {/* Main Test Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Test & Questions Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Test Selector */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <label className="block text-xs uppercase font-black tracking-wider text-gray-600 mb-2">
              Bộ Đề Thi Speaking:
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => {
                sounds.playClick();
                setSelectedTestId(e.target.value);
                setCurrentQuestionIndex(0);
              }}
              className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {TOEIC_SPEAKING_TESTS.map(test => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Grid (1 - 11) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                Bảng Câu Hỏi (11 Câu):
              </span>
              <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full border border-black">
                {currentQuestion.partTitle.split(':')[0]}
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {questionsInTest.map((q, idx) => {
                const isActive = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`aspect-square rounded-xl border-2 border-black font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#5CE1E6] text-black shadow-neo-sm scale-105' 
                        : 'bg-gray-50 hover:bg-cyan-50 text-gray-800'
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
              Mẹo Trả Lời Chuẩn ETS:
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

        {/* Right Column: Question Content & Recording Station (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Question Header & Timers */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b-2 border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-[#5CE1E6] border border-black font-mono">
                  {currentQuestion.partTitle}
                </span>
                <h2 className="text-lg sm:text-xl font-black mt-1 font-heading text-black">
                  Câu hỏi số {currentQuestion.questionNumber} / 11
                </h2>
              </div>

              {/* Dual Timers */}
              <div className="flex items-center gap-2">
                {/* Prep Timer */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs ${
                  isPrepRunning ? 'bg-amber-300 animate-pulse' : 'bg-gray-100'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Chuẩn bị: {prepSeconds}s</span>
                  {!isPrepRunning && prepSeconds > 0 && (
                    <button 
                      onClick={() => { sounds.playClick(); setIsPrepRunning(true); }}
                      className="ml-1 text-[10px] bg-black text-white px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      Bật
                    </button>
                  )}
                </div>

                {/* Speak Timer */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs ${
                  isSpeakRunning ? 'bg-rose-300 animate-pulse' : 'bg-gray-100'
                }`}>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Nói: {speakSeconds}s</span>
                </div>
              </div>
            </div>

            {/* Directions in Vietnamese */}
            <div className="bg-cyan-50 p-3.5 rounded-xl border-2 border-cyan-800/20 text-xs sm:text-sm text-cyan-950 font-bold leading-relaxed">
              👉 <span className="underline">Hướng dẫn:</span> {currentQuestion.directionsVi}
            </div>

            {/* Prompt Text / Reading Passage */}
            {currentQuestion.part === 1 && currentQuestion.targetScript && (
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-black font-serif text-base sm:text-lg leading-relaxed text-gray-900 tracking-wide">
                "{currentQuestion.targetScript}"
              </div>
            )}

            {/* Question with Image (Part 2 & Part 4) */}
            {currentQuestion.imageUrl && (
              <div className="flex flex-col items-center justify-center p-2 bg-gray-100 rounded-xl border-2 border-black overflow-hidden max-h-[340px]">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="TOEIC Speaking Prompt" 
                  className="max-h-[320px] w-auto object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    (e.target as any).src = '/images/part1/p1_01.jpg';
                  }}
                />
              </div>
            )}

            {/* Table / Schedule Data for Part 4 */}
            {currentQuestion.tableData && (
              <div className="overflow-x-auto rounded-xl border-2 border-black bg-white">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-black text-[#5CE1E6] uppercase font-black text-[11px]">
                    <tr>
                      {Object.keys(currentQuestion.tableData[0] || {}).map((header, hIdx) => (
                        <th key={hIdx} className="p-2.5">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentQuestion.tableData.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(row).map((val, vIdx) => (
                          <td key={vIdx} className="p-2.5 font-bold text-gray-800">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Direct Prompt Text for Part 3, 4, 5 */}
            {currentQuestion.promptText && currentQuestion.part !== 1 && (
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-amber-300 font-bold text-sm sm:text-base text-gray-900 flex items-start gap-2">
                <span className="text-xl">💬</span>
                <div className="flex-1">
                  <div className="text-xs uppercase text-amber-900 font-black mb-0.5">Câu Hỏi Của Giám Khảo:</div>
                  <div className="leading-relaxed">"{currentQuestion.promptText}"</div>
                </div>
              </div>
            )}

            {/* Audio Voice Sample from Native AI */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs font-bold text-gray-500">Giọng đọc mẫu chuẩn Mỹ:</span>
              <button
                onClick={() => {
                  if (isSpeakingNative) {
                    stopNativeSpeech();
                  } else {
                    playNativeSpeech(currentQuestion.targetScript || currentQuestion.modelAnswer);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-lg text-xs font-black shadow-neo-sm cursor-pointer"
              >
                {isSpeakingNative ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span>Dừng Đọc Mẫu</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-600" />
                    <span>Nghe Giọng Mẫu ETS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Voice Recording & AI Grading Station */}
          <div className="bg-white p-5 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-4">
            
            <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Radio className={`w-4 h-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-gray-400'}`} />
                Trạm Thu Âm Giọng Nói Của Bạn:
              </span>
              {isRecording && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                  ĐANG GHI ÂM...
                </span>
              )}
            </div>

            {recognitionError && (
              <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{recognitionError}</span>
              </div>
            )}

            {/* Speech-to-Text Transcription Box */}
            <div className="p-4 rounded-xl border-2 border-black bg-gray-50 min-h-[90px] flex flex-col justify-between">
              <div className="text-xs uppercase font-black text-gray-400 mb-1">
                Văn Bản Nhận Diện Từ Giọng Nói (Speech-to-Text):
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed italic">
                {transcription ? `"${transcription}"` : '(Chưa có giọng nói được ghi lại. Hãy nhấn "Bắt Đầu Nói" bên dưới để luyện phát âm)'}
              </p>
              {transcription && (
                <div className="text-right text-[10px] text-gray-500 font-bold mt-2">
                  Độ dài: {transcription.split(/\s+/).filter(Boolean).length} từ
                </div>
              )}
            </div>

            {/* Audio Playback of Recorded Voice */}
            {recordedAudioUrl && (
              <div className="p-3 bg-cyan-50 rounded-xl border-2 border-cyan-800/30 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-cyan-950">Nghe lại bản thu của bạn:</span>
                <audio src={recordedAudioUrl} controls className="h-8 max-w-[240px]" />
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-3 border-black bg-rose-500 hover:bg-rose-600 text-white font-black text-sm uppercase tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                  >
                    <Mic className="w-5 h-5" />
                    Bắt Đầu Nói / Thu Âm
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-3 border-black bg-black text-[#5CE1E6] font-black text-sm uppercase tracking-wide shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer animate-pulse"
                  >
                    <MicOff className="w-5 h-5 text-rose-400" />
                    Hoàn Thành & Dừng Thu
                  </button>
                )}
              </div>

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

          {/* AI Evaluation Results Box */}
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
              Nhập Google Gemini API Key để kích hoạt tính năng AI chấm điểm phát âm, ngữ điệu và phân tích câu văn. Khóa được lưu an toàn tại trình duyệt của bạn (Local Storage).
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border-2 border-black rounded-xl font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                className="px-5 py-2 rounded-xl border-2 border-black font-black text-xs bg-[#5CE1E6] hover:bg-[#48cbd0] shadow-neo-sm cursor-pointer"
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
