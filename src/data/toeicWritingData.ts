import swBank from './toeicSwAuthenticBank.json';

export interface WritingQuestion {
  id: string;
  study4TestId: number;
  study4QuestionId?: string;
  testId: string;
  testName: string;
  part: 1 | 2 | 3;
  partTitle: string;
  questionNumber: number; // 1 to 8
  directionsVi: string;
  timeLimitMinutes: number;
  promptText: string;
  imageUrl?: string; // Part 1 local WebP
  cdnImageUrl?: string; // Part 1 Study4 CDN PNG fallback
  keywords?: string[]; // Exact 2 Study4 prompt words
  emailContext?: {
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
    directions?: string;
    requirementsVi: string[];
  };
  essayPrompt?: {
    topic: string;
    background: string;
    recommendedWords: number;
  };
  modelAnswer: string;
  templateVi?: string;
  tipsVi: string[];
}

export interface ToeicWritingTestMeta {
  id: string;
  study4Id: number;
  study4Url: string;
  code: string;
  name: string;
  durationMinutes: number;
  partsCount: number;
  questionsCount: number;
  desc: string;
  badge: string;
}

export const TOEIC_WRITING_PARTS = [
  { id: 1, name: "Part 1: Viết câu theo tranh", desc: "Write a sentence based on a picture (Câu 1 - 5 • 8 phút)", icon: "🖼️" },
  { id: 2, name: "Part 2: Phản hồi Email công sở", desc: "Respond to a written request (Câu 6 - 7 • 20 phút)", icon: "✉️" },
  { id: 3, name: "Part 3: Viết luận trình bày quan điểm", desc: "Write an opinion essay (Câu 8 • 30 phút)", icon: "📝" },
];

export const TOEIC_WRITING_TESTS: ToeicWritingTestMeta[] = swBank.writingTests as ToeicWritingTestMeta[];
export const TOEIC_WRITING_QUESTIONS: WritingQuestion[] = swBank.writingQuestions as WritingQuestion[];
