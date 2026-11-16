import React from 'react';
import { sounds } from '../utils/soundEffects';
import { Play, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  nickname: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, nickname }) => {
  const handleStart = () => {
    sounds.playCorrect();
    onStart();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
      {/* Container simulating the exact sketch 1 */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 animate-bounceSlow">
        {/* Top Box: ing lich tet */}
        <div className="w-full bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg relative">
          <div className="absolute -top-4 -right-4 bg-neoPink text-white text-xs font-black px-3 py-1 border-2 border-black rotate-12 shadow-neo-sm">
            EDITION BẠN GÁI 2026
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider font-heading text-black">
            ing lich tét
          </h1>
          <p className="text-sm md:text-base font-bold text-gray-600 mt-2 font-comic">
            (English Test phiên bản giải cứu bạn gái khỏi nỗi sợ TOEIC)
          </p>
        </div>

        {/* Subtitle: Mập địch (Doodle handwriting style) */}
        <div className="relative py-2 flex items-center justify-center gap-3">
          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-red-600 font-comic tracking-tight rotate-[-3deg] hover:scale-110 transition-transform cursor-pointer">
            ✨ {nickname} ✨
          </span>
          <img 
            src="/trollface.png" 
            alt="troll" 
            className="w-12 h-12 object-contain animate-wiggle inline-block"
          />
        </div>

        {/* Start Button: [ Bắt đầu ] */}
        <div className="w-full max-w-sm">
          <button
            onClick={handleStart}
            className="w-full py-5 px-8 bg-neoYellow border-4 border-black text-2xl md:text-3xl font-black font-heading uppercase shadow-neo-lg hover:bg-yellow-300 hover:shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-7 h-7 fill-black group-hover:scale-125 transition-transform" />
            <span>Bắt đầu</span>
            <Sparkles className="w-6 h-6 text-pink-500 fill-pink-500 group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* Troll Disclaimer */}
        <div className="bg-neoBg/90 border-2 border-dashed border-black px-4 py-2 mt-4 text-xs md:text-sm font-bold text-gray-700">
          ⚠️ Cảnh báo: Làm sai quá 3 câu sẽ bị Trollface cười vào mặt và trừ 1 ly trà sữa!
        </div>
      </div>
    </div>
  );
};
