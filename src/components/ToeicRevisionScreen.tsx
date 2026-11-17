import React, { useState } from 'react';
import { 
  TOEIC_REVISION_ROADMAP, 
  RevisionUnit 
} from '../data/toeicRevisionData';
import { sounds } from '../utils/soundEffects';
import { 
  ArrowLeft, 
  BookOpen, 
  Mic, 
  PenTool, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Sparkles, 
  HelpCircle, 
  Award,
  ChevronRight,
  ExternalLink,
  Flame,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToeicRevisionScreenProps {
  onBack: () => void;
  nickname: string;
  onNavigateToPractice?: (mode: 'SPEAKING' | 'WRITING') => void;
}

export const ToeicRevisionScreen: React.FC<ToeicRevisionScreenProps> = ({
  onBack,
  nickname,
  onNavigateToPractice
}) => {
  const [activeSkill, setActiveSkill] = useState<'SPEAKING' | 'WRITING'>('SPEAKING');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('sp-unit-01');

  // Quiz state for the selected unit: map of quizIndex -> selectedOptionIndex
  const [quizAnswers, setQuizAnswers] = useState<{ [quizIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [quizIdx: number]: boolean }>({});

  const unitsInSkill = TOEIC_REVISION_ROADMAP.filter(u => u.skill === activeSkill);
  const currentUnit: RevisionUnit = unitsInSkill.find(u => u.id === selectedUnitId) || unitsInSkill[0] || TOEIC_REVISION_ROADMAP[0];

  const handleSelectUnit = (unitId: string) => {
    sounds.playClick();
    setSelectedUnitId(unitId);
    setQuizAnswers({});
    setQuizSubmitted({});
  };

  const handleSelectQuizOption = (quizIdx: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [quizIdx]: optionIdx }));
    setQuizSubmitted(prev => ({ ...prev, [quizIdx]: true }));

    const quiz = currentUnit.quickQuiz[quizIdx];
    if (quiz && optionIdx === quiz.correctIndex) {
      sounds.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      
      {/* Top Header Bar */}
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
              📚 Lộ Trình Ôn Tập TOEIC Speaking & Writing
              <span className="hidden sm:inline-block text-xs bg-black text-[#FFDE59] px-2.5 py-1 rounded-full font-bold">
                Level 0 - 100+ Ms Hoa
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold">
              Chào Nóc Nhà <span className="text-pink-600 font-black">{nickname}</span>! Cùng học trọn bộ lý thuyết, công thức vàng và mẹo thi thực chiến nhé!
            </p>
          </div>
        </div>

        {/* Source citation badge */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.anhngumshoa.com/tin-tuc/lo-trinh-hoc-tieng-anh-giao-tiep-cong-viec-toeic-speaking-writing-level-0-100-free-inter-34909.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-950 rounded-xl border-2 border-black text-xs font-black shadow-neo-sm transition-all"
          >
            <span>Nguồn: Anh Ngữ Ms Hoa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Skill Selector Tabs */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveSkill('SPEAKING');
            setSelectedUnitId('sp-unit-01');
            setQuizAnswers({});
            setQuizSubmitted({});
          }}
          className={`p-4 rounded-2xl border-4 border-black text-left transition-all cursor-pointer flex items-center justify-between ${
            activeSkill === 'SPEAKING'
              ? 'bg-[#5CE1E6] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
              : 'bg-white hover:bg-cyan-50 shadow-[3px_3px_0px_#000]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border-3 border-black flex items-center justify-center text-2xl shadow-neo-sm">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg uppercase">TOEIC Speaking Roadmap</h3>
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">
                  16 Unit
                </span>
              </div>
              <p className="text-xs text-gray-700 font-bold mt-0.5">
                Phát âm chuẩn IPA, ngữ điệu, công thức 4 bước miêu tả tranh Part 2 & phản xạ Part 3
              </p>
            </div>
          </div>
          <ChevronRight className={`w-6 h-6 transition-transform ${activeSkill === 'SPEAKING' ? 'translate-x-1' : ''}`} />
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveSkill('WRITING');
            setSelectedUnitId('wr-unit-01');
            setQuizAnswers({});
            setQuizSubmitted({});
          }}
          className={`p-4 rounded-2xl border-4 border-black text-left transition-all cursor-pointer flex items-center justify-between ${
            activeSkill === 'WRITING'
              ? 'bg-[#FF9800] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
              : 'bg-white hover:bg-orange-50 shadow-[3px_3px_0px_#000]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border-3 border-black flex items-center justify-center text-2xl shadow-neo-sm">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg uppercase">TOEIC Writing Roadmap</h3>
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">
                  8 Unit
                </span>
              </div>
              <p className="text-xs text-gray-700 font-bold mt-0.5">
                Ghép câu theo tranh Part 1, khung mẫu Email công sở Part 2 & dàn bài luận 300 từ Part 3
              </p>
            </div>
          </div>
          <ChevronRight className={`w-6 h-6 transition-transform ${activeSkill === 'WRITING' ? 'translate-x-1' : ''}`} />
        </button>
      </div>

      {/* Main Layout: Unit Sidebar (4 cols) + Lesson Content Reader (8 cols) */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* Left Column: Units Navigation List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <div className="bg-white p-4 rounded-2xl border-3 border-black shadow-neo">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-100">
              <span className="font-black text-xs uppercase tracking-wider text-gray-500">
                Danh Sách Bài Học ({unitsInSkill.length} Bài):
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-black">
                {activeSkill === 'SPEAKING' ? 'Speaking 0-100+' : 'Writing 0-100+'}
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {unitsInSkill.map(unit => {
                const isSelected = unit.id === selectedUnitId;
                return (
                  <button
                    key={unit.id}
                    onClick={() => handleSelectUnit(unit.id)}
                    className={`w-full p-3 rounded-xl border-2 border-black text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-[#FFDE59] text-black shadow-neo-sm translate-x-1 font-bold' 
                        : 'bg-gray-50 hover:bg-amber-50 text-gray-800'
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

          {/* Quick CTA to jump to Practice Test Zone */}
          <div className="bg-gradient-to-r from-emerald-100 to-cyan-100 p-4 rounded-2xl border-3 border-black shadow-neo text-center">
            <div className="font-black text-xs uppercase text-emerald-950 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Đã Học Xong Lý Thuyết?
            </div>
            <p className="text-xs text-gray-700 font-medium mb-3">
              Chuyển ngay sang phòng thi đề thật Study4 để máy tính và AI chấm điểm bài nói / bài viết của bạn!
            </p>
            <button
              onClick={() => onNavigateToPractice && onNavigateToPractice(activeSkill)}
              className="w-full py-2.5 px-4 bg-black text-[#5CE1E6] rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-800 cursor-pointer shadow-neo-sm flex items-center justify-center gap-2"
            >
              <span>Vào Làm Đề Thi Study4</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Unit Header Card */}
          <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-black text-yellow-300 border border-black">
                {currentUnit.badge}
              </span>
              <span className="text-xs font-black text-gray-500">
                {activeSkill === 'SPEAKING' ? 'Lộ Trình Speaking Ms Hoa' : 'Lộ Trình Writing Ms Hoa'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight font-heading">
              {currentUnit.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              {currentUnit.subtitle}
            </p>

            <div className="bg-amber-50 p-4 rounded-xl border-2 border-black/20 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
              💡 <span className="font-bold">Mục tiêu bài học:</span> {currentUnit.overviewVi}
            </div>
          </div>

          {/* Unit Content Sections */}
          <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo flex flex-col gap-6">
            {currentUnit.contentSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-base sm:text-lg font-black uppercase border-b-2 border-black pb-1.5 text-indigo-950 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  {sec.heading}
                </h3>
                <div className="whitespace-pre-line text-xs sm:text-sm text-gray-800 leading-relaxed font-sans font-normal space-y-2">
                  {sec.bodyMarkdown}
                </div>

                {sec.highlightBox && (
                  <div className={`p-4 rounded-xl border-2 border-black text-xs ${
                    sec.highlightBox.type === 'tip' 
                      ? 'bg-emerald-50 border-emerald-800 text-emerald-950' 
                      : sec.highlightBox.type === 'warning' 
                      ? 'bg-rose-50 border-rose-800 text-rose-950' 
                      : 'bg-purple-50 border-purple-800 text-purple-950'
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

            {/* Key Formulas Section if available */}
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

          {/* Quick Quiz Interactive Check */}
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
                        let btnStyle = 'bg-gray-50 hover:bg-amber-50 border-gray-300 text-gray-800';
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

    </div>
  );
};
