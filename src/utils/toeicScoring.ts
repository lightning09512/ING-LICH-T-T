/**
 * Bảng quy đổi điểm TOEIC chuẩn ETS (Educational Testing Service)
 * Áp dụng cho bài thi TOEIC Listening & Reading Quốc tế:
 * - Listening: 100 câu -> Thang điểm 5 - 495 (bước nhảy 5 điểm)
 * - Reading: 100 câu -> Thang điểm 5 - 495 (bước nhảy 5 điểm)
 * - Tổng điểm: 10 - 990 (bước nhảy 5 điểm)
 */

export const ETS_LISTENING_SCORE_TABLE: { [raw: number]: number } = {
  0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5,
  7: 10, 8: 15, 9: 20, 10: 25,
  11: 30, 12: 35, 13: 40, 14: 45, 15: 50,
  16: 55, 17: 60, 18: 65, 19: 70, 20: 75,
  21: 80, 22: 85, 23: 90, 24: 95, 25: 100,
  26: 110, 27: 115, 28: 120, 29: 125, 30: 130,
  31: 135, 32: 140, 33: 145, 34: 150, 35: 160,
  36: 165, 37: 170, 38: 175, 39: 180, 40: 185,
  41: 190, 42: 195, 43: 200, 44: 210, 45: 215,
  46: 220, 47: 230, 48: 240, 49: 245, 50: 250,
  51: 255, 52: 260, 53: 270, 54: 275, 55: 280,
  56: 290, 57: 295, 58: 300, 59: 310, 60: 315,
  61: 320, 62: 325, 63: 330, 64: 340, 65: 345,
  66: 350, 67: 360, 68: 365, 69: 370, 70: 380,
  71: 385, 72: 390, 73: 395, 74: 400, 75: 405,
  76: 410, 77: 415, 78: 420, 79: 425, 80: 430,
  81: 435, 82: 440, 83: 445, 84: 450, 85: 455,
  86: 460, 87: 465, 88: 470, 89: 475, 90: 480,
  91: 485, 92: 490, 93: 495, 94: 495, 95: 495,
  96: 495, 97: 495, 98: 495, 99: 495, 100: 495
};

export const ETS_READING_SCORE_TABLE: { [raw: number]: number } = {
  0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5,
  10: 10, 11: 15, 12: 20, 13: 25, 14: 30, 15: 35, 16: 40, 17: 45, 18: 50, 19: 55,
  20: 60, 21: 65, 22: 70, 23: 75, 24: 80, 25: 85, 26: 90, 27: 95, 28: 100, 29: 110,
  30: 115, 31: 120, 32: 125, 33: 130, 34: 135, 35: 140, 36: 145, 37: 150, 38: 160, 39: 165,
  40: 170, 41: 175, 42: 180, 43: 185, 44: 190, 45: 195, 46: 200, 47: 210, 48: 215, 49: 220,
  50: 225, 51: 230, 52: 235, 53: 240, 54: 250, 55: 255, 56: 260, 57: 265, 58: 270, 59: 280,
  60: 285, 61: 290, 62: 295, 63: 300, 64: 310, 65: 315, 66: 320, 67: 325, 68: 330, 69: 335,
  70: 340, 71: 350, 72: 355, 73: 360, 74: 365, 75: 370, 76: 380, 77: 385, 78: 390, 79: 395,
  80: 400, 81: 405, 82: 410, 83: 415, 84: 420, 85: 425, 86: 430, 87: 435, 88: 445, 89: 450,
  90: 455, 91: 460, 92: 470, 93: 475, 94: 480, 95: 485, 96: 490, 97: 495, 98: 495, 99: 495,
  100: 495
};

export interface ToeicScoreResult {
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  listeningRaw: number;
  listeningTotal: number;
  readingRaw: number;
  readingTotal: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  certificateColor: 'Cam (Orange)' | 'Nâu (Brown)' | 'Xanh lá (Green)' | 'Xanh dương (Blue)' | 'Vàng (Gold)';
  titleVi: string;
  evaluationVi: string;
}

/**
 * Quy đổi số câu đúng sang điểm số chuẩn ETS TOEIC
 */
export function calculateToeicScore(
  listeningCorrect: number,
  listeningTotal: number = 100,
  readingCorrect: number,
  readingTotal: number = 100
): ToeicScoreResult {
  // Chuẩn hóa về thang 100 câu nếu bài test có số câu khác
  const normListening = Math.min(100, Math.max(0, Math.round((listeningCorrect / Math.max(1, listeningTotal)) * 100)));
  const normReading = Math.min(100, Math.max(0, Math.round((readingCorrect / Math.max(1, readingTotal)) * 100)));

  const listeningScore = ETS_LISTENING_SCORE_TABLE[normListening] ?? 5;
  const readingScore = ETS_READING_SCORE_TABLE[normReading] ?? 5;
  const totalScore = listeningScore + readingScore;

  let cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
  let certificateColor: 'Cam (Orange)' | 'Nâu (Brown)' | 'Xanh lá (Green)' | 'Xanh dương (Blue)' | 'Vàng (Gold)' = 'Cam (Orange)';
  let titleVi = "Mầm Non TOEIC";
  let evaluationVi = "Bạn đang ở giai đoạn khởi động. Hãy tập trung học vững 12 thì cơ bản và 600 từ vựng cốt lõi mỗi ngày nhé!";

  if (totalScore >= 860) {
    cefrLevel = 'C1';
    certificateColor = 'Vàng (Gold)';
    titleVi = "Chiến Thần TOEIC C1";
    evaluationVi = "Xuất sắc tuyệt đối! Khả năng tiếng Anh của bạn hoàn toàn lưu loát và chuyên nghiệp trong môi trường quốc tế.";
  } else if (totalScore >= 730) {
    cefrLevel = 'B2';
    certificateColor = 'Xanh dương (Blue)';
    titleVi = "Cao Thủ Đỉnh Nóc B2";
    evaluationVi = "Rất tốt! Bạn đáp ứng xuất sắc mọi yêu cầu tuyển dụng của các tập đoàn đa quốc gia và doanh nghiệp lớn.";
  } else if (totalScore >= 470) {
    cefrLevel = 'B1';
    certificateColor = 'Xanh lá (Green)';
    titleVi = "Tay Săn Bằng Chuẩn B1";
    evaluationVi = "Đã vượt chuẩn đầu ra đại học! Cố gắng luyện thêm tốc độ đọc Part 7 và bắt keyword Part 3, 4 để bứt phá 700+ nhé.";
  } else if (totalScore >= 220) {
    cefrLevel = 'A2';
    certificateColor = 'Nâu (Brown)';
    titleVi = "Tập Sự Tiến Bộ A2";
    evaluationVi = "Nền tảng khá ổn định. Hãy củng cố Part 1 & 2 để kiếm trọn điểm Listening và luyện thêm từ loại Part 5.";
  }

  return {
    listeningScore,
    readingScore,
    totalScore,
    listeningRaw: listeningCorrect,
    listeningTotal,
    readingRaw: readingCorrect,
    readingTotal,
    cefrLevel,
    certificateColor,
    titleVi,
    evaluationVi
  };
}
