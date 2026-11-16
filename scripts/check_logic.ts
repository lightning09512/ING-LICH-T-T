import { grammarTopics, fullTwelveTenses, wordOrderRules, getAllGrammarExercises } from '../src/data/grammarData';

console.log('=== KIỂM TRA CHUYÊN SÂU TÍNH LOGIC VÀ ĐÁP ÁN 190 CÂU ===\n');

const allExercises = getAllGrammarExercises();
let logicWarnings = 0;

allExercises.forEach((ex, idx) => {
  const correctOpt = ex.options.find(o => o.label === ex.correctAnswer);
  if (!correctOpt) return;

  const expl = ex.explanation;

  // 1. Kiểm tra nếu trong giải thích có nhắc đến "Chọn [A/B/C/D]" hoặc "đáp án [A/B/C/D]"
  const chonRegex = /(?:chọn|đáp án)\s+([ABCD])\b/gi;
  let m;
  while ((m = chonRegex.exec(expl)) !== null) {
    const letter = m[1].toUpperCase();
    if (letter !== ex.correctAnswer) {
      console.warn(`[CẢNH BÁO LOGIC - Câu ${idx + 1} (${ex.topicTitle})]:`);
      console.warn(`  Đáp án được chọn là ${ex.correctAnswer} (${correctOpt.text}), nhưng giải thích ghi: "${m[0]}"`);
      console.warn(`  Giải thích: ${expl}\n`);
      logicWarnings++;
    }
  }

  // 2. Kiểm tra nếu trong giải thích có trích dẫn từ khóa của phương án đúng
  const optWord = correctOpt.text.trim().toLowerCase();
  const explLower = expl.toLowerCase();
  // Nếu từ khóa đúng không xuất hiện trong giải thích hoặc dịch nghĩa
  if (!explLower.includes(optWord) && !ex.translation.toLowerCase().includes(optWord)) {
    // Chỉ là thông báo để rà soát
  }
});

console.log(`Kiểm tra hoàn tất: ${logicWarnings === 0 ? 'KHÔNG CÓ BẤT KỲ MÂU THUẪN NÀO GIỮA ĐÁP ÁN VÀ GIẢI THÍCH!' : `Phát hiện ${logicWarnings} cảnh báo cần chỉnh sửa.`}`);
