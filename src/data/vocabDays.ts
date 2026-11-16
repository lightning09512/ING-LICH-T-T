import vocabDaysJson from './quizletVocabDays.json';
import vocabDaysV2Json from './quizletVocabDaysV2.json';

export interface VocabWord {
  id: number;
  word: string;
  meaning: string;
  ipa?: string;
  imageUrl?: string;
  exampleEn?: string;
  exampleVi?: string;
  partOfSpeech?: string;
}

export interface DayLesson {
  day: number;
  title: string;
  totalWords: number;
  words: VocabWord[];
}

export const allDaysData: { [key: string]: DayLesson } = vocabDaysJson as any;
export const allDaysDataV2: { [key: string]: DayLesson } = vocabDaysV2Json as any;

export function getDayData(day: number, chapter: 1 | 2 = 1): DayLesson | null {
  const data = chapter === 2 ? allDaysDataV2 : allDaysData;
  return data[`day_${day}`] || null;
}

// Get all words from Day 1 to Day N (Cumulative Spaced Repetition Pool)
// Hoàn toàn tách biệt giữa Chương 1 và Chương 2 - KHÔNG kiểm tra chung!
export function getCumulativeWords(upToDay: number, chapter: 1 | 2 = 1): VocabWord[] {
  const pool: VocabWord[] = [];
  for (let d = 1; d <= upToDay; d++) {
    const dayData = getDayData(d, chapter);
    if (dayData && dayData.words) {
      pool.push(...dayData.words);
    }
  }
  return pool;
}
