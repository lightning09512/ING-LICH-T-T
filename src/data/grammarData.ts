export interface GrammarExercise {
  id: number;
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  translation: string;
}

export interface GrammarSection {
  title: string;
  formula?: string;
  formulaBreakdown?: { token: string; label: string; color: string }[];
  notes?: string[];
  examples?: { en: string; vi: string; highlight?: string }[];
  traps?: string[];
  isHighFrequency?: boolean;
  examBadge?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  difficulty: 'Cơ bản (450+)' | 'Trung cấp (650+)' | 'Nâng cao (800+)';
  summary: string;
  sections: GrammarSection[];
  exercises: GrammarExercise[];
  isHighFrequency?: boolean;
  examFrequencyBadge?: string;
}

// ----------------------------------------------------
// FULL 12 ENGLISH TENSES MASTER DATA (STRUCTURED & VISUAL)
// ----------------------------------------------------
export interface TenseFormulaBlock {
  typeLabel: string; // e.g. "Động từ thường (Regular Verbs)" or "Động từ TO BE"
  affirmative: string;
  negative: string;
  question: string;
  exampleAffirmative: { en: string; vi: string };
  exampleNegative: { en: string; vi: string };
  exampleQuestion: { en: string; vi: string };
}

export interface TenseItem {
  id: string;
  nameEn: string;
  nameVi: string;
  group: 'PRESENT' | 'PAST' | 'FUTURE';
  summaryBadge: string;
  formulaBlocks: TenseFormulaBlock[];
  usage: string[];
  signalWords: string[];
  examples: { en: string; vi: string }[];
  toeicTrap: string;
  isHighFrequency?: boolean;
  examBadge?: string;
}

export const fullTwelveTenses: TenseItem[] = [
  // 1. PRESENT SIMPLE
  {
    id: 'present-simple',
    nameEn: 'Present Simple',
    nameVi: 'Hiện tại đơn',
    group: 'PRESENT',
    summaryBadge: 'Diễn tả thói quen, lịch trình, sự thật',
    isHighFrequency: true,
    examBadge: '🔥 90% GẶP (MỆNH ĐỀ THỜI GIAN)',
    formulaBlocks: [
      {
        typeLabel: 'Động từ thường (Action Verbs)',
        affirmative: 'S + V(s/es) + (O)',
        negative: 'S + do not / does not + V-inf',
        question: 'Do / Does + S + V-inf?',
        exampleAffirmative: {
          en: 'The shuttle bus departs every 30 minutes.',
          vi: 'Xe buýt đưa đón khởi hành mỗi 30 phút một chuyến.'
        },
        exampleNegative: {
          en: 'The branch office does not open on weekends.',
          vi: 'Văn phòng chi nhánh không mở cửa vào cuối tuần.'
        },
        exampleQuestion: {
          en: 'Does Mr. Watson inspect the production line every morning?',
          vi: 'Ông Watson có kiểm tra dây chuyền sản xuất mỗi buổi sáng không?'
        }
      },
      {
        typeLabel: 'Động từ TO BE (am / is / are)',
        affirmative: 'S + am / is / are + [Tính từ / Danh từ]',
        negative: 'S + am / is / are + not + [Tính từ / Danh từ]',
        question: 'Am / Is / Are + S + [Tính từ / Danh từ]?',
        exampleAffirmative: {
          en: 'The quarterly financial report is ready.',
          vi: 'Báo cáo tài chính quý đã sẵn sàng.'
        },
        exampleNegative: {
          en: 'These documents are not confidential.',
          vi: 'Những tài liệu này không phải là tài liệu bảo mật.'
        },
        exampleQuestion: {
          en: 'Is the new marketing policy effective immediately?',
          vi: 'Chính sách tiếp thị mới có hiệu lực ngay lập tức không?'
        }
      }
    ],
    usage: [
      'Diễn tả sự thật hiển nhiên, chân lý khoa học không đổi.',
      'Thói quen, phong tục, hoạt động lặp đi lặp lại ở hiện tại.',
      'Lịch trình tàu xe, máy bay, sự kiện theo thời khóa biểu cố định.',
      'Khả năng, nghề nghiệp, trạng thái ổn định hiện tại.'
    ],
    signalWords: [
      'always', 'usually', 'often', 'frequently', 'regularly', 'sometimes', 
      'rarely', 'seldom', 'never', 'every day/week/month', 'currently', 'generally'
    ],
    examples: [
      {
        en: 'The flight from Seoul departs at 7:30 AM every weekday.',
        vi: 'Chuyến bay từ Seoul khởi hành vào lúc 7:30 sáng mỗi ngày trong tuần.'
      },
      {
        en: 'Mr. Henderson supervises the quality control division.',
        vi: 'Ông Henderson giám sát bộ phận kiểm soát chất lượng.'
      }
    ],
    toeicTrap: 'ETS hay kiểm tra động từ chỉ trạng thái (stative verbs như belong to, contain, consist of, know) tuyệt đối KHÔNG chia ở tiếp diễn, bắt buộc dùng Hiện tại đơn.'
  },

  // 2. PRESENT CONTINUOUS
  {
    id: 'present-continuous',
    nameEn: 'Present Continuous',
    nameVi: 'Hiện tại tiếp diễn',
    group: 'PRESENT',
    summaryBadge: 'Đang diễn ra hoặc kế hoạch tương lai gần',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + am / is / are + V-ing',
        negative: 'S + am / is / are + not + V-ing',
        question: 'Am / Is / Are + S + V-ing?',
        exampleAffirmative: {
          en: 'Our engineering department is currently updating the servers.',
          vi: 'Phòng kỹ thuật hiện đang cập nhật máy chủ.'
        },
        exampleNegative: {
          en: 'The technicians are not working on the elevator today.',
          vi: 'Các kỹ thuật viên hôm nay không làm việc tại thang máy.'
        },
        exampleQuestion: {
          en: 'Are the architects reviewing the construction blueprints right now?',
          vi: 'Các kiến trúc sư có đang xem lại bản vẽ xây dựng ngay lúc này không?'
        }
      }
    ],
    usage: [
      'Hành động đang diễn ra ngay tại thời điểm nói.',
      'Hành động đang diễn ra xung quanh thời điểm nói (dự án đang triển khai).',
      'Kế hoạch, lịch trình đã được sắp xếp cụ thể trong tương lai gần.',
      'Xu hướng hoặc sự thay đổi đang diễn biến (getting, becoming, increasing).'
    ],
    signalWords: [
      'now', 'right now', 'at the moment', 'at present', 'currently', 'Look!', 'Listen!'
    ],
    examples: [
      {
        en: 'Our engineering department is currently updating the company servers.',
        vi: 'Phòng kỹ thuật của chúng tôi hiện đang cập nhật các máy chủ của công ty.'
      },
      {
        en: 'Housing prices in the metropolitan area are increasing rapidly.',
        vi: 'Giá nhà ở khu vực đô thị đang tăng lên nhanh chóng.'
      }
    ],
    toeicTrap: 'Từ "currently" có thể đi với Hiện tại tiếp diễn (đang làm gì) hoặc Hiện tại đơn (vị trí/vai trò hiện tại).'
  },

  // 3. PRESENT PERFECT
  {
    id: 'present-perfect',
    nameEn: 'Present Perfect',
    nameVi: 'Hiện tại hoàn thành',
    group: 'PRESENT',
    summaryBadge: 'Kéo dài từ quá khứ đến nay, vừa mới xảy ra',
    isHighFrequency: true,
    examBadge: '🔥 CHIẾM 40% CÂU THÌ (SINCE/FOR)',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + have / has + V3/ed',
        negative: 'S + have / has + not (haven\'t / hasn\'t) + V3/ed',
        question: 'Have / Has + S + V3/ed?',
        exampleAffirmative: {
          en: 'The company has expanded into three European countries.',
          vi: 'Công ty đã mở rộng sang ba quốc gia châu Âu.'
        },
        exampleNegative: {
          en: 'The committee has not finalized the selection criteria yet.',
          vi: 'Ủy ban vẫn chưa chốt các tiêu chí lựa chọn.'
        },
        exampleQuestion: {
          en: 'Have you received the signed contract from the client?',
          vi: 'Bạn đã nhận được hợp đồng có chữ ký từ khách hàng chưa?'
        }
      }
    ],
    usage: [
      'Hành động bắt đầu trong quá khứ, kéo dài liên tục đến hiện tại và có thể tiếp diễn.',
      'Hành động vừa mới xảy ra (just, recently, lately) để lại kết quả ở hiện tại.',
      'Trải nghiệm tính đến thời điểm hiện tại (ever, never, so far).',
      'Hành động đã hoàn thành trước thời điểm mong đợi (already, yet).'
    ],
    signalWords: [
      'since (+ mốc)', 'for (+ khoảng)', 'already', 'yet', 'just', 'recently', 
      'lately', 'so far', 'up to now', 'over/in the past/last + thời gian'
    ],
    examples: [
      {
        en: 'Ms. Tanaka has managed the accounting department for over eight years.',
        vi: 'Cô Tanaka đã quản lý phòng kế toán được hơn tám năm.'
      },
      {
        en: 'The startup has secured substantial funding over the past six months.',
        vi: 'Công ty khởi nghiệp đã đảm bảo được nguồn tài trợ đáng kể trong sáu tháng qua.'
      }
    ],
    toeicTrap: 'Cụm "in/over/during the past/last + khoảng thời gian" (vd: in the last 3 years) là dấu hiệu 100% của thì Hiện tại hoàn thành, KHÔNG chia quá khứ đơn.'
  },

  // 4. PRESENT PERFECT CONTINUOUS
  {
    id: 'present-perfect-continuous',
    nameEn: 'Present Perfect Continuous',
    nameVi: 'Hiện tại hoàn thành tiếp diễn',
    group: 'PRESENT',
    summaryBadge: 'Nhấn mạnh hành động diễn ra liên tục không ngừng',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + have / has + been + V-ing',
        negative: 'S + have / has + not + been + V-ing',
        question: 'Have / Has + S + been + V-ing?',
        exampleAffirmative: {
          en: 'The negotiators have been discussing terms for four hours.',
          vi: 'Các nhà đàm phán đã thảo luận các điều khoản liên tục suốt bốn giờ.'
        },
        exampleNegative: {
          en: 'We have not been receiving customer complaints recently.',
          vi: 'Dạo gần đây chúng tôi không còn nhận phải khiếu nại của khách hàng.'
        },
        exampleQuestion: {
          en: 'How long have they been developing this AI model?',
          vi: 'Họ đã phát triển mô hình AI này liên tục được bao lâu rồi?'
        }
      }
    ],
    usage: [
      'Nhấn mạnh tính LIÊN TỤC KHÔNG NGỪNG NGHỈ của một hành động bắt đầu từ quá khứ đến hiện tại.',
      'Hành động vừa mới dừng lại nhưng kết quả vẫn còn rõ rệt ở hiện tại.'
    ],
    signalWords: [
      'all morning/day/week', 'since', 'for', 'how long'
    ],
    examples: [
      {
        en: 'The negotiators have been discussing the contractual terms all morning without a break.',
        vi: 'Các nhà đàm phán đã thảo luận về các điều khoản hợp đồng suốt cả buổi sáng mà không nghỉ giải lao.'
      }
    ],
    toeicTrap: 'Khác biệt với HTHT: HTHT nhấn mạnh KẾT QUẢ/SỐ LƯỢNG (đã làm xong bao nhiêu), còn HTHTTD nhấn mạnh QUÁ TRÌNH LIÊN TỤC và THỜI GIAN KÉO DÀI.'
  },

  // 5. PAST SIMPLE
  {
    id: 'past-simple',
    nameEn: 'Past Simple',
    nameVi: 'Quá khứ đơn',
    group: 'PAST',
    summaryBadge: 'Đã hoàn tất hoàn toàn tại thời điểm quá khứ xác định',
    isHighFrequency: true,
    examBadge: '🔥 MỐC THỜI GIAN QUÁ KHỨ',
    formulaBlocks: [
      {
        typeLabel: 'Động từ thường (Regular & Irregular Verbs)',
        affirmative: 'S + V2/ed + (O)',
        negative: 'S + did not (didn\'t) + V-inf',
        question: 'Did + S + V-inf?',
        exampleAffirmative: {
          en: 'The company launched its first smartphone in 2018.',
          vi: 'Công ty đã ra mắt chiếc điện thoại thông minh đầu tiên vào năm 2018.'
        },
        exampleNegative: {
          en: 'The vendor did not deliver the replacement parts yesterday.',
          vi: 'Nhà cung cấp đã không giao các linh kiện thay thế vào hôm qua.'
        },
        exampleQuestion: {
          en: 'Did you attend the international trade seminar last Friday?',
          vi: 'Bạn có tham dự buổi hội thảo thương mại quốc tế vào thứ Sáu tuần trước không?'
        }
      },
      {
        typeLabel: 'Động từ TO BE (was / were)',
        affirmative: 'S + was / were + [Tính từ / Danh từ]',
        negative: 'S + was / were + not (wasn\'t / weren\'t)',
        question: 'Was / Were + S + [Tính từ / Danh từ]?',
        exampleAffirmative: {
          en: 'The keynote speaker was extremely engaging.',
          vi: 'Diễn giả chính đã vô cùng lôi cuốn.'
        },
        exampleNegative: {
          en: 'The boardroom was not available yesterday afternoon.',
          vi: 'Phòng họp hội đồng đã không có sẵn vào chiều hôm qua.'
        },
        exampleQuestion: {
          en: 'Were all regional managers present at the briefing?',
          vi: 'Tất cả các quản lý khu vực có mặt tại buổi họp giao ban không?'
        }
      }
    ],
    usage: [
      'Hành động đã xảy ra và CHẤM DỨT HOÀN TOÀN trong quá khứ tại một thời điểm xác định.',
      'Chuỗi các hành động liên tiếp xảy ra trong quá khứ.',
      'Thói quen hoặc trạng thái trong quá khứ đã không còn nữa.'
    ],
    signalWords: [
      'yesterday', 'ago', 'last week/month/year', 'in 2021', 'previously', 'formerly', 'originally'
    ],
    examples: [
      {
        en: 'The corporation officially acquired the regional competitor last November.',
        vi: 'Tập đoàn đã chính thức mua lại đối thủ cạnh tranh khu vực vào tháng 11 năm ngoái.'
      }
    ],
    toeicTrap: 'Nếu trong câu có mốc thời gian quá khứ rõ ràng (yesterday, in 2019, 2 years ago), TUYỆT ĐỐI KHÔNG chọn Hiện tại hoàn thành mà PHẢI CHỌN Quá khứ đơn.'
  },

  // 6. PAST CONTINUOUS
  {
    id: 'past-continuous',
    nameEn: 'Past Continuous',
    nameVi: 'Quá khứ tiếp diễn',
    group: 'PAST',
    summaryBadge: 'Đang xảy ra tại thời điểm quá khứ hoặc bị xen ngang',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + was / were + V-ing',
        negative: 'S + was / were + not + V-ing',
        question: 'Was / Were + S + V-ing?',
        exampleAffirmative: {
          en: 'At 10 PM yesterday, the technicians were testing the backup server.',
          vi: 'Lúc 10 giờ tối hôm qua, các kỹ thuật viên đang kiểm tra máy chủ sao lưu.'
        },
        exampleNegative: {
          en: 'The director was not speaking when the fire alarm rang.',
          vi: 'Giám đốc đang không phát biểu khi chuông báo cháy reo.'
        },
        exampleQuestion: {
          en: 'Were you working on the financial report when the power cut occurred?',
          vi: 'Bạn có đang làm báo cáo tài chính khi xảy ra sự cố cúp điện không?'
        }
      }
    ],
    usage: [
      'Hành động đang diễn ra tại một thời điểm xác định trong quá khứ (At 8 PM yesterday).',
      'Một hành động đang xảy ra trong quá khứ thì một hành động khác xen vào (When + Past Simple, Past Continuous).',
      'Hai hành động diễn ra song song cùng lúc trong quá khứ (While + Past Continuous, Past Continuous).'
    ],
    signalWords: [
      'at that time', 'at 10 AM yesterday', 'while', 'when', 'as'
    ],
    examples: [
      {
        en: 'While the technical team was upgrading the database, a sudden power failure occurred.',
        vi: 'Trong khi đội kỹ thuật đang nâng cấp cơ sở dữ liệu, một sự cố mất điện bất ngờ đã xảy ra.'
      }
    ],
    toeicTrap: 'Cấu trúc kinh điển: While + S + was/were + V-ing (hành động dài), S + V2/ed (hành động ngắn chen ngang).'
  },

  // 7. PAST PERFECT
  {
    id: 'past-perfect',
    nameEn: 'Past Perfect',
    nameVi: 'Quá khứ hoàn thành',
    group: 'PAST',
    summaryBadge: 'Hoàn tất TRƯỚC một hành động khác trong quá khứ',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + had + V3/ed',
        negative: 'S + had not (hadn\'t) + V3/ed',
        question: 'Had + S + V3/ed?',
        exampleAffirmative: {
          en: 'The presentation had ended before the CEO entered the room.',
          vi: 'Bài thuyết trình đã kết thúc trước khi Tổng giám đốc bước vào phòng.'
        },
        exampleNegative: {
          en: 'They had not reached an agreement by the deadline.',
          vi: 'Họ vẫn chưa đạt được thỏa thuận trước thời hạn chót.'
        },
        exampleQuestion: {
          en: 'Had the software been tested before it was released to the public?',
          vi: 'Phần mềm đã được kiểm thử trước khi phát hành ra công chúng chưa?'
        }
      }
    ],
    usage: [
      'Hành động xảy ra và HOÀN TẤT TRƯỚC một hành động hoặc một mốc thời gian khác trong quá khứ.',
      'Dùng trong câu điều kiện loại 3.'
    ],
    signalWords: [
      'by the time (+ Past Simple)', 'before (+ Past Simple)', 'after (+ Past Perfect)', 
      'when', 'had hardly/scarcely... when'
    ],
    examples: [
      {
        en: 'By the time the director arrived at the venue, the keynote presentation had already concluded.',
        vi: 'Trước lúc giám đốc đến địa điểm, bài thuyết trình chính đã kết thúc rồi.'
      }
    ],
    toeicTrap: 'Công thức vàng TOEIC: "By the time + S + V2/ed, S + HAD + V3/ed". Nhìn thấy By the time đi với quá khứ đơn thì vế kia 99% chọn Had + V3/ed.'
  },

  // 8. PAST PERFECT CONTINUOUS
  {
    id: 'past-perfect-continuous',
    nameEn: 'Past Perfect Continuous',
    nameVi: 'Quá khứ hoàn thành tiếp diễn',
    group: 'PAST',
    summaryBadge: 'Kéo dài liên tục trước một sự kiện trong quá khứ',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + had + been + V-ing',
        negative: 'S + had not + been + V-ing',
        question: 'Had + S + been + V-ing?',
        exampleAffirmative: {
          en: 'She had been researching market trends for months before writing the report.',
          vi: 'Cô ấy đã nghiên cứu xu hướng thị trường liên tục nhiều tháng trước khi viết báo cáo.'
        },
        exampleNegative: {
          en: 'The engine had not been functioning properly before it broke down.',
          vi: 'Động cơ đã không hoạt động trơn tru trong thời gian dài trước khi nó bị hỏng.'
        },
        exampleQuestion: {
          en: 'How long had they been waiting before the flight was announced?',
          vi: 'Họ đã chờ đợi liên tục bao lâu trước khi chuyến bay được thông báo?'
        }
      }
    ],
    usage: [
      'Nhấn mạnh tính liên tục kéo dài của một hành động trước khi một hành động khác xảy ra trong quá khứ.',
      'Chỉ nguyên nhân của một trạng thái hoặc sự việc trong quá khứ.'
    ],
    signalWords: [
      'for (+ khoảng thời gian) + before (+ mốc quá khứ)', 'until then'
    ],
    examples: [
      {
        en: 'Mr. Clark had been driving for four hours before he realized he took the wrong exit.',
        vi: 'Ông Clark đã lái xe liên tục suốt bốn giờ trước khi nhận ra mình đã đi nhầm lối rẽ.'
      }
    ],
    toeicTrap: 'Có xuất hiện từ "for + thời gian" nhưng đi kèm với một mốc trong quá khứ ("before he retired") -> Chọn Quá khứ hoàn thành tiếp diễn hoặc Quá khứ hoàn thành.'
  },

  // 9. FUTURE SIMPLE & NEAR FUTURE
  {
    id: 'future-simple',
    nameEn: 'Future Simple & Be Going To',
    nameVi: 'Tương lai đơn & Tương lai gần',
    group: 'FUTURE',
    summaryBadge: 'Dự đoán, quyết định tức thì & Kế hoạch định trước',
    isHighFrequency: true,
    examBadge: '🚨 BẪY PHỐI THÌ WILL VS HIỆN TẠI',
    formulaBlocks: [
      {
        typeLabel: 'Tương lai đơn (Will + V-inf)',
        affirmative: 'S + will + V-inf',
        negative: 'S + will not (won\'t) + V-inf',
        question: 'Will + S + V-inf?',
        exampleAffirmative: {
          en: 'The board will review the proposal next Monday.',
          vi: 'Hội đồng quản trị sẽ xem xét bản đề xuất vào thứ Hai tới.'
        },
        exampleNegative: {
          en: 'The company will not renew the commercial lease.',
          vi: 'Công ty sẽ không gia hạn hợp đồng thuê mặt bằng thương mại.'
        },
        exampleQuestion: {
          en: 'Will you send me the revised spreadsheet before 4 PM?',
          vi: 'Bạn sẽ gửi cho tôi bảng tính sửa đổi trước 4 giờ chiều chứ?'
        }
      },
      {
        typeLabel: 'Tương lai gần (Be going to)',
        affirmative: 'S + am / is / are + going to + V-inf',
        negative: 'S + am / is / are + not + going to + V-inf',
        question: 'Am / Is / Are + S + going to + V-inf?',
        exampleAffirmative: {
          en: 'We are going to hire five new developers next month.',
          vi: 'Chúng tôi dự định sẽ tuyển năm lập trình viên mới vào tháng tới.'
        },
        exampleNegative: {
          en: 'The firm is not going to open any branches this year.',
          vi: 'Công ty không có kế hoạch mở bất kỳ chi nhánh nào trong năm nay.'
        },
        exampleQuestion: {
          en: 'Are they going to participate in the upcoming exhibition?',
          vi: 'Họ có dự định tham gia vào buổi triển lãm sắp tới không?'
        }
      }
    ],
    usage: [
      'Will: Quyết định tức thì tại thời điểm nói, lời hứa, đề nghị, dự đoán không căn cứ.',
      'Be going to: Dự định, kế hoạch đã lên từ trước hoặc dự đoán có bằng chứng cụ thể ở hiện tại.',
      'Trong TOEIC, Will rất phổ biến trong các thông báo chính sách, lời cam kết doanh nghiệp.'
    ],
    signalWords: [
      'tomorrow', 'next week/month/year', 'soon', 'shortly', 'in the upcoming days'
    ],
    examples: [
      {
        en: 'The board of directors will announce the quarterly dividend next Monday.',
        vi: 'Hội đồng quản trị sẽ công bố cổ tức hàng quý vào thứ Hai tới.'
      }
    ],
    toeicTrap: 'BẪY LỚN NHẤT TOEIC: Mệnh đề trạng từ thời gian (bắt đầu bằng When, As soon as, Before, After, Once) TUYỆT ĐỐI KHÔNG DÙNG WILL. Mệnh đề phụ chia Hiện tại đơn, mệnh đề chính chia Tương lai đơn!'
  },

  // 10. FUTURE CONTINUOUS
  {
    id: 'future-continuous',
    nameEn: 'Future Continuous',
    nameVi: 'Tương lai tiếp diễn',
    group: 'FUTURE',
    summaryBadge: 'Đang diễn ra tại một mốc thời gian cụ thể tương lai',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + will be + V-ing',
        negative: 'S + will not be (won\'t be) + V-ing',
        question: 'Will + S + be + V-ing?',
        exampleAffirmative: {
          en: 'At 10:00 AM tomorrow, the sales reps will be meeting clients.',
          vi: 'Lúc 10:00 sáng mai, các đại diện bán hàng sẽ đang gặp gỡ khách hàng.'
        },
        exampleNegative: {
          en: 'I will not be using the conference room this afternoon.',
          vi: 'Tôi sẽ không sử dụng phòng hội nghị vào chiều nay.'
        },
        exampleQuestion: {
          en: 'Will you be visiting our headquarters during your trip to Tokyo?',
          vi: 'Bạn sẽ ghé thăm trụ sở chính của chúng tôi trong chuyến đi đến Tokyo chứ?'
        }
      }
    ],
    usage: [
      'Hành động sẽ đang diễn ra tại một thời điểm hoặc khoảng thời gian xác định trong tương lai.',
      'Hành động sẽ xảy ra như một phần của kế hoạch hay thói quen thông thường.'
    ],
    signalWords: [
      'at this time tomorrow', 'at 9:00 AM next Tuesday', 'this time next week'
    ],
    examples: [
      {
        en: 'At 10:00 AM tomorrow, our sales representatives will be attending the annual trade expo.',
        vi: 'Vào lúc 10:00 sáng mai, các đại diện bán hàng của chúng tôi sẽ đang tham dự hội chợ triển lãm thương mại thường niên.'
      }
    ],
    toeicTrap: 'Nhìn thấy mốc giờ cụ thể ở tương lai ("At 3 PM tomorrow") thì ưu tiên chọn Tương lai tiếp diễn (will be + V-ing).'
  },

  // 11. FUTURE PERFECT
  {
    id: 'future-perfect',
    nameEn: 'Future Perfect',
    nameVi: 'Tương lai hoàn thành',
    group: 'FUTURE',
    summaryBadge: 'Hoàn tất TRƯỚC một thời điểm/hành động tương lai',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + will have + V3/ed',
        negative: 'S + will not have (won\'t have) + V3/ed',
        question: 'Will + S + have + V3/ed?',
        exampleAffirmative: {
          en: 'By next Friday, the contractors will have finished the renovation.',
          vi: 'Trước thứ Sáu tới, các nhà thầu sẽ hoàn thành việc tu sửa.'
        },
        exampleNegative: {
          en: 'We will not have completed the audit before the board meeting.',
          vi: 'Chúng tôi sẽ chưa thể hoàn thành cuộc kiểm toán trước cuộc họp hội đồng quản trị.'
        },
        exampleQuestion: {
          en: 'Will the shipment have arrived by the end of this week?',
          vi: 'Lô hàng sẽ đến nơi trước cuối tuần này chứ?'
        }
      }
    ],
    usage: [
      'Hành động sẽ được HOÀN TẤT TRƯỚC một thời điểm hoặc một hành động khác trong tương lai.',
      'Cực kỳ hay thi trong Part 5 với cụm "By + mốc tương lai"!'
    ],
    signalWords: [
      'by (+ mốc tương lai)', 'by the end of this year/month', 'by the time + S + V(hiện tại đơn)'
    ],
    examples: [
      {
        en: 'By the end of this fiscal year, our company will have completed the new factory construction.',
        vi: 'Trước cuối năm tài chính này, công ty chúng tôi sẽ hoàn thành việc xây dựng nhà máy mới.'
      }
    ],
    toeicTrap: 'Công thức đối xứng: "By the time + S + V(hiện tại đơn), S + WILL HAVE + V3/ed". Rất dễ nhầm với Quá khứ hoàn thành!'
  },

  // 12. FUTURE PERFECT CONTINUOUS
  {
    id: 'future-perfect-continuous',
    nameEn: 'Future Perfect Continuous',
    nameVi: 'Tương lai hoàn thành tiếp diễn',
    group: 'FUTURE',
    summaryBadge: 'Kéo dài liên tục tính đến một mốc tương lai',
    formulaBlocks: [
      {
        typeLabel: 'Công thức chung',
        affirmative: 'S + will have been + V-ing',
        negative: 'S + will not have been + V-ing',
        question: 'Will + S + have been + V-ing?',
        exampleAffirmative: {
          en: 'By next year, Ms. Davis will have been teaching here for 15 years.',
          vi: 'Tính đến năm tới, cô Davis sẽ giảng dạy liên tục tại đây được 15 năm.'
        },
        exampleNegative: {
          en: 'They will not have been operating for long before profitability arrives.',
          vi: 'Họ sẽ không phải vận hành quá lâu trước khi đạt được mức sinh lời.'
        },
        exampleQuestion: {
          en: 'How long will they have been negotiating by the end of this summit?',
          vi: 'Họ sẽ đàm phán liên tục được bao lâu tính đến cuối hội nghị thượng đỉnh này?'
        }
      }
    ],
    usage: [
      'Nhấn mạnh khoảng thời gian kéo dài liên tục của một hành động tính tới một mốc thời gian trong tương lai.'
    ],
    signalWords: [
      'by + mốc tương lai + for + khoảng thời gian'
    ],
    examples: [
      {
        en: 'By next December, Dr. Adams will have been working at this university for thirty years.',
        vi: 'Tính đến tháng 12 tới, Tiến sĩ Adams sẽ làm việc liên tục tại trường đại học này được đúng ba mươi năm.'
      }
    ],
    toeicTrap: 'Dấu hiệu là sự kết hợp của cả "By + tương lai" và "For + khoảng thời gian kéo dài".'
  }
];

// ----------------------------------------------------
// WORD ORDER & PARTS OF SPEECH (VISUAL CHAIN FLOW)
// ----------------------------------------------------
export interface WordOrderStep {
  token: string;
  label: string;
  color: 'yellow' | 'blue' | 'green' | 'purple' | 'gray' | 'red';
  sampleWord: string;
  isKey?: boolean;
}

export interface WordOrderRule {
  id: string;
  ruleName: string;
  patternFormula: string;
  badge: string;
  visualSteps: WordOrderStep[];
  coreRule: string;
  explanation: string[];
  examples: { en: string; vi: string; note?: string }[];
  commonMistakes: string;
  etsTip: string;
  isHighFrequency?: boolean;
  examBadge?: string;
}

export const wordOrderRules: WordOrderRule[] = [
  {
    id: 'adv-before-verb',
    ruleName: 'Trạng Từ Đứng Trước Động Từ Thường (Adv + Verb)',
    patternFormula: 'Chủ ngữ (S) + TRẠNG TỪ (Adv -ly) + ĐỘNG TỪ (Verb)',
    badge: 'Chiếm 35% Câu Từ Loại',
    isHighFrequency: true,
    examBadge: '🔥 CHIẾM 35% TỪ LOẠI',
    visualSteps: [
      { token: 'S', label: 'Chủ ngữ', color: 'gray', sampleWord: 'The manager' },
      { token: 'ADV (-ly)', label: 'Trạng từ', color: 'yellow', sampleWord: 'carefully', isKey: true },
      { token: 'VERB', label: 'Động từ thường', color: 'green', sampleWord: 'reviewed', isKey: true },
      { token: 'OBJECT', label: 'Tân ngữ', color: 'purple', sampleWord: 'the agreement' }
    ],
    coreRule: 'Trạng từ (Adverb) bổ nghĩa cho Động từ thường. Trạng từ có thể đứng ngay TRƯỚC Động từ để nhấn mạnh cách thức hoặc tần suất hành động.',
    explanation: [
      'Nhiều người học tiếng Việt quen nói "làm việc cẩn thận", "xem xét kỹ lưỡng" nên dễ lầm tưởng dùng Tính từ, nhưng trong tiếng Anh bắt buộc phải là TRẠNG TỪ (đặc trưng đuôi -ly).',
      'Vị trí: S + ADV + V (vd: She *carefully reviewed* the document).',
      'Các trạng từ thường gặp đứng trước động từ: carefully, strictly, promptly, successfully, thoroughly, consistently, highly, widely, regularly, actively.'
    ],
    examples: [
      {
        en: 'The internal auditing committee thoroughly inspected all financial ledgers.',
        vi: 'Ủy ban kiểm toán nội bộ đã kiểm tra một cách kỹ lưỡng (thoroughly) tất cả các sổ sách tài chính.',
        note: 'thoroughly (Adv) đứng trước inspected (Verb)'
      },
      {
        en: 'Ms. Jenkins promptly responded to the urgent client inquiry.',
        vi: 'Cô Jenkins đã phản hồi ngay lập tức (promptly) đối với câu hỏi khẩn cấp của khách hàng.',
        note: 'promptly (Adv) đứng trước responded (Verb)'
      },
      {
        en: 'The board of directors unanimously approved the proposed budget.',
        vi: 'Hội đồng quản trị đã nhất trí (unanimously) thông qua ngân sách đề xuất.',
        note: 'unanimously (Adv) đứng trước approved (Verb)'
      }
    ],
    commonMistakes: 'SAI: "She thorough inspected the ledgers." (Dùng tính từ thorough là SAI). ĐÚNG: "She thoroughly inspected..." (Dùng trạng từ thoroughly).',
    etsTip: 'Khi gặp chỗ trống đứng giữa Chủ ngữ (S) và Động từ chính (V), 95% đáp án chọn TRẠNG TỪ đuôi -ly.'
  },
  {
    id: 'be-linking-verb-adj',
    ruleName: 'Động Từ Nối Đi Với Tính Từ (Linking Verb + Adj)',
    patternFormula: 'Chủ ngữ (S) + LINKING VERB (To be / remain / seem) + TÍNH TỪ (Adj)',
    badge: 'Siêu Hay Gặp Part 5',
    isHighFrequency: true,
    examBadge: '🚨 BẪY CỰC HAY GẶP',
    visualSteps: [
      { token: 'S', label: 'Chủ ngữ', color: 'gray', sampleWord: 'The terms' },
      { token: 'LINKING VERB', label: 'Động từ nối', color: 'green', sampleWord: 'remain / look', isKey: true },
      { token: 'ADJECTIVE', label: 'Tính từ (Adj)', color: 'blue', sampleWord: 'confidential / valid', isKey: true }
    ],
    coreRule: 'Động từ To Be và các Động từ Nối (Linking Verbs) liên kết chủ ngữ với một TÍNH TỪ chỉ trạng thái của chủ ngữ, TUYỆT ĐỐI KHÔNG DÙNG TRẠNG TỪ.',
    explanation: [
      'Danh sách Linking Verbs bắt buộc học thuộc trong TOEIC: remain, stay, become, look, seem, appear, feel, sound, taste, prove.',
      'Ví dụ: remain confidential (vẫn giữ bí mật), become effective (có hiệu lực), seem promising (có vẻ triển vọng).',
      'Công thức: S + remain / become / seem + ADJ.'
    ],
    examples: [
      {
        en: 'All employee personal medical records must remain confidential.',
        vi: 'Tất cả hồ sơ y tế cá nhân của nhân viên phải được giữ bí mật (confidential).',
        note: 'remain (Linking Verb) + confidential (Adj)'
      },
      {
        en: 'The sales performance numbers look extremely promising this quarter.',
        vi: 'Các con số hiệu suất bán hàng trông cực kỳ hứa hẹn (promising) trong quý này.',
        note: 'look (Linking Verb) + promising (Adj)'
      }
    ],
    commonMistakes: 'SAI: "The records remain confidentially." ĐÚNG: "The records remain confidential." Vì remain là linking verb.',
    etsTip: 'Cứ nhìn thấy "remain", "become", "seem" thì tìm ngay TÍNH TỪ để chọn!'
  },
  {
    id: 'adj-before-noun',
    ruleName: 'Tính Từ Đứng Trước Danh Từ (Adj + Noun)',
    patternFormula: 'Mạo từ / Sở hữu + TÍNH TỪ (Adj) + DANH TỪ (Noun)',
    badge: 'Quy Tắc Cơ Bản',
    isHighFrequency: true,
    examBadge: '🔥 CƠ BẢN 100% RA THI',
    visualSteps: [
      { token: 'a / the / my', label: 'Mạo từ / Sở hữu', color: 'gray', sampleWord: 'a / our' },
      { token: 'ADJECTIVE', label: 'Tính từ', color: 'blue', sampleWord: 'reliable / innovative', isKey: true },
      { token: 'NOUN', label: 'Danh từ chính', color: 'purple', sampleWord: 'consultant / strategy', isKey: true }
    ],
    coreRule: 'Tính từ (Adjective) đứng ngay trước Danh từ để miêu tả đặc điểm, tính chất, phân loại cho danh từ đó.',
    explanation: [
      'Cụm danh từ: Mạo từ / Sở hữu + (Trạng từ) + TÍNH TỪ + DANH TỪ.',
      'Nếu sau chỗ trống là một Danh từ và trước nó là Mạo từ (a/an/the) hoặc Tính từ sở hữu -> Điền TÍNH TỪ.',
      'Các đuôi tính từ phổ biến: -ful, -ive, -able, -ible, -al, -ic, -ous, -ent, -ant.'
    ],
    examples: [
      {
        en: 'The company hired a reliable consultant to evaluate our workflow.',
        vi: 'Công ty đã thuê một chuyên gia tư vấn đáng tin cậy (reliable) để đánh giá quy trình làm việc.',
        note: 'reliable (Adj) đứng trước consultant (Noun)'
      },
      {
        en: 'The manager introduced an innovative marketing campaign.',
        vi: 'Người quản lý đã giới thiệu một chiến dịch tiếp thị mang tính đổi mới (innovative).',
        note: 'innovative (Adj) đứng trước campaign (Noun)'
      }
    ],
    commonMistakes: 'Không dùng Trạng từ đứng trực tiếp trước danh từ (SAI: "a reliably consultant"). Phải dùng Tính từ (ĐÚNG: "a reliable consultant").',
    etsTip: 'Lưu ý danh từ đuôi "-al": proposal, approval, removal, refusal, renewal là DANH TỪ, không phải tính từ!'
  },
  {
    id: 'aux-adv-mainverb',
    ruleName: 'Trạng Từ Kẹp Giữa Trợ Động Từ & Động Từ Chính',
    patternFormula: 'Trợ ĐT (has / was / will) + TRẠNG TỪ (Adv -ly) + ĐỘNG TỪ CHÍNH (V3/ed / V-ing)',
    badge: 'Mẹo 3 Giây Vàng',
    isHighFrequency: true,
    examBadge: '🔥 VỊ TRÍ VÀNG TRẠNG TỪ',
    visualSteps: [
      { token: 'AUXILIARY', label: 'Trợ động từ', color: 'gray', sampleWord: 'has / was / will' },
      { token: 'ADV (-ly)', label: 'Trạng từ kẹp giữa', color: 'yellow', sampleWord: 'successfully', isKey: true },
      { token: 'MAIN VERB', label: 'Động từ chính', color: 'green', sampleWord: 'completed / delivered', isKey: true }
    ],
    coreRule: 'Trạng từ đứng kẹp giữa trợ động từ và động từ chính để bổ nghĩa cho động từ chính.',
    explanation: [
      'Cấu trúc 1: have / has + ADV + V3/ed (vd: has successfully expanded).',
      'Cấu trúc 2: be + ADV + V-ed [Bị động] (vd: was safely delivered).',
      'Cấu trúc 3: be + ADV + V-ing [Tiếp diễn] (vd: is currently reviewing).',
      'Cấu trúc 4: can / will / should + ADV + V-inf (vd: will promptly announce).'
    ],
    examples: [
      {
        en: 'The newly appointed director has successfully restructured the division.',
        vi: 'Vị giám đốc mới được bổ nhiệm đã tái cấu trúc bộ phận một cách thành công (successfully).',
        note: 'has + successfully (Adv) + restructured (V3)'
      },
      {
        en: 'The fragile glass equipment was carefully transported to the laboratory.',
        vi: 'Thiết bị thủy tinh dễ vỡ đã được vận chuyển một cách cẩn thận (carefully) đến phòng thí nghiệm.',
        note: 'was + carefully (Adv) + transported (V3/ed)'
      }
    ],
    commonMistakes: 'Thấy chỗ trống đứng giữa "has _______ finished" hay "was _______ delivered" thì 100% là vị trí của TRẠNG TỪ đuôi -ly!',
    etsTip: 'Nhận diện: Trợ động từ đứng trước, Động từ chính đứng sau -> Ở giữa CHỈ CÓ THỂ là TRẠNG TỪ!'
  },
  {
    id: 'special-verb-object-adj',
    ruleName: 'Cấu Trúc Đặc Biệt: Make / Keep / Find + Tân Ngữ + Tính Từ',
    patternFormula: 'Make / Keep / Find + Tân ngữ (Object) + TÍNH TỪ (Adj)',
    badge: 'Bẫy Điểm 800+',
    isHighFrequency: true,
    examBadge: '🚨 BẪY PHÂN LOẠI 700+',
    visualSteps: [
      { token: 'VERB', label: 'Động từ đặc biệt', color: 'green', sampleWord: 'makes / keeps / finds', isKey: true },
      { token: 'OBJECT', label: 'Tân ngữ chịu tác động', color: 'purple', sampleWord: 'the process / documents' },
      { token: 'ADJECTIVE', label: 'Tính từ bổ nghĩa cho O', color: 'blue', sampleWord: 'efficient / secure', isKey: true }
    ],
    coreRule: 'Một số ngoại động từ chỉ nhận thức, trạng thái đi kèm Tân ngữ và theo sau là một TÍNH TỪ bổ nghĩa cho tân ngữ đó, KHÔNG dùng trạng từ!',
    explanation: [
      '1. Make + Object + Adj: Khiến cái gì trở nên thế nào (make the process efficient).',
      '2. Keep + Object + Adj: Giữ cho cái gì ở trạng thái nào (keep all exits clear).',
      '3. Find + Object + Adj: Nhận thấy cái gì thế nào (find the instructions helpful).',
      '4. Consider / Deem + Object + Adj: Coi cái gì như thế nào (consider the price reasonable).',
      '5. Leave + Object + Adj: Để cái gì ở tình trạng nào (do not leave files unattended).'
    ],
    examples: [
      {
        en: 'The automated filing system makes document retrieval extremely efficient.',
        vi: 'Hệ thống lưu trữ tự động giúp việc truy xuất tài liệu trở nên cực kỳ hiệu quả (efficient).',
        note: 'make + document retrieval (O) + efficient (Adj)'
      },
      {
        en: 'Please keep all confidential client folders secure in the fireproof safe.',
        vi: 'Vui lòng giữ cho tất cả các thư mục khách hàng bảo mật được an toàn (secure) trong két sắt chống cháy.',
        note: 'keep + folders (O) + secure (Adj)'
      }
    ],
    commonMistakes: 'SAI: "Please keep the door securely." ĐÚNG: "Please keep the door secure." Vì cấu trúc là keep + O + Adj.',
    etsTip: 'ETS rất thích bẫy thí sinh ở cấu trúc make/keep/find + O + [ADJ]! Hãy nhớ chọn tính từ thay vì trạng từ đuôi -ly.'
  },
  {
    id: 'compound-nouns',
    ruleName: 'Danh Từ Ghép (Noun + Noun)',
    patternFormula: 'DANH TỪ 1 (Bổ nghĩa) + DANH TỪ 2 (Chính)',
    badge: 'Thường Gặp Part 5',
    visualSteps: [
      { token: 'NOUN 1', label: 'Danh từ bổ nghĩa', color: 'purple', sampleWord: 'customer / safety' },
      { token: 'NOUN 2', label: 'Danh từ chính', color: 'purple', sampleWord: 'service / regulations' }
    ],
    coreRule: 'Trong tiếng Anh công sở, hai danh từ có thể đứng liền nhau tạo thành một Danh từ Ghép (Compound Noun), trong đó danh từ đứng trước đóng vai trò như một định ngữ.',
    explanation: [
      'Các danh từ ghép kinh điển trong TOEIC:',
      '• customer service (dịch vụ khách hàng)',
      '• safety regulations (quy định an toàn)',
      '• assembly line (dây chuyền lắp ráp)',
      '• travel expenses (chi phí đi lại)',
      '• sales representative (đại diện bán hàng)',
      '• application form (mẫu đơn xin việc)'
    ],
    examples: [
      {
        en: 'All employees must submit their travel expenses report by Friday.',
        vi: 'Tất cả nhân viên phải nộp báo cáo chi phí đi lại (travel expenses report) trước thứ Sáu.'
      }
    ],
    commonMistakes: 'Thấy danh từ "expenses" tưởng phía trước phải là tính từ -> chọn sai từ loại. Chỗ này là danh từ ghép "travel expenses".',
    etsTip: 'Học thuộc theo cụm danh từ ghép cố định sẽ giúp bạn xử lý câu hỏi này trong đúng 2 giây.'
  }
];

// ----------------------------------------------------
// 10 COMPREHENSIVE GRAMMAR TOPICS FOR TOEIC
// ----------------------------------------------------
export const grammarTopics: GrammarTopic[] = [
  {
    id: 'tenses',
    title: 'Full 12 Thì Trong Tiếng Anh & Phối Thì TOEIC',
    category: 'Động từ & Thời gian',
    description: 'Trọn bộ 12 thì từ cơ bản đến nâng cao (Hiện tại, Quá khứ, Tương lai) và quy tắc mệnh đề trạng từ chỉ thời gian.',
    badge: 'Full 12 Thì Chuẩn 100%',
    isHighFrequency: true,
    examFrequencyBadge: '🔥 95% ĐỀ THI XUẤT HIỆN',
    difficulty: 'Cơ bản (450+)',
    summary: 'Nắm chắc công thức, cách dùng bản chất, dấu hiệu nhận biết của toàn bộ 12 thì trong tiếng Anh và tuyệt chiêu giải quyết bài toán phối thì Part 5 trong 5 giây.',
    sections: [
      {
        title: '1. Nhóm 4 Thì Hiện Tại (Present Tenses)',
        isHighFrequency: true,
        examBadge: '🔥 TẬP TRUNG HIỆN TẠI HOÀN THÀNH',
        formula: '• HT Đơn: S + V(s/es)\n• HT Tiếp diễn: S + am/is/are + V-ing\n• HT Hoàn thành: S + have/has + V3/ed\n• HTHT Tiếp diễn: S + have/has + been + V-ing',
        notes: [
          'Hiện tại đơn: sự thật, thói quen, lịch trình cố định (always, usually, every day, regularly).',
          'Hiện tại tiếp diễn: hành động đang xảy ra, xu hướng biến đổi (now, currently, at the moment). Chú ý không chia tiếp diễn với stative verbs (belong, contain, know, need).',
          'Hiện tại hoàn thành: bắt đầu trong quá khứ kéo dài đến hiện tại, vừa mới xảy ra (since, for, already, yet, recently, over the past 2 years).',
          'Hiện tại hoàn thành tiếp diễn: nhấn mạnh tính liên tục của hành động (all morning, for 5 hours).'
        ],
        examples: [
          {
            en: 'The regional express train departs at 6:45 AM every weekday.',
            vi: 'Chuyến tàu tốc hành khu vực khởi hành lúc 6:45 sáng mỗi ngày trong tuần.'
          },
          {
            en: 'The research lab has published three groundbreaking studies over the past year.',
            vi: 'Phòng nghiên cứu đã công bố ba nghiên cứu đột phá trong năm qua.'
          }
        ],
        traps: [
          'Cụm "in / over / during the past / last + khoảng thời gian" (vd: in the past three months) 100% chia Hiện tại hoàn thành (have/has + V3/ed).'
        ]
      },
      {
        title: '2. Nhóm 4 Thì Quá Khứ (Past Tenses)',
        formula: '• QK Đơn: S + V2/ed\n• QK Tiếp diễn: S + was/were + V-ing\n• QK Hoàn thành: S + had + V3/ed\n• QKHT Tiếp diễn: S + had + been + V-ing',
        notes: [
          'Quá khứ đơn: hành động đã kết thúc hoàn toàn trong quá khứ tại mốc thời gian rõ ràng (yesterday, ago, last week, in 2020).',
          'Quá khứ tiếp diễn: hành động đang diễn ra tại một thời điểm quá khứ hoặc bị hành động khác xen ngang (When S + V2/ed, S + was/were + V-ing).',
          'Quá khứ hoàn thành: hành động xảy ra và kết thúc TRƯỚC một hành động/mốc thời gian khác trong quá khứ (By the time S + V2/ed, S + had + V3/ed).',
          'Quá khứ hoàn thành tiếp diễn: nhấn mạnh sự kéo dài liên tục trước một thời điểm quá khứ.'
        ],
        examples: [
          {
            en: 'By the time the keynote speaker arrived, all attendees had already registered.',
            vi: 'Trước khi diễn giả chính đến, tất cả người tham dự đã đăng ký xong.'
          }
        ],
        traps: [
          'Có mốc thời gian quá khứ xác định (vd: in 2021, two weeks ago) thì KHÔNG được chia thì hoàn thành, phải chia Quá khứ đơn!'
        ]
      },
      {
        title: '3. Nhóm 4 Thì Tương Lai (Future Tenses) & Bẫy Mệnh Đề Thời Gian',
        isHighFrequency: true,
        examBadge: '🚨 BẪY ĐIỂM LIỆT 99%',
        formula: '• TL Đơn: S + will + V-inf\n• TL Tiếp diễn: S + will be + V-ing\n• TL Hoàn thành: S + will have + V3/ed\n• TLHT Tiếp diễn: S + will have been + V-ing',
        notes: [
          'Tương lai đơn: quyết định tức thì, thông báo, dự đoán tương lai (tomorrow, next month, soon, shortly).',
          'Tương lai hoàn thành: hoàn tất TRƯỚC một thời điểm tương lai (By the end of this month, we will have completed the audit).',
          'BẪY MỆNH ĐỀ THỜI GIAN: When / As soon as / Once / Before / After + S + V(hiện tại đơn), S + will + V-inf.'
        ],
        examples: [
          {
            en: 'As soon as the inspector approves the blueprint, the team will begin construction.',
            vi: 'Ngay khi thanh tra phê duyệt bản thiết kế (approves chia hiện tại đơn), đội ngũ sẽ bắt đầu xây dựng (will begin).'
          }
        ],
        traps: [
          'Tuyệt đối KHÔNG dùng "will" trong mệnh đề phụ chỉ thời gian sau When, As soon as, Before, After, Once, By the time.'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'Ms. Foster _______ at the marketing agency for five years before she was promoted to director.',
        options: [
          { label: 'A', text: 'works' },
          { label: 'B', text: 'has worked' },
          { label: 'C', text: 'had worked' },
          { label: 'D', text: 'will work' }
        ],
        correctAnswer: 'C',
        explanation: 'Hành động làm việc diễn ra và kéo dài trong 5 năm trước một mốc thời gian/hành động khác trong quá khứ ("before she was promoted") nên dùng thì Quá khứ hoàn thành (had worked).',
        translation: 'Cô Foster đã làm việc tại công ty tiếp thị trong 5 năm trước khi cô ấy được thăng chức lên làm giám đốc.'
      },
      {
        id: 2,
        question: 'As soon as the financial audit is completed, the board members _______ the final budget.',
        options: [
          { label: 'A', text: 'approve' },
          { label: 'B', text: 'approved' },
          { label: 'C', text: 'will approve' },
          { label: 'D', text: 'have approved' }
        ],
        correctAnswer: 'C',
        explanation: 'Quy tắc mệnh đề trạng từ chỉ thời gian: "As soon as + S + V(hiện tại đơn), S + will + V(nguyên mẫu)". Mệnh đề chính cần chia tương lai đơn.',
        translation: 'Ngay sau khi cuộc kiểm toán tài chính hoàn tất, các thành viên hội đồng quản trị sẽ phê duyệt ngân sách cuối cùng.'
      },
      {
        id: 3,
        question: 'The tech company _______ several innovative AI products over the past two years.',
        options: [
          { label: 'A', text: 'released' },
          { label: 'B', text: 'has released' },
          { label: 'C', text: 'releases' },
          { label: 'D', text: 'is releasing' }
        ],
        correctAnswer: 'B',
        explanation: 'Cụm dấu hiệu "over the past two years" (trong vòng 2 năm qua) là dấu hiệu kinh điển của thì Hiện tại hoàn thành (have/has + V3/ed). Chủ ngữ "The tech company" là số ít nên dùng "has released".',
        translation: 'Công ty công nghệ đã phát hành một số sản phẩm AI đột phá trong vòng hai năm qua.'
      },
      {
        id: 4,
        question: 'By the time the new assembly plant opens next November, our team _______ training 200 technicians.',
        options: [
          { label: 'A', text: 'completed' },
          { label: 'B', text: 'will have completed' },
          { label: 'C', text: 'has completed' },
          { label: 'D', text: 'had completed' }
        ],
        correctAnswer: 'B',
        explanation: 'Cấu trúc "By the time + S + V(hiện tại đơn chỉ tương lai), S + will have + V3/ed (Tương lai hoàn thành)". Hành động đào tạo sẽ hoàn tất trước khi nhà máy mở cửa vào tháng 11 tới.',
        translation: 'Trước lúc nhà máy lắp ráp mới mở cửa vào tháng 11 tới, đội ngũ của chúng tôi sẽ hoàn thành việc đào tạo 200 kỹ thuật viên.'
      },
      {
        id: 5,
        question: 'While the systems engineer _______ the network backup, all office computers temporarily lost connection.',
        options: [
          { label: 'A', text: 'runs' },
          { label: 'B', text: 'was running' },
          { label: 'C', text: 'has run' },
          { label: 'D', text: 'will run' }
        ],
        correctAnswer: 'B',
        explanation: 'Hành động đang diễn ra trong quá khứ (While + was/were + V-ing) thì hành động khác ngắn hơn chen vào ("lost connection" chia quá khứ đơn). Chọn "was running".',
        translation: 'Trong khi kỹ sư hệ thống đang chạy bản sao lưu mạng thì tất cả máy tính văn phòng tạm thời bị mất kết nối.'
      }
    ]
  },
  {
    id: 'word-forms',
    title: 'Toàn Tập Vị Trí Từ Loại & Trật Tự Từ Trong Câu',
    category: 'Cấu trúc câu Part 5',
    description: 'Chuyên sâu vị trí Trạng từ trước Động từ (Adv + V), Tính từ trước Danh từ (Adj + N), Động từ nối (Linking Verb + Adj) và cấu trúc Make/Keep/Find + O + Adj.',
    badge: 'Chiếm 40% Part 5',
    isHighFrequency: true,
    examFrequencyBadge: '🔥 CHIẾM 40% ĐỀ THI (12-14 CÂU)',
    difficulty: 'Cơ bản (450+)',
    summary: 'Hiểu rõ trật tự từ loại giải quyết 10-15 câu Part 5 trong chớp mắt. Nắm vững sự khác biệt giữa cách thức bổ nghĩa của Trạng từ cho Động từ và Tính từ cho Danh từ.',
    sections: [
      {
        title: '1. Trạng Từ Đứng Trước Động Từ Thường (Adv + Verb)',
        isHighFrequency: true,
        examBadge: '🔥 TẦN SUẤT CAO NHẤT',
        formula: 'Subject + ADVERB (-ly) + VERB (động từ thường)',
        notes: [
          'TRẠNG TỪ (chứ KHÔNG PHẢI tính từ) là từ loại dùng để bổ nghĩa cho Động từ thường.',
          'Vị trí đắc địa: Đứng ngay trước động từ chính (He *strictly prohibits*, She *carefully examined*).',
          'Vị trí kẹp giữa trợ động từ và động từ chính: have/has + ADV + V3/ed (has *successfully completed*), be + ADV + V-ed (was *safely delivered*).'
        ],
        examples: [
          {
            en: 'The internal auditing committee thoroughly inspected all financial ledgers.',
            vi: 'Ủy ban kiểm toán nội bộ đã kiểm tra một cách kỹ lưỡng (thoroughly) tất cả các sổ sách tài chính.'
          },
          {
            en: 'The manager promptly responded to the urgent client complaint.',
            vi: 'Người quản lý đã phản hồi ngay lập tức (promptly) đối với khiếu nại khẩn cấp của khách hàng.'
          }
        ],
        traps: [
          'Người học tiếng Việt rất hay nhầm "làm việc cẩn thận" là dùng tính từ. Trong tiếng Anh, bổ nghĩa cho Động từ PHẢI DÙNG TRẠNG TỪ (Adv), tuyệt đối không dùng Adj!'
        ]
      },
      {
        title: '2. Tính Từ Đứng Trước Danh Từ & Sau Linking Verbs',
        isHighFrequency: true,
        examBadge: '🔥 HAY GẶP PART 5',
        formula: '• Adj + NOUN (Đứng trước Danh từ)\n• BE / Linking Verb + ADJ (Đứng sau To Be & Động từ nối)',
        notes: [
          'Đứng TRƯỚC danh từ: a *reliable* partner, an *effective* solution.',
          'Đứng SAU Linking Verbs (remain, stay, become, seem, look, appear, sound): The contract remains *valid* (KHÔNG dùng validly!), The candidate looks *confident*.'
        ],
        examples: [
          {
            en: 'All confidential personnel records must remain secure at all times.',
            vi: 'Tất cả hồ sơ nhân sự bảo mật phải được giữ an toàn (secure - tính từ sau remain) mọi lúc.'
          }
        ],
        traps: [
          'Các từ có đuôi -al như proposal, approval, removal, refusal, renewal là DANH TỪ, không phải tính từ!'
        ]
      },
      {
        title: '3. Cấu Trúc Đặc Biệt: Make / Keep / Find / Consider + O + Adj',
        isHighFrequency: true,
        examBadge: '🚨 BẪY PHÂN LOẠI 700+',
        formula: 'MAKE / KEEP / FIND / CONSIDER / LEAVE + Object + ADJECTIVE',
        notes: [
          'make + O + Adj: làm cho cái gì trở nên thế nào (make the process efficient).',
          'keep + O + Adj: giữ cho cái gì ở trạng thái nào (keep confidential files safe).',
          'find + O + Adj: nhận thấy cái gì thế nào (find the system easy to use).'
        ],
        examples: [
          {
            en: 'The modern workflow software makes project management significantly easier.',
            vi: 'Phần mềm quy trình làm việc hiện đại giúp việc quản lý dự án trở nên dễ dàng hơn đáng kể.'
          }
        ],
        traps: [
          'Sau Object của make/keep/find, thí sinh thường chọn trạng từ đuôi -ly -> Dính bẫy! Chỗ này phải chọn TÍNH TỪ.'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'The operations director _______ reviewed the proposed supply chain restructuring plan.',
        options: [
          { label: 'A', text: 'careful' },
          { label: 'B', text: 'carefully' },
          { label: 'C', text: 'carefulness' },
          { label: 'D', text: 'care' }
        ],
        correctAnswer: 'B',
        explanation: 'Vị trí đứng ngay trước động từ chính "reviewed" cần một Trạng từ (Adverb) để bổ nghĩa cho động từ đó -> chọn "carefully" (Adv + Verb).',
        translation: 'Giám đốc vận hành đã xem xét một cách cẩn thận kế hoạch tái cấu trúc chuỗi cung ứng được đề xuất.'
      },
      {
        id: 2,
        question: 'All proprietary software source codes must remain _______ to protect corporate intellectual property.',
        options: [
          { label: 'A', text: 'confidential' },
          { label: 'B', text: 'confidentially' },
          { label: 'C', text: 'confidentiality' },
          { label: 'D', text: 'confide' }
        ],
        correctAnswer: 'A',
        explanation: '"remain" là một Động từ nối (Linking Verb), theo sau Linking Verb bắt buộc phải là một Tính từ (Adjective) để mô tả trạng thái của chủ ngữ -> chọn "confidential".',
        translation: 'Tất cả các mã nguồn phần mềm độc quyền phải được giữ bảo mật để bảo vệ tài sản trí tuệ của doanh nghiệp.'
      },
      {
        id: 3,
        question: 'The newly introduced automated scheduling platform makes shift management much more _______ .',
        options: [
          { label: 'A', text: 'efficient' },
          { label: 'B', text: 'efficiently' },
          { label: 'C', text: 'efficiency' },
          { label: 'D', text: 'efficiencies' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc đặc biệt: "make + Object (shift management) + Adjective". Ta cần một tính từ bổ nghĩa cho tân ngữ -> chọn "efficient".',
        translation: 'Nền tảng lên lịch tự động mới được giới thiệu giúp việc quản lý ca làm việc trở nên hiệu quả hơn nhiều.'
      },
      {
        id: 4,
        question: 'The management board expressed their enthusiastic _______ of the commercial expansion plan.',
        options: [
          { label: 'A', text: 'approve' },
          { label: 'B', text: 'approval' },
          { label: 'C', text: 'approved' },
          { label: 'D', text: 'approvingly' }
        ],
        correctAnswer: 'B',
        explanation: 'Đứng sau tính từ "enthusiastic" và tính từ sở hữu "their", trước giới từ "of" cần một Danh từ -> chọn "approval" (sự chấp thuận, phê duyệt - danh từ đuôi -al).',
        translation: 'Ban giám đốc đã bày tỏ sự chấp thuận nhiệt tình của họ đối với kế hoạch mở rộng thương mại.'
      },
      {
        id: 5,
        question: 'The regional logistics manager has _______ coordinated shipments across five neighboring provinces.',
        options: [
          { label: 'A', text: 'success' },
          { label: 'B', text: 'successful' },
          { label: 'C', text: 'successfully' },
          { label: 'D', text: 'succeed' }
        ],
        correctAnswer: 'C',
        explanation: 'Vị trí kẹp giữa trợ động từ "has" và quá khứ phân từ "coordinated" (has + ADV + V3/ed) bắt buộc phải là một Trạng từ -> chọn "successfully".',
        translation: 'Quản lý hậu cần khu vực đã điều phối thành công các chuyến hàng qua năm tỉnh lân cận.'
      }
    ]
  },
  {
    id: 'gerunds-infinitives',
    title: 'Danh Động Từ & Động Từ Nguyên Mẫu (V-ing vs To-V)',
    category: 'Động từ',
    description: 'Bảng phân loại chuẩn xác động từ đi với To-V, V-ing và các cụm giới từ "to + V-ing" hay gặp nhất trong đề thi.',
    badge: 'Cực Dễ Nhầm',
    isHighFrequency: true,
    examFrequencyBadge: '🚨 SIÊU BẪY TO + V-ING',
    difficulty: 'Trung cấp (650+)',
    summary: 'Bài thi TOEIC thường xuyên kiểm tra động từ nào đi cùng To-V và động từ nào đi cùng V-ing, đặc biệt là các cụm "to + V-ing" khiến nhiều thí sinh nhầm với To-infinitive.',
    sections: [
      {
        title: '1. Các Động Từ Bắt Buộc Theo Sau Bởi To-V',
        formula: 'Verb + to V-inf',
        notes: [
          'Động từ chỉ dự định, mong muốn, quyết định: decide, plan, intend, hope, expect, wish, promise.',
          'Động từ chỉ sự đồng ý, từ chối, cố gắng: agree, refuse, hesitate, manage, fail, afford, strive.',
          'Cấu trúc V + O + to V: encourage / invite / remind / advise / allow + O + to V.'
        ],
        examples: [
          {
            en: 'The CEO decided to expand operations into Southeast Asia.',
            vi: 'Tổng giám đốc đã quyết định mở rộng hoạt động sang Đông Nam Á.'
          },
          {
            en: 'Please remind all staff members to submit their timesheets on Friday.',
            vi: 'Vui lòng nhắc nhở tất cả nhân viên nộp bảng chấm công vào thứ Sáu.'
          }
        ],
        traps: [
          'Gặp các từ như hesitate, afford, plan -> 100% chọn "to V", không chọn V-ing.'
        ]
      },
      {
        title: '2. Các Động Từ Theo Sau Bởi V-ing (Gerunds)',
        formula: 'Verb + V-ing',
        notes: [
          'Động từ chỉ sự trì hoãn, tránh né: postpone, delay, avoid, cancel.',
          'Động từ chỉ việc cân nhắc, đề xuất: consider, suggest, recommend.',
          'Động từ chỉ kết thúc, duy trì, yêu thích: finish, keep, mind, enjoy, practice.'
        ],
        examples: [
          {
            en: 'We should consider upgrading our cloud server infrastructure.',
            vi: 'Chúng ta nên cân nhắc nâng cấp cơ sở hạ tầng máy chủ đám mây.'
          },
          {
            en: 'The airline delayed boarding due to technical issues.',
            vi: 'Hãng hàng không đã hoãn việc lên máy bay do sự cố kỹ thuật.'
          }
        ],
        traps: [
          'Sau giới từ (in, on, at, about, without, before, after...) LUÔN LUÔN dùng V-ing nếu là động từ.'
        ]
      },
      {
        title: '3. Siêu Bẫy: Cụm từ đi với "to + V-ing" (To ở đây là giới từ!)',
        isHighFrequency: true,
        examBadge: '🚨 90% THÍ SINH DÍNH BẪY',
        formula: 'look forward to / be committed to / be used to + V-ING',
        notes: [
          'look forward to + V-ing: mong đợi làm gì',
          'be committed to / dedicate to + V-ing: cam kết / cống hiến cho việc gì',
          'be accustomed to / be used to + V-ing: quen với việc gì',
          'prior to + V-ing: trước khi làm gì',
          'in addition to + V-ing: bên cạnh việc gì'
        ],
        examples: [
          {
            en: 'We look forward to collaborating with your team on the upcoming project.',
            vi: 'Chúng tôi rất mong đợi được hợp tác với đội ngũ của bạn trong dự án sắp tới.'
          }
        ],
        traps: [
          'Thí sinh thường thấy "to" là vội chọn V nguyên mẫu -> Sai ngay! Hãy học thuộc lòng các cụm trên để chọn V-ing.'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'Our customer support team is committed to _______ prompt and courteous service to all clients.',
        options: [
          { label: 'A', text: 'provide' },
          { label: 'B', text: 'providing' },
          { label: 'C', text: 'provided' },
          { label: 'D', text: 'provision' }
        ],
        correctAnswer: 'B',
        explanation: 'Cấu trúc "be committed to + V-ing" (cam kết làm gì), trong đó "to" đóng vai trò là giới từ. Đáp án đúng là "providing".',
        translation: 'Đội ngũ hỗ trợ khách hàng của chúng tôi cam kết cung cấp dịch vụ nhanh chóng và lịch thiệp tới tất cả khách hàng.'
      },
      {
        id: 2,
        question: 'The building management decided _______ the elevator maintenance until next weekend.',
        options: [
          { label: 'A', text: 'postpone' },
          { label: 'B', text: 'postponing' },
          { label: 'C', text: 'to postpone' },
          { label: 'D', text: 'postponed' }
        ],
        correctAnswer: 'C',
        explanation: 'Động từ "decide" theo sau bởi To-infinitive (decide + to V). Chọn "to postpone".',
        translation: 'Ban quản lý tòa nhà đã quyết định hoãn việc bảo trì thang máy cho tới cuối tuần sau.'
      },
      {
        id: 3,
        question: 'Prior to _______ the contract, both parties must agree on the warranty terms.',
        options: [
          { label: 'A', text: 'signing' },
          { label: 'B', text: 'sign' },
          { label: 'C', text: 'signed' },
          { label: 'D', text: 'signature' }
        ],
        correctAnswer: 'A',
        explanation: '"Prior to" là một cụm giới từ (= before). Sau giới từ ta cần Danh động từ (V-ing) khi có tân ngữ theo sau ("the contract"). Chọn "signing".',
        translation: 'Trước khi ký hợp đồng, cả hai bên phải thống nhất về các điều khoản bảo hành.'
      },
      {
        id: 4,
        question: 'Due to severe weather conditions, the organizers suggested _______ the outdoor concert.',
        options: [
          { label: 'A', text: 'reschedule' },
          { label: 'B', text: 'to reschedule' },
          { label: 'C', text: 'rescheduling' },
          { label: 'D', text: 'rescheduled' }
        ],
        correctAnswer: 'C',
        explanation: 'Động từ "suggest" khi không có mệnh đề "that" sẽ đi trực tiếp với Danh động từ V-ing (suggest + V-ing). Chọn "rescheduling".',
        translation: 'Do điều kiện thời tiết xấu, ban tổ chức đã đề xuất dời lịch buổi hòa nhạc ngoài trời.'
      },
      {
        id: 5,
        question: 'The marketing manager reminded all team members _______ the survey results before 5 PM.',
        options: [
          { label: 'A', text: 'submitting' },
          { label: 'B', text: 'to submit' },
          { label: 'C', text: 'submit' },
          { label: 'D', text: 'submitted' }
        ],
        correctAnswer: 'B',
        explanation: 'Cấu trúc "remind someone to do something" (nhắc nhở ai làm gì). Chọn "to submit".',
        translation: 'Trưởng phòng tiếp thị đã nhắc nhở tất cả các thành viên trong nhóm nộp kết quả khảo sát trước 5 giờ chiều.'
      }
    ]
  },
  {
    id: 'passive-voice',
    title: 'Câu Bị Động & Bị Động Rút Gọn',
    category: 'Cấu trúc câu',
    description: 'Quy tắc vàng phân biệt Chủ động - Bị động trong 5 giây dựa trên tân ngữ phía sau và các thì bị động.',
    badge: 'Mẹo 5 Giây',
    isHighFrequency: true,
    examFrequencyBadge: '🔥 HAY RA THI (3-4 CÂU)',
    difficulty: 'Trung cấp (650+)',
    summary: 'Câu bị động là điểm ngữ pháp cực kỳ phổ biến trong môi trường công sở TOEIC (báo cáo được nộp, sản phẩm được giao, cuộc họp được tổ chức).',
    sections: [
      {
        title: '1. Công thức Bị Động Cho Tất Cả Các Thì',
        formula: 'S + BE + V3/ed (+ by O)',
        notes: [
          'Hiện tại đơn: am/is/are + V3/ed',
          'Hiện tại hoàn thành: have/has been + V3/ed',
          'Quá khứ đơn: was/were + V3/ed',
          'Tương lai đơn: will be + V3/ed',
          'Modal verbs: can/must/should + be + V3/ed',
          'Đang tiếp diễn: am/is/are/was/were + being + V3/ed'
        ],
        examples: [
          {
            en: 'The annual shareholder meeting will be held in the main conference room.',
            vi: 'Cuộc họp cổ đông thường niên sẽ được tổ chức tại phòng hội nghị chính.'
          }
        ],
        traps: [
          'Các nội động từ (intransitive verbs) như occur, happen, expire, remain, arrive KHÔNG BAO GIỜ chia bị động (không có "is occurred").'
        ]
      },
      {
        title: '2. Mẹo 5 Giây: Có Tân Ngữ Hay Không Có Tân Ngữ?',
        isHighFrequency: true,
        examBadge: '🔥 MẸO 5 GIÂY XỬ LÝ',
        formula: '• Chỗ trống + NOUN (Tân ngữ) ➔ Thường chọn CHỦ ĐỘNG\n• Chỗ trống + GIỚI TỪ (by/in/at) / Dấu chấm câu ➔ Chọn BỊ ĐỘNG',
        notes: [
          'Ngoại động từ bắt buộc phải có Tân ngữ (Danh từ) đi kèm phía sau.',
          'Khi chuyển sang Bị động, Tân ngữ đã bị đưa lên làm Chủ ngữ, do đó ngay sau động từ Bị động thường sẽ KHÔNG CÒN danh từ nữa, mà là Giới từ hoặc Trạng từ.'
        ],
        examples: [
          {
            en: 'The contract was signed by both parties yesterday.',
            vi: 'Hợp đồng đã được ký bởi cả hai bên vào hôm qua.'
          }
        ],
        traps: [
          'Cẩn thận với các động từ có 2 tân ngữ như give, send, award, offer: sau bị động vẫn có thể còn 1 tân ngữ (He was offered a new position).'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'All packages _______ at the distribution center before 3 PM will be delivered on the same day.',
        options: [
          { label: 'A', text: 'receive' },
          { label: 'B', text: 'received' },
          { label: 'C', text: 'are receiving' },
          { label: 'D', text: 'receiving' }
        ],
        correctAnswer: 'B',
        explanation: 'Đây là dạng rút gọn Mệnh đề quan hệ thể Bị động: "packages (which are) received at...". Động từ chính của câu là "will be delivered". Do đó chỗ trống cần phân từ quá khứ "received".',
        translation: 'Tất cả các kiện hàng được nhận tại trung tâm phân phối trước 3 giờ chiều sẽ được giao ngay trong ngày.'
      },
      {
        id: 2,
        question: 'The updated safety manual _______ to all factory supervisors next Monday.',
        options: [
          { label: 'A', text: 'will distribute' },
          { label: 'B', text: 'will be distributed' },
          { label: 'C', text: 'distributes' },
          { label: 'D', text: 'has distributed' }
        ],
        correctAnswer: 'B',
        explanation: 'Chủ ngữ "The updated safety manual" (sổ tay an toàn) là vật, không thể tự phát mà phải "được phát" (bị động). Hơn nữa có mốc thời gian "next Monday" nên chia thì tương lai bị động: "will be distributed".',
        translation: 'Sổ tay an toàn cập nhật sẽ được phát tới tất cả các giám sát viên nhà máy vào thứ Hai tới.'
      },
      {
        id: 3,
        question: 'The inspection team found that several fire extinguishers had not been _______ regularly.',
        options: [
          { label: 'A', text: 'inspect' },
          { label: 'B', text: 'inspects' },
          { label: 'C', text: 'inspected' },
          { label: 'D', text: 'inspection' }
        ],
        correctAnswer: 'C',
        explanation: 'Cấu trúc bị động quá khứ hoàn thành: "had + been + V3/ed". Chọn "inspected".',
        translation: 'Đoàn thanh tra phát hiện rằng một số bình cứu hỏa đã không được kiểm tra định kỳ.'
      },
      {
        id: 4,
        question: 'Any questions regarding the health insurance policy should be _______ to Human Resources.',
        options: [
          { label: 'A', text: 'direct' },
          { label: 'B', text: 'directed' },
          { label: 'C', text: 'direction' },
          { label: 'D', text: 'directly' }
        ],
        correctAnswer: 'B',
        explanation: 'Sau "should be" cần một phân từ quá khứ V3/ed để tạo thể bị động với modal verb: "should be directed to" (nên được chuyển hướng tới).',
        translation: 'Bất kỳ câu hỏi nào liên quan đến chính sách bảo hiểm y tế nên được chuyển tới phòng Nhân sự.'
      },
      {
        id: 5,
        question: 'The unexpected server outage _______ at approximately 2:00 AM yesterday.',
        options: [
          { label: 'A', text: 'was occurred' },
          { label: 'B', text: 'occurred' },
          { label: 'C', text: 'is occurring' },
          { label: 'D', text: 'occurring' }
        ],
        correctAnswer: 'B',
        explanation: 'BẪY ETS: "occur" là nội động từ (intransitive verb), tuyệt đối KHÔNG bao giờ chia ở dạng bị động ("was occurred" là SAI). Chọn "occurred".',
        translation: 'Sự cố máy chủ bất ngờ đã xảy ra vào khoảng 2 giờ sáng hôm qua.'
      }
    ]
  },
  {
    id: 'relative-clauses',
    title: 'Mệnh Đề Quan Hệ & Rút Gọn MĐQH',
    category: 'Mệnh đề & Nối câu',
    description: 'Quy tắc chọn Who, Whom, Which, That, Whose và cách rút gọn V-ing / V-ed đỉnh cao.',
    badge: 'Chắc Chắn Ra Thi',
    isHighFrequency: true,
    examFrequencyBadge: '🔥 CÂU ĂN ĐIỂM 700+',
    difficulty: 'Trung cấp (650+)',
    summary: 'Mệnh đề quan hệ và bài toán rút gọn mệnh đề quan hệ xuất hiện ít nhất 2-3 câu trong mỗi đề thi TOEIC. Nắm vững bí kíp giúp bạn làm đúng 100% dạng này.',
    sections: [
      {
        title: '1. Đại Từ & Trạng Từ Quan Hệ',
        formula: '• WHO: Danh từ người + WHO + V\n• WHOM: Danh từ người + WHOM + S + V\n• WHICH: Danh từ vật + WHICH + V / S + V\n• WHOSE: Danh từ + WHOSE + Noun\n• THAT: Thay thế cho Who / Whom / Which (không đứng sau dấu phẩy & giới từ)',
        notes: [
          'WHO: thay thế cho danh từ chỉ người, đóng vai trò chủ ngữ (theo sau là Động từ).',
          'WHOM: thay thế cho danh từ chỉ người, đóng vai trò tân ngữ (theo sau là Chủ ngữ + Động từ).',
          'WHICH: thay thế cho danh từ chỉ vật.',
          'WHOSE: chỉ sở hữu, bắt buộc đi kèm ngay sau bởi một Danh từ (whose + Noun).',
          'THAT: thay thế cho cả người và vật trong mệnh đề xác định (KHÔNG đứng sau dấu phẩy và giới từ).'
        ],
        examples: [
          {
            en: 'Candidates whose applications are received after Friday will not be considered.',
            vi: 'Những ứng viên có hồ sơ nộp sau thứ Sáu sẽ không được xem xét.'
          }
        ],
        traps: [
          'Sau dấu phẩy (,) và sau giới từ (in, at, with...) TUYỆT ĐỐI KHÔNG dùng "that".'
        ]
      },
      {
        title: '2. Tuyệt Kỹ Rút Gọn Mệnh Đề Quan Hệ',
        isHighFrequency: true,
        examBadge: '🔥 100% CÓ TRONG ĐỀ THI',
        formula: '• Rút gọn thể CHỦ ĐỘNG: V-ING\n• Rút gọn thể BỊ ĐỘNG: V3/ED',
        notes: [
          'Khi hai mệnh đề cùng chủ ngữ hoặc rút gọn đại từ quan hệ:',
          'Thể CHỦ ĐỘNG: Bỏ who/which/that và to be, đưa động từ về V-ING. (The man who teaches English -> The man teaching English).',
          'Thể BỊ ĐỘNG: Bỏ who/which/that và to be, giữ lại V3/ED. (The items that were ordered yesterday -> The items ordered yesterday).'
        ],
        examples: [
          {
            en: 'Employees wishing to attend the seminar must register online.',
            vi: 'Nhân viên (những người) muốn tham dự hội thảo phải đăng ký trực tuyến.'
          }
        ],
        traps: [
          'Đề thi thường cho câu đã có động từ chính (vd: "must register"), khoảng trống đứng sau danh từ "Employees" -> đó là chỗ rút gọn MĐQH, KHÔNG chọn động từ chia thì.'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'Anyone _______ to apply for the managerial role should submit their resume by noon.',
        options: [
          { label: 'A', text: 'wishes' },
          { label: 'B', text: 'wishing' },
          { label: 'C', text: 'wished' },
          { label: 'D', text: 'wish' }
        ],
        correctAnswer: 'B',
        explanation: 'Động từ chính của câu là "should submit". Do đó chỗ trống cần một mệnh đề quan hệ rút gọn ở thể chủ động: "Anyone (who wishes) to apply..." -> rút gọn thành "wishing".',
        translation: 'Bất kỳ ai muốn ứng tuyển vào vị trí quản lý nên nộp sơ yếu lý lịch trước buổi trưa.'
      },
      {
        id: 2,
        question: 'We recently hired a consultant _______ expertise in international trade will benefit our expansion.',
        options: [
          { label: 'A', text: 'who' },
          { label: 'B', text: 'whom' },
          { label: 'C', text: 'whose' },
          { label: 'D', text: 'which' }
        ],
        correctAnswer: 'C',
        explanation: 'Chỗ trống đứng trước danh từ "expertise" (chuyên môn). Ta cần đại từ quan hệ chỉ sở hữu "whose" (người mà chuyên môn của họ...) để nối với "a consultant".',
        translation: 'Gần đây chúng tôi đã thuê một chuyên gia tư vấn mà chuyên môn về thương mại quốc tế của người này sẽ mang lại lợi ích cho sự mở rộng của chúng tôi.'
      },
      {
        id: 3,
        question: 'The quarterly report, _______ was prepared by the finance division, highlights strong revenue growth.',
        options: [
          { label: 'A', text: 'that' },
          { label: 'B', text: 'which' },
          { label: 'C', text: 'what' },
          { label: 'D', text: 'who' }
        ],
        correctAnswer: 'B',
        explanation: 'Mệnh đề quan hệ không xác định có dấu phẩy (,) ngăn cách và bổ nghĩa cho vật "The quarterly report", nên dùng "which". Không dùng "that" sau dấu phẩy.',
        translation: 'Báo cáo hàng quý, cái mà được chuẩn bị bởi phòng tài chính, nêu bật sự tăng trưởng doanh thu mạnh mẽ.'
      },
      {
        id: 4,
        question: 'The merchandise _______ during the holiday clearance sale cannot be returned or exchanged.',
        options: [
          { label: 'A', text: 'purchased' },
          { label: 'B', text: 'purchase' },
          { label: 'C', text: 'purchasing' },
          { label: 'D', text: 'to purchase' }
        ],
        correctAnswer: 'A',
        explanation: 'Rút gọn mệnh đề quan hệ bị động: "The merchandise (which was) purchased during...". Động từ chính là "cannot be returned".',
        translation: 'Hàng hóa được mua trong đợt xả hàng ngày lễ không thể trả lại hoặc đổi.'
      },
      {
        id: 5,
        question: 'The technician _______ repaired our air conditioning system was very professional.',
        options: [
          { label: 'A', text: 'who' },
          { label: 'B', text: 'which' },
          { label: 'C', text: 'whom' },
          { label: 'D', text: 'whose' }
        ],
        correctAnswer: 'A',
        explanation: 'Chủ ngữ chỉ người "The technician", theo sau là động từ "repaired" -> cần đại từ quan hệ làm chủ ngữ là "who".',
        translation: 'Người kỹ thuật viên đã sửa hệ thống điều hòa của chúng tôi rất chuyên nghiệp.'
      }
    ]
  },
  {
    id: 'conjunctions-prepositions',
    title: 'Liên Từ vs Giới Từ (Bẫy Điểm Ăn Tiền)',
    category: 'Từ nối & Liên kết',
    description: 'Phân biệt cặp đôi kinh điển Because / Because of, Although / Despite, While / During.',
    badge: 'Bẫy Kinh Điển',
    isHighFrequency: true,
    examFrequencyBadge: '🚨 BẪY KINH ĐIỂN ETS (3-5 CÂU)',
    difficulty: 'Trung cấp (650+)',
    summary: 'ETS rất thích đưa cả Liên từ (Conjunction) và Giới từ (Preposition) có cùng nghĩa vào 4 lựa chọn. Bí quyết đơn giản: Nhìn xem phía sau là một Mệnh đề (S + V) hay một Cụm danh từ (Noun/V-ing)!',
    sections: [
      {
        title: '1. Nhóm "Bởi vì" (Reason)',
        isHighFrequency: true,
        examBadge: '🔥 HAY RA NHẤT PART 5',
        formula: '• LIÊN TỪ (Because / Since / As / Now that) + S + V\n• GIỚI TỪ (Because of / Due to / Owing to) + Noun / V-ing',
        notes: [
          'LIÊN TỪ (+ S + V): Because, Since, As, Now that.',
          'GIỚI TỪ (+ Noun / V-ing): Because of, Due to, Owing to, On account of, Thanks to.'
        ],
        examples: [
          {
            en: 'Because the flight was delayed, he missed the meeting.',
            vi: 'Bởi vì chuyến bay bị trễ (mệnh đề S + V), anh ấy đã lỡ cuộc họp.'
          },
          {
            en: 'Because of the bad weather, the flight was delayed.',
            vi: 'Bởi vì thời tiết xấu (cụm danh từ), chuyến bay đã bị trễ.'
          }
        ],
        traps: [
          'Gặp "Due to" hoặc "Because of" mà phía sau có S + V là loại ngay lập tức!'
        ]
      },
      {
        title: '2. Nhóm "Mặc dù" (Concession)',
        isHighFrequency: true,
        examBadge: '🚨 BẪY KINH ĐIỂN CỦA ETS',
        formula: '• LIÊN TỪ: Although / Even though / Though + S + V\n• GIỚI TỪ: Despite / In spite of + Noun / V-ing',
        notes: [
          'LIÊN TỪ (+ S + V): Although, Even though, Though, While.',
          'GIỚI TỪ (+ Noun / V-ing): Despite, In spite of, Notwithstanding.'
        ],
        examples: [
          {
            en: 'Although he worked overtime, he could not finish the presentation.',
            vi: 'Mặc dù anh ấy làm thêm giờ (S + V), anh ấy không thể hoàn thành bài thuyết trình.'
          },
          {
            en: 'Despite heavy traffic, Ms. Gomez arrived on time.',
            vi: 'Mặc dù giao thông đông đúc (cụm Noun), cô Gomez vẫn đến đúng giờ.'
          }
        ],
        traps: [
          'Nhớ rằng: "Despite" KHÔNG CÓ "of" (Despite of là SAI). Chỉ có "In spite of".'
        ]
      },
      {
        title: '3. Nhóm "Trong khi" & "Trong suốt"',
        formula: '• While + S + V (hoặc While + V-ing)\n• During + Noun (sự kiện, kỳ nghỉ, hội nghị)',
        notes: [
          'While (+ S + V / V-ing): Trong khi hành động đang xảy ra (While traveling in Japan).',
          'During (+ Noun): Trong suốt một kỳ, sự kiện (During the conference, during the winter break).'
        ],
        examples: [
          {
            en: 'Please turn off cell phones during the seminar.',
            vi: 'Vui lòng tắt điện thoại di động trong suốt buổi hội thảo.'
          }
        ],
        traps: [
          'Không dùng "During + S + V".'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: '_______ heavy rainfall throughout the morning, the construction project proceeded on schedule.',
        options: [
          { label: 'A', text: 'Although' },
          { label: 'B', text: 'Despite' },
          { label: 'C', text: 'Even though' },
          { label: 'D', text: 'Because' }
        ],
        correctAnswer: 'B',
        explanation: 'Phía sau chỗ trống là một cụm danh từ "heavy rainfall throughout the morning" (cơn mưa nặng hạt suốt buổi sáng), không có động từ chính. Ta cần một giới từ chỉ sự tương phản -> chọn "Despite". Although và Even though phải cộng mệnh đề S + V.',
        translation: 'Mặc dù mưa nặng hạt suốt buổi sáng, dự án xây dựng vẫn tiến hành đúng tiến độ.'
      },
      {
        id: 2,
        question: 'The warehouse will remain closed tomorrow _______ inventory inspections are taking place.',
        options: [
          { label: 'A', text: 'because of' },
          { label: 'B', text: 'since' },
          { label: 'C', text: 'due to' },
          { label: 'D', text: 'owing to' }
        ],
        correctAnswer: 'B',
        explanation: 'Phía sau là một mệnh đề hoàn chỉnh có chủ ngữ "inventory inspections" và động từ "are taking place". Do đó ta cần một liên từ chỉ lý do. "Since" (= because) đóng vai trò liên từ đi với S + V. Ba phương án còn lại đều là giới từ đi với danh từ.',
        translation: 'Nhà kho sẽ đóng cửa vào ngày mai vì các cuộc kiểm kê hàng tồn kho đang diễn ra.'
      },
      {
        id: 3,
        question: 'Attendees are kindly requested to silence their mobile devices _______ the keynote address.',
        options: [
          { label: 'A', text: 'during' },
          { label: 'B', text: 'while' },
          { label: 'C', text: 'whereas' },
          { label: 'D', text: 'as' }
        ],
        correctAnswer: 'A',
        explanation: '"the keynote address" là một danh từ chỉ sự kiện. Ta dùng giới từ "during" (+ Noun) để chỉ trong suốt sự kiện đó. "While" phải đi kèm mệnh đề hoặc V-ing.',
        translation: 'Khách tham dự được yêu cầu để điện thoại ở chế độ im lặng trong suốt bài phát biểu chính.'
      },
      {
        id: 4,
        question: '_______ the economic downturn, the startup managed to achieve a 20% increase in revenue.',
        options: [
          { label: 'A', text: 'In spite of' },
          { label: 'B', text: 'Even though' },
          { label: 'C', text: 'Because' },
          { label: 'D', text: 'While' }
        ],
        correctAnswer: 'A',
        explanation: '"the economic downturn" là cụm danh từ, mang nghĩa tương phản với việc tăng trưởng 20% doanh thu. Chọn giới từ "In spite of".',
        translation: 'Bất chấp sự suy thoái kinh tế, công ty khởi nghiệp vẫn cố gắng đạt được mức tăng trưởng 20% doanh thu.'
      },
      {
        id: 5,
        question: 'The CEO approved the expansion plan _______ the marketing team had presented compelling market research.',
        options: [
          { label: 'A', text: 'because of' },
          { label: 'B', text: 'due to' },
          { label: 'C', text: 'because' },
          { label: 'D', text: 'in spite of' }
        ],
        correctAnswer: 'C',
        explanation: 'Phía sau chỗ trống là mệnh đề "the marketing team had presented..." (S + V) nên cần liên từ chỉ nguyên nhân "because".',
        translation: 'Giám đốc điều hành đã phê duyệt kế hoạch mở rộng vì đội ngũ tiếp thị đã trình bày nghiên cứu thị trường đầy thuyết phục.'
      }
    ]
  },
  {
    id: 'conditionals-inversion',
    title: 'Câu Điều Kiện & Đảo Ngữ Trong TOEIC',
    category: 'Mẫu câu đặc biệt',
    description: 'Bí kíp đảo ngữ Should, Were, Had và các từ đồng nghĩa Unless, Provided that.',
    badge: 'Chinh Phục 800+',
    difficulty: 'Nâng cao (800+)',
    summary: 'Đề thi TOEIC phần điểm cao (800+) rất thích dùng cấu trúc Đảo ngữ của câu điều kiện (loại bỏ If, đảo trợ động từ lên đầu câu). Nhìn thấy Should/Had đứng đầu câu thì 99% là đảo ngữ!',
    sections: [
      {
        title: '1. Ba Loại Câu Điều Kiện Cơ Bản',
        formula: '• Loại 1: If + S + V(hiện tại đơn), S + will / can + V-inf\n• Loại 2: If + S + V2/ed, S + would / could + V-inf\n• Loại 3: If + S + had + V3/ed, S + would / could have + V3/ed',
        notes: [
          'Loại 1: Có thể xảy ra ở hiện tại hoặc tương lai (If it rains, we will reschedule).',
          'Loại 2: Giả định trái với hiện tại (If I were the manager, I would approve this).',
          'Loại 3: Giả định trái với quá khứ (If we had left earlier, we would not have missed the train).'
        ],
        examples: [
          {
            en: 'If you have any questions regarding the invoice, please contact accounting.',
            vi: 'Nếu bạn có bất kỳ câu hỏi nào về hóa đơn, vui lòng liên hệ kế toán.'
          }
        ],
        traps: [
          'Unless = If ... not (Trừ khi / Nếu không). Sau unless KHÔNG dùng phủ định thêm một lần nữa.'
        ]
      },
      {
        title: '2. Đảo Ngữ Câu Điều Kiện (Inversion) - Đặc Sản Part 5',
        isHighFrequency: true,
        examBadge: '⭐ CÂU ĐIỂM 800+',
        formula: '• Đảo ngữ Loại 1: Should + S + V-inf, S + will + V\n• Đảo ngữ Loại 2: Were + S + to V, S + would + V\n• Đảo ngữ Loại 3: Had + S + V3/ed, S + would have + V3/ed',
        notes: [
          'Đảo ngữ loại 1: "If you need assistance" -> "Should you need assistance". Rất hay gặp trong email thương mại!',
          'Đảo ngữ loại 3: "If we had known" -> "Had we known".',
          'Từ thay thế cho "If": Provided that, As long as, In case, Assuming that.'
        ],
        examples: [
          {
            en: 'Should you require additional information, do not hesitate to contact our office.',
            vi: 'Nếu quý khách cần thêm thông tin, đừng ngần ngại liên hệ văn phòng chúng tôi.'
          }
        ],
        traps: [
          'Khi thấy "Should" đứng đầu câu mà cuối câu là dấu chấm (.) chứ không phải dấu hỏi (?), đó chính là câu điều kiện đảo ngữ, động từ sau S phải ở dạng nguyên mẫu không chia!'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: '_______ you experience any technical difficulties with the software, please reach out to IT support immediately.',
        options: [
          { label: 'A', text: 'Should' },
          { label: 'B', text: 'Were' },
          { label: 'C', text: 'Had' },
          { label: 'D', text: 'Unless' }
        ],
        correctAnswer: 'A',
        explanation: 'Đây là cấu trúc đảo ngữ câu điều kiện loại 1: "Should + S + V-inf, (please + V)". Câu gốc là: "If you experience...". Chọn "Should".',
        translation: 'Nếu bạn gặp phải bất kỳ sự cố kỹ thuật nào với phần mềm, vui lòng liên hệ với bộ phận hỗ trợ CNTT ngay lập tức.'
      },
      {
        id: 2,
        question: '_______ the delivery arrive late, the client will be entitled to a full refund.',
        options: [
          { label: 'A', text: 'Should' },
          { label: 'B', text: 'If' },
          { label: 'C', text: 'Had' },
          { label: 'D', text: 'Were' }
        ],
        correctAnswer: 'A',
        explanation: 'Lưu ý chủ ngữ "the delivery" là số ít, nhưng động từ "arrive" lại ở dạng nguyên mẫu không chia (-s). Do đó đây là đảo ngữ của loại 1 với "Should" (Should the delivery arrive...). Nếu dùng "If" thì phải là "If the delivery arrives".',
        translation: 'Nếu đơn hàng giao trễ, khách hàng sẽ có quyền được hoàn tiền toàn bộ.'
      },
      {
        id: 3,
        question: 'Had we known about the scheduling conflict earlier, we _______ the conference date.',
        options: [
          { label: 'A', text: 'changed' },
          { label: 'B', text: 'would change' },
          { label: 'C', text: 'would have changed' },
          { label: 'D', text: 'will change' }
        ],
        correctAnswer: 'C',
        explanation: 'Đảo ngữ điều kiện loại 3: "Had + S + V3/ed, S + would have + V3/ed". Chọn "would have changed".',
        translation: 'Nếu chúng tôi biết về sự trùng lặp lịch trình sớm hơn, chúng tôi đã thay đổi ngày diễn ra hội nghị.'
      },
      {
        id: 4,
        question: 'Employees are permitted to work remotely on Fridays, _______ their weekly tasks are completed.',
        options: [
          { label: 'A', text: 'provided that' },
          { label: 'B', text: 'despite' },
          { label: 'C', text: 'even' },
          { label: 'D', text: 'because of' }
        ],
        correctAnswer: 'A',
        explanation: '"Provided that" (= If / As long as: với điều kiện là / miễn là) dùng để nối với mệnh đề điều kiện "their weekly tasks are completed".',
        translation: 'Nhân viên được phép làm việc từ xa vào thứ Sáu, miễn là các công việc hàng tuần của họ đã hoàn thành.'
      },
      {
        id: 5,
        question: 'Unless the contract is signed by 5 PM today, the offer _______ invalid.',
        options: [
          { label: 'A', text: 'became' },
          { label: 'B', text: 'will become' },
          { label: 'C', text: 'has become' },
          { label: 'D', text: 'becoming' }
        ],
        correctAnswer: 'B',
        explanation: 'Câu điều kiện loại 1 với "Unless + S + V(hiện tại đơn), S + will + V-inf". Chọn "will become".',
        translation: 'Trừ khi hợp đồng được ký trước 5 giờ chiều hôm nay, nếu không lời đề nghị sẽ mất hiệu lực.'
      }
    ]
  },
  {
    id: 'subject-verb-agreement',
    title: 'Sự Hòa Hợp Chủ Ngữ & Động Từ',
    category: 'Quy tắc ngữ pháp',
    description: 'Quy tắc chia động từ số ít hay số nhiều: Each, Every, Either/Or, The number vs A number.',
    badge: 'Cực Hay Bẫy',
    isHighFrequency: true,
    examFrequencyBadge: '⭐ BẪY CHỦ NGỮ DÀI',
    difficulty: 'Cơ bản (450+)',
    summary: 'Bài toán hòa hợp giữa Chủ ngữ và Động từ (S - V Agreement) yêu cầu xác định đúng Chủ ngữ thật của câu giữa hàng loạt cụm giới từ gây nhiễu.',
    sections: [
      {
        title: '1. Quy Tắc Loại Bỏ Cụm Giới Từ Gây Nhiễu',
        isHighFrequency: true,
        examBadge: '🚨 BẪY CHỦ NGỮ DÀI',
        formula: 'S + [Giới từ + Noun] + VERB -> Động từ chia theo CHỦ NGỮ ĐẦU TIÊN (S)',
        notes: [
          'Các cụm xen giữa như "of...", "in...", "along with...", "as well as...", "together with..." KHÔNG làm thay đổi số lượng của chủ ngữ chính.',
          'Ví dụ: The quality of these products IS guaranteed. ("The quality" là số ít, không chia theo "products").'
        ],
        examples: [
          {
            en: 'The manager, along with his assistants, has attended the workshop.',
            vi: 'Người quản lý, cùng với các trợ lý của anh ấy, đã tham dự buổi hội thảo.'
          }
        ],
        traps: [
          'Thí sinh thường nhìn thấy danh từ số nhiều đứng ngay trước chỗ trống (these products, assistants) rồi vội vàng chia động từ số nhiều -> Dính bẫy!'
        ]
      },
      {
        title: '2. Các Chủ Ngữ Luôn Đi Với Động Từ Số Ít',
        isHighFrequency: true,
        examBadge: '🔥 EACH/EVERY + V SỐ ÍT',
        formula: 'Each / Every / Everyone / Someone / Nobody / Either of / Neither of + V(SỐ ÍT)',
        notes: [
          'Mỗi / Mọi / Đại từ bất định: Each, Every + N(số ít) -> V(số ít).',
          'Each of the + N(số nhiều) -> V(SỐ ÍT)!',
          'Khoảng cách, tiền bạc, thời gian làm chủ ngữ chia số ít: Ten kilometers is a long way. 100 dollars was spent.'
        ],
        examples: [
          {
            en: 'Each of the participants was given a welcome packet.',
            vi: 'Mỗi một người tham gia đã được phát một gói tài liệu chào mừng.'
          }
        ],
        traps: [
          'Nhớ: "The number of + N(số nhiều) + V(số ít)" (Số lượng của...). Trong khi "A number of + N(số nhiều) + V(số nhiều)" (Một số...).'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'The number of tourists visiting the national museum _______ significantly over the summer.',
        options: [
          { label: 'A', text: 'has increased' },
          { label: 'B', text: 'have increased' },
          { label: 'C', text: 'are increasing' },
          { label: 'D', text: 'increase' }
        ],
        correctAnswer: 'A',
        explanation: 'Chủ ngữ là "The number of + Ns", chỉ con số lượng nên động từ bắt buộc chia ở số ít. Chọn "has increased".',
        translation: 'Số lượng khách du lịch đến thăm bảo tàng quốc gia đã tăng đáng kể trong suốt mùa hè.'
      },
      {
        id: 2,
        question: 'The cost of modern manufacturing machines and equipment _______ continuously in recent years.',
        options: [
          { label: 'A', text: 'have risen' },
          { label: 'B', text: 'has risen' },
          { label: 'C', text: 'are rising' },
          { label: 'D', text: 'rise' }
        ],
        correctAnswer: 'B',
        explanation: 'Chủ ngữ thật của câu là "The cost" (danh từ số ít), cụm "of modern manufacturing machines and equipment" chỉ là bổ ngữ gây nhiễu. Động từ chia theo "The cost" -> "has risen".',
        translation: 'Chi phí của máy móc và thiết bị sản xuất hiện đại đã liên tục tăng trong những năm gần đây.'
      },
      {
        id: 3,
        question: 'Each of the regional branch managers _______ required to submit monthly performance reviews.',
        options: [
          { label: 'A', text: 'is' },
          { label: 'B', text: 'are' },
          { label: 'C', text: 'were' },
          { label: 'D', text: 'be' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc "Each of + N(số nhiều)" luôn đi cùng động từ số ít. Chọn "is".',
        translation: 'Mỗi một quản lý chi nhánh khu vực được yêu cầu nộp đánh giá hiệu suất hàng tháng.'
      },
      {
        id: 4,
        question: 'Neither the department supervisor nor the team members _______ available for comment.',
        options: [
          { label: 'A', text: 'was' },
          { label: 'B', text: 'were' },
          { label: 'C', text: 'is' },
          { label: 'D', text: 'has been' }
        ],
        correctAnswer: 'B',
        explanation: 'Quy tắc "Neither S1 nor S2 + Verb": động từ chia theo chủ ngữ gần nó nhất (S2). Ở đây S2 là "the team members" (số nhiều) nên chia động từ số nhiều "were".',
        translation: 'Cả giám sát phòng ban lẫn các thành viên trong nhóm đều không có mặt để đưa ra bình luận.'
      },
      {
        id: 5,
        question: 'A number of applicants _______ already submitted their credentials for the senior engineer post.',
        options: [
          { label: 'A', text: 'have' },
          { label: 'B', text: 'has' },
          { label: 'C', text: 'is' },
          { label: 'D', text: 'was' }
        ],
        correctAnswer: 'A',
        explanation: '"A number of + N(số nhiều)" mang nghĩa "một vài/một số người" nên động từ chia số nhiều. Chọn "have".',
        translation: 'Một số ứng viên đã nộp chứng chỉ năng lực của họ cho vị trí kỹ sư cấp cao.'
      }
    ]
  },
  {
    id: 'comparisons',
    title: 'Cấu Trúc So Sánh (Comparisons)',
    category: 'Tính từ & Trạng từ',
    description: 'So sánh hơn, so sánh nhất, so sánh kép và các từ nhấn mạnh đặc trưng: much, significantly, far.',
    badge: 'Mẹo Bổ Nghĩa',
    difficulty: 'Cơ bản (450+)',
    summary: 'Trong TOEIC, ngoài công thức so sánh thông thường, bài thi rất hay hỏi các TRẠNG TỪ bổ nghĩa cho so sánh hơn (much higher, significantly lower) thay vì very/more.',
    sections: [
      {
        title: '1. So Sánh Bằng, So Sánh Hơn, So Sánh Nhất',
        formula: '• So sánh bằng: as + ADJ / ADV + as\n• So sánh hơn: Adj-er / more + Adj + THAN\n• So sánh nhất: the + Adj-est / the most + Adj',
        notes: [
          'Giữa "as... as" có thể là Tính từ hoặc Trạng từ (tùy vào động từ phía trước là Be hay Động từ thường).',
          'So sánh hơn luôn có "THAN".',
          'So sánh nhất luôn có "THE" hoặc tính từ sở hữu phía trước.'
        ],
        examples: [
          {
            en: 'The new engine operates as efficiently as the previous model.',
            vi: 'Động cơ mới hoạt động hiệu quả như mẫu động cơ trước.'
          },
          {
            en: 'This is the most comprehensive survey we have ever conducted.',
            vi: 'Đây là cuộc khảo sát toàn diện nhất mà chúng tôi từng thực hiện.'
          }
        ],
        traps: [
          'KHÔNG dùng "more" chung với tính từ đã thêm đuôi -er (vd: more higher là SAI).'
        ]
      },
      {
        title: '2. Các Trạng Từ Nhấn Mạnh So Sánh Hơn (Cực Kỳ Hay Gặp)',
        isHighFrequency: true,
        examBadge: '🔥 BẪY BỔ NGHĨA SO SÁNH',
        formula: 'much / far / significantly / substantially / considerably / even + SO SÁNH HƠN',
        notes: [
          'Tuyệt đối KHÔNG dùng "very", "quite", "many" để nhấn mạnh so sánh hơn.',
          'Ví dụ: much more expensive, significantly higher, far better.'
        ],
        examples: [
          {
            en: 'Our third-quarter profits were significantly higher than expected.',
            vi: 'Lợi nhuận quý 3 của chúng tôi cao hơn đáng kể so với kỳ vọng.'
          }
        ],
        traps: [
          'Đề thi: "The cost is _______ higher than estimated. (A. very, B. substantially, C. too, D. highly)". Đáp án đúng bắt buộc là substantially!'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'The newly upgraded server operates _______ faster than the old setup.',
        options: [
          { label: 'A', text: 'significantly' },
          { label: 'B', text: 'very' },
          { label: 'C', text: 'more' },
          { label: 'D', text: 'extremely' }
        ],
        correctAnswer: 'A',
        explanation: 'Để bổ nghĩa và nhấn mạnh cho tính từ so sánh hơn "faster than", ta dùng các trạng từ: significantly, much, far, substantially, considerably. Không dùng "very" hay "extremely" trước so sánh hơn.',
        translation: 'Máy chủ mới được nâng cấp hoạt động nhanh hơn đáng kể so với cấu hình cũ.'
      },
      {
        id: 2,
        question: 'Online sales during the holiday promotional event were as _______ as projected.',
        options: [
          { label: 'A', text: 'strong' },
          { label: 'B', text: 'stronger' },
          { label: 'C', text: 'strongly' },
          { label: 'D', text: 'strength' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc so sánh bằng "as + adj + as". Đứng sau to be "were" ta cần tính từ nguyên mẫu "strong".',
        translation: 'Doanh số bán hàng trực tuyến trong sự kiện khuyến mãi ngày lễ mạnh mẽ như dự kiến.'
      },
      {
        id: 3,
        question: 'Of all the branch proposals submitted this quarter, Mr. Lee\'s plan was by far the _______ .',
        options: [
          { label: 'A', text: 'innovative' },
          { label: 'B', text: 'more innovative' },
          { label: 'C', text: 'most innovative' },
          { label: 'D', text: 'innovatively' }
        ],
        correctAnswer: 'C',
        explanation: 'Cụm so sánh trong tổng thể "Of all..." kết hợp với "by far the..." yêu cầu cấu trúc so sánh nhất: "the most innovative".',
        translation: 'Trong số tất cả các đề xuất của chi nhánh được nộp trong quý này, kế hoạch của ông Lee là sáng tạo nhất.'
      },
      {
        id: 4,
        question: 'The new express route is _______ convenient for downtown commuters than the subway.',
        options: [
          { label: 'A', text: 'more' },
          { label: 'B', text: 'most' },
          { label: 'C', text: 'as' },
          { label: 'D', text: 'much' }
        ],
        correctAnswer: 'A',
        explanation: 'Phía sau có từ "than" nên cần cấu trúc so sánh hơn của tính từ dài "convenient": "more convenient than".',
        translation: 'Tuyến đường cao tốc mới thuận tiện hơn cho người đi lại khu trung tâm so với tàu điện ngầm.'
      },
      {
        id: 5,
        question: 'The earlier we submit the architectural blueprint, the _______ the building permit will be approved.',
        options: [
          { label: 'A', text: 'quick' },
          { label: 'B', text: 'quicker' },
          { label: 'C', text: 'more quickly' },
          { label: 'D', text: 'quickest' }
        ],
        correctAnswer: 'C',
        explanation: 'Cấu trúc so sánh kép: "The + comparative ..., the + comparative ...". Động từ ở vế sau là "will be approved" (được phê duyệt - động từ thường) nên ta cần trạng từ so sánh hơn "more quickly" (hoặc quicker). "more quickly" là đáp án ngữ pháp chuẩn xác nhất.',
        translation: 'Chúng ta nộp bản thiết kế kiến trúc càng sớm thì giấy phép xây dựng sẽ càng được phê duyệt nhanh chóng.'
      }
    ]
  },
  {
    id: 'subjunctive-mood',
    title: 'Thể Giả Định (Subjunctive Mood)',
    category: 'Mẫu câu nâng cao',
    description: 'Quy tắc "V-infinitive bất chấp ngôi thứ" sau suggest, recommend, demand, essential.',
    badge: 'Chắc Chắn Gặp',
    difficulty: 'Nâng cao (800+)',
    summary: 'Khi gặp các động từ hoặc tính từ mang tính yêu cầu, đề nghị, mệnh đề sau "that" luôn sử dụng động từ ở dạng NGUYÊN MẪU (V-inf không chia), vì đã ẩn đi từ "should".',
    sections: [
      {
        title: '1. Động Từ Yêu Cầu, Đề Nghị (Verbs of Request & Suggestion)',
        isHighFrequency: true,
        examBadge: '⭐ BẪY V-INF ẨN SHOULD',
        formula: 'S + suggest / recommend / demand / request / require / insist / ask + THAT + S + (should) + V-inf',
        notes: [
          'Động từ ở mệnh đề sau THAT luôn giữ nguyên thể V-inf, không chia thì, không chia số ít, không thêm -s/es.',
          'Dù chủ ngữ là he, she, it hay danh từ số ít: "He suggested that she TAKE the train."',
          'Thể bị động: that + S + (should) BE + V3/ed.'
        ],
        examples: [
          {
            en: 'The doctor recommended that Mr. Baker exercise at least 30 minutes a day.',
            vi: 'Bác sĩ khuyên rằng ông Baker nên tập thể dục ít nhất 30 phút mỗi ngày (exercise giữ nguyên mẫu dù Mr. Baker là ngôi thứ 3 số ít).'
          }
        ],
        traps: [
          'Đừng để chủ ngữ số ít đánh lừa mà chọn V-s/es! Cứ thấy recommend/suggest that là chọn V nguyên thể.'
        ]
      },
      {
        title: '2. Tính Từ Quan Trọng, Cần Thiết (Adjectives of Urgency)',
        formula: 'It is essential / necessary / vital / crucial / imperative / important + THAT + S + (should) + V-inf',
        notes: [
          'Các tính từ biểu đạt tính cấp thiết, bắt buộc.',
          'Ví dụ: It is crucial that the server be monitored 24/7.'
        ],
        examples: [
          {
            en: 'It is essential that every staff member attend the safety training session.',
            vi: 'Điều thiết yếu là mọi nhân viên phải tham dự buổi tập huấn an toàn.'
          }
        ],
        traps: [
          'Dạng bị động luôn là "be + V3/ed", ví dụ: It is necessary that all doors BE locked at night.'
        ]
      }
    ],
    exercises: [
      {
        id: 1,
        question: 'The director requested that all department heads _______ the quarterly budget report before Friday.',
        options: [
          { label: 'A', text: 'finalize' },
          { label: 'B', text: 'finalizes' },
          { label: 'C', text: 'finalized' },
          { label: 'D', text: 'finalizing' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc giả định thức với động từ "request that + S + (should) + V-inf". Động từ luôn ở dạng nguyên mẫu không chia. Chọn "finalize".',
        translation: 'Giám đốc yêu cầu rằng tất cả các trưởng phòng ban phải hoàn thiện báo cáo ngân sách quý trước thứ Sáu.'
      },
      {
        id: 2,
        question: 'It is imperative that every visitor _______ an identification badge while inside the facility.',
        options: [
          { label: 'A', text: 'wears' },
          { label: 'B', text: 'wear' },
          { label: 'C', text: 'wore' },
          { label: 'D', text: 'wearing' }
        ],
        correctAnswer: 'B',
        explanation: 'Cấu trúc "It is imperative that + S + (should) + V-inf". Chủ ngữ "every visitor" là số ít nhưng động từ vẫn giữ nguyên mẫu "wear".',
        translation: 'Điều bắt buộc là mọi khách đến thăm phải đeo thẻ nhận dạng khi ở bên trong cơ sở.'
      },
      {
        id: 3,
        question: 'The health inspector recommended that the restaurant kitchen _______ thoroughly sanitized every evening.',
        options: [
          { label: 'A', text: 'is' },
          { label: 'B', text: 'was' },
          { label: 'C', text: 'be' },
          { label: 'D', text: 'being' }
        ],
        correctAnswer: 'C',
        explanation: 'Dạng bị động của thể giả định sau "recommended that": "S + (should) + be + V3/ed". Chọn "be".',
        translation: 'Thanh tra y tế khuyến nghị rằng gian bếp nhà hàng cần được vệ sinh kỹ lưỡng mỗi buổi tối.'
      },
      {
        id: 4,
        question: 'The project coordinator insisted that Ms. Lin _______ present at tomorrow\'s stakeholder briefing.',
        options: [
          { label: 'A', text: 'is' },
          { label: 'B', text: 'be' },
          { label: 'C', text: 'was' },
          { label: 'D', text: 'been' }
        ],
        correctAnswer: 'B',
        explanation: 'Sau "insisted that + S + (should) + V-inf". Động từ to be ở dạng nguyên thể là "be".',
        translation: 'Điều phối viên dự án khăng khăng rằng cô Lin phải có mặt tại buổi họp giao ban cổ đông vào ngày mai.'
      },
      {
        id: 5,
        question: 'It is essential that confidential client files _______ securely on encrypted drives.',
        options: [
          { label: 'A', text: 'store' },
          { label: 'B', text: 'stored' },
          { label: 'C', text: 'be stored' },
          { label: 'D', text: 'are storing' }
        ],
        correctAnswer: 'C',
        explanation: 'Cấu trúc giả định bị động: "It is essential that + S + be + V3/ed". Các tập tin tài liệu khách hàng phải "được lưu trữ" an toàn. Chọn "be stored".',
        translation: 'Điều tối quan trọng là các tập tin bảo mật của khách hàng phải được lưu trữ an toàn trên các ổ đĩa mã hóa.'
      }
    ]
  }
];

export const getAllGrammarExercises = (): (GrammarExercise & { topicTitle: string })[] => {
  const all: (GrammarExercise & { topicTitle: string })[] = [];
  grammarTopics.forEach(topic => {
    topic.exercises.forEach(ex => {
      all.push({
        ...ex,
        topicTitle: topic.title
      });
    });
  });
  return all;
};
