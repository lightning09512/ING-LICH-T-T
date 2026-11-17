import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, ArrowLeft, Volume2, Clock, CheckCircle2, XCircle, 
  Sparkles, AlertTriangle, ChevronRight, RotateCcw, Award, Shield, 
  HelpCircle, Play, Pause, ChevronLeft, Target, Flame, FileText
} from 'lucide-react';
import { useLearningProgress } from '../contexts/ProgressContext';
import { RankTier, RANK_TIERS_CONFIG, RankedQuestion, PromoSeries } from '../types/ranked';
import { generateRankedMatchQuestions } from '../utils/rankedQuestionGenerator';
import { sounds } from '../utils/soundEffects';
import { LolMatchFoundModal } from './LolMatchFoundModal';

interface RankedExamScreenProps {
  onBack: () => void;
  nickname: string;
}

export const RankedExamScreen: React.FC<RankedExamScreenProps> = ({ onBack, nickname }) => {
  const { 
    rankTier, 
    rankLp, 
    rankPromo, 
    rankWins, 
    rankWinStreak, 
    rankMatchesPlayed,
    saveRankMatchResult 
  } = useLearningProgress();

  const tierConfig = RANK_TIERS_CONFIG[rankTier] || RANK_TIERS_CONFIG.BRONZE;

  // Match state
  const [phase, setPhase] = useState<'LOBBY' | 'EXAM' | 'RESULT'>('LOBBY');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<RankedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeft, setTimeLeft] = useState(tierConfig.timeMinutes * 60);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showMatchFoundModal, setShowMatchFoundModal] = useState(false);
  const [declineToast, setDeclineToast] = useState<string | null>(null);

  // Result state
  const [matchResult, setMatchResult] = useState<{
    score: number;
    total: number;
    accuracy: number;
    isWin: boolean;
    lpChange: number;
    newTier: RankTier;
    newLp: number;
    promoSeries: PromoSeries | null;
    isPromoted: boolean;
  } | null>(null);

  // Audio timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new match: Pre-fetch questions & pop LoL Match Found dialog!
  const handleStartMatch = async () => {
    sounds.playClick();
    setLoadingQuestions(true);
    setDeclineToast(null);
    try {
      const generated = await generateRankedMatchQuestions(rankTier);
      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setTimeLeft(tierConfig.timeMinutes * 60);
      setShowReview(false);
      setMatchResult(null);
      // Trigger LoL Match Found Modal
      setShowMatchFoundModal(true);
    } catch (e) {
      console.error('Failed to generate match questions', e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAcceptMatch = () => {
    setShowMatchFoundModal(false);
    setPhase('EXAM');
  };

  const handleDeclineMatch = () => {
    setShowMatchFoundModal(false);
    setDeclineToast("Bạn đã từ chối trận đấu hoặc quá giờ! Hãy chuẩn bị tâm lý rồi bấm tìm trận lại nhé Mập địch! ⚔️");
    setTimeout(() => setDeclineToast(null), 6000);
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== 'EXAM') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmitMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Stop speaking when question changes
  useEffect(() => {
    sounds.stopSpeaking();
    setIsPlayingAudio(false);
  }, [currentIndex]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (label: 'A' | 'B' | 'C' | 'D') => {
    sounds.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: label
    }));
  };

  const handlePlayScript = (text: string) => {
    if (isPlayingAudio) {
      sounds.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      sounds.speakEnglish(text).finally(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSubmitMatch = () => {
    sounds.stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const total = questions.length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const isWin = accuracy >= 70; // 70%+ is a WIN!

    if (isWin) {
      sounds.playVictory();
    } else {
      sounds.playWrong();
    }

    const saved = saveRankMatchResult({
      tier: rankTier,
      score,
      total,
      accuracy,
      isWin
    });

    setMatchResult({
      score,
      total,
      accuracy,
      isWin,
      lpChange: saved.lpChange,
      newTier: saved.newTier,
      newLp: saved.newLp,
      promoSeries: saved.promoSeries,
      isPromoted: saved.isPromoted
    });

    setPhase('RESULT');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  // Breakdown by Part for results
  const partStats = useMemo(() => {
    if (!questions.length) return {};
    const stats: Record<number, { total: number; correct: number }> = {};
    questions.forEach((q, idx) => {
      if (!stats[q.part]) stats[q.part] = { total: 0, correct: 0 };
      stats[q.part].total++;
      if (selectedAnswers[idx] === q.correctAnswer) {
        stats[q.part].correct++;
      }
    });
    return stats;
  }, [questions, selectedAnswers]);

  // ==========================================
  // RENDER: LOBBY SCREEN
  // ==========================================
  if (phase === 'LOBBY') {
    return (
      <div className="min-h-screen bg-[#FFFDF8] p-4 sm:p-6 max-w-4xl mx-auto flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                sounds.playClick();
                onBack();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black shadow-neo font-black text-sm hover:translate-x-1 transition-transform cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </button>

            <div className="flex items-center gap-2 bg-[#FFF3C4] border-3 border-black px-3 py-1.5 shadow-neo">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-black text-sm">Chuỗi {rankWinStreak} trận</span>
            </div>
          </div>

          {/* Banner Leo Rank */}
          <div 
            className="border-4 border-black p-6 sm:p-8 shadow-neo-lg mb-6 relative overflow-hidden"
            style={{ backgroundColor: tierConfig.bgLight }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              {/* Badge Rank lớn */}
              <div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-black shadow-neo flex flex-col items-center justify-center text-5xl sm:text-6xl bg-white flex-shrink-0 animate-bounce"
                style={{ animationDuration: '3s' }}
              >
                <span>{tierConfig.badge}</span>
              </div>

              {/* Thông tin Rank */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider mb-2">
                  Đấu Xếp Hạng TOEIC
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-1">
                  {tierConfig.nameVi}
                </h1>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  {tierConfig.description}
                </p>

                {/* LP Bar hoặc Promo Series */}
                {rankPromo && rankPromo.active ? (
                  <div className="bg-white border-3 border-black p-3 shadow-neo inline-block w-full max-w-md">
                    <div className="flex items-center justify-between text-xs font-black mb-1">
                      <span className="text-amber-700">CHUỖI THĂNG HẠNG (BO3)</span>
                      <span>Thắng 2 để lên {RANK_TIERS_CONFIG[rankPromo.targetTier]?.nameVi}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {[0, 1, 2].map(idx => {
                        const isWinMatch = idx < rankPromo.wins;
                        const isLossMatch = idx >= rankPromo.wins && idx < (rankPromo.wins + rankPromo.losses);
                        return (
                          <div 
                            key={idx}
                            className={`flex-1 h-6 border-2 border-black flex items-center justify-center font-black text-xs ${
                              isWinMatch ? 'bg-emerald-400 text-black' : isLossMatch ? 'bg-rose-400 text-black' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isWinMatch ? 'THẮNG' : isLossMatch ? 'THUA' : `Trận ${idx + 1}`}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border-3 border-black p-3 shadow-neo max-w-md">
                    <div className="flex justify-between text-xs font-black mb-1.5">
                      <span>Điểm LP hiện tại</span>
                      <span className="text-amber-600 font-extrabold">{rankLp} / 100 LP</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 border-2 border-black overflow-hidden relative">
                      <div 
                        className="h-full bg-amber-400 border-r-2 border-black transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, rankLp))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quy tắc trận đấu của bậc Rank hiện tại */}
          <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-neo mb-6">
            <h2 className="text-lg font-black text-black mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Thể Thức Thi Đấu: {tierConfig.nameVi}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="border-2 border-black p-3 bg-amber-50">
                <span className="text-xs font-bold text-gray-500 block">Số lượng câu</span>
                <span className="text-xl font-black text-black">{tierConfig.questionCount} câu</span>
              </div>
              <div className="border-2 border-black p-3 bg-blue-50">
                <span className="text-xs font-bold text-gray-500 block">Thời gian</span>
                <span className="text-xl font-black text-black">{tierConfig.timeMinutes} phút</span>
              </div>
              <div className="border-2 border-black p-3 bg-indigo-50">
                <span className="text-xs font-bold text-gray-500 block">Phần thi</span>
                <span className="text-xl font-black text-indigo-700">Part {tierConfig.requiredParts.join(', ')}</span>
              </div>
              <div className="border-2 border-black p-3 bg-emerald-50">
                <span className="text-xs font-bold text-gray-500 block">Chuẩn đạt</span>
                <span className="text-xl font-black text-emerald-700">≥ 70%</span>
              </div>
            </div>

            <div className="text-xs font-bold text-gray-600 space-y-1.5">
              <p>• <strong>Điều kiện THẮNG TRẬN:</strong> Đạt độ chính xác từ <strong>70% trở lên</strong> để nhận điểm LP thăng hạng.</p>
              <p>• <strong>Chuỗi Thăng Hạng:</strong> Đạt đủ 100 LP sẽ mở chuỗi Bo3 (thắng 2/3 trận để lên bậc Rank tiếp theo).</p>
            </div>
          </div>
        </div>

        {/* Thông báo từ chối trận nếu có */}
        {declineToast && (
          <div className="mb-4 p-3 bg-rose-100 border-3 border-black font-black text-xs sm:text-sm text-rose-800 shadow-neo-sm animate-bounce flex items-center gap-2">
            <span>⚠️</span>
            <span>{declineToast}</span>
          </div>
        )}

        {/* Nút Vào Trận */}
        <div className="pt-4">
          <button
            onClick={handleStartMatch}
            disabled={loadingQuestions}
            className="w-full py-4 bg-[#FFE500] border-4 border-black shadow-neo-lg text-lg sm:text-xl font-black text-black hover:-translate-y-1 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {loadingQuestions ? (
              <span>Đang tìm kiếm đối thủ & đề thi...</span>
            ) : (
              <>
                <Trophy className="w-6 h-6 text-black" />
                <span>BẮT ĐẦU TRẬN ĐẤU XẾP HẠNG</span>
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Modal MATCH FOUND phong cách League of Legends Hextech */}
        <LolMatchFoundModal
          isOpen={showMatchFoundModal}
          tierName={tierConfig.nameVi}
          nickname={nickname}
          onAccept={handleAcceptMatch}
          onDecline={handleDeclineMatch}
        />
      </div>
    );
  }

  // ==========================================
  // RENDER: EXAM SCREEN (ĐANG LÀM BÀI)
  // ==========================================
  if (phase === 'EXAM') {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white border-b-4 border-black px-4 py-3 shadow-neo">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Nút bỏ cuộc */}
            <button
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border-2 border-black font-black text-xs hover:bg-gray-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Bỏ cuộc
            </button>

            {/* Rank badge + Question counter */}
            <div className="flex items-center gap-3">
              <span className="text-xl">{tierConfig.badge}</span>
              <span className="font-black text-sm">
                Câu {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold text-gray-500">
                (Part {currentQ?.part})
              </span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-black text-sm ${
              timeLeft < 120 ? 'bg-rose-200 text-rose-800 animate-pulse' : 'bg-amber-100 text-black'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Question Body */}
        <div className="max-w-3xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">
          {currentQ && (
            <div className="bg-white border-4 border-black p-5 sm:p-7 shadow-neo-lg flex-1 flex flex-col justify-between">
              <div>
                {/* Part Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-200">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1">
                    Part {currentQ.part} • {currentQ.direction}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {currentQ.testOrigin}
                  </span>
                </div>

                {/* Part 1: Photograph Image */}
                {currentQ.imageUrl && currentQ.part === 1 && (
                  <div className="mb-5 flex flex-col items-center">
                    <div className="border-3 border-black shadow-neo overflow-hidden max-h-72 max-w-md bg-gray-50 flex items-center justify-center min-h-[160px]">
                      <img 
                        src={currentQ.imageUrl} 
                        alt="TOEIC Part 1 Photograph" 
                        className="w-full h-auto object-contain max-h-72"
                        loading="eager"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallbackNum = ((currentIndex % 24) + 1).toString().padStart(2, '0');
                          const fallbackSrc = `/images/part1/p1_${fallbackNum}.jpg`;
                          if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
                            target.src = fallbackSrc;
                          }
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 mt-1.5 flex items-center gap-1">
                      📷 Quan sát bức tranh và nghe 4 phương án mô tả để chọn đáp án đúng
                    </span>
                  </div>
                )}

                {/* Part 3 / 4 Graphic Diagram */}
                {currentQ.imageUrl && currentQ.part !== 1 && (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="border-3 border-black shadow-neo overflow-hidden max-h-64 max-w-sm bg-gray-50">
                      <img 
                        src={currentQ.imageUrl} 
                        alt="Graphic Diagram" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Audio Controls for Listening Parts */}
                {(currentQ.part === 1 || currentQ.part === 2) && currentQ.audioScript && (
                  <div className="mb-5 bg-amber-50 border-3 border-black p-3.5 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-amber-700 flex-shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-black text-black block">
                          {currentQ.part === 1 ? 'Nghe 4 câu mô tả bức tranh (A, B, C, D):' : 'Nghe câu hỏi và 3 câu trả lời (A, B, C):'}
                        </span>
                        <span className="text-[11px] text-gray-600 font-bold">
                          {currentQ.part === 1 
                            ? 'Chuẩn TOEIC ETS: Đề thi không in câu mô tả — hãy tập trung nghe' 
                            : 'Chuẩn TOEIC ETS: Đề thi không in câu hỏi & phương án — lắng nghe và chọn'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayScript(currentQ.audioScript!)}
                      className="px-4 py-2 bg-[#FFE500] border-2 border-black font-black text-xs shadow-neo hover:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4 fill-black" /> Dừng phát
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-black" /> Phát âm thanh
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Part 6 & 7: Reading Passage Text */}
                {currentQ.passageText && (
                  <div className="mb-5 bg-gray-50 border-3 border-black p-4 shadow-neo">
                    <div className="text-xs font-black uppercase text-indigo-700 mb-2 flex items-center gap-1.5 pb-1 border-b border-gray-300">
                      <FileText className="w-4 h-4" /> Đoạn Văn Đọc Hiểu (Reading Passage)
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line text-gray-800 pr-2">
                      {currentQ.passageText}
                    </div>
                  </div>
                )}

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-black text-black mb-5 leading-snug">
                  {currentQ.questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map(opt => {
                    const isSelected = selectedAnswers[currentIndex] === opt.label;
                    const isAudioOnly = currentQ.part === 1 || currentQ.part === 2;
                    // Chuẩn đề thi TOEIC: Part 1 & 2 chỉ hiển thị ký tự chọn A, B, C, D
                    const optionDisplayText = isAudioOnly ? `Phương án (${opt.label})` : opt.text;

                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectOption(opt.label)}
                        className={`w-full text-left p-3.5 sm:p-4 border-3 border-black font-bold text-sm sm:text-base flex items-center gap-3.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#FFE500] shadow-neo translate-x-1' 
                            : 'bg-white hover:bg-amber-50'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          isSelected ? 'bg-black text-white' : 'bg-gray-100 text-black'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="flex-1 leading-normal text-black font-extrabold">
                          {optionDisplayText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav: Prev / Next / Submit */}
              <div className="pt-4 border-t-2 border-gray-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 border-2 border-black font-black text-xs sm:text-sm bg-white hover:bg-gray-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Câu trước
                </button>

                <div className="text-xs font-bold text-gray-500">
                  Đã trả lời {answeredCount} / {questions.length}
                </div>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 border-2 border-black font-black text-xs sm:text-sm bg-[#FFE500] shadow-neo hover:translate-x-0.5 cursor-pointer flex items-center gap-1"
                  >
                    Câu tiếp <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitMatch}
                    className="px-5 py-2 border-3 border-black font-black text-xs sm:text-sm bg-emerald-400 shadow-neo hover:translate-x-0.5 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> NỘP BÀI
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal xác nhận thoát trận */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-6 shadow-neo-lg max-w-sm w-full">
              <div className="flex items-center gap-2 text-rose-600 font-black text-lg mb-2">
                <AlertTriangle className="w-6 h-6" /> Xác nhận rời trận
              </div>
              <p className="text-sm font-bold text-gray-700 mb-5">
                Nếu rời trận ngay bây giờ, trận đấu sẽ bị tính là một trận <strong>THUA</strong> và bạn sẽ bị trừ điểm LP!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 bg-gray-100 border-2 border-black font-black text-sm cursor-pointer hover:bg-gray-200"
                >
                  Ở lại làm bài
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    handleSubmitMatch();
                  }}
                  className="flex-1 py-2.5 bg-rose-500 text-white border-2 border-black font-black text-sm cursor-pointer hover:bg-rose-600"
                >
                  Xác nhận rời
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER: RESULT SCREEN (KẾT QUẢ TRẬN ĐẤU)
  // ==========================================
  if (phase === 'RESULT' && matchResult) {
    const isWin = matchResult.isWin;
    const isPromoted = matchResult.isPromoted;

    return (
      <div className="min-h-screen bg-[#FFFDF8] p-4 sm:p-6 max-w-3xl mx-auto flex flex-col justify-between">
        <div>
          {/* Header Banner Victory / Defeat */}
          <div className={`border-4 border-black p-6 sm:p-8 shadow-neo-lg mb-6 text-center ${
            isWin ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
          }`}>
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider mb-2">
              KẾT QUẢ TRẬN ĐẤU XẾP HẠNG
            </div>
            
            <h1 className={`text-4xl sm:text-5xl font-black mb-2 tracking-tight ${
              isWin ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {isPromoted 
                ? '🎉 THĂNG HẠNG THÀNH CÔNG!' 
                : isWin 
                ? '🏆 CHIẾN THẮNG (VICTORY)!' 
                : '💔 THẤT BẠI (DEFEAT)'}
            </h1>

            <p className="text-sm font-bold text-gray-700 mb-4">
              {isWin 
                ? 'Tuyệt vời! Bạn gái đã xuất sắc đạt độ chính xác từ 70% trở lên.' 
                : 'Chưa đủ 70% câu đúng. Hãy xem lại các câu sai để lấy lại phong độ nhé!'}
            </p>

            {/* LP Change Badge */}
            <div className="inline-flex items-center gap-3 bg-white border-3 border-black px-6 py-2.5 shadow-neo">
              <span className="text-xs font-black uppercase text-gray-500">Điểm Rank:</span>
              <span className={`text-2xl font-black ${
                matchResult.lpChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {matchResult.lpChange >= 0 ? `+${matchResult.lpChange}` : matchResult.lpChange} LP
              </span>
              <span className="text-xs font-bold text-gray-600">
                (Hiện tại: {matchResult.newLp} / 100 LP)
              </span>
            </div>
          </div>

          {/* Promo Series Notification if active */}
          {matchResult.promoSeries && matchResult.promoSeries.active && (
            <div className="bg-[#FEF3C7] border-4 border-black p-4 shadow-neo mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-amber-800 uppercase">CHUỖI THĂNG HẠNG BO3 ĐANG DIỄN RA</div>
                <div className="text-sm font-bold text-black">
                  Cần thắng 2 trận để lên {RANK_TIERS_CONFIG[matchResult.promoSeries.targetTier]?.nameVi}!
                </div>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(idx => {
                  const isW = idx < matchResult.promoSeries!.wins;
                  const isL = idx >= matchResult.promoSeries!.wins && idx < (matchResult.promoSeries!.wins + matchResult.promoSeries!.losses);
                  return (
                    <div 
                      key={idx}
                      className={`w-7 h-7 border-2 border-black flex items-center justify-center font-black text-xs ${
                        isW ? 'bg-emerald-400' : isL ? 'bg-rose-400' : 'bg-white'
                      }`}
                    >
                      {isW ? '✓' : isL ? '✗' : idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Match Score & Accuracy */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-white border-3 border-black p-4 shadow-neo text-center">
              <span className="text-xs font-bold text-gray-500 block">Số câu đúng</span>
              <span className="text-2xl font-black text-black">
                {matchResult.score} / {matchResult.total}
              </span>
            </div>
            <div className="bg-white border-3 border-black p-4 shadow-neo text-center">
              <span className="text-xs font-bold text-gray-500 block">Độ chính xác</span>
              <span className={`text-2xl font-black ${
                matchResult.accuracy >= 70 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {matchResult.accuracy}%
              </span>
            </div>
            <div className="bg-white border-3 border-black p-4 shadow-neo text-center col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-gray-500 block">Bậc xếp hạng</span>
              <span className="text-xl font-black text-black flex items-center justify-center gap-1.5 mt-0.5">
                <span>{RANK_TIERS_CONFIG[matchResult.newTier]?.badge}</span>
                <span>{RANK_TIERS_CONFIG[matchResult.newTier]?.nameVi}</span>
              </span>
            </div>
          </div>

          {/* Breakdown By Part */}
          <div className="bg-white border-3 border-black p-4 shadow-neo mb-6">
            <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-3">
              Thống kê kết quả từng Part
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(partStats).map(([partStr, stat]) => {
                const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                return (
                  <div key={partStr} className="border-2 border-black p-2.5 bg-gray-50 text-center">
                    <span className="text-xs font-bold text-gray-500 block">Part {partStr}</span>
                    <span className="text-sm font-black text-black">
                      {stat.correct}/{stat.total} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nút Xem lại lời giải chi tiết */}
          <div className="mb-6">
            <button
              onClick={() => setShowReview(prev => !prev)}
              className="w-full py-3 bg-white border-3 border-black shadow-neo font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>{showReview ? 'ẨN LỜI GIẢI CHI TIẾT' : 'XEM LẠI LỜI GIẢI TỪNG CÂU'}</span>
            </button>

            {/* Danh sách câu hỏi kèm lời giải chi tiết */}
            {showReview && (
              <div className="mt-5 space-y-5">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  const isAudioPart = q.part === 1 || q.part === 2;

                  return (
                    <div 
                      key={q.id}
                      className={`border-3 border-black p-4 sm:p-5 shadow-neo bg-white ${
                        isCorrect ? 'border-l-8 border-l-emerald-500' : 'border-l-8 border-l-rose-500'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base">
                            Câu {idx + 1} (Part {q.part})
                          </span>
                          <span className="text-xs font-bold text-gray-500">
                            • {q.testOrigin || 'TOEIC Bank'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2.5 py-1 border border-black ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isCorrect ? '✓ Đúng (+1)' : `✗ Sai (Bạn chọn: ${userAns || 'Bỏ trống'} | Đáp án đúng: ${q.correctAnswer})`}
                          </span>
                          {isAudioPart && q.audioScript && (
                            <button
                              onClick={() => sounds.speakEnglish(q.audioScript!)}
                              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 border border-black font-black text-xs flex items-center gap-1 cursor-pointer"
                              title="Nghe lại phát âm câu này"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Nghe lại
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Part 1 Photograph */}
                      {q.imageUrl && q.part === 1 && (
                        <div className="mb-3 max-h-56 max-w-sm mx-auto overflow-hidden border-2 border-black shadow-neo bg-gray-50 flex items-center justify-center">
                          <img 
                            src={q.imageUrl} 
                            alt="Photograph" 
                            className="w-full h-auto object-contain max-h-56 mx-auto" 
                            onError={(e) => {
                              const target = e.currentTarget;
                              const fallbackNum = ((idx % 24) + 1).toString().padStart(2, '0');
                              target.src = `/images/part1/p1_${fallbackNum}.jpg`;
                            }}
                          />
                        </div>
                      )}

                      {/* Part 6 / 7 Passage */}
                      {q.passageText && (
                        <div className="mb-3 bg-gray-50 border-2 border-gray-300 p-3 text-xs sm:text-sm font-medium leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line text-gray-800">
                          <div className="text-[11px] font-black uppercase text-indigo-700 mb-1 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Đoạn văn tham chiếu:
                          </div>
                          {q.passageText}
                        </div>
                      )}

                      {/* Part 2 Spoken Prompt */}
                      {q.part === 2 && q.spokenPrompt && (
                        <div className="mb-3 bg-indigo-50 border-2 border-indigo-300 p-3">
                          <div className="text-[11px] font-black uppercase text-indigo-700 mb-0.5">
                            🎧 Câu hỏi đã phát âm thanh:
                          </div>
                          <p className="text-sm font-bold text-black">
                            "{q.spokenPrompt}"
                          </p>
                          {q.spokenPromptVi && (
                            <p className="text-xs text-indigo-800 italic mt-0.5">
                              ({q.spokenPromptVi})
                            </p>
                          )}
                        </div>
                      )}

                      {/* Question Text */}
                      {q.part !== 2 && (
                        <p className="text-sm font-bold text-black mb-3">
                          {q.questionText}
                        </p>
                      )}

                      {/* Options List with Transcripts & Translations */}
                      <div className="space-y-2 mb-3">
                        {q.options.map(opt => {
                          const isCorrectOpt = opt.label === q.correctAnswer;
                          const isUserChoice = opt.label === userAns;
                          const optTextToDisplay = opt.transcriptText || opt.text;

                          return (
                            <div 
                              key={opt.label}
                              className={`p-2.5 border-2 text-xs sm:text-sm flex flex-col gap-0.5 ${
                                isCorrectOpt 
                                  ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950' 
                                  : isUserChoice 
                                  ? 'bg-rose-50 border-rose-400 font-bold text-rose-950' 
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-black text-[11px] flex-shrink-0 ${
                                  isCorrectOpt ? 'bg-emerald-600 text-white border-emerald-700' : isUserChoice ? 'bg-rose-600 text-white border-rose-700' : 'bg-gray-100 text-black border-gray-400'
                                }`}>
                                  {opt.label}
                                </span>
                                <span className="flex-1 font-bold">
                                  {optTextToDisplay}
                                </span>
                                {isCorrectOpt && (
                                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                                    ĐÁP ÁN ĐÚNG
                                  </span>
                                )}
                                {isUserChoice && !isCorrectOpt && (
                                  <span className="text-[11px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 border border-rose-300">
                                    BẠN ĐÃ CHỌN
                                  </span>
                                )}
                              </div>
                              {opt.vietnamese && (
                                <div className="pl-7 text-xs text-gray-500 italic">
                                  ↳ {opt.vietnamese}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="bg-amber-50 border-2 border-amber-300 p-3 text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
                        <strong className="font-black text-amber-900 block mb-0.5">💡 Giải thích chi tiết:</strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setPhase('LOBBY');
            }}
            className="flex-1 py-3.5 bg-white border-3 border-black shadow-neo font-black text-sm hover:bg-gray-50 cursor-pointer"
          >
            Về Sảnh Xếp Hạng
          </button>

          <button
            onClick={handleStartMatch}
            className="flex-1 py-3.5 bg-[#FFE500] border-3 border-black shadow-neo font-black text-sm hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ĐẤU TIẾP TRẬN MỚI</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
