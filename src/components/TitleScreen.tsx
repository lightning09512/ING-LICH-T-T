import React from 'react';
import { sounds } from '../utils/soundEffects';
import { Play, Sparkles, Cloud, LogIn, LogOut, LoaderCircle } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';

interface TitleScreenProps {
  onStart: () => void;
  nickname: string;
  user: User | null;
  authLoading: boolean;
  syncStatus: SyncStatus;
  onOpenAccount: () => void;
  onSignOut: () => void;
  onGoogleSignIn?: () => Promise<boolean>;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  nickname,
  user,
  authLoading,
  syncStatus,
  onOpenAccount,
  onSignOut,
  onGoogleSignIn
}) => {
  const handleStart = () => {
    sounds.playCorrect();
    onStart();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] px-3 sm:px-4 py-4 sm:py-6 text-center">
      {/* Container simulating the exact sketch 1 */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-5 sm:gap-6 animate-bounceSlow">
        {/* Top Box: ing lich tet */}
        <div className="w-full bg-white border-4 border-black p-4 sm:p-6 md:p-8 shadow-neo-lg relative">
          <div className="absolute -top-3.5 -right-3 sm:-top-4 sm:-right-4 bg-neoPink text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 border-2 border-black rotate-12 shadow-neo-sm">
            EDITION BẠN GÁI 2026
          </div>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider font-heading text-black break-words">
            ing lich tét
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-bold text-gray-600 mt-2 font-comic">
            (giải cứu bạn gái khỏi nỗi sợ TOEIC)
          </p>
        </div>

        {/* Subtitle: Mập địch (Doodle handwriting style) */}
        <div className="relative py-1 sm:py-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-red-600 font-comic tracking-tight rotate-[-3deg] hover:scale-110 transition-transform cursor-pointer">
            ✨ {nickname} ✨
          </span>
          <img
            src="/trollface.png"
            alt="troll"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain animate-wiggle inline-block shrink-0"
          />
        </div>

        {/* Start Button: [ Bắt đầu ] */}
        <div className="w-full max-w-sm px-2">
          <button
            onClick={handleStart}
            className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-neoYellow border-4 border-black text-xl sm:text-2xl md:text-3xl font-black font-heading uppercase shadow-neo-lg hover:bg-yellow-300 hover:shadow-neo active:scale-95 transition-all flex items-center justify-center gap-3 group min-h-[58px] cursor-pointer"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black group-hover:scale-125 transition-transform" />
            <span>Bắt đầu</span>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 fill-pink-500 group-hover:rotate-45 transition-transform" />
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
                className="w-full min-h-12 px-4 py-2.5 bg-white border-3 border-black shadow-neo hover:bg-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-2.5 font-black text-sm cursor-pointer disabled:opacity-60"
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
              <button
                onClick={onOpenAccount}
                className="text-xs font-bold text-gray-500 hover:text-black underline cursor-pointer"
              >
                Hoặc dùng Email & Mật khẩu
              </button>
            </div>
          )}
        </div>

        {/* Troll Disclaimer */}
        <div className="bg-neoBg/90 border-2 border-dashed border-black px-3.5 sm:px-4 py-2 mt-2 sm:mt-4 text-xs sm:text-sm font-bold text-gray-700 max-w-md">
          ⚠️ Cảnh báo: Làm sai quá 3 câu sẽ bị cười vào mặt và trừ 1 ly trà sữa!
        </div>
      </div>
    </div>
  );
};
