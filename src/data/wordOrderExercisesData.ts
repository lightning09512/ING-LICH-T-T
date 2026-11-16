import type { GrammarExercise } from './grammarData';

export const wordOrderExercisesMap: { [ruleId: string]: GrammarExercise[] } = {
  // 1. ADV BEFORE VERB: S + ADV + VERB + (O)
  'adv-before-verb': [
    {
      id: 1,
      question: 'The committee members _______ evaluated all vendor bids before selecting a contractor for the headquarters renovation.',
      options: [
        { label: 'A', text: 'thorough' },
        { label: 'B', text: 'thoroughly' },
        { label: 'C', text: 'thoroughness' },
        { label: 'D', text: 'more thorough' }
      ],
      correctAnswer: 'B',
      explanation: 'Vị trí giữa chủ ngữ "The committee members" và động từ chính "evaluated" cần một TRẠNG TỪ (Adverb đuôi -ly) để bổ nghĩa cho động từ: "thoroughly evaluated" (đã đánh giá một cách kỹ lưỡng).',
      translation: 'Các thành viên ủy ban đã đánh giá kỹ lưỡng tất cả hồ sơ dự thầu trước khi lựa chọn nhà thầu cải tạo trụ sở chính.'
    },
    {
      id: 2,
      question: 'Ms. Vance _______ delivers high-quality graphic designs well ahead of project deadlines.',
      options: [
        { label: 'A', text: 'consistent' },
        { label: 'B', text: 'consistency' },
        { label: 'C', text: 'consistently' },
        { label: 'D', text: 'consisting' }
      ],
      correctAnswer: 'C',
      explanation: 'Đứng ngay trước động từ thường "delivers" để chỉ tần suất/cách thức hành động phải là TRẠNG TỪ: "consistently delivers" (luôn luôn/đều đặn bàn giao).',
      translation: 'Cô Vance luôn luôn bàn giao các bản thiết kế đồ họa chất lượng cao trước hạn chót của dự án.'
    },
    {
      id: 3,
      question: 'The regional logistics team _______ resolved the shipping delay after contacting the local warehouse manager.',
      options: [
        { label: 'A', text: 'promptly' },
        { label: 'B', text: 'promptness' },
        { label: 'C', text: 'prompt' },
        { label: 'D', text: 'prompter' }
      ],
      correctAnswer: 'A',
      explanation: 'Đứng trước động từ quá khứ "resolved" (đã giải quyết) cần trạng từ "promptly" (nhanh chóng/kịp thời) để bổ nghĩa cho hành động.',
      translation: 'Đội hậu cần khu vực đã nhanh chóng giải quyết sự chậm trễ vận chuyển sau khi liên hệ với quản lý kho địa phương.'
    },
    {
      id: 4,
      question: 'Chief financial officer David Sterling _______ predicted the fourth-quarter revenue growth in his annual report.',
      options: [
        { label: 'A', text: 'accurate' },
        { label: 'B', text: 'accurately' },
        { label: 'C', text: 'accuracy' },
        { label: 'D', text: 'more accurate' }
      ],
      correctAnswer: 'B',
      explanation: 'Đứng trước động từ "predicted" (dự đoán) bổ nghĩa cho hành động dự đoán cần trạng từ đuôi -ly: "accurately" (một cách chính xác).',
      translation: 'Giám đốc tài chính David Sterling đã dự đoán chính xác mức tăng trưởng doanh thu quý 4 trong báo cáo thường niên.'
    },
    {
      id: 5,
      question: 'Local retail store managers _______ encourage customers to sign up for the digital membership card.',
      options: [
        { label: 'A', text: 'active' },
        { label: 'B', text: 'action' },
        { label: 'C', text: 'actively' },
        { label: 'D', text: 'activity' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc S + ADV + V: "managers (S) + actively (Adv) + encourage (V)". Trạng từ "actively" (tích cực/chủ động) bổ nghĩa cho động từ "encourage".',
      translation: 'Các quản lý cửa hàng bán lẻ địa phương tích cực khuyến khích khách hàng đăng ký thẻ thành viên điện tử.'
    }
  ],

  // 2. BE / LINKING VERBS + ADJECTIVE
  'be-linking-verb-adj': [
    {
      id: 1,
      question: 'Although the recent market shifts were unexpected, the board of directors remains _______ about next year’s profits.',
      options: [
        { label: 'A', text: 'optimism' },
        { label: 'B', text: 'optimistic' },
        { label: 'C', text: 'optimistically' },
        { label: 'D', text: 'optimist' }
      ],
      correctAnswer: 'B',
      explanation: 'Động từ "remain" là một LINKING VERB (động từ nối chỉ trạng thái duy trì), theo sau bắt buộc là một TÍNH TỪ (Adjective) đóng vai trò vị ngữ: "remains optimistic" (vẫn lạc quan). Bẫy TOEIC thường đặt trạng từ -ly vào đây là sai.',
      translation: 'Mặc dù những biến động thị trường gần đây là bất ngờ, ban giám đốc vẫn lạc quan về lợi nhuận năm tới.'
    },
    {
      id: 2,
      question: 'The updated mobile banking application appears _______ to use, according to preliminary user feedback.',
      options: [
        { label: 'A', text: 'convenience' },
        { label: 'B', text: 'conveniently' },
        { label: 'C', text: 'convenient' },
        { label: 'D', text: 'convening' }
      ],
      correctAnswer: 'C',
      explanation: 'Động từ "appear" ở đây đóng vai trò Linking verb mang nghĩa "có vẻ/dường như", theo sau là tính từ: "appear convenient to use" (dường như tiện lợi để sử dụng).',
      translation: 'Ứng dụng ngân hàng di động cập nhật dường như rất tiện lợi để sử dụng, theo phản hồi người dùng ban đầu.'
    },
    {
      id: 3,
      question: 'To stay _______ in the international telecommunications industry, our firm must continually upgrade its network infrastructure.',
      options: [
        { label: 'A', text: 'competitiveness' },
        { label: 'B', text: 'competitive' },
        { label: 'C', text: 'competitively' },
        { label: 'D', text: 'compete' }
      ],
      correctAnswer: 'B',
      explanation: 'Động từ "stay" là linking verb (giữ nguyên trạng thái), theo sau là Tính từ: "stay competitive" (giữ vững tính cạnh tranh).',
      translation: 'Để giữ vững tính cạnh tranh trong ngành viễn thông quốc tế, công ty chúng ta phải liên tục nâng cấp cơ sở hạ tầng mạng.'
    },
    {
      id: 4,
      question: 'The newly developed heating and cooling system is highly _______ and consumes thirty percent less electricity.',
      options: [
        { label: 'A', text: 'efficient' },
        { label: 'B', text: 'efficiency' },
        { label: 'C', text: 'efficiently' },
        { label: 'D', text: 'efficiencies' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc To-be + Adv + Adj: "is + highly (Adv) + efficient (Adj)". Trạng từ "highly" bổ nghĩa cho tính từ "efficient".',
      translation: 'Hệ thống sưởi ấm và làm mát mới phát triển rất hiệu quả và tiêu thụ ít hơn 30% điện năng.'
    },
    {
      id: 5,
      question: 'Senior supervisors were extremely _______ with the comprehensive training sessions organized by the HR department.',
      options: [
        { label: 'A', text: 'pleasing' },
        { label: 'B', text: 'pleased' },
        { label: 'C', text: 'pleasantly' },
        { label: 'D', text: 'pleasure' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "be pleased with something": hài lòng với cái gì. Chủ ngữ là người (Supervisors) chỉ cảm xúc hài lòng nên dùng tính từ bị động đuôi -ed "pleased".',
      translation: 'Các giám sát viên cấp cao đã cực kỳ hài lòng với các buổi đào tạo toàn diện do phòng nhân sự tổ chức.'
    }
  ],

  // 3. ADJECTIVE BEFORE NOUN: (a/an/the) + ADJ + NOUN
  'adj-before-noun': [
    {
      id: 1,
      question: 'The firm reported a _______ increase in online subscriptions following the launch of the promotional campaign.',
      options: [
        { label: 'A', text: 'substantial' },
        { label: 'B', text: 'substantially' },
        { label: 'C', text: 'substance' },
        { label: 'D', text: 'substantiate' }
      ],
      correctAnswer: 'A',
      explanation: 'Vị trí sau mạo từ "a" và đứng trước danh từ "increase" (sự gia tăng) bắt buộc là một TÍNH TỪ (Adjective) để bổ nghĩa cho danh từ: "a substantial increase" (một sự gia tăng đáng kể).',
      translation: 'Công ty đã báo cáo một sự gia tăng đáng kể trong lượng đăng ký trực tuyến sau khi triển khai chiến dịch quảng bá.'
    },
    {
      id: 2,
      question: 'Candidates who demonstrate _______ communication skills will be considered for the overseas client liaison role.',
      options: [
        { label: 'A', text: 'exception' },
        { label: 'B', text: 'exceptionally' },
        { label: 'C', text: 'exceptional' },
        { label: 'D', text: 'excepting' }
      ],
      correctAnswer: 'C',
      explanation: 'Đứng trước cụm danh từ "communication skills" (kỹ năng giao tiếp) cần một TÍNH TỪ bổ nghĩa: "exceptional communication skills" (kỹ năng giao tiếp xuất sắc/vượt trội).',
      translation: 'Những ứng viên thể hiện kỹ năng giao tiếp xuất sắc sẽ được xem xét cho vị trí liên lạc khách hàng ở nước ngoài.'
    },
    {
      id: 3,
      question: 'Dr. Evans delivered an _______ presentation on sustainable urban architecture at the world conference.',
      options: [
        { label: 'A', text: 'impressive' },
        { label: 'B', text: 'impressively' },
        { label: 'C', text: 'impression' },
        { label: 'D', text: 'impress' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc "an + Adj + Noun": đứng trước danh từ "presentation" cần tính từ "impressive" (đầy ấn tượng).',
      translation: 'Tiến sĩ Evans đã thuyết trình một bài thuyết trình đầy ấn tượng về kiến trúc đô thị bền vững tại hội nghị thế giới.'
    },
    {
      id: 4,
      question: 'All employees must review the _______ safety manual before operating any heavy warehouse machinery.',
      options: [
        { label: 'A', text: 'comprehensively' },
        { label: 'B', text: 'comprehend' },
        { label: 'C', text: 'comprehensiveness' },
        { label: 'D', text: 'comprehensive' }
      ],
      correctAnswer: 'D',
      explanation: 'Cụm "the + Adj + safety manual (Noun)": cần tính từ "comprehensive" (toàn diện/chi tiết) đứng trước danh từ.',
      translation: 'Tất cả nhân viên phải xem lại sổ tay an toàn toàn diện trước khi vận hành bất kỳ máy móc nhà kho hạng nặng nào.'
    },
    {
      id: 5,
      question: 'The accounting team introduced an _______ software program that automates weekly payroll processing.',
      options: [
        { label: 'A', text: 'innovatively' },
        { label: 'B', text: 'innovate' },
        { label: 'C', text: 'innovative' },
        { label: 'D', text: 'innovation' }
      ],
      correctAnswer: 'C',
      explanation: 'Đứng trước danh từ "software program" cần tính từ "innovative" (mang tính đổi mới/sáng tạo) để bổ nghĩa.',
      translation: 'Đội kế toán đã giới thiệu một phần mềm mang tính đổi mới giúp tự động hóa quy trình tính lương hàng tuần.'
    }
  ],

  // 4. AUX + ADV + MAIN VERB
  'aux-adv-mainverb': [
    {
      id: 1,
      question: 'The executive committee has _______ approved the proposed corporate merger after reviewing regulatory requirements.',
      options: [
        { label: 'A', text: 'final' },
        { label: 'B', text: 'finally' },
        { label: 'C', text: 'finality' },
        { label: 'D', text: 'finalize' }
      ],
      correctAnswer: 'B',
      explanation: 'Vị trí xen giữa trợ động từ "has" và động từ chính dạng V3/ed "approved" (has + ADV + V3) bắt buộc là TRẠNG TỪ (Adverb -ly): "finally" (cuối cùng). Đây là cấu trúc xuất hiện liên tục trong Part 5.',
      translation: 'Ủy ban điều hành cuối cùng đã phê duyệt đề xuất sáp nhập doanh nghiệp sau khi xem xét các yêu cầu pháp lý.'
    },
    {
      id: 2,
      question: 'The construction of the riverside commercial complex will _______ commence next Monday morning.',
      options: [
        { label: 'A', text: 'official' },
        { label: 'B', text: 'officially' },
        { label: 'C', text: 'officials' },
        { label: 'D', text: 'officiate' }
      ],
      correctAnswer: 'B',
      explanation: 'Vị trí xen giữa trợ động từ khuyết thiếu "will" và động từ nguyên mẫu "commence" (will + ADV + V_bare) cần TRẠNG TỪ: "officially" (chính thức).',
      translation: 'Việc xây dựng khu phức hợp thương mại ven sông sẽ chính thức bắt đầu vào sáng thứ Hai tới.'
    },
    {
      id: 3,
      question: 'Mr. Tanaka was _______ praised by the CEO for finishing the software migration three days ahead of schedule.',
      options: [
        { label: 'A', text: 'high' },
        { label: 'B', text: 'higher' },
        { label: 'C', text: 'highly' },
        { label: 'D', text: 'height' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc câu bị động to-be + ADV + V3: "was + highly (Adv) + praised (V3)" (đã được khen ngợi hết lời).',
      translation: 'Ông Tanaka đã được Giám đốc điều hành khen ngợi hết lời vì đã hoàn thành việc chuyển đổi phần mềm trước hạn 3 ngày.'
    },
    {
      id: 4,
      question: 'The newly hired graphic designer is _______ developing promotional materials for our seasonal product lineup.',
      options: [
        { label: 'A', text: 'current' },
        { label: 'B', text: 'currency' },
        { label: 'C', text: 'currently' },
        { label: 'D', text: 'currents' }
      ],
      correctAnswer: 'C',
      explanation: 'Vị trí xen giữa to-be "is" và V-ing "developing" (is + ADV + V-ing) cần trạng từ "currently" (hiện đang).',
      translation: 'Nhà thiết kế đồ họa mới được tuyển dụng hiện đang phát triển các tài liệu quảng bá cho dòng sản phẩm theo mùa của chúng ta.'
    },
    {
      id: 5,
      question: 'Passengers should _______ check their boarding passes for gate change announcements before proceeding to the terminal.',
      options: [
        { label: 'A', text: 'periodic' },
        { label: 'B', text: 'periodically' },
        { label: 'C', text: 'period' },
        { label: 'D', text: 'periodical' }
      ],
      correctAnswer: 'B',
      explanation: 'Vị trí giữa modal verb "should" và động từ nguyên mẫu "check" (Modal + ADV + V) cần TRẠNG TỪ: "periodically" (định kỳ, theo từng khoảng thời gian).',
      translation: 'Hành khách nên định kỳ kiểm tra thẻ lên máy bay để nắm thông báo đổi cổng trước khi di chuyển vào nhà ga.'
    }
  ],

  // 5. SPECIAL VERBS: MAKE / FIND / KEEP / CONSIDER + OBJECT + ADJECTIVE
  'special-verb-object-adj': [
    {
      id: 1,
      question: 'The cloud-based management platform makes document sharing significantly more _______ across multiple regional offices.',
      options: [
        { label: 'A', text: 'convenience' },
        { label: 'B', text: 'conveniently' },
        { label: 'C', text: 'convenient' },
        { label: 'D', text: 'convening' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc đặc biệt: MAKE + Object ("document sharing") + ADJECTIVE ("convenient"). Bẫy thường gặp là chọn trạng từ đuôi -ly do bị đánh lừa bởi phó từ so sánh "more". Bắt buộc dùng Tính từ!',
      translation: 'Nền tảng quản lý trên đám mây giúp việc chia sẻ tài liệu trở nên thuận tiện hơn đáng kể giữa nhiều văn phòng khu vực.'
    },
    {
      id: 2,
      question: 'All employees are strictly required to keep company server passwords _______ at all times.',
      options: [
        { label: 'A', text: 'confidential' },
        { label: 'B', text: 'confidentially' },
        { label: 'C', text: 'confidentiality' },
        { label: 'D', text: 'confidence' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc KEEP + Object ("passwords") + ADJECTIVE ("confidential"): giữ cho cái gì luôn ở trạng thái như thế nào. Chọn tính từ "confidential" (bảo mật).',
      translation: 'Tất cả nhân viên được yêu cầu nghiêm ngặt phải giữ mật khẩu máy chủ công ty luôn bảo mật mọi lúc.'
    },
    {
      id: 3,
      question: 'Most survey participants found the redesigned online checkout procedure extremely _______ to navigate.',
      options: [
        { label: 'A', text: 'easy' },
        { label: 'B', text: 'easily' },
        { label: 'C', text: 'ease' },
        { label: 'D', text: 'easiness' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc FIND + Object ("the checkout procedure") + ADJECTIVE ("easy"): nhận thấy cái gì như thế nào. Trạng từ "extremely" chỉ bổ nghĩa mức độ cho tính từ "easy".',
      translation: 'Đa số người tham gia khảo sát nhận thấy quy trình thanh toán trực tuyến mới được thiết kế lại cực kỳ dễ thao tác.'
    },
    {
      id: 4,
      question: 'The human resources committee considers Ms. Vance fully _______ for the international sales manager position.',
      options: [
        { label: 'A', text: 'qualification' },
        { label: 'B', text: 'qualified' },
        { label: 'C', text: 'qualify' },
        { label: 'D', text: 'qualifyingly' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc CONSIDER + Object ("Ms. Vance") + ADJECTIVE ("qualified"): coi/đánh giá ai đó có đủ phẩm chất/đạt yêu cầu.',
      translation: 'Hội đồng nhân sự đánh giá cô Vance hoàn toàn đủ năng lực cho vị trí quản lý bán hàng quốc tế.'
    },
    {
      id: 5,
      question: 'Installing double-paned windows will keep the interior conference rooms _______ during heavy street traffic.',
      options: [
        { label: 'A', text: 'quiet' },
        { label: 'B', text: 'quietly' },
        { label: 'C', text: 'quietness' },
        { label: 'D', text: 'quietude' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc KEEP + Object ("the interior conference rooms") + ADJECTIVE ("quiet"): giữ cho các phòng họp bên trong yên tĩnh.',
      translation: 'Việc lắp đặt cửa sổ kính hai lớp sẽ giữ cho các phòng họp bên trong yên tĩnh khi giao thông trên đường đông đúc.'
    }
  ],

  // 6. COMPOUND NOUNS: NOUN + NOUN
  'compound-nouns': [
    {
      id: 1,
      question: 'Factory supervisors must inspect all production equipment regularly to guarantee compliance with workplace _______ standards.',
      options: [
        { label: 'A', text: 'safe' },
        { label: 'B', text: 'safely' },
        { label: 'C', text: 'safety' },
        { label: 'D', text: 'safeness' }
      ],
      correctAnswer: 'C',
      explanation: 'Cụm danh từ ghép (Compound Noun) quen thuộc trong TOEIC: "safety standards" (tiêu chuẩn an toàn). "Safety" là danh từ đứng trước đóng vai trò bổ nghĩa cho danh từ "standards".',
      translation: 'Các giám sát viên nhà máy phải kiểm tra định kỳ tất cả thiết bị sản xuất để đảm bảo tuân thủ các tiêu chuẩn an toàn nơi làm việc.'
    },
    {
      id: 2,
      question: 'Recent market research revealed that overall customer _______ has climbed ten percent this fiscal quarter.',
      options: [
        { label: 'A', text: 'satisfied' },
        { label: 'B', text: 'satisfying' },
        { label: 'C', text: 'satisfaction' },
        { label: 'D', text: 'satisfactorily' }
      ],
      correctAnswer: 'C',
      explanation: 'Cụm danh từ ghép nổi tiếng trong TOEIC: "customer satisfaction" (sự hài lòng của khách hàng). Chỗ trống cần danh từ "satisfaction" làm danh từ chính của chủ ngữ.',
      translation: 'Nghiên cứu thị trường gần đây tiết lộ rằng sự hài lòng chung của khách hàng đã tăng mười phần trăm trong quý tài chính này.'
    },
    {
      id: 3,
      question: 'Please submit your detailed _______ report to the finance department by noon on Friday.',
      options: [
        { label: 'A', text: 'expense' },
        { label: 'B', text: 'expensive' },
        { label: 'C', text: 'expensively' },
        { label: 'D', text: 'expending' }
      ],
      correctAnswer: 'A',
      explanation: 'Cụm danh từ ghép: "expense report" (báo cáo chi phí/công tác phí). "Expense" (danh từ) kết hợp với "report" tạo thành danh từ ghép mang nghĩa chuyên ngành.',
      translation: 'Vui lòng nộp báo cáo chi phí chi tiết của bạn cho phòng tài chính trước buổi trưa thứ Sáu.'
    },
    {
      id: 4,
      question: 'The facility technician scheduled routine _______ for the ventilation system next Tuesday.',
      options: [
        { label: 'A', text: 'maintain' },
        { label: 'B', text: 'maintenance' },
        { label: 'C', text: 'maintainable' },
        { label: 'D', text: 'maintaining' }
      ],
      correctAnswer: 'B',
      explanation: 'Sau tính từ "routine" cần một danh từ: "routine maintenance" (bảo trì định kỳ). Trong trường hợp khác "maintenance crew/schedule" cũng là danh từ ghép.',
      translation: 'Kỹ thuật viên cơ sở vật chất đã lên lịch bảo trì định kỳ cho hệ thống thông gió vào thứ Ba tới.'
    },
    {
      id: 5,
      question: 'Before entering the cleanroom laboratory, all visitors must receive official security _______.',
      options: [
        { label: 'A', text: 'clear' },
        { label: 'B', text: 'clearly' },
        { label: 'C', text: 'clearance' },
        { label: 'D', text: 'clearing' }
      ],
      correctAnswer: 'C',
      explanation: 'Cụm danh từ ghép: "security clearance" (sự cấp phép an ninh/thông hành an ninh). Chỗ trống cần danh từ "clearance".',
      translation: 'Trước khi bước vào phòng thí nghiệm phòng sạch, tất cả khách tham quan phải nhận được sự cấp phép an ninh chính thức.'
    }
  ]
};
