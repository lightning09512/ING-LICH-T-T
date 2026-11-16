import { grammarTopics, fullTwelveTenses, wordOrderRules, GrammarExercise } from './grammarData';
import { extraPart5Questions } from './extraPart5Questions';
import p5JsonData from './toeicPart5Bank.json';

export interface GrammarBankQuestion {
  uniqueId: string;
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  translation: string;
  topicTitle: string;
  category: 'TOPIC' | 'TENSE' | 'WORD_ORDER' | 'PART5_REAL';
}

// Build consolidated question bank
const buildMasterBank = (): GrammarBankQuestion[] => {
  const bank: GrammarBankQuestion[] = [];
  const seenQuestions = new Set<string>();

  const addUnique = (q: GrammarBankQuestion) => {
    // Normalize question text to prevent duplicates
    const cleanKey = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenQuestions.has(cleanKey)) {
      seenQuestions.add(cleanKey);
      bank.push(q);
    }
  };

  // 1. Topic exercises (100 questions)
  grammarTopics.forEach(t => {
    t.exercises.forEach(ex => {
      addUnique({
        uniqueId: `topic_${t.id}_${ex.id}`,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        translation: ex.translation,
        topicTitle: t.title,
        category: 'TOPIC'
      });
    });
  });

  // 2. 12 Tenses exercises (60 questions)
  fullTwelveTenses.forEach(tense => {
    tense.exercises.forEach(ex => {
      addUnique({
        uniqueId: `tense_${tense.id}_${ex.id}`,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        translation: ex.translation,
        topicTitle: `Thì ${tense.nameVi} (${tense.nameEn})`,
        category: 'TENSE'
      });
    });
  });

  // 3. Word Order rules (30 questions)
  wordOrderRules.forEach(r => {
    r.exercises.forEach(ex => {
      addUnique({
        uniqueId: `word_order_${r.id}_${ex.id}`,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        translation: ex.translation,
        topicTitle: `Trật tự từ: ${r.ruleName}`,
        category: 'WORD_ORDER'
      });
    });
  });

  // 4. Extra Part 5 Questions (80 questions)
  extraPart5Questions.forEach(ex => {
    addUnique({
      uniqueId: `extra_p5_${ex.id}`,
      question: ex.question,
      options: ex.options,
      correctAnswer: ex.correctAnswer,
      explanation: ex.explanation,
      translation: ex.translation,
      topicTitle: ex.topicTitle,
      category: 'PART5_REAL'
    });
  });

  // 5. Authentic TOEIC Part 5 JSON Bank (30 questions)
  if (Array.isArray(p5JsonData)) {
    p5JsonData.forEach((item: any) => {
      if (item.question && item.options && item.correctAnswer) {
        addUnique({
          uniqueId: item.uniqueId || `json_p5_${Math.random()}`,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation || `Đáp án đúng là (${item.correctAnswer}).`,
          translation: item.translation || item.question,
          topicTitle: item.topic || "Ngữ pháp TOEIC Part 5",
          category: 'PART5_REAL'
        });
      }
    });
  }

  return bank;
};

// Singleton master bank
export const masterGrammarBank: GrammarBankQuestion[] = buildMasterBank();

/**
 * Fisher-Yates shuffle algorithm to generate a truly random subset of questions.
 * @param count Number of questions to return (default 10)
 * @param topicFilter Optional topic title filter
 */
export const getRandomGrammarTest = (count = 10, topicFilter?: string): GrammarBankQuestion[] => {
  let pool = [...masterGrammarBank];

  if (topicFilter && topicFilter !== 'ALL') {
    const filtered = pool.filter(q => q.topicTitle.toLowerCase().includes(topicFilter.toLowerCase()) || q.category === topicFilter);
    if (filtered.length >= count) {
      pool = filtered;
    }
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, Math.min(count, pool.length));
};

/**
 * Get distinct topic list and counts for UI filtering
 */
export const getGrammarBankStats = () => {
  const topicsMap: { [key: string]: number } = {};
  masterGrammarBank.forEach(q => {
    topicsMap[q.topicTitle] = (topicsMap[q.topicTitle] || 0) + 1;
  });

  return {
    total: masterGrammarBank.length,
    topics: topicsMap
  };
};
