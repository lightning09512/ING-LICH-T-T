import React from 'react';
import { sounds } from '../utils/soundEffects';
import { Cloud, LogIn, ArrowLeft } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';
import { useLearningProgress } from '../contexts/ProgressContext';
import { RANK_TIERS_CONFIG } from '../types/ranked';
import {
  DoodleBook,
  DoodleCheck,
  DoodleFire,
  DoodleMic,
  DoodlePencil,
  DoodleStar,
  DoodleTarget,
  DoodleTrophy,
  MascotSticker,
  WashiTapeBadge,
} from './DoodleIcons';

interface MenuScreenProps {
  onSelectMode: (
    mode: 'LEARN' | 'GRAMMAR' | 'EXAM' | 'RANKED' | 'SPEAKING' | 'WRITING' | 'SW_EXAM',
    chapter?: 1 | 2,
    testId?: string,
    swSkill?: 'SPEAKING' | 'WRITING'
  ) => void;
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
  onOpenAccount,
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
            className="w-full bg-white border-3 border-black p-2.5 sm:p-3.5 shadow-neo flex items-center justify-between gap-2.5 cursor-pointer hover:bg-cyan-50/40 transition-colors"
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
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-[#C6F6DF] text-[#0B3B28] border border-black font-black px-1.5 py-0.5 rounded shadow-neo-sm">
                    <DoodleCheck size={12} />
                    <span>Đã đăng nhập</span>
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
            className="w-full bg-[#FFF099] border-3 border-black p-2.5 sm:p-3 shadow-neo-sm hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2 font-black text-xs sm:text-sm cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-black shrink-0" />
            <span>Đăng nhập tài khoản Google để lưu tiến trình của bạn</span>
          </button>
        )}

        {/* Header greeting with cozy hand-drawn mascot */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
          <MascotSticker
            src="/doodles/mascot-study.png"
            alt="Bé mèo học bài"
            size={76}
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
          />
          <div>
            <WashiTapeBadge tone="lavender" rotate="left" className="uppercase">
              <DoodleBook size={14} />
              <span>Sổ Tay Ôn Luyện</span>
            </WashiTapeBadge>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 font-heading leading-tight">
              Hôm nay {nickname} muốn học gì nào?
            </h2>
          </div>
        </div>

        {/* Mode Cards */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">
          {/* Card 1: Học bài (Chương 1 & Chương 2) */}
          <div className="w-full bg-white border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg flex flex-col gap-3 group">
            <div
              onClick={() => {
                sounds.playClick();
                onSelectMode('LEARN', 1);
              }}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#C6F6DF] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-3 transition-transform shrink-0">
                  <DoodleBook size={32} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading leading-tight">
                      Học từ vựng
                    </h3>
                    <WashiTapeBadge tone="yellow">2 Chương</WashiTapeBadge>
                  </div>
                  <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                    Từ vựng TOEIC trọng điểm, thẻ lật Flashcard & giọng đọc chuẩn Mỹ
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Chapter Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t-2 border-dashed border-black/15">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onSelectMode('LEARN', 1);
                }}
                className="flex items-center justify-between px-3 py-2 bg-[#FFFBEB] hover:bg-yellow-100 border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer text-left gap-2"
              >
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <DoodleBook size={16} />
                  <span className="truncate"><strong>Chương 1:</strong> 26 Ngày Cơ Bản</span>
                </span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 border border-black shrink-0">26 Màn</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onSelectMode('LEARN', 2);
                }}
                className="flex items-center justify-between px-3 py-2 bg-[#ECFEFF] hover:bg-cyan-100 border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer text-left gap-2"
              >
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <DoodleStar size={16} />
                  <span className="truncate"><strong>Chương 2:</strong> ETS 2019 & New Economy</span>
                </span>
                <span className="text-[10px] bg-white px-1.5 py-0.5 border border-black shrink-0">13 Bộ</span>
              </button>
            </div>
          </div>

          {/* Card 2: Ngữ pháp */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('GRAMMAR');
            }}
            className="w-full bg-white hover:bg-amber-50/70 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group min-h-[76px] sm:min-h-[96px] cursor-pointer relative overflow-hidden"
          >
            <WashiTapeBadge tone="peach" rotate="right" className="absolute top-2 right-2 z-10">
              <span>Trọng điểm Part 5 & 6</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FFF099] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:-rotate-3 transition-transform shrink-0">
                <DoodlePencil size={30} />
              </div>
              <div className="min-w-0 pr-24 sm:pr-32">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading leading-tight">
                  Ngữ pháp
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                  10 chủ điểm cốt lõi Part 5 & 6, công thức ngắn gọn, mẹo tránh bẫy & bài tập nhanh
                </p>
              </div>
            </div>
          </button>

          {/* Card 3: Đấu Xếp Hạng */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('RANKED');
            }}
            className="w-full bg-[#FFFBEB] hover:bg-yellow-100/80 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <WashiTapeBadge tone="yellow" rotate="right" className="absolute top-2 right-2 z-10">
              <DoodleFire size={14} />
              <span>{rankPromo?.active ? 'Bo3 Thăng Hạng' : `${currentTierConfig.nameVi} • ${rankLp} LP`}</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-105 transition-transform shrink-0">
                <DoodleTrophy size={32} />
              </div>
              <div className="min-w-0 pr-24 sm:pr-32">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  Đấu Xếp Hạng
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  Leo bậc Đồng đến Thách Đấu, tính điểm LP & chuỗi thăng hạng Bo3 theo độ khó ETS
                </p>
              </div>
            </div>
          </button>

          {/* Card 4: Luyện đề 200 câu */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('EXAM');
            }}
            className="w-full bg-white hover:bg-rose-50/60 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <WashiTapeBadge tone="pink" rotate="right" className="absolute top-2 right-2 z-10">
              <span>Đề 200 câu</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FFD6E5] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-105 transition-transform shrink-0">
                <DoodleTarget size={30} />
              </div>
              <div className="min-w-0 pr-20 sm:pr-28">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  Luyện đề Nghe & Đọc
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                  Trọn bộ Part 1 – 7, trình phát audio chuẩn phòng thi, bảng câu hỏi & chấm điểm 990
                </p>
              </div>
            </div>
          </button>

          {/* SECTION DIVIDER: TOEIC SPEAKING & WRITING */}
          <div className="w-full flex items-center gap-2 pt-2 pb-1">
            <div className="h-[2px] bg-black/15 flex-1" />
            <WashiTapeBadge tone="yellow" className="rounded-full px-3.5 py-1">
              <DoodleStar size={14} />
              <span>TOEIC 4 Kỹ Năng • Speaking & Writing</span>
            </WashiTapeBadge>
            <div className="h-[2px] bg-black/15 flex-1" />
          </div>

          {/* Card 5: TOEIC Speaking Revision */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('SPEAKING');
            }}
            className="w-full bg-[#ECFEFF] hover:bg-cyan-100/80 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer text-left"
          >
            <WashiTapeBadge tone="sky" rotate="right" className="absolute top-2 right-2 z-10">
              <span>Cẩm nang 5 Part</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#CCF2FF] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:-rotate-3 transition-transform shrink-0">
                <DoodleMic size={30} />
              </div>
              <div className="min-w-0 pr-24 sm:pr-32">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  TOEIC Speaking
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  16 bài ôn luyện 5 Part: cách ngắt nghỉ, ngữ điệu, mẫu câu ăn điểm & nghe phát âm mẫu
                </p>
              </div>
            </div>
          </button>

          {/* Card 6: TOEIC Writing Revision */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('WRITING');
            }}
            className="w-full bg-[#FFF7ED] hover:bg-orange-100/80 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer text-left"
          >
            <WashiTapeBadge tone="peach" rotate="left" className="absolute top-2 right-2 z-10">
              <span>Dàn bài & Cấu trúc</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#FFE2C2] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-3 transition-transform shrink-0">
                <DoodlePencil size={30} />
              </div>
              <div className="min-w-0 pr-28 sm:pr-36">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  TOEIC Writing
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  8 bài học 3 Part: mẹo đặt câu theo tranh, khung Email công sở & dàn ý luận 300 từ
                </p>
              </div>
            </div>
          </button>

          {/* Card 7: Luyện Đề Speaking & Writing */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('SW_EXAM');
            }}
            className="w-full bg-[#F5F3FF] hover:bg-purple-100/80 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden min-h-[76px] sm:min-h-[96px] cursor-pointer text-left"
          >
            <WashiTapeBadge tone="lavender" rotate="right" className="absolute top-2 right-2 z-10">
              <span>20 Đề thực chiến</span>
            </WashiTapeBadge>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#E5DCFF] border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-105 transition-transform shrink-0">
                <DoodleTarget size={30} />
              </div>
              <div className="min-w-0 pr-24 sm:pr-32">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading text-black leading-tight">
                  Phòng Thi Speaking & Writing
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-700 mt-0.5 line-clamp-2">
                  Trọn bộ 20 đề gốc (10 Speaking • 10 Writing): audio & tranh đề thi, đồng hồ đếm giờ và chấm bài chi tiết
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Back button */}
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="mt-1 sm:mt-3 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white border-2 border-black font-black text-xs sm:text-sm shadow-neo-sm hover:bg-gray-100 active:scale-95 min-h-[42px] sm:min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Màn Hình Chính
        </button>
      </div>
    </div>
  );
};
