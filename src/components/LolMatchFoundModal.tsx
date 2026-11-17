import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { Check } from 'lucide-react';

interface LolMatchFoundModalProps {
  isOpen: boolean;
  tierName: string;
  nickname: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const LolMatchFoundModal: React.FC<LolMatchFoundModalProps> = ({
  isOpen,
  tierName,
  nickname,
  onAccept,
  onDecline
}) => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isAccepted, setIsAccepted] = useState(false);
  // 10 players status: true = accepted, false = pending
  // Start with other players accepted (slots 1-9), slot 0 is the current player
  const [playerSlots, setPlayerSlots] = useState<boolean[]>([false, true, true, true, true, true, true, true, true, true]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and play sound when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setSecondsLeft(10);
    setIsAccepted(false);
    setPlayerSlots([false, true, true, true, true, true, true, true, true, true]);

    // Play iconic League of Legends Match Found queue pop gong sound
    sounds.playLolMatchFound();

    // Start 10-second countdown (dùng sound gốc của file MP3, không phát tiếng bíp/tích nhân tạo)
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleDeclineOrTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sounds.stopLolAudio();
    };
  }, [isOpen]);

  const handleDeclineOrTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playLolDecline();
    onDecline();
  };

  const handleAcceptClick = () => {
    if (isAccepted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    sounds.playLolAccept();
    setIsAccepted(true);

    // Player slot turns accepted
    setPlayerSlots(prev => {
      const next = [...prev];
      next[0] = true;
      return next;
    });

    // Dramatic lock-in transition to exam after 1.2s
    setTimeout(() => {
      onAccept();
    }, 1200);
  };

  if (!isOpen) return null;

  // Calculate SVG circular stroke progress (10 seconds)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / 10) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Outer Hextech Frame - Chuẩn tỷ lệ Client LMHT */}
      <div className="relative w-full max-w-lg bg-[#010a13] border-2 border-[#785a28] shadow-[0_0_60px_rgba(1,134,153,0.4)] overflow-hidden">
        
        {/* Inner Gold Border & Corner Ornaments */}
        <div className="absolute inset-1.5 border border-[#c8aa6e]/60 pointer-events-none" />
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#f0e6d2] pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-b from-[#08abac]/25 to-transparent blur-xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Main Title - Chuẩn nguyên bản LMHT */}
          <h2 className="text-2xl sm:text-3xl font-black text-[#f0e6d2] tracking-wider uppercase hextech-font drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-1">
            Trận Đấu Đã Tìm Thấy!
          </h2>
          <p className="text-xs text-[#a09b8c] tracking-widest uppercase mt-1 mb-6 font-semibold">
            {isAccepted ? "ĐÃ CHẤP NHẬN • ĐANG TIẾN VÀO TRẬN..." : "TRẬN ĐẤU CỦA BẠN ĐÃ SẴN SÀNG"}
          </p>

          {/* Center Stage: Bản đồ Summoner's Rift nguyên bản + Vòng tròn đếm ngược */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
            
            {/* SVG Countdown Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#1e2328]"
                strokeWidth="5"
                fill="none"
              />
              {/* Active animated stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`transition-all duration-1000 ease-linear ${
                  isAccepted ? 'stroke-emerald-400' : secondsLeft <= 3 ? 'stroke-rose-500 animate-pulse' : 'stroke-[#08abac]'
                }`}
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Circular Summoner's Rift Map Frame - Bản Gốc LMHT */}
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 overflow-hidden transition-all duration-300 ${
              isAccepted 
                ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.8)] scale-105' 
                : 'border-[#c8aa6e] shadow-[0_0_20px_rgba(8,171,172,0.4)]'
            }`}>
              {/* Bản đồ Summoner's Rift nguyên bản */}
              <img
                src="/img/map_summoners_rift.png"
                alt="Summoner's Rift"
                className="w-full h-full object-cover scale-110"
              />

              {/* Dark vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

              {/* Accepted Check Overlay */}
              {isAccepted && (
                <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center animate-fadeIn">
                  <Check className="w-14 h-14 text-emerald-400 drop-shadow-lg stroke-[3]" />
                </div>
              )}
            </div>

            {/* Floating Timer Badge */}
            {!isAccepted && (
              <div className={`absolute -bottom-2.5 bg-[#010a13] border-2 px-3 py-0.5 rounded-full font-black text-xs font-mono tracking-wider shadow-lg ${
                secondsLeft <= 3 ? 'border-rose-500 text-rose-400 animate-bounce' : 'border-[#c8aa6e] text-[#f0e6d2]'
              }`}>
                0:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </div>
            )}
          </div>

          {/* 10 Player Acceptance Indicator Slots (5 vs 5) - Chuẩn bản gốc LMHT */}
          <div className="w-full max-w-xs mb-8">
            <div className="text-[10px] text-[#a09b8c] font-bold uppercase tracking-widest mb-2.5 flex items-center justify-between px-1">
              <span>Đội Xanh</span>
              <span>Đội Đỏ</span>
            </div>
            <div className="flex items-center justify-between gap-1.5 px-2">
              {playerSlots.map((accepted, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    accepted
                      ? 'border-emerald-400 bg-emerald-900/80 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.7)] scale-105'
                      : idx === 0 && !isAccepted
                      ? 'border-[#08abac] bg-[#0a1428] animate-pulse shadow-[0_0_10px_rgba(8,171,172,0.8)]'
                      : 'border-[#785a28]/60 bg-[#091428] text-gray-500'
                  }`}
                >
                  {accepted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-[#a09b8c] rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: CHẤP NHẬN & TỪ CHỐI */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            
            {/* Hextech Primary ACCEPT Button */}
            <button
              onClick={handleAcceptClick}
              disabled={isAccepted}
              className={`w-full sm:w-auto min-w-[210px] px-9 py-3.5 font-bold uppercase text-base sm:text-lg transition-all active:scale-95 cursor-pointer ${
                isAccepted
                  ? 'bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.9)]'
                  : 'hextech-button hover:text-white'
              }`}
            >
              {isAccepted ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 stroke-[3]" /> ĐÃ CHẤP NHẬN
                </span>
              ) : (
                <span>CHẤP NHẬN</span>
              )}
            </button>

            {/* Hextech Secondary DECLINE Button */}
            {!isAccepted && (
              <button
                onClick={handleDeclineOrTimeout}
                className="w-full sm:w-auto px-7 py-3.5 hextech-button-secondary font-bold uppercase text-sm sm:text-base active:scale-95 cursor-pointer"
              >
                TỪ CHỐI
              </button>
            )}

          </div>

          {/* Footer Sub-note */}
          <div className="mt-5 text-[11px] text-[#785a28] tracking-widest uppercase font-semibold">
            LEAGUE OF LEGENDS • HEXTECH UI
          </div>

        </div>

      </div>
    </div>
  );
};
