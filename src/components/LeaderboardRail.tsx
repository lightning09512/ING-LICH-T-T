import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Trophy, Users, X } from 'lucide-react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import { RankStanding, RankTier, RANK_ORDER, RANK_TIERS_CONFIG, RANK_THRESHOLDS } from '../types/ranked';
import { useLearningProgress } from '../contexts/ProgressContext';

type StandingDoc = {
  displayName?: string;
  photoURL?: string | null;
  rankTier?: string;
  rankLp?: number;
  rankPoints?: number;
  updatedAt?: { toMillis?: () => number } | number;
};

function normalizeTier(value: unknown): RankTier {
  return typeof value === 'string' && RANK_ORDER.includes(value as any) ? value as RankTier : 'BRONZE';
}

export const LeaderboardRail: React.FC = () => {
  const { user, progress, authLoading } = useLearningProgress();
  const [open, setOpen] = useState(false);
  const [standings, setStandings] = useState<RankStanding[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    if (!firestore) {
      setStatus('unavailable');
      return;
    }
    const q = query(collection(firestore, 'leaderboard'), orderBy('rankPoints', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, snapshot => {
      const rows = snapshot.docs.map(item => {
        const data = item.data() as StandingDoc;
        const points = Number(data.rankPoints ?? 0);
        const tier = normalizeTier(data.rankTier);
        const updatedAt = typeof data.updatedAt === 'number' ? data.updatedAt : data.updatedAt?.toMillis?.();
        return {
          uid: item.id,
          displayName: (data.displayName || 'Học viên').slice(0, 40),
          photoURL: data.photoURL || null,
          rankPoints: Number.isFinite(points) ? Math.max(0, points) : 0,
          tier,
          updatedAt,
        } satisfies RankStanding;
      });
      setStandings(rows);
      setStatus('ready');
    }, error => {
      console.warn('Leaderboard unavailable:', error.code || error.message);
      setStatus('unavailable');
    });
    return unsubscribe;
  }, []);

  const personal = useMemo<RankStanding | null>(() => {
    if (!user) return null;
    const currentPoints = Math.max(
      progress.rankCareerPoints ?? 0,
      RANK_THRESHOLDS[progress.rankTier || 'BRONZE'] + (progress.rankLp ?? 0),
    );
    return {
      uid: user.uid,
      displayName: user.displayName || user.email?.split('@')[0] || 'Bạn',
      photoURL: user.photoURL,
      rankPoints: currentPoints,
      tier: progress.rankTier || 'BRONZE',
    };
  }, [user, progress.rankTier, progress.rankLp, progress.rankCareerPoints]);

  const visibleStandings = useMemo(() => {
    const byUid = new Map(standings.map(row => [row.uid, row]));
    if (personal) byUid.set(personal.uid, personal);
    return [...byUid.values()].sort((a, b) => b.rankPoints - a.rankPoints || a.displayName.localeCompare(b.displayName)).slice(0, 50);
  }, [standings, personal]);

  const personalPosition = personal ? visibleStandings.findIndex(row => row.uid === personal.uid) + 1 : 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={open ? 'Đóng bảng xếp hạng' : 'Mở bảng xếp hạng'}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[60] flex items-center gap-2 border-2 border-black border-l-0 rounded-r-xl px-2.5 py-3 shadow-[3px_4px_0_#000] text-sm font-black transition-transform focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 ${open ? 'translate-x-[min(21rem,calc(100vw-3rem))]' : ''} bg-[#FFE66D]`}
      >
        {open ? <ChevronLeft className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
        {!open && <span className="[writing-mode:vertical-rl] rotate-180">Bảng xếp hạng</span>}
      </button>

      <aside
        aria-label="Bảng xếp hạng học tập"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[59] w-[min(21rem,calc(100vw-2.5rem))] max-h-[min(78vh,42rem)] overflow-hidden border-3 border-black bg-[#FFFDF8] shadow-[6px_7px_0_#000] transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-[105%]'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b-3 border-black bg-[#FFE66D] px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <h2 className="font-heading text-lg font-black">Bảng xếp hạng</h2>
              <p className="text-xs font-bold text-gray-700">Thi đua bằng điểm rank học tập</p>
            </div>
          </div>
          <button type="button" aria-label="Đóng bảng xếp hạng" onClick={() => setOpen(false)} className="rounded border-2 border-black bg-white p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><X className="h-4 w-4" /></button>
        </div>

        <div className="max-h-[calc(min(78vh,42rem)-6rem)] overflow-y-auto p-3">
          {authLoading ? <p className="p-4 text-center text-sm font-bold text-gray-600">Đang tải tài khoản…</p> : null}
          {!authLoading && !user ? <div className="border-2 border-dashed border-gray-400 bg-white p-4 text-center text-sm font-bold text-gray-700">Đăng nhập để lưu điểm và tham gia bảng xếp hạng. Bảng chỉ hiện nickname, không hiện email.</div> : null}
          {user && status === 'loading' ? <p className="p-4 text-center text-sm font-bold text-gray-600">Đang tải thứ hạng…</p> : null}
          {user && status === 'unavailable' ? <div className="border-2 border-amber-500 bg-amber-50 p-3 text-sm font-bold text-amber-900">Chưa thể tải bảng xếp hạng. Kiểm tra quyền Firestore cho collection <code>leaderboard</code>.</div> : null}
          {user && status === 'ready' && visibleStandings.length === 0 ? <p className="p-4 text-center text-sm font-bold text-gray-600">Chưa có người chơi. Hoàn thành một trận xếp hạng để bắt đầu!</p> : null}
          {user && status === 'ready' && visibleStandings.length > 0 ? (
            <>
              {personalPosition > 0 && <p className="mb-2 rounded border-2 border-black bg-cyan-50 px-3 py-2 text-sm font-black">Vị trí của bạn: #{personalPosition}</p>}
              <ol className="space-y-2">
                {visibleStandings.map((row, index) => {
                  const config = RANK_TIERS_CONFIG[row.tier];
                  const isSelf = row.uid === user.uid;
                  return (
                    <li key={row.uid} className={`flex items-center gap-2.5 border-2 border-black p-2 ${isSelf ? 'bg-cyan-50' : 'bg-white'}`}>
                      <span className="w-6 shrink-0 text-center text-sm font-black text-gray-600">{index + 1}</span>
                      {row.photoURL ? <img src={row.photoURL} alt="" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-full border-2 border-black object-cover" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-gray-100 font-black">{row.displayName.charAt(0).toUpperCase()}</span>}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black">{row.displayName}{isSelf ? ' (Bạn)' : ''}</p>
                        <p className="text-xs font-bold text-gray-600">{config?.nameVi || 'Đồng'} · {row.rankPoints.toLocaleString('vi-VN')} điểm</p>
                      </div>
                      <RankGlyph tier={row.tier} />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : null}
          <div className="mt-3 border-t-2 border-dashed border-gray-300 pt-3 text-[11px] leading-relaxed text-gray-600">Điểm rank là chỉ số thi đua trong ứng dụng, không phải điểm TOEIC. Dữ liệu công khai chỉ gồm nickname, ảnh đại diện, rank và điểm; email không được đưa vào bảng.</div>
        </div>
      </aside>
    </>
  );
};

export const RankGlyph: React.FC<{ tier: RankStanding['tier']; className?: string }> = ({ tier, className = '' }) => {
  const config = RANK_TIERS_CONFIG[tier];
  return (
    <span title={config.nameVi} aria-label={`Hạng ${config.nameVi}`} className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 64 64" role="img" className="h-full w-full drop-shadow-sm">
        <path d="M32 3 54 15v25L32 61 10 40V15z" fill={config.bgLight} stroke={config.borderColor} strokeWidth="4" />
        <path d="M32 10 47 19v18L32 51 17 37V19z" fill="white" fillOpacity=".78" stroke={config.color} strokeWidth="2" />
        <path d="M32 16 37 27 48 32 37 37 32 48 27 37 16 32 27 27z" fill={config.color} />
        <circle cx="32" cy="32" r="4" fill="white" />
      </svg>
    </span>
  );
};
