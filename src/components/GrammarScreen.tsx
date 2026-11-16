import React, { useState, useEffect } from 'react';
import { 
  grammarTopics, 
  GrammarTopic, 
  GrammarExercise,
  fullTwelveTenses,
  wordOrderRules,
  getAllGrammarExercises,
  WordOrderStep
} from '../data/grammarData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Trophy, 
  Timer, 
  Heart, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  GraduationCap,
  Check,
  X,
  Play,
  Clock,
  Layers,
  Filter,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';

interface GrammarScreenProps {
  onBack: () => void;
  nickname: string;
}

type MainTab = 'TOPICS' | 'TENSES' | 'WORD_ORDER';
type GrammarViewMode = 'MAIN' | 'LESSON' | 'SURVIVAL';

export const GrammarScreen: React.FC<GrammarScreenProps> = ({ onBack, nickname }) => {
  const [viewMode, setViewMode] = useState<GrammarViewMode>('MAIN');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('TENSES'); // Default to Tenses to show full tenses immediately
  
  // Topic state
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(grammarTopics[0]);
  const [activeLessonTab, setActiveLessonTab] = useState<'THEORY' | 'PRACTICE'>('THEORY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // 12 Tenses state
  const [tenseFilter, setTenseFilter] = useState<'ALL' | 'PRESENT' | 'PAST' | 'FUTURE'>('ALL');
  const [selectedTenseId, setSelectedTenseId] = useState<string>(fullTwelveTenses[0].id);
  const [tenseViewTab, setTenseViewTab] = useState<'THEORY' | 'PRACTICE'>('THEORY');
  const [tenseExIndex, setTenseExIndex] = useState(0);
  const [tenseSelectedAnswer, setTenseSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [tenseIsAnswerChecked, setTenseIsAnswerChecked] = useState(false);
  const [tenseCorrectCount, setTenseCorrectCount] = useState(0);
  const [tenseExerciseFinished, setTenseExerciseFinished] = useState(false);

  // Word Order interactive practice state
  const [expandedWordOrderQuizId, setExpandedWordOrderQuizId] = useState<string | null>(null);
  const [wordOrderQuizState, setWordOrderQuizState] = useState<{
    [ruleId: string]: {
      index: number;
      selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
      isChecked: boolean;
      correctCount: number;
      isFinished: boolean;
    };
  }>({});

  // Symbol legend toggle
  const [showLegend, setShowLegend] = useState(true);

  // Exercise practice state
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [topicProgress, setTopicProgress] = useState<{ [topicId: string]: number }>({});

  // Survival Mode state
  const [survivalQuizzes, setSurvivalQuizzes] = useState<(GrammarExercise & { topicTitle: string })[]>([]);
  const [survivalIndex, setSurvivalIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [survivalGameOver, setSurvivalGameOver] = useState(false);
  const [survivalGameWon, setSurvivalGameWon] = useState(false);
  const [survivalAnswered, setSurvivalAnswered] = useState(false);
  const [survivalSelectedOption, setSurvivalSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [roastMessage, setRoastMessage] = useState<string | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ing_grammar_progress');
      if (saved) {
        setTopicProgress(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const saveProgress = (topicId: string, scoreVal: number) => {
    try {
      const updated = { ...topicProgress, [topicId]: Math.max(topicProgress[topicId] || 0, scoreVal) };
      setTopicProgress(updated);
      localStorage.setItem('ing_grammar_progress', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Categories
  const categories = ['ALL', ...Array.from(new Set(grammarTopics.map(t => t.category)))];

  const filteredTopics = grammarTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || topic.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredTenses = fullTwelveTenses.filter(t => {
    return tenseFilter === 'ALL' || t.group === tenseFilter;
  });

  // Handle open a lesson
  const handleOpenTopic = (topic: GrammarTopic) => {
    sounds.playClick();
    setSelectedTopic(topic);
    setActiveLessonTab('THEORY');
    setCurrentExIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setExerciseFinished(false);
    setViewMode('LESSON');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Practice Quiz Actions
  const handleSelectOption = (label: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerChecked) return;
    setSelectedAnswer(label);
    setIsAnswerChecked(true);

    const currentEx = selectedTopic.exercises[currentExIndex];
    if (label === currentEx.correctAnswer) {
      sounds.playCorrect();
      setCorrectCount(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playWrong();
    }
  };

  const handleNextExercise = () => {
    sounds.playClick();
    if (currentExIndex + 1 < selectedTopic.exercises.length) {
      setCurrentExIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setExerciseFinished(true);
      const totalScore = correctCount + (selectedAnswer === selectedTopic.exercises[currentExIndex].correctAnswer ? 1 : 0);
      saveProgress(selectedTopic.id, totalScore);
      if (totalScore >= selectedTopic.exercises.length * 0.8) {
        sounds.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleRestartTopicQuiz = () => {
    sounds.playClick();
    setCurrentExIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setExerciseFinished(false);
  };

  // Tense Quiz Actions
  const handleSelectTense = (id: string) => {
    sounds.playClick();
    setSelectedTenseId(id);
    setTenseExIndex(0);
    setTenseSelectedAnswer(null);
    setTenseIsAnswerChecked(false);
    setTenseCorrectCount(0);
    setTenseExerciseFinished(false);
  };

  const handleSelectTenseOption = (label: 'A' | 'B' | 'C' | 'D') => {
    if (tenseIsAnswerChecked) return;
    setTenseSelectedAnswer(label);
    setTenseIsAnswerChecked(true);

    const currentTense = fullTwelveTenses.find(t => t.id === selectedTenseId) || fullTwelveTenses[0];
    const currentEx = currentTense.exercises[tenseExIndex];
    if (currentEx && label === currentEx.correctAnswer) {
      sounds.playCorrect();
      setTenseCorrectCount(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playWrong();
    }
  };

  const handleNextTenseExercise = () => {
    sounds.playClick();
    const currentTense = fullTwelveTenses.find(t => t.id === selectedTenseId) || fullTwelveTenses[0];
    if (tenseExIndex + 1 < currentTense.exercises.length) {
      setTenseExIndex(prev => prev + 1);
      setTenseSelectedAnswer(null);
      setTenseIsAnswerChecked(false);
    } else {
      setTenseExerciseFinished(true);
      if (tenseCorrectCount >= currentTense.exercises.length * 0.8) {
        sounds.playVictory();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestartTenseQuiz = () => {
    sounds.playClick();
    setTenseExIndex(0);
    setTenseSelectedAnswer(null);
    setTenseIsAnswerChecked(false);
    setTenseCorrectCount(0);
    setTenseExerciseFinished(false);
  };

  // Word Order Quiz Handlers
  const handleToggleWordOrderQuiz = (ruleId: string) => {
    sounds.playClick();
    setExpandedWordOrderQuizId(prev => (prev === ruleId ? null : ruleId));
    if (!wordOrderQuizState[ruleId]) {
      setWordOrderQuizState(prev => ({
        ...prev,
        [ruleId]: {
          index: 0,
          selectedAnswer: null,
          isChecked: false,
          correctCount: 0,
          isFinished: false
        }
      }));
    }
  };

  const handleSelectWordOrderOption = (ruleId: string, label: 'A' | 'B' | 'C' | 'D', correctAnswer: 'A' | 'B' | 'C' | 'D') => {
    const currentState = wordOrderQuizState[ruleId] || {
      index: 0,
      selectedAnswer: null,
      isChecked: false,
      correctCount: 0,
      isFinished: false
    };

    if (currentState.isChecked) return;

    const isCorrect = label === correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playWrong();
    }

    setWordOrderQuizState(prev => ({
      ...prev,
      [ruleId]: {
        ...currentState,
        selectedAnswer: label,
        isChecked: true,
        correctCount: currentState.correctCount + (isCorrect ? 1 : 0)
      }
    }));
  };

  const handleNextWordOrderExercise = (ruleId: string, totalExercises: number) => {
    sounds.playClick();
    const currentState = wordOrderQuizState[ruleId];
    if (!currentState) return;

    if (currentState.index + 1 < totalExercises) {
      setWordOrderQuizState(prev => ({
        ...prev,
        [ruleId]: {
          ...currentState,
          index: currentState.index + 1,
          selectedAnswer: null,
          isChecked: false
        }
      }));
    } else {
      setWordOrderQuizState(prev => ({
        ...prev,
        [ruleId]: {
          ...currentState,
          isFinished: true
        }
      }));
      sounds.playVictory();
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestartWordOrderQuiz = (ruleId: string) => {
    sounds.playClick();
    setWordOrderQuizState(prev => ({
      ...prev,
      [ruleId]: {
        index: 0,
        selectedAnswer: null,
        isChecked: false,
        correctCount: 0,
        isFinished: false
      }
    }));
  };

  // Survival Mode logic
  const handleStartSurvival = () => {
    sounds.playClick();
    const all = getAllGrammarExercises();
    const shuffled = [...all].sort(() => 0.5 - Math.random()).slice(0, 10);
    setSurvivalQuizzes(shuffled);
    setSurvivalIndex(0);
    setHearts(3);
    setScore(0);
    setTimeLeft(15);
    setSurvivalGameOver(false);
    setSurvivalGameWon(false);
    setSurvivalAnswered(false);
    setSurvivalSelectedOption(null);
    setRoastMessage(null);
    setViewMode('SURVIVAL');
  };

  // Survival countdown timer
  useEffect(() => {
    if (viewMode !== 'SURVIVAL' || survivalGameOver || survivalGameWon || survivalAnswered || survivalQuizzes.length === 0) return;

    if (timeLeft <= 0) {
      handleSurvivalWrong("Hết thời gian 15s rồi! Chậm chạp thế hả Mập địch?");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, timeLeft, survivalGameOver, survivalGameWon, survivalAnswered, survivalQuizzes]);

  const handleSurvivalWrong = (msg?: string) => {
    sounds.playWrong();
    setSurvivalAnswered(true);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);

    const roasts = [
      "Ủa alo? Ngữ pháp học xong trả lại cho thầy cô rồi à?",
      "Chọn bừa đúng không? Dính bẫy kinh điển của ETS rồi!",
      "Trừ 1 ly trà sữa trân châu đường đen!",
      "Mập địch ơi là Mập địch! Đọc kỹ giải thích đi kìa!",
      "Nhìn Trollface cười chưa? Mau phục thù trận sau đi!"
    ];
    setRoastMessage(msg || roasts[Math.floor(Math.random() * roasts.length)]);

    const newHearts = hearts - 1;
    setHearts(newHearts);

    if (newHearts <= 0) {
      setTimeout(() => {
        setSurvivalGameOver(true);
      }, 1500);
    }
  };

  const handleSelectSurvivalOption = (label: 'A' | 'B' | 'C' | 'D') => {
    if (survivalAnswered) return;
    setSurvivalSelectedOption(label);
    setSurvivalAnswered(true);

    const currentQ = survivalQuizzes[survivalIndex];
    if (label === currentQ.correctAnswer) {
      sounds.playCorrect();
      setScore(prev => prev + 100 + timeLeft * 10);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      handleSurvivalWrong();
    }
  };

  const handleNextSurvivalQuestion = () => {
    sounds.playClick();
    if (survivalIndex + 1 < survivalQuizzes.length) {
      setSurvivalIndex(prev => prev + 1);
      setSurvivalSelectedOption(null);
      setSurvivalAnswered(false);
      setTimeLeft(15);
      setRoastMessage(null);
    } else {
      sounds.playVictory();
      setSurvivalGameWon(true);
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  // Helper for visual step colors
  const getStepBgColor = (color: WordOrderStep['color']) => {
    switch (color) {
      case 'yellow': return 'bg-neoYellow text-black border-black';
      case 'blue': return 'bg-neoCyan text-black border-black';
      case 'green': return 'bg-neoGreen text-black border-black';
      case 'purple': return 'bg-neoPurple text-black border-black';
      case 'red': return 'bg-neoPink text-black border-black';
      default: return 'bg-gray-100 text-gray-800 border-black';
    }
  };

  // ----------------------------------------------------
  // RENDER: MAIN HUB VIEW (3 TABS: 12 TENSES | WORD ORDER | TOPICS)
  // ----------------------------------------------------
  if (viewMode === 'MAIN') {
    const selectedTense = fullTwelveTenses.find(t => t.id === selectedTenseId) || fullTwelveTenses[0];

    return (
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Menu
          </button>

          {/* Quick Survival Quiz Trigger */}
          <button
            onClick={handleStartSurvival}
            className="flex items-center gap-2 px-5 py-2.5 bg-neoYellow hover:bg-amber-300 border-3 border-black font-black text-sm uppercase shadow-neo hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-black text-black" />
            <span>Thách Đấu Sinh Tồn 15s ⚡</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="bg-neoYellow border-4 border-black p-6 md:p-8 shadow-neo-lg mb-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black font-black text-xs uppercase mb-3 shadow-neo-sm rotate-[-1deg]">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Bí Kíp Độc Quyền Dành Cho {nickname}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black font-heading uppercase text-black">
                Ngữ Pháp TOEIC Trực Quan
              </h1>
              <p className="text-base md:text-lg font-bold text-gray-800 mt-2 max-w-2xl">
                Công thức dạng khối màu sắc dễ nhìn, trọn bộ Full 12 thì chuẩn xác và quy tắc vị trí từ loại (Adv + Verb, Adj + Noun, Linking Verbs).
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
              <div className="bg-white border-3 border-black p-3 text-center shadow-neo-sm min-w-[100px] flex-1 sm:flex-none">
                <div className="text-2xl font-black text-neoDark">12</div>
                <div className="text-xs font-bold text-gray-600 uppercase">Thì Chuẩn</div>
              </div>
              <div className="bg-white border-3 border-black p-3 text-center shadow-neo-sm min-w-[100px] flex-1 sm:flex-none">
                <div className="text-2xl font-black text-neoDark">6</div>
                <div className="text-xs font-bold text-gray-600 uppercase">Sơ Đồ Từ Loại</div>
              </div>
              <div className="bg-white border-3 border-black p-3 text-center shadow-neo-sm min-w-[100px] flex-1 sm:flex-none">
                <div className="text-2xl font-black text-emerald-600">50+</div>
                <div className="text-xs font-bold text-gray-600 uppercase">Câu Part 5</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Legend: BẢNG CHÚ THÍCH KÝ HIỆU CÔNG THỨC */}
        <div className="bg-white border-4 border-black p-4 shadow-neo mb-6">
          <div 
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-neoDark" />
              <h3 className="font-black text-sm md:text-base uppercase">
                💡 Bảng Chú Thích Ký Hiệu Công Thức (Đọc là hiểu ngay!)
              </h3>
            </div>
            <button className="text-xs font-black flex items-center gap-1 text-gray-600">
              {showLegend ? 'Thu gọn' : 'Xem chi tiết'}
              {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showLegend && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-3 pt-3 border-t-2 border-dashed border-gray-300">
              <div className="bg-gray-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-black">S (Subject)</div>
                <div className="text-[11px] font-bold text-gray-600">Chủ ngữ: người/vật làm hành động</div>
              </div>
              <div className="bg-emerald-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-emerald-900">V (Verb)</div>
                <div className="text-[11px] font-bold text-gray-600">Động từ: hành động / trạng thái</div>
              </div>
              <div className="bg-cyan-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-cyan-900">Adj (Adjective)</div>
                <div className="text-[11px] font-bold text-gray-600">Tính từ: miêu tả tính chất</div>
              </div>
              <div className="bg-amber-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-amber-900">Adv (Adverb)</div>
                <div className="text-[11px] font-bold text-gray-600">Trạng từ: bổ nghĩa (-ly)</div>
              </div>
              <div className="bg-purple-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-purple-900">O (Object)</div>
                <div className="text-[11px] font-bold text-gray-600">Tân ngữ: đối tượng chịu tác động</div>
              </div>
              <div className="bg-rose-100 p-2 border-2 border-black">
                <div className="font-mono font-black text-sm text-rose-900">V3/ed</div>
                <div className="text-[11px] font-bold text-gray-600">Quá khứ phân từ (Bị động/HT)</div>
              </div>
            </div>
          )}
        </div>

        {/* 3 Main Mode Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveMainTab('TENSES');
            }}
            className={`p-4 border-4 border-black font-black text-base uppercase flex items-center justify-center gap-3 transition-all cursor-pointer ${
              activeMainTab === 'TENSES'
                ? 'bg-neoYellow shadow-neo translate-x-1 translate-y-1'
                : 'bg-white shadow-neo hover:bg-amber-50'
            }`}
          >
            <Clock className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black">Full 12 Thì Tiếng Anh</div>
              <div className="text-xs text-gray-600 font-bold">Hiện tại, Quá khứ, Tương lai</div>
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveMainTab('WORD_ORDER');
            }}
            className={`p-4 border-4 border-black font-black text-base uppercase flex items-center justify-center gap-3 transition-all cursor-pointer ${
              activeMainTab === 'WORD_ORDER'
                ? 'bg-neoPurple shadow-neo translate-x-1 translate-y-1'
                : 'bg-white shadow-neo hover:bg-purple-50'
            }`}
          >
            <Layers className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black">Vị Trí Từ Loại</div>
              <div className="text-xs text-gray-600 font-bold">Adv + V, Adj + N, Linking Verbs</div>
            </div>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveMainTab('TOPICS');
            }}
            className={`p-4 border-4 border-black font-black text-base uppercase flex items-center justify-center gap-3 transition-all cursor-pointer ${
              activeMainTab === 'TOPICS'
                ? 'bg-neoGreen shadow-neo translate-x-1 translate-y-1'
                : 'bg-white shadow-neo hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black">Chuyên Đề TOEIC</div>
              <div className="text-xs text-gray-600 font-bold">10 Chuyên đề & Quiz</div>
            </div>
          </button>
        </div>

        {/* ---------------- TAB 1: FULL 12 TENSES MASTERCLASS ---------------- */}
        {activeMainTab === 'TENSES' && (
          <div className="flex flex-col gap-6">
            {/* Filter buttons for 12 Tenses */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-4 border-black p-4 shadow-neo">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-black text-xs uppercase">Phân nhóm thì:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'PRESENT', 'PAST', 'FUTURE'] as const).map(group => (
                  <button
                    key={group}
                    onClick={() => {
                      sounds.playClick();
                      setTenseFilter(group);
                    }}
                    className={`px-3 py-1.5 border-2 border-black font-black text-xs uppercase transition-all cursor-pointer ${
                      tenseFilter === group
                        ? 'bg-neoYellow text-black shadow-neo-sm translate-x-0.5 translate-y-0.5'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {group === 'ALL' ? 'Tất cả 12 thì' : group === 'PRESENT' ? '4 Thì Hiện Tại' : group === 'PAST' ? '4 Thì Quá Khứ' : '4 Thì Tương Lai'}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout: Sidebar selector + Detail card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tense list selector */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                {filteredTenses.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTense(t.id)}
                    className={`relative p-3.5 border-3 border-black text-left font-black transition-all cursor-pointer flex items-center justify-between ${
                      selectedTenseId === t.id
                        ? 'bg-neoYellow shadow-neo translate-x-1'
                        : 'bg-white hover:bg-amber-50 shadow-neo-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs uppercase text-gray-500 font-bold">
                          {t.group} • Thì #{idx + 1}
                        </span>
                        {t.isHighFrequency && (
                          <span className="px-1.5 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase border border-black shadow-neo-sm">
                            🔥 RA THI
                          </span>
                        )}
                      </div>
                      <div className="text-base font-black font-heading mt-0.5">
                        {t.nameVi}
                      </div>
                      <div className="text-xs font-mono text-gray-700 italic">
                        {t.nameEn}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Tense Detail View */}
              <div className="relative lg:col-span-8 bg-white border-4 border-black p-6 md:p-8 shadow-neo flex flex-col gap-6">
                {/* Corner Indicator */}
                {selectedTense.isHighFrequency && (
                  <div className="absolute -top-3.5 -right-2.5 sm:-right-3 z-10 bg-red-600 text-white font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-neo-sm rotate-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{selectedTense.examBadge || 'TRỌNG ĐIỂM RA THI TOEIC'}</span>
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-neoYellow border-2 border-black font-black text-xs uppercase">
                      {selectedTense.group} TENSE
                    </span>
                    {selectedTense.isHighFrequency && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white border-2 border-black font-black text-xs uppercase shadow-neo-sm">
                        <Flame className="w-3.5 h-3.5 text-yellow-300" />
                        {selectedTense.examBadge || 'TRỌNG ĐIỂM RA THI 90%+'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black font-heading uppercase text-black">
                    {selectedTense.nameVi} ({selectedTense.nameEn})
                  </h2>
                  <p className="text-sm font-bold text-gray-600 mt-1">
                    📌 {selectedTense.summaryBadge}
                  </p>
                </div>

                {/* Tense Sub-tabs (Theory vs Practice) */}
                <div className="flex border-3 border-black p-1 bg-gray-100 gap-1.5 shadow-neo-sm">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setTenseViewTab('THEORY');
                    }}
                    className={`flex-1 py-2.5 font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-black ${
                      tenseViewTab === 'THEORY'
                        ? 'bg-neoYellow shadow-neo-sm'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Lý Thuyết & Công Thức</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setTenseViewTab('PRACTICE');
                    }}
                    className={`flex-1 py-2.5 font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-black ${
                      tenseViewTab === 'PRACTICE'
                        ? 'bg-neoGreen shadow-neo-sm'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Luyện Tập Trắc Nghiệm ({selectedTense.exercises.length} câu)</span>
                  </button>
                </div>

                {tenseViewTab === 'THEORY' && (
                  <div className="flex flex-col gap-6">

                {/* VISUAL COLOR-CODED FORMULA CARDS */}
                <div className="space-y-4">
                  <div className="text-xs font-black uppercase text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Bảng Công Thức Trực Quan Dễ Nhớ:
                  </div>

                  {selectedTense.formulaBlocks.map((block, bIdx) => (
                    <div key={bIdx} className="border-3 border-black bg-gray-50 p-4 shadow-neo-sm">
                      <div className="inline-block px-2.5 py-0.5 bg-black text-white font-black text-xs uppercase mb-3">
                        {block.typeLabel}
                      </div>

                      <div className="space-y-3">
                        {/* (+) Affirmative */}
                        <div className="bg-emerald-50 border-2 border-emerald-500 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-xs uppercase">
                              (+) Khẳng định
                            </span>
                          </div>
                          <div className="font-mono text-base md:text-lg font-black text-emerald-950 mt-1">
                            {block.affirmative}
                          </div>
                          <div className="mt-2 text-xs font-bold text-gray-700 border-t border-emerald-200 pt-1.5">
                            <span className="text-emerald-800 font-black">Ví dụ: </span>"{block.exampleAffirmative.en}"
                            <span className="block text-gray-500 text-[11px] mt-0.5">👉 {block.exampleAffirmative.vi}</span>
                          </div>
                        </div>

                        {/* (-) Negative */}
                        <div className="bg-rose-50 border-2 border-rose-500 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-xs uppercase">
                              (-) Phủ định
                            </span>
                          </div>
                          <div className="font-mono text-base md:text-lg font-black text-rose-950 mt-1">
                            {block.negative}
                          </div>
                          <div className="mt-2 text-xs font-bold text-gray-700 border-t border-rose-200 pt-1.5">
                            <span className="text-rose-800 font-black">Ví dụ: </span>"{block.exampleNegative.en}"
                            <span className="block text-gray-500 text-[11px] mt-0.5">👉 {block.exampleNegative.vi}</span>
                          </div>
                        </div>

                        {/* (?) Question */}
                        <div className="bg-sky-50 border-2 border-sky-500 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 bg-sky-600 text-white font-black text-xs uppercase">
                              (?) Nghi vấn
                            </span>
                          </div>
                          <div className="font-mono text-base md:text-lg font-black text-sky-950 mt-1">
                            {block.question}
                          </div>
                          <div className="mt-2 text-xs font-bold text-gray-700 border-t border-sky-200 pt-1.5">
                            <span className="text-sky-800 font-black">Ví dụ: </span>"{block.exampleQuestion.en}"
                            <span className="block text-gray-500 text-[11px] mt-0.5">👉 {block.exampleQuestion.vi}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Usages */}
                <div>
                  <div className="text-xs font-black uppercase text-gray-600 mb-2">Cách Dùng Cốt Lõi:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm font-bold text-gray-800">
                    {selectedTense.usage.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>

                {/* Signal words */}
                <div>
                  <div className="text-xs font-black uppercase text-gray-600 mb-2">Dấu Hiệu Nhận Biết Trong Đề Thi (Signal Words):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTense.signalWords.map((sw, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 border-2 border-black font-mono font-black text-xs shadow-neo-sm">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ETS Trap */}
                <div className="bg-rose-50 border-3 border-rose-500 p-4 shadow-neo-sm">
                  <div className="text-xs font-black uppercase text-rose-700 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> BẪY ETS KINH ĐIỂN CẦN TRÁNH:
                  </div>
                  <p className="text-sm font-bold text-rose-900">
                    {selectedTense.toeicTrap}
                  </p>
                </div>
              </div>
            )}

            {/* TENSE PRACTICE QUIZ */}
            {tenseViewTab === 'PRACTICE' && (
              <div>
                {!tenseExerciseFinished ? (
                  <div className="bg-amber-50/50 border-3 border-black p-5 md:p-6 shadow-neo-sm">
                    {/* Progress bar */}
                    <div className="flex items-center justify-between text-xs font-black mb-3">
                      <span className="uppercase">
                        Câu hỏi {tenseExIndex + 1} / {selectedTense.exercises.length}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Đúng: {tenseCorrectCount} câu
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 border-2 border-black mb-5">
                      <div
                        className="h-full bg-neoGreen transition-all duration-300"
                        style={{
                          width: `${((tenseExIndex + 1) / selectedTense.exercises.length) * 100}%`
                        }}
                      />
                    </div>

                    {/* Question Box */}
                    {(() => {
                      const currentTenseEx = selectedTense.exercises[tenseExIndex];
                      if (!currentTenseEx) return null;

                      return (
                        <div>
                          <div className="text-xs font-black uppercase text-amber-800 mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Bài Tập Thực Chiến: {selectedTense.nameVi} ({selectedTense.nameEn})
                          </div>
                          <h3 className="text-base md:text-xl font-black font-heading leading-relaxed text-black bg-white p-4 border-3 border-black shadow-neo-sm mb-5">
                            {currentTenseEx.question}
                          </h3>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                            {currentTenseEx.options.map(opt => {
                              const isSelected = tenseSelectedAnswer === opt.label;
                              const isCorrect = opt.label === currentTenseEx.correctAnswer;
                              let btnStyle = 'bg-white hover:bg-amber-100 text-black';

                              if (tenseIsAnswerChecked) {
                                if (isCorrect) {
                                  btnStyle = 'bg-emerald-400 text-black ring-2 ring-emerald-700 font-black';
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-400 text-black ring-2 ring-rose-700 font-black';
                                } else {
                                  btnStyle = 'bg-gray-100 text-gray-400 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => handleSelectTenseOption(opt.label)}
                                  disabled={tenseIsAnswerChecked}
                                  className={`p-3.5 border-3 border-black text-left font-black text-sm transition-all cursor-pointer shadow-neo-sm flex items-center gap-3 ${btnStyle}`}
                                >
                                  <span className="w-7 h-7 border-2 border-black bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0">
                                    {opt.label}
                                  </span>
                                  <span className="flex-1">{opt.text}</span>
                                  {tenseIsAnswerChecked && isCorrect && (
                                    <Check className="w-5 h-5 text-emerald-900 stroke-[3] shrink-0" />
                                  )}
                                  {tenseIsAnswerChecked && isSelected && !isCorrect && (
                                    <X className="w-5 h-5 text-rose-900 stroke-[3] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation & Translation Box */}
                          {tenseIsAnswerChecked && (
                            <div className="p-4 bg-white border-3 border-black shadow-neo-sm space-y-3 mb-5">
                              <div className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-amber-600" /> Giải thích chi tiết:
                              </div>
                              <p className="text-sm font-bold text-gray-800 leading-relaxed">
                                {currentTenseEx.explanation}
                              </p>
                              <div className="border-t border-dashed border-gray-300 pt-2 text-xs md:text-sm font-bold text-gray-600 italic">
                                👉 Dịch nghĩa: "{currentTenseEx.translation}"
                              </div>

                              <div className="pt-2 flex justify-end">
                                <button
                                  onClick={handleNextTenseExercise}
                                  className="px-6 py-2.5 bg-neoGreen hover:bg-emerald-400 border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo cursor-pointer flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
                                >
                                  <span>
                                    {tenseExIndex + 1 < selectedTense.exercises.length
                                      ? 'Câu Tiếp Theo'
                                      : 'Xem Kết Quả'}
                                  </span>
                                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* Tense Quiz Result Screen */
                  <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo text-center">
                    <div className="w-16 h-16 bg-neoYellow border-3 border-black mx-auto flex items-center justify-center shadow-neo mb-4">
                      <Trophy className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-black font-heading uppercase text-black mb-1">
                      Hoàn Thành Bài Luyện Tập Thì!
                    </h3>
                    <p className="text-sm font-bold text-gray-600 mb-4">
                      Bạn đã trả lời đúng {tenseCorrectCount} / {selectedTense.exercises.length} câu của thì {selectedTense.nameVi} ({selectedTense.nameEn}).
                    </p>
                    <div className="inline-block px-4 py-2 bg-neoGreen border-3 border-black font-black text-base uppercase shadow-neo-sm mb-6">
                      Đạt {Math.round((tenseCorrectCount / selectedTense.exercises.length) * 100)}% Điểm
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={handleRestartTenseQuiz}
                        className="px-5 py-2.5 bg-neoYellow hover:bg-amber-300 border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Luyện Tập Lại</span>
                      </button>
                      <button
                        onClick={() => setTenseViewTab('THEORY')}
                        className="px-5 py-2.5 bg-white hover:bg-gray-100 border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Xem Lại Lý Thuyết</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: WORD ORDER (VISUAL STEP-BY-STEP FLOW) ---------------- */}
        {activeMainTab === 'WORD_ORDER' && (
          <div className="flex flex-col gap-6">
            <div className="bg-neoPurple border-4 border-black p-6 shadow-neo">
              <h2 className="text-2xl md:text-3xl font-black font-heading uppercase text-black">
                Cẩm Nang Trật Tự Từ Loại & Sơ Đồ Khối Part 5
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-800 mt-1 max-w-3xl">
                Quy tắc vị trí vàng giữa <span className="underline font-black">Trạng từ & Động từ</span>, <span className="underline font-black">Tính từ & Danh từ</span>, <span className="underline font-black">Động từ nối (Linking Verbs)</span> và cấu trúc ngoại động từ đặc biệt.
              </p>
            </div>

            {/* Rules Cards with VISUAL STEP DIAGRAMS */}
            <div className="grid grid-cols-1 gap-6">
              {wordOrderRules.map((rule, idx) => (
                <div key={rule.id} className="relative bg-white border-4 border-black p-6 shadow-neo flex flex-col gap-4">
                  {/* High Frequency Exam Corner Badge */}
                  {rule.isHighFrequency && (
                    <div className="absolute -top-3.5 -right-2.5 sm:-right-3 z-10 bg-red-600 text-white font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-neo-sm rotate-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-yellow-300" />
                      <span>{rule.examBadge || 'HAY RA THI NHẤT'}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase px-2.5 py-1 bg-neoYellow border-2 border-black shadow-neo-sm">
                        {rule.badge}
                      </span>
                      {rule.isHighFrequency && (
                        <span className="text-xs font-black uppercase px-2 py-0.5 bg-red-100 text-red-700 border border-red-500">
                          🔥 Hay ra thi
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-gray-500">Quy tắc #{idx + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black font-heading text-black">
                    {rule.ruleName}
                  </h3>

                  {/* VISUAL FLOW DIAGRAM (MŨI TÊN KẾT NỐI KHỐI) */}
                  <div className="bg-gray-50 border-3 border-black p-4 shadow-neo-sm">
                    <div className="text-xs font-black uppercase text-gray-500 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neoDark" /> Sơ đồ vị trí các thành phần:
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {rule.visualSteps.map((step, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <div className={`p-3 border-3 font-mono text-center min-w-[110px] sm:min-w-[130px] shadow-neo-sm ${getStepBgColor(step.color)} ${step.isKey ? 'ring-2 ring-black scale-105' : ''}`}>
                            <div className="text-[11px] uppercase font-bold text-gray-700">{step.label}</div>
                            <div className="font-black text-sm md:text-base mt-0.5">{step.token}</div>
                            <div className="text-xs italic font-sans font-bold text-gray-600 mt-1 border-t border-black/20 pt-1">
                              "{step.sampleWord}"
                            </div>
                          </div>
                          {sIdx < rule.visualSteps.length - 1 && (
                            <ArrowRight className="w-5 h-5 text-black stroke-[3] shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm md:text-base font-bold text-gray-800">
                    {rule.coreRule}
                  </p>

                  <ul className="list-disc list-inside space-y-1 text-xs md:text-sm font-bold text-gray-600">
                    {rule.explanation.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>

                  {/* Example Box */}
                  <div className="bg-amber-50 border-2 border-black p-3.5">
                    <div className="text-xs font-black uppercase text-amber-900 mb-1.5">Ví Dụ Phân Tích Thực Tế:</div>
                    {rule.examples.map((ex, i) => (
                      <div key={i} className="text-xs md:text-sm font-bold mb-2 last:mb-0">
                        <p className="italic text-black">"{ex.en}"</p>
                        <p className="text-gray-600 mt-0.5">👉 {ex.vi}</p>
                        {ex.note && <p className="text-emerald-700 font-mono text-xs mt-0.5">[{ex.note}]</p>}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="text-xs font-bold text-rose-900 bg-rose-50 border-2 border-rose-400 p-2.5">
                      <span className="font-black text-rose-700 uppercase block mb-1">⚠️ Lưu ý bẫy sai:</span>
                      {rule.commonMistakes}
                    </div>
                    <div className="text-xs font-bold text-emerald-900 bg-emerald-50 border-2 border-emerald-400 p-2.5">
                      <span className="font-black text-emerald-700 uppercase block mb-1">💡 Mẹo ETS Part 5:</span>
                      {rule.etsTip}
                    </div>
                  </div>

                  {/* WORD ORDER INTERACTIVE PRACTICE */}
                  <div className="border-3 border-black bg-gray-50 p-3 sm:p-4 shadow-neo-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-black text-xs uppercase text-gray-700">
                          Luyện tập củng cố: {rule.exercises.length} câu trắc nghiệm Part 5
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleWordOrderQuiz(rule.id)}
                        className={`px-3 py-1.5 border-2 border-black font-black text-xs uppercase shadow-neo-sm flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${
                          expandedWordOrderQuizId === rule.id
                            ? 'bg-neoYellow'
                            : 'bg-white hover:bg-amber-50'
                        }`}
                      >
                        <span>{expandedWordOrderQuizId === rule.id ? 'Đóng Quiz' : 'Làm Bài Ngay'}</span>
                        {expandedWordOrderQuizId === rule.id ? (
                          <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </button>
                    </div>

                    {expandedWordOrderQuizId === rule.id && (() => {
                      const qState = wordOrderQuizState[rule.id] || {
                        index: 0,
                        selectedAnswer: null,
                        isChecked: false,
                        correctCount: 0,
                        isFinished: false
                      };
                      const currentEx = rule.exercises[qState.index];

                      if (qState.isFinished) {
                        return (
                          <div className="mt-4 bg-white border-2 border-black p-4 text-center">
                            <div className="font-black text-base uppercase text-black mb-1">
                              🎉 Hoàn thành luyện tập quy tắc!
                            </div>
                            <p className="text-xs font-bold text-gray-600 mb-3">
                              Đúng {qState.correctCount} / {rule.exercises.length} câu ({Math.round((qState.correctCount / rule.exercises.length) * 100)}%)
                            </p>
                            <button
                              onClick={() => handleRestartWordOrderQuiz(rule.id)}
                              className="px-4 py-2 bg-neoYellow border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center gap-1.5 mx-auto active:translate-x-0.5 active:translate-y-0.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Làm Lại Quiz</span>
                            </button>
                          </div>
                        );
                      }

                      if (!currentEx) return null;

                      return (
                        <div className="mt-4 bg-white border-2 border-black p-4">
                          <div className="flex items-center justify-between text-xs font-black text-gray-500 mb-2">
                            <span>Câu {qState.index + 1} / {rule.exercises.length}</span>
                            <span className="text-emerald-700 font-bold">Đúng: {qState.correctCount} câu</span>
                          </div>

                          <div className="text-sm md:text-base font-black font-heading text-black bg-amber-50 p-3 border-2 border-black mb-3">
                            {currentEx.question}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {currentEx.options.map(opt => {
                              const isSelected = qState.selectedAnswer === opt.label;
                              const isCorrect = opt.label === currentEx.correctAnswer;
                              let btnStyle = 'bg-white hover:bg-amber-100 text-black';

                              if (qState.isChecked) {
                                if (isCorrect) {
                                  btnStyle = 'bg-emerald-300 text-black font-black ring-2 ring-emerald-600';
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-300 text-black font-black ring-2 ring-rose-600';
                                } else {
                                  btnStyle = 'bg-gray-100 text-gray-400 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => handleSelectWordOrderOption(rule.id, opt.label, currentEx.correctAnswer)}
                                  disabled={qState.isChecked}
                                  className={`p-2.5 border-2 border-black text-left font-black text-xs transition-all cursor-pointer shadow-neo-sm flex items-center gap-2 ${btnStyle}`}
                                >
                                  <span className="w-5 h-5 border border-black bg-black text-white flex items-center justify-center font-mono font-black text-[10px] shrink-0">
                                    {opt.label}
                                  </span>
                                  <span className="flex-1">{opt.text}</span>
                                  {qState.isChecked && isCorrect && <Check className="w-4 h-4 text-emerald-900 stroke-[3] shrink-0" />}
                                  {qState.isChecked && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-900 stroke-[3] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {qState.isChecked && (
                            <div className="p-3 bg-amber-50/70 border-2 border-black space-y-2">
                              <p className="text-xs font-bold text-gray-800">
                                💡 <span className="font-black text-black">Giải thích:</span> {currentEx.explanation}
                              </p>
                              <p className="text-xs font-bold text-gray-600 italic">
                                👉 Dịch nghĩa: "{currentEx.translation}"
                              </p>
                              <div className="pt-1 flex justify-end">
                                <button
                                  onClick={() => handleNextWordOrderExercise(rule.id, rule.exercises.length)}
                                  className="px-4 py-1.5 bg-neoGreen border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
                                >
                                  <span>{qState.index + 1 < rule.exercises.length ? 'Câu Tiếp' : 'Xem Kết Quả'}</span>
                                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: 10 TOPICS ---------------- */}
        {activeMainTab === 'TOPICS' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm chuyên đề ngữ pháp, thì, bị động, mệnh đề..."
                  className="w-full bg-white border-3 border-black pl-10 pr-4 py-2.5 font-bold text-sm shadow-neo-sm focus:outline-none focus:bg-amber-50"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-2 border-2 border-black font-black text-xs whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat 
                        ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5' 
                        : 'bg-white text-black shadow-neo-sm hover:bg-gray-100'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tất cả' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTopics.map((topic, index) => {
                const userScore = topicProgress[topic.id] || 0;
                const totalQ = topic.exercises.length;
                const isCompleted = userScore >= totalQ * 0.8;

                return (
                  <div
                    key={topic.id}
                    onClick={() => handleOpenTopic(topic)}
                    className="relative bg-white border-4 border-black p-5 md:p-6 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    {/* High Frequency Exam Corner Badge */}
                    {topic.isHighFrequency && (
                      <div className="absolute -top-3.5 -right-2.5 sm:-right-3 z-10 bg-red-600 text-white font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-neo-sm rotate-2 flex items-center gap-1.5 group-hover:rotate-0 transition-transform">
                        <Flame className="w-3.5 h-3.5 text-yellow-300" />
                        <span>{topic.examFrequencyBadge || 'TRỌNG ĐIỂM RA THI'}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 bg-neoYellow border-2 border-black font-black text-xs uppercase shadow-neo-sm">
                            {topic.badge}
                          </span>
                          {topic.isHighFrequency && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-500 font-black text-[11px] uppercase">
                              🔥 Hay ra thi
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 border border-black bg-gray-100">
                          {topic.difficulty}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black font-heading group-hover:text-amber-600 transition-colors">
                        {index + 1}. {topic.title}
                      </h3>

                      <p className="text-sm font-bold text-gray-600 mt-2 line-clamp-2">
                        {topic.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-dashed border-gray-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-400 px-2 py-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành ({userScore}/{totalQ})
                          </span>
                        ) : userScore > 0 ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-400 px-2 py-0.5">
                            Đang học: {userScore}/{totalQ} điểm
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-gray-500">
                            Chưa làm trắc nghiệm
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 font-black text-sm group-hover:translate-x-1 transition-transform">
                        <span>Học ngay</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: LESSON DETAIL VIEW
  // ----------------------------------------------------
  if (viewMode === 'LESSON') {
    const currentEx = selectedTopic.exercises[currentExIndex];

    return (
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Top Back & Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode('MAIN');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Danh sách chuyên đề
          </button>

          <span className="px-3 py-1 bg-neoYellow border-2 border-black font-black text-xs uppercase shadow-neo-sm">
            {selectedTopic.badge}
          </span>
        </div>

        {/* Title Header */}
        <div className="relative bg-white border-4 border-black p-5 md:p-6 shadow-neo-lg mb-6">
          {/* High Frequency Exam Corner Badge */}
          {selectedTopic.isHighFrequency && (
            <div className="absolute -top-3.5 -right-2.5 sm:-right-3 z-10 bg-red-600 text-white font-black text-xs sm:text-sm uppercase px-3 py-1 border-2 border-black shadow-neo-sm rotate-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>{selectedTopic.examFrequencyBadge || 'TRỌNG ĐIỂM RA THI TOEIC'}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                {selectedTopic.category} • {selectedTopic.difficulty}
              </span>
              {selectedTopic.isHighFrequency && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-500 font-black text-xs uppercase shadow-neo-sm">
                  🔥 Trọng điểm Part 5 & 6
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-4xl font-black font-heading uppercase text-black">
              {selectedTopic.title}
            </h2>
            <p className="text-sm md:text-base font-bold text-gray-700 mt-1">
              {selectedTopic.summary}
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t-3 border-black">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveLessonTab('THEORY');
              }}
              className={`flex-1 py-3 border-3 border-black font-black text-sm sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeLessonTab === 'THEORY'
                  ? 'bg-neoYellow shadow-neo translate-x-0.5 translate-y-0.5'
                  : 'bg-gray-100 hover:bg-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Lý Thuyết & Mẹo ETS</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveLessonTab('PRACTICE');
              }}
              className={`flex-1 py-3 border-3 border-black font-black text-sm sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeLessonTab === 'PRACTICE'
                  ? 'bg-neoGreen shadow-neo translate-x-0.5 translate-y-0.5'
                  : 'bg-gray-100 hover:bg-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Trắc Nghiệm Thực Chiến ({selectedTopic.exercises.length} câu)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: THEORY */}
        {activeLessonTab === 'THEORY' && (
          <div className="flex flex-col gap-6">
            {selectedTopic.sections.map((sec, idx) => (
              <div key={idx} className="relative bg-white border-4 border-black p-5 md:p-6 shadow-neo">
                {/* Section High Frequency Corner Badge */}
                {sec.isHighFrequency && (
                  <div className="absolute -top-3 -right-2 z-10 bg-red-600 text-white font-black text-xs uppercase px-2.5 py-0.5 border-2 border-black shadow-neo-sm rotate-2 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{sec.examBadge || 'TRỌNG ĐIỂM RA THI'}</span>
                  </div>
                )}

                <h3 className="text-xl md:text-2xl font-black font-heading text-black mb-3">
                  {sec.title}
                </h3>

                {sec.formula && (
                  <div className="bg-amber-100 border-3 border-black p-4 mb-4 shadow-neo-sm">
                    <div className="text-xs font-black uppercase text-amber-900 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" /> CÔNG THỨC CẦN NHỚ:
                    </div>
                    <div className="flex flex-col gap-2">
                      {sec.formula
                        .split(/\n|\|/)
                        .map(item => item.trim())
                        .filter(Boolean)
                        .map((item, fIdx) => (
                          <div 
                            key={fIdx}
                            className="bg-white border-2 border-black p-2.5 sm:p-3 font-mono font-black text-sm md:text-base text-neoDark shadow-neo-sm flex items-center gap-2.5"
                          >
                            <span className="w-2.5 h-2.5 bg-amber-500 border border-black rounded-full shrink-0" />
                            <span className="leading-snug">{item.replace(/^[•\-]\s*/, '')}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}

                {sec.notes && sec.notes.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-black uppercase text-gray-500 mb-2">Quy Tắc Trọng Điểm:</div>
                    <ul className="list-disc list-inside space-y-1.5 text-sm md:text-base font-bold text-gray-800">
                      {sec.notes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {sec.examples && sec.examples.length > 0 && (
                  <div className="mb-4 bg-gray-50 border-2 border-black p-3">
                    <div className="text-xs font-black uppercase text-gray-600 mb-2">Ví Dụ Thực Tế:</div>
                    <div className="space-y-2">
                      {sec.examples.map((ex, eIdx) => (
                        <div key={eIdx} className="text-sm font-bold border-l-4 border-black pl-3 py-1">
                          <p className="text-black italic">"{ex.en}"</p>
                          <p className="text-gray-600 text-xs mt-0.5">👉 {ex.vi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sec.traps && sec.traps.length > 0 && (
                  <div className="bg-rose-50 border-3 border-rose-500 p-3.5 shadow-neo-sm">
                    <div className="text-xs font-black uppercase text-rose-700 flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Bẫy ETS Thường Gặp (Cực Kỳ Cẩn Thận!):
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm font-bold text-rose-900">
                      {sec.traps.map((trap, tIdx) => (
                        <li key={tIdx}>{trap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom action banner */}
            <div className="bg-neoGreen border-4 border-black p-6 text-center shadow-neo flex flex-col items-center gap-3">
              <h4 className="text-2xl font-black font-heading uppercase">
                Đã nắm vững lý thuyết chưa {nickname}?
              </h4>
              <p className="text-sm font-bold text-gray-800 max-w-lg">
                Thực hành ngay với {selectedTopic.exercises.length} câu trắc nghiệm để khắc sâu kiến thức và tránh mất điểm Part 5 nhé!
              </p>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveLessonTab('PRACTICE');
                }}
                className="mt-2 px-6 py-3 bg-white hover:bg-black hover:text-white border-3 border-black font-black text-sm uppercase shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Làm Bài Trắc Nghiệm Ngay</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PRACTICE */}
        {activeLessonTab === 'PRACTICE' && (
          <div>
            {!exerciseFinished ? (
              <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-black mb-4">
                  <span className="uppercase">Câu hỏi {currentExIndex + 1} / {selectedTopic.exercises.length}</span>
                  <span className="text-emerald-700 font-bold">Đúng: {correctCount} câu</span>
                </div>
                <div className="w-full h-3 bg-gray-200 border-2 border-black mb-6">
                  <div
                    className="h-full bg-neoGreen transition-all duration-300"
                    style={{ width: `${((currentExIndex + 1) / selectedTopic.exercises.length) * 100}%` }}
                  />
                </div>

                {/* Question Box */}
                <div className="mb-6">
                  <div className="text-xs font-black uppercase text-amber-700 mb-2">Part 5 Incomplete Sentences</div>
                  <h3 className="text-lg md:text-2xl font-black font-heading leading-relaxed text-black bg-amber-50 border-3 border-black p-4 shadow-neo-sm">
                    {currentEx.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentEx.options.map((opt) => {
                    const isSelected = selectedAnswer === opt.label;
                    const isCorrect = opt.label === currentEx.correctAnswer;

                    let btnStyle = 'bg-white hover:bg-amber-50 text-black border-3 border-black';
                    if (isAnswerChecked) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-300 text-black border-3 border-black shadow-neo-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-300 text-black border-3 border-black shadow-neo-sm font-black';
                      } else {
                        btnStyle = 'bg-gray-100 text-gray-400 border-2 border-gray-300';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-neoYellow text-black border-3 border-black shadow-neo-sm';
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={isAnswerChecked}
                        onClick={() => handleSelectOption(opt.label)}
                        className={`p-4 text-left font-bold text-sm md:text-base flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-none bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                            {opt.label}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isAnswerChecked && isCorrect && (
                          <Check className="w-5 h-5 text-emerald-800 stroke-[3]" />
                        )}
                        {isAnswerChecked && isSelected && !isCorrect && (
                          <X className="w-5 h-5 text-rose-800 stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Explanation upon answer */}
                {isAnswerChecked && (
                  <div className="bg-neoBg border-3 border-black p-4 md:p-5 shadow-neo-sm mb-6 animate-fadeIn">
                    <div className="flex items-center gap-2 font-black text-sm uppercase mb-2">
                      {selectedAnswer === currentEx.correctAnswer ? (
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-5 h-5" /> Chuẩn không cần chỉnh! Đáp án ({currentEx.correctAnswer})
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-5 h-5" /> Tiếc quá, sai rồi! Đáp án đúng là ({currentEx.correctAnswer})
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-gray-800 mb-2">
                      <span className="text-xs uppercase font-black text-gray-500 block mb-0.5">Dịch nghĩa câu:</span>
                      "{currentEx.translation}"
                    </div>

                    <div className="text-sm text-gray-800 pt-2 border-t border-gray-300">
                      <span className="text-xs uppercase font-black text-gray-500 block mb-0.5">Giải thích ngữ pháp:</span>
                      {currentEx.explanation}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleNextExercise}
                        className="px-6 py-2.5 bg-black text-white font-black text-sm uppercase shadow-neo hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-2"
                      >
                        <span>{currentExIndex + 1 < selectedTopic.exercises.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Topic Quiz Result Box */
              <div className="bg-white border-4 border-black p-8 text-center shadow-neo-lg flex flex-col items-center gap-5">
                <Trophy className="w-16 h-16 text-yellow-500 fill-yellow-400 animate-bounce" />
                <h3 className="text-3xl md:text-4xl font-black font-heading uppercase text-black">
                  Hoàn Thành Chuyên Đề!
                </h3>
                <p className="font-bold text-gray-700 text-base max-w-md">
                  {correctCount >= selectedTopic.exercises.length * 0.8
                    ? `Tuyệt vời ông mặt trời ${nickname}! Đã diệt gọn bẫy ngữ pháp của bài này!`
                    : `Cố gắng thêm chút nữa nhé ${nickname}! Đọc lại phần bẫy ETS và làm lại bài test này nhé!`}
                </p>

                <div className="px-6 py-3 bg-neoYellow border-3 border-black font-black text-2xl shadow-neo-sm">
                  🎯 Đúng: {correctCount} / {selectedTopic.exercises.length} câu
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                  <button
                    onClick={handleRestartTopicQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Làm lại bài test
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setViewMode('MAIN');
                    }}
                    className="px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300 cursor-pointer"
                  >
                    Học chuyên đề khác
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: SURVIVAL MODE (15-SECOND TOEIC GRAMMAR QUIZ)
  // ----------------------------------------------------
  const currentSurvivalQ = survivalQuizzes[survivalIndex];

  return (
    <div className={`relative z-10 w-full max-w-2xl mx-auto px-4 py-6 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sounds.playClick();
            setViewMode('MAIN');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Về Ngữ Pháp
        </button>

        {/* Hearts and Streak */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 border-3 border-black shadow-neo-sm">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-6 h-6 transition-all duration-300 ${
                  h <= hearts
                    ? 'text-red-500 fill-red-500 scale-100'
                    : 'text-gray-300 fill-gray-200 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="bg-neoYellow px-3 py-1.5 border-3 border-black font-black text-sm shadow-neo-sm">
            🏆 {score} đ
          </div>
        </div>
      </div>

      {survivalGameOver ? (
        /* GAME OVER MODAL */
        <div className="bg-white border-4 border-black p-8 text-center shadow-neo-lg flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-red-100 border-3 border-black flex items-center justify-center text-4xl shadow-neo-sm animate-bounce">
            💀
          </div>
          <h2 className="text-4xl font-black text-red-600 font-heading uppercase">
            GAME OVER {nickname}!
          </h2>
          <p className="font-bold text-gray-700 text-base max-w-md">
            Mập địch đã hết máu vì dính quá nhiều bẫy ngữ pháp TOEIC! Mau ôn lại các chuyên đề lý thuyết đi nhé!
          </p>
          <div className="px-6 py-3 bg-neoYellow border-3 border-black font-black text-xl shadow-neo-sm">
            Điểm số đạt được: {score} Điểm
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => { sounds.playClick(); handleStartSurvival(); }}
              className="flex items-center gap-2 px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Thử Thách Lại
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('MAIN'); }}
              className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
            >
              Về Danh Sách
            </button>
          </div>
        </div>
      ) : survivalGameWon ? (
        /* GAME WON MODAL */
        <div className="bg-white border-4 border-black p-8 text-center shadow-neo-lg flex flex-col items-center gap-6">
          <Trophy className="w-20 h-20 text-yellow-500 fill-yellow-400 animate-bounce" />
          <h2 className="text-4xl font-black text-emerald-600 font-heading uppercase">
            XUẤT SẮC QUÁ {nickname}!
          </h2>
          <p className="font-bold text-gray-700 text-base max-w-md">
            Bạn đã sống sót qua 10 câu ngữ pháp Part 5 hiểm hóc nhất! Bẫy ETS giờ chỉ là chuyện nhỏ!
          </p>
          <div className="px-6 py-3 bg-neoYellow border-3 border-black font-black text-xl shadow-neo-sm">
            🏆 Tổng điểm: {score} Điểm
          </div>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => { sounds.playClick(); handleStartSurvival(); }}
              className="px-6 py-3 bg-neoGreen border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-emerald-300 cursor-pointer"
            >
              Chơi Lại Trận Nữa
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('MAIN'); }}
              className="px-6 py-3 bg-white border-3 border-black font-black text-sm uppercase shadow-neo hover:bg-gray-100 cursor-pointer"
            >
              Về Danh Sách
            </button>
          </div>
        </div>
      ) : currentSurvivalQ ? (
        /* SURVIVAL ACTIVE QUESTION CARD */
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg relative">
          {/* Header timer and question counter */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase bg-neoPurple px-2.5 py-1 border-2 border-black shadow-neo-sm">
              Câu {survivalIndex + 1} / {survivalQuizzes.length} • {currentSurvivalQ.topicTitle}
            </span>

            {/* Timer Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 border-2 border-black font-black text-sm ${
              timeLeft <= 5 ? 'bg-red-400 text-white animate-pulse' : 'bg-neoYellow text-black'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question text */}
          <div className="bg-amber-50 border-3 border-black p-4 mb-6 shadow-neo-sm">
            <h3 className="text-lg md:text-xl font-black font-heading text-black leading-snug">
              {currentSurvivalQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentSurvivalQ.options.map((opt) => {
              const isSelected = survivalSelectedOption === opt.label;
              const isCorrect = opt.label === currentSurvivalQ.correctAnswer;

              let btnClass = 'bg-white hover:bg-amber-50 text-black border-3 border-black';
              if (survivalAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-400 text-black border-3 border-black shadow-neo-sm font-black';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-red-400 text-white border-3 border-black shadow-neo-sm font-black';
                } else {
                  btnClass = 'bg-gray-100 text-gray-400 border-2 border-gray-300';
                }
              }

              return (
                <button
                  key={opt.label}
                  disabled={survivalAnswered}
                  onClick={() => handleSelectSurvivalOption(opt.label)}
                  className={`w-full p-3.5 text-left font-bold text-sm md:text-base flex items-center justify-between transition-all cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {survivalAnswered && isCorrect && <Check className="w-5 h-5 text-black stroke-[3]" />}
                  {survivalAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Roast or Next Step */}
          {survivalAnswered && (
            <div className="mt-4 pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-gray-800">
                {roastMessage ? (
                  <span className="text-red-600 font-black">😈 {roastMessage}</span>
                ) : (
                  <span className="text-emerald-700 font-black">✨ Quá đỉnh! +{100 + timeLeft * 10} điểm!</span>
                )}
              </div>

              <button
                onClick={handleNextSurvivalQuestion}
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white font-black text-sm uppercase shadow-neo hover:bg-gray-800 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
