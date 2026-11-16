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
    <header className="relative z-10 w-full px-4 py-3 bg-white border-b-4 border-black flex items-center justify-between shadow-neo-sm">
      <div 
        onClick={() => { sounds.playClick(); onGoHome(); }}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <img 
          src="/trollface.png" 
          alt="Trollface" 
          className="w-9 h-9 object-contain group-hover:rotate-12 transition-transform" 
        />
        <div className="flex flex-col">
          <span className="font-heading text-lg md:text-xl font-black tracking-wide uppercase">
            Ing Lịch Tét
          </span>
          <span className="text-xs text-pink-600 font-bold -mt-1">
            Dành riêng cho {nickname} ❤️
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Streak Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-orange-100 border-2 border-black rounded shadow-neo-sm font-bold text-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{streakDays} ngày</span>
        </div>

        {/* 3 Hearts indicator */}
        <div className="flex items-center gap-1 px-3 py-1 bg-pink-100 border-2 border-black rounded shadow-neo-sm">
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 border-2 border-black bg-neoPurple rounded hover:bg-purple-300 active:translate-x-0.5 active:translate-y-0.5 shadow-neo-sm"
          title={isFullscreen ? "Thu nhỏ màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className="p-2 border-2 border-black bg-neoYellow rounded hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 shadow-neo-sm"
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-600" />}
        </button>

        {/* Home Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className="p-2 border-2 border-black bg-neoCyan rounded hover:bg-cyan-300 active:translate-x-0.5 active:translate-y-0.5 shadow-neo-sm"
          title="Về Trang Chủ"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
