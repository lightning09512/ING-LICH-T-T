import { RankTier, RankedQuestion } from '../types/ranked';
import { LISTENING_BANK } from '../data/listeningBank';
import { extraPart5Questions } from '../data/extraPart5Questions';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function generateRankedMatchQuestions(tier: RankTier): Promise<RankedQuestion[]> {
  // 1. Prepare Part 1 & Part 2 pool from Listening Bank
  const p1Pool = shuffleArray(LISTENING_BANK.filter(q => q.part === 1));
  const p2Pool = shuffleArray(LISTENING_BANK.filter(q => q.part === 2));

  // 2. Fetch full test pool for Part 3, 4, 5, 6, 7
  let fullTest: any = null;
  try {
    const testNum = Math.floor(Math.random() * 11) + 1; // 1 to 11
    const res = await fetch(`/data/tests/test-${testNum}.json`);
    if (res.ok) {
      fullTest = await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch test from /data/tests/, falling back to local data', e);
  }

  // 3. Fallback Part 5 pool from extraPart5Questions if test fetch failed
  const fallbackP5Pool: RankedQuestion[] = extraPart5Questions.map(q => ({
    id: String(q.id),
    part: 5,
    direction: 'Part 5: Incomplete Sentences. Select the best answer to complete each sentence.',
    questionText: q.question,
    options: q.options.map(opt => ({
      label: opt.label as 'A' | 'B' | 'C' | 'D',
      text: opt.text
    })),
    correctAnswer: q.correctAnswer as 'A' | 'B' | 'C' | 'D',
    explanation: q.explanation || 'Đáp án ngữ pháp chuẩn TOEIC.',
    testOrigin: 'Grammar Bank'
  }));

  const result: RankedQuestion[] = [];

  // Helper to map listening bank question to RankedQuestion
  const mapListening = (q: typeof LISTENING_BANK[0]): RankedQuestion => ({
    id: q.id,
    part: q.part,
    direction: q.direction,
    questionText: q.questionText,
    imageUrl: q.imageUrl,
    audioScript: q.audioScript,
    options: q.options.map(o => ({
      label: o.label,
      text: o.text + (o.vietnamese ? ` (${o.vietnamese})` : '')
    })),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    testOrigin: 'Listening Bank'
  });

  if (tier === 'BRONZE' || tier === 'SILVER') {
    // 10 QUESTIONS: 2 Part 1, 4 Part 2, 4 Part 5
    // Part 1 (2 questions)
    p1Pool.slice(0, 2).forEach(q => result.push(mapListening(q)));

    // Part 2 (4 questions)
    p2Pool.slice(0, 4).forEach(q => result.push(mapListening(q)));

    // Part 5 (4 questions)
    if (fullTest && fullTest.questions) {
      const p5 = shuffleArray(fullTest.questions.filter((q: any) => q.part === 5)).slice(0, 4);
      p5.forEach((q: any) => {
        result.push({
          id: `R-P5-${q.id}`,
          part: 5,
          direction: q.direction || 'Part 5: Incomplete Sentences.',
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          testOrigin: fullTest.code || 'Study4 TOEIC'
        });
      });
    } else {
      shuffleArray(fallbackP5Pool).slice(0, 4).forEach(q => result.push(q));
    }
  } else if (tier === 'GOLD' || tier === 'PLATINUM') {
    // 16 QUESTIONS: 2 Part 1, 3 Part 2, 3 Part 3, 4 Part 5, 4 Part 6
    // Part 1 (2 questions)
    p1Pool.slice(0, 2).forEach(q => result.push(mapListening(q)));

    // Part 2 (3 questions)
    p2Pool.slice(0, 3).forEach(q => result.push(mapListening(q)));

    // Part 3 (3 questions - 1 dialogue set)
    if (fullTest && fullTest.questions) {
      const p3Questions = fullTest.questions.filter((q: any) => q.part === 3);
      if (p3Questions.length >= 3) {
        // Pick a block of 3 (e.g. 32-34, 35-37, etc.)
        const blockStart = Math.floor(Math.random() * (p3Questions.length / 3)) * 3;
        p3Questions.slice(blockStart, blockStart + 3).forEach((q: any) => {
          result.push({
            id: `R-P3-${q.id}`,
            part: 3,
            direction: q.direction || 'Part 3: Conversations.',
            questionText: q.questionText,
            imageUrl: q.imageUrl,
            audioUrl: q.audioUrl,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }

    // Part 5 (4 questions)
    if (fullTest && fullTest.questions) {
      const p5 = shuffleArray(fullTest.questions.filter((q: any) => q.part === 5)).slice(0, 4);
      p5.forEach((q: any) => {
        result.push({
          id: `R-P5-${q.id}`,
          part: 5,
          direction: q.direction,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          testOrigin: fullTest.code || 'Study4 TOEIC'
        });
      });
    } else {
      shuffleArray(fallbackP5Pool).slice(0, 4).forEach(q => result.push(q));
    }

    // Part 6 (4 questions - 1 cloze passage)
    if (fullTest && fullTest.questions) {
      const p6Questions = fullTest.questions.filter((q: any) => q.part === 6);
      if (p6Questions.length >= 4) {
        // Pick 1 passage set of 4 (e.g. 131-134, 135-138)
        const passageStart = Math.floor(Math.random() * 4) * 4;
        p6Questions.slice(passageStart, passageStart + 4).forEach((q: any) => {
          result.push({
            id: `R-P6-${q.id}`,
            part: 6,
            direction: q.direction || 'Part 6: Text Completion.',
            passageText: q.passage,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }
  } else {
    // DIAMOND / MASTER / CHALLENGER: 22 QUESTIONS (Full 7 Parts!)
    // 1 Part 1, 2 Part 2, 3 Part 3, 3 Part 4, 4 Part 5, 4 Part 6, 5 Part 7
    // Part 1 (1 question)
    p1Pool.slice(0, 1).forEach(q => result.push(mapListening(q)));

    // Part 2 (2 questions)
    p2Pool.slice(0, 2).forEach(q => result.push(mapListening(q)));

    // Part 3 (3 questions - 1 conversation)
    if (fullTest && fullTest.questions) {
      const p3Questions = fullTest.questions.filter((q: any) => q.part === 3);
      if (p3Questions.length >= 3) {
        const blockStart = Math.floor(Math.random() * (p3Questions.length / 3)) * 3;
        p3Questions.slice(blockStart, blockStart + 3).forEach((q: any) => {
          result.push({
            id: `R-P3-${q.id}`,
            part: 3,
            direction: q.direction,
            questionText: q.questionText,
            imageUrl: q.imageUrl,
            audioUrl: q.audioUrl,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }

    // Part 4 (3 questions - 1 short talk)
    if (fullTest && fullTest.questions) {
      const p4Questions = fullTest.questions.filter((q: any) => q.part === 4);
      if (p4Questions.length >= 3) {
        const blockStart = Math.floor(Math.random() * (p4Questions.length / 3)) * 3;
        p4Questions.slice(blockStart, blockStart + 3).forEach((q: any) => {
          result.push({
            id: `R-P4-${q.id}`,
            part: 4,
            direction: q.direction,
            questionText: q.questionText,
            imageUrl: q.imageUrl,
            audioUrl: q.audioUrl,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }

    // Part 5 (4 questions)
    if (fullTest && fullTest.questions) {
      const p5 = shuffleArray(fullTest.questions.filter((q: any) => q.part === 5)).slice(0, 4);
      p5.forEach((q: any) => {
        result.push({
          id: `R-P5-${q.id}`,
          part: 5,
          direction: q.direction,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          testOrigin: fullTest.code || 'Study4 TOEIC'
        });
      });
    } else {
      shuffleArray(fallbackP5Pool).slice(0, 4).forEach(q => result.push(q));
    }

    // Part 6 (4 questions)
    if (fullTest && fullTest.questions) {
      const p6Questions = fullTest.questions.filter((q: any) => q.part === 6);
      if (p6Questions.length >= 4) {
        const passageStart = Math.floor(Math.random() * 4) * 4;
        p6Questions.slice(passageStart, passageStart + 4).forEach((q: any) => {
          result.push({
            id: `R-P6-${q.id}`,
            part: 6,
            direction: q.direction,
            passageText: q.passage,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }

    // Part 7 (5 questions - 1 reading passage)
    if (fullTest && fullTest.questions) {
      const p7Questions = fullTest.questions.filter((q: any) => q.part === 7);
      // Group by passage or pick 5 consecutive questions sharing passage
      if (p7Questions.length >= 5) {
        const p7Start = Math.floor(Math.random() * (p7Questions.length - 5));
        p7Questions.slice(p7Start, p7Start + 5).forEach((q: any) => {
          result.push({
            id: `R-P7-${q.id}`,
            part: 7,
            direction: q.direction || 'Part 7: Reading Comprehension.',
            passageText: q.passage,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            testOrigin: fullTest.code || 'Study4 TOEIC'
          });
        });
      }
    }
  }

  // Final check: if result is empty for any reason, provide minimal fallback
  if (result.length === 0) {
    p1Pool.slice(0, 2).forEach(q => result.push(mapListening(q)));
    p2Pool.slice(0, 4).forEach(q => result.push(mapListening(q)));
    shuffleArray(fallbackP5Pool).slice(0, 4).forEach(q => result.push(q));
  }

  return result;
}
