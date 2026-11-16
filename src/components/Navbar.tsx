import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Home, Heart, Flame, Maximize, Minimize, Headphones, LogIn, LogOut, LoaderCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import type { User } from 'firebase/auth';
import type { SyncStatus } from '../contexts/ProgressContext';

interface NavbarProps {
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  nickname: string;
  streakDays: number;
  onToggleLofi?: () => void;
  isLofiOpen?: boolean;
  user: User | null;
  authLoading: boolean;
  syncStatus: SyncStatus;
  onOpenAccount: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  soundEnabled,
  onToggleSound,
  nickname,
  streakDays,
  onToggleLofi,
  isLofiOpen,
  user,
  authLoading,
  syncStatus,
  onOpenAccount,
  onSignOut,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleAccountClick = () => {
    sounds.playClick();
    onOpenAccount();
  };

  const syncLabel = {
    local: 'Tiến trình đang lưu trên thiết bị này',
    syncing: 'Đang đồng bộ tiến trình',
    saved: 'Tiến trình đã được lưu vào tài khoản',
    error: 'Chưa đồng bộ được tiến trình lên đám mây',
  }[syncStatus];

  return (
    <header className="relative z-10 w-full px-2.5 sm:px-4 py-2 sm:py-3 bg-white border-b-4 border-black flex items-center justify-between shadow-neo-sm">
      <div 
        onClick={() => { sounds.playClick(); onGoHome(); }}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-h-[44px]"
      >
        <img 
          src="/trollface.png" 
          alt="Trollface" 
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:rotate-12 transition-transform shrink-0" 
        />
        <div className="flex flex-col min-w-0">
          <span className="font-heading text-base sm:text-lg md:text-xl font-black tracking-wide uppercase truncate">
            Ing Lịch Tét
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Email account and progress sync */}
        <button
          onClick={handleAccountClick}
          disabled={authLoading}
          className={`h-10 sm:h-11 min-w-10 px-2 sm:px-3 border-2 border-black rounded shadow-neo-sm font-black text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
            user ? 'bg-neoCyan hover:bg-cyan-300' : 'bg-white hover:bg-gray-100'
          }`}
          title={user ? `${user.displayName || user.email} · ${syncLabel} · Bấm để xem thông tin` : 'Đăng nhập để đồng bộ tiến trình'}
          aria-label={user ? 'Xem thông tin tài khoản' : 'Đăng nhập hoặc tạo tài khoản'}
        >
          {authLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : user ? (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full border border-black shrink-0" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-neoYellow border border-black flex items-center justify-center text-[10px] font-black shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              )}
              <span className="hidden lg:inline truncate max-w-[120px]">{user.displayName || user.email?.split('@')[0]}</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span className="hidden lg:inline">Tài khoản</span>
            </>
          )}
        </button>

        {/* Streak Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-orange-100 border-2 border-black rounded shadow-neo-sm font-bold text-xs sm:text-sm min-h-[40px]">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{streakDays} ngày</span>
        </div>

        {/* 3 Hearts indicator */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-pink-100 border-2 border-black rounded shadow-neo-sm min-h-[40px]">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
        </div>

        {/* Lofi Music Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleLofi?.();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-10 sm:h-11 border-2 border-black rounded shadow-neo-sm font-black text-xs transition-transform active:scale-95 cursor-pointer ${
            isLofiOpen ? 'bg-neoPink text-white' : 'bg-neoYellow hover:bg-yellow-300 text-black'
          }`}
          title="Bật/Tắt Góc Nhạc Lofi Chill"
          aria-label="Lofi Music"
        >
          <Headphones className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="hidden sm:inline">Lofi Chill</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-black bg-neoPurple rounded hover:bg-purple-300 active:scale-95 shadow-neo-sm flex items-center justify-center cursor-pointer transition-transform"
          title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
          aria-label="Toàn màn hình"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-black bg-neoYellow rounded hover:bg-yellow-400 active:scale-95 shadow-neo-sm flex items-center justify-center cursor-pointer transition-transform"
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          aria-label="Bật tắt âm thanh"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-600" />}
        </button>

        {/* Home Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-black bg-neoCyan rounded hover:bg-cyan-300 active:scale-95 shadow-neo-sm flex items-center justify-center cursor-pointer transition-transform"
          title="Về Trang Chủ"
          aria-label="Về Trang Chủ"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
