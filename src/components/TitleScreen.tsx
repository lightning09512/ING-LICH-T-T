import React from 'react';
import { sounds } from '../utils/soundEffects';
import { Play, Cloud, LoaderCircle, ExternalLink, AlertCircle } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';
import {
  DoodleBoba,
  DoodleStar,
  DoodleUnderline,
  MascotSticker,
  WashiTapeBadge,
} from './DoodleIcons';

interface TitleScreenProps {
  onStart: () => void;
  nickname: string;
  user: User | null;
  authLoading: boolean;
  syncStatus: SyncStatus;
  authError: string | null;
  onOpenAccount: () => void;
  onSignOut: () => void;
  onGoogleSignIn?: () => Promise<boolean>;
  onGoogleRedirectSignIn?: () => Promise<boolean>;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  nickname,
  user,
  authLoading,
  onOpenAccount,
  onSignOut,
  onGoogleSignIn,
  onGoogleRedirectSignIn,
  authError,
}) => {
  const handleStart = () => {
    sounds.playCorrect();
    onStart();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] px-3 sm:px-4 py-4 sm:py-6 text-center">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 sm:gap-5">
        {/* Hand-drawn study cat mascot perched on top of the notebook cover */}
        <div className="relative w-full mt-2 sm:mt-4">
          <MascotSticker
            src="/doodles/mascot-study.png"
            alt="Mèo đội mũ xanh đọc sách cùng trà sữa"
            size={96}
            className="w-20 h-20 sm:w-24 sm:h-24 -mb-5 sm:-mb-6 mx-auto relative z-20 drop-shadow-sm animate-wiggle"
          />

          <div className="w-full bg-white border-4 border-black p-4 pt-6 sm:p-6 sm:pt-8 md:p-8 shadow-neo-lg relative">
            <WashiTapeBadge
              tone="pink"
              rotate="right"
              className="absolute -top-3 right-2 sm:-top-3.5 sm:right-4 uppercase"
            >
              <DoodleStar size={14} />
              <span>Edition Bạn Gái 2026</span>
            </WashiTapeBadge>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider font-heading text-black break-words mt-1 sm:mt-0">
              ing lịch tét
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-bold text-gray-600 mt-1.5 sm:mt-2 font-comic">
              (giải cứu bạn gái khỏi nỗi sợ TOEIC)
            </p>
          </div>
        </div>

        {/* Subtitle: Nickname with hand-drawn brush underline + personal avatar */}
        <div className="relative py-1 sm:py-2 flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
          <div className="inline-flex flex-col items-center rotate-[-2deg] hover:scale-105 transition-transform">
            <span className="text-3xl sm:text-5xl md:text-6xl font-black text-rose-600 font-comic tracking-tight flex items-center gap-1.5">
              <DoodleStar size={24} className="-mt-2" />
              <span>{nickname}</span>
            </span>
            <DoodleUnderline color="#FF94B9" className="max-w-[200px] sm:max-w-[260px] -mt-1" />
          </div>
          <img
            src="/app-icon.png"
            alt={nickname}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-black shadow-neo object-cover animate-wiggle inline-block shrink-0"
          />
        </div>

        {/* Start Button */}
        <div className="w-full max-w-sm px-2">
          <button
            onClick={handleStart}
            className="w-full py-3.5 sm:py-5 px-6 sm:px-8 bg-neoYellow border-4 border-black text-xl sm:text-2xl md:text-3xl font-black font-heading uppercase shadow-neo-lg hover:bg-yellow-300 hover:shadow-neo active:scale-95 transition-all flex items-center justify-center gap-3 group min-h-[54px] sm:min-h-[58px] cursor-pointer"
          >
            <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-black group-hover:scale-110 transition-transform" />
            <span>Bắt đầu học</span>
            <DoodleStar size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Account status card / Login button */}
        <div className="w-full max-w-sm px-2">
          {user ? (
            <div className="w-full bg-white border-2 border-black p-2.5 sm:p-3 shadow-neo-sm flex items-center justify-between gap-2">
              <div
                onClick={onOpenAccount}
                className="flex items-center gap-2 truncate cursor-pointer hover:opacity-80 flex-1 min-w-0"
                title="Bấm để xem chi tiết tài khoản"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-black shrink-0" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-neoCyan border border-black flex items-center justify-center font-black text-xs shrink-0">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </span>
                )}
                <div className="flex flex-col text-left min-w-0 truncate">
                  <span className="text-xs font-black truncate">{user.displayName || user.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Cloud className="w-3 h-3 text-emerald-600 inline shrink-0" /> Đã đồng bộ tiến trình
                  </span>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-black text-xs font-bold shrink-0 transition-colors cursor-pointer"
                title="Đăng xuất tài khoản này"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={async () => {
                  if (onGoogleSignIn) {
                    const ok = await onGoogleSignIn();
                    if (ok) onStart();
                  } else {
                    onOpenAccount();
                  }
                }}
                disabled={authLoading}
                className="w-full min-h-12 px-4 py-2.5 bg-white border-3 border-black shadow-neo hover:bg-yellow-50 active:scale-95 transition-all flex items-center justify-center gap-2.5 font-black text-sm cursor-pointer disabled:opacity-60"
              >
                {authLoading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Đang kết nối...</span>
                  </>
                ) : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 shrink-0" />
                    <span>Đăng nhập Gmail để lưu tiến trình</span>
                  </>
                )}
              </button>
              {onGoogleRedirectSignIn && (
                <button
                  type="button"
                  onClick={() => { void onGoogleRedirectSignIn(); }}
                  disabled={authLoading}
                  className="w-full min-h-10 px-3 py-1.5 bg-[#CCF2FF] hover:bg-cyan-200 border-2 border-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-neo-sm active:scale-95 transition-all"
                  title="Không cần mở popup, chuyển thẳng sang trang đăng nhập Google"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>Bị chặn popup? Bấm để chuyển sang Google</span>
                </button>
              )}

              <button
                onClick={onOpenAccount}
                className="text-xs font-bold text-gray-500 hover:text-black underline cursor-pointer"
              >
                Hoặc dùng Email & Mật khẩu
              </button>

              {authError && (
                <div role="alert" className="w-full bg-red-50 border-2 border-red-500 p-3 mt-1 text-xs sm:text-sm font-bold text-red-800 text-left shadow-neo-sm animate-shake">
                  <p className="font-black text-red-900 mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Chưa đăng nhập được:</span>
                  </p>
                  <p>{authError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hand-drawn Boba Sticky Note */}
        <div className="bg-[#FFF9DB] border-2 border-dashed border-black px-3.5 sm:px-4 py-2 mt-1 sm:mt-2 text-xs sm:text-sm font-bold text-gray-800 max-w-md flex items-center justify-center gap-2">
          <DoodleBoba size={22} />
          <span>Nhắc nhẹ: Làm sai quá 3 câu sẽ bị ghi sổ trừ 1 ly trà sữa!</span>
        </div>
      </div>
    </div>
  );
};
