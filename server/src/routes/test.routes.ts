import { Router, Request, Response } from 'express';
import { Collection } from '../db/nosql.js';
import { ToeicTestDoc } from '../db/seedData.js';

export interface SubmissionDoc {
  _id: string;
  testId: string;
  testTitle: string;
  userNickname: string;
  totalQuestions: number;
  correctCount: number;
  listeningScore: number;
  readingScore: number;
  totalToeicScore: number;
  answers: { [key: number]: string };
  timeSpentSeconds: number;
  rankTitle: string;
  roastMessage: string;
  createdAt: string;
}

export function createTestRouter(
  testCol: Collection<ToeicTestDoc>,
  submissionCol: Collection<SubmissionDoc>
): Router {
  const router = Router();

  // GET /api/tests - List all tests
  router.get('/', (req: Request, res: Response) => {
    const tests = testCol.find().map(t => ({
      _id: t._id,
      title: t.title,
      code: t.code,
      durationMinutes: t.durationMinutes,
      totalQuestions: t.totalQuestions,
      description: t.description
    }));
    res.json({ success: true, data: tests });
  });

  // GET /api/tests/:id - Get test with full questions
  router.get('/:id', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const test = testCol.findOne({ _id: id }) || testCol.findOne({ code: id });
    if (!test) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đề thi này!" });
    }
    res.json({ success: true, data: test });
  });

  // POST /api/tests/:id/submit - Submit answers and calculate TOEIC score
  router.post('/:id/submit', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const test = testCol.findOne({ _id: id }) || testCol.findOne({ code: id });
    if (!test) {
      return res.status(404).json({ success: false, message: "Đề thi không tồn tại!" });
    }

    const { answers, timeSpentSeconds, nickname = "Mập địch" } = req.body;
    let correctCount = 0;
    let listeningCorrect = 0;
    let readingCorrect = 0;

    const details: any[] = [];

    test.questions.forEach(q => {
      const selected = answers ? answers[q.id] : null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        if (q.part <= 4) listeningCorrect++;
        else readingCorrect++;
      }
      details.push({
        questionId: q.id,
        part: q.part,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        transcript: q.transcript
      });
    });

    // Approximate scaled score calculation
    // Scale proportional to max 495 each
    const listeningTotal = test.questions.filter(q => q.part <= 4).length || 1;
    const readingTotal = test.questions.filter(q => q.part >= 5).length || 1;

    const listeningScore = Math.round((listeningCorrect / listeningTotal) * 495);
    const readingScore = Math.round((readingCorrect / readingTotal) * 495);
    const totalToeicScore = listeningScore + readingScore;

    // Rank & Roast evaluation for girlfriend
    let rankTitle = "Thần Đồng TOEIC";
    let roastMessage = "Nóc nhà uy tín đỉnh nóc kịch trần! Tối nay thưởng trà sữa 100% đường nhé!";

    if (totalToeicScore < 400) {
      rankTitle = "Mập Địch Sơ Sinh";
      roastMessage = "Học hành thế đấy à? Câu dễ thế này mà cũng chọn sai, phạt giặt đồ 1 tuần!";
    } else if (totalToeicScore < 700) {
      rankTitle = "Chiến Thần Học Vẹt";
      roastMessage = "Tạm chấp nhận được, nhưng lần sau cấm bấm lụi nhé bạn iu!";
    }

    const submission = submissionCol.insertOne({
      testId: test._id,
      testTitle: test.title,
      userNickname: nickname,
      totalQuestions: test.totalQuestions,
      correctCount,
      listeningScore,
      readingScore,
      totalToeicScore,
      answers: answers || {},
      timeSpentSeconds: timeSpentSeconds || 0,
      rankTitle,
      roastMessage
    });

    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        correctCount,
        totalQuestions: test.totalQuestions,
        listeningScore,
        readingScore,
        totalToeicScore,
        rankTitle,
        roastMessage,
        details
      }
    });
  });

  return router;
}
