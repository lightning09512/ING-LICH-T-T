import swBank from './toeicSwAuthenticBank.json';

export interface SpeakingQuestion {
  id: string;
  study4TestId: number;
  study4QuestionId?: string;
  testId: string;
  testName: string;
  part: 1 | 2 | 3 | 4 | 5;
  partTitle: string;
  questionNumber: number; // 1 to 11
  directionsVi: string;
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  promptText: string;
  targetScript?: string; // Part 1 verbatim passage
  contextText?: string; // Part 3 & Part 4 scenario intro
  imageUrl?: string; // Part 2 local WebP picture
  cdnImageUrl?: string; // Part 2 Study4 CDN PNG fallback
  infoImageUrl?: string; // Part 4 local WebP schedule image
  cdnInfoImageUrl?: string; // Part 4 Study4 CDN PNG fallback
  infoHeaderText?: string; // Part 4 Test 1 header text
  tableData?: { [key: string]: string }[]; // Part 4 Test 1 schedule table
  infoFooterText?: string; // Part 4 Test 1 footer note
  scheduleTranscript?: string; // Exact schedule facts for AI grading rubric
  audioUrl?: string; // Verbatim Study4 MP3 audio question
  cdnAudioUrl?: string; // Study4 CDN MP3 fallback
  keywords?: string[];
  modelAnswer: string;
  tipsVi: string[];
}

export interface ToeicSpeakingTestMeta {
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

export interface ToeicSwTestCombo {
  id: string;
  testNumber: number;
  code: string;
  name: string;
  badge: string;
  difficulty: "Cơ Bản" | "Tiêu Chuẩn ETS" | "Nâng Cao";
  description: string;
  speakingTestId: string;
  writingTestId: string;
  speakingStudy4Id: number;
  writingStudy4Id: number;
}

export const TOEIC_SPEAKING_PARTS = [
  { id: 1, name: "Part 1: Đọc to đoạn văn", desc: "Read a text aloud (Câu 1 - 2)", icon: "📢" },
  { id: 2, name: "Part 2: Miêu tả bức tranh", desc: "Describe a picture (Câu 3 - 4)", icon: "🖼️" },
  { id: 3, name: "Part 3: Trả lời câu hỏi khảo sát", desc: "Respond to questions (Câu 5 - 7)", icon: "💬" },
  { id: 4, name: "Part 4: Trả lời theo thông tin/lịch trình", desc: "Respond using information provided (Câu 8 - 10)", icon: "📋" },
  { id: 5, name: "Part 5: Trình bày quan điểm cá nhân", desc: "Express an opinion (Câu 11)", icon: "💡" },
];

export const TOEIC_SPEAKING_TESTS: ToeicSpeakingTestMeta[] = swBank.speakingTests as ToeicSpeakingTestMeta[];
export const TOEIC_SW_TEST_COMBOS: ToeicSwTestCombo[] = swBank.combos as ToeicSwTestCombo[];
export const TOEIC_SPEAKING_QUESTIONS: SpeakingQuestion[] = swBank.speakingQuestions as SpeakingQuestion[];
