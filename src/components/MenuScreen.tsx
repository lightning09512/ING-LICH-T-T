import React from 'react';
import { sounds } from '../utils/soundEffects';
import { BookOpen, GraduationCap, Target, Cloud, LogIn, ArrowLeft } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';

interface MenuScreenProps {
  onSelectMode: (mode: 'LEARN' | 'GRAMMAR' | 'EXAM') => void;
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
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-70px)] px-3 sm:px-4 py-4 sm:py-6 md:py-10">
      <div className="w-full max-w-xl md:max-w-2xl flex flex-col items-center gap-3.5 sm:gap-5 md:gap-6">
        
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
          {/* Button 1: Học bài */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('LEARN');
            }}
            className="w-full bg-white hover:bg-emerald-50 border-3 sm:border-4 border-black p-3.5 sm:p-5 md:p-6 shadow-neo sm:shadow-neo-lg hover:shadow-neo active:scale-[0.98] transition-all flex items-center justify-between group min-h-[76px] sm:min-h-[96px] cursor-pointer"
          >
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-left min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neoGreen border-2 sm:border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-6 transition-transform shrink-0">
                <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black uppercase font-heading leading-tight">
                  Học bài
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base font-bold text-gray-600 mt-0.5 line-clamp-2">
                  Từ vựng TOEIC trọng điểm + Flashcard + Phát âm chuẩn Mỹ
                </p>
              </div>
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform shrink-0 ml-2">
              👉
            </span>
          </button>

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

          {/* Button 3: Luyện đề (Study4 style) */}
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
