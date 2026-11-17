export type RankTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'CHALLENGER';

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
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
  'CHALLENGER'
];

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  BRONZE: 0,
  SILVER: 150,
  GOLD: 400,
  PLATINUM: 800,
  DIAMOND: 1400,
  MASTER: 2300,
  CHALLENGER: 3500,
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
    nameVi: 'Bạc',
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
    nameVi: 'Vàng',
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
  MASTER: {
    tier: 'MASTER',
    nameVi: 'Tinh Anh',
    badge: 'TC',
    color: '#9333EA',
    bgLight: '#F3E8FF',
    borderColor: '#7E22CE',
    rankPointsThreshold: 2300,
    targetScore: 'Tinh anh: 2.300 điểm rank',
    description: 'Đỉnh cao phản xạ TOEIC: toàn diện cả 7 Part.',
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
    rankPointsThreshold: 3500,
    targetScore: 'Thách đấu: 3.500 điểm rank trở lên',
    description: 'Thử thách cao nhất: duy trì độ chính xác trên toàn bộ 7 Part.',
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
