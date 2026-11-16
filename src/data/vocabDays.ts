import vocabDaysJson from './quizletVocabDays.json';

export interface VocabWord {
  id: number;
  word: string;
  meaning: string;
  ipa?: string;
}

export interface DayLesson {
  day: number;
  title: string;
  totalWords: number;
  words: VocabWord[];
}

export const allDaysData: { [key: string]: DayLesson } = vocabDaysJson as any;

export function getDayData(day: number): DayLesson | null {
  return allDaysData[`day_${day}`] || null;
}

// Get all words from Day 1 to Day N (Cumulative Spaced Repetition Pool)
export function getCumulativeWords(upToDay: number): VocabWord[] {
  const pool: VocabWord[] = [];
  for (let d = 1; d <= upToDay; d++) {
    const dayData = getDayData(d);
    if (dayData && dayData.words) {
      pool.push(...dayData.words);
    }
  }
  return pool;
}
