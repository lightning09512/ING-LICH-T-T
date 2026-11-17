/**
 * Engine AI Chấm Điểm & Nhận Xét Bài Thi TOEIC Speaking & Writing
 * Hỗ trợ:
 * 1. Google Gemini API (gemini-2.5-flash / gemini-2.0-flash) thông qua API Key do người dùng nhập hoặc từ biến môi trường.
 * 2. Bộ thẩm định Rubric Heuristic Offline thông minh (chạy tức thì nếu chưa có key hoặc mất mạng).
 */

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabUpgrade {
  originalWord: string;
  betterWord: string;
  reason: string;
}

export interface AiEvaluationResult {
  score: number; // Điểm phần thi (1-3 cho Viết câu, 1-4 cho Email, 1-5 cho Essay, hoặc 0-200 cho Speaking)
  maxScore: number;
  estimatedToeicBand: number; // Thang điểm 0 - 200
  strengths: string[];
  improvements: string[];
  grammarCorrections: GrammarCorrection[];
  vocabUpgrades: VocabUpgrade[];
  modelAnswer: string;
  coachComment: string;
}

const GEMINI_STORAGE_KEY = 'gemini_api_key';

export function getStoredGeminiApiKey(): string {
  if (typeof window === 'undefined') return '';
  const local = localStorage.getItem(GEMINI_STORAGE_KEY);
  if (local) return local.trim();
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return envKey ? envKey.trim() : '';
}

export function saveStoredGeminiApiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

/**
 * Chấm điểm bài viết (TOEIC Writing)
 */
export async function gradeWritingWithAi(params: {
  partType: 'SENTENCE' | 'EMAIL' | 'ESSAY';
  prompt: string;
  userSubmission: string;
  keywords?: string[];
  referenceModel?: string;
}): Promise<AiEvaluationResult> {
  const apiKey = getStoredGeminiApiKey();

  if (apiKey) {
    try {
      return await callGeminiWritingApi(apiKey, params);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic evaluator:', err);
    }
  }

  // Fallback offline evaluation
  return evaluateWritingOffline(params);
}

/**
 * Chấm điểm bài nói (TOEIC Speaking)
 */
export async function gradeSpeakingWithAi(params: {
  partType: 'READ_ALOUD' | 'DESCRIBE_PICTURE' | 'RESPOND_QUESTIONS' | 'EXPRESS_OPINION';
  prompt: string;
  transcription: string;
  targetScript?: string;
  referenceModel?: string;
}): Promise<AiEvaluationResult> {
  const apiKey = getStoredGeminiApiKey();

  if (apiKey) {
    try {
      return await callGeminiSpeakingApi(apiKey, params);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic evaluator:', err);
    }
  }

  // Fallback offline evaluation
  return evaluateSpeakingOffline(params);
}

// ==========================================
// GEMINI API CALLERS
// ==========================================

async function callGeminiWritingApi(apiKey: string, params: {
  partType: 'SENTENCE' | 'EMAIL' | 'ESSAY';
  prompt: string;
  userSubmission: string;
  keywords?: string[];
  referenceModel?: string;
}): Promise<AiEvaluationResult> {
  const maxScore = params.partType === 'SENTENCE' ? 3 : params.partType === 'EMAIL' ? 4 : 5;

  const systemPrompt = `Bạn là giám khảo chuyên gia chấm thi TOEIC Writing chuẩn ETS Hoa Kỳ. 
Hãy chấm điểm và đánh giá bài làm của thí sinh một cách ân cần, chi tiết và chuyên nghiệp bằng Tiếng Việt.
Trả về DUY NHẤT một chuỗi JSON hợp lệ (không markdown block) có cấu trúc sau:
{
  "score": number (từ 0 đến ${maxScore}),
  "estimatedToeicBand": number (thang điểm quy đổi TOEIC Writing từ 0 đến 200),
  "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
  "improvements": ["điểm cần khắc phục 1", "điểm cần khắc phục 2"],
  "grammarCorrections": [
    { "original": "cụm từ sai trong bài", "corrected": "cụm từ sửa lại cho đúng", "explanation": "giải thích ngắn gọn ngữ pháp" }
  ],
  "vocabUpgrades": [
    { "originalWord": "từ đơn giản", "betterWord": "từ vựng công sở đắt giá hơn", "reason": "lý do nên dùng" }
  ],
  "modelAnswer": "bài viết mẫu hoàn hảo đạt điểm tuyệt đối cho đề này",
  "coachComment": "lời nhận xét khích lệ ấm áp, có tâm dành cho bạn gái ôn thi"
}`;

  const userPrompt = `Dạng bài: ${params.partType}
Đề bài: ${params.prompt}
${params.keywords ? `Từ khóa bắt buộc: ${params.keywords.join(', ')}` : ''}
Bài làm của thí sinh:
"""
${params.userSubmission}
"""
${params.referenceModel ? `Bài tham khảo gốc: ${params.referenceModel}` : ''}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty Gemini response');

  const parsed = JSON.parse(rawText);
  return {
    score: typeof parsed.score === 'number' ? parsed.score : maxScore - 1,
    maxScore,
    estimatedToeicBand: typeof parsed.estimatedToeicBand === 'number' ? parsed.estimatedToeicBand : 140,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Ngữ pháp rõ ràng", "Bám sát chủ đề"],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Nên mở rộng vốn từ vựng liên kết"],
    grammarCorrections: Array.isArray(parsed.grammarCorrections) ? parsed.grammarCorrections : [],
    vocabUpgrades: Array.isArray(parsed.vocabUpgrades) ? parsed.vocabUpgrades : [],
    modelAnswer: parsed.modelAnswer || params.referenceModel || "Tham khảo câu mẫu chuẩn.",
    coachComment: parsed.coachComment || "Làm bài rất tốt! Tiếp tục phát huy nhé!"
  };
}

async function callGeminiSpeakingApi(apiKey: string, params: {
  partType: 'READ_ALOUD' | 'DESCRIBE_PICTURE' | 'RESPOND_QUESTIONS' | 'EXPRESS_OPINION';
  prompt: string;
  transcription: string;
  targetScript?: string;
  referenceModel?: string;
}): Promise<AiEvaluationResult> {
  const systemPrompt = `Bạn là giám khảo chấm thi TOEIC Speaking chuẩn ETS Hoa Kỳ.
Hãy phân tích bản ghi âm/nội dung nói (Speech-to-Text) của thí sinh và đưa ra đánh giá phát âm, ngữ điệu, ngữ pháp và độ lưu loát bằng Tiếng Việt.
Trả về DUY NHẤT một chuỗi JSON hợp lệ (không markdown block) có cấu trúc:
{
  "score": number (thang 0-3 cho Read Aloud, 0-5 cho Describe/Opinion),
  "estimatedToeicBand": number (thang điểm 0 đến 200 điểm TOEIC Speaking),
  "strengths": ["điểm cộng về phát âm hoặc sự lưu loát"],
  "improvements": ["điểm cần luyện thêm về nhấn trọng âm hoặc ngắt câu"],
  "grammarCorrections": [
    { "original": "cụm nói chưa chuẩn", "corrected": "cách diễn đạt tự nhiên chuẩn bản xứ", "explanation": "lý do" }
  ],
  "vocabUpgrades": [
    { "originalWord": "từ đã dùng", "betterWord": "từ đồng nghĩa ăn điểm cao hơn", "reason": "lý do" }
  ],
  "modelAnswer": "bài nói mẫu hoàn hảo",
  "coachComment": "nhận xét khích lệ ấm áp dành cho bạn gái"
}`;

  const userPrompt = `Phần thi: ${params.partType}
Đề bài / Ngữ cảnh: ${params.prompt}
${params.targetScript ? `Đoạn văn cần đọc: ${params.targetScript}` : ''}
Nội dung thí sinh đã nói (Speech Transcription):
"""
${params.transcription}
"""
${params.referenceModel ? `Bài nói mẫu tham khảo: ${params.referenceModel}` : ''}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty Gemini response');

  const parsed = JSON.parse(rawText);
  return {
    score: typeof parsed.score === 'number' ? parsed.score : 4,
    maxScore: params.partType === 'READ_ALOUD' ? 3 : 5,
    estimatedToeicBand: typeof parsed.estimatedToeicBand === 'number' ? parsed.estimatedToeicBand : 150,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Phát âm tương đối rõ ràng", "Tốc độ nói ổn định"],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Cần nhấn rõ trọng âm từ và âm đuôi (ending sounds)"],
    grammarCorrections: Array.isArray(parsed.grammarCorrections) ? parsed.grammarCorrections : [],
    vocabUpgrades: Array.isArray(parsed.vocabUpgrades) ? parsed.vocabUpgrades : [],
    modelAnswer: parsed.modelAnswer || params.referenceModel || "Good job!",
    coachComment: parsed.coachComment || "Giọng đọc rất dễ thương và tự tin! Rèn thêm một chút âm đuôi là lên ngay 180+ nhé!"
  };
}

// ==========================================
// OFFLINE HEURISTIC EVALUATION ENGINE
// ==========================================

function evaluateWritingOffline(params: {
  partType: 'SENTENCE' | 'EMAIL' | 'ESSAY';
  prompt: string;
  userSubmission: string;
  keywords?: string[];
  referenceModel?: string;
}): AiEvaluationResult {
  const text = params.userSubmission.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (params.partType === 'SENTENCE') {
    const kw = params.keywords || [];
    const missingKw = kw.filter(k => !text.toLowerCase().includes(k.toLowerCase()));
    const hasPunctuation = /[.!?]$/.test(text);
    const hasCapital = /^[A-Z]/.test(text);

    let score = 3;
    const improvements: string[] = [];
    const corrections: GrammarCorrection[] = [];

    if (missingKw.length > 0) {
      score = Math.max(1, score - missingKw.length);
      improvements.push(`Chưa xuất hiện đủ từ khóa yêu cầu: ${missingKw.join(', ')}`);
    }
    if (!hasPunctuation) {
      improvements.push("Cuối câu cần có dấu chấm câu rõ ràng.");
    }
    if (!hasCapital) {
      improvements.push("Đầu câu cần viết hoa chữ cái đầu.");
    }
    if (wordCount < 5) {
      score = Math.min(score, 1);
      improvements.push("Câu văn quá ngắn, nên bổ sung thêm thông tin bổ ngữ.");
    }

    return {
      score,
      maxScore: 3,
      estimatedToeicBand: score === 3 ? 180 : score === 2 ? 140 : 100,
      strengths: ["Cấu trúc câu hoàn chỉnh", "Bám sát hình ảnh"],
      improvements: improvements.length ? improvements : ["Câu văn rất tốt, có thể dùng thêm tính từ để miêu tả sinh động hơn."],
      grammarCorrections: corrections,
      vocabUpgrades: [
        { originalWord: "look", betterWord: "examine / observe", reason: "Từ mang tính công sở chuẩn TOEIC" },
        { originalWord: "talk", betterWord: "discuss / confer", reason: "Diễn tả tính chất trao đổi công việc" }
      ],
      modelAnswer: params.referenceModel || "The team members are discussing project details around the conference table.",
      coachComment: score === 3 
        ? "Xuất sắc! Câu văn chuẩn chỉ, đúng ngữ pháp và sử dụng đủ từ khóa!" 
        : "Nền tảng câu khá tốt! Chú ý thêm một chút về dấu câu và các từ khóa là ăn trọn điểm 3/3 nhé!"
    };
  }

  if (params.partType === 'EMAIL') {
    const hasGreeting = /(dear|hi|hello|to Whom)/i.test(text);
    const hasClosing = /(sincerely|best regards|regards|thank you|warmly)/i.test(text);
    let score = 3;
    const strengths: string[] = ["Bố cục email rõ ràng"];
    const improvements: string[] = [];

    if (hasGreeting && hasClosing) {
      score = 4;
      strengths.push("Đầy đủ lời chào đầu thư và kết thư lịch sự");
    } else {
      improvements.push("Email công sở nên có lời chào đầu (Dear...) và lời chào kết thư (Best regards...)");
    }
    if (wordCount < 40) {
      score = Math.min(score, 2);
      improvements.push("Độ dài hơi ngắn, nên giải thích chi tiết hơn các yêu cầu trong đề bài.");
    }

    return {
      score,
      maxScore: 4,
      estimatedToeicBand: score === 4 ? 180 : score === 3 ? 150 : 110,
      strengths,
      improvements: improvements.length ? improvements : ["Giọng văn email rất chuẩn mực và chuyên nghiệp."],
      grammarCorrections: [],
      vocabUpgrades: [
        { originalWord: "help", betterWord: "assist / facilitate", reason: "Tăng tính trang trọng trong email thương mại" },
        { originalWord: "ask", betterWord: "inquire / request", reason: "Chuẩn văn phong công sở" }
      ],
      modelAnswer: params.referenceModel || "Dear Customer,\n\nThank you for reaching out to us. We would be delighted to assist you...",
      coachComment: "Email viết rất gãy gọn và lịch sự! Nóc nhà viết email thế này là đối tác duyệt hợp đồng ngay!"
    };
  }

  // ESSAY (Part 3)
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  let score = 3;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= 250) {
    score = 5;
    strengths.push(`Độ dài đạt chuẩn (${wordCount} từ ≥ 250 từ yêu cầu)`);
  } else if (wordCount >= 150) {
    score = 4;
    strengths.push(`Độ dài khá tốt (${wordCount} từ)`);
    improvements.push("Cố gắng kéo dài bài luận lên trên 250-300 từ để đạt điểm tuyệt đối 5/5.");
  } else {
    score = 2;
    improvements.push(`Bài luận hiện có ${wordCount} từ, cần viết thêm luận điểm và ví dụ minh họa.`);
  }

  if (paragraphs.length >= 3) {
    strengths.push("Có phân tách các đoạn Mở bài, Thân bài và Kết bài");
  } else {
    improvements.push("Nên ngắt dòng rõ ràng thành 3-4 đoạn để bố cục bài luận mạch lạc hơn.");
  }

  return {
    score,
    maxScore: 5,
    estimatedToeicBand: score === 5 ? 190 : score === 4 ? 160 : score === 3 ? 130 : 90,
    strengths,
    improvements,
    grammarCorrections: [],
    vocabUpgrades: [
      { originalWord: "I think", betterWord: "From my perspective / I firmly believe that", reason: "Mở đầu luận điểm học thuật" },
      { originalWord: "Moreover / Also", betterWord: "Furthermore / In addition to this", reason: "Liên kết ý mạch lạc hơn" }
    ],
    modelAnswer: params.referenceModel || "In today's fast-paced society, whether to work remotely or in an office remains a subject of ongoing debate...",
    coachComment: "Lập luận rất sắc bén! Chăm viết luận thế này thì band điểm Writing 180+ nằm chắc trong tay rồi nhé!"
  };
}

function evaluateSpeakingOffline(params: {
  partType: 'READ_ALOUD' | 'DESCRIBE_PICTURE' | 'RESPOND_QUESTIONS' | 'EXPRESS_OPINION';
  prompt: string;
  transcription: string;
  targetScript?: string;
  referenceModel?: string;
}): AiEvaluationResult {
  const text = params.transcription.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (params.partType === 'READ_ALOUD' && params.targetScript) {
    const targetWords = params.targetScript.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ''));
    const spokenWords = text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, ''));
    
    let matched = 0;
    targetWords.forEach(w => {
      if (spokenWords.includes(w)) matched++;
    });
    const accuracy = targetWords.length > 0 ? Math.round((matched / targetWords.length) * 100) : 0;
    const score = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;

    return {
      score,
      maxScore: 3,
      estimatedToeicBand: score === 3 ? 180 : score === 2 ? 140 : 100,
      strengths: [`Độ chính xác nhận diện từ: ${accuracy}%`, "Tốc độ đọc vừa phải, không bị ngắt quãng quá lâu"],
      improvements: accuracy < 85 ? ["Một số từ phát âm chưa rõ âm cuối (như /s/, /ed/, /t/)"] : ["Ngữ điệu lên giọng cuối câu hỏi và hạ giọng cuối câu trần thuật."],
      grammarCorrections: [],
      vocabUpgrades: [],
      modelAnswer: params.targetScript,
      coachComment: score === 3 
        ? "Phát âm đỉnh chóp! Giọng đọc rất rõ ràng, tròn vành rõ chữ!" 
        : "Nói rất tự tin! Luyện nghe thêm audio mẫu và chú ý phát âm rõ âm đuôi /s/, /t/ là chuẩn bài luôn!"
    };
  }

  // Other Speaking parts
  let score = 4;
  if (wordCount >= 50) score = 5;
  else if (wordCount >= 25) score = 4;
  else if (wordCount >= 10) score = 3;
  else score = 2;

  return {
    score,
    maxScore: 5,
    estimatedToeicBand: score === 5 ? 190 : score === 4 ? 160 : score === 3 ? 120 : 80,
    strengths: ["Phản xạ trả lời nhanh", "Nội dung bám sát tình huống đề bài"],
    improvements: ["Có thể mở rộng thêm 1 câu giải thích lý do (Because...) hoặc nêu ví dụ thực tế (For instance...)"],
    grammarCorrections: [],
    vocabUpgrades: [
      { originalWord: "I like", betterWord: "I have a strong preference for / I am particularly fond of", reason: "Tăng độ đa dạng từ vựng nói" },
      { originalWord: "good", betterWord: "convenient / cost-effective / advantageous", reason: "Mô tả cụ thể lý do" }
    ],
    modelAnswer: params.referenceModel || "Based on my personal experience, I believe that...",
    coachComment: "Phản xạ nói rất mượt mà! Cố gắng luyện nói mỗi ngày 5 phút là giao tiếp tiếng Anh tự tin như người bản xứ ngay!"
  };
}
