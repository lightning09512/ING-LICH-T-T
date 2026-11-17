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
  Square, 
  Sparkles, 
  CheckCircle2, 
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
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicSpeakingScreenProps {
  onBack: () => void;
  nickname: string;
  onOpenRevision?: () => void;
}

export const ToeicSpeakingScreen: React.FC<ToeicSpeakingScreenProps> = ({ onBack, nickname, onOpenRevision }) => {
  const [selectedTestId, setSelectedTestId] = useState<string>('study4-sp-01');
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3 | 4 | 5>(1);
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

  // Filter questions for the selected test and part
  const questionsInTest = TOEIC_SPEAKING_QUESTIONS.filter(q => q.testId === selectedTestId);
  const questionsInPart = questionsInTest.filter(q => q.part === selectedPart);
  const currentQuestion: SpeakingQuestion = questionsInPart[currentQuestionIndex] || questionsInTest[0] || TOEIC_SPEAKING_QUESTIONS[0];

  // Reset state when switching questions
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
  }, [selectedPart, currentQuestionIndex]);

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

    // 1. Start browser speech recognition for real-time text
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }

    // 2. Start MediaRecorder to capture audio playback
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
      setIsRecording(true); // Still allow speech recognition if permitted
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
    utterance.rate = 0.95; // Natural speaking pace

    // Prefer native natural US voices if available
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

    const partType = selectedPart === 1 ? 'READ_ALOUD' 
      : selectedPart === 2 ? 'DESCRIBE_PICTURE'
      : selectedPart === 3 || selectedPart === 4 ? 'RESPOND_QUESTIONS'
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

  // Word matching for Part 1 (Read Aloud)
  const renderPart1WordComparison = () => {
    if (selectedPart !== 1 || !currentQuestion.targetScript) return null;

    const targetWords = currentQuestion.targetScript.split(/\s+/);
    const spokenLower = transcription.toLowerCase();

    return (
      <div className="bg-white p-4 rounded-xl border-2 border-black mt-3">
        <div className="text-xs font-black uppercase text-gray-500 mb-2 flex items-center justify-between">
          <span>Đối Chiếu Đoạn Văn (Xanh = Đã Đọc Đúng, Đen = Cần Đọc Lại):</span>
          <span className="text-[11px] text-emerald-700 font-bold">
            {transcription ? 'Đang phân tích trực tiếp...' : 'Chưa ghi âm'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-sm sm:text-base leading-relaxed font-sans">
          {targetWords.map((word, idx) => {
            const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
            const isSpoken = clean && spokenLower.includes(clean);
            return (
              <span
                key={idx}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  isSpoken 
                    ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300' 
                    : 'text-gray-800'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
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
              🎙️ Luyện Thi TOEIC Speaking
              <span className="hidden sm:inline-block text-xs bg-black text-[#5CE1E6] px-2.5 py-1 rounded-full font-bold">
                AI Phân Tích Giọng Nói
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold">
              Chào Nóc Nhà <span className="text-pink-600 font-black">{nickname}</span>! Cùng luyện ngữ điệu, phản xạ nói và phát âm chuẩn ETS nhé!
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

      {/* Study4 Test Selector & Revision Shortcut */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-2xl border-3 border-black shadow-neo">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase text-gray-500 mr-1 flex items-center gap-1 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Bộ Đề STUDY4:
          </span>
          {TOEIC_SPEAKING_TESTS.map(test => (
            <button
              key={test.id}
              onClick={() => {
                setSelectedTestId(test.id);
                setCurrentQuestionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedTestId === test.id
                  ? 'bg-black text-[#5CE1E6] shadow-none'
                  : 'bg-gray-100 hover:bg-cyan-100 text-black shadow-[2px_2px_0px_#000]'
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
      <div className="max-w-6xl w-full mx-auto grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
        {TOEIC_SPEAKING_PARTS.map(part => {
          const isActive = selectedPart === part.id;
          return (
            <button
              key={part.id}
              onClick={() => {
                setSelectedPart(part.id as 1 | 2 | 3 | 4 | 5);
                setCurrentQuestionIndex(0);
              }}
              className={`p-3 rounded-2xl border-3 border-black text-left transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#5CE1E6] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-white hover:bg-cyan-50 shadow-[2px_2px_0px_#000]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{part.icon}</span>
                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full border border-black ${isActive ? 'bg-black text-[#5CE1E6]' : 'bg-gray-100 text-black'}`}>
                  Part {part.id}
                </span>
              </div>
              <div className="font-black text-xs sm:text-sm line-clamp-1">{part.name}</div>
              <div className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{part.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Question Selector & Timers */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-2xl border-3 border-black shadow-neo">
        
        {/* Question Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase text-gray-500 mr-1">Chọn Đề:</span>
          {questionsInPart.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs transition-all cursor-pointer ${
                currentQuestionIndex === idx
                  ? 'bg-black text-[#5CE1E6] shadow-none'
                  : 'bg-gray-100 hover:bg-cyan-100 text-black shadow-[2px_2px_0px_#000]'
              }`}
            >
              Câu {idx + 1}
            </button>
          ))}
        </div>

        {/* Dual Timers (Chuẩn format thi ETS) */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          
          {/* Prep Time */}
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

          {/* Speaking Time */}
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

      {/* Main Workspace Layout */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left Column: Prompt & Stimulus (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Question Card */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black bg-cyan-200 text-cyan-950 px-2.5 py-1 rounded-full border border-black uppercase">
                {currentQuestion.partTitle}
              </span>
              <span className="text-xs text-gray-500 font-bold">
                {currentQuestion.speakTimeSeconds}s trả lời
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed mt-2 bg-blue-50 p-3 rounded-xl border border-black/20">
              📢 <span className="font-bold">Yêu cầu:</span> {currentQuestion.directionsVi}
            </p>

            {/* Stimulus 1: Read Aloud Script for Part 1 */}
            {selectedPart === 1 && currentQuestion.targetScript && (
              <div className="mt-4">
                <div className="p-4 bg-amber-50 rounded-xl border-2 border-black text-sm sm:text-base font-serif leading-relaxed text-gray-900 shadow-sm">
                  "{currentQuestion.targetScript}"
                </div>

                {/* Word Match Live Highlighting */}
                {renderPart1WordComparison()}
              </div>
            )}

            {/* Stimulus 2: Picture for Part 2 */}
            {selectedPart === 2 && currentQuestion.imageUrl && (
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
                <div className="mt-3 bg-purple-50 p-3 rounded-xl border border-purple-300 text-xs font-semibold text-purple-950">
                  🎯 Hãy miêu tả tổng thể bức tranh, người ở trung tâm, hành động đang diễn ra và bối cảnh xung quanh!
                </div>
              </div>
            )}

            {/* Stimulus 3: Respond to Questions for Part 3 & Part 5 */}
            {(selectedPart === 3 || selectedPart === 5) && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-900/30">
                <div className="text-xs font-black uppercase text-indigo-950 mb-1">Câu Hỏi:</div>
                <p className="font-black text-sm sm:text-base text-indigo-950 leading-relaxed">
                  "{currentQuestion.promptText}"
                </p>
              </div>
            )}

            {/* Stimulus 4: Table / Agenda for Part 4 */}
            {selectedPart === 4 && currentQuestion.tableData && (
              <div className="mt-4 bg-[#F8FAFC] border-2 border-black rounded-xl p-3 text-xs overflow-x-auto">
                <div className="font-black text-gray-800 uppercase mb-2">📋 Lịch Trình Hội Thảo / Bảng Biểu:</div>
                <table className="w-full border-collapse">
                  <tbody>
                    {currentQuestion.tableData.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-gray-200">
                        <td className="py-1.5 px-2 font-black text-gray-600 w-1/3">{row.time || row.section || Object.keys(row)[0]}</td>
                        <td className="py-1.5 px-2 font-medium text-gray-900">{row.event || row.detail || Object.values(row)[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Native Speaker Model Voice Audio Player */}
            <div className="mt-4 pt-4 border-t-2 border-gray-100 flex items-center justify-between">
              <span className="text-xs font-black text-gray-600 uppercase">Giọng Đọc Bản Xứ Mẫu:</span>
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

          {/* Useful Tips Card */}
          <div className="bg-[#EBFBEE] p-4 rounded-2xl border-3 border-black shadow-neo">
            <h3 className="font-black text-xs uppercase tracking-wide text-emerald-950 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              Mẹo Ghi Điểm Tuyệt Đối Cho Nóc Nhà:
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

        {/* Right Column: Audio Recording, Transcription & AI Results (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Recording & Speech-to-Text Card */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-neo flex flex-col">
            
            {/* Header / Recording Controls */}
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

              {/* Big Record Toggle Button */}
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

            {/* Error banner if mic is blocked */}
            {recognitionError && (
              <div className="mb-3 p-3 bg-rose-50 rounded-xl border border-rose-300 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{recognitionError}</span>
              </div>
            )}

            {/* Playback girlfriend's recorded voice if available */}
            {recordedAudioUrl && (
              <div className="mb-3 p-3 bg-cyan-50 rounded-xl border-2 border-cyan-300 flex items-center justify-between gap-3">
                <div className="text-xs font-black text-cyan-950 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-800" />
                  Nghe Lại Giọng Của Bạn:
                </div>
                <audio src={recordedAudioUrl} controls className="h-8 max-w-xs" />
              </div>
            )}

            {/* Live Transcription Text Area (User can edit if voice recognition missed a word) */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Văn Bản Nhận Diện Từ Giọng Nói (Có thể chỉnh sửa nếu cần):</span>
                <span>{transcription.trim().split(/\s+/).filter(Boolean).length} từ</span>
              </div>
              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Bấm 'Bắt Đầu Nói' và nói vào micro bằng tiếng Anh... Lời nói của bạn sẽ tự động chuyển thành văn bản tại đây!"
                rows={6}
                className="w-full p-4 rounded-xl border-3 border-black text-sm font-sans focus:outline-none focus:ring-4 focus:ring-cyan-200 transition-all shadow-[inner_0_2px_4px_rgba(0,0,0,0.06)] resize-y"
              />
            </div>

            {/* Action Bar */}
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

          {/* AI EVALUATION RESULTS PANEL */}
          {evaluationResult && (
            <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] animate-fadeIn flex flex-col gap-5">
              
              {/* Score Header Card */}
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

                <div className="bg-white px-4 py-2 rounded-xl border-2 border-black font-black text-center shadow-[2px_2px_0px_#000]">
                  <div className="text-[10px] text-gray-500 uppercase">Trình Độ</div>
                  <div className="text-sm sm:text-base text-cyan-800">
                    {evaluationResult.score === evaluationResult.maxScore ? '🌟 Thành Thạo' : evaluationResult.score >= (evaluationResult.maxScore * 0.7) ? '👍 Rất Tự Nhiên' : '💪 Đang Lên Tay'}
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
                    Ưu Điểm Giọng Nói:
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
                    Cần Lưu Ý Cải Thiện:
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

              {/* Vocabulary Upgrades */}
              {evaluationResult.vocabUpgrades && evaluationResult.vocabUpgrades.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-300">
                  <div className="font-black text-xs text-purple-950 uppercase flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Gợi Ý Cụm Từ Nói Tự Nhiên & Nâng Điểm:
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xs text-gray-700 uppercase">
                      Bài Nói Mẫu Chuẩn Bản Xứ:
                    </span>
                    <button
                      onClick={() => playNativeModelAudio(evaluationResult.modelAnswer)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Nghe bài mẫu này
                    </button>
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
