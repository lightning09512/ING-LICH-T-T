import React, { useState } from 'react';
import { 
  TOEIC_REVISION_ROADMAP, 
  RevisionUnit 
} from '../data/toeicRevisionData';
import { sounds } from '../utils/soundEffects';
import { FormattedContent } from './FormattedContent';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award, 
  RefreshCw, 
  Sparkles,
  HelpCircle,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicSpeakingRevisionScreenProps {
  onBack: () => void;
  nickname: string;
}

export const ToeicSpeakingRevisionScreen: React.FC<ToeicSpeakingRevisionScreenProps> = ({ 
  onBack, 
  nickname 
}) => {
  const speakingUnits = TOEIC_REVISION_ROADMAP.filter(u => u.skill === 'SPEAKING');
  const [selectedPartFilter, setSelectedPartFilter] = useState<number | 'ALL'>('ALL');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(speakingUnits[0]?.id || 'sp-unit-01');
  const [quizAnswers, setQuizAnswers] = useState<{ [quizIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [quizIdx: number]: boolean }>({});
  const [isSpeakingExample, setIsSpeakingExample] = useState(false);

  const filteredUnits = selectedPartFilter === 'ALL'
    ? speakingUnits
    : speakingUnits.filter(u => u.partNumber === selectedPartFilter);

  const currentUnit: RevisionUnit = speakingUnits.find(u => u.id === selectedUnitId) || speakingUnits[0];

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    setIsSpeakingExample(true);
    utterance.onend = () => setIsSpeakingExample(false);
    utterance.onerror = () => setIsSpeakingExample(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectQuizOption = (quizIdx: number, optionIdx: number) => {
    if (quizSubmitted[quizIdx]) return;
    sounds.playClick();
    setQuizAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }));
  };

  const handleSubmitQuiz = (quizIdx: number) => {
    const chosen = quizAnswers[quizIdx];
    if (chosen === undefined) return;
    const correct = currentUnit.quickQuiz[quizIdx].correctIndex;
    setQuizSubmitted(prev => ({ ...prev, [quizIdx]: true }));

    if (chosen === correct) {
      sounds.playCorrect();
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto w-full">
      
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border-3 border-black shadow-neo">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Menu
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎙️</span>
          <div className="text-left hidden sm:block">
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              Ôn Tập TOEIC Speaking
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              Cẩm nang 16 bài học 5 Part • Mẹo phát âm, trọng âm, ngữ điệu & phản xạ chuẩn ETS
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs font-black bg-[#E0F7FA] text-cyan-900 border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-sm">
          Level 0 - 100+
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 16 Units Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                Lộ Trình 16 Bài Học:
              </span>
              <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full border border-black">
                {filteredUnits.length} bài
              </span>
            </div>

            {/* Part Filter Buttons */}
            <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b-2 border-gray-100">
              <button
                onClick={() => setSelectedPartFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                  selectedPartFilter === 'ALL'
                    ? 'bg-black text-[#5CE1E6] shadow-neo-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tất cả ({speakingUnits.length})
              </button>
              {[1, 2, 3, 4, 5].map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => setSelectedPartFilter(pNum)}
                  className={`px-2 py-1 rounded text-[11px] font-black border border-black cursor-pointer transition-all ${
                    selectedPartFilter === pNum
                      ? 'bg-black text-[#5CE1E6] shadow-neo-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Part {pNum}
                </button>
              ))}
            </div>

            {/* Units Scroll List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredUnits.map((unit) => {
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
                        : 'bg-gray-50 hover:bg-cyan-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black text-[#5CE1E6] border border-black font-mono">
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
            <div className="bg-[#FFFDE7] p-3 rounded-xl border-2 border-black flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-black text-[#5CE1E6] font-black text-xs uppercase rounded-lg border border-black shadow-neo-sm font-mono">
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
                Unit {currentUnit.unitNumber} / 16
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight font-heading mt-1">
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

                {/* Formatted Content */}
                <FormattedContent content={sec.bodyMarkdown} />

                {sec.highlightBox && (
                  <div className={`p-4 rounded-xl border-2 border-black text-xs mt-2 ${
                    sec.highlightBox.type === 'tip'
                      ? 'bg-amber-50 text-amber-950'
                      : sec.highlightBox.type === 'warning'
                      ? 'bg-rose-50 text-rose-950'
                      : 'bg-emerald-50 text-emerald-950'
                  }`}>
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

            {/* Key Formulas / Pronunciation Rules */}
            {currentUnit.keyFormulas && currentUnit.keyFormulas.length > 0 && (
              <div className="mt-2 pt-4 border-t-2 border-gray-200">
                <h3 className="text-sm font-black uppercase text-purple-950 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Công Thức Vàng Cần Thuộc Lòng
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentUnit.keyFormulas.map((f, fIdx) => (
                    <div key={fIdx} className="p-3 bg-purple-50 rounded-xl border-2 border-purple-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-purple-900">{f.name}</span>
                        <code className="bg-white px-2 py-0.5 rounded border border-purple-300 font-mono font-bold text-[11px] text-purple-800">
                          {f.structure}
                        </code>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-gray-700 italic">
                        <span>Ví dụ: "{f.exampleEn}"</span>
                        <button
                          onClick={() => handleSpeakText(f.exampleEn)}
                          className="p-1 rounded bg-white hover:bg-purple-100 border border-purple-300 cursor-pointer shrink-0"
                          title="Phát âm mẫu"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">➔ {f.exampleVi}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Practice Quiz */}
            {currentUnit.quickQuiz && currentUnit.quickQuiz.length > 0 && (
              <div className="mt-4 pt-4 border-t-3 border-black">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎯</span>
                  <h3 className="font-black text-sm uppercase tracking-wide text-black font-heading">
                    Mini Quiz: Kiểm Tra Kiến Thức Sau Bài Học
                  </h3>
                </div>

                <div className="space-y-4">
                  {currentUnit.quickQuiz.map((quiz, qIdx) => {
                    const isSubmitted = quizSubmitted[qIdx];
                    const chosen = quizAnswers[qIdx];
                    const isCorrect = chosen === quiz.correctIndex;

                    return (
                      <div key={qIdx} className="p-4 rounded-xl border-2 border-black bg-gray-50 space-y-3">
                        <div className="font-bold text-xs sm:text-sm text-gray-900">
                          <span className="font-black text-cyan-800">Câu {qIdx + 1}: </span>
                          {quiz.questionText}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {quiz.options.map((opt, oIdx) => {
                            const isChosen = chosen === oIdx;
                            const isRightOption = oIdx === quiz.correctIndex;

                            let optStyle = 'bg-white hover:bg-cyan-50 border-gray-300';
                            if (isSubmitted) {
                              if (isRightOption) {
                                optStyle = 'bg-emerald-100 border-emerald-600 font-bold text-emerald-950';
                              } else if (isChosen && !isRightOption) {
                                optStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                              } else {
                                optStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
                              }
                            } else if (isChosen) {
                              optStyle = 'bg-cyan-200 border-cyan-800 font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                                disabled={isSubmitted}
                                className={`p-2.5 rounded-lg border-2 text-left text-xs transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                              >
                                <span>{opt}</span>
                                {isSubmitted && isRightOption && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                                {isSubmitted && isChosen && !isRightOption && <XCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {!isSubmitted ? (
                          <button
                            onClick={() => handleSubmitQuiz(qIdx)}
                            disabled={chosen === undefined}
                            className={`px-4 py-2 rounded-lg border-2 border-black font-black text-xs uppercase shadow-neo-sm transition-all cursor-pointer ${
                              chosen !== undefined 
                                ? 'bg-[#5CE1E6] hover:bg-[#48cbd0] text-black hover:translate-x-0.5 hover:translate-y-0.5' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Kiểm Tra Đáp Án
                          </button>
                        ) : (
                          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                            isCorrect 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                              : 'bg-rose-50 border-rose-300 text-rose-950'
                          }`}>
                            <div className="font-black mb-1">
                              {isCorrect ? '🎉 Tuyệt vời! Bạn trả lời chính xác.' : '❌ Chưa chính xác!'}
                            </div>
                            <p>{quiz.explanationVi}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
