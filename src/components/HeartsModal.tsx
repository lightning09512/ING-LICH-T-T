import React, { useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import {
  DoodleBoba,
  DoodleBrokenHeart,
  DoodleHeart,
  DoodlePin,
  DoodleStar,
  MascotSticker,
  WashiTapeBadge,
} from './DoodleIcons';

interface HeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  nickname: string;
  onRefillHearts: () => void;
}

export const HeartsModal: React.FC<HeartsModalProps> = ({
  isOpen,
  onClose,
  hearts,
  nickname,
  onRefillHearts,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRefill = () => {
    sounds.playVictory();
    onRefillHearts();
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

        {/* Modal Header with Boba Heart Mascot */}
        <div className="flex flex-col items-center text-center">
          <MascotSticker
            src="/doodles/mascot-hearts.png"
            alt="Ly trà sữa ôm trái tim"
            size={92}
            className="w-[92px] h-[92px] mb-1 animate-wiggle"
          />

          <div className="flex items-center justify-center gap-2.5 py-2">
            {[1, 2, 3].map((num) =>
              num <= hearts ? (
                <DoodleHeart key={num} size={38} className="scale-105 transition-transform" />
              ) : (
                <DoodleHeart key={num} size={34} muted className="opacity-65" />
              )
            )}
          </div>

          <WashiTapeBadge tone="pink" rotate="left" className="uppercase mt-1">
            <DoodleHeart size={13} />
            <span>Mạng sống của {nickname}</span>
          </WashiTapeBadge>

          <h2 className="text-3xl sm:text-4xl font-black font-heading mt-2">
            {hearts} / 3 Trái Tim
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 max-w-xs">
            {hearts === 3 ? (
              <span className="text-emerald-700 font-black">
                Đầy đủ 3 tim hồng hào! Sẵn sàng chinh phục mọi câu hỏi.
              </span>
            ) : hearts > 0 ? (
              <span className="text-amber-800 font-bold inline-flex items-center gap-1 justify-center flex-wrap">
                <span>Còn {hearts} tim thôi! Cẩn thận kẻo bị trừ trà sữa nha</span>
                <DoodleBoba size={18} />
              </span>
            ) : (
              <span className="text-rose-700 font-black inline-flex items-center gap-1.5 justify-center flex-wrap">
                <DoodleBrokenHeart size={18} />
                <span>Hết sạch tim rồi! Ghi sổ 1 ly trà sữa trân châu đường đen nhé!</span>
              </span>
            )}
          </p>
        </div>

        {/* Rules Box */}
        <div className="mt-4 p-3.5 bg-[#FFFBEB] border-2 border-black shadow-neo-sm text-xs sm:text-sm text-gray-800 font-bold space-y-1.5">
          <p className="flex items-center gap-1.5 font-black text-amber-950">
            <DoodlePin size={16} />
            <span>Luật sinh tồn TOEIC:</span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Mỗi câu trả lời sai sẽ mất <strong>1 trái tim</strong>.</li>
            <li>Hết 3 tim sẽ bị nhắc khéo và trừ 1 ly trà sữa.</li>
            <li>Tim tự động hồi lại, hoặc bấm nút bên dưới để bơm đầy ngay!</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          {hearts < 3 ? (
            <button
              onClick={handleRefill}
              className="w-full py-3.5 px-4 bg-[#FFD6E5] hover:bg-pink-200 text-[#4A1026] border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Hồi đầy 3 tim ngay (Miễn phí)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-3 px-4 bg-neoGreen hover:bg-emerald-300 border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <DoodleStar size={18} /> Đã sẵn sàng học tiếp!
            </button>
          )}

          {hearts < 3 && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-2 text-xs font-bold text-gray-600 hover:text-black underline cursor-pointer"
            >
              Đóng lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
