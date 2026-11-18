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
  },
  // --- 10. BỔ SUNG ĐỀ TOEIC PART 5 THỰC CHIẾN (1051 - 1080) ---
  {
    id: 1051,
    question: "The newly recruited software developer proved to be an _______ addition to our artificial intelligence lab.",
    options: [
      { label: 'A', text: 'asset' },
      { label: 'B', text: 'invaluable' },
      { label: 'C', text: 'invaluably' },
      { label: 'D', text: 'invalue' }
    ],
    correctAnswer: 'B',
    explanation: "Đứng sau mạo từ 'an' và trước danh từ 'addition' cần một tính từ bắt đầu bằng nguyên âm: 'invaluable' (vô giá, cực kỳ quý báu).",
    translation: "Nhà phát triển phần mềm mới được tuyển dụng đã chứng tỏ là một sự bổ sung vô giá cho phòng thí nghiệm trí tuệ nhân tạo của chúng tôi.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1052,
    question: "By the time the keynote speaker arrived, the event coordinators _______ distributing handouts to all attendees.",
    options: [
      { label: 'A', text: 'finish' },
      { label: 'B', text: 'are finishing' },
      { label: 'C', text: 'had finished' },
      { label: 'D', text: 'have finished' }
    ],
    correctAnswer: 'C',
    explanation: "Cấu trúc 'By the time + S + V2/ed (quá khứ đơn), S + had + V3/ed (quá khứ hoàn thành)': hành động phát tài liệu hoàn tất trước thời điểm diễn giả đến trong quá khứ.",
    translation: "Vào thời điểm diễn giả chính đến nơi, các điều phối viên sự kiện đã hoàn tất việc phát tài liệu cho toàn bộ người tham dự.",
    topicTitle: "Thì động từ (Tenses)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1053,
    question: "Mr. Henderson decided to delegate the project responsibilities _______ he could focus on business development.",
    options: [
      { label: 'A', text: 'so that' },
      { label: 'B', text: 'in order to' },
      { label: 'C', text: 'such that' },
      { label: 'D', text: 'as well as' }
    ],
    correctAnswer: 'A',
    explanation: "'So that + S + could/can + V' (để mà, nhằm mục đích): theo sau là một mệnh đề hoàn chỉnh. 'In order to' chỉ đi với V-infinitive.",
    translation: "Ông Henderson đã quyết định ủy quyền các trách nhiệm của dự án để ông có thể tập trung vào việc phát triển kinh doanh.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1054,
    question: "Neither the design drafts nor the structural prototype _______ ready for tomorrow morning's client presentation.",
    options: [
      { label: 'A', text: 'is' },
      { label: 'B', text: 'are' },
      { label: 'C', text: 'were' },
      { label: 'D', text: 'have' }
    ],
    correctAnswer: 'A',
    explanation: "'Neither S1 nor S2 + V': động từ chia theo S2 ('the structural prototype' là danh từ số ít -> chia 'is').",
    translation: "Cả các bản thảo thiết kế lẫn mẫu nguyên mẫu cấu trúc đều chưa sẵn sàng cho buổi thuyết trình khách hàng sáng mai.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1055,
    question: "All catering orders must be placed at least forty-eight hours _______ to guarantee prompt kitchen delivery.",
    options: [
      { label: 'A', text: 'in advance' },
      { label: 'B', text: 'forward' },
      { label: 'C', text: 'ahead of' },
      { label: 'D', text: 'beforehand of' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm trạng từ cố định đứng cuối câu chỉ thời gian: 'in advance' (trước): 'forty-eight hours in advance' (trước 48 giờ).",
    translation: "Tất cả các đơn đặt tiệc phải được đặt trước ít nhất 48 giờ để đảm bảo bếp giao hàng đúng giờ.",
    topicTitle: "Cụm từ cố định (Collocations)",
    category: "PART5_VOCAB"
  },
  {
    id: 1056,
    question: "The newly published quarterly report provides an in-depth _______ of emerging Southeast Asian market trends.",
    options: [
      { label: 'A', text: 'analyze' },
      { label: 'B', text: 'analyst' },
      { label: 'C', text: 'analytical' },
      { label: 'D', text: 'analysis' }
    ],
    correctAnswer: 'D',
    explanation: "Sau tính từ 'in-depth' (chuyên sâu) cần một danh từ: 'analysis' (bản phân tích). 'Analyst' là nhà phân tích (người).",
    translation: "Báo cáo hàng quý mới xuất bản cung cấp một bản phân tích chuyên sâu về các xu hướng thị trường Đông Nam Á mới nổi.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1057,
    question: "Employees are strongly advised to keep all travel receipts _______ they can be reimbursed promptly upon return.",
    options: [
      { label: 'A', text: 'so that' },
      { label: 'B', text: 'because of' },
      { label: 'C', text: 'in spite of' },
      { label: 'D', text: 'owing to' }
    ],
    correctAnswer: 'A',
    explanation: "Theo sau là mệnh đề chỉ mục đích (S + can + V): dùng liên từ 'so that' (để mà).",
    translation: "Nhân viên được khuyến cáo giữ lại toàn bộ hóa đơn đi lại để có thể được hoàn tiền nhanh chóng khi trở về.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1058,
    question: "The director _______ recommended that all marketing initiatives be reviewed by the compliance committee.",
    options: [
      { label: 'A', text: 'strong' },
      { label: 'B', text: 'strength' },
      { label: 'C', text: 'strongly' },
      { label: 'D', text: 'strengthen' }
    ],
    correctAnswer: 'C',
    explanation: "Đứng giữa chủ ngữ 'The director' và động từ chính 'recommended' cần trạng từ (Adv) bổ nghĩa: 'strongly' (một cách mạnh mẽ, kiên quyết).",
    translation: "Giám đốc đã khuyến nghị mạnh mẽ rằng tất cả các sáng kiến tiếp thị phải được ủy ban tuân thủ rà soát.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1059,
    question: "The factory equipment has functioned without any interruption _______ it was serviced last January.",
    options: [
      { label: 'A', text: 'since' },
      { label: 'B', text: 'for' },
      { label: 'C', text: 'during' },
      { label: 'D', text: 'while' }
    ],
    correctAnswer: 'A',
    explanation: "Mệnh đề chính dùng thì hiện tại hoàn thành ('has functioned'), vế sau là mốc thời gian quá khứ đơn ('it was serviced') -> dùng liên từ 'since' (kể từ khi).",
    translation: "Thiết bị nhà máy đã hoạt động mà không gặp bất kỳ sự gián đoạn nào kể từ khi được bảo dưỡng vào tháng 1 vừa qua.",
    topicTitle: "Thì động từ (Tenses)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1060,
    question: "Customers can obtain a complete refund provided they return the merchandise _______ thirty days of receipt.",
    options: [
      { label: 'A', text: 'within' },
      { label: 'B', text: 'among' },
      { label: 'C', text: 'between' },
      { label: 'D', text: 'during' }
    ],
    correctAnswer: 'A',
    explanation: "'Within + khoảng thời gian' mang nghĩa 'trong vòng': 'within thirty days of receipt' (trong vòng 30 ngày kể từ ngày nhận hàng).",
    translation: "Khách hàng có thể được hoàn tiền đầy đủ với điều kiện họ trả lại hàng hóa trong vòng 30 ngày kể từ khi nhận.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1061,
    question: "The corporate legal advisor warned that violating patent rights could result in _______ financial penalties.",
    options: [
      { label: 'A', text: 'severe' },
      { label: 'B', text: 'severely' },
      { label: 'C', text: 'severity' },
      { label: 'D', text: 'severest' }
    ],
    correctAnswer: 'A',
    explanation: "Đứng trước cụm danh từ 'financial penalties' cần một tính từ bổ nghĩa: 'severe' (nghiêm trọng, nặng nề).",
    translation: "Cố vấn pháp lý của công ty cảnh báo rằng việc vi phạm quyền bằng sáng chế có thể dẫn đến các hình phạt tài chính nặng nề.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1062,
    question: "The facility manager announced that the office cafeteria will remain _______ until sanitary inspections conclude.",
    options: [
      { label: 'A', text: 'close' },
      { label: 'B', text: 'closed' },
      { label: 'C', text: 'closing' },
      { label: 'D', text: 'closely' }
    ],
    correctAnswer: 'B',
    explanation: "Sau linking verb 'remain' cần tính từ mô tả trạng thái: 'closed' (bị đóng cửa).",
    translation: "Quản lý cơ sở vật chất thông báo rằng nhà ăn văn phòng sẽ tiếp tục đóng cửa cho đến khi các cuộc kiểm tra vệ sinh kết thúc.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1063,
    question: "The shipping department guarantees that international parcels will arrive _______ four business days.",
    options: [
      { label: 'A', text: 'within' },
      { label: 'B', text: 'along' },
      { label: 'C', text: 'toward' },
      { label: 'D', text: 'until' }
    ],
    correctAnswer: 'A',
    explanation: "'Within four business days' (trong vòng 4 ngày làm việc) chỉ thời hạn tối đa.",
    translation: "Bộ phận giao vận bảo đảm rằng các bưu kiện quốc tế sẽ đến nơi trong vòng 4 ngày làm việc.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1064,
    question: "Mr. Kowalski was commended for his ability to solve intricate software problems _______.",
    options: [
      { label: 'A', text: 'effective' },
      { label: 'B', text: 'effectiveness' },
      { label: 'C', text: 'effectively' },
      { label: 'D', text: 'effect' }
    ],
    correctAnswer: 'C',
    explanation: "Bổ nghĩa cho cụm động từ 'solve intricate software problems' cần trạng từ: 'effectively' (một cách hiệu quả).",
    translation: "Ông Kowalski được khen ngợi vì khả năng giải quyết các vấn đề phần mềm phức tạp một cách hiệu quả.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1065,
    question: "The new transit system is designed to provide residents with _______ access to downtown business districts.",
    options: [
      { label: 'A', text: 'convenient' },
      { label: 'B', text: 'conveniently' },
      { label: 'C', text: 'convenience' },
      { label: 'D', text: 'convening' }
    ],
    correctAnswer: 'A',
    explanation: "Bổ nghĩa cho danh từ không đếm được 'access' (sự tiếp cận) cần tính từ: 'convenient' (tiện lợi).",
    translation: "Hệ thống giao thông công cộng mới được thiết kế nhằm mang lại cho cư dân khả năng tiếp cận thuận tiện đến các khu thương mại trung tâm.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1066,
    question: "_______ the project manager approves the revised budget, the procurement team will place the hardware order.",
    options: [
      { label: 'A', text: 'As soon as' },
      { label: 'B', text: 'In spite of' },
      { label: 'C', text: 'In order that' },
      { label: 'D', text: 'Except for' }
    ],
    correctAnswer: 'A',
    explanation: "Liên từ chỉ thời gian 'As soon as + S + V(hiện tại đơn), S + will + V': Ngay khi...",
    translation: "Ngay sau khi quản lý dự án phê duyệt ngân sách điều chỉnh, đội mua sắm sẽ tiến hành đặt hàng thiết bị phần cứng.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1067,
    question: "The supervisor asked all technicians to double-check their safety gear before _______ the wind turbine tower.",
    options: [
      { label: 'A', text: 'climb' },
      { label: 'B', text: 'climbed' },
      { label: 'C', text: 'climbing' },
      { label: 'D', text: 'climber' }
    ],
    correctAnswer: 'C',
    explanation: "Sau giới từ 'before' động từ phải ở dạng V-ing: 'climbing'.",
    translation: "Người giám sát đã yêu cầu tất cả kỹ thuật viên kiểm tra kỹ thiết bị bảo hộ trước khi leo lên trụ tua bin gió.",
    topicTitle: "Dạng động từ (Gerund & Infinitive)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1068,
    question: "The new regional sales headquarters is _______ located near the central metropolitan railway terminal.",
    options: [
      { label: 'A', text: 'convenient' },
      { label: 'B', text: 'convenience' },
      { label: 'C', text: 'conveniently' },
      { label: 'D', text: 'more convenient' }
    ],
    correctAnswer: 'C',
    explanation: "Cụm từ quen thuộc trong TOEIC: 'be conveniently located' (tọa lạc ở vị trí vô cùng thuận tiện): trạng từ 'conveniently' đứng trước tính từ 'located'.",
    translation: "Trụ sở bán hàng khu vực mới tọa lạc ở vị trí rất thuận lợi gần ga đường sắt trung tâm đô thị.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1069,
    question: "The research and development department spent _______ months refining the bio-sensor prototype.",
    options: [
      { label: 'A', text: 'several' },
      { label: 'B', text: 'much' },
      { label: 'C', text: 'every' },
      { label: 'D', text: 'each' }
    ],
    correctAnswer: 'A',
    explanation: "'Months' là danh từ đếm được số nhiều nên đi cùng lượng từ 'several' (vài, một số). 'Much' đi với N không đếm được, 'every' và 'each' đi với N số ít.",
    translation: "Phòng nghiên cứu và phát triển đã dành ra vài tháng để hoàn thiện mẫu cảm biến sinh học nguyên mẫu.",
    topicTitle: "Đại từ & Lượng từ (Pronouns)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1070,
    question: "The human resources director expects all department heads to submit their annual evaluations _______ time.",
    options: [
      { label: 'A', text: 'on' },
      { label: 'B', text: 'at' },
      { label: 'C', text: 'in' },
      { label: 'D', text: 'with' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm từ cố định: 'on time' (đúng giờ, đúng lịch đã định). Phân biệt với 'in time' (kịp lúc, trước khi quá muộn).",
    translation: "Giám đốc nhân sự kỳ vọng tất cả trưởng bộ phận sẽ nộp bản đánh giá hàng năm của họ đúng hạn.",
    topicTitle: "Cụm từ cố định (Collocations)",
    category: "PART5_VOCAB"
  },
  {
    id: 1071,
    question: "Neither the flight attendants nor the captain _______ aware of the sudden schedule alteration.",
    options: [
      { label: 'A', text: 'were' },
      { label: 'B', text: 'was' },
      { label: 'C', text: 'are' },
      { label: 'D', text: 'have been' }
    ],
    correctAnswer: 'B',
    explanation: "Quy tắc 'Neither S1 nor S2 + V': động từ chia theo S2 ('the captain' số ít trong quá khứ -> 'was').",
    translation: "Cả các tiếp viên hàng không lẫn cơ trưởng đều không biết về sự thay đổi lịch trình đột ngột.",
    topicTitle: "Hòa hợp chủ vị (Subject-Verb Agreement)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1072,
    question: "Please handle this fragile electronic testing apparatus with extreme _______ during transport.",
    options: [
      { label: 'A', text: 'care' },
      { label: 'B', text: 'careful' },
      { label: 'C', text: 'carefully' },
      { label: 'D', text: 'caring' }
    ],
    correctAnswer: 'A',
    explanation: "Sau giới từ 'with' và tính từ 'extreme' cần danh từ: 'care' (sự cẩn trọng): 'with extreme care' (với sự hết sức cẩn thận).",
    translation: "Xin vui lòng xử lý thiết bị thử nghiệm điện tử dễ vỡ này với sự hết sức cẩn trọng trong suốt quá trình vận chuyển.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1073,
    question: "The keynote speaker will discuss innovative strategies for _______ brand visibility in international markets.",
    options: [
      { label: 'A', text: 'enhance' },
      { label: 'B', text: 'enhancing' },
      { label: 'C', text: 'enhancement' },
      { label: 'D', text: 'enhanced' }
    ],
    correctAnswer: 'B',
    explanation: "Sau giới từ 'for' có tân ngữ phía sau ('brand visibility') nên phải dùng danh động từ (Gerund V-ing): 'enhancing'.",
    translation: "Diễn giả chính sẽ thảo luận về các chiến lược đổi mới nhằm nâng cao mức độ hiện diện thương hiệu trên thị trường quốc tế.",
    topicTitle: "Dạng động từ (Gerund & Infinitive)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1074,
    question: "The corporate merger will not proceed _______ final approval is granted by international regulatory authorities.",
    options: [
      { label: 'A', text: 'unless' },
      { label: 'B', text: 'despite' },
      { label: 'C', text: 'without' },
      { label: 'D', text: 'instead of' }
    ],
    correctAnswer: 'A',
    explanation: "'Unless + S + V' (trừ khi / nếu không): liên từ dẫn dắt một mệnh đề điều kiện mang nghĩa phủ định. 'Without' và 'despite' là giới từ chỉ đi với cụm danh từ.",
    translation: "Thương vụ sáp nhập doanh nghiệp sẽ không được tiến hành trừ khi sự phê duyệt cuối cùng được cấp bởi các cơ quan quản lý quốc tế.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1075,
    question: "The customer support hotline is operated _______ by bilingual representatives to assist international travelers.",
    options: [
      { label: 'A', text: 'entire' },
      { label: 'B', text: 'entirely' },
      { label: 'C', text: 'entirety' },
      { label: 'D', text: 'entiring' }
    ],
    correctAnswer: 'B',
    explanation: "Đứng giữa 'is' và 'operated' (dạng bị động) cần trạng từ (Adv) bổ nghĩa: 'entirely' (hoàn toàn).",
    translation: "Đường dây nóng hỗ trợ khách hàng được vận hành hoàn toàn bởi các đại diện song ngữ nhằm hỗ trợ du khách quốc tế.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1076,
    question: "Only employees with valid cryptographic security badges may gain _______ to the mainframe computer server vault.",
    options: [
      { label: 'A', text: 'admit' },
      { label: 'B', text: 'admittance' },
      { label: 'C', text: 'admitted' },
      { label: 'D', text: 'admissibly' }
    ],
    correctAnswer: 'B',
    explanation: "Sau ngoại động từ 'gain' cần một danh từ tân ngữ: 'admittance' (sự cho phép vào, quyền vào). 'Gain admittance to': được phép bước vào.",
    translation: "Chỉ những nhân viên có thẻ an ninh mật mã hợp lệ mới được phép vào hầm máy chủ điện toán trung tâm.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1077,
    question: "The director was _______ impressed by the high caliber of applications submitted for the research residency.",
    options: [
      { label: 'A', text: 'favor' },
      { label: 'B', text: 'favorable' },
      { label: 'C', text: 'favorably' },
      { label: 'D', text: 'favorite' }
    ],
    correctAnswer: 'C',
    explanation: "Đứng trước tính từ bị động 'impressed' cần trạng từ bổ nghĩa: 'favorably' (một cách tích cực, đầy thiện cảm). Cụm 'favorably impressed' rất phổ biến trong TOEIC.",
    translation: "Giám đốc đã có ấn tượng rất tốt trước trình độ xuất sắc của các hồ sơ ứng tuyển nộp cho chương trình nghiên cứu lưu trú.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1078,
    question: "The executive committee decided to _______ the launch of the electric vehicle model until spring.",
    options: [
      { label: 'A', text: 'defer' },
      { label: 'B', text: 'deferral' },
      { label: 'C', text: 'deferring' },
      { label: 'D', text: 'deferred' }
    ],
    correctAnswer: 'A',
    explanation: "'Decide to + V-inf': cần động từ nguyên mẫu 'defer' (hoãn lại, lùi thời điểm).",
    translation: "Ủy ban điều hành đã quyết định lùi thời điểm ra mắt mẫu xe điện cho đến mùa xuân.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1079,
    question: "The accounting firm implemented new digital protocols to safeguard sensitive client _______ from cyber threats.",
    options: [
      { label: 'A', text: 'inform' },
      { label: 'B', text: 'information' },
      { label: 'C', text: 'informative' },
      { label: 'D', text: 'informatively' }
    ],
    correctAnswer: 'B',
    explanation: "Sau cụm tính từ 'sensitive client' cần danh từ: 'information' (thông tin - danh từ không đếm được).",
    translation: "Công ty kế toán đã áp dụng các giao thức số mới nhằm bảo vệ thông tin khách hàng nhạy cảm trước các mối đe dọa không gian mạng.",
    topicTitle: "Từ loại (Word Form)",
    category: "PART5_GRAMMAR"
  },
  {
    id: 1080,
    question: "The warranty covers mechanical repairs _______ that the vehicle was serviced exclusively at certified dealerships.",
    options: [
      { label: 'A', text: 'provided' },
      { label: 'B', text: 'unless' },
      { label: 'C', text: 'as if' },
      { label: 'D', text: 'suppose' }
    ],
    correctAnswer: 'A',
    explanation: "Cụm liên từ điều kiện 'provided that / providing that' mang nghĩa 'với điều kiện là / miễn là' (= as long as / if).",
    translation: "Bảo hành sẽ chi trả cho các sửa chữa cơ khí với điều kiện là chiếc xe được bảo dưỡng độc quyền tại các đại lý được chứng nhận.",
    topicTitle: "Liên từ & Giới từ (Conjunctions & Preps)",
    category: "PART5_GRAMMAR"
  }
];
