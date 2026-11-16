import React, { useEffect } from 'react';
import { X, Flame, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  lastStudyDate: string;
  nickname: string;
  onStartLearning?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  lastStudyDate,
  nickname,
  onStartLearning,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayStr = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  const isStudiedToday = lastStudyDate === todayStr;

  // Day of week index (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const todayDayOfWeek = new Date().getDay();
  const dayNames = [
    { label: 'CN', dayIdx: 0 },
    { label: 'T2', dayIdx: 1 },
    { label: 'T3', dayIdx: 2 },
    { label: 'T4', dayIdx: 3 },
    { label: 'T5', dayIdx: 4 },
    { label: 'T6', dayIdx: 5 },
    { label: 'T7', dayIdx: 6 },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 px-4 py-6 flex items-center justify-center animate-fadeIn"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white border-4 border-black shadow-neo-lg p-5 sm:p-6 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute top-3 right-3 w-9 h-9 border-2 border-black bg-neoYellow flex items-center justify-center hover:bg-yellow-300 active:scale-95 transition-transform"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 border-3 border-black rounded-full flex items-center justify-center shadow-neo-sm mb-3">
            <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 fill-orange-500 animate-bounceSlow" />
          </div>

          <span className="text-xs uppercase font-black px-2.5 py-1 bg-neoYellow border-2 border-black rotate-[-2deg] shadow-neo-sm">
            🔥 Chuỗi học tập
          </span>

          <h2 className="text-3xl sm:text-4xl font-black font-heading mt-2">
            {streakDays} ngày liên tiếp!
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 max-w-xs">
            {isStudiedToday ? (
              <span className="text-emerald-700 font-black flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 inline" /> Hôm nay đã học bài, ngọn lửa vẫn rực cháy!
              </span>
            ) : (
              <span className="text-amber-800 font-bold">
                ⏳ Hôm nay chưa học bài nào. Hãy học 1 bài bất kỳ để duy trì ngọn lửa nhé!
              </span>
            )}
          </p>
        </div>

        {/* 7-Day Weekly Streak Tracker */}
        <div className="mt-5 p-3.5 bg-neoBg border-2 border-black shadow-neo-sm">
          <p className="text-xs font-black uppercase text-gray-700 text-center mb-2.5">
            Lịch tuần này
          </p>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {dayNames.map(({ label, dayIdx }) => {
              const isToday = dayIdx === todayDayOfWeek;
              const isPastOrToday = (todayDayOfWeek === 0 ? 7 : todayDayOfWeek) >= (dayIdx === 0 ? 7 : dayIdx);
              const isActive = (isToday && isStudiedToday) || (!isToday && isPastOrToday && streakDays > 1);

              return (
                <div
                  key={label}
                  className={`flex flex-col items-center py-2 px-1 border-2 border-black rounded font-black text-xs transition-transform ${
                    isToday
                      ? 'bg-yellow-200 ring-2 ring-orange-500 scale-105'
                      : isActive
                      ? 'bg-orange-100 text-orange-900'
                      : 'bg-white text-gray-400'
                  }`}
                >
                  <span className="text-[10px] text-gray-600 mb-1">{label}</span>
                  {isActive ? (
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-gray-200 border border-gray-400 inline-block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation quote */}
        <div className="mt-4 p-3 bg-pink-50 border-2 border-dashed border-pink-400 text-xs sm:text-sm font-bold text-pink-900 text-center">
          💖 <strong>Cố lên nha {nickname}!</strong> Mỗi ngày một chút là nỗi sợ TOEIC bay màu, học chăm nhớ đòi người yêu thưởng trà sữa nhé! 🧋
        </div>

        {/* Action button */}
        <div className="mt-5 flex gap-2">
          {onStartLearning && !isStudiedToday ? (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                onStartLearning();
              }}
              className="flex-1 py-3 px-4 bg-neoYellow hover:bg-yellow-300 border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <BookOpen className="w-4 h-4" /> Vào học giữ chuỗi ngay
            </button>
          ) : (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="w-full py-3 px-4 bg-neoGreen hover:bg-emerald-300 border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4" /> Tuyệt vời, tiếp tục phát huy!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
