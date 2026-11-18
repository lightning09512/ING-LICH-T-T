import React, { useState, useMemo } from 'react';
import { sounds } from '../utils/soundEffects';
import {
  TOEIC_SPEAKING_TESTS,
  TOEIC_SPEAKING_PARTS,
} from '../data/toeicSpeakingData';
import {
  TOEIC_WRITING_TESTS,
  TOEIC_WRITING_PARTS,
} from '../data/toeicWritingData';
import { getSwExamHistory } from '../utils/aiGrader';
import {
  ArrowLeft,
  Mic,
  PenTool,
  Clock,
  CheckCircle2,
  Search,
  Layers,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DoodleMic,
  DoodlePencil,
  DoodleStar,
  DoodleTarget,
  WashiTapeBadge,
} from './DoodleIcons';

export interface SwLaunchOptions {
  testId: string;
  mode: 'FULL' | 'PRACTICE';
  partFilter?: number | null;
}

interface ToeicSwSelectScreenProps {
  onSelectSpeakingTest: (options: SwLaunchOptions) => void;
  onSelectWritingTest: (options: SwLaunchOptions) => void;
  onBack: () => void;
  nickname: string;
}

type SkillTab = 'ALL' | 'SPEAKING' | 'WRITING';

export const ToeicSwSelectScreen: React.FC<ToeicSwSelectScreenProps> = ({
  onSelectSpeakingTest,
  onSelectWritingTest,
  onBack,
  nickname,
}) => {
  const [skillTab, setSkillTab] = useState<SkillTab>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [openPracticeCardId, setOpenPracticeCardId] = useState<string | null>(null);
  const [selectedPartsMap, setSelectedPartsMap] = useState<Record<string, number | null>>({});

  const examHistory = useMemo(() => getSwExamHistory(), []);

  const unifiedCards = useMemo(() => {
    const spCards = TOEIC_SPEAKING_TESTS.map((t, idx) => ({
      skill: 'SPEAKING' as const,
      order: idx + 1,
      id: t.id,
      study4Id: t.study4Id,
      code: t.code,
      name: t.name,
      durationMinutes: t.durationMinutes,
      partsCount: t.partsCount,
      questionsCount: t.questionsCount,
      desc: t.desc,
      badge: t.badge,
      partsList: TOEIC_SPEAKING_PARTS,
    }));

    const wrCards = TOEIC_WRITING_TESTS.map((t, idx) => ({
      skill: 'WRITING' as const,
      order: idx + 1,
      id: t.id,
      study4Id: t.study4Id,
      code: t.code,
      name: t.name,
      durationMinutes: t.durationMinutes,
      partsCount: t.partsCount,
      questionsCount: t.questionsCount,
      desc: t.desc,
      badge: t.badge,
      partsList: TOEIC_WRITING_PARTS,
    }));

    // Interleave Test 1 SP, Test 1 WR, Test 2 SP, Test 2 WR... just like study4.com/tests/toeic-sw/
    const interleaved: Array<(typeof spCards)[number] | (typeof wrCards)[number]> = [];
    const maxLen = Math.max(spCards.length, wrCards.length);
    for (let i = 0; i < maxLen; i++) {
      if (spCards[i]) interleaved.push(spCards[i]);
      if (wrCards[i]) interleaved.push(wrCards[i]);
    }

    return interleaved.filter((item) => {
      if (skillTab !== 'ALL' && item.skill !== skillTab) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        String(item.study4Id).includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
    });
  }, [skillTab, searchTerm]);

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl mx-auto w-full">
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

        <div className="flex items-center gap-2.5">
          <DoodleTarget size={26} />
          <div className="text-left hidden sm:block">
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              Thư Viện Đề Thi TOEIC Speaking & Writing
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              20 đề gốc chuẩn ETS • Đầy đủ audio, tranh đề thi & chấm điểm chi tiết
            </p>
          </div>
        </div>

        <WashiTapeBadge tone="yellow" className="rounded-lg">
          20 Đề Gốc
        </WashiTapeBadge>
      </div>

      {/* Hero & Filter Controls */}
      <div className="w-full bg-[#F5F3FF] border-3 sm:border-4 border-black p-4 sm:p-6 shadow-neo rounded-2xl mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <WashiTapeBadge tone="yellow" className="rounded-full">
              <DoodleStar size={14} />
              <span>Bộ Đề Thực Chiến • Study4</span>
            </WashiTapeBadge>
            <h2 className="text-xl sm:text-3xl font-black uppercase font-heading text-gray-900 leading-tight">
              Kho 20 Bộ Đề TOEIC S&W Chuẩn Quốc Tế
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-700 max-w-2xl leading-relaxed">
              Chào {nickname}! Gồm trọn bộ <strong>10 đề TOEIC SW Speaking (#5895–#5904)</strong> và{' '}
              <strong>10 đề TOEIC SW Writing (#5909–#5918)</strong> với đầy đủ MP3 câu hỏi gốc, tranh gốc, lịch trình & từ khóa thật.
            </p>
          </div>

          <div className="flex sm:flex-col items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-[#ECFEFF] rounded-xl border-2 border-black font-black text-xs shadow-neo-sm flex items-center gap-1.5">
              <DoodleMic size={16} />
              <span>Speaking:</span>
              <span className="text-cyan-950">10 Đề (110 Câu)</span>
            </div>
            <div className="px-3 py-1.5 bg-[#FFF7ED] rounded-xl border-2 border-black font-black text-xs shadow-neo-sm flex items-center gap-1.5">
              <DoodlePencil size={16} />
              <span>Writing:</span>
              <span className="text-amber-950">10 Đề (80 Câu)</span>
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="mt-5 pt-4 border-t-2 border-black/15 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setSkillTab('ALL');
              }}
              className={`px-3.5 py-2 rounded-xl border-2 border-black text-xs font-black uppercase transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                skillTab === 'ALL'
                  ? 'bg-black text-[#FFDE59] shadow-neo-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
            >
              <DoodleStar size={14} />
              <span>Tất Cả Bộ Đề (20)</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setSkillTab('SPEAKING');
              }}
              className={`px-3.5 py-2 rounded-xl border-2 border-black text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                skillTab === 'SPEAKING'
                  ? 'bg-[#00BCD4] text-black shadow-neo-sm'
                  : 'bg-white hover:bg-cyan-50 text-gray-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              Đề Thi Speaking (10 đề • 20p • 11 câu)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setSkillTab('WRITING');
              }}
              className={`px-3.5 py-2 rounded-xl border-2 border-black text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                skillTab === 'WRITING'
                  ? 'bg-[#FF9800] text-black shadow-neo-sm'
                  : 'bg-white hover:bg-amber-50 text-gray-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Đề Thi Writing (10 đề • 60p • 8 câu)
            </button>
          </div>

          <div className="relative flex-1 lg:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm tên đề, mã #5895, chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black text-xs sm:text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Grid of Authentic Study4 Test Cards (mirrors Study4 grid layout) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {unifiedCards.map((card) => {
          const isSpeaking = card.skill === 'SPEAKING';
          const history = examHistory[card.id];
          const isPracticeOpen = openPracticeCardId === card.id;
          const chosenPart = selectedPartsMap[card.id] ?? null;

          const handleLaunch = (mode: 'FULL' | 'PRACTICE', partFilter?: number | null) => {
            sounds.playClick();
            if (isSpeaking) {
              onSelectSpeakingTest({ testId: card.id, mode, partFilter });
            } else {
              onSelectWritingTest({ testId: card.id, mode, partFilter });
            }
          };

          return (
            <div
              key={card.id}
              className="bg-white border-3 border-black p-4 sm:p-5 rounded-2xl shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between gap-4"
            >
              {/* Top Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black font-mono ${
                        isSpeaking ? 'bg-[#E0F7FA] text-cyan-950' : 'bg-[#FFF3E0] text-amber-950'
                      }`}
                    >
                      {card.code}
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-black text-white font-mono">
                      {card.badge}
                    </span>
                  </div>

                  {history ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Đã làm • Band {history.estimatedBand}/200
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                      Chưa làm
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-lg sm:text-xl text-black leading-snug">
                  {card.name}
                </h3>

                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-700" />
                    {card.durationMinutes} phút
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-gray-700" />
                    {card.partsCount} phần thi
                  </span>
                  <span>•</span>
                  <span>{card.questionsCount} câu hỏi</span>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                  {card.desc}
                </p>
              </div>

              {/* Expandable Practice-by-Part Drawer */}
              {isPracticeOpen && (
                <div className="p-3 rounded-xl border-2 border-black bg-gray-50 space-y-2.5 animate-fadeIn">
                  <div className="text-[11px] font-black uppercase text-gray-700">
                    Chọn phần muốn luyện tập (Không giới hạn áp lực giờ):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedPartsMap((prev) => ({ ...prev, [card.id]: null }))}
                      className={`px-2.5 py-1 rounded-lg border border-black text-[11px] font-black cursor-pointer ${
                        chosenPart === null ? 'bg-black text-[#FFDE59]' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Tất cả các Part
                    </button>
                    {card.partsList.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPartsMap((prev) => ({ ...prev, [card.id]: p.id }))}
                        className={`px-2.5 py-1 rounded-lg border border-black text-[11px] font-black cursor-pointer ${
                          chosenPart === p.id ? 'bg-black text-[#FFDE59]' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {p.icon} Part {p.id}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleLaunch('PRACTICE', chosenPart)}
                    className="w-full py-2 rounded-lg border-2 border-black bg-[#FFDE59] hover:bg-yellow-400 font-black text-xs uppercase shadow-neo-sm cursor-pointer"
                  >
                    Bắt Đầu Luyện Tập {chosenPart ? `(Chỉ Part ${chosenPart})` : '(Tự Do)'} ➔
                  </button>
                </div>
              )}

              {/* Bottom Dual Launch Buttons matching Study4 */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t-2 border-gray-100">
                <button
                  onClick={() => handleLaunch('FULL', null)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#5CE1E6] hover:bg-[#48cbd0] text-black'
                      : 'bg-[#FF9800] hover:bg-[#fb8c00] text-black'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Làm Full Test</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setOpenPracticeCardId(isPracticeOpen ? null : card.id);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-black bg-white hover:bg-gray-100 font-black text-xs uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer text-gray-900"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Luyện Từng Part</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
