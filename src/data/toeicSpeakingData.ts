export interface SpeakingQuestion {
  id: string;
  testId: string;
  testName: string;
  part: 1 | 2 | 3 | 4 | 5;
  partTitle: string;
  questionNumber: number; // 1 to 11
  directionsVi: string;
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  promptText: string;
  targetScript?: string; // Cho Part 1
  imageUrl?: string; // Cho Part 2 & Part 4
  tableData?: { [key: string]: string }[]; // Cho Part 4
  keywords?: string[];
  modelAnswer: string;
  tipsVi: string[];
}

export interface ToeicSwTestCombo {
  id: string;
  code: string;
  name: string;
  badge: string;
  difficulty: "Cơ Bản" | "Tiêu Chuẩn ETS" | "Nâng Cao";
  description: string;
  speakingTestId: string;
  writingTestId: string;
}

export const TOEIC_SW_TEST_COMBOS: ToeicSwTestCombo[] = [
  {
    id: "study4-sw-01",
    code: "S4-SW-01",
    name: "STUDY4 Practice Test 01",
    badge: "Đề Quốc Tế",
    difficulty: "Tiêu Chuẩn ETS",
    description: "Bộ đề mô phỏng kỳ thi TOEIC 4 kỹ năng chính thức số 1: Thông báo chuyến bay, tranh văn phòng, lịch hội thảo, khiếu nại giao hàng & luận 300 từ Remote Work.",
    speakingTestId: "study4-sp-01",
    writingTestId: "study4-wr-01"
  },
  {
    id: "study4-sw-02",
    code: "S4-SW-02",
    name: "STUDY4 Practice Test 02",
    badge: "Mới Cập Nhật",
    difficulty: "Tiêu Chuẩn ETS",
    description: "Bộ đề số 2 chủ đề Môi trường làm việc: Nâng cấp server IT, tranh siêu thị & thư viện, email gala dinner & luận 300 từ Teamwork vs Solo.",
    speakingTestId: "study4-sp-02",
    writingTestId: "study4-wr-02"
  },
  {
    id: "study4-sw-03",
    code: "S4-SW-03",
    name: "STUDY4 Practice Test 03",
    badge: "Mục Tiêu 180+",
    difficulty: "Nâng Cao",
    description: "Bộ đề số 3 thử thách phản xạ đàm phán: Dịch vụ khách hàng, tranh kho bãi logistics, lịch công tác, bồi thường hàng vỡ & luận Đào tạo nhân viên.",
    speakingTestId: "study4-sp-03",
    writingTestId: "study4-wr-03"
  },
  {
    id: "study4-sw-04",
    code: "S4-SW-04",
    name: "STUDY4 Practice Test 04",
    badge: "Dự Án & Marketing",
    difficulty: "Tiêu Chuẩn ETS",
    description: "Bộ đề số 4 chuyên đề Marketing & Dự án: Thông báo hội nghị công nghệ, tranh nhà kho & khán phòng, lịch đào tạo kỹ năng & luận Teambuilding cuối tuần.",
    speakingTestId: "study4-sp-04",
    writingTestId: "study4-wr-04"
  },
  {
    id: "study4-sw-05",
    code: "S4-SW-05",
    name: "STUDY4 Practice Test 05",
    badge: "Thử Thách 200",
    difficulty: "Nâng Cao",
    description: "Bộ đề số 5 cấp độ Thách Đấu: Đổi cổng bay sân bay quốc tế, đàm phán cung ứng vật tư, lịch hội nghị lãnh đạo & luận Đánh giá hiệu suất nhân sự.",
    speakingTestId: "study4-sp-05",
    writingTestId: "study4-wr-05"
  }
];

export const TOEIC_SPEAKING_TESTS = [
  { id: "study4-sp-01", name: "STUDY4 Practice Test 01 (ETS Authentic)", desc: "11 câu chuẩn format thi thật ETS 20 phút", badge: "Đề Hot" },
  { id: "study4-sp-02", name: "STUDY4 Practice Test 02 (ETS Công Sở)", desc: "Chủ đề hội họp, giao tiếp khách hàng & lịch trình", badge: "Mới Cập Nhật" },
  { id: "study4-sp-03", name: "STUDY4 Practice Test 03 (ETS Nâng Cao)", desc: "Thử thách phản xạ nhanh & lập luận thuyết phục", badge: "Mục Tiêu 180+" },
  { id: "study4-sp-04", name: "STUDY4 Practice Test 04 (Marketing & Dự Án)", desc: "Chiến dịch truyền thông, hội thảo công nghệ & phản biện", badge: "ETS Chuẩn" },
  { id: "study4-sp-05", name: "STUDY4 Practice Test 05 (Đàm Phán & Nhân Sự)", desc: "Hội nghị cấp cao, quản trị nhân sự & lập luận 60s", badge: "Thử Thách 200" },
];

export const TOEIC_SPEAKING_PARTS = [
  { id: 1, name: "Part 1: Đọc to đoạn văn", desc: "Read a text aloud (Câu 1 - 2)", icon: "📢" },
  { id: 2, name: "Part 2: Miêu tả bức tranh", desc: "Describe a picture (Câu 3 - 4)", icon: "🖼️" },
  { id: 3, name: "Part 3: Trả lời câu hỏi ngắn", desc: "Respond to questions (Câu 5 - 7)", icon: "💬" },
  { id: 4, name: "Part 4: Trả lời theo lịch trình", desc: "Using information provided (Câu 8 - 10)", icon: "📋" },
  { id: 5, name: "Part 5: Bày tỏ quan điểm", desc: "Express an opinion (Câu 11)", icon: "💡" },
];

export const TOEIC_SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  // ==========================================
  // STUDY4 PRACTICE TEST 01 (11 CÂU)
  // ==========================================
  {
    id: "sp-t1-q1",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Thông báo sân bay)",
    questionNumber: 1,
    directionsVi: "Đọc to đoạn văn sau đây thật rõ ràng và tự nhiên. Chú ý ngắt nghỉ đúng dấu câu, phát âm chuẩn các âm đuôi /s/, /t/, /d/.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the airport announcement aloud as clearly and naturally as possible.",
    targetScript: "Attention passengers on flight QA-402 with service to Chicago. Your departure gate has been changed from Gate B-12 to Gate C-18. Boarding will begin in approximately fifteen minutes. Please have your boarding passes and photo identification ready for inspection at the gate.",
    modelAnswer: "Attention passengers on flight QA-402 with service to Chicago. Your departure gate has been changed from Gate B-12 to Gate C-18. Boarding will begin in approximately fifteen minutes. Please have your boarding passes and photo identification ready for inspection at the gate.",
    tipsVi: [
      "Ngắt giọng ngắn tại dấu phẩy: '...Chicago', '...B-12'",
      "Lên giọng ở các danh từ liệt kê: 'boarding passes ↗' và xuống giọng ở từ cuối: 'photo identification ready ↘'",
      "Chú ý phát âm rõ âm đuôi /z/ ở 'passengers', 'passes', /ʃn/ ở 'inspection'"
    ]
  },
  {
    id: "sp-t1-q2",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Quảng cáo khuyến mãi)",
    questionNumber: 2,
    directionsVi: "Đọc to đoạn quảng cáo cửa hàng với ngữ điệu hào hứng, thân thiện và chào đón khách hàng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the promotional broadcast aloud with an enthusiastic and professional tone.",
    targetScript: "Welcome to Westfield Department Store's annual spring sale! Today only, enjoy discounts of up to fifty percent on selected kitchenware, designer clothing, and home electronics. Don't forget to visit our customer service desk on the second floor to receive your complimentary membership card.",
    modelAnswer: "Welcome to Westfield Department Store's annual spring sale! Today only, enjoy discounts of up to fifty percent on selected kitchenware, designer clothing, and home electronics. Don't forget to visit our customer service desk on the second floor to receive your complimentary membership card.",
    tipsVi: [
      "Thể hiện ngữ điệu tươi vui, nồng nhiệt ở câu mở đầu: 'Welcome to Westfield...!'",
      "Liệt kê 3 món đồ: 'kitchenware ↗, designer clothing ↗, and home electronics ↘'",
      "Nhấn trọng âm từ 'complimentary' (/kɒm.plɪˈmen.tər.i/) và 'electronics'"
    ]
  },
  {
    id: "sp-t1-q3",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 2,
    partTitle: "Part 2: Describe a picture (Văn phòng làm việc)",
    questionNumber: 3,
    directionsVi: "Quan sát bức tranh văn phòng làm việc. Miêu tả chi tiết trong 30 giây: địa điểm, nhân vật trung tâm, hành động và hậu cảnh.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_01.jpg",
    modelAnswer: "This picture was taken in a modern open-plan office. In the center, a man wearing a crisp white dress shirt is actively typing on his computer keyboard while looking at two monitors. Next to him, a female colleague in a dark blazer is reviewing paperwork with a blue pen. In the background, large glass windows let in plenty of natural sunlight. Overall, the atmosphere seems quiet, highly focused, and productive.",
    tipsVi: [
      "Áp dụng Công thức 4 bước chuẩn ETS: 1. Địa điểm -> 2. Người ở trung tâm -> 3. Đồ vật bên cạnh -> 4. Bầu không khí.",
      "Dùng thì Hiện tại tiếp diễn: 'is actively typing', 'is reviewing paperwork'."
    ]
  },
  {
    id: "sp-t1-q4",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 2,
    partTitle: "Part 2: Describe a picture (Phòng họp thảo luận)",
    questionNumber: 4,
    directionsVi: "Miêu tả buổi thảo luận nhóm quanh bàn tròn. Chú ý tư thế, đồ vật trên bàn và sự tương tác giữa các đồng nghiệp.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_02.jpg",
    modelAnswer: "This picture shows a group of business professionals having a meeting around a conference table. In the foreground, a woman with long hair is gesturing with her hands as she explains an idea, and the others are listening attentively. On the wooden table, there are several open laptops, notebooks, and ceramic coffee mugs. The room is brightly illuminated, and everyone appears very engaged in the discussion.",
    tipsVi: [
      "Dùng cụm vị trí: 'In the foreground', 'On the wooden table', 'In the center'."
    ]
  },
  {
    id: "sp-t1-q5",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 3,
    partTitle: "Part 3: Respond to questions (Mua sắm cá nhân)",
    questionNumber: 5,
    directionsVi: "Trả lời câu hỏi trong 15 giây: Bạn thường mua sắm quần áo ở đâu và tần suất như thế nào?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Where do you usually go shopping for clothes, and how often do you go?",
    modelAnswer: "I usually shop for clothes at local shopping malls like Vincom about once or twice a month, especially when they have seasonal sales.",
    tipsVi: [
      "Trả lời trực tiếp 2 vế: Địa điểm (local shopping malls) + Tần suất (once or twice a month)."
    ]
  },
  {
    id: "sp-t1-q6",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 3,
    partTitle: "Part 3: Respond to questions (Người đi mua sắm cùng)",
    questionNumber: 6,
    directionsVi: "Trả lời câu hỏi trong 15 giây: Bạn thích đi mua sắm một mình hay đi cùng bạn bè?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Do you prefer to shop alone or with friends? Why?",
    modelAnswer: "I prefer shopping with friends because they can give me honest feedback on what looks best on me, and it makes the whole experience much more fun and relaxing.",
    tipsVi: [
      "Nêu rõ sở thích + 1 lý do thuyết phục: 'gives me honest feedback'."
    ]
  },
  {
    id: "sp-t1-q7",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 3,
    partTitle: "Part 3: Respond to questions (Mua sắm Online vs Trực tiếp)",
    questionNumber: 7,
    directionsVi: "Trả lời câu hỏi chi tiết trong 30 giây: Theo bạn, yếu tố quan trọng nhất khi chọn một trang mua sắm trực tuyến là gì?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "What is the most important factor for you when choosing an online shopping website? Explain why.",
    modelAnswer: "For me, the most crucial factor is definitely fast and reliable shipping, combined with authentic customer reviews. When I order items online, I want to receive them quickly without damage, and reading honest reviews from other verified buyers helps me ensure the product quality matches the description.",
    tipsVi: [
      "Phân tích 2 góc độ: Giao hàng nhanh (reliable shipping) + Đánh giá chân thực (authentic reviews)."
    ]
  },
  {
    id: "sp-t1-q8",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 4,
    partTitle: "Part 4: Using Information (Lịch trình hội nghị - Khai mạc)",
    questionNumber: 8,
    directionsVi: "Đọc lịch trình hội thảo công nghệ. Trả lời câu hỏi 15s qua điện thoại của người tham dự.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "Could you tell me what time the conference starts and what the first session will be about?",
    imageUrl: "/images/part1/p1_07.jpg",
    tableData: [
      { "Thời gian": "09:00 AM - 10:15 AM", "Nội dung": "Opening Keynote: Next-Gen AI in E-commerce", "Diễn giả / Địa điểm": "Dr. Sarah Jenkins • Grand Ballroom" },
      { "Thời gian": "10:30 AM - 12:00 PM", "Nội dung": "Workshop: Cloud Infrastructure Scalability", "Diễn giả / Địa điểm": "Mark Evans • Room 204" },
      { "Thời gian": "12:00 PM - 01:30 PM", "Nội dung": "Networking Lunch & Exhibition Booths", "Diễn giả / Địa điểm": "Dining Hall (Level 2)" },
      { "Thời gian": "01:30 PM - 03:00 PM", "Nội dung": "Panel: Cybersecurity in Modern FinTech", "Diễn giả / Địa điểm": "Expert Panel • Room 301" }
    ],
    modelAnswer: "Certainly! The conference starts at 9:00 AM with the opening keynote on 'Next-Gen AI in E-commerce', delivered by Dr. Sarah Jenkins in the Grand Ballroom.",
    tipsVi: [
      "Bắt đầu lịch sự: 'Certainly!' hoặc 'Sure!'",
      "Nêu rõ giờ (9:00 AM) + chủ đề + người thuyết trình."
    ]
  },
  {
    id: "sp-t1-q9",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 4,
    partTitle: "Part 4: Using Information (Xác nhận thông tin sai)",
    questionNumber: 9,
    directionsVi: "Trả lời câu hỏi 15s để đính chính lại thông tin mà người gọi đang hiểu lầm.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "I heard that lunch is scheduled for 1:30 PM, is that right?",
    imageUrl: "/images/part1/p1_07.jpg",
    tableData: [
      { "Thời gian": "09:00 AM - 10:15 AM", "Nội dung": "Opening Keynote: Next-Gen AI in E-commerce", "Diễn giả / Địa điểm": "Dr. Sarah Jenkins • Grand Ballroom" },
      { "Thời gian": "10:30 AM - 12:00 PM", "Nội dung": "Workshop: Cloud Infrastructure Scalability", "Diễn giả / Địa điểm": "Mark Evans • Room 204" },
      { "Thời gian": "12:00 PM - 01:30 PM", "Nội dung": "Networking Lunch & Exhibition Booths", "Diễn giả / Địa điểm": "Dining Hall (Level 2)" }
    ],
    modelAnswer: "No, actually that information is incorrect. The networking lunch is scheduled from 12:00 PM to 1:30 PM in the Dining Hall on Level 2.",
    tipsVi: [
      "Đính chính nhẹ nhàng: 'No, actually that information is incorrect...'"
    ]
  },
  {
    id: "sp-t1-q10",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 4,
    partTitle: "Part 4: Using Information (Liệt kê tất cả các buổi chiều)",
    questionNumber: 10,
    directionsVi: "Trả lời câu hỏi trong 30 giây: Liệt kê chi tiết các hoạt động diễn ra sau buổi trưa.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Could you give me all the details about the sessions scheduled in the afternoon?",
    imageUrl: "/images/part1/p1_07.jpg",
    tableData: [
      { "Thời gian": "01:30 PM - 03:00 PM", "Nội dung": "Panel: Cybersecurity in Modern FinTech", "Diễn giả / Địa điểm": "Expert Panel • Room 301" },
      { "Thời gian": "03:15 PM - 04:30 PM", "Nội dung": "Closing Q&A and Certificate Awarding", "Diễn giả / Địa điểm": "Organizing Committee • Grand Ballroom" }
    ],
    modelAnswer: "Yes, there are two sessions scheduled for the afternoon. First, from 1:30 PM to 3:00 PM, there is a panel discussion on Cybersecurity in Modern FinTech held in Room 301. Second, from 3:15 PM to 4:30 PM, the Closing Q&A and Certificate Awarding session will take place in the Grand Ballroom.",
    tipsVi: [
      "Dùng cấu trúc đếm: 'Yes, there are two sessions scheduled... First,... Second,...'"
    ]
  },
  {
    id: "sp-t1-q11",
    testId: "study4-sp-01",
    testName: "STUDY4 Practice Test 01",
    part: 5,
    partTitle: "Part 5: Express an Opinion (Làm việc từ xa vs Văn phòng)",
    questionNumber: 11,
    directionsVi: "Bày tỏ quan điểm của bạn trong 60 giây (45s chuẩn bị): Làm việc từ xa (Work from home) hay làm tại văn phòng có lợi hơn?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Do you think working from home offers more benefits than working in a traditional office? Give specific reasons and examples to support your opinion.",
    modelAnswer: "In my opinion, working from home provides significantly more benefits than working in a traditional office. Firstly, it eliminates the daily commute, allowing employees to save considerable time, energy, and transportation expenses. For instance, rather than spending two hours stuck in traffic every day, workers can allocate that time to family, exercise, or completing urgent tasks. Secondly, remote work offers greater flexibility and autonomy, which often leads to higher job satisfaction and improved mental well-being. Although office interactions are valuable, modern digital tools like Zoom and Slack make communication seamless. Therefore, I strongly believe that remote work is a far more advantageous model.",
    tipsVi: [
      "Dàn bài 4 phần: 1. Khẳng định lập trường -> 2. Lý do 1 + Ví dụ -> 3. Lý do 2 + Phân tích -> 4. Kết luận ngắn."
    ]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 02 (11 CÂU)
  // ==========================================
  {
    id: "sp-t2-q1",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Thông báo công ty)",
    questionNumber: 1,
    directionsVi: "Đọc to thông báo nội bộ công ty về việc nâng cấp phần mềm an ninh mạng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the corporate announcement aloud with clarity and accurate pauses.",
    targetScript: "Good morning team. This is a reminder that our IT department will be performing critical server upgrades tonight between 10 PM and 2 AM. During this period, remote access to email, internal files, and database servers will be temporarily unavailable. Please make sure to save all work-in-progress before 9:30 PM.",
    modelAnswer: "Good morning team. This is a reminder that our IT department will be performing critical server upgrades tonight between 10 PM and 2 AM. During this period, remote access to email, internal files, and database servers will be temporarily unavailable. Please make sure to save all work-in-progress before 9:30 PM.",
    tipsVi: [
      "Ngắt nghỉ rõ ràng: 'Good morning team.', 'between 10 PM and 2 AM.'",
      "Liệt kê lên xuống giọng: 'email ↗, internal files ↗, and database servers ↘'."
    ]
  },
  {
    id: "sp-t2-q2",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Hướng dẫn du lịch bảo tàng)",
    questionNumber: 2,
    directionsVi: "Đọc to đoạn chào mừng khách tham quan tại bảo tàng nghệ thuật.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the museum tour guide introduction aloud with a friendly and clear tone.",
    targetScript: "Welcome to the Metropolitan Art Center. Today's guided tour will showcase our renowned collection of nineteenth-century European paintings, modern sculptures, and historical ceramics. Flash photography and food are strictly prohibited inside the main exhibition halls.",
    modelAnswer: "Welcome to the Metropolitan Art Center. Today's guided tour will showcase our renowned collection of nineteenth-century European paintings, modern sculptures, and historical ceramics. Flash photography and food are strictly prohibited inside the main exhibition halls.",
    tipsVi: [
      "Nhấn đúng trọng âm các từ: 'renowned', 'nineteenth-century', 'exhibition'."
    ]
  },
  {
    id: "sp-t2-q3",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 2,
    partTitle: "Part 2: Describe a picture (Cửa hàng / Siêu thị)",
    questionNumber: 3,
    directionsVi: "Miêu tả cảnh khách hàng đang mua đồ tại quầy thanh toán cửa hàng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_05.jpg",
    modelAnswer: "This picture shows the checkout area of a bustling grocery store. In the foreground, a female customer in a beige coat is handing her credit card to the cashier behind the counter. On the conveyor belt, various grocery items like fruits, vegetables, and boxed cereals are placed neatly. In the background, brightly lit display shelves are stocked with assorted merchandise.",
    tipsVi: [
      "Từ vựng đắt giá: 'cashier behind the counter', 'conveyor belt', 'stocked with merchandise'."
    ]
  },
  {
    id: "sp-t2-q4",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 2,
    partTitle: "Part 2: Describe a picture (Thư viện / Kệ sách)",
    questionNumber: 4,
    directionsVi: "Miêu tả không gian thư viện yên tĩnh và kệ sách gỗ cao tầng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_04.jpg",
    modelAnswer: "This photo depicts an indoor library with tall wooden bookshelves. In the center, a student with glasses is reaching up to pull a thick hardcover book from a high shelf. Surrounding him are neatly organized rows of reference books and catalogs. The ambient lighting is warm and quiet, creating an ideal studying environment.",
    tipsVi: [
      "Miêu tả hành động: 'is reaching up to pull a hardcover book from a high shelf'."
    ]
  },
  {
    id: "sp-t2-q5",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 3,
    partTitle: "Part 3: Respond to questions (Thói quen ăn uống)",
    questionNumber: 5,
    directionsVi: "Trả lời câu hỏi 15s: Bạn thường nấu ăn ở nhà hay đi ăn ngoài?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Do you usually cook meals at home or eat out at restaurants? How often?",
    modelAnswer: "I usually cook meals at home about four to five times a week because home-cooked food is healthier, fresher, and much more economical.",
    tipsVi: [
      "Nêu tần suất (4-5 times a week) + 3 tính từ khen ngợi (healthier, fresher, economical)."
    ]
  },
  {
    id: "sp-t2-q6",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 3,
    partTitle: "Part 3: Respond to questions (Chọn nhà hàng)",
    questionNumber: 6,
    directionsVi: "Trả lời 15s: Điều gì quan trọng nhất khi bạn chọn một nhà hàng mới?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "What do you consider most when picking a new restaurant to visit?",
    modelAnswer: "The most important factor for me is food quality and hygiene, followed closely by friendly customer service and positive online customer reviews.",
    tipsVi: [
      "Dùng cụm: 'The most important factor is... followed closely by...'"
    ]
  },
  {
    id: "sp-t2-q7",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 3,
    partTitle: "Part 3: Respond to questions (Ứng dụng đặt đồ ăn)",
    questionNumber: 7,
    directionsVi: "Trả lời 30s: Lợi ích của việc sử dụng ứng dụng đặt đồ ăn công nghệ?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "In your opinion, what are the advantages of using food delivery mobile apps?",
    modelAnswer: "In my opinion, food delivery apps offer tremendous convenience and variety. Firstly, they save valuable time since I do not have to cook or travel in bad weather. Secondly, these apps often provide real-time order tracking, digital payments, and exclusive discount vouchers, making ordering delicious meals effortless and cost-effective.",
    tipsVi: [
      "Phân 2 ý rõ ràng: Tiết kiệm thời gian + Tiện ích số."
    ]
  },
  {
    id: "sp-t2-q8",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 4,
    partTitle: "Part 4: Using Information (Lịch phỏng vấn tuyển dụng)",
    questionNumber: 8,
    directionsVi: "Đọc lịch phỏng vấn và trả lời câu hỏi 15s của ứng viên qua điện thoại.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "Can you tell me who the first candidate being interviewed is and for what role?",
    imageUrl: "/images/part1/p1_03.jpg",
    tableData: [
      { "Thời gian": "09:30 AM - 10:15 AM", "Ứng viên": "David Kim", "Vị trí ứng tuyển": "Senior Front-End Developer (Meeting Room 1)" },
      { "Thời gian": "10:30 AM - 11:15 AM", "Ứng viên": "Laura Martinez", "Vị trí ứng tuyển": "UI/UX Product Designer (Meeting Room 2)" },
      { "Thời gian": "02:00 PM - 02:45 PM", "Ứng viên": "Michael Nguyen", "Vị trí ứng tuyển": "Data Analyst (Meeting Room 1)" }
    ],
    modelAnswer: "Sure! The first candidate is David Kim, and he will be interviewed for the Senior Front-End Developer position at 9:30 AM in Meeting Room 1.",
    tipsVi: [
      "Nêu tên + vị trí + thời gian và phòng họp."
    ]
  },
  {
    id: "sp-t2-q9",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 4,
    partTitle: "Part 4: Using Information (Kiểm tra lịch buổi chiều)",
    questionNumber: 9,
    directionsVi: "Trả lời câu hỏi 15s để làm rõ lịch phỏng vấn vào buổi chiều.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Are there any interviews scheduled after 12:00 PM?",
    imageUrl: "/images/part1/p1_03.jpg",
    tableData: [
      { "Thời gian": "02:00 PM - 02:45 PM", "Ứng viên": "Michael Nguyen", "Vị trí ứng tuyển": "Data Analyst (Meeting Room 1)" }
    ],
    modelAnswer: "Yes, there is one interview scheduled in the afternoon. Michael Nguyen is being interviewed for the Data Analyst role from 2:00 PM to 2:45 PM in Meeting Room 1.",
    tipsVi: [
      "Khẳng định 'Yes, there is one interview...' + chi tiết đầy đủ."
    ]
  },
  {
    id: "sp-t2-q10",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 4,
    partTitle: "Part 4: Using Information (Tất cả ứng viên buổi sáng)",
    questionNumber: 10,
    directionsVi: "Trả lời câu hỏi 30s: Liệt kê chi tiết các cuộc phỏng vấn diễn ra trong buổi sáng.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Could you please give me full details about all interviews scheduled in the morning?",
    imageUrl: "/images/part1/p1_03.jpg",
    tableData: [
      { "Thời gian": "09:30 AM - 10:15 AM", "Ứng viên": "David Kim", "Vị trí ứng tuyển": "Senior Front-End Developer (Meeting Room 1)" },
      { "Thời gian": "10:30 AM - 11:15 AM", "Ứng viên": "Laura Martinez", "Vị trí ứng tuyển": "UI/UX Product Designer (Meeting Room 2)" }
    ],
    modelAnswer: "Certainly, there are two morning interviews. First, at 9:30 AM, David Kim will interview for Senior Front-End Developer in Meeting Room 1. Second, at 10:30 AM, Laura Martinez will interview for UI/UX Product Designer in Meeting Room 2.",
    tipsVi: [
      "Cấu trúc liệt kê: 'First, at 9:30 AM... Second, at 10:30 AM...'"
    ]
  },
  {
    id: "sp-t2-q11",
    testId: "study4-sp-02",
    testName: "STUDY4 Practice Test 02",
    part: 5,
    partTitle: "Part 5: Express an Opinion (Làm việc nhóm hay Độc lập)",
    questionNumber: 11,
    directionsVi: "Bày tỏ quan điểm trong 60 giây (45s chuẩn bị): Bạn thích làm việc độc lập hay theo nhóm trong môi trường công sở?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Some people prefer working independently, while others prefer collaborating in a team. Which working style do you find more effective and why?",
    modelAnswer: "I firmly believe that collaborating in a team is significantly more effective than working purely independently. First, teamwork allows diverse talents and perspectives to combine, resulting in superior creative problem-solving and higher quality outcomes. For instance, when designing complex products, developers, designers, and marketers must collaborate to identify blind spots that an individual might overlook. Second, working in a supportive team distributes massive workloads equitably and reduces personal stress. Therefore, team collaboration is essential for long-term organizational success.",
    tipsVi: [
      "Khẳng định rõ quan điểm -> Nêu 2 lý do mạnh mẽ -> Kết luận."
    ]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 03 (11 CÂU)
  // ==========================================
  {
    id: "sp-t3-q1",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Dịch vụ hỗ trợ khách hàng)",
    questionNumber: 1,
    directionsVi: "Đọc to thông báo nâng cấp đường dây nóng hỗ trợ khách hàng 24/7.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the customer service update aloud with accurate pauses and professional intonation.",
    targetScript: "Thank you for contacting Apex Telecommunications. We are excited to announce our upgraded 24/7 customer care portal. You can now track service requests, pay monthly bills, and chat with technical advisors instantly through our mobile app or official website. Please remain on the line while we connect you to an agent.",
    modelAnswer: "Thank you for contacting Apex Telecommunications. We are excited to announce our upgraded 24/7 customer care portal. You can now track service requests, pay monthly bills, and chat with technical advisors instantly through our mobile app or official website. Please remain on the line while we connect you to an agent.",
    tipsVi: ["Ngắt sau 'Telecommunications', 'portal', 'bills'."]
  },
  {
    id: "sp-t3-q2",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Lễ hội cộng đồng)",
    questionNumber: 2,
    directionsVi: "Đọc to thông báo phát thanh mời tham dự lễ hội văn hóa ẩm thực mùa thu.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the community festival announcement aloud with an inviting and joyful tone.",
    targetScript: "Join us this Saturday for the annual Riverdale Autumn Cultural Fair! Enjoy live musical performances, handcrafted artisan souvenirs, and delicious street food from over thirty international vendors. Admission is completely free for all community residents and visiting guests.",
    modelAnswer: "Join us this Saturday for the annual Riverdale Autumn Cultural Fair! Enjoy live musical performances, handcrafted artisan souvenirs, and delicious street food from over thirty international vendors. Admission is completely free for all community residents and visiting guests.",
    tipsVi: ["Lên giọng liệt kê: 'musical performances ↗, artisan souvenirs ↗, and street food ↘'."]
  },
  {
    id: "sp-t3-q3",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 2,
    partTitle: "Part 2: Describe a picture (Quán cafe ngoài trời)",
    questionNumber: 3,
    directionsVi: "Miêu tả không gian quán cafe ngoài trời và các thực khách đang trò chuyện.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_06.jpg",
    modelAnswer: "This picture captures an outdoor patio at a lively European-style cafe. In the foreground, two women sitting at a small round table are smiling and chatting over cups of coffee. Behind them, several other customers are enjoying pastries under large sun umbrellas. The cobblestone street is lined with flowering pots, creating a cozy and relaxing afternoon atmosphere.",
    tipsVi: ["Miêu tả bối cảnh ngoài trời: 'outdoor patio', 'sun umbrellas', 'cozy atmosphere'."]
  },
  {
    id: "sp-t3-q4",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 2,
    partTitle: "Part 2: Describe a picture (Kho hàng vận tải logistics)",
    questionNumber: 4,
    directionsVi: "Miêu tả cảnh nhân viên vận hành xe nâng hàng trong nhà kho lớn.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as possible.",
    imageUrl: "/images/part1/p1_07.jpg",
    modelAnswer: "This photograph was taken inside a spacious logistics warehouse. In the center, a worker wearing a yellow safety vest and protective helmet is operating a forklift to lift a wooden pallet loaded with cardboard boxes. In the background, tall metal racks stacked high with inventory stretch across the facility. The environment appears highly organized and industrial.",
    tipsVi: ["Từ vựng chuyên ngành: 'safety vest', 'forklift', 'wooden pallet', 'metal racks'."]
  },
  {
    id: "sp-t3-q5",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 3,
    partTitle: "Part 3: Respond to questions (Thói quen rèn luyện sức khỏe)",
    questionNumber: 5,
    directionsVi: "Trả lời câu hỏi 15s: Bạn thường tập thể dục ở đâu và vào thời gian nào?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Where do you usually exercise, and at what time of the day?",
    modelAnswer: "I usually exercise at a neighborhood fitness gym or jog around the park early in the morning, around 6:30 AM before heading to work.",
    tipsVi: ["Trả lời đủ địa điểm (gym/park) + giờ giấc (6:30 AM)."]
  },
  {
    id: "sp-t3-q6",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 3,
    partTitle: "Part 3: Respond to questions (Phòng gym hay tự tập ở nhà)",
    questionNumber: 6,
    directionsVi: "Trả lời câu hỏi 15s: Bạn thích đăng ký phòng gym hay tự tập ở nhà hơn?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Do you prefer working out at a fitness club or exercising at home? Why?",
    modelAnswer: "I prefer working out at a fitness club because it offers modern workout equipment and a motivating group atmosphere that keeps me disciplined.",
    tipsVi: ["Nêu lý do: 'modern workout equipment' và 'motivating atmosphere'."]
  },
  {
    id: "sp-t3-q7",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 3,
    partTitle: "Part 3: Respond to questions (Lợi ích tập luyện thường xuyên)",
    questionNumber: 7,
    directionsVi: "Trả lời câu hỏi 30s: Tầm quan trọng của việc duy trì thói quen tập thể dục đối với người đi làm?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Why is it important for busy office workers to exercise regularly? Explain with examples.",
    modelAnswer: "Regular exercise is vital for office workers for two primary reasons. First, sitting at a desk for eight hours causes neck and back pain, so physical activity relieves muscle tension and improves posture. Second, exercising releases endorphins, which reduces work-related stress and significantly boosts mental focus during long working days.",
    tipsVi: ["Nêu 2 tác động: Thể chất (relieves muscle tension) + Tinh thần (reduces stress, boosts focus)."]
  },
  {
    id: "sp-t3-q8",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 4,
    partTitle: "Part 4: Using Information (Lịch trình chuyến công tác)",
    questionNumber: 8,
    directionsVi: "Đọc lịch trình công tác của giám đốc và trả lời câu hỏi 15s qua điện thoại.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "What time does Mr. Johnson arrive in Tokyo, and where will he stay?",
    imageUrl: "/images/part1/p1_08.jpg",
    tableData: [
      { "Thời gian": "Monday 02:30 PM", "Hoạt động": "Flight JL-752 arrives at Haneda Airport", "Ghi chú": "Pickup arranged by Tokyo Branch" },
      { "Thời gian": "Monday 04:30 PM", "Hoạt động": "Check-in at Hotel Grand Palace Tokyo", "Ghi chú": "Reservation #TY-9921" },
      { "Thời gian": "Tuesday 09:00 AM - 12:00 PM", "Hoạt động": "Quarterly Partnership Review with Nippon Tech", "Ghi chú": "Main Conference Room 5" }
    ],
    modelAnswer: "Mr. Johnson arrives at Haneda Airport on Monday at 2:30 PM, and he will be staying at the Hotel Grand Palace Tokyo starting from 4:30 PM.",
    tipsVi: ["Nêu đúng giờ đáp máy bay + tên khách sạn."]
  },
  {
    id: "sp-t3-q9",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 4,
    partTitle: "Part 4: Using Information (Kiểm tra lịch họp thứ Ba)",
    questionNumber: 9,
    directionsVi: "Trả lời câu hỏi 15s để làm rõ thời gian cuộc họp đối tác.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "I was told that the partnership meeting takes place on Tuesday afternoon, is that true?",
    imageUrl: "/images/part1/p1_08.jpg",
    tableData: [
      { "Thời gian": "Tuesday 09:00 AM - 12:00 PM", "Hoạt động": "Quarterly Partnership Review with Nippon Tech", "Ghi chú": "Main Conference Room 5" }
    ],
    modelAnswer: "No, actually that is not correct. The partnership review meeting is scheduled for Tuesday morning from 9:00 AM to 12:00 PM in Conference Room 5.",
    tipsVi: ["Đính chính lịch họp diễn ra vào buổi sáng (morning), không phải chiều."]
  },
  {
    id: "sp-t3-q10",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 4,
    partTitle: "Part 4: Using Information (Lịch trình cả ngày thứ Hai)",
    questionNumber: 10,
    directionsVi: "Trả lời câu hỏi trong 30 giây: Liệt kê chi tiết các sự kiện diễn ra trong ngày thứ Hai.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Could you please give me all the details for Mr. Johnson's schedule on Monday?",
    imageUrl: "/images/part1/p1_08.jpg",
    tableData: [
      { "Thời gian": "Monday 02:30 PM", "Hoạt động": "Flight JL-752 arrives at Haneda Airport", "Ghi chú": "Pickup arranged by Tokyo Branch" },
      { "Thời gian": "Monday 04:30 PM", "Hoạt động": "Check-in at Hotel Grand Palace Tokyo", "Ghi chú": "Reservation #TY-9921" }
    ],
    modelAnswer: "Certainly! On Monday, Mr. Johnson has two scheduled items. First, his flight JL-752 lands at Haneda Airport at 2:30 PM, where he will be met by our Tokyo branch pickup team. Second, at 4:30 PM, he will check in at the Hotel Grand Palace Tokyo under reservation number TY-9921.",
    tipsVi: ["Liệt kê theo thứ tự: 'First,... Second,...' kèm mã đặt phòng."]
  },
  {
    id: "sp-t3-q11",
    testId: "study4-sp-03",
    testName: "STUDY4 Practice Test 03",
    part: 5,
    partTitle: "Part 5: Express an Opinion (Lương cao vs Hài lòng công việc)",
    questionNumber: 11,
    directionsVi: "Bày tỏ quan điểm trong 60 giây (45s chuẩn bị): Theo bạn, mức lương cao (high salary) hay sự hài lòng với công việc (job satisfaction) quan trọng hơn?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Do you think receiving a high salary is more important than having high job satisfaction? State your opinion with convincing reasons and examples.",
    modelAnswer: "In my perspective, having high job satisfaction is significantly more important than simply earning a high salary. Firstly, we spend nearly one-third of our lives at work, so performing meaningful tasks in a positive environment preserves our mental and physical health. If an employee earns an enormous salary but faces toxic management and extreme burnout, their quality of life deteriorates rapidly. Secondly, when people genuinely enjoy what they do, their intrinsic passion drives them to innovate, excel, and achieve sustainable long-term career growth, which inevitably brings financial rewards as well. Therefore, I believe job satisfaction should always take precedence.",
    tipsVi: ["So sánh giữa sức khỏe tinh thần và tiền bạc, khẳng định đam mê mang lại thành công lâu dài."]
  }
,

  // ==========================================
  // STUDY4 PRACTICE TEST 04 (11 CÂU)
  // ==========================================
  {
    id: "sp-t4-q1",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Khai mạc Triển lãm Công nghệ)",
    questionNumber: 1,
    directionsVi: "Đọc to thông báo khai mạc Triển lãm Công nghệ Quốc tế trong 45 giây. Chú ý ngắt nghỉ đúng chỗ và lên giọng ở các danh từ liệt kê: artificial intelligence, cloud computing, and green robotics.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the announcement aloud as naturally and accurately as possible.",
    targetScript: "Welcome to the tenth annual Global Tech Expo here at the Seattle Convention Center. Over the next three days, you will have the exclusive opportunity to explore revolutionary breakthroughs in artificial intelligence, cloud computing, and green robotics. Please visit Hall B to pick up your commemorative badge, conference itinerary, and official exhibition guide. If you require interpretation devices, please approach our concierge desk near the main entrance.",
    modelAnswer: "Welcome to the tenth annual Global Tech Expo here at the Seattle Convention Center. Over the next three days, you will have the exclusive opportunity to explore revolutionary breakthroughs in artificial intelligence, cloud computing, and green robotics. Please visit Hall B to pick up your commemorative badge, conference itinerary, and official exhibition guide. If you require interpretation devices, please approach our concierge desk near the main entrance.",
    tipsVi: [
      "Ngữ điệu liệt kê 3 yếu tố: lên giọng ở 'artificial intelligence ↗', 'cloud computing ↗', và hạ giọng ở 'green robotics ↘'.",
      "Phát âm chuẩn từ 'exclusive' /ɪkˈskluːsɪv/ và 'itinerary' /aɪˈtɪnərəri/."
    ]
  },
  {
    id: "sp-t4-q2",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Quảng cáo Nội thất Văn phòng Xanh)",
    questionNumber: 2,
    directionsVi: "Đọc to mẩu quảng cáo phát thanh 45 giây. Chú ý nhấn mạnh các từ mô tả tính năng: ergonomic, sustainable, stylish.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the commercial advertisement aloud with enthusiastic and professional intonation.",
    targetScript: "Are you looking to modernize your corporate workspace while protecting the environment? At EcoCraft Interiors, we craft premium ergonomic desks, executive chairs, and modular partitions using one hundred percent recycled timber. For this week only, enter promo code GREEN20 online to enjoy twenty percent off your entire bulk order, along with complimentary white-glove installation. Visit ecocraft.com today to design your dream office.",
    modelAnswer: "Are you looking to modernize your corporate workspace while protecting the environment? At EcoCraft Interiors, we craft premium ergonomic desks, executive chairs, and modular partitions using one hundred percent recycled timber. For this week only, enter promo code GREEN20 online to enjoy twenty percent off your entire bulk order, along with complimentary white-glove installation. Visit ecocraft.com today to design your dream office.",
    tipsVi: [
      "Lên giọng ở câu hỏi tu từ '...protecting the environment? ↗'.",
      "Nhấn mạnh vào con số ưu đãi 'twenty percent off' và 'complimentary'."
    ]
  },
  {
    id: "sp-t4-q3",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 2,
    partTitle: "Part 2: Describe a picture (Kỹ sư xem bản vẽ xây dựng)",
    questionNumber: 3,
    directionsVi: "Miêu tả bức tranh trong 30 giây (45s chuẩn bị): Các kỹ sư đang phân tích bản vẽ kỹ thuật trên công trường xây dựng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture in as much detail as you can within 30 seconds.",
    imageUrl: "/images/part1/p1_21.jpg",
    keywords: ["blueprints", "hard hats", "discussing"],
    modelAnswer: "In this picture, I can see two engineers standing outdoors near a construction site. Both of them are wearing yellow hard hats and high-visibility safety vests. The man on the left is holding open a large sheet of architectural blueprints, while his colleague is pointing to a specific section and explaining something carefully. In the background, there is construction equipment and scaffolding under a clear sky. It seems like they are discussing critical structural details before continuing the construction phase.",
    tipsVi: [
      "Bố cục 30s: Nhìn tổng thể (2 kỹ sư, đồ bảo hộ) -> Hành động chính (cầm bản vẽ, chỉ tay) -> Hậu cảnh & cảm xúc."
    ]
  },
  {
    id: "sp-t4-q4",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 2,
    partTitle: "Part 2: Describe a picture (Kệ nông sản tươi trong siêu thị)",
    questionNumber: 4,
    directionsVi: "Miêu tả bức tranh trong 30 giây (45s chuẩn bị): Hàng hóa nông sản tươi ngon được trưng bày gọn gàng trong siêu thị.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture in as much detail as you can within 30 seconds.",
    imageUrl: "/images/part1/p1_16.jpg",
    keywords: ["shelves", "produce", "organized"],
    modelAnswer: "This picture shows the produce section of a modern grocery store or supermarket. In the foreground, numerous baskets and wooden crates are filled with fresh fruits and vegetables, neatly organized by color and type. Wooden shelves in the background are fully stocked with packaged goods. The lighting is bright and clean, creating an inviting shopping ambiance. There are no customers visible at this moment, giving the impression that the store has just opened for the day.",
    tipsVi: [
      "Dùng cụm vị trí: 'In the foreground...', 'Wooden shelves in the background...', 'The lighting is bright and clean'."
    ]
  },
  {
    id: "sp-t4-q5",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 3,
    partTitle: "Part 3: Respond to questions (Tần suất mua sắm trực tuyến)",
    questionNumber: 5,
    directionsVi: "Trả lời câu hỏi 15 giây: Bạn thường mua sắm trực tuyến bao lâu một lần và bạn thường mua những món đồ nào nhất?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "How often do you shop online, and what kinds of products do you typically purchase?",
    modelAnswer: "I shop online about twice a month, and I typically purchase electronic accessories, clothing, and household daily essentials because of the convenient home delivery and competitive prices.",
    tipsVi: ["Trả lời thẳng vào trọng tâm: 'twice a month' + liệt kê 2-3 món đồ."]
  },
  {
    id: "sp-t4-q6",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 3,
    partTitle: "Part 3: Respond to questions (Yếu tố chọn ứng dụng mua sắm)",
    questionNumber: 6,
    directionsVi: "Trả lời câu hỏi 15 giây: Điều gì quan trọng nhất với bạn khi chọn mua hàng trên một ứng dụng: Đánh giá của khách hàng khác hay miễn phí vận chuyển?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "When shopping online, which factor is more important to you: customer reviews or free shipping? Why?",
    modelAnswer: "Customer reviews are definitely more important to me because authentic feedback with real photos helps me accurately assess product quality and durability before spending my money.",
    tipsVi: ["Chọn 1 trong 2 và đưa lý do: 'authentic feedback with real photos'."]
  },
  {
    id: "sp-t4-q7",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 3,
    partTitle: "Part 3: Respond to questions (Cửa hàng truyền thống vs Mua sắm online)",
    questionNumber: 7,
    directionsVi: "Trả lời câu hỏi 30 giây: Theo bạn, các cửa hàng bán lẻ truyền thống (physical stores) có bị mua sắm trực tuyến thay thế hoàn toàn không? Vì sao?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Do you think brick-and-mortar retail stores will be completely replaced by online e-commerce in the future? Explain why or why not.",
    modelAnswer: "I do not believe physical retail stores will ever be completely replaced. Although e-commerce offers unmatched speed and convenience, physical stores provide tangible sensory experiences that cannot be replicated online, such as trying on clothes, testing fragrance samples, and enjoying immediate in-person customer service. Instead of disappearing, physical stores will evolve into experiential showrooms complementing digital platforms.",
    tipsVi: ["Nêu quan điểm rõ ràng 'I do not believe...' + đưa 2 ưu thế độc quyền của cửa hàng thực tế (tangible sensory experiences, immediate service)."]
  },
  {
    id: "sp-t4-q8",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 4,
    partTitle: "Part 4: Using Information (Lịch trình Hội thảo Lãnh đạo)",
    questionNumber: 8,
    directionsVi: "Đọc lịch trình Hội thảo Nâng cao Kỹ năng Lãnh đạo và trả lời câu hỏi 15 giây.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "What time does the keynote speech begin, and who is delivering it?",
    imageUrl: "/images/part1/p1_18.jpg",
    tableData: [
      { "Time": "08:30 AM - 09:00 AM", "Event": "Registration & Welcome Coffee", "Speaker / Room": "Main Foyer" },
      { "Time": "09:00 AM - 10:30 AM", "Event": "Keynote: Agile Leadership in Disruptive Markets", "Speaker / Room": "Dr. Sarah Jenkins (Auditorium A)" },
      { "Time": "10:45 AM - 12:15 PM", "Event": "Workshop 1: Cross-Functional Team Synergy", "Speaker / Room": "Marcus Brody (Room 201)" },
      { "Time": "12:15 PM - 01:30 PM", "Event": "Networking Buffet Lunch", "Speaker / Room": "Garden Dining Hall" },
      { "Time": "01:30 PM - 03:00 PM", "Event": "Workshop 2: Conflict Resolution Strategies", "Speaker / Room": "Dr. Sarah Jenkins (Auditorium A)" }
    ],
    modelAnswer: "The keynote speech begins at 9:00 AM in Auditorium A, and it will be delivered by Dr. Sarah Jenkins on the topic 'Agile Leadership in Disruptive Markets'.",
    tipsVi: ["Trả lời chính xác giờ bắt đầu, diễn giả và tên khán phòng Auditorium A."]
  },
  {
    id: "sp-t4-q9",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 4,
    partTitle: "Part 4: Using Information (Đính chính địa điểm ăn trưa)",
    questionNumber: 9,
    directionsVi: "Trả lời câu hỏi 15 giây: Đính chính thông tin về bữa trưa kết nối mạng lưới.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "I heard that the networking lunch is hosted in Room 201. Is that correct?",
    imageUrl: "/images/part1/p1_18.jpg",
    tableData: [
      { "Time": "12:15 PM - 01:30 PM", "Event": "Networking Buffet Lunch", "Speaker / Room": "Garden Dining Hall" }
    ],
    modelAnswer: "No, actually that is not correct. The networking buffet lunch is held in the Garden Dining Hall from 12:15 PM to 1:30 PM, not in Room 201.",
    tipsVi: ["Đính chính lịch sự: 'No, actually that is not correct...' và nêu đúng địa điểm Garden Dining Hall."]
  },
  {
    id: "sp-t4-q10",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 4,
    partTitle: "Part 4: Using Information (Tổng hợp các buổi của Dr. Sarah Jenkins)",
    questionNumber: 10,
    directionsVi: "Trả lời câu hỏi 30 giây: Liệt kê chi tiết tất cả các phiên do Tiến sĩ Sarah Jenkins phụ trách trong ngày.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Could you please give me full details about all the sessions being led by Dr. Sarah Jenkins?",
    imageUrl: "/images/part1/p1_18.jpg",
    tableData: [
      { "Time": "09:00 AM - 10:30 AM", "Event": "Keynote: Agile Leadership in Disruptive Markets", "Speaker / Room": "Dr. Sarah Jenkins (Auditorium A)" },
      { "Time": "01:30 PM - 03:00 PM", "Event": "Workshop 2: Conflict Resolution Strategies", "Speaker / Room": "Dr. Sarah Jenkins (Auditorium A)" }
    ],
    modelAnswer: "Certainly! Dr. Sarah Jenkins is leading two separate sessions today. First, from 9:00 AM to 10:30 AM, she will deliver the keynote address titled 'Agile Leadership in Disruptive Markets' in Auditorium A. Later in the afternoon, from 1:30 PM to 3:00 PM, she will facilitate Workshop 2 on 'Conflict Resolution Strategies', also located in Auditorium A.",
    tipsVi: ["Nêu đủ 2 buổi sáng & chiều: 'First,... Later in the afternoon,...'."]
  },
  {
    id: "sp-t4-q11",
    testId: "study4-sp-04",
    testName: "STUDY4 Practice Test 04",
    part: 5,
    partTitle: "Part 5: Express an Opinion (Thưởng tiền cho nhân viên có lối sống lành mạnh)",
    questionNumber: 11,
    directionsVi: "Bày tỏ quan điểm trong 60 giây (45s chuẩn bị): Bạn có đồng ý rằng các công ty nên thưởng tiền mặt hoặc tặng ngày nghỉ phép cho những nhân viên duy trì lối sống lành mạnh (tập gym, không hút thuốc) không?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Do you agree or disagree that companies should offer financial bonuses or extra paid time off to employees who maintain healthy lifestyles, such as exercising regularly or quitting smoking? Explain your position with reasons and examples.",
    modelAnswer: "I strongly agree that organizations should offer financial incentives or additional paid leave to promote employee health. Firstly, a healthy workforce directly boosts corporate productivity while drastically reducing company expenditure on medical insurance and paid sick leaves. When employees maintain healthy physical conditions, they exhibit sharper mental focus and far lower absenteeism rates. For example, prominent multinational companies that sponsor gym memberships or offer wellness bonuses report up to a twenty percent decrease in healthcare claims. Secondly, introducing tangible rewards creates an encouraging corporate culture that demonstrates that management genuinely cares about workers' long-term well-being rather than merely extracting labor. While participation should always remain voluntary to respect individual privacy, incentivizing healthy habits creates a win-win scenario for both employees and the company.",
    tipsVi: ["Đưa 2 luận điểm mạnh mẽ: Giảm chi phí y tế & Tăng gắn kết nhân viên. Nhấn mạnh nguyên tắc tự nguyện."]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 05 (11 CÂU)
  // ==========================================
  {
    id: "sp-t5-q1",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Đổi cửa khởi hành tại sân bay)",
    questionNumber: 1,
    directionsVi: "Đọc to thông báo phát thanh sân bay quốc tế trong 45 giây. Chú ý đọc chuẩn các số hiệu chuyến bay, cửa khởi hành và tên điểm đến.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the airport gate announcement aloud clearly and professionally.",
    targetScript: "Attention all passengers booked on Pacific Skyways Flight PS-608 with non-stop service to Tokyo Narita. Due to unexpected gate maintenance, our departure gate has been relocated from Gate 14 to Gate 22B at the end of Concourse C. Boarding will commence promptly at four forty-five PM, beginning with first-class passengers and active military personnel. Please ensure you have your passport and valid boarding pass ready for inspection. We appreciate your patience and wish you a pleasant flight.",
    modelAnswer: "Attention all passengers booked on Pacific Skyways Flight PS-608 with non-stop service to Tokyo Narita. Due to unexpected gate maintenance, our departure gate has been relocated from Gate 14 to Gate 22B at the end of Concourse C. Boarding will commence promptly at four forty-five PM, beginning with first-class passengers and active military personnel. Please ensure you have your passport and valid boarding pass ready for inspection. We appreciate your patience and wish you a pleasant flight.",
    tipsVi: [
      "Đọc chuẩn số chuyến bay 'PS-608' /piː ɛs sɪks oʊ eɪt/ và giờ 'four forty-five PM'.",
      "Ngữ điệu dứt khoát, rõ ràng như loa phát thanh sân bay quốc tế."
    ]
  },
  {
    id: "sp-t5-q2",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Khuyến mãi xả hàng Trung tâm thương mại)",
    questionNumber: 2,
    directionsVi: "Đọc to thông báo bán hàng khuyến mãi tại trung tâm thương mại trong 45 giây. Chú ý ngắt nghỉ và ngữ điệu mời gọi khách hàng.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the department store announcement aloud with an energetic and engaging tone.",
    targetScript: "Good evening, valued shoppers of Kensington Department Store. As we prepare to conclude our mid-season clearance sale, we invite you to visit our third-floor home furnishings department. For the next thirty minutes only, all designer tableware, organic bed linens, and decorative lamps are available at an extra thirty percent discount upon checkout. In addition, registered Gold Card members will receive double reward points on all retail purchases tonight. Thank you for shopping with Kensington.",
    modelAnswer: "Good evening, valued shoppers of Kensington Department Store. As we prepare to conclude our mid-season clearance sale, we invite you to visit our third-floor home furnishings department. For the next thirty minutes only, all designer tableware, organic bed linens, and decorative lamps are available at an extra thirty percent discount upon checkout. In addition, registered Gold Card members will receive double reward points on all retail purchases tonight. Thank you for shopping with Kensington.",
    tipsVi: [
      "Ngữ điệu vui tươi, thân thiện, lên giọng ở các món đồ liệt kê: 'designer tableware ↗', 'organic bed linens ↗', 'decorative lamps ↘'."
    ]
  },
  {
    id: "sp-t5-q3",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 2,
    partTitle: "Part 2: Describe a picture (Kỹ thuật viên phòng thí nghiệm)",
    questionNumber: 3,
    directionsVi: "Miêu tả bức tranh trong 30 giây (45s chuẩn bị): Kỹ thuật viên đang kiểm tra và lắp ráp thiết bị công nghiệp công nghệ cao.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture in as much detail as you can within 30 seconds.",
    imageUrl: "/images/part1/p1_23.jpg",
    keywords: ["technician", "equipment", "adjusting"],
    modelAnswer: "In this photograph, I can see a male technician working in a clean, modern manufacturing facility. He is dressed in professional work attire and is focused intently on adjusting a complex piece of electronic equipment. His hands are positioned carefully on the control dials and wiring components. The background features various measuring instruments and digital screens displaying operational data. The overall scene suggests a high-precision testing environment where strict quality control standards are being enforced.",
    tipsVi: [
      "Miêu tả tập trung vào cử chỉ đôi tay (adjusting control dials) và mức độ tập trung cao độ (focused intently)."
    ]
  },
  {
    id: "sp-t5-q4",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 2,
    partTitle: "Part 2: Describe a picture (Thuyết trình cấp cao tại khán phòng)",
    questionNumber: 4,
    directionsVi: "Miêu tả bức tranh trong 30 giây (45s chuẩn bị): Diễn giả phát biểu trước các lãnh đạo trong phòng họp hội thảo.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture in as much detail as you can within 30 seconds.",
    imageUrl: "/images/part1/p1_24.jpg",
    keywords: ["podium", "speaker", "conference"],
    modelAnswer: "This picture captures a formal business conference taking place in an elegant auditorium. At the center of the frame, a distinguished speaker is standing behind a wooden podium, addressing an attentive audience. He is wearing a dark suit and gesturing with his right hand to emphasize his presentation point. To his right, a large digital display screen showcases financial charts and projected growth metrics. The atmosphere appears solemn, engaging, and highly professional.",
    tipsVi: [
      "Dùng cụm: 'At the center of the frame...', 'standing behind a wooden podium', 'gesturing with his right hand'."
    ]
  },
  {
    id: "sp-t5-q5",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 3,
    partTitle: "Part 3: Respond to questions (Phương tiện đi làm hàng ngày)",
    questionNumber: 5,
    directionsVi: "Trả lời câu hỏi 15 giây: Phương tiện di chuyển hàng ngày của bạn đến chỗ làm/trường học là gì và mất bao lâu?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "What mode of transportation do you typically use to commute to work or school, and how long does the journey take?",
    modelAnswer: "I typically commute by electric motorbike or rapid transit train, which takes approximately twenty-five to thirty minutes depending on morning traffic conditions.",
    tipsVi: ["Trả lời ngắn gọn, nêu rõ phương tiện và thời gian 25 - 30 phút."]
  },
  {
    id: "sp-t5-q6",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 3,
    partTitle: "Part 3: Respond to questions (Tàu điện ngầm hay Xe buýt)",
    questionNumber: 6,
    directionsVi: "Trả lời câu hỏi 15 giây: Khi đi lại vào giờ cao điểm, bạn thích đi tàu điện ngầm hay xe buýt hơn? Vì sao?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "During peak rush hours, do you prefer commuting by underground subway or by city bus? Why?",
    modelAnswer: "I strongly prefer taking the subway during peak rush hours because trains run on dedicated underground tracks, completely avoiding the unpredictable traffic jams common to surface buses.",
    tipsVi: ["Nhấn mạnh ưu thế tránh kẹt xe của tàu điện ngầm: 'dedicated underground tracks, avoiding traffic jams'."]
  },
  {
    id: "sp-t5-q7",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 3,
    partTitle: "Part 3: Respond to questions (Giải pháp phát triển giao thông công cộng)",
    questionNumber: 7,
    directionsVi: "Trả lời câu hỏi 30 giây: Chính quyền các thành phố lớn nên làm gì để khuyến khích người dân sử dụng phương tiện công cộng thay vì xe cá nhân?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "What effective measures can municipal governments take to encourage more citizens to choose public transit over private vehicles?",
    modelAnswer: "Municipal governments can implement two powerful initiatives. First, they should expand transit accessibility by upgrading bus fleets with modern air conditioning and integrating contactless tap-and-go fare payments. Second, offering discounted monthly transit passes for students and office workers while establishing congestion toll zones in downtown centers will make public transportation far more economical and convenient than driving private cars.",
    tipsVi: ["Đưa 2 giải pháp cụ thể: Hiện đại hóa phương tiện + Chính sách giá vé tháng & thu phí xe cá nhân."]
  },
  {
    id: "sp-t5-q8",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 4,
    partTitle: "Part 4: Using Information (Hội nghị Lãnh đạo Toàn cầu)",
    questionNumber: 8,
    directionsVi: "Đọc lịch trình Hội nghị Thượng đỉnh Lãnh đạo Toàn cầu và trả lời câu hỏi 15 giây.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "Where is the opening session held, and what time does it start?",
    imageUrl: "/images/part1/p1_24.jpg",
    tableData: [
      { "Session Time": "09:00 AM - 10:15 AM", "Topic / Event": "Opening Keynote: AI and the Future of Corporate Governance", "Location": "Grand Ballroom East" },
      { "Session Time": "10:30 AM - 12:00 PM", "Topic / Event": "Panel Discussion: Cross-Border Talent Retention Strategies", "Location": "Executive Room 102" },
      { "Session Time": "12:00 PM - 01:30 PM", "Topic / Event": "Executive Luncheon & Networking Session", "Location": "Rooftop Garden Terrace" },
      { "Session Time": "01:30 PM - 03:00 PM", "Topic / Event": "Strategy Seminar: Sustainable ESG Investment Frameworks", "Location": "Grand Ballroom East" },
      { "Session Time": "03:15 PM - 04:30 PM", "Topic / Event": "Closing Remarks & Certificate Conferral", "Location": "Grand Ballroom East" }
    ],
    modelAnswer: "The opening session is held in Grand Ballroom East, and it starts at 9:00 AM on the topic 'AI and the Future of Corporate Governance'.",
    tipsVi: ["Nêu đúng địa điểm Grand Ballroom East và giờ 9:00 AM."]
  },
  {
    id: "sp-t5-q9",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 4,
    partTitle: "Part 4: Using Information (Đính chính thời gian tọa đàm Talent Retention)",
    questionNumber: 9,
    directionsVi: "Trả lời câu hỏi 15 giây: Xác minh thông tin về buổi thảo luận chuyên đề Talent Retention.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "Is it true that the panel discussion on talent retention takes place in the afternoon?",
    imageUrl: "/images/part1/p1_24.jpg",
    tableData: [
      { "Session Time": "10:30 AM - 12:00 PM", "Topic / Event": "Panel Discussion: Cross-Border Talent Retention Strategies", "Location": "Executive Room 102" }
    ],
    modelAnswer: "No, that is not correct. The panel discussion on 'Cross-Border Talent Retention Strategies' is scheduled for the morning, from 10:30 AM to 12:00 PM in Executive Room 102.",
    tipsVi: ["Đính chính: diễn ra vào buổi sáng (morning), không phải chiều."]
  },
  {
    id: "sp-t5-q10",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 4,
    partTitle: "Part 4: Using Information (Tất cả sự kiện tại Grand Ballroom East)",
    questionNumber: 10,
    directionsVi: "Trả lời câu hỏi 30 giây: Liệt kê chi tiết tất cả các sự kiện diễn ra tại Grand Ballroom East trong ngày.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Could you please give me all the information regarding the events taking place in Grand Ballroom East?",
    imageUrl: "/images/part1/p1_24.jpg",
    tableData: [
      { "Session Time": "09:00 AM - 10:15 AM", "Topic / Event": "Opening Keynote: AI and the Future of Corporate Governance", "Location": "Grand Ballroom East" },
      { "Session Time": "01:30 PM - 03:00 PM", "Topic / Event": "Strategy Seminar: Sustainable ESG Investment Frameworks", "Location": "Grand Ballroom East" },
      { "Session Time": "03:15 PM - 04:30 PM", "Topic / Event": "Closing Remarks & Certificate Conferral", "Location": "Grand Ballroom East" }
    ],
    modelAnswer: "Certainly! There are three events scheduled in Grand Ballroom East today. First, from 9:00 AM to 10:15 AM, the opening keynote on 'AI and the Future of Corporate Governance' will be held there. Next, in the afternoon from 1:30 PM to 3:00 PM, the strategy seminar on 'Sustainable ESG Investment Frameworks' will take place. Finally, from 3:15 PM to 4:30 PM, the closing remarks and certificate conferral will conclude the summit in the same ballroom.",
    tipsVi: ["Liệt kê tuần tự cả 3 sự kiện: 'First,... Next,... Finally,...'."]
  },
  {
    id: "sp-t5-q11",
    testId: "study4-sp-05",
    testName: "STUDY4 Practice Test 05",
    part: 5,
    partTitle: "Part 5: Express an Opinion (Thăng chức theo Năng lực vs Thâm niên)",
    questionNumber: 11,
    directionsVi: "Bày tỏ quan điểm trong 60 giây (45s chuẩn bị): Theo bạn, các công ty nên thăng chức cho nhân viên dựa trên thâm niên công tác (Seniority) hay hoàn toàn dựa vào năng lực và hiệu suất thực tế (Merit and Performance)?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Some corporations promote staff members primarily based on their seniority and years of tenure, while others promote strictly based on individual merit and quantifiable performance. Which promotion policy do you think is more beneficial for a company? Provide reasons and examples.",
    modelAnswer: "In my opinion, companies should base employee promotions strictly on individual merit and demonstrable performance rather than years of seniority. Firstly, a performance-based system motivates all staff members, particularly ambitious and talented junior personnel, to give their absolute best effort. When talented workers see that high productivity and innovative ideas lead directly to career advancement, they stay deeply engaged and committed to the organization. Conversely, a seniority-driven model rewards mere time served, which often fosters complacency and causes proactive high performers to leave for competitor firms. Secondly, modern commercial industries demand agile leadership with cutting-edge technical competencies, such as digital transformation and data analytics. A younger manager who has achieved extraordinary results and possesses visionary leadership is far better equipped to guide a team through market disruptions than someone whose only qualification is long tenure. Therefore, meritocracy is essential for driving business excellence and building a competitive, future-ready organization.",
    tipsVi: ["Ủng hộ Meritocracy (chế độ trọng dụng nhân tài), phân tích sự trì trệ của thâm niên và động lực đổi mới của giới trẻ."]
  }
];
