import React, { useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import {
  DoodleBoba,
  DoodleBook,
  DoodleCheck,
  DoodleFire,
  DoodleHeart,
  DoodleStar,
  MascotSticker,
  WashiTapeBadge,
} from './DoodleIcons';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  lastStudyDate: string;
  studyDates?: string[];
  nickname: string;
  onStartLearning?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  lastStudyDate,
  studyDates = [],
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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-white border-3 sm:border-4 border-black shadow-neo-lg p-4 sm:p-6 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 w-9 h-9 border-2 border-black bg-neoYellow flex items-center justify-center hover:bg-yellow-300 active:scale-95 transition-transform cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Hand-drawn Flame Mascot */}
        <div className="flex flex-col items-center text-center">
          <MascotSticker
            src="/doodles/mascot-streak.png"
            alt="Bé lửa đọc bài"
            size={96}
            className={`w-24 h-24 mb-1 ${streakDays === 0 ? 'grayscale opacity-75' : 'animate-bounceSlow'}`}
          />

          <WashiTapeBadge tone={streakDays > 0 ? 'yellow' : 'lavender'} rotate="left" className="uppercase">
            <DoodleFire size={14} />
            <span>{streakDays > 0 ? 'Chuỗi học tập' : 'Chuỗi đang nghỉ'}</span>
          </WashiTapeBadge>

          <h2 className="text-3xl sm:text-4xl font-black font-heading mt-2">
            {streakDays > 0 ? `${streakDays} ngày liên tiếp!` : '0 ngày liên tiếp'}
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 max-w-xs">
            {streakDays === 0 ? (
              <span className="text-rose-600 font-bold block">
                Đốm lửa nhỏ đang ngủ. Chỉ cần vào web mỗi ngày là thắp sáng chuỗi mới nha!
              </span>
            ) : isStudiedToday ? (
              <span className="text-emerald-700 font-black flex items-center justify-center gap-1.5">
                <DoodleCheck size={16} />
                <span>Hôm nay bạn đã vào web điểm danh, đốm lửa vẫn rực cháy!</span>
              </span>
            ) : (
              <span className="text-amber-800 font-bold flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Hôm nay chưa vào web. Vào web mỗi ngày để giữ chuỗi {streakDays} ngày nhé!</span>
              </span>
            )}
          </p>
        </div>

        {/* 7-Day Weekly Streak Tracker */}
        <div className="mt-5 p-3.5 bg-neoBg border-2 border-black shadow-neo-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-black uppercase text-gray-700">Lịch tuần này</p>
            <span className="text-[10px] font-bold text-gray-500">
              {streakDays > 0 ? `Đang duy trì: ${streakDays} ngày` : 'Nghỉ 1 ngày là về 0'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {dayNames.map(({ label, dayIdx }) => {
              const dateStr = getWeekDateString(dayIdx);
              const isToday = dayIdx === todayDayOfWeek;
              const isActive = (studyDates && studyDates.includes(dateStr)) || (isToday && isStudiedToday);

              return (
                <div
                  key={label}
                  className={`flex flex-col items-center py-2 px-1 border-2 border-black rounded font-black text-xs transition-transform ${
                    isToday
                      ? 'bg-[#FFF099] ring-2 ring-orange-400 scale-105'
                      : isActive
                        ? 'bg-[#FFE2C2] text-orange-950'
                        : 'bg-white text-gray-400'
                  }`}
                  title={`${label}: ${dateStr} - ${isActive ? 'Đã học' : 'Chưa học'}`}
                >
                  <span className="text-[10px] text-gray-600 mb-1">{label}</span>
                  {isActive ? (
                    <DoodleFire size={18} />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-gray-100 border border-dashed border-gray-400 inline-block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation note */}
        <div className="mt-4 p-3 bg-[#FFF5F7] border-2 border-dashed border-pink-400 text-xs sm:text-sm font-bold text-pink-950 flex items-center gap-2.5 text-left">
          <DoodleBoba size={26} />
          <span>
            <strong className="inline-flex items-center gap-1">
              <DoodleHeart size={14} /> Cố lên nha {nickname}!
            </strong>{' '}
            Mỗi ngày góp một ít là TOEIC nhẹ tênh, học chăm nhớ đòi người yêu thưởng trà sữa nhé!
          </span>
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
              <DoodleBook size={18} /> Vào học giữ chuỗi ngay
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-3 px-4 bg-neoGreen hover:bg-emerald-300 border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <DoodleStar size={18} /> Tiếp tục phát huy nha!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
