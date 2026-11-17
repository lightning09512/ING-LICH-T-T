import React, { useEffect } from 'react';
import { X, Flame, CheckCircle2, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  lastStudyDate: string;
  studyDates?: string[];
  nickname: string;
  onStartLearning?: () => void;
  onResetStreak?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  lastStudyDate,
  studyDates = [],
  nickname,
  onStartLearning,
  onResetStreak,
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

  // Calculate exact YYYY-MM-DD for each day of the current week
  const getWeekDateString = (targetDayIdx: number): string => {
    const d = new Date();
    const diff = targetDayIdx - todayDayOfWeek;
    d.setDate(d.getDate() + diff);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 p-2.5 sm:p-4 flex items-center justify-center animate-fadeIn"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-white border-3 sm:border-4 border-black shadow-neo-lg p-4 sm:p-6 relative animate-scaleUp">
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
          <div className={`w-16 h-16 sm:w-20 sm:h-20 border-3 border-black rounded-full flex items-center justify-center shadow-neo-sm mb-3 ${
            streakDays > 0 ? 'bg-orange-100' : 'bg-gray-100'
          }`}>
            <Flame className={`w-10 h-10 sm:w-12 sm:h-12 ${
              streakDays > 0 ? 'text-orange-500 fill-orange-500 animate-bounceSlow' : 'text-gray-400 fill-gray-300'
            }`} />
          </div>

          <span className={`text-xs uppercase font-black px-2.5 py-1 border-2 border-black rotate-[-2deg] shadow-neo-sm ${
            streakDays > 0 ? 'bg-neoYellow text-black' : 'bg-gray-200 text-gray-700'
          }`}>
            {streakDays > 0 ? '🔥 Chuỗi học tập' : '❄️ Chuỗi đã tắt'}
          </span>

          <h2 className="text-3xl sm:text-4xl font-black font-heading mt-2">
            {streakDays > 0 ? `${streakDays} ngày liên tiếp!` : '0 ngày liên tiếp'}
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 max-w-xs">
            {streakDays === 0 ? (
              <span className="text-rose-600 font-bold block">
                Ngọn lửa đã tắt vì không học bài liên tục! Học 1 bài ngay để bắt đầu chuỗi ngày mới nhé!
              </span>
            ) : isStudiedToday ? (
              <span className="text-emerald-700 font-black flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 inline" /> Hôm nay đã học bài, ngọn lửa vẫn rực cháy!
              </span>
            ) : (
              <span className="text-amber-800 font-bold">
                ⏳ Hôm nay chưa học bài nào. Hãy học 1 bài bất kỳ để duy trì chuỗi {streakDays} ngày nhé!
              </span>
            )}
          </p>
        </div>

        {/* 7-Day Weekly Streak Tracker */}
        <div className="mt-5 p-3.5 bg-neoBg border-2 border-black shadow-neo-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-black uppercase text-gray-700">
              Lịch tuần này
            </p>
            <span className="text-[10px] font-bold text-gray-500">
              {streakDays > 0 ? `Đang duy trì: ${streakDays} ngày` : 'Nghỉ 1 ngày là mất chuỗi'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {dayNames.map(({ label, dayIdx }) => {
              const dateStr = getWeekDateString(dayIdx);
              const isToday = dayIdx === todayDayOfWeek;
              const isStudiedOnDate = (studyDates && studyDates.includes(dateStr)) || (isToday && isStudiedToday);
              const isActive = isStudiedOnDate;

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
                  title={`${label}: ${dateStr} - ${isActive ? 'Đã học' : 'Chưa học'}`}
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

        {/* Reset streak option */}
        {onResetStreak && (
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                if (window.confirm('Bạn có muốn đặt lại chuỗi học tập về 0 ngày để bắt đầu chuỗi mới không?')) {
                  sounds.playClick();
                  onResetStreak();
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-rose-600 underline cursor-pointer transition-colors"
              title="Bấm để đặt lại chuỗi về 0 ngày"
            >
              <RotateCcw className="w-3 h-3 inline" /> Đặt lại chuỗi học tập (về 0 ngày)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
