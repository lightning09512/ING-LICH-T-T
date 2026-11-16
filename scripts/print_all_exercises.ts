import { grammarTopics, fullTwelveTenses, wordOrderRules, getAllGrammarExercises } from '../src/data/grammarData';

console.log('=== CHI TIẾT TỪNG NHÓM BÀI TẬP VÀ ĐÁP ÁN THỰC CHIẾN ===\n');

// 1. Kiểm tra 12 Thì: In ra từng câu hỏi và đáp án đã điền
console.log('--- PHẦN 1: BÀI TẬP 12 THÌ (60 CÂU) ---');
fullTwelveTenses.forEach((tense) => {
  console.log(`\n▶ Thì: ${tense.nameVi} (${tense.nameEn}) [${tense.exercises.length} câu]:`);
  tense.exercises.forEach((ex, idx) => {
    const opt = ex.options.find(o => o.label === ex.correctAnswer);
    const filled = ex.question.replace('_______', `[${opt?.text}]`);
    console.log(`  ${idx + 1}. [Đáp án ${ex.correctAnswer}] ${filled}`);
  });
});

// 2. Kiểm tra Trật tự từ: In ra từng câu hỏi và đáp án đã điền
console.log('\n--- PHẦN 2: BÀI TẬP TRẬT TỰ TỪ LOẠI (30 CÂU) ---');
wordOrderRules.forEach((rule) => {
  console.log(`\n▶ Quy tắc: ${rule.ruleName} [${rule.exercises.length} câu]:`);
  rule.exercises.forEach((ex, idx) => {
    const opt = ex.options.find(o => o.label === ex.correctAnswer);
    const filled = ex.question.replace('_______', `[${opt?.text}]`);
    console.log(`  ${idx + 1}. [Đáp án ${ex.correctAnswer}] ${filled}`);
  });
});

// 3. Kiểm tra 10 Chủ điểm: In ra từng câu hỏi và đáp án đã điền
console.log('\n--- PHẦN 3: BÀI TẬP 10 CHỦ ĐIỂM NGỮ PHÁP (100 CÂU) ---');
grammarTopics.forEach((topic) => {
  console.log(`\n▶ Chủ điểm: ${topic.title} [${topic.exercises.length} câu]:`);
  topic.exercises.forEach((ex, idx) => {
    const opt = ex.options.find(o => o.label === ex.correctAnswer);
    const filled = ex.question.replace('_______', `[${opt?.text}]`);
    console.log(`  ${idx + 1}. [Đáp án ${ex.correctAnswer}] ${filled}`);
  });
});
