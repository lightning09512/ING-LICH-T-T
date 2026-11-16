import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Home, Heart, Flame, Maximize, Minimize } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  onGoHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  nickname: string;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  soundEnabled,
  onToggleSound,
  nickname,
  streakDays
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
          <span className="text-[11px] sm:text-xs text-pink-600 font-bold -mt-0.5 truncate">
            Dành cho {nickname} ❤️
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
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
