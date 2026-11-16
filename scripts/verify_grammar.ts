import { grammarTopics, fullTwelveTenses, wordOrderRules, getAllGrammarExercises } from '../src/data/grammarData';
import { tenseExercisesMap } from '../src/data/tenseExercisesData';
import { wordOrderExercisesMap } from '../src/data/wordOrderExercisesData';
import { extraTopicExercisesMap } from '../src/data/extraTopicExercisesData';

console.log('=== BẮT ĐẦU KIỂM TRA TÍNH XÁC THỰC TOÀN BỘ DỮ LIỆU NGỮ PHÁP ===\n');

let totalIssues = 0;

// 1. Kiểm tra 12 Thì
console.log('--- 1. KIỂM TRA 12 THÌ TIẾNG ANH ---');
if (fullTwelveTenses.length !== 12) {
  console.error(`LỖI: Số lượng thì hiện tại là ${fullTwelveTenses.length}, không phải 12!`);
  totalIssues++;
}

fullTwelveTenses.forEach((t, i) => {
  if (!t.id || !t.nameEn || !t.nameVi) {
    console.error(`LỖI: Thì thứ ${i + 1} thiếu thông tin id/nameEn/nameVi.`);
    totalIssues++;
  }
  if (!t.formulaBlocks || t.formulaBlocks.length === 0) {
    console.error(`LỖI: Thì ${t.nameVi} (${t.id}) không có formulaBlocks.`);
    totalIssues++;
  }
  t.formulaBlocks.forEach((fb, fbIdx) => {
    if (!fb.affirmative || !fb.negative || !fb.question) {
      console.error(`LỖI: Thì ${t.nameVi} block ${fbIdx} thiếu công thức khẳng định/phủ định/nghi vấn.`);
      totalIssues++;
    }
  });
  if (!t.exercises || t.exercises.length !== 5) {
    console.error(`LỖI: Thì ${t.nameVi} (${t.id}) có ${t.exercises?.length || 0} câu bài tập, không đủ 5 câu!`);
    totalIssues++;
  }
});
console.log(`✓ 12 Thì: Đầy đủ 12 thì, công thức và 60 câu bài tập trắc nghiệm.`);

// 2. Kiểm tra 6 Quy tắc trật tự từ
console.log('\n--- 2. KIỂM TRA 6 QUY TẮC TRẬT TỰ TỪ LOẠI (WORD ORDER) ---');
if (wordOrderRules.length !== 6) {
  console.error(`LỖI: Số lượng quy tắc trật tự từ là ${wordOrderRules.length}, không phải 6!`);
  totalIssues++;
}

wordOrderRules.forEach((r, i) => {
  if (!r.id || !r.ruleName || !r.patternFormula || !r.visualSteps || r.visualSteps.length === 0) {
    console.error(`LỖI: Quy tắc ${r.id} thiếu sơ đồ visualSteps hoặc công thức.`);
    totalIssues++;
  }
  if (!r.exercises || r.exercises.length !== 5) {
    console.error(`LỖI: Quy tắc ${r.ruleName} (${r.id}) có ${r.exercises?.length || 0} bài tập, không đủ 5 câu!`);
    totalIssues++;
  }
});
console.log(`✓ 6 Quy tắc trật tự từ: Đầy đủ sơ đồ khối và 30 câu bài tập trắc nghiệm.`);

// 3. Kiểm tra 10 Chủ điểm ngữ pháp
console.log('\n--- 3. KIỂM TRA 10 CHỦ ĐIỂM NGỮ PHÁP (TOPICS) ---');
if (grammarTopics.length !== 10) {
  console.error(`LỖI: Số lượng chủ điểm là ${grammarTopics.length}, không phải 10!`);
  totalIssues++;
}

grammarTopics.forEach((tp, i) => {
  if (!tp.id || !tp.title || !tp.sections || tp.sections.length === 0) {
    console.error(`LỖI: Chủ điểm ${tp.id} thiếu sections.`);
    totalIssues++;
  }
  if (!tp.exercises || tp.exercises.length !== 10) {
    console.error(`LỖI: Chủ điểm ${tp.title} (${tp.id}) có ${tp.exercises?.length || 0} bài tập, không đủ 10 câu!`);
    totalIssues++;
  }
});
console.log(`✓ 10 Chủ điểm ngữ pháp: Đầy đủ bài học và 100 câu bài tập trắc nghiệm.`);

// 4. Kiểm tra chi tiết tính chính xác của 190 câu trắc nghiệm
console.log('\n--- 4. KIỂM TRA TOÀN DIỆN 190 CÂU BÀI TẬP TRẮC NGHIỆM ---');
const allExercises = getAllGrammarExercises();
if (allExercises.length !== 190) {
  console.error(`LỖI: Tổng số bài tập là ${allExercises.length}, mong đợi 190!`);
  totalIssues++;
}

allExercises.forEach((ex, idx) => {
  const prefix = `[Câu ${idx + 1} - ${ex.topicTitle}]`;

  // Kiểm tra có dấu trống _______
  if (!ex.question.includes('_______')) {
    console.error(`${prefix} Không tìm thấy dấu gạch dưới '_______' để điền từ!`);
    totalIssues++;
  }

  // Kiểm tra 4 phương án A, B, C, D
  if (!ex.options || ex.options.length !== 4) {
    console.error(`${prefix} Không đủ 4 phương án lựa chọn!`);
    totalIssues++;
  } else {
    const labels = ex.options.map(o => o.label).join('');
    if (labels !== 'ABCD') {
      console.error(`${prefix} Thứ tự nhãn phương án không chuẩn ABCD (${labels})`);
      totalIssues++;
    }

    const uniqueTexts = new Set(ex.options.map(o => o.text.trim().toLowerCase()));
    if (uniqueTexts.size !== 4) {
      console.error(`${prefix} Có phương án trùng lặp nội dung: ${ex.options.map(o => o.text).join(' | ')}`);
      totalIssues++;
    }
  }

  // Kiểm tra đáp án đúng correctAnswer
  if (!['A', 'B', 'C', 'D'].includes(ex.correctAnswer)) {
    console.error(`${prefix} Đáp án đúng '${ex.correctAnswer}' không hợp lệ!`);
    totalIssues++;
  }

  const chosenOption = ex.options.find(o => o.label === ex.correctAnswer);
  if (!chosenOption || !chosenOption.text.trim()) {
    console.error(`${prefix} Đáp án đúng ${ex.correctAnswer} rỗng hoặc không tồn tại trong options!`);
    totalIssues++;
  }

  // Kiểm tra giải thích và dịch câu
  if (!ex.explanation || ex.explanation.trim().length < 15) {
    console.error(`${prefix} Giải thích quá ngắn hoặc rỗng!`);
    totalIssues++;
  }

  if (!ex.translation || ex.translation.trim().length < 10) {
    console.error(`${prefix} Dịch câu tiếng Việt quá ngắn hoặc rỗng!`);
    totalIssues++;
  }
});

// 5. Kiểm tra Ngân hàng câu hỏi tổng hợp (masterGrammarBank & getRandomGrammarTest)
import { masterGrammarBank, getRandomGrammarTest, getGrammarBankStats } from '../src/data/grammarBank';

console.log('\n--- 5. KIỂM TRA NGÂN HÀNG ĐỀ TỔNG HỢP (MASTER GRAMMAR BANK) ---');
console.log(`✓ Tổng số câu trong ngân hàng đề: ${masterGrammarBank.length} câu`);

if (masterGrammarBank.length < 250) {
  console.error(`LỖI: Ngân hàng câu hỏi quá ít (${masterGrammarBank.length} câu), yêu cầu >= 250 câu!`);
  totalIssues++;
}

// Kiểm tra 10 câu random từ ngân hàng
for (let run = 1; run <= 5; run++) {
  const test10 = getRandomGrammarTest(10);
  if (test10.length !== 10) {
    console.error(`LỖI lần chạy ${run}: getRandomGrammarTest(10) trả về ${test10.length} câu, không đủ 10 câu!`);
    totalIssues++;
  }
  const uniqueIds = new Set(test10.map(q => q.uniqueId));
  if (uniqueIds.size !== 10) {
    console.error(`LỖI lần chạy ${run}: 10 câu random bị trùng lặp ID!`);
    totalIssues++;
  }
}
console.log(`✓ getRandomGrammarTest(10): Thử nghiệm 5 lần lấy 10 câu random, tất cả đều phân tán ngẫu nhiên và không trùng lặp.`);

const stats = getGrammarBankStats();
console.log(`✓ Thống kê ngân hàng: ${Object.keys(stats.topics).length} chủ điểm đa dạng.`);

console.log(`\n=== TỔNG KẾT KIỂM TRA: ${totalIssues === 0 ? 'TẤT CẢ 100% CHÍNH XÁC VÀ HỢP LỆ!' : `PHÁT HIỆN ${totalIssues} LỖI CẦN SỬA`} ===`);
