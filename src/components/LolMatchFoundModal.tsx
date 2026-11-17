import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { Check, ShieldAlert, Sparkles, Swords, User } from 'lucide-react';

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
  // Start with 7 accepted, then rapidly fill up to 9, leaving player's slot (index 0) pending
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

    // Start 10-second countdown
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleDeclineOrTimeout();
          return 0;
        }
        sounds.playLolTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / 10) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Outer Hextech Frame */}
      <div className="relative w-full max-w-lg bg-[#010a13] border-2 border-[#785a28] shadow-[0_0_50px_rgba(1,134,153,0.35)] overflow-hidden">
        
        {/* Inner Gold Border & Corner Ornaments */}
        <div className="absolute inset-1.5 border border-[#c8aa6e]/60 pointer-events-none" />
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#f0e6d2] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#f0e6d2] pointer-events-none" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#08abac]/20 to-transparent blur-xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Header Tag */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#091428] border border-[#785a28] text-[#c8aa6e] text-[11px] font-bold uppercase tracking-widest mb-2 shadow-inner">
            <Swords className="w-3.5 h-3.5 text-[#f0e6d2]" />
            <span>Đấu Xếp Hạng TOEIC • {tierName}</span>
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-[#f0e6d2] tracking-wider uppercase hextech-font drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Trận Đấu Đã Tìm Thấy!
          </h2>
          <p className="text-xs text-[#a09b8c] tracking-widest uppercase mt-0.5 mb-6 font-semibold">
            {isAccepted ? "ĐÃ CHẤP NHẬN • ĐANG TIẾN VÀO ĐẤU TRƯỜNG..." : "XÁC NHẬN SẴN SÀNG THI ĐẤU (10/10)"}
          </p>

          {/* Circular Center Stage: Avatar + Countdown Ring */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-6">
            
            {/* SVG Countdown Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Background ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-[#1e2328]"
                strokeWidth="5"
                fill="none"
              />
              {/* Active animated stroke */}
              <circle
                cx="70"
                cy="70"
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

            {/* Avatar Summoner Emblem */}
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 p-1 overflow-hidden transition-all duration-300 ${
              isAccepted 
                ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)] scale-105' 
                : 'border-[#c8aa6e] shadow-[0_0_20px_rgba(8,171,172,0.4)]'
            }`}>
              <img
                src="/avatar.jpg"
                alt={nickname}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {/* Fallback Icon if avatar not loaded */}
              <div className="w-full h-full bg-[#0a1428] rounded-full flex items-center justify-center text-3xl">
                👸
              </div>

              {/* Accepted Check Overlay */}
              {isAccepted && (
                <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center animate-fadeIn">
                  <Check className="w-12 h-12 text-emerald-400 drop-shadow-md stroke-[3]" />
                </div>
              )}
            </div>

            {/* Floating Timer Badge */}
            {!isAccepted && (
              <div className={`absolute -bottom-2 bg-[#010a13] border-2 px-3 py-0.5 rounded-full font-black text-xs font-mono tracking-wider shadow-lg ${
                secondsLeft <= 3 ? 'border-rose-500 text-rose-400 animate-bounce' : 'border-[#c8aa6e] text-[#f0e6d2]'
              }`}>
                0:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </div>
            )}
          </div>

          {/* Summoner Name & Role */}
          <div className="mb-5">
            <span className="text-[#f0e6d2] font-black text-base uppercase tracking-wider block">
              {nickname}
            </span>
            <span className="text-[#c8aa6e] text-xs font-bold tracking-wide">
              ⚔️ ĐƯỜNG GIỮA (MID LANE) • CHỦ TỊCH NÓC NHÀ
            </span>
          </div>

          {/* 10 Player Acceptance Indicator Slots (5 vs 5) */}
          <div className="w-full max-w-xs mb-7">
            <div className="text-[10px] text-[#a09b8c] font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Đội Xanh (5)</span>
              <span>Đội Đỏ (5)</span>
            </div>
            <div className="flex items-center justify-between gap-1.5 px-2">
              {playerSlots.map((accepted, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    accepted
                      ? 'border-emerald-400 bg-emerald-900/80 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.6)] scale-105'
                      : idx === 0 && !isAccepted
                      ? 'border-[#08abac] bg-[#0a1428] animate-pulse shadow-[0_0_10px_rgba(8,171,172,0.8)]'
                      : 'border-[#785a28]/60 bg-[#091428] text-gray-500'
                  }`}
                  title={idx === 0 ? nickname : `Người chơi #${idx + 1}`}
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

          {/* Action Buttons: ACCEPT & DECLINE */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            
            {/* Hextech Primary ACCEPT Button */}
            <button
              onClick={handleAcceptClick}
              disabled={isAccepted}
              className={`w-full sm:w-auto min-w-[200px] px-8 py-3.5 font-bold uppercase text-base sm:text-lg transition-all active:scale-95 cursor-pointer ${
                isAccepted
                  ? 'bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                  : 'hextech-button hover:text-white'
              }`}
            >
              {isAccepted ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 stroke-[3]" /> ĐÃ CHẤP NHẬN
                </span>
              ) : (
                <span>CHẤP NHẬN ({secondsLeft}s)</span>
              )}
            </button>

            {/* Hextech Secondary DECLINE Button */}
            {!isAccepted && (
              <button
                onClick={handleDeclineOrTimeout}
                className="w-full sm:w-auto px-6 py-3.5 hextech-button-secondary font-bold uppercase text-sm sm:text-base active:scale-95 cursor-pointer"
              >
                TỪ CHỐI
              </button>
            )}

          </div>

          {/* Footer Sub-note */}
          <div className="mt-4 text-[11px] text-[#785a28] tracking-wider uppercase font-semibold">
            LEAGUE OF LEGENDS • HEXTECH UI MATCHMAKING
          </div>

        </div>

      </div>
    </div>
  );
};
