import { Router, Request, Response } from 'express';
import { Collection } from '../db/nosql.js';
import { VocabDoc } from '../db/seedData.js';

export function createVocabRouter(vocabCol: Collection<VocabDoc>): Router {
  const router = Router();

  // GET /api/vocab - Get all vocabulary items
  router.get('/', (req: Request, res: Response) => {
    const topic = req.query.topic as string;
    const items = topic ? vocabCol.find({ topic }) : vocabCol.find();
    res.json({ success: true, count: items.length, data: items });
  });

  // GET /api/vocab/random - Get random items for quick quiz
  router.get('/random', (req: Request, res: Response) => {
    const count = parseInt(req.query.count as string) || 5;
    const all = vocabCol.find();
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    res.json({ success: true, data: shuffled.slice(0, count) });
  });

  // POST /api/vocab - Add new word
  router.post('/', (req: Request, res: Response) => {
    const { word, meaning, ipa, exampleEn, exampleVi, topic, level } = req.body;
    if (!word || !meaning) {
      return res.status(400).json({ success: false, message: "Từ và nghĩa không được để trống!" });
    }
    const newWord = vocabCol.insertOne({
      word,
      type: req.body.type || 'noun',
      ipa: ipa || '',
      meaning,
      exampleEn: exampleEn || '',
      exampleVi: exampleVi || '',
      topic: topic || 'General TOEIC',
      level: level || 'Intermediate'
    });
    res.status(201).json({ success: true, data: newWord });
  });

  return router;
}
