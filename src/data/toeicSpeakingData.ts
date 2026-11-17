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

export const TOEIC_SPEAKING_TESTS = [
  { id: "study4-sp-01", name: "STUDY4 Practice Test 01 (ETS Authentic)", desc: "11 câu chuẩn format thi thật ETS 20 phút", badge: "Đề Hot" },
  { id: "study4-sp-02", name: "STUDY4 Practice Test 02 (ETS Công Sở)", desc: "Chủ đề hội họp, giao tiếp khách hàng & lịch trình", badge: "Mới Cập Nhật" },
  { id: "study4-sp-03", name: "STUDY4 Practice Test 03 (ETS Nâng Cao)", desc: "Thử thách phản xạ nhanh & lập luận thuyết phục", badge: "Mục Tiêu 180+" },
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
  // STUDY4 PRACTICE TEST 01 (11 CÂU CHUẨN ETS)
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
      "Áp dụng Công thức 4 bước Ms Hoa: 1. Địa điểm (open-plan office) -> 2. Người ở trung tâm -> 3. Người/vật bên cạnh -> 4. Bầu không khí (Overall... productive).",
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
      "Dùng cụm vị trí: 'In the foreground', 'On the wooden table', 'In the center'.",
      "Dùng tính từ đắt giá: 'brightly illuminated', 'engaged in the discussion'."
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
      "Nêu rõ sở thích + 1 lý do thuyết phục: 'gives me honest feedback', 'makes the experience fun'."
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
      "Mở đầu chuẩn: 'For me, the most crucial factor is definitely...'",
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
      "Đính chính nhẹ nhàng: 'No, actually that information is incorrect. The lunch is from 12:00 PM to 1:30 PM...'"
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
      "Dàn bài 4 phần: 1. Khẳng định lập trường (1 câu) -> 2. Lý do 1 + Ví dụ (2-3 câu) -> 3. Lý do 2 + Phân tích (2-3 câu) -> 4. Kết luận ngắn (1 câu)."
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
      "Phân 2 ý rõ ràng: Tiết kiệm thời gian (saves valuable time) + Tiện ích số (real-time tracking, discount vouchers)."
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
      "Nêu tên (David Kim) + vị trí (Senior Front-End Developer) + thời gian và phòng họp."
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
      "Khẳng định rõ quan điểm -> Nêu 2 lý do mạnh mẽ (diverse perspectives, distributes workloads) -> Kết luận."
    ]
  }
];
