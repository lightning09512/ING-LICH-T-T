import React, { useState, useMemo } from 'react';
import { sounds } from '../utils/soundEffects';
import { 
  TOEIC_SW_TEST_COMBOS, 
  ToeicSwTestCombo 
} from '../data/toeicSpeakingData';
import { 
  ArrowLeft, 
  Target, 
  Mic, 
  PenTool, 
  Clock, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Flame,
  ChevronRight
} from 'lucide-react';

interface ToeicSwSelectScreenProps {
  onSelectSpeakingTest: (testId: string) => void;
  onSelectWritingTest: (testId: string) => void;
  onBack: () => void;
  nickname: string;
}

export const ToeicSwSelectScreen: React.FC<ToeicSwSelectScreenProps> = ({
  onSelectSpeakingTest,
  onSelectWritingTest,
  onBack,
  nickname
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Tiêu Chuẩn ETS' | 'Nâng Cao'>('ALL');

  const filteredTests = useMemo(() => {
    return TOEIC_SW_TEST_COMBOS.filter(test => {
      const matchSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDiff = difficultyFilter === 'ALL' || test.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    });
  }, [searchTerm, difficultyFilter]);

  return (
    <div className="relative z-10 flex flex-col items-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-5xl mx-auto w-full">
      
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
          <span className="text-xl sm:text-2xl">📋</span>
          <div className="text-left hidden sm:block">
            <h1 className="font-heading font-black text-sm sm:text-lg uppercase leading-tight">
              Bảng Luyện Đề Thi TOEIC Speaking & Writing
            </h1>
            <p className="text-[11px] font-bold text-gray-500">
              Trọn bộ đề thi Study4 bản quyền • Format chuẩn ETS quốc tế • AI chấm điểm trực tiếp
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs font-black bg-[#FFDE59] text-black border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-sm">
          5 Bộ Đề Đầy Đủ
        </span>
      </div>

      {/* Header Banner */}
      <div className="w-full bg-[#E0F7FA] border-3 sm:border-4 border-black p-4 sm:p-6 shadow-neo rounded-2xl mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-black text-[#5CE1E6] rounded-full text-xs font-black uppercase font-mono">
              <Sparkles className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              ETS Practice Tests • Study4
            </div>
            <h2 className="text-xl sm:text-3xl font-black uppercase font-heading text-gray-900 leading-tight">
              Phòng Luyện Thi Thực Chiến 4 Kỹ Năng
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-700 max-w-2xl leading-relaxed">
              Chào {nickname}! Chọn một bộ đề bên dưới để bắt đầu làm bài thi thật. Bạn có thể luyện riêng kỹ năng Nói (Speaking 11 câu • 20 phút) hoặc kỹ năng Viết (Writing 8 câu • 60 phút). Hệ thống AI sẽ chấm điểm và nhận xét chi tiết sau khi nộp bài!
            </p>
          </div>

          <div className="flex sm:flex-col items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-white rounded-xl border-2 border-black font-black text-xs shadow-neo-sm flex items-center gap-1.5">
              <span>🎙️ Speaking:</span>
              <span className="text-cyan-800">11 Câu / Đề</span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-xl border-2 border-black font-black text-xs shadow-neo-sm flex items-center gap-1.5">
              <span>✍️ Writing:</span>
              <span className="text-amber-800">8 Câu / Đề</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t-2 border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi (VD: Test 01, hợp đồng, hội thảo...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border-2 border-black text-xs sm:text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setDifficultyFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                difficultyFilter === 'ALL'
                  ? 'bg-black text-[#5CE1E6] shadow-neo-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
            >
              Tất Cả ({TOEIC_SW_TEST_COMBOS.length})
            </button>
            <button
              onClick={() => setDifficultyFilter('Tiêu Chuẩn ETS')}
              className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                difficultyFilter === 'Tiêu Chuẩn ETS'
                  ? 'bg-black text-[#5CE1E6] shadow-neo-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
            >
              Tiêu Chuẩn ETS
            </button>
            <button
              onClick={() => setDifficultyFilter('Nâng Cao')}
              className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                difficultyFilter === 'Nâng Cao'
                  ? 'bg-black text-[#5CE1E6] shadow-neo-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-800'
              }`}
            >
              Nâng Cao (180+)
            </button>
          </div>
        </div>
      </div>

      {/* Test List Cards */}
      <div className="w-full flex flex-col gap-4">
        {filteredTests.map((test, idx) => (
          <div
            key={test.id}
            className="w-full bg-white border-3 sm:border-4 border-black p-4 sm:p-5 shadow-neo hover:shadow-neo-lg rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left: Info */}
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-black text-[#5CE1E6] font-mono border border-black shadow-neo-sm">
                  {test.code}
                </span>
                <h3 className="font-heading font-black text-base sm:text-xl text-black">
                  {test.name}
                </h3>
                <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border border-black ${
                  test.difficulty === 'Nâng Cao' ? 'bg-rose-200 text-rose-950' : 'bg-emerald-200 text-emerald-950'
                }`}>
                  {test.badge} • {test.difficulty}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                {test.description}
              </p>

              {/* Part Coverage Highlights */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 text-cyan-950">
                  <Mic className="w-3 h-3 text-cyan-700" />
                  Speaking: Part 1 - 5 (11 câu)
                </span>
                <span className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-950">
                  <PenTool className="w-3 h-3 text-amber-700" />
                  Writing: Part 1 - 3 (8 câu)
                </span>
                <span className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-purple-950">
                  <Sparkles className="w-3 h-3 text-purple-700" />
                  AI Grader
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectSpeakingTest(test.speakingTestId);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E0F7FA] hover:bg-[#b2ebf2] border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wide shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Mic className="w-4 h-4 text-cyan-900" />
                <span>Luyện Đề Nói</span>
                <span className="text-[10px] text-cyan-950 font-bold opacity-80">(11 Câu)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectWritingTest(test.writingTestId);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF3E0] hover:bg-[#ffe0b2] border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wide shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <PenTool className="w-4 h-4 text-amber-900" />
                <span>Luyện Đề Viết</span>
                <span className="text-[10px] text-amber-950 font-bold opacity-80">(8 Câu)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
