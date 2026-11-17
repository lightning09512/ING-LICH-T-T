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
    const testNum = Math.floor(Math.random() * 20) + 1; // 1 to 20 (Full 20 Tests available)
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
  const mapListening = (q: typeof LISTENING_BANK[0]): RankedQuestion => {
    const isP1 = q.part === 1;
    const isP2 = q.part === 2;

    return {
      id: q.id,
      part: q.part,
      direction: isP1
        ? 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.'
        : 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
      // Trong đề thi TOEIC thật:
      // Part 1: Chỉ nhìn ảnh và nghe 4 câu, đề thi không in nội dung câu nói!
      // Part 2: Chỉ nghe câu hỏi và 3 câu đáp, đề thi không in câu hỏi lẫn đáp án!
      questionText: isP1
        ? 'Look at the photograph and choose the best statement describing what you see.'
        : 'Listen to the question or statement and three responses. Select the best response.',
      imageUrl: q.imageUrl,
      audioScript: q.audioScript,
      spokenPrompt: isP2 ? q.questionText : undefined,
      spokenPromptVi: isP2 ? q.questionVi : undefined,
      options: q.options.map(o => ({
        label: o.label,
        // Khi thi: Chỉ hiển thị ký tự (A), (B), (C), (D) như phiếu trả lời TOEIC chuẩn
        text: `Phương án (${o.label})`,
        transcriptText: o.text,
        vietnamese: o.vietnamese,
      })),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      testOrigin: 'Listening Bank'
    };
  };

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
    // 16 QUESTIONS: 3 Part 1, 5 Part 2, 4 Part 5, 4 Part 6
    // Part 1 (3 questions)
    p1Pool.slice(0, 3).forEach(q => result.push(mapListening(q)));

    // Part 2 (5 questions)
    p2Pool.slice(0, 5).forEach(q => result.push(mapListening(q)));

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

    // Part 6 (4 questions - 1 cloze passage)
    if (fullTest && fullTest.questions) {
      const p6Questions = fullTest.questions.filter((q: any) => q.part === 6);
      if (p6Questions.length >= 4) {
        const passageStart = Math.floor(Math.random() * (p6Questions.length / 4)) * 4;
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
  } else if (tier === 'DIAMOND' || tier === 'MASTER' || tier === 'CHALLENGER') {
    // 20 QUESTIONS: 3 Part 1, 5 Part 2, 4 Part 5, 4 Part 6, 4 Part 7
    // Part 1 (3 questions)
    p1Pool.slice(0, 3).forEach(q => result.push(mapListening(q)));

    // Part 2 (5 questions)
    p2Pool.slice(0, 5).forEach(q => result.push(mapListening(q)));

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

    // Part 6 (4 questions - 1 cloze passage)
    if (fullTest && fullTest.questions) {
      const p6Questions = fullTest.questions.filter((q: any) => q.part === 6);
      if (p6Questions.length >= 4) {
        const passageStart = Math.floor(Math.random() * (p6Questions.length / 4)) * 4;
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

    // Part 7 (4 questions - 1 reading passage)
    if (fullTest && fullTest.questions) {
      const p7Questions = fullTest.questions.filter((q: any) => q.part === 7);
      if (p7Questions.length >= 4) {
        const p7Start = Math.floor(Math.random() * (p7Questions.length - 4));
        p7Questions.slice(p7Start, p7Start + 4).forEach((q: any) => {
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
