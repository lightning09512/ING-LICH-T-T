import React from 'react';
import { sounds } from '../utils/soundEffects';
import { BookOpen, GraduationCap, Target, Cloud, LogIn, ArrowLeft, Trophy, Flame, Mic, PenTool, Sparkles, ClipboardList } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';
import { useLearningProgress } from '../contexts/ProgressContext';
import { RANK_TIERS_CONFIG } from '../types/ranked';
import { TOEIC_SW_TEST_COMBOS } from '../data/toeicSpeakingData';

interface MenuScreenProps {
  onSelectMode: (mode: 'LEARN' | 'GRAMMAR' | 'EXAM' | 'RANKED' | 'SPEAKING' | 'WRITING', chapter?: 1 | 2, testId?: string) => void;
  onBack: () => void;
  nickname: string;
  user?: User | null;
  syncStatus?: SyncStatus;
  onOpenAccount?: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onSelectMode,
  onBack,
  nickname,
  user,
  syncStatus,
  onOpenAccount
}) => {
  const { rankTier, rankLp, rankPromo } = useLearningProgress();
  const currentTierConfig = RANK_TIERS_CONFIG[rankTier] || RANK_TIERS_CONFIG.BRONZE;
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="w-full max-w-xl md:max-w-3xl flex flex-col items-center gap-3.5 sm:gap-5 md:gap-6">
        
        {/* User Account Status Banner */}
        {user ? (
          <div 
            onClick={onOpenAccount}
            className="w-full bg-white border-3 border-black p-2.5 sm:p-3.5 shadow-neo flex items-center justify-between gap-2.5 cursor-pointer hover:bg-cyan-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black shrink-0" />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neoCyan border-2 border-black flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-heading font-black text-sm sm:text-lg text-black truncate max-w-[150px] sm:max-w-[220px]">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-[9px] sm:text-[10px] bg-neoGreen text-black border border-black font-black px-1.5 py-0.5 rounded shadow-neo-sm">
                    ✅ Đã đăng nhập
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs text-gray-600 font-bold flex items-center gap-1 truncate">
                  <Cloud className="w-3.5 h-3.5 text-cyan-600 inline shrink-0" />
                  {syncStatus === 'saved' ? 'Tiến trình tự động lưu vào Google' : 'Đang kết nối đồng bộ đám mây'}
                </span>
              </div>
            </div>
            <span className="text-xs font-black underline shrink-0">Chi tiết</span>
          </div>
        ) : (
          <button
            onClick={onOpenAccount}
            className="w-full bg-neoYellow border-3 border-black p-2.5 sm:p-3 shadow-neo-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 font-black text-xs sm:text-sm cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-black shrink-0" />
            <span>Đăng nhập tài khoản Google để lưu tiến trình của bạn</span>
          </button>
        )}

        {/* Header badge */}
        <div className="text-center">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-neoPurple border-2 sm:border-3 border-black font-black text-xs sm:text-sm uppercase shadow-neo-sm rotate-[-2deg]">
            🎮 Chọn Chế Độ Chơi
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 font-heading leading-tight">
            Hôm nay {nickname} muốn làm gì nào?
          </h2>
        </div>

        {/* 3 Buttons matching sketch 2 */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">
          {/* Button 1: Học bài (Gồm Chương 1 và Chương 2) */}
          <div className="w-full bg-white border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg flex flex-col gap-3 group">
            <div 
              onClick={() => {
                sounds.playClick();
                onSelectMode('LEARN', 1);
              }}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neoGreen border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-6 transition-transform shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading leading-tight">
                      Học bài
                    </h3>
                    <span className="bg-neoYellow text-black text-[10px] sm:text-xs font-black px-2 py-0.5 border border-black shadow-neo-sm">
                      2 Chương
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                    Từ vựng TOEIC trọng điểm + Flashcard + Phát âm chuẩn Mỹ
                  </p>
                </div>
              </div>
              <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                👉
              </span>
            </div>

            {/* Quick Chapter Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t-2 border-black/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onSelectMode('LEARN', 1);
                }}
                className="flex items-center justify-between px-3 py-2 bg-yellow-50 hover:bg-yellow-100 border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer text-left"
              >
                <span>📘 <strong>Chương 1:</strong> 26 Ngày Cơ Bản</span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 border border-black">26 Màn</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onSelectMode('LEARN', 2);
                }}
                className="flex items-center justify-between px-3 py-2 bg-cyan-50 hover:bg-cyan-100 border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer text-left relative overflow-hidden"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="bg-neoPink text-white text-[8px] font-black px-1 border border-black animate-pulse shrink-0">MỚI</span>
                  <span className="truncate">🚀 <strong>Chương 2:</strong> ETS 2019 & New Economy</span>
                </div>
                <span className="text-[10px] bg-white px-1.5 py-0.5 border border-black shrink-0">13 Bộ</span>
              </button>
            </div>
          </div>

          {/* Button 2: Ngữ pháp */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('GRAMMAR');
            }}
            className="w-full bg-white hover:bg-amber-50 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group min-h-[76px] sm:min-h-[96px] cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-red-600 text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 border border-black uppercase rotate-3 sm:rotate-6 shadow-neo-sm z-10">
              🔥 Trọng Điểm Part 5
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neoYellow border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:-rotate-6 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div className="min-w-0 pr-12 sm:pr-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading leading-tight">
                  Ngữ pháp
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                  10 chủ điểm then chốt Part 5 & 6 + Công thức, Mẹo diệt bẫy ETS & Mini Quiz!
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              📝
            </span>
          </button>

          {/* Button 3: Đấu Xếp Hạng (Ranked Mode) */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('RANKED');
            }}
            className="w-full bg-[#FEF9C3] hover:bg-yellow-100 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 border border-black uppercase rotate-3 sm:rotate-6 shadow-neo-sm z-10 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white" />
              <span>{rankPromo?.active ? 'Bo3 Thăng Hạng!' : `${currentTierConfig.nameVi} • ${rankLp} LP`}</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform shrink-0 text-2xl sm:text-3xl">
                <span>{currentTierConfig.badge}</span>
              </div>
              <div className="min-w-0 pr-12 sm:pr-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight flex items-center gap-2">
                  <span>Đấu Xếp Hạng</span>
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  Leo rank Đồng ➔ Thách Đấu, tính điểm LP + Thăng hạng Bo3, phân tầng độ khó chuẩn ETS!
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              🏆
            </span>
          </button>

          {/* Button 4: Luyện đề (Study4 style) */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('EXAM');
            }}
            className="w-full bg-white hover:bg-rose-50 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-neoPink text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 border border-black uppercase rotate-3 sm:rotate-6 shadow-neo-sm z-10">
              Chuẩn Study4
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neoPink border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform shrink-0">
                <Target className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="min-w-0 pr-12 sm:pr-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  Luyện đề
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                  Đầy đủ Part 1 - 7 Nghe & Đọc, audio player, bảng câu hỏi, tính điểm 990
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              🎯
            </span>
          </button>

          {/* SECTION HEADER: TOEIC 4 KỸ NĂNG (SPEAKING & WRITING) */}
          <div className="w-full flex items-center gap-2 pt-2 pb-1">
            <div className="h-[2px] bg-black/20 flex-1" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black bg-[#FFDE59] px-3 py-1 rounded-full border-2 border-black shadow-neo-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Ôn Luyện 2 Kỹ Năng Mới • Tích Hợp AI Chấm Điểm
            </span>
            <div className="h-[2px] bg-black/20 flex-1" />
          </div>

          {/* Button 5: TOEIC Speaking (Luyện Nói & Chấm Điểm AI) */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('SPEAKING');
            }}
            className="w-full bg-[#E0F7FA] hover:bg-[#b2ebf2] border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#00838F] text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 border border-black uppercase rotate-3 sm:rotate-6 shadow-neo-sm z-10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span>AI Voice • Band 200</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#00BCD4] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:-rotate-6 transition-transform shrink-0">
                <Mic className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div className="min-w-0 pr-16 sm:pr-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight flex items-center gap-2">
                  <span>TOEIC Speaking</span>
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  Luyện nói 5 Part chuẩn ETS: Thu âm giọng nói, nhận diện từ, chấm điểm phát âm & ngữ điệu qua AI!
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              🎙️
            </span>
          </button>

          {/* Button 6: TOEIC Writing (Luyện Viết & Sửa Văn AI) */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('WRITING');
            }}
            className="w-full bg-[#FFF3E0] hover:bg-[#ffe0b2] border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#E65100] text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 border border-black uppercase -rotate-2 sm:-rotate-3 shadow-neo-sm z-10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span>AI Sửa Câu & Nhận Xét</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FF9800] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-6 transition-transform shrink-0">
                <PenTool className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div className="min-w-0 pr-16 sm:pr-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight flex items-center gap-2">
                  <span>TOEIC Writing</span>
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  Viết câu theo tranh, phản hồi Email & Viết luận 300 từ + AI chỉ lỗi sai ngữ pháp, nâng cấp từ vựng C1!
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              ✍️
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* BẢNG LUYỆN ĐỀ THI TOEIC SPEAKING & WRITING (STUDY4)      */}
        {/* ======================================================== */}
        <div className="w-full bg-white border-3 sm:border-4 border-black p-4 sm:p-5 shadow-neo sm:shadow-neo-lg rounded-2xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-3 border-black">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📋</span>
                <h3 className="font-heading font-black text-base sm:text-xl uppercase tracking-wide">
                  Bảng Luyện Đề Thi TOEIC Speaking & Writing
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 mt-0.5">
                Trọn bộ 5 đề thi Study4 chuẩn format ETS quốc tế • Luyện Nói (11 câu) & Luyện Viết (8 câu) kèm AI chấm điểm
              </p>
            </div>
            <span className="self-start sm:self-auto text-[10px] sm:text-xs font-black bg-[#FFDE59] border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-sm">
              5 Bộ Đề Đầy Đủ
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {TOEIC_SW_TEST_COMBOS.map((combo) => (
              <div 
                key={combo.id}
                className="bg-[#FAFAFA] hover:bg-[#F0FDF4] p-3.5 sm:p-4 rounded-xl border-2 sm:border-3 border-black shadow-neo-sm hover:shadow-neo transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-xs px-2 py-0.5 rounded-md bg-black text-[#5CE1E6] font-mono">
                      {combo.code}
                    </span>
                    <h4 className="font-black text-sm sm:text-base text-gray-900">
                      {combo.name}
                    </h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-black ${
                      combo.difficulty === 'Nâng Cao' ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {combo.badge} • {combo.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-bold line-clamp-2">
                    {combo.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectMode('SPEAKING', undefined, combo.speakingTestId);
                    }}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#E0F7FA] hover:bg-[#b2ebf2] border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    title="Luyện Nói 11 câu hỏi chuẩn ETS"
                  >
                    <span>🎙️ Luyện Nói</span>
                    <span className="text-[10px] text-cyan-900 font-bold opacity-80">(11 Câu)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectMode('WRITING', undefined, combo.writingTestId);
                    }}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#FFF3E0] hover:bg-[#ffe0b2] border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    title="Luyện Viết 8 câu hỏi chuẩn ETS"
                  >
                    <span>✍️ Luyện Viết</span>
                    <span className="text-[10px] text-amber-900 font-bold opacity-80">(8 Câu)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="mt-1 sm:mt-3 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-200 border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:bg-gray-300 active:scale-95 min-h-[42px] sm:min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Màn Hình Chính
        </button>

      </div>
    </div>
  );
};
