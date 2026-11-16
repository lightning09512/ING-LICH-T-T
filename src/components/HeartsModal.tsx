import React, { useEffect } from 'react';
import { X, Heart, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

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
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-3">
            {[1, 2, 3].map(num => (
              <Heart
                key={num}
                className={`w-12 h-12 sm:w-14 sm:h-14 transition-all ${
                  num <= hearts
                    ? 'text-red-500 fill-red-500 animate-pulse scale-110 drop-shadow-md'
                    : 'text-gray-300 fill-gray-200 scale-90'
                }`}
              />
            ))}
          </div>

          <span className="text-xs uppercase font-black px-2.5 py-1 bg-neoPink text-white border-2 border-black rotate-[-2deg] shadow-neo-sm mt-1">
            ❤️ Mạng sống của {nickname}
          </span>

          <h2 className="text-3xl sm:text-4xl font-black font-heading mt-2">
            {hearts} / 3 Trái Tim
          </h2>

          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1 max-w-xs">
            {hearts === 3 ? (
              <span className="text-emerald-700 font-black">
                💖 Bạn đang đầy đủ 3 tim! Sẵn sàng chinh phục mọi câu hỏi.
              </span>
            ) : hearts > 0 ? (
              <span className="text-amber-800 font-bold">
                ⚠️ Bạn còn {hearts} tim! Cẩn thận làm sai kẻo bị trừ trà sữa nhé.
              </span>
            ) : (
              <span className="text-red-700 font-black">
                💀 HẾT TIM RỒI! Bị trừ ngay 1 ly trà sữa trân châu đường đen! 😂
              </span>
            )}
          </p>
        </div>

        {/* Rules Box */}
        <div className="mt-4 p-3.5 bg-yellow-50 border-2 border-black shadow-neo-sm text-xs sm:text-sm text-gray-800 font-bold space-y-1.5">
          <p className="flex items-center gap-1.5 font-black text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Luật sinh tồn TOEIC:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>Mỗi câu trả lời sai sẽ bị mất <strong>1 trái tim</strong>.</li>
            <li>Hết 3 tim sẽ bị cười vào mặt và trừ 1 ly trà sữa!</li>
            <li>Tim sẽ tự động hồi phục dần, hoặc bạn có thể hồi đầy tim ngay bên dưới!</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          {hearts < 3 ? (
            <button
              onClick={handleRefill}
              className="w-full py-3.5 px-4 bg-neoPink hover:bg-pink-400 text-white border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <RefreshCw className="w-5 h-5 animate-spinSlow" />
              <span>Hồi phục đầy 3 tim ngay (Miễn phí)</span>
            </button>
          ) : (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="w-full py-3 px-4 bg-neoGreen hover:bg-emerald-300 border-3 border-black shadow-neo font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4" /> Đã sẵn sàng chiến tiếp!
            </button>
          )}

          {hearts < 3 && (
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
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
