import { GrammarExercise } from './grammarData';

export interface ExtraP5Exercise extends GrammarExercise {
  topicTitle: string;
  category: 'PART5_GRAMMAR' | 'PART5_VOCAB';
}

export const extraPart5Questions: ExtraP5Exercise[] = [
  // --- 1. TỪ LOẠI (WORD FORM: NOUN / ADJ / ADV / VERB) ---
  {
    id: 1001,
    question: "Ms. Tanaka delivered a _______ presentation that impressed all board members.",
    options: [
      { label: 'A', text: 'persuade' },
      { label: 'B', text: 'persuasive' },
      { label: 'C', text: 'persuasively' },
      { label: 'D', text: 'persuasion' }
    ],
    correctAnswer: 'B',
    explanation: "Đứng trước danh từ 'presentation' cần một tính từ (Adj) để bổ nghĩa: 'persuasive' (có sức thuyết phục).",
    translation: "Bà Tanaka đã trình bày một bài thuyết trình đầy thuyết phục khiến toàn bộ thành viên hội đồng quản trị ấn tượng.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1002,
    question: "The software update was installed _______ without interrupting regular office workflow.",
    options: [
      { label: 'A', text: 'smooth' },
      { label: 'B', text: 'smoothness' },
      { label: 'C', text: 'smoothly' },
      { label: 'D', text: 'smoothest' }
    ],
    correctAnswer: 'C',
    explanation: "Động từ bị động 'was installed' cần một trạng từ (Adv) để bổ nghĩa cho hành động: 'smoothly' (một cách suôn sẻ, trơn tru).",
    translation: "Bản cập nhật phần mềm đã được cài đặt một cách suôn sẻ mà không làm gián đoạn quy trình làm việc thường nhật.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1003,
    question: "The human resources manager commended the team for their _______ during the corporate audit.",
    options: [
      { label: 'A', text: 'cooperate' },
      { label: 'B', text: 'cooperative' },
      { label: 'C', text: 'cooperatively' },
      { label: 'D', text: 'cooperation' }
    ],
    correctAnswer: 'D',
    explanation: "Sau tính từ sở hữu 'their' cần một danh từ (Noun): 'cooperation' (sự hợp tác).",
    translation: "Trưởng phòng nhân sự đã khen ngợi toàn đội vì sự hợp tác tích cực của họ trong đợt kiểm toán công ty.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1004,
    question: "Applicants must possess _______ communication skills to interact effectively with international partners.",
    options: [
      { label: 'A', text: 'exception' },
      { label: 'B', text: 'exceptional' },
      { label: 'C', text: 'exceptionally' },
      { label: 'D', text: 'exceptions' }
    ],
    correctAnswer: 'B',
    explanation: "Cụm danh từ 'communication skills' cần tính từ 'exceptional' (xuất sắc, nổi bật) đứng trước bổ nghĩa.",
    translation: "Các ứng viên phải có kỹ năng giao tiếp xuất sắc để tương tác hiệu quả với các đối tác quốc tế.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1005,
    question: "The CEO requested that the financial department review the quarterly figures _______.",
    options: [
      { label: 'A', text: 'careful' },
      { label: 'B', text: 'carefulness' },
      { label: 'C', text: 'carefully' },
      { label: 'D', text: 'caring' }
    ],
    correctAnswer: 'C',
    explanation: "Bổ nghĩa cho cụm động từ 'review the quarterly figures' cần một trạng từ chỉ cách thức: 'carefully' (một cách cẩn thận).",
    translation: "Tổng giám đốc đã yêu cầu bộ phận tài chính rà soát số liệu quý một cách kỹ lưỡng.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1006,
    question: "Due to high customer demand, the factory decided to _______ its production capacity.",
    options: [
      { label: 'A', text: 'expand' },
      { label: 'B', text: 'expansion' },
      { label: 'C', text: 'expansive' },
      { label: 'D', text: 'expansively' }
    ],
    correctAnswer: 'A',
    explanation: "Cấu trúc 'decide to + V-infinitive' (quyết định làm gì): cần động từ nguyên mẫu 'expand' (mở rộng).",
    translation: "Do nhu cầu khách hàng cao, nhà máy đã quyết định mở rộng công suất sản xuất.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1007,
    question: "Safety goggles are _______ required for all personnel entering the chemical testing laboratory.",
    options: [
      { label: 'A', text: 'strict' },
      { label: 'B', text: 'strictly' },
      { label: 'C', text: 'strictness' },
      { label: 'D', text: 'strictest' }
    ],
    correctAnswer: 'B',
    explanation: "Đứng giữa 'are' (tobe) và 'required' (V3/ed tính từ bị động) cần trạng từ (Adv) bổ nghĩa: 'strictly' (một cách nghiêm ngặt).",
    translation: "Kính bảo hộ được yêu cầu bắt buộc nghiêm ngặt đối với tất cả nhân sự bước vào phòng thí nghiệm hóa chất.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1008,
    question: "The proposed marketing strategy has already demonstrated considerable _______.",
    options: [
      { label: 'A', text: 'effective' },
      { label: 'B', text: 'effectively' },
      { label: 'C', text: 'effectiveness' },
      { label: 'D', text: 'effect' }
    ],
    correctAnswer: 'C',
    explanation: "Sau tính từ 'considerable' (đáng kể) cần danh từ trừu tượng chỉ mức độ hiệu quả: 'effectiveness' (tính hiệu quả).",
    translation: "Chiến lược tiếp thị được đề xuất đã chứng minh được tính hiệu quả đáng kể.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1009,
    question: "Please submit your completed expense report directly to the _______ department.",
    options: [
      { label: 'A', text: 'account' },
      { label: 'B', text: 'accounting' },
      { label: 'C', text: 'accountant' },
      { label: 'D', text: 'accountable' }
    ],
    correctAnswer: 'B',
    explanation: "Cụm danh từ chỉ phòng ban: 'accounting department' (phòng kế toán).",
    translation: "Vui lòng nộp báo cáo chi phí đã hoàn tất trực tiếp cho phòng kế toán.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1010,
    question: "The director was _______ with the rapid progress made on the suburban construction project.",
    options: [
      { label: 'A', text: 'pleased' },
      { label: 'B', text: 'pleasing' },
      { label: 'C', text: 'pleasurable' },
      { label: 'D', text: 'pleasure' }
    ],
    correctAnswer: 'A',
    explanation: "Cấu trúc 'be pleased with something': hài lòng, vừa ý với điều gì (chỉ cảm xúc của con người -> tính từ đuôi -ed).",
    translation: "Giám đốc rất hài lòng với tiến độ nhanh chóng của dự án xây dựng ngoại ô.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },

  // --- 2. HÒA HỢP CHỦ VỊ (SUBJECT - VERB AGREEMENT) ---
  {
    id: 1011,
    question: "Every employee in the accounting and sales divisions _______ required to attend annual compliance training.",
    options: [
      { label: 'A', text: 'is' },
      { label: 'B', text: 'are' },
      { label: 'C', text: 'were' },
      { label: 'D', text: 'have been' }
    ],
    correctAnswer: 'A',
    explanation: "Chủ ngữ bắt đầu bằng 'Every + N số ít' thì động từ luôn chia ở dạng số ít: 'is'.",
    translation: "Mỗi nhân viên trong bộ phận kế toán và bán hàng đều được yêu cầu tham dự khóa đào tạo tuân thủ hàng năm.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1012,
    question: "The number of overseas tourists visiting the historic district _______ increased significantly this summer.",
    options: [
      { label: 'A', text: 'have' },
      { label: 'B', text: 'has' },
      { label: 'C', text: 'are' },
      { label: 'D', text: 'were' }
    ],
    correctAnswer: 'B',
    explanation: "'The number of + N số nhiều' làm chủ ngữ thì động từ chia số ít (ở đây là thì hiện tại hoàn thành: 'has increased'). Lưu ý phân biệt với 'A number of + N nhiều + V số nhiều'.",
    translation: "Số lượng khách du lịch nước ngoài đến thăm khu phố cổ đã tăng lên đáng kể trong mùa hè này.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1013,
    question: "Neither the regional manager nor the branch supervisors _______ available to take client inquiries today.",
    options: [
      { label: 'A', text: 'is' },
      { label: 'B', text: 'are' },
      { label: 'C', text: 'was' },
      { label: 'D', text: 'be' }
    ],
    correctAnswer: 'B',
    explanation: "Cấu trúc 'Neither S1 nor S2 + V': động từ chia theo chủ ngữ gần nhất (S2 = 'the branch supervisors' là số nhiều -> chọn 'are').",
    translation: "Cả giám đốc khu vực lẫn các giám sát chi nhánh đều không có mặt để tiếp nhận thắc mắc của khách hàng hôm nay.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1014,
    question: "Economic data collected from thirty domestic markets _______ that consumer confidence remains steady.",
    options: [
      { label: 'A', text: 'indicates' },
      { label: 'B', text: 'indicate' },
      { label: 'C', text: 'indicating' },
      { label: 'D', text: 'to indicate' }
    ],
    correctAnswer: 'A',
    explanation: "Chủ ngữ chính là 'Economic data' (danh từ không đếm được/tổng thể trong ngữ cảnh TOEIC thường chia số ít): 'indicates'.",
    translation: "Dữ liệu kinh tế thu thập từ 30 thị trường trong nước chỉ ra rằng niềm tin người tiêu dùng vẫn duy trì ổn định.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1015,
    question: "A list of eligible candidates for the overseas assignment _______ posted on the intranet bulletin board.",
    options: [
      { label: 'A', text: 'have been' },
      { label: 'B', text: 'were' },
      { label: 'C', text: 'has been' },
      { label: 'D', text: 'are' }
    ],
    correctAnswer: 'C',
    explanation: "Chủ ngữ là 'A list' (số ít), cụm 'of eligible candidates' chỉ là giới từ bổ nghĩa, nên động từ chia số ít: 'has been'.",
    translation: "Danh sách ứng viên đủ điều kiện cho chuyến công tác nước ngoài đã được đăng lên bảng tin nội bộ.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1016,
    question: "Ten thousand dollars _______ allocated for updating the audiovisual equipment in conference room B.",
    options: [
      { label: 'A', text: 'were' },
      { label: 'B', text: 'are' },
      { label: 'C', text: 'was' },
      { label: 'D', text: 'have been' }
    ],
    correctAnswer: 'C',
    explanation: "Khoản tiền, khoảng cách, thời gian hoặc trọng lượng đóng vai trò là một khối tổng thể, động từ luôn chia số ít: 'was allocated'.",
    translation: "Mười nghìn đô la đã được phân bổ để nâng cấp thiết bị nghe nhìn trong phòng hội nghị B.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1017,
    question: "The director, along with several senior executives, _______ attending the global trade forum in Geneva.",
    options: [
      { label: 'A', text: 'is' },
      { label: 'B', text: 'are' },
      { label: 'C', text: 'were' },
      { label: 'D', text: 'have been' }
    ],
    correctAnswer: 'A',
    explanation: "Cấu trúc 'S1, along with / together with / as well as S2, + V': động từ chia theo S1 ('The director' là số ít -> chọn 'is').",
    translation: "Giám đốc, cùng với vài ủy viên điều hành cấp cao, đang tham dự diễn đàn thương mại toàn cầu tại Geneva.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1018,
    question: "Each of the maintenance technicians _______ completed the rigorous equipment certification program.",
    options: [
      { label: 'A', text: 'have' },
      { label: 'B', text: 'has' },
      { label: 'C', text: 'having' },
      { label: 'D', text: 'to have' }
    ],
    correctAnswer: 'B',
    explanation: "'Each of + N số nhiều' luôn đi với động từ số ít: 'has completed'.",
    translation: "Mỗi kỹ thuật viên bảo trì đều đã hoàn thành chương trình cấp chứng chỉ thiết bị nghiêm ngặt.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },

  // --- 3. LIÊN TỪ & GIỚI TỪ (CONJUNCTIONS & PREPOSITIONS) ---
  {
    id: 1019,
    question: "_______ the severe thunderstorm caused minor delays, the keynote speaker arrived on schedule.",
    options: [
      { label: 'A', text: 'Although' },
      { label: 'B', text: 'Despite' },
      { label: 'C', text: 'Because of' },
      { label: 'D', text: 'In spite of' }
    ],
    correctAnswer: 'A',
    explanation: "Phía sau là một mệnh đề hoàn chỉnh (S + V: 'the severe thunderstorm caused minor delays'), nên cần liên từ 'Although' (Mặc dù). 'Despite' và 'In spite of' đi với danh từ/V-ing.",
    translation: "Mặc dù cơn giông bão dữ dội đã gây ra một vài sự chậm trễ nhỏ, diễn giả chính vẫn đến đúng lịch trình.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1020,
    question: "_______ unexpected mechanical issues at the warehouse, delivery times will be extended by two business days.",
    options: [
      { label: 'A', text: 'Because' },
      { label: 'B', text: 'Due to' },
      { label: 'C', text: 'Since' },
      { label: 'D', text: 'Although' }
    ],
    correctAnswer: 'B',
    explanation: "Đằng sau là một cụm danh từ 'unexpected mechanical issues at the warehouse' (không có động từ chính) nên dùng giới từ chỉ nguyên nhân: 'Due to' (Do, bởi vì).",
    translation: "Do các sự cố cơ khí bất ngờ tại kho hàng, thời gian giao hàng sẽ bị kéo dài thêm 2 ngày làm việc.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1021,
    question: "Employees are not permitted to use company mobile devices for personal calls _______ work hours.",
    options: [
      { label: 'A', text: 'during' },
      { label: 'B', text: 'while' },
      { label: 'C', text: 'as' },
      { label: 'D', text: 'throughout of' }
    ],
    correctAnswer: 'A',
    explanation: "'During + Noun' (trong suốt khoảng thời gian nào): 'during work hours' (trong giờ làm việc). 'While' cần đi với một mệnh đề (S + V).",
    translation: "Nhân viên không được phép sử dụng thiết bị di động của công ty cho các cuộc gọi cá nhân trong giờ làm việc.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1022,
    question: "_______ entering the cleanroom facility, all researchers must wear sterile protective suits.",
    options: [
      { label: 'A', text: 'Prior to' },
      { label: 'B', text: 'Ahead' },
      { label: 'C', text: 'Former' },
      { label: 'D', text: 'Before of' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm 'Prior to + V-ing / Noun' mang nghĩa là 'Trước khi làm gì' (đồng nghĩa với 'Before').",
    translation: "Trước khi bước vào khu vực phòng sạch, tất cả các nhà nghiên cứu đều phải mặc bộ đồ bảo hộ vô trùng.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1023,
    question: "The newly negotiated contract is beneficial to _______ the software provider and the client firm.",
    options: [
      { label: 'A', text: 'either' },
      { label: 'B', text: 'both' },
      { label: 'C', text: 'neither' },
      { label: 'D', text: 'between' }
    ],
    correctAnswer: 'B',
    explanation: "Cặp liên từ tương quan 'both ... and ...' (cả hai bên ... và ...): 'beneficial to both the software provider and the client firm'.",
    translation: "Hợp đồng vừa được đàm phán mang lại lợi ích cho cả nhà cung cấp phần mềm lẫn công ty khách hàng.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1024,
    question: "The revised budget report must be delivered to executive management _______ Friday afternoon at 5:00 P.M.",
    options: [
      { label: 'A', text: 'until' },
      { label: 'B', text: 'by' },
      { label: 'C', text: 'for' },
      { label: 'D', text: 'within' }
    ],
    correctAnswer: 'B',
    explanation: "'By + mốc thời gian' mang nghĩa 'trước hoặc muộn nhất vào thời điểm đó' (dùng cho hạn chót deadline). Phân biệt với 'until' (kéo dài liên tục tới tận khi).",
    translation: "Báo cáo ngân sách sửa đổi phải được gửi tới ban điều hành muộn nhất vào 5 giờ chiều thứ Sáu.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1025,
    question: "_______ the CEO approves the proposal, our marketing team will launch the promotional campaign immediately.",
    options: [
      { label: 'A', text: 'Once' },
      { label: 'B', text: 'Soon' },
      { label: 'C', text: 'Already' },
      { label: 'D', text: 'Now' }
    ],
    correctAnswer: 'A',
    explanation: "'Once' đóng vai trò là liên từ chỉ thời gian mang nghĩa 'Một khi ...' (Once + S + V, S + will + V).",
    translation: "Một khi Tổng giám đốc phê duyệt đề xuất, đội ngũ tiếp thị của chúng tôi sẽ khởi động chiến dịch quảng bá ngay lập tức.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },

  // --- 4. MỆNH ĐỀ QUAN HỆ & RÚT GỌN (RELATIVE CLAUSES) ---
  {
    id: 1026,
    question: "The technician _______ repaired the manufacturing assembly line has over fifteen years of industrial experience.",
    options: [
      { label: 'A', text: 'which' },
      { label: 'B', text: 'who' },
      { label: 'C', text: 'whose' },
      { label: 'D', text: 'whom' }
    ],
    correctAnswer: 'B',
    explanation: "Đại từ quan hệ thay thế cho danh từ chỉ người 'The technician' đóng vai trò làm chủ ngữ của động từ 'repaired' -> dùng 'who'.",
    translation: "Người kỹ thuật viên đã sửa chữa dây chuyền lắp ráp sản xuất có hơn 15 năm kinh nghiệm trong ngành.",
    topicTitle: "Mệnh đề quan hệ (Relative Clauses)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1027,
    question: "Dr. Chen is the senior architect _______ blueprints were selected for the city library renovation project.",
    options: [
      { label: 'A', text: 'who' },
      { label: 'B', text: 'which' },
      { label: 'C', text: 'whose' },
      { label: 'D', text: 'that' }
    ],
    correctAnswer: 'C',
    explanation: "Đại từ quan hệ sở hữu 'whose + Noun': 'whose blueprints' (những bản thiết kế của kiến trúc sư đó).",
    translation: "Tiến sĩ Chen là kiến trúc sư cao cấp có các bản thiết kế được lựa chọn cho dự án cải tạo thư viện thành phố.",
    topicTitle: "Mệnh đề quan hệ (Relative Clauses)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1028,
    question: "The confidential documents _______ to the overseas branch were encrypted with state-of-the-art security software.",
    options: [
      { label: 'A', text: 'sent' },
      { label: 'B', text: 'send' },
      { label: 'C', text: 'sending' },
      { label: 'D', text: 'were sent' }
    ],
    correctAnswer: 'A',
    explanation: "Rút gọn mệnh đề quan hệ dạng bị động: 'documents (which were) sent to the overseas branch' -> rút gọn còn 'sent' (V3/ed). Động từ chính của câu là 'were encrypted'.",
    translation: "Các tài liệu mật được gửi đến chi nhánh nước ngoài đã được mã hóa bằng phần mềm bảo mật hiện đại nhất.",
    topicTitle: "Mệnh đề quan hệ (Relative Clauses)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1029,
    question: "Passengers _______ special seating accommodations should notify the gate agent at least thirty minutes prior to boarding.",
    options: [
      { label: 'A', text: 'require' },
      { label: 'B', text: 'requiring' },
      { label: 'C', text: 'required' },
      { label: 'D', text: 'are requiring' }
    ],
    correctAnswer: 'B',
    explanation: "Rút gọn mệnh đề quan hệ dạng chủ động: 'Passengers (who require) special seating accommodations' -> rút gọn thành V-ing: 'requiring'.",
    translation: "Hành khách cần sự sắp xếp chỗ ngồi đặc biệt nên thông báo cho nhân viên tại cửa khởi hành ít nhất 30 phút trước khi lên máy bay.",
    topicTitle: "Mệnh đề quan hệ (Relative Clauses)",
    category: "PART5_GRAMMAR"
  },

  // --- 5. ĐẠI TỪ & ĐẠI TỪ PHẢN THÂN (PRONOUNS) ---
  {
    id: 1030,
    question: "Mr. Alvarez inspected the newly installed heating apparatus _______ before authorizing final payment.",
    options: [
      { label: 'A', text: 'him' },
      { label: 'B', text: 'his' },
      { label: 'C', text: 'himself' },
      { label: 'D', text: 'he' }
    ],
    correctAnswer: 'C',
    explanation: "Đại từ phản thân 'himself' đứng sau tân ngữ để nhấn mạnh chính chủ thể (Mr. Alvarez tự mình trực tiếp làm hành động kiểm tra).",
    translation: "Đích thân ông Alvarez đã tự mình kiểm tra thiết bị sưởi mới lắp đặt trước khi phê duyệt thanh toán đợt cuối.",
    topicTitle: "Đại từ & Lượng từ (Pronouns)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1031,
    question: "The graphic design team finished the interactive presentation slides on _______ without external assistance.",
    options: [
      { label: 'A', text: 'their own' },
      { label: 'B', text: 'themselves' },
      { label: 'C', text: 'theirs' },
      { label: 'D', text: 'them' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm thành ngữ 'on one's own' (bằng chính sức mình, tự thân) = 'by themselves': 'on their own'.",
    translation: "Đội ngũ thiết kế đồ họa đã tự mình hoàn thành các slide thuyết trình tương tác mà không cần sự trợ giúp từ bên ngoài.",
    topicTitle: "Đại từ & Lượng từ (Pronouns)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1032,
    question: "All sales representatives should verify that _______ client contact records have been updated in the cloud CRM.",
    options: [
      { label: 'A', text: 'they' },
      { label: 'B', text: 'them' },
      { label: 'C', text: 'their' },
      { label: 'D', text: 'theirs' }
    ],
    correctAnswer: 'C',
    explanation: "Trước cụm danh từ 'client contact records' cần một tính từ sở hữu: 'their' (của họ).",
    translation: "Tất cả các đại diện bán hàng nên xác nhận rằng hồ sơ liên lạc khách hàng của họ đã được cập nhật trên hệ thống CRM đám mây.",
    topicTitle: "Đại từ & Lượng từ (Pronouns)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1033,
    question: "Our warranty policy provides better comprehensive coverage than _______ of our primary market competitor.",
    options: [
      { label: 'A', text: 'that' },
      { label: 'B', text: 'those' },
      { label: 'C', text: 'this' },
      { label: 'D', text: 'these' }
    ],
    correctAnswer: 'A',
    explanation: "Trong cấu trúc so sánh, dùng đại từ 'that' để thay thế cho danh từ số ít / không đếm được đã nhắc trước đó ('coverage'). Nếu là danh từ số nhiều thì dùng 'those'.",
    translation: "Chính sách bảo hành của chúng tôi cung cấp phạm vi bảo hiểm toàn diện tốt hơn so với chính sách của đối thủ cạnh tranh chính.",
    topicTitle: "Đại từ & Lượng từ (Pronouns)",
    category: "PART5_GRAMMAR"
  },

  // --- 6. CÂU BỊ ĐỘNG & ĐỘNG TỪ NGUYÊN MẪU / V-ING ---
  {
    id: 1034,
    question: "All expense reimbursement claims must be _______ by an authorized supervisor before being processed.",
    options: [
      { label: 'A', text: 'approve' },
      { label: 'B', text: 'approving' },
      { label: 'C', text: 'approved' },
      { label: 'D', text: 'approval' }
    ],
    correctAnswer: 'C',
    explanation: "Cấu trúc bị động với động từ khuyết thiếu: 'must be + V3/ed': 'approved' (phải được phê duyệt).",
    translation: "Tất cả các yêu cầu hoàn trả chi phí phải được phê duyệt bởi người giám sát có thẩm quyền trước khi xử lý.",
    topicTitle: "Thể bị động (Passive Voice)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1035,
    question: "The director suggested _______ the annual company retreat until fourth-quarter revenue targets are met.",
    options: [
      { label: 'A', text: 'postpone' },
      { label: 'B', text: 'postponing' },
      { label: 'C', text: 'to postpone' },
      { label: 'D', text: 'postponed' }
    ],
    correctAnswer: 'B',
    explanation: "Động từ 'suggest + V-ing' (gợi ý làm việc gì): 'suggested postponing' (đề xuất hoãn lại).",
    translation: "Giám đốc đã đề xuất hoãn chuyến nghỉ dưỡng thường niên của công ty cho đến khi đạt được mục tiêu doanh thu quý 4.",
    topicTitle: "Dạng động từ (Gerund & Infinitive)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1036,
    question: "The facilities manager arranged _______ extra security officers for the upcoming product launch event.",
    options: [
      { label: 'A', text: 'hire' },
      { label: 'B', text: 'hiring' },
      { label: 'C', text: 'to hire' },
      { label: 'D', text: 'hired' }
    ],
    correctAnswer: 'C',
    explanation: "Cấu trúc 'arrange + to V-inf' (thu xếp, sắp đặt để làm việc gì): 'arranged to hire'.",
    translation: "Quản lý cơ sở vật chất đã thu xếp để thuê thêm các nhân viên an ninh cho sự kiện ra mắt sản phẩm sắp tới.",
    topicTitle: "Dạng động từ (Gerund & Infinitive)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1037,
    question: "We look forward to _______ your representatives at the upcoming Pacific trade symposium next month.",
    options: [
      { label: 'A', text: 'meet' },
      { label: 'B', text: 'meeting' },
      { label: 'C', text: 'met' },
      { label: 'D', text: 'meeting of' }
    ],
    correctAnswer: 'B',
    explanation: "Cụm từ kinh điển trong TOEIC: 'look forward to + V-ing' (mong chờ, trông đợi làm điều gì): 'meeting'.",
    translation: "Chúng tôi rất mong đợi được gặp gỡ đại diện của quý vị tại hội nghị chuyên đề thương mại Thái Bình Dương vào tháng tới.",
    topicTitle: "Dạng động từ (Gerund & Infinitive)",
    category: "PART5_GRAMMAR"
  },

  // --- 7. CÂU ĐIỀU KIỆN & ĐẢO NGỮ (CONDITIONALS & INVERSION) ---
  {
    id: 1038,
    question: "_______ you require additional technical assistance, please do not hesitate to contact our 24/7 helpdesk.",
    options: [
      { label: 'A', text: 'Should' },
      { label: 'B', text: 'Were' },
      { label: 'C', text: 'Had' },
      { label: 'D', text: 'Unless' }
    ],
    correctAnswer: 'A',
    explanation: "Đảo ngữ câu điều kiện loại 1: 'Should + S + V-inf, (please) ...' thay cho 'If you require...'.",
    translation: "Nếu quý khách cần thêm sự hỗ trợ kỹ thuật, xin đừng ngần ngại liên hệ với bàn trợ giúp 24/7 của chúng tôi.",
    topicTitle: "Câu điều kiện & Đảo ngữ (Conditionals)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1039,
    question: "If the municipal council _______ the commercial zoning permit earlier, construction would have commenced last month.",
    options: [
      { label: 'A', text: 'grants' },
      { label: 'B', text: 'granted' },
      { label: 'C', text: 'had granted' },
      { label: 'D', text: 'was granting' }
    ],
    correctAnswer: 'C',
    explanation: "Mệnh đề chính dùng 'would have commenced' (điều kiện loại 3 - giả định trái ngược với quá khứ) -> mệnh đề If dùng thì quá khứ hoàn thành: 'had granted'.",
    translation: "Nếu hội đồng thành phố cấp giấy phép quy hoạch thương mại sớm hơn, việc xây dựng đã được bắt đầu từ tháng trước.",
    topicTitle: "Câu điều kiện & Đảo ngữ (Conditionals)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1040,
    question: "Hardly _______ the presentation begun when the audiovisual projector unexpectedly shut down.",
    options: [
      { label: 'A', text: 'had' },
      { label: 'B', text: 'did' },
      { label: 'C', text: 'was' },
      { label: 'D', text: 'has' }
    ],
    correctAnswer: 'A',
    explanation: "Cấu trúc đảo ngữ: 'Hardly had + S + V3/ed + when + S + V2/ed' (Vừa mới ... thì đã ...).",
    translation: "Bài thuyết trình vừa mới bắt đầu thì máy chiếu nghe nhìn đột ngột bị tắt nguồn.",
    topicTitle: "Câu điều kiện & Đảo ngữ (Conditionals)",
    category: "PART5_GRAMMAR"
  },

  // --- 8. SO SÁNH (COMPARISONS) ---
  {
    id: 1041,
    question: "The new automated warehouse system operates significantly _______ than the legacy model installed in 2018.",
    options: [
      { label: 'A', text: 'more efficiently' },
      { label: 'B', text: 'efficient' },
      { label: 'C', text: 'efficiency' },
      { label: 'D', text: 'most efficient' }
    ],
    correctAnswer: 'A',
    explanation: "Động từ 'operates' đi cùng 'than' đòi hỏi so sánh hơn của trạng từ: 'more efficiently'.",
    translation: "Hệ thống kho tự động mới hoạt động hiệu quả hơn đáng kể so với mẫu cũ được lắp đặt vào năm 2018.",
    topicTitle: "Cấu trúc so sánh (Comparisons)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1042,
    question: "Among all six candidates interviewed for the regional directorship, Mr. Vance was by far the _______ qualified.",
    options: [
      { label: 'A', text: 'more' },
      { label: 'B', text: 'most' },
      { label: 'C', text: 'much' },
      { label: 'D', text: 'greater' }
    ],
    correctAnswer: 'B',
    explanation: "Cấu trúc so sánh nhất với cụm 'by far the most + Adj' (vượt trội hơn hẳn trong tất cả).",
    translation: "Trong số tất cả 6 ứng viên được phỏng vấn cho vị trí giám đốc khu vực, ông Vance vượt trội hơn hẳn về trình độ năng lực.",
    topicTitle: "Cấu trúc so sánh (Comparisons)",
    category: "PART5_GRAMMAR"
  },

  // --- 9. TỪ VỰNG CÔNG SỞ & CỤM TỪ CỐ ĐỊNH (COLLOCATIONS & VOCABULARY) ---
  {
    id: 1043,
    question: "All manufacturing facilities must _______ strictly with state and federal environmental safety regulations.",
    options: [
      { label: 'A', text: 'comply' },
      { label: 'B', text: 'observe' },
      { label: 'C', text: 'follow' },
      { label: 'D', text: 'agree' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm động từ cố định 'comply with' (tuân thủ theo quy định/luật lệ). 'Observe' và 'follow' không đi với giới từ 'with'.",
    translation: "Tất cả các cơ sở sản xuất phải tuân thủ nghiêm ngặt các quy định an toàn môi trường của tiểu bang và liên bang.",
    topicTitle: "Cụm từ cố định (Collocations)",
    category: "PART5_VOCAB"
  },
  {
    id: 1044,
    question: "The engineering team worked overtime throughout the weekend in order to _______ the client deadline.",
    options: [
      { label: 'A', text: 'reach' },
      { label: 'B', text: 'meet' },
      { label: 'C', text: 'catch' },
      { label: 'D', text: 'gain' }
    ],
    correctAnswer: 'B',
    explanation: "Cụm từ kinh điển trong TOEIC: 'meet the deadline' (kịp thời hạn, đúng hạn chót).",
    translation: "Đội ngũ kỹ thuật đã làm việc ngoài giờ suốt dịp cuối tuần nhằm kịp thời hạn bàn giao cho khách hàng.",
    topicTitle: "Cụm từ cố định (Collocations)",
    category: "PART5_VOCAB"
  },
  {
    id: 1045,
    question: "Hotel guests are entitled to a _______ continental breakfast served daily from 6:30 A.M. to 10:00 A.M.",
    options: [
      { label: 'A', text: 'complimentary' },
      { label: 'B', text: 'compliment' },
      { label: 'C', text: 'complimented' },
      { label: 'D', text: 'complimenting' }
    ],
    correctAnswer: 'A',
    explanation: "'Complimentary' (tính từ) = free of charge (miễn phí, ưu đãi kèm theo): 'complimentary breakfast' (bữa sáng miễn phí).",
    translation: "Khách lưu trú tại khách sạn được hưởng bữa sáng kiểu Âu miễn phí phục vụ hàng ngày từ 6:30 đến 10:00 sáng.",
    topicTitle: "Từ vựng công sở (Vocabulary)",
    category: "PART5_VOCAB"
  },
  {
    id: 1046,
    question: "Payment must be received in full _______ thirty days of the date shown on the billing invoice.",
    options: [
      { label: 'A', text: 'within' },
      { label: 'B', text: 'during' },
      { label: 'C', text: 'between' },
      { label: 'D', text: 'while' }
    ],
    correctAnswer: 'A',
    explanation: "'Within + khoảng thời gian' mang nghĩa 'trong vòng / trong khoảng thời gian bao lâu': 'within thirty days'.",
    translation: "Khoản thanh toán phải được nhận đầy đủ trong vòng 30 ngày kể từ ngày ghi trên hóa đơn thanh toán.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1047,
    question: "The company will _______ the installation costs provided that the client signs a two-year service agreement.",
    options: [
      { label: 'A', text: 'waive' },
      { label: 'B', text: 'wave' },
      { label: 'C', text: 'waste' },
      { label: 'D', text: 'weigh' }
    ],
    correctAnswer: 'A',
    explanation: "'Waive' (động từ) mang nghĩa 'miễn trừ, bỏ qua (phí tổn, quyền lợi)': 'waive the installation costs' (miễn phí lắp đặt).",
    translation: "Công ty sẽ miễn phí chi phí lắp đặt với điều kiện khách hàng ký thỏa thuận dịch vụ thời hạn hai năm.",
    topicTitle: "Từ vựng công sở (Vocabulary)",
    category: "PART5_VOCAB"
  },
  {
    id: 1048,
    question: "Dr. Evans is widely _______ as one of the leading authorities in sustainable renewable energy.",
    options: [
      { label: 'A', text: 'recognized' },
      { label: 'B', text: 'recognition' },
      { label: 'C', text: 'recognize' },
      { label: 'D', text: 'recognizing' }
    ],
    correctAnswer: 'A',
    explanation: "Cấu trúc bị động: 'be widely recognized as' (được công nhận rộng rãi là...): 'is widely recognized'.",
    translation: "Tiến sĩ Evans được công nhận rộng rãi là một trong những chuyên gia hàng đầu về năng lượng tái tạo bền vững.",
    topicTitle: "Thể bị động (Passive Voice)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1049,
    question: "Despite initial budget constraints, the project was completed _______ on schedule and within financial limits.",
    options: [
      { label: 'A', text: 'both' },
      { label: 'B', text: 'either' },
      { label: 'C', text: 'neither' },
      { label: 'D', text: 'not only' }
    ],
    correctAnswer: 'A',
    explanation: "Cặp liên từ song song: 'both on schedule and within financial limits' (vừa đúng lịch trình vừa trong phạm vi tài chính).",
    translation: "Bất chấp những hạn chế ngân sách ban đầu, dự án đã được hoàn thành vừa đúng tiến độ vừa nằm trong giới hạn tài chính.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1050,
    question: "The revised employee handbook contains detailed guidelines _______ workplace safety and ethics protocols.",
    options: [
      { label: 'A', text: 'regarding' },
      { label: 'B', text: 'regard' },
      { label: 'C', text: 'regarded' },
      { label: 'D', text: 'regards' }
    ],
    correctAnswer: 'A',
    explanation: "'Regarding' là giới từ mang nghĩa 'về, liên quan đến' (= about / concerning): 'guidelines regarding workplace safety'.",
    translation: "Sổ tay nhân viên sửa đổi có chứa các hướng dẫn chi tiết liên quan đến các quy chuẩn đạo đức và an toàn nơi làm việc.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  }
];
