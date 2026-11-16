import { Router, Request, Response } from 'express';
import { Collection } from '../db/nosql.js';
import { UserProfileDoc } from '../db/seedData.js';

export function createProfileRouter(profileCol: Collection<UserProfileDoc>): Router {
  const router = Router();

  // GET /api/profile
  router.get('/', (req: Request, res: Response) => {
    let profile = profileCol.findOne({ _id: 'profile_gf' });
    if (!profile) {
      profile = profileCol.find()[0];
    }
    res.json({ success: true, data: profile });
  });

  // PUT /api/profile
  router.put('/', (req: Request, res: Response) => {
    const { nickname, streakDays, totalPoints } = req.body;
    const updated = profileCol.updateOne(
      { _id: 'profile_gf' },
      {
        ...(nickname && { nickname }),
        ...(streakDays !== undefined && { streakDays }),
        ...(totalPoints !== undefined && { totalPoints })
      }
    );
    res.json({ success: true, data: updated });
  });

  // GET /api/profile/roast - Random meme quotes
  router.get('/roast', (req: Request, res: Response) => {
    const quotes = [
      "Học đi, lướt điện thoại hoài rồi mập địch ơi!",
      "Nghĩ ra đáp án chưa hay định chọn bừa C?",
      "Nghe Part 2 mà tưởng người ta đang bắn rap à?",
      "Trời ơi từ này vừa mới học hôm qua xong cơ mà!",
      "Làm đúng câu này bạn trai dẫn đi ăn lẩu ngay!",
      "Trollface đang theo dõi từng thao tác bấm của bạn đó...",
      "990 TOEIC thẳng tiến, không nói nhiều!"
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ success: true, roast: quote });
  });

  return router;
}
