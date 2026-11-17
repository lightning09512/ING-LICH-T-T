export type RankTier = 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';

export interface RankTierInfo {
  tier: RankTier;
  nameVi: string;
  badge: string;
  color: string;
  bgLight: string;
  borderColor: string;
  rankPointsThreshold: number;
  targetScore: string;
  description: string;
  requiredParts: number[];
  questionCount: number;
  timeMinutes: number;
}

export const RANK_ORDER: RankTier[] = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER'
];

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  IRON: 0,
  BRONZE: 100,
  SILVER: 250,
  GOLD: 500,
  PLATINUM: 850,
  DIAMOND: 1300,
  MASTER: 1900,
  GRANDMASTER: 2700,
  CHALLENGER: 3600,
};

export interface RankStanding {
  uid: string;
  displayName: string;
  photoURL: string | null;
  rankPoints: number;
  tier: RankTier;
  updatedAt?: number;
}

export function getRankTier(points: number): RankTier {
  const safePoints = Math.max(0, Number.isFinite(points) ? points : 0);
  for (let index = RANK_ORDER.length - 1; index >= 0; index -= 1) {
    const tier = RANK_ORDER[index];
    if (safePoints >= RANK_THRESHOLDS[tier]) return tier;
  }
  return 'BRONZE';
}

export function getPointsToNextRank(points: number): number | null {
  const safePoints = Math.max(0, Number.isFinite(points) ? points : 0);
  const nextTier = RANK_ORDER.find(tier => RANK_THRESHOLDS[tier] > safePoints);
  return nextTier ? RANK_THRESHOLDS[nextTier] - safePoints : null;
}

export const RANK_TIERS_CONFIG: Record<RankTier, RankTierInfo> = {
  IRON: {
    tier: 'IRON',
    nameVi: 'Sắt',
    badge: 'S',
    color: '#75808A',
    bgLight: '#EEF1F3',
    borderColor: '#59636C',
    rankPointsThreshold: 0,
    targetScore: 'Sắt: khởi điểm',
    description: 'Bắt đầu hành trình luyện tập, xây nền tảng từ vựng và ngữ pháp.',
    requiredParts: [1, 2, 5], questionCount: 10, timeMinutes: 7,
  },
  BRONZE: {
    tier: 'BRONZE',
    nameVi: 'Đồng',
    badge: '🥉',
    color: '#D97706',
    bgLight: '#FEF3C7',
    borderColor: '#B45309',
    rankPointsThreshold: 0,
    targetScore: 'Đồng: 100 điểm rank',
    description: 'Nền tảng khởi động: Part 1, 2 và Part 5 căn bản.',
    requiredParts: [1, 2, 5],
    questionCount: 10,
    timeMinutes: 7,
  },
  SILVER: {
    tier: 'SILVER',
    nameVi: 'Bạc Đoàn',
    badge: '🥈',
    color: '#64748B',
    bgLight: '#F1F5F9',
    borderColor: '#475569',
    rankPointsThreshold: 150,
    targetScore: 'Bạc: 150 điểm rank',
    description: 'Củng cố phản xạ: Part 1, 2 tốc độ và Part 5 ngữ pháp tổng hợp.',
    requiredParts: [1, 2, 5],
    questionCount: 10,
    timeMinutes: 7,
  },
  GOLD: {
    tier: 'GOLD',
    nameVi: 'Vàng Đoàn',
    badge: '🥇',
    color: '#CA8A04',
    bgLight: '#FEF9C3',
    borderColor: '#A16207',
    rankPointsThreshold: 400,
    targetScore: 'Vàng: 400 điểm rank',
    description: 'Bứt phá trung cấp: Bổ sung Part 3 đối thoại & Part 6 điền đoạn văn.',
    requiredParts: [1, 2, 3, 5, 6],
    questionCount: 16,
    timeMinutes: 12,
  },
  PLATINUM: {
    tier: 'PLATINUM',
    nameVi: 'Bạch Kim',
    badge: '💎',
    color: '#0891B2',
    bgLight: '#CFFAFE',
    borderColor: '#0E7490',
    rankPointsThreshold: 800,
    targetScore: 'Bạch kim: 800 điểm rank',
    description: 'Chuyên nghiệp tốc độ: Part 1, 2, 3, 5, 6 với từ vựng bẫy cao cấp.',
    requiredParts: [1, 2, 3, 5, 6],
    questionCount: 16,
    timeMinutes: 12,
  },
  DIAMOND: {
    tier: 'DIAMOND',
    nameVi: 'Kim Cương',
    badge: '🔷',
    color: '#4F46E5',
    bgLight: '#E0E7FF',
    borderColor: '#3730A3',
    rankPointsThreshold: 1400,
    targetScore: 'Kim cương: 1.400 điểm rank',
    description: 'Đẳng cấp cao thủ: Đầy đủ 7 Part gồm Part 4 độc thoại và Part 7 đọc hiểu.',
    requiredParts: [1, 2, 3, 4, 5, 6, 7],
    questionCount: 22,
    timeMinutes: 18,
  },
  GRANDMASTER: {
    tier: 'GRANDMASTER',
    nameVi: 'Tinh Anh',
    badge: 'TA',
    color: '#B74BFF',
    bgLight: '#F7E8FF',
    borderColor: '#7F2CAA',
    rankPointsThreshold: 2700,
    targetScore: 'Tinh anh: 2.700 điểm rank',
    description: 'Luyện tập trình độ cao, duy trì độ chính xác qua nhiều phiên.',
    requiredParts: [1, 2, 3, 4, 5, 6, 7], questionCount: 22, timeMinutes: 18,
  },
  MASTER: {
    tier: 'MASTER',
    nameVi: 'Cao thủ',
    badge: '👑',
    color: '#9333EA',
    bgLight: '#F3E8FF',
    borderColor: '#7E22CE',
    rankPointsThreshold: 1900,
    targetScore: 'Cao thủ: 1.900 điểm rank',
    description: 'Đỉnh cao phản xạ TOEIC: Toàn diện 7 Part áp lực thời gian thực.',
    requiredParts: [1, 2, 3, 4, 5, 6, 7],
    questionCount: 22,
    timeMinutes: 18,
  },
  CHALLENGER: {
    tier: 'CHALLENGER',
    nameVi: 'Thách Đấu',
    badge: '🔥',
    color: '#DC2626',
    bgLight: '#FEE2E2',
    borderColor: '#B91C1C',
    rankPointsThreshold: 3600,
    targetScore: 'Thách đấu: 3.600 điểm rank trở lên',
    description: 'Bá chủ TOEIC: Bộ đề tối thượng chuẩn 100% ETS.',
    requiredParts: [1, 2, 3, 4, 5, 6, 7],
    questionCount: 22,
    timeMinutes: 18,
  }
};

export interface PromoSeries {
  active: boolean;
  wins: number;
  losses: number;
  targetTier: RankTier;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  tier: RankTier;
  score: number;
  total: number;
  accuracy: number;
  lpChange: number;
  isWin: boolean;
  isPromoMatch?: boolean;
}

export interface RankedQuestionOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface RankedQuestion {
  id: string;
  part: number; // 1..7
  direction: string;
  questionText: string;
  passageText?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioScript?: string; // Spoken script for speech synthesis
  options: RankedQuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  testOrigin?: string;
}
