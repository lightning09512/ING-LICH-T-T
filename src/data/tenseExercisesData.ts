import { GrammarExercise } from './grammarData';

export const tenseExercisesMap: { [tenseId: string]: GrammarExercise[] } = {
  // 1. PRESENT SIMPLE
  'present-simple': [
    {
      id: 1,
      question: 'The regional express train _______ at Platform 4 every thirty minutes during rush hour.',
      options: [
        { label: 'A', text: 'depart' },
        { label: 'B', text: 'departs' },
        { label: 'C', text: 'is departing' },
        { label: 'D', text: 'departed' }
      ],
      correctAnswer: 'B',
      explanation: 'Chủ ngữ "The regional express train" là số ít, diễn tả lịch trình cố định định kỳ ("every thirty minutes") nên dùng thì Hiện tại đơn: "departs".',
      translation: 'Chuyến tàu tốc hành khu vực khởi hành tại Sân ga số 4 mỗi ba mươi phút một chuyến trong giờ cao điểm.'
    },
    {
      id: 2,
      question: 'The new employee handbook _______ essential guidelines regarding workplace safety and confidentiality.',
      options: [
        { label: 'A', text: 'contains' },
        { label: 'B', text: 'is containing' },
        { label: 'C', text: 'contain' },
        { label: 'D', text: 'have contained' }
      ],
      correctAnswer: 'A',
      explanation: 'Động từ "contain" là stative verb (chỉ trạng thái/chứa đựng), tuyệt đối không chia ở dạng tiếp diễn. Chủ ngữ số ít "The new employee handbook" chia "contains".',
      translation: 'Sổ tay nhân viên mới chứa đựng các hướng dẫn thiết yếu liên quan đến an toàn lao động và bảo mật.'
    },
    {
      id: 3,
      question: 'When the regional director _______ at the plant tomorrow, the engineers will present the production report.',
      options: [
        { label: 'A', text: 'arrived' },
        { label: 'B', text: 'will arrive' },
        { label: 'C', text: 'arrives' },
        { label: 'D', text: 'is arriving' }
      ],
      correctAnswer: 'C',
      explanation: 'Quy tắc mệnh đề trạng ngữ chỉ thời gian: Mệnh đề bắt đầu bằng When chỉ tương lai nhưng động từ chia ở Hiện tại đơn ("arrives"), mệnh đề chính chia Tương lai đơn ("will present").',
      translation: 'Khi giám đốc khu vực đến nhà máy vào ngày mai, các kỹ sư sẽ trình bày báo cáo sản xuất.'
    },
    {
      id: 4,
      question: 'The billing department _______ personal checks for invoice payments exceeding $1,000.',
      options: [
        { label: 'A', text: 'do not accept' },
        { label: 'B', text: 'does not accept' },
        { label: 'C', text: 'not accept' },
        { label: 'D', text: 'is not accepted' }
      ],
      correctAnswer: 'B',
      explanation: 'Câu phủ định hiện tại đơn với chủ ngữ số ít "The billing department" dùng trợ động từ "does not" + V-inf ("accept").',
      translation: 'Bộ phận thanh toán không chấp nhận séc cá nhân cho các khoản thanh toán hóa đơn vượt quá $1,000.'
    },
    {
      id: 5,
      question: 'Ms. Henderson _______ currently responsible for overseeing the corporate restructuring project.',
      options: [
        { label: 'A', text: 'be' },
        { label: 'B', text: 'is' },
        { label: 'C', text: 'are' },
        { label: 'D', text: 'being' }
      ],
      correctAnswer: 'B',
      explanation: 'Chủ ngữ ngôi thứ ba số ít "Ms. Henderson" đi với to be "is" ở hiện tại đơn (cụm "be responsible for": chịu trách nhiệm về).',
      translation: 'Bà Henderson hiện chịu trách nhiệm giám sát dự án tái cơ cấu doanh nghiệp.'
    }
  ],

  // 2. PRESENT CONTINUOUS
  'present-continuous': [
    {
      id: 1,
      question: 'Our technical support team is currently _______ the core database servers to enhance network speed.',
      options: [
        { label: 'A', text: 'upgrade' },
        { label: 'B', text: 'upgrading' },
        { label: 'C', text: 'upgraded' },
        { label: 'D', text: 'upgrades' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc thì Hiện tại tiếp diễn: "is + currently + V-ing". Chọn "upgrading".',
      translation: 'Đội ngũ hỗ trợ kỹ thuật của chúng tôi hiện đang nâng cấp các máy chủ cơ sở dữ liệu cốt lõi để nâng cao tốc độ mạng.'
    },
    {
      id: 2,
      question: 'Due to growing consumer demand, the electronics manufacturer _______ its production capacity this quarter.',
      options: [
        { label: 'A', text: 'is expanding' },
        { label: 'B', text: 'expand' },
        { label: 'C', text: 'expanded' },
        { label: 'D', text: 'have expanded' }
      ],
      correctAnswer: 'A',
      explanation: 'Diễn tả một xu hướng hoặc sự thay đổi đang diễn biến tích cực trong khoảng thời gian hiện tại ("this quarter"), dùng thì Hiện tại tiếp diễn: "is expanding".',
      translation: 'Do nhu cầu ngày càng tăng của người tiêu dùng, nhà sản xuất đồ điện tử đang mở rộng công suất sản xuất trong quý này.'
    },
    {
      id: 3,
      question: 'The human resources committee _______ shortlisted applicants in Conference Room B right now.',
      options: [
        { label: 'A', text: 'interview' },
        { label: 'B', text: 'is interviewing' },
        { label: 'C', text: 'interviewed' },
        { label: 'D', text: 'interviews' }
      ],
      correctAnswer: 'B',
      explanation: 'Dấu hiệu thời gian "right now" chỉ hành động đang diễn ra tại thời điểm nói. Chọn "is interviewing".',
      translation: 'Hội đồng nhân sự đang phỏng vấn các ứng viên trong danh sách rút gọn tại Phòng hội nghị B ngay lúc này.'
    },
    {
      id: 4,
      question: 'The logistics company _______ any new delivery contracts until the fuel crisis stabilizes.',
      options: [
        { label: 'A', text: 'is not accepting' },
        { label: 'B', text: 'not accepting' },
        { label: 'C', text: 'does not accepting' },
        { label: 'D', text: 'are not accept' }
      ],
      correctAnswer: 'A',
      explanation: 'Phủ định thì hiện tại tiếp diễn chỉ tình trạng tạm thời: "is not accepting" (với chủ ngữ số ít The logistics company).',
      translation: 'Công ty hậu cần đang không tiếp nhận bất kỳ hợp đồng giao hàng mới nào cho đến khi cuộc khủng hoảng nhiên liệu ổn định.'
    },
    {
      id: 5,
      question: 'Mr. Tanaka _______ a renewable energy symposium in Munich next Thursday.',
      options: [
        { label: 'A', text: 'attends' },
        { label: 'B', text: 'is attending' },
        { label: 'C', text: 'attended' },
        { label: 'D', text: 'attend' }
      ],
      correctAnswer: 'B',
      explanation: 'Hiện tại tiếp diễn dùng để diễn tả kế hoạch/lịch trình đã được sắp xếp cụ thể trong tương lai gần ("next Thursday"). Chọn "is attending".',
      translation: 'Ông Tanaka sẽ tham dự một hội nghị chuyên đề về năng lượng tái tạo tại Munich vào thứ Năm tới.'
    }
  ],

  // 3. PRESENT PERFECT
  'present-perfect': [
    {
      id: 1,
      question: 'International freight costs _______ significantly since the beginning of the fiscal year.',
      options: [
        { label: 'A', text: 'rose' },
        { label: 'B', text: 'have risen' },
        { label: 'C', text: 'rises' },
        { label: 'D', text: 'are rising' }
      ],
      correctAnswer: 'B',
      explanation: 'Dấu hiệu "since + mốc thời gian" (since the beginning...) là đặc trưng của thì Hiện tại hoàn thành. Chủ ngữ số nhiều "costs" chia "have risen".',
      translation: 'Chi phí vận chuyển hàng hóa quốc tế đã tăng đáng kể kể từ đầu năm tài chính.'
    },
    {
      id: 2,
      question: 'Over the past two years, the telecommunications firm _______ three innovative smartphone models.',
      options: [
        { label: 'A', text: 'released' },
        { label: 'B', text: 'has released' },
        { label: 'C', text: 'releases' },
        { label: 'D', text: 'will release' }
      ],
      correctAnswer: 'B',
      explanation: 'Cụm "Over the past two years" (trong vòng 2 năm qua) bắt buộc chia thì Hiện tại hoàn thành: "has released".',
      translation: 'Trong vòng hai năm qua, công ty viễn thông đã phát hành ba mẫu điện thoại thông minh đột phá.'
    },
    {
      id: 3,
      question: 'The executive steering board has already _______ the updated capital allocation plan.',
      options: [
        { label: 'A', text: 'approve' },
        { label: 'B', text: 'approved' },
        { label: 'C', text: 'approving' },
        { label: 'D', text: 'approval' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "has already + V3/ed" (đã phê duyệt). Chọn phân từ quá khứ "approved".',
      translation: 'Hội đồng quản trị đã phê duyệt kế hoạch phân bổ vốn cập nhật.'
    },
    {
      id: 4,
      question: 'The regional health authority _______ a comprehensive review of clinical safety standards recently.',
      options: [
        { label: 'A', text: 'conducted' },
        { label: 'B', text: 'has conducted' },
        { label: 'C', text: 'conducts' },
        { label: 'D', text: 'is conducting' }
      ],
      correctAnswer: 'B',
      explanation: 'Từ nhận biết "recently" (gần đây) đi với thì Hiện tại hoàn thành: "has conducted".',
      translation: 'Cơ quan y tế khu vực gần đây đã tiến hành đánh giá toàn diện các tiêu chuẩn an toàn lâm sàng.'
    },
    {
      id: 5,
      question: 'Dr. Katherine Evans has _______ as the chief financial officer for more than a decade.',
      options: [
        { label: 'A', text: 'serve' },
        { label: 'B', text: 'served' },
        { label: 'C', text: 'serving' },
        { label: 'D', text: 'service' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "has + V3/ed" kết hợp dấu hiệu "for more than a decade" (hơn một thập kỷ qua). Chọn "served".',
      translation: 'Tiến sĩ Katherine Evans đã giữ chức vụ giám đốc tài chính trong hơn một thập kỷ qua.'
    }
  ],

  // 4. PRESENT PERFECT CONTINUOUS
  'present-perfect-continuous': [
    {
      id: 1,
      question: 'The lead software architects have been _______ the payment gateway code all morning.',
      options: [
        { label: 'A', text: 'debug' },
        { label: 'B', text: 'debugging' },
        { label: 'C', text: 'debugged' },
        { label: 'D', text: 'debugs' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc thì Hiện tại hoàn thành tiếp diễn: "have been + V-ing" kết hợp "all morning" nhấn mạnh tính liên tục không ngừng.',
      translation: 'Các kiến trúc sư phần mềm trưởng đã gỡ lỗi mã cổng thanh toán liên tục suốt cả buổi sáng.'
    },
    {
      id: 2,
      question: 'The two pharmaceutical companies have been _______ merger terms for over five consecutive hours.',
      options: [
        { label: 'A', text: 'negotiating' },
        { label: 'B', text: 'negotiate' },
        { label: 'C', text: 'negotiated' },
        { label: 'D', text: 'negotiation' }
      ],
      correctAnswer: 'A',
      explanation: 'Thì HTHT tiếp diễn: "have been + V-ing". Dấu hiệu "for over five consecutive hours" (hơn 5 giờ liên tục). Chọn "negotiating".',
      translation: 'Hai công ty dược phẩm đã đàm phán các điều khoản sáp nhập liên tục trong hơn năm giờ đồng hồ.'
    },
    {
      id: 3,
      question: 'Mr. Campbell _______ monitoring client inquiries since the server migration began at 6 AM.',
      options: [
        { label: 'A', text: 'has been' },
        { label: 'B', text: 'have been' },
        { label: 'C', text: 'is' },
        { label: 'D', text: 'was' }
      ],
      correctAnswer: 'A',
      explanation: 'Chủ ngữ số ít "Mr. Campbell" đi với "has been + V-ing" (monitoring) kết hợp mệnh đề chỉ thời gian "since... began".',
      translation: 'Ông Campbell đã liên tục theo dõi các thắc mắc của khách hàng kể từ khi quá trình di chuyển máy chủ bắt đầu lúc 6 giờ sáng.'
    },
    {
      id: 4,
      question: 'The research lab has been _______ with university scholars on the solar project for six months.',
      options: [
        { label: 'A', text: 'collaborated' },
        { label: 'B', text: 'collaborating' },
        { label: 'C', text: 'collaborates' },
        { label: 'D', text: 'collaboration' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "has been + V-ing" (collaborating) diễn tả sự hợp tác kéo dài liên tục suốt 6 tháng qua.',
      translation: 'Phòng thí nghiệm nghiên cứu đã hợp tác liên tục với các học giả đại học trong dự án năng lượng mặt trời suốt sáu tháng qua.'
    },
    {
      id: 5,
      question: 'How long have you _______ preparing the audit documentation for tomorrow\'s regulatory visit?',
      options: [
        { label: 'A', text: 'been' },
        { label: 'B', text: 'be' },
        { label: 'C', text: 'being' },
        { label: 'D', text: 'was' }
      ],
      correctAnswer: 'A',
      explanation: 'Câu hỏi thì HTHT tiếp diễn: "How long + have + S + been + V-ing?". Chọn "been".',
      translation: 'Bạn đã chuẩn bị tài liệu kiểm toán cho chuyến thanh tra vào ngày mai được bao lâu rồi?'
    }
  ],

  // 5. PAST SIMPLE
  'past-simple': [
    {
      id: 1,
      question: 'The commercial bank _______ its first overseas branch in Singapore in 2018.',
      options: [
        { label: 'A', text: 'establishes' },
        { label: 'B', text: 'established' },
        { label: 'C', text: 'has established' },
        { label: 'D', text: 'establishing' }
      ],
      correctAnswer: 'B',
      explanation: 'Có mốc thời gian quá khứ xác định rõ ràng ("in 2018") nên bắt buộc chia thì Quá khứ đơn: "established". Không dùng HTHT.',
      translation: 'Ngân hàng thương mại đã thành lập chi nhánh nước ngoài đầu tiên tại Singapore vào năm 2018.'
    },
    {
      id: 2,
      question: 'The contracted courier did not _______ the replacement engine parts yesterday afternoon.',
      options: [
        { label: 'A', text: 'deliver' },
        { label: 'B', text: 'delivered' },
        { label: 'C', text: 'delivering' },
        { label: 'D', text: 'delivers' }
      ],
      correctAnswer: 'A',
      explanation: 'Sau trợ động từ phủ định quá khứ "did not", động từ chính luôn ở dạng nguyên mẫu (V-inf): "deliver".',
      translation: 'Đơn vị chuyển phát theo hợp đồng đã không giao các linh kiện động cơ thay thế vào chiều hôm qua.'
    },
    {
      id: 3,
      question: 'The keynote speaker at last Friday\'s marketing convention _______ exceptionally insightful.',
      options: [
        { label: 'A', text: 'is' },
        { label: 'B', text: 'was' },
        { label: 'C', text: 'were' },
        { label: 'D', text: 'has been' }
      ],
      correctAnswer: 'B',
      explanation: 'Mốc thời gian "last Friday" chia quá khứ. Chủ ngữ số ít "The keynote speaker" đi với to be "was".',
      translation: 'Diễn giả chính tại hội nghị tiếp thị vào thứ Sáu tuần trước đã cung cấp những góc nhìn đặc biệt sâu sắc.'
    },
    {
      id: 4,
      question: 'Two weeks ago, the facilities coordinator _______ the revised office renovation blueprints.',
      options: [
        { label: 'A', text: 'submits' },
        { label: 'B', text: 'submitted' },
        { label: 'C', text: 'has submitted' },
        { label: 'D', text: 'will submit' }
      ],
      correctAnswer: 'B',
      explanation: 'Dấu hiệu "Two weeks ago" chỉ mốc quá khứ hoàn tất. Chia quá khứ đơn "submitted".',
      translation: 'Cách đây hai tuần, điều phối viên cơ sở vật chất đã nộp bản thiết kế cải tạo văn phòng sửa đổi.'
    },
    {
      id: 5,
      question: 'Did your audit committee _______ any discrepancies in the quarterly ledger records?',
      options: [
        { label: 'A', text: 'find' },
        { label: 'B', text: 'found' },
        { label: 'C', text: 'finding' },
        { label: 'D', text: 'finds' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc câu hỏi nghi vấn quá khứ đơn: "Did + S + V-inf?". Chọn động từ nguyên mẫu "find".',
      translation: 'Ủy ban kiểm toán của bạn có phát hiện ra bất kỳ sai lệch nào trong sổ cái kế toán hàng quý không?'
    }
  ],

  // 6. PAST CONTINUOUS
  'past-continuous': [
    {
      id: 1,
      question: 'At 10:00 AM yesterday, the lead engineers _______ the backup electrical generator.',
      options: [
        { label: 'A', text: 'tested' },
        { label: 'B', text: 'were testing' },
        { label: 'C', text: 'are testing' },
        { label: 'D', text: 'have tested' }
      ],
      correctAnswer: 'B',
      explanation: 'Hành động đang diễn ra tại một mốc giờ cụ thể xác định trong quá khứ ("At 10:00 AM yesterday"). Chủ ngữ số nhiều "engineers" đi với "were testing".',
      translation: 'Vào lúc 10:00 sáng hôm qua, các kỹ sư trưởng đang kiểm tra máy phát điện dự phòng.'
    },
    {
      id: 2,
      question: 'While Ms. Vance was _______ the draft agreement, her assistant printed the relevant exhibits.',
      options: [
        { label: 'A', text: 'reviewed' },
        { label: 'B', text: 'reviewing' },
        { label: 'C', text: 'reviews' },
        { label: 'D', text: 'review' }
      ],
      correctAnswer: 'B',
      explanation: 'Sau "was" trong cấu trúc "While + was/were + V-ing" cần dạng V-ing: "reviewing".',
      translation: 'Trong khi bà Vance đang xem lại dự thảo thỏa thuận, trợ lý của bà đã in các tài liệu đính kèm liên quan.'
    },
    {
      id: 3,
      question: 'The technician was repairing the central server when the fire alarm suddenly _______.',
      options: [
        { label: 'A', text: 'sounded' },
        { label: 'B', text: 'was sounding' },
        { label: 'C', text: 'sounds' },
        { label: 'D', text: 'has sounded' }
      ],
      correctAnswer: 'A',
      explanation: 'Hành động đang diễn ra (was repairing) thì hành động khác ngắn hơn chen ngang trong quá khứ (sounded chia quá khứ đơn).',
      translation: 'Kỹ thuật viên đang sửa máy chủ trung tâm thì chuông báo cháy đột ngột vang lên.'
    },
    {
      id: 4,
      question: 'The manufacturing assembly line _______ operating during the scheduled power maintenance yesterday.',
      options: [
        { label: 'A', text: 'was not' },
        { label: 'B', text: 'did not' },
        { label: 'C', text: 'were not' },
        { label: 'D', text: 'has not' }
      ],
      correctAnswer: 'A',
      explanation: 'Phía sau là V-ing ("operating"). Cần to be quá khứ phủ định với chủ ngữ số ít "assembly line": "was not".',
      translation: 'Dây chuyền lắp ráp sản xuất đã không hoạt động trong suốt đợt bảo trì điện theo lịch trình ngày hôm qua.'
    },
    {
      id: 5,
      question: 'What were the auditors _______ when the regional manager entered the boardroom?',
      options: [
        { label: 'A', text: 'discuss' },
        { label: 'B', text: 'discussed' },
        { label: 'C', text: 'discussing' },
        { label: 'D', text: 'discussion' }
      ],
      correctAnswer: 'C',
      explanation: 'Cấu trúc câu hỏi quá khứ tiếp diễn: "Wh-word + were + S + V-ing?". Chọn "discussing".',
      translation: 'Các kiểm toán viên đang thảo luận điều gì khi người quản lý khu vực bước vào phòng họp?'
    }
  ],

  // 7. PAST PERFECT
  'past-perfect': [
    {
      id: 1,
      question: 'The corporate jet had already _______ before the executive delegation arrived at the runway.',
      options: [
        { label: 'A', text: 'depart' },
        { label: 'B', text: 'departed' },
        { label: 'C', text: 'departing' },
        { label: 'D', text: 'departs' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc quá khứ hoàn thành: "had + already + V3/ed" (xảy ra trước một hành động quá khứ khác "arrived"). Chọn "departed".',
      translation: 'Chiếc máy bay riêng của tập đoàn đã cất cánh trước khi đoàn đại biểu điều hành đến đường băng.'
    },
    {
      id: 2,
      question: 'By the time the new director assumed office, the restructuring committee _______ all branch audits.',
      options: [
        { label: 'A', text: 'completed' },
        { label: 'B', text: 'had completed' },
        { label: 'C', text: 'has completed' },
        { label: 'D', text: 'will complete' }
      ],
      correctAnswer: 'B',
      explanation: 'Công thức vàng TOEIC: "By the time + S + V2/ed (assumed), S + HAD + V3/ed". Chọn "had completed".',
      translation: 'Trước lúc vị giám đốc mới nhậm chức, ban tái cơ cấu đã hoàn tất tất cả các đợt kiểm toán chi nhánh.'
    },
    {
      id: 3,
      question: 'Prior to the international merger, the domestic firm _______ the wholesale retail market for years.',
      options: [
        { label: 'A', text: 'had dominated' },
        { label: 'B', text: 'dominates' },
        { label: 'C', text: 'is dominating' },
        { label: 'D', text: 'will dominate' }
      ],
      correctAnswer: 'A',
      explanation: 'Hành động thống trị thị trường diễn ra và kéo dài trong nhiều năm trước một sự kiện trong quá khứ ("Prior to the merger"). Dùng Quá khứ hoàn thành: "had dominated".',
      translation: 'Trước vụ sáp nhập quốc tế, công ty trong nước đã thống trị thị trường bán buôn trong nhiều năm.'
    },
    {
      id: 4,
      question: 'Because the applicant _______ extensive experience in logistics, she was immediately offered the position.',
      options: [
        { label: 'A', text: 'has demonstrated' },
        { label: 'B', text: 'had demonstrated' },
        { label: 'C', text: 'demonstrating' },
        { label: 'D', text: 'demonstrates' }
      ],
      correctAnswer: 'B',
      explanation: 'Hành động thể hiện năng lực diễn ra trước thời điểm được nhận việc ("was offered" ở quá khứ). Chia Quá khứ hoàn thành: "had demonstrated".',
      translation: 'Bởi vì ứng viên đã thể hiện kinh nghiệm sâu rộng về hậu cần từ trước đó, cô ấy đã được nhận vào vị trí ngay lập tức.'
    },
    {
      id: 5,
      question: 'Hardly had the meeting _______ when the fire alarm began sounding throughout the facility.',
      options: [
        { label: 'A', text: 'started' },
        { label: 'B', text: 'start' },
        { label: 'C', text: 'starting' },
        { label: 'D', text: 'starts' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc đảo ngữ quá khứ hoàn thành: "Hardly had + S + V3/ed ... when + S + V2/ed". Chọn "started".',
      translation: 'Cuộc họp vừa mới bắt đầu thì chuông báo cháy đã vang lên khắp tòa nhà.'
    }
  ],

  // 8. PAST PERFECT CONTINUOUS
  'past-perfect-continuous': [
    {
      id: 1,
      question: 'The procurement team had been _______ with the supplier for seven months before terms were finalized.',
      options: [
        { label: 'A', text: 'negotiate' },
        { label: 'B', text: 'negotiating' },
        { label: 'C', text: 'negotiated' },
        { label: 'D', text: 'negotiation' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc Quá khứ hoàn thành tiếp diễn: "had been + V-ing" kết hợp khoảng thời gian "for seven months" trước một mốc quá khứ "before terms were finalized".',
      translation: 'Đội ngũ mua sắm đã đàm phán liên tục với nhà cung cấp suốt bảy tháng trước khi các điều khoản được chốt lại.'
    },
    {
      id: 2,
      question: 'Dr. Evans had been _______ the medical trial for nearly a year before the breakthrough occurred.',
      options: [
        { label: 'A', text: 'direct' },
        { label: 'B', text: 'directing' },
        { label: 'C', text: 'directed' },
        { label: 'D', text: 'direction' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "had been + V-ing" (directing) nhấn mạnh tính liên tục của quá trình nghiên cứu trước khi bước đột phá diễn ra.',
      translation: 'Tiến sĩ Evans đã chỉ đạo thử nghiệm y tế liên tục gần một năm trước khi bước đột phá xảy ra.'
    },
    {
      id: 3,
      question: 'The factory generator had been _______ continuously for 48 hours before it experienced an outage.',
      options: [
        { label: 'A', text: 'operated' },
        { label: 'B', text: 'operating' },
        { label: 'C', text: 'operates' },
        { label: 'D', text: 'operation' }
      ],
      correctAnswer: 'B',
      explanation: 'Nhấn mạnh quá trình vận hành liên tục không ngừng suốt 48 giờ trước một sự cố quá khứ: "had been operating".',
      translation: 'Máy phát điện nhà máy đã chạy liên tục suốt 48 giờ trước khi gặp sự cố gián đoạn.'
    },
    {
      id: 4,
      question: 'How long had the engineers been _______ the software prototype before discovering the flaw?',
      options: [
        { label: 'A', text: 'testing' },
        { label: 'B', text: 'test' },
        { label: 'C', text: 'tested' },
        { label: 'D', text: 'tests' }
      ],
      correctAnswer: 'A',
      explanation: 'Câu hỏi thì QKHT tiếp diễn: "How long had + S + been + V-ing?". Chọn "testing".',
      translation: 'Các kỹ sư đã thử nghiệm nguyên mẫu phần mềm liên tục được bao lâu trước khi phát hiện ra lỗi?'
    },
    {
      id: 5,
      question: 'The airline had been _______ direct flights to Vancouver for twenty years before suspending the route.',
      options: [
        { label: 'A', text: 'offered' },
        { label: 'B', text: 'offering' },
        { label: 'C', text: 'offers' },
        { label: 'D', text: 'offer' }
      ],
      correctAnswer: 'B',
      explanation: 'Hành động cung cấp chuyến bay kéo dài liên tục suốt 20 năm trước thời điểm tạm dừng tuyến bay. Chọn "offering".',
      translation: 'Hãng hàng không đã cung cấp các chuyến bay thẳng đến Vancouver liên tục trong hai mươi năm trước khi đình chỉ đường bay.'
    }
  ],

  // 9. FUTURE SIMPLE & BE GOING TO
  'future-simple': [
    {
      id: 1,
      question: 'The board of directors _______ the annual dividend payment at next Monday\'s shareholders meeting.',
      options: [
        { label: 'A', text: 'announces' },
        { label: 'B', text: 'will announce' },
        { label: 'C', text: 'announced' },
        { label: 'D', text: 'have announced' }
      ],
      correctAnswer: 'B',
      explanation: 'Dấu hiệu thời gian "at next Monday\'s meeting" (cuộc họp thứ Hai tới) diễn tả quyết định/thông báo tương lai. Chọn "will announce".',
      translation: 'Hội đồng quản trị sẽ công bố khoản chi trả cổ tức hàng năm tại cuộc họp cổ đông vào thứ Hai tới.'
    },
    {
      id: 2,
      question: 'As soon as the warehouse manager _______ the invoice, the logistics team will dispatch the cargo.',
      options: [
        { label: 'A', text: 'will approve' },
        { label: 'B', text: 'approves' },
        { label: 'C', text: 'approved' },
        { label: 'D', text: 'approving' }
      ],
      correctAnswer: 'B',
      explanation: 'BẪY TOEIC KINH ĐIỂN: Mệnh đề trạng từ thời gian (sau As soon as) TUYỆT ĐỐI KHÔNG DÙNG WILL. Mệnh đề phụ chia Hiện tại đơn ("approves"), mệnh đề chính chia Tương lai ("will dispatch").',
      translation: 'Ngay sau khi quản lý kho phê duyệt hóa đơn, đội ngũ hậu cần sẽ gửi hàng đi.'
    },
    {
      id: 3,
      question: 'Our corporation is _______ open five additional retail branches across the metropolitan area this fall.',
      options: [
        { label: 'A', text: 'going to' },
        { label: 'B', text: 'will' },
        { label: 'C', text: 'shall' },
        { label: 'D', text: 'planning' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc tương lai gần diễn tả kế hoạch đã định sẵn: "is + going to + V-inf (open)".',
      translation: 'Tập đoàn chúng tôi dự định sẽ mở thêm năm chi nhánh bán lẻ trên khắp khu vực đô thị vào mùa thu này.'
    },
    {
      id: 4,
      question: 'We promise that our dedicated customer support specialists _______ resolve your inquiry within 24 hours.',
      options: [
        { label: 'A', text: 'will' },
        { label: 'B', text: 'are' },
        { label: 'C', text: 'have' },
        { label: 'D', text: 'did' }
      ],
      correctAnswer: 'A',
      explanation: 'Lời cam kết/hứa hẹn ("promise that...") luôn đi với tương lai đơn "will + V-inf (resolve)".',
      translation: 'Chúng tôi cam kết rằng các chuyên viên hỗ trợ khách hàng tận tâm của chúng tôi sẽ giải quyết thắc mắc của bạn trong vòng 24 giờ.'
    },
    {
      id: 5,
      question: 'The leasing agreement stipulates that the tenant _______ not alter the building\'s structural layout.',
      options: [
        { label: 'A', text: 'has' },
        { label: 'B', text: 'will' },
        { label: 'C', text: 'is' },
        { label: 'D', text: 'are' }
      ],
      correctAnswer: 'B',
      explanation: 'Sau "will not" là động từ nguyên mẫu không "to" ("alter"). Các phương án "has", "is", "are" đều sai cấu trúc khi đứng trước "not alter". Chọn "will".',
      translation: 'Hợp đồng thuê quy định rằng bên thuê sẽ không thay đổi kết cấu kiến trúc của tòa nhà.'
    }
  ],

  // 10. FUTURE CONTINUOUS
  'future-continuous': [
    {
      id: 1,
      question: 'At 10:00 AM tomorrow, our sales representatives will be _______ the international trade delegation.',
      options: [
        { label: 'A', text: 'meet' },
        { label: 'B', text: 'meeting' },
        { label: 'C', text: 'met' },
        { label: 'D', text: 'meets' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc tương lai tiếp diễn: "will be + V-ing" khi có mốc thời gian cụ thể trong tương lai ("At 10:00 AM tomorrow"). Chọn "meeting".',
      translation: 'Vào lúc 10:00 sáng mai, các đại diện bán hàng của chúng tôi sẽ đang gặp gỡ phái đoàn thương mại quốc tế.'
    },
    {
      id: 2,
      question: 'This time next month, Ms. Robinson will be _______ at the corporation\'s European headquarters in London.',
      options: [
        { label: 'A', text: 'work' },
        { label: 'B', text: 'working' },
        { label: 'C', text: 'worked' },
        { label: 'D', text: 'works' }
      ],
      correctAnswer: 'B',
      explanation: 'Dấu hiệu "This time next month" (Vào thời điểm này tháng tới) chỉ hành động đang diễn ra trong tương lai: "will be working".',
      translation: 'Vào thời điểm này tháng sau, cô Robinson sẽ đang làm việc tại trụ sở châu Âu của tập đoàn ở London.'
    },
    {
      id: 3,
      question: 'The regional auditor _______ visiting our branch office next Wednesday as part of the scheduled review.',
      options: [
        { label: 'A', text: 'will be' },
        { label: 'B', text: 'will' },
        { label: 'C', text: 'is' },
        { label: 'D', text: 'has been' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc tương lai tiếp diễn "will be + V-ing (visiting)" diễn tả hành động sẽ xảy ra theo thói quen hoặc quy trình thông thường.',
      translation: 'Kiểm toán viên khu vực sẽ ghé thăm văn phòng chi nhánh của chúng tôi vào thứ Tư tới như một phần của đợt đánh giá theo lịch trình.'
    },
    {
      id: 4,
      question: 'At 3:00 PM on Thursday, the software trainer will be _______ the orientation webinar.',
      options: [
        { label: 'A', text: 'conduct' },
        { label: 'B', text: 'conducting' },
        { label: 'C', text: 'conducted' },
        { label: 'D', text: 'conducts' }
      ],
      correctAnswer: 'B',
      explanation: 'Mốc giờ cụ thể ở tương lai ("At 3:00 PM on Thursday") kết hợp cấu trúc "will be + V-ing". Chọn "conducting".',
      translation: 'Vào lúc 3:00 chiều thứ Năm, chuyên viên đào tạo phần mềm sẽ đang điều hành buổi hội thảo trực tuyến định hướng.'
    },
    {
      id: 5,
      question: 'Will you be _______ the annual corporate banquet with your department colleagues tomorrow evening?',
      options: [
        { label: 'A', text: 'attend' },
        { label: 'B', text: 'attending' },
        { label: 'C', text: 'attended' },
        { label: 'D', text: 'attends' }
      ],
      correctAnswer: 'B',
      explanation: 'Câu hỏi tương lai tiếp diễn: "Will + you + be + V-ing?". Chọn "attending".',
      translation: 'Bạn sẽ tham dự bữa tiệc thường niên của công ty cùng các đồng nghiệp trong phòng ban vào tối mai chứ?'
    }
  ],

  // 11. FUTURE PERFECT
  'future-perfect': [
    {
      id: 1,
      question: 'By next Friday, the renovation contractors will have _______ the expansion of the conference hall.',
      options: [
        { label: 'A', text: 'complete' },
        { label: 'B', text: 'completed' },
        { label: 'C', text: 'completing' },
        { label: 'D', text: 'completes' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc Tương lai hoàn thành: "will have + V3/ed" đi kèm dấu hiệu "By next Friday" (Trước thứ Sáu tới). Chọn "completed".',
      translation: 'Trước thứ Sáu tới, các nhà thầu cải tạo sẽ hoàn thành việc mở rộng hội trường hội nghị.'
    },
    {
      id: 2,
      question: 'By the time the new facility opens in December, our staff _______ all necessary safety training.',
      options: [
        { label: 'A', text: 'will have finished' },
        { label: 'B', text: 'finished' },
        { label: 'C', text: 'have finished' },
        { label: 'D', text: 'are finishing' }
      ],
      correctAnswer: 'A',
      explanation: 'Công thức TOEIC: "By the time + S + V(hiện tại đơn chỉ tương lai), S + WILL HAVE + V3/ed". Chọn "will have finished".',
      translation: 'Trước lúc cơ sở mới mở cửa vào tháng 12, nhân viên của chúng tôi sẽ hoàn thành tất cả các khóa tập huấn an toàn cần thiết.'
    },
    {
      id: 3,
      question: 'By the end of this fiscal year, the corporation will have _______ its total debt by 40 percent.',
      options: [
        { label: 'A', text: 'reduce' },
        { label: 'B', text: 'reduced' },
        { label: 'C', text: 'reducing' },
        { label: 'D', text: 'reduction' }
      ],
      correctAnswer: 'B',
      explanation: 'Cụm "By the end of this fiscal year" đi kèm cấu trúc "will have + V3/ed". Chọn "reduced".',
      translation: 'Tính đến cuối năm tài chính này, tập đoàn sẽ cắt giảm được 40% tổng số nợ.'
    },
    {
      id: 4,
      question: 'The IT department will have _______ all employee workstations before the system audit begins tomorrow.',
      options: [
        { label: 'A', text: 'upgraded' },
        { label: 'B', text: 'upgrade' },
        { label: 'C', text: 'upgrading' },
        { label: 'D', text: 'upgrades' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc tương lai hoàn thành "will have + V3/ed" diễn tả hành động hoàn tất trước một hành động tương lai khác ("before the audit begins"). Chọn "upgraded".',
      translation: 'Phòng CNTT sẽ nâng cấp xong tất cả các máy trạm của nhân viên trước khi cuộc kiểm toán hệ thống bắt đầu vào ngày mai.'
    },
    {
      id: 5,
      question: 'By October, the clinical research team _______ results from over 5,000 trial participants.',
      options: [
        { label: 'A', text: 'will have collected' },
        { label: 'B', text: 'collected' },
        { label: 'C', text: 'has collected' },
        { label: 'D', text: 'is collecting' }
      ],
      correctAnswer: 'A',
      explanation: 'Dấu hiệu "By + mốc tương lai" (By October) chia thì Tương lai hoàn thành: "will have collected".',
      translation: 'Tính đến tháng 10, đội ngũ nghiên cứu lâm sàng sẽ thu thập được kết quả từ hơn 5.000 người tham gia thử nghiệm.'
    }
  ],

  // 12. FUTURE PERFECT CONTINUOUS
  'future-perfect-continuous': [
    {
      id: 1,
      question: 'By next December, Dr. Miller will have been _______ at this hospital for exactly thirty years.',
      options: [
        { label: 'A', text: 'practiced' },
        { label: 'B', text: 'practicing' },
        { label: 'C', text: 'practice' },
        { label: 'D', text: 'practices' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc Tương lai hoàn thành tiếp diễn: "will have been + V-ing" kết hợp cả "By next December" và "for thirty years". Chọn "practicing".',
      translation: 'Tính đến tháng 12 tới, Tiến sĩ Miller sẽ hành nghề liên tục tại bệnh viện này đúng ba mươi năm.'
    },
    {
      id: 2,
      question: 'By the time the contract expires, the consortium will have been _______ the toll road for two decades.',
      options: [
        { label: 'A', text: 'operating' },
        { label: 'B', text: 'operated' },
        { label: 'C', text: 'operate' },
        { label: 'D', text: 'operation' }
      ],
      correctAnswer: 'A',
      explanation: 'Nhấn mạnh khoảng thời gian kéo dài liên tục ("for two decades") tính đến mốc hết hạn hợp đồng trong tương lai. Chọn "operating".',
      translation: 'Trước thời điểm hợp đồng hết hạn, liên danh sẽ vận hành tuyến đường thu phí liên tục được tròn hai thập kỷ.'
    },
    {
      id: 3,
      question: 'By 6:00 PM, the technicians will have been _______ the network cables continuously for ten hours.',
      options: [
        { label: 'A', text: 'install' },
        { label: 'B', text: 'installing' },
        { label: 'C', text: 'installed' },
        { label: 'D', text: 'installation' }
      ],
      correctAnswer: 'B',
      explanation: 'Cấu trúc "will have been + V-ing" đi cùng "for ten hours" (suốt 10 tiếng liên tục). Chọn "installing".',
      translation: 'Tính đến 6:00 chiều, các kỹ thuật viên sẽ lắp đặt cáp mạng liên tục được mười tiếng đồng hồ.'
    },
    {
      id: 4,
      question: 'By the end of this month, Ms. Gomez _______ managing the international customer accounts for five years.',
      options: [
        { label: 'A', text: 'will have been' },
        { label: 'B', text: 'has been' },
        { label: 'C', text: 'had been' },
        { label: 'D', text: 'is' }
      ],
      correctAnswer: 'A',
      explanation: 'Chủ ngữ đi kèm cấu trúc tương lai hoàn thành tiếp diễn: "will have been + V-ing (managing)".',
      translation: 'Tính đến cuối tháng này, cô Gomez sẽ quản lý các tài khoản khách hàng quốc tế liên tục được năm năm.'
    },
    {
      id: 5,
      question: 'By the time the audit finishes, the inspectors will have been _______ accounting ledgers for two full days.',
      options: [
        { label: 'A', text: 'examining' },
        { label: 'B', text: 'examined' },
        { label: 'C', text: 'examine' },
        { label: 'D', text: 'examination' }
      ],
      correctAnswer: 'A',
      explanation: 'Cấu trúc "will have been + V-ing" (examining) chỉ hành động kiểm tra sổ sách diễn ra liên tục tính đến thời điểm cuộc kiểm toán kết thúc.',
      translation: 'Trước lúc cuộc kiểm toán kết thúc, các thanh tra viên sẽ kiểm tra sổ sách kế toán liên tục trong hai ngày ròng rã.'
    }
  ]
};
