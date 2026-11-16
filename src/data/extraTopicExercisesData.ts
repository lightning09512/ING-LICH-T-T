import { GrammarExercise } from './grammarData';

export const extraTopicExercisesMap: { [topicId: string]: GrammarExercise[] } = {
  // 1. TENSES (Q6 - Q10)
  'tenses': [
    {
      id: 6,
      question: 'The software developers _______ on the system update for six hours straight and need to take a break.',
      options: [
        { label: 'A', text: 'have been working' },
        { label: 'B', text: 'will work' },
        { label: 'C', text: 'were worked' },
        { label: 'D', text: 'had worked' }
      ],
      correctAnswer: 'A',
      explanation: 'Dấu hiệu "for six hours straight" (suốt 6 tiếng liên tục) và kết quả ở hiện tại "need to take a break" nhấn mạnh tính liên tục kéo dài từ quá khứ đến hiện tại -> Dùng thì Hiện tại hoàn thành tiếp diễn (have been working).',
      translation: 'Các nhà phát triển phần mềm đã làm việc liên tục trên bản cập nhật hệ thống suốt 6 tiếng đồng hồ và cần nghỉ giải lao.'
    },
    {
      id: 7,
      question: 'While Ms. Gomez _______ the budget proposal, the electrical power in the entire office building went out.',
      options: [
        { label: 'A', text: 'reviews' },
        { label: 'B', text: 'was reviewing' },
        { label: 'C', text: 'has reviewed' },
        { label: 'D', text: 'will review' }
      ],
      correctAnswer: 'B',
      explanation: 'Hành động đang diễn ra trong quá khứ ("was reviewing") thì một hành động khác xen vào ("the electrical power went out" chia quá khứ đơn). Cấu trúc: While + S + was/were V-ing, S + V2/ed.',
      translation: 'Trong khi cô Gomez đang xem xét đề xuất ngân sách thì toàn bộ tòa nhà văn phòng bị mất điện.'
    },
    {
      id: 8,
      question: 'By the time the new CEO takes office in July, the company _______ the restructuring process.',
      options: [
        { label: 'A', text: 'completed' },
        { label: 'B', text: 'will have completed' },
        { label: 'C', text: 'completes' },
        { label: 'D', text: 'has completed' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc kinh điển TOEIC: "By the time + S + V(hiện tại đơn), S + will have V3/ed (Tương lai hoàn thành)" để diễn tả hành động sẽ hoàn tất trước một thời điểm hoặc hành động khác trong tương lai.',
      translation: 'Trước thời điểm vị Giám đốc điều hành mới nhậm chức vào tháng 7, công ty sẽ hoàn tất quy trình tái cấu trúc.'
    },
    {
      id: 9,
      question: 'The firm has increased its international exports significantly since it _______ the new factory in Vietnam.',
      options: [
        { label: 'A', text: 'opened' },
        { label: 'B', text: 'opens' },
        { label: 'C', text: 'has opened' },
        { label: 'D', text: 'will open' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc với SINCE: S + have/has V3/ed (Hiện tại hoàn thành) + SINCE + S + V2/ed (Quá khứ đơn). Mệnh đề sau "since" đóng vai trò mốc thời gian quá khứ.',
      translation: 'Công ty đã tăng đáng kể kim ngạch xuất khẩu quốc tế kể từ khi mở nhà máy mới tại Việt Nam.'
    },
    {
      id: 10,
      question: 'The technician will not leave the facility until the software patch _______ properly installed.',
      options: [
        { label: 'A', text: 'will be' },
        { label: 'B', text: 'is' },
        { label: 'C', text: 'was' },
        { label: 'D', text: 'has been being' }
      ],
      correctAnswer: 'B',
      explanation: 'Quy tắc mệnh đề thời gian với UNTIL: Mệnh đề chính chia Tương lai ("will not leave"), mệnh đề thời gian sau "until" tuyệt đối không dùng "will", phải chia ở Hiện tại đơn ("is").',
      translation: 'Kỹ thuật viên sẽ không rời khỏi cơ sở cho đến khi bản vá phần mềm được cài đặt đúng cách.'
    }
  ],

  // 2. WORD FORMS (Q6 - Q10)
  'word-forms': [
    {
      id: 6,
      question: 'The quarterly financial report was _______ accurate, requiring zero revisions from the auditing firm.',
      options: [
        { label: 'A', text: 'remarkable' },
        { label: 'B', text: 'remarkably' },
        { label: 'C', text: 'remark' },
        { label: 'D', text: 'remarkableness' }
      ],
      correctAnswer: 'B',
      explanation: 'Vị trí giữa to-be "was" và tính từ "accurate" cần một TRẠNG TỪ (Adverb -ly) để bổ nghĩa cho tính từ: "was remarkably accurate" (chính xác một cách đáng kinh ngạc).',
      translation: 'Báo cáo tài chính hàng quý chính xác một cách đáng kinh ngạc, không cần bất kỳ chỉnh sửa nào từ công ty kiểm toán.'
    },
    {
      id: 7,
      question: 'The courier service handled the fragile laboratory instruments _______ to prevent any breakage during transit.',
      options: [
        { label: 'A', text: 'careful' },
        { label: 'B', text: 'carefulness' },
        { label: 'C', text: 'carefully' },
        { label: 'D', text: 'caring' }
      ],
      correctAnswer: 'C',
      explanation: 'Câu đã có đầy đủ thành phần: S (The courier service) + V (handled) + O (the instruments). Đứng cuối cụm để bổ nghĩa cho động từ thường "handled" bắt buộc là TRẠNG TỪ: "carefully" (một cách cẩn thận).',
      translation: 'Dịch vụ chuyển phát nhanh đã xử lý các dụng cụ phòng thí nghiệm dễ vỡ một cách cẩn thận để tránh hư hại trong quá trình vận chuyển.'
    },
    {
      id: 8,
      question: 'The advisory board approved the corporate sustainability initiative with great _______.',
      options: [
        { label: 'A', text: 'enthusiastic' },
        { label: 'B', text: 'enthusiastically' },
        { label: 'C', text: 'enthusiasm' },
        { label: 'D', text: 'enthuse' }
      ],
      correctAnswer: 'C',
      explanation: 'Sau giới từ "with" và tính từ "great" bắt buộc là một DANH TỪ: "great enthusiasm" (sự nhiệt tình to lớn).',
      translation: 'Ban cố vấn đã thông qua sáng kiến phát triển bền vững của doanh nghiệp với sự nhiệt tình to lớn.'
    },
    {
      id: 9,
      question: 'Employees who exceed their monthly sales _______ will receive an additional cash bonus.',
      options: [
        { label: 'A', text: 'targets' },
        { label: 'B', text: 'targeted' },
        { label: 'C', text: 'targetable' },
        { label: 'D', text: 'targeting' }
      ],
      correctAnswer: 'A',
      explanation: 'Sau tính từ sở hữu "their" và tính từ "monthly sales" cần một DANH TỪ làm tân ngữ cho động từ "exceed": "sales targets" (các chỉ tiêu doanh số).',
      translation: 'Những nhân viên vượt chỉ tiêu doanh số hàng tháng của họ sẽ nhận được khoản tiền thưởng thêm.'
    },
    {
      id: 10,
      question: 'After extensive market research, the executive team felt _______ that the new beverage line would succeed.',
      options: [
        { label: 'A', text: 'confident' },
        { label: 'B', text: 'confidently' },
        { label: 'C', text: 'confidence' },
        { label: 'D', text: 'confidential' }
      ],
      correctAnswer: 'A',
      explanation: 'Động từ "feel/felt" là một LINKING VERB (động từ nối chỉ cảm giác), theo sau bắt buộc là TÍNH TỪ: "felt confident" (cảm thấy tự tin).',
      translation: 'Sau khi nghiên cứu thị trường sâu rộng, ban điều hành cảm thấy tự tin rằng dòng đồ uống mới sẽ thành công.'
    }
  ],

  // 3. GERUNDS & INFINITIVES (Q6 - Q10)
  'gerunds-infinitives': [
    {
      id: 6,
      question: 'Due to severe weather forecasts, the organizing committee decided _______ the outdoor charity race until next weekend.',
      options: [
        { label: 'A', text: 'postpone' },
        { label: 'B', text: 'to postpone' },
        { label: 'C', text: 'postponing' },
        { label: 'D', text: 'postponed' }
      ],
      correctAnswer: 'B',
      explanation: 'Động từ "decide" luôn đi với động từ nguyên mẫu có to: "decide to do something" (quyết định làm gì).',
      translation: 'Do dự báo thời tiết khắc nghiệt, ban tổ chức đã quyết định hoãn cuộc đua từ thiện ngoài trời đến cuối tuần tới.'
    },
    {
      id: 7,
      question: 'The management consultant suggested _______ an independent auditing firm to inspect internal expenditures.',
      options: [
        { label: 'A', text: 'hire' },
        { label: 'B', text: 'hiring' },
        { label: 'C', text: 'to hire' },
        { label: 'D', text: 'hired' }
      ],
      correctAnswer: 'B',
      explanation: 'Động từ "suggest" khi đi trực tiếp với một động từ khác bắt buộc dùng V-ing: "suggest doing something" (gợi ý làm gì).',
      translation: 'Chuyên gia tư vấn quản lý đã gợi ý thuê một công ty kiểm toán độc lập để kiểm tra các khoản chi tiêu nội bộ.'
    },
    {
      id: 8,
      question: 'Before _______ the legal partnership contract, Mr. Alvarez consulted his senior intellectual property attorney.',
      options: [
        { label: 'A', text: 'signed' },
        { label: 'B', text: 'sign' },
        { label: 'C', text: 'signing' },
        { label: 'D', text: 'to sign' }
      ],
      correctAnswer: 'C',
      explanation: 'Sau giới từ "Before" đóng vai trò liên từ rút gọn chủ ngữ, động từ phải ở dạng DANH ĐỘNG TỪ (V-ing): "Before signing the contract...".',
      translation: 'Trước khi ký hợp đồng hợp tác pháp lý, ông Alvarez đã tham khảo ý kiến luật sư sở hữu trí tuệ cấp cao của mình.'
    },
    {
      id: 9,
      question: 'Apex Logistics is deeply committed to _______ delivery times while preserving strict safety protocols.',
      options: [
        { label: 'A', text: 'shorten' },
        { label: 'B', text: 'shortening' },
        { label: 'C', text: 'shortened' },
        { label: 'D', text: 'short' }
      ],
      correctAnswer: 'B',
      explanation: 'Cụm từ "be committed to + V-ing/Noun" (cam kết làm gì). Chữ "to" ở đây là GIỚI TỪ, không phải to-infinitive nên bắt buộc đi với V-ing: "shortening".',
      translation: 'Apex Logistics cam kết sâu sắc trong việc rút ngắn thời gian giao hàng trong khi vẫn duy trì các quy chuẩn an toàn nghiêm ngặt.'
    },
    {
      id: 10,
      question: 'It is essential for all lab personnel _______ protective eyewear at all times inside the testing area.',
      options: [
        { label: 'A', text: 'wear' },
        { label: 'B', text: 'wearing' },
        { label: 'C', text: 'to wear' },
        { label: 'D', text: 'wore' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc chủ ngữ giả định: "It is + Adj + for somebody + TO DO something" -> "It is essential for all lab personnel to wear...".',
      translation: 'Việc tất cả nhân viên phòng thí nghiệm đeo kính bảo hộ mọi lúc bên trong khu vực thử nghiệm là điều thiết yếu.'
    }
  ],

  // 4. PASSIVE VOICE (Q6 - Q10)
  'passive-voice': [
    {
      id: 6,
      question: 'All chemical waste containers must _______ by licensed waste disposal professionals before being transferred.',
      options: [
        { label: 'A', text: 'inspect' },
        { label: 'B', text: 'be inspected' },
        { label: 'C', text: 'have inspected' },
        { label: 'D', text: 'inspecting' }
      ],
      correctAnswer: 'B',
      explanation: 'Chủ ngữ "containers" (thùng chứa) là vật, phải được kiểm tra (bị động) sau động từ khiếm khuyết "must": "must be inspected". Cấu trúc: Modal + be + V3/ed.',
      translation: 'Tất cả các thùng chứa chất thải hóa học phải được kiểm tra bởi các chuyên gia xử lý rác thải có giấy phép trước khi được vận chuyển.'
    },
    {
      id: 7,
      question: 'The missing transaction records have finally _______ in an archived filing cabinet on the third floor.',
      options: [
        { label: 'A', text: 'been found' },
        { label: 'B', text: 'found' },
        { label: 'C', text: 'finding' },
        { label: 'D', text: 'been finding' }
      ],
      correctAnswer: 'A',
      explanation: 'Chủ ngữ "records" (hồ sơ giao dịch) chịu tác động "được tìm thấy", chia thì Hiện tại hoàn thành dạng bị động: "have + been + V3/ed" -> "have been found".',
      translation: 'Hồ sơ giao dịch bị thất lạc cuối cùng đã được tìm thấy trong một tủ hồ sơ lưu trữ trên tầng ba.'
    },
    {
      id: 8,
      question: 'Only expense receipts _______ by the department manager will be accepted by accounting for reimbursement.',
      options: [
        { label: 'A', text: 'approve' },
        { label: 'B', text: 'approving' },
        { label: 'C', text: 'approved' },
        { label: 'D', text: 'are approved' }
      ],
      correctAnswer: 'C',
      explanation: 'Rút gọn mệnh đề quan hệ dạng bị động: "receipts (which were) approved by...". Khi rút gọn chỉ giữ lại quá khứ phân từ V3/ed "approved".',
      translation: 'Chỉ những hóa đơn chi phí được trưởng phòng phê duyệt mới được kế toán chấp nhận hoàn tiền.'
    },
    {
      id: 9,
      question: 'Passengers _______ flights departing from Gate 22 should proceed immediately to the boarding area.',
      options: [
        { label: 'A', text: 'board' },
        { label: 'B', text: 'boarding' },
        { label: 'C', text: 'boarded' },
        { label: 'D', text: 'are boarded' }
      ],
      correctAnswer: 'B',
      explanation: 'Rút gọn mệnh đề quan hệ dạng chủ động: "Passengers (who are) boarding flights...". Động từ rút gọn về dạng V-ing "boarding".',
      translation: 'Hành khách lên các chuyến bay khởi hành từ Cổng 22 nên di chuyển ngay đến khu vực lên máy bay.'
    },
    {
      id: 10,
      question: 'All laboratory visitors are required _______ protective coats and identification badges at the security desk.',
      options: [
        { label: 'A', text: 'wear' },
        { label: 'B', text: 'wearing' },
        { label: 'C', text: 'to wear' },
        { label: 'D', text: 'wore' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc bị động: "be required + to-V": được yêu cầu làm gì. "are required to wear" (được yêu cầu phải mặc).',
      translation: 'Tất cả khách tham quan phòng thí nghiệm được yêu cầu phải mặc áo bảo hộ và đeo thẻ nhận dạng tại quầy an ninh.'
    }
  ],

  // 5. RELATIVE CLAUSES (Q6 - Q10)
  'relative-clauses': [
    {
      id: 6,
      question: 'We hired a financial consultant _______ recommendations helped us reduce overhead expenses by fifteen percent.',
      options: [
        { label: 'A', text: 'who' },
        { label: 'B', text: 'whose' },
        { label: 'C', text: 'which' },
        { label: 'D', text: 'whom' }
      ],
      correctAnswer: 'B',
      explanation: 'Đại từ quan hệ chỉ sở hữu "whose": đứng giữa danh từ chỉ người ("consultant") và danh từ thuộc sở hữu của người đó ("recommendations") -> "whose recommendations" (những kiến nghị của ông ấy).',
      translation: 'Chúng tôi đã thuê một chuyên gia tư vấn tài chính mà những kiến nghị của ông ấy đã giúp chúng tôi giảm mười lăm phần trăm chi phí vận hành.'
    },
    {
      id: 7,
      question: 'The executive with _______ you met yesterday morning will deliver the keynote address at tomorrow’s symposium.',
      options: [
        { label: 'A', text: 'who' },
        { label: 'B', text: 'whom' },
        { label: 'C', text: 'which' },
        { label: 'D', text: 'whose' }
      ],
      correctAnswer: 'B',
      explanation: 'Đứng sau giới từ ("with") chỉ người ("The executive"), bắt buộc dùng đại từ quan hệ "whom". Không bao giờ dùng "who" hay "that" ngay sau giới từ.',
      translation: 'Vị giám đốc điều hành mà bạn đã gặp vào sáng hôm qua sẽ đọc bài diễn văn khai mạc tại hội nghị chuyên đề ngày mai.'
    },
    {
      id: 8,
      question: 'The shipping port was temporarily closed due to severe weather, _______ caused major delivery delays across the region.',
      options: [
        { label: 'A', text: 'that' },
        { label: 'B', text: 'which' },
        { label: 'C', text: 'what' },
        { label: 'D', text: 'who' }
      ],
      correctAnswer: 'B',
      explanation: 'Đại từ quan hệ "which" đứng sau dấu phẩy có thể thay thế cho TOÀN BỘ MỆNH ĐỀ ĐỨNG TRƯỚC ("The shipping port was closed..."). Tuyệt đối không dùng "that" sau dấu phẩy.',
      translation: 'Cảng vận chuyển đã tạm thời đóng cửa do thời tiết xấu, điều này đã gây ra sự chậm trễ giao hàng lớn trên toàn khu vực.'
    },
    {
      id: 9,
      question: '_______ submits their reimbursement claims before the deadline will receive payment in the next billing cycle.',
      options: [
        { label: 'A', text: 'Whoever' },
        { label: 'B', text: 'Whomever' },
        { label: 'C', text: 'Anyone' },
        { label: 'D', text: 'Those' }
      ],
      correctAnswer: 'A',
      explanation: '"Whoever" = "Anyone who" (bất kỳ ai mà), đóng vai trò chủ ngữ cho động từ số ít "submits". "Anyone" nếu đứng một mình phải có "who" theo sau.',
      translation: 'Bất kỳ ai nộp yêu cầu hoàn tiền trước hạn chót sẽ nhận được thanh toán trong chu kỳ thanh toán tiếp theo.'
    },
    {
      id: 10,
      question: 'This modern auditorium is the venue _______ the annual shareholders meeting will take place next month.',
      options: [
        { label: 'A', text: 'where' },
        { label: 'B', text: 'which' },
        { label: 'C', text: 'whose' },
        { label: 'D', text: 'what' }
      ],
      correctAnswer: 'A',
      explanation: 'Trạng từ quan hệ "where" thay thế cho danh từ chỉ địa điểm "the venue" và mệnh đề phía sau là một câu hoàn chỉnh ("meeting will take place").',
      translation: 'Khán phòng hiện đại này là địa điểm nơi mà cuộc họp cổ đông thường niên sẽ diễn ra vào tháng tới.'
    }
  ],

  // 6. CONJUNCTIONS & PREPOSITIONS (Q6 - Q10)
  'conjunctions-prepositions': [
    {
      id: 6,
      question: '_______ possessing limited experience in telecommunications, Ms. Vance demonstrated exceptional sales skills.',
      options: [
        { label: 'A', text: 'Although' },
        { label: 'B', text: 'Despite' },
        { label: 'C', text: 'Even though' },
        { label: 'D', text: 'Because' }
      ],
      correctAnswer: 'B',
      explanation: 'Theo sau chỗ trống là một CỤM DANH ĐỘNG TỪ ("possessing limited experience..."), không phải mệnh đề (S+V) -> Dùng giới từ chỉ sự nhượng bộ "Despite" (hoặc In spite of). "Although" và "Even though" bắt buộc theo sau là mệnh đề.',
      translation: 'Mặc dù có kinh nghiệm hạn chế trong ngành viễn thông, cô Vance đã thể hiện kỹ năng bán hàng vượt trội.'
    },
    {
      id: 7,
      question: 'The outdoor press conference was postponed _______ severe thunderstorm warnings issued by the national weather service.',
      options: [
        { label: 'A', text: 'because' },
        { label: 'B', text: 'because of' },
        { label: 'C', text: 'since' },
        { label: 'D', text: 'as' }
      ],
      correctAnswer: 'B',
      explanation: 'Theo sau là cụm danh từ "severe thunderstorm warnings...", không có động từ chính chia thì -> Dùng giới từ chỉ nguyên nhân "because of" (hoặc due to). "Because/since/as" phải đi với mệnh đề S+V.',
      translation: 'Buổi họp báo ngoài trời đã bị hoãn lại do những cảnh báo dông bão nghiêm trọng được đưa ra bởi cục thời tiết quốc gia.'
    },
    {
      id: 8,
      question: 'The upgraded inventory platform is not only exceptionally fast _______ remarkably easy for new staff to navigate.',
      options: [
        { label: 'A', text: 'and also' },
        { label: 'B', text: 'but also' },
        { label: 'C', text: 'as well' },
        { label: 'D', text: 'neither' }
      ],
      correctAnswer: 'B',
      explanation: 'Liên từ tương quan (Correlative Conjunction) kinh điển: "not only... but also..." (không những... mà còn...).',
      translation: 'Nền tảng kiểm kê nâng cấp không chỉ đặc biệt nhanh mà còn cực kỳ dễ thao tác đối với nhân viên mới.'
    },
    {
      id: 9,
      question: 'Employees are permitted to work remotely on Fridays _______ that all project milestones have been satisfied.',
      options: [
        { label: 'A', text: 'provided' },
        { label: 'B', text: 'unless' },
        { label: 'C', text: 'in case of' },
        { label: 'D', text: 'even if' }
      ],
      correctAnswer: 'A',
      explanation: 'Cụm liên từ điều kiện "provided that" (hoặc providing that, as long as) mang nghĩa "với điều kiện là / miễn là".',
      translation: 'Nhân viên được phép làm việc từ xa vào các ngày thứ Sáu với điều kiện là tất cả các mốc tiến độ dự án đã được đáp ứng.'
    },
    {
      id: 10,
      question: 'Cell phones and electronic devices must remain completely switched off _______ the duration of the examination.',
      options: [
        { label: 'A', text: 'while' },
        { label: 'B', text: 'during' },
        { label: 'C', text: 'throughout of' },
        { label: 'D', text: 'whereas' }
      ],
      correctAnswer: 'B',
      explanation: '"During" là giới từ đi kèm với cụm danh từ chỉ khoảng thời gian ("the duration of..."). "While" và "whereas" là liên từ đi kèm mệnh đề S+V.',
      translation: 'Điện thoại di động và các thiết bị điện tử phải được tắt hoàn toàn trong suốt khoảng thời gian của kỳ thi.'
    }
  ],

  // 7. CONDITIONALS & INVERSION (Q6 - Q10)
  'conditionals-inversion': [
    {
      id: 6,
      question: '_______ you experience any technical difficulties with the digital projector, please notify the technician immediately.',
      options: [
        { label: 'A', text: 'Should' },
        { label: 'B', text: 'Were' },
        { label: 'C', text: 'Had' },
        { label: 'D', text: 'Unless' }
      ],
      correctAnswer: 'A',
      explanation: 'Đảo ngữ câu điều kiện loại 1: "Should + S + V_bare" (tương đương If you experience...). Đây là cấu trúc xuất hiện cực kỳ nhiều trong văn phong trang trọng Part 5.',
      translation: 'Nếu bạn gặp phải bất kỳ sự cố kỹ thuật nào với máy chiếu kỹ thuật số, vui lòng thông báo ngay cho kỹ thuật viên.'
    },
    {
      id: 7,
      question: '_______ the corporation to acquire the European distribution center, additional capital would be required.',
      options: [
        { label: 'A', text: 'Should' },
        { label: 'B', text: 'Were' },
        { label: 'C', text: 'Had' },
        { label: 'D', text: 'Could' }
      ],
      correctAnswer: 'B',
      explanation: 'Đảo ngữ câu điều kiện loại 2: "Were + S + to-V, S + would + V_bare" (tương đương If the corporation were to acquire...).',
      translation: 'Nếu tập đoàn mua lại trung tâm phân phối ở Châu Âu, nguồn vốn bổ sung sẽ được yêu cầu.'
    },
    {
      id: 8,
      question: '_______ the supply chain team anticipated the shipping delays, we would have stockpiled extra components.',
      options: [
        { label: 'A', text: 'Had' },
        { label: 'B', text: 'Should' },
        { label: 'C', text: 'Were' },
        { label: 'D', text: 'If' }
      ],
      correctAnswer: 'A',
      explanation: 'Đảo ngữ câu điều kiện loại 3: "Had + S + V3/ed, S + would have V3/ed" (tương đương If the supply chain team had anticipated...).',
      translation: 'Giá như đội ngũ chuỗi cung ứng dự đoán trước được sự chậm trễ vận chuyển, chúng tôi đã tích trữ thêm linh kiện.'
    },
    {
      id: 9,
      question: 'Seldom _______ such an enthusiastic response from consumers to a newly introduced cosmetics lineup.',
      options: [
        { label: 'A', text: 'the market has seen' },
        { label: 'B', text: 'has the market seen' },
        { label: 'C', text: 'the market saw' },
        { label: 'D', text: 'seen has the market' }
      ],
      correctAnswer: 'B',
      explanation: 'Đảo ngữ với trạng từ phủ định/bán phủ định đứng đầu câu (Seldom/Rarely/Never): "Seldom + Trợ động từ + S + V" -> "Seldom has the market seen".',
      translation: 'Hiếm khi thị trường lại chứng kiến sự phản hồi nhiệt tình như vậy từ người tiêu dùng đối với một dòng mỹ phẩm mới ra mắt.'
    },
    {
      id: 10,
      question: 'Only after the comprehensive environmental audit was concluded _______ the local council approve the building permit.',
      options: [
        { label: 'A', text: 'did' },
        { label: 'B', text: 'does' },
        { label: 'C', text: 'has' },
        { label: 'D', text: 'was' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc đảo ngữ với "Only after + clause": Mệnh đề chính phải đảo trợ động từ lên trước chủ ngữ. Do hành động trong quá khứ ("was concluded"), dùng trợ động từ "did": "did the local council approve".',
      translation: 'Chỉ sau khi cuộc kiểm toán môi trường toàn diện được kết luận, hội đồng địa phương mới phê duyệt giấy phép xây dựng.'
    }
  ],

  // 8. SUBJECT-VERB AGREEMENT (Q6 - Q10)
  'subject-verb-agreement': [
    {
      id: 6,
      question: 'Neither the regional marketing manager nor the graphic designers _______ pleased with the draft layout.',
      options: [
        { label: 'A', text: 'was' },
        { label: 'B', text: 'were' },
        { label: 'C', text: 'is' },
        { label: 'D', text: 'has been' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "Neither S1 nor S2 + V": động từ chia hòa hợp theo CHỦ NGỮ GẦN NÓ NHẤT (S2). Ở đây S2 là "the graphic designers" (danh từ số nhiều), nên động từ chia số nhiều trong quá khứ là "were".',
      translation: 'Cả quản lý tiếp thị khu vực lẫn các nhà thiết kế đồ họa đều không hài lòng với bố cục bản thảo.'
    },
    {
      id: 7,
      question: 'The number of domestic flights departing from the secondary runway _______ increased by twelve percent this summer.',
      options: [
        { label: 'A', text: 'have' },
        { label: 'B', text: 'has' },
        { label: 'C', text: 'are' },
        { label: 'D', text: 'were' }
      ],
      correctAnswer: 'B',
      explanation: 'Quy tắc vàng TOEIC: "The number of + N(số nhiều) + ĐỘNG TỪ SỐ ÍT" (chỉ số lượng). Ngược lại "A number of + N(số nhiều) + ĐỘNG TỪ SỐ NHIỀU" (mang nghĩa nhiều). Ở đây có "The number of" nên chia số ít "has".',
      translation: 'Số lượng chuyến bay nội địa khởi hành từ đường băng phụ đã tăng mười hai phần trăm vào mùa hè này.'
    },
    {
      id: 8,
      question: 'The senior vice president, along with several regional directors, _______ scheduled to attend the annual conference in Tokyo.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'are' },
        { label: 'C', text: 'were' },
        { label: 'D', text: 'have been' }
      ],
      correctAnswer: 'A',
      explanation: 'Khi chủ ngữ được nối bởi các cụm "along with", "together with", "as well as", động từ luôn chia theo CHỦ NGỮ CHÍNH ĐỨNG TRƯỚC. Ở đây chủ ngữ chính là "The senior vice president" (số ít) nên chọn "is".',
      translation: 'Phó chủ tịch cấp cao, cùng với một số giám đốc khu vực, dự kiến sẽ tham dự hội nghị thường niên tại Tokyo.'
    },
    {
      id: 9,
      question: 'Each of the prospective job candidates _______ evaluated by a panel of three senior department supervisors.',
      options: [
        { label: 'A', text: 'are' },
        { label: 'B', text: 'is' },
        { label: 'C', text: 'were' },
        { label: 'D', text: 'have been' }
      ],
      correctAnswer: 'B',
      explanation: 'Các đại từ bất định như "Each of", "Every one of", "Neither of" luôn đi với ĐỘNG TỪ SỐ ÍT: "Each of + N(plural) + V(singular)" -> "is evaluated".',
      translation: 'Mỗi ứng viên tiềm năng đều được đánh giá bởi hội đồng gồm ba giám sát viên phòng ban cấp cao.'
    },
    {
      id: 10,
      question: 'Managing multiple cross-functional client accounts _______ exceptional organizational and interpersonal competence.',
      options: [
        { label: 'A', text: 'require' },
        { label: 'B', text: 'requires' },
        { label: 'C', text: 'requiring' },
        { label: 'D', text: 'have required' }
      ],
      correctAnswer: 'B',
      explanation: 'Khi DANH ĐỘNG TỪ (Gerund V-ing) đứng đầu câu làm chủ ngữ ("Managing... accounts"), động từ theo sau LUÔN CHIA Ở DẠNG SỐ ÍT: "requires".',
      translation: 'Việc quản lý nhiều tài khoản khách hàng liên chức năng đòi hỏi năng lực tổ chức và giao tiếp vượt trội.'
    }
  ],

  // 9. COMPARISONS (Q6 - Q10)
  'comparisons': [
    {
      id: 6,
      question: 'The _______ the software development team receives consumer feedback, the faster they can fix potential bugs.',
      options: [
        { label: 'A', text: 'early' },
        { label: 'B', text: 'earlier' },
        { label: 'C', text: 'earliest' },
        { label: 'D', text: 'more early' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc so sánh kép (The more... the more...): "The + so sánh hơn..., the + so sánh hơn...". Vế sau có "the faster", nên vế trước phải là "The earlier" (Đội ngũ nhận phản hồi càng sớm thì càng sửa lỗi nhanh hơn).',
      translation: 'Đội ngũ phát triển phần mềm nhận phản hồi của người tiêu dùng càng sớm thì họ càng có thể sửa các lỗi tiềm ẩn nhanh hơn.'
    },
    {
      id: 7,
      question: 'Operating expenditures for the fully automated assembly line are _______ lower than those of the older manual facility.',
      options: [
        { label: 'A', text: 'substantially' },
        { label: 'B', text: 'substantial' },
        { label: 'C', text: 'more substantial' },
        { label: 'D', text: 'substance' }
      ],
      correctAnswer: 'A',
      explanation: 'Để nhấn mạnh mức độ của tính từ so sánh hơn ("lower"), ta dùng các trạng từ: substantially, significantly, considerably, much, far -> "substantially lower" (thấp hơn đáng kể).',
      translation: 'Chi phí vận hành cho dây chuyền lắp ráp hoàn toàn tự động thấp hơn đáng kể so với cơ sở thủ công cũ hơn.'
    },
    {
      id: 8,
      question: 'This cloud backup solution is widely recognized as one of the _______ cybersecurity tools currently available.',
      options: [
        { label: 'A', text: 'more reliable' },
        { label: 'B', text: 'most reliable' },
        { label: 'C', text: 'reliably' },
        { label: 'D', text: 'reliability' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc so sánh nhất: "one of the + most + Adj + N(plural)": "one of the most reliable cybersecurity tools" (một trong những công cụ an ninh mạng đáng tin cậy nhất).',
      translation: 'Giải pháp sao lưu đám mây này được công nhận rộng rãi là một trong những công cụ an ninh mạng đáng tin cậy nhất hiện có.'
    },
    {
      id: 9,
      question: 'The warehouse crew worked as _______ as possible to unload the freight containers before the storm hit.',
      options: [
        { label: 'A', text: 'quick' },
        { label: 'B', text: 'quickly' },
        { label: 'C', text: 'quickness' },
        { label: 'D', text: 'quicker' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc so sánh bằng: "as + Adj/Adv + as possible". Động từ chính là động từ thường "worked", do đó cần TRẠNG TỪ "quickly" để bổ nghĩa cho hành động.',
      translation: 'Đội ngũ nhà kho đã làm việc nhanh nhất có thể để dỡ các thùng hàng trước khi cơn bão ập đến.'
    },
    {
      id: 10,
      question: 'A majority of modern professionals prefer flexible remote working arrangements _______ strict office hours.',
      options: [
        { label: 'A', text: 'than' },
        { label: 'B', text: 'to' },
        { label: 'C', text: 'from' },
        { label: 'D', text: 'over than' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc so sánh ưu tiên với PREFER: "prefer something TO something" (thích cái gì hơn cái gì). Bẫy TOEIC rất hay đưa "than" vào để lừa thí sinh.',
      translation: 'Phần lớn các chuyên gia hiện đại thích các hình thức làm việc từ xa linh hoạt hơn là giờ giấc văn phòng nghiêm ngặt.'
    }
  ],

  // 10. SUBJUNCTIVE MOOD (Q6 - Q10)
  'subjunctive-mood': [
    {
      id: 6,
      question: 'The senior auditor strongly recommended that the financial ledger _______ independently verified before the annual audit.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'be' },
        { label: 'C', text: 'was' },
        { label: 'D', text: 'to be' }
      ],
      correctAnswer: 'B',
      explanation: 'Thể giả định (Subjunctive Mood): "S + recommend that + S + (should) + V_bare". Ở dạng bị động là "(should) be + V3/ed" -> Chọn "be".',
      translation: 'Kiểm toán viên cấp cao khuyến nghị mạnh mẽ rằng sổ cái tài chính phải được xác minh độc lập trước cuộc kiểm toán thường niên.'
    },
    {
      id: 7,
      question: 'It is essential that every research laboratory employee _______ protective goggles and lab coats inside the facility.',
      options: [
        { label: 'A', text: 'wears' },
        { label: 'B', text: 'wear' },
        { label: 'C', text: 'wore' },
        { label: 'D', text: 'wearing' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc thể giả định với tính từ bắt buộc: "It is essential that + S + (should) + V_bare". Cho dù chủ ngữ "every employee" là số ít, động từ vẫn phải giữ nguyên thể không chia: "wear" (không thêm s).',
      translation: 'Việc mỗi nhân viên phòng thí nghiệm nghiên cứu đeo kính bảo hộ và mặc áo khoác phòng thí nghiệm bên trong cơ sở là rất cần thiết.'
    },
    {
      id: 8,
      question: 'The museum director requested that patrons not _______ flash photography inside the historical exhibition hall.',
      options: [
        { label: 'A', text: 'use' },
        { label: 'B', text: 'uses' },
        { label: 'C', text: 'using' },
        { label: 'D', text: 'used' }
      ],
      correctAnswer: 'A',
      explanation: 'Dạng phủ định của thể giả định: "request that + S + NOT + V_bare" (không mượn trợ động từ do/does/did). Do đó chọn "use".',
      translation: 'Giám đốc bảo tàng đã yêu cầu khách tham quan không sử dụng đèn flash chụp ảnh bên trong phòng triển lãm lịch sử.'
    },
    {
      id: 9,
      question: 'The safety inspector insisted that the faulty assembly machinery _______ shut down immediately for repairs.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'was' },
        { label: 'C', text: 'be' },
        { label: 'D', text: 'to be' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc giả định với "insist that + S + (should) + V_bare". Dạng bị động: "(should) be shut down" -> Chọn "be".',
      translation: 'Thanh tra an toàn khăng khăng yêu cầu máy móc lắp ráp bị lỗi phải được tắt ngay lập tức để sửa chữa.'
    },
    {
      id: 10,
      question: 'It is mandatory that each newly recruited staff member _______ the digital cybersecurity seminar by Friday.',
      options: [
        { label: 'A', text: 'complete' },
        { label: 'B', text: 'completes' },
        { label: 'C', text: 'completed' },
        { label: 'D', text: 'completing' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc giả định: "It is mandatory that + S + (should) + V_bare". Động từ giữ nguyên mẫu không chia "complete".',
      translation: 'Việc mỗi nhân viên mới được tuyển dụng phải hoàn thành buổi hội thảo an ninh mạng kỹ thuật số trước thứ Sáu là bắt buộc.'
    }
  ]
};
