import React from 'react';
import { sounds } from '../utils/soundEffects';
import { BookOpen, Zap, Target, ArrowLeft } from 'lucide-react';

interface MenuScreenProps {
  onSelectMode: (mode: 'LEARN' | 'REVIEW' | 'EXAM') => void;
  onBack: () => void;
  nickname: string;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onSelectMode, onBack, nickname }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-6 md:py-10">
      <div className="w-full max-w-xl md:max-w-2xl flex flex-col items-center gap-6 md:gap-8">
        
        {/* Header badge */}
        <div className="text-center">
          <span className="inline-block px-4 py-2 bg-neoPurple border-3 border-black font-black text-sm uppercase shadow-neo-sm rotate-[-2deg]">
            🎮 Chọn Chế Độ Chơi
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 font-heading">
            Hôm nay {nickname} muốn làm gì nào?
          </h2>
        </div>

        {/* 3 Buttons matching sketch 2 */}
        <div className="w-full flex flex-col gap-4 sm:gap-5 md:gap-6">
          {/* Button 1: Học bài */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('LEARN');
            }}
            className="w-full bg-white hover:bg-emerald-50 border-4 border-black p-5 md:p-6 shadow-neo-lg hover:shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group min-h-[96px] cursor-pointer"
          >
            <div className="flex items-center gap-4 md:gap-5 text-left">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-neoGreen border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:rotate-6 transition-transform shrink-0">
                <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase font-heading">
                  Học bài
                </h3>
                <p className="text-sm md:text-base font-bold text-gray-600 mt-0.5">
                  Từ vựng TOEIC trọng điểm + Flashcard + Phát âm chuẩn Mỹ
                </p>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform">
              👉
            </span>
          </button>

          {/* Button 2: Ôn tập */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('REVIEW');
            }}
            className="w-full bg-white hover:bg-amber-50 border-4 border-black p-5 md:p-6 shadow-neo-lg hover:shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group min-h-[96px] cursor-pointer"
          >
            <div className="flex items-center gap-4 md:gap-5 text-left">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-neoYellow border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:-rotate-6 transition-transform shrink-0">
                <Zap className="w-7 h-7 md:w-8 md:h-8 text-black fill-black" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase font-heading">
                  Ôn tập
                </h3>
                <p className="text-sm md:text-base font-bold text-gray-600 mt-0.5">
                  Quiz sinh tồn 15 giây, đếm ngược thời gian, trả lời sai mất tim!
                </p>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform">
              ⚡
            </span>
          </button>

          {/* Button 3: Luyện đề (Study4 style) */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('EXAM');
            }}
            className="w-full bg-white hover:bg-rose-50 border-4 border-black p-5 md:p-6 shadow-neo-lg hover:shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group relative overflow-hidden min-h-[96px] cursor-pointer"
          >
            <div className="absolute top-2 right-2 bg-neoPink text-white text-[11px] font-black px-2.5 py-0.5 border border-black uppercase rotate-6 shadow-neo-sm">
              Chuẩn Study4
            </div>
            <div className="flex items-center gap-4 md:gap-5 text-left">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-neoPink border-3 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform shrink-0">
                <Target className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase font-heading text-black">
                  Luyện đề
                </h3>
                <p className="text-sm md:text-base font-bold text-gray-600 mt-0.5">
                  Đầy đủ Part 1 - 7 Nghe & Đọc, audio player, bảng câu hỏi, tính điểm 990
                </p>
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-black font-heading group-hover:translate-x-1 transition-transform">
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
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-gray-200 border-2 border-black font-bold text-sm shadow-neo-sm hover:bg-gray-300 active:translate-x-0.5 active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Màn Hình Chính
        </button>

      </div>
    </div>
  );
};
