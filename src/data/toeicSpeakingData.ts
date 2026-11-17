export interface SpeakingQuestion {
  id: string;
  part: 1 | 2 | 3 | 4 | 5;
  partTitle: string;
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

export const TOEIC_SPEAKING_PARTS = [
  { id: 1, name: "Part 1: Đọc to đoạn văn", desc: "Read a text aloud (Câu 1 - 2)", icon: "📢" },
  { id: 2, name: "Part 2: Miêu tả bức tranh", desc: "Describe a picture (Câu 3 - 4)", icon: "🖼️" },
  { id: 3, name: "Part 3: Trả lời câu hỏi ngắn", desc: "Respond to questions (Câu 5 - 7)", icon: "💬" },
  { id: 4, name: "Part 4: Trả lời theo lịch trình", desc: "Using information provided (Câu 8 - 10)", icon: "📋" },
  { id: 5, name: "Part 5: Bày tỏ quan điểm", desc: "Express an opinion (Câu 11)", icon: "💡" },
];

export const TOEIC_SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  // PART 1: READ A TEXT ALOUD
  {
    id: "sp-p1-01",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Đoạn thông báo chuyến bay)",
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
    id: "sp-p1-02",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Quảng cáo khuyến mãi cửa hàng)",
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
    id: "sp-p1-03",
    part: 1,
    partTitle: "Part 1: Read a text aloud (Hướng dẫn viên du lịch)",
    directionsVi: "Đọc to đoạn giới thiệu bảo tàng nghệ thuật với phong thái lịch thiệp của hướng dẫn viên.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 45,
    promptText: "Read the museum tour announcement aloud.",
    targetScript: "Good morning, everyone. Welcome to the Royal Heritage Museum. During our two-hour guided tour, you will discover ancient sculptures, classical oil paintings, and rare historical manuscripts. Photography with flash is strictly prohibited inside the main gallery. Please follow me towards the entrance.",
    modelAnswer: "Good morning, everyone. Welcome to the Royal Heritage Museum. During our two-hour guided tour, you will discover ancient sculptures, classical oil paintings, and rare historical manuscripts. Photography with flash is strictly prohibited inside the main gallery. Please follow me towards the entrance.",
    tipsVi: [
      "Nhấn mạnh từ 'strictly prohibited' để nhấn mạnh lệnh cấm chụp ảnh có đèn flash",
      "Đọc rõ các từ ghép: 'two-hour guided tour', 'oil paintings'",
      "Hạ giọng dứt khoát ở câu kết: 'Please follow me towards the entrance ↘'"
    ]
  },

  // PART 2: DESCRIBE A PICTURE
  {
    id: "sp-p2-01",
    part: 2,
    partTitle: "Part 2: Describe a picture (Cuộc họp công sở)",
    directionsVi: "Quan sát bức ảnh và miêu tả càng chi tiết càng tốt trong 30 giây: địa điểm, người, hành động chính, trang phục và đồ vật xung quanh.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in as much detail as you can.",
    imageUrl: "/images/part1/p1_01.jpg",
    keywords: ["meeting room", "discussing", "conference table", "presentation", "documents"],
    modelAnswer: "This picture was taken in a brightly lit modern office meeting room. In the center of the image, several colleagues are gathered around a wooden conference table, actively discussing a business project. The woman on the left is holding some printed documents and smiling, while the man across from her is gesturing with his hands. In the background, there is a large window with sunlight streaming through. Overall, the atmosphere appears productive and collaborative.",
    tipsVi: [
      "Cấu trúc ăn điểm: Tổng quan (Where) -> Chi tiết người và hành động chính (Who is doing what) -> Hậu cảnh (Background) -> Cảm nhận chung (Overall impression)",
      "Sử dụng thì Hiện tại tiếp diễn: 'are gathered', 'is holding', 'is gesturing'",
      "Dùng từ nối không gian: 'In the foreground', 'On the left', 'In the background'"
    ]
  },
  {
    id: "sp-p2-02",
    part: 2,
    partTitle: "Part 2: Describe a picture (Quán cà phê làm việc)",
    directionsVi: "Miêu tả không gian quán cà phê nơi mọi người đang sử dụng máy tính xách tay.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 30,
    promptText: "Describe the picture on your screen in detail.",
    imageUrl: "/images/part1/p1_04.jpg",
    keywords: ["coffee shop", "laptop", "typing", "mug", "wooden table"],
    modelAnswer: "This photograph shows a cozy and stylish cafe setting. In the foreground, a young professional is sitting at a wooden table, typing diligently on a silver laptop. Next to the keyboard, there is a white ceramic coffee mug and a pair of eyeglasses. In the background, other customers can be seen reading books and enjoying their beverages. The warm lighting creates a very relaxed and focused working environment.",
    tipsVi: [
      "Nhớ miêu tả các đồ vật nhỏ: 'ceramic coffee mug', 'pair of eyeglasses'",
      "Từ vựng đắt giá: 'cozy and stylish cafe', 'typing diligently', 'relaxed working environment'"
    ]
  },

  // PART 3: RESPOND TO QUESTIONS
  {
    id: "sp-p3-01",
    part: 3,
    partTitle: "Part 3: Respond to Questions (Thói quen mua sắm trực tuyến)",
    directionsVi: "Bạn đang tham gia một cuộc khảo sát qua điện thoại về thói quen mua sắm online. Hãy trả lời câu hỏi tự nhiên trong 15 giây.",
    prepTimeSeconds: 3,
    speakTimeSeconds: 15,
    promptText: "How often do you shop online, and what kinds of items do you usually purchase?",
    modelAnswer: "I shop online about twice a week, mostly for clothes, household essentials, and books. It saves me a lot of time compared to going to physical shopping centers.",
    tipsVi: [
      "Trả lời trực tiếp 2 vế: Tần suất (twice a week) + Mặt hàng (clothes, essentials)",
      "Bổ sung 1 câu lý do: 'It saves me a lot of time...'"
    ]
  },
  {
    id: "sp-p3-02",
    part: 3,
    partTitle: "Part 3: Respond to Questions (Ưu điểm của mua sắm online)",
    directionsVi: "Trả lời câu hỏi chi tiết trong 30 giây: Bạn thích mua sắm online hay trực tiếp tại cửa hàng hơn và tại sao?",
    prepTimeSeconds: 3,
    speakTimeSeconds: 30,
    promptText: "Do you prefer shopping online or in physical stores? Why?",
    modelAnswer: "Personally, I definitely prefer shopping online for two primary reasons. First and foremost, convenience is unbeatable because I can place orders from the comfort of my home at any time. Second, online platforms frequently offer fantastic discount vouchers and free shipping, which helps me save a significant amount of money.",
    tipsVi: [
      "Mở đầu rõ ràng: 'Personally, I definitely prefer... for two primary reasons'",
      "Dùng liên từ phân tầng: 'First and foremost...', 'Second,...'"
    ]
  },

  // PART 4: RESPOND TO QUESTIONS USING INFORMATION PROVIDED
  {
    id: "sp-p4-01",
    part: 4,
    partTitle: "Part 4: Respond using information (Lịch trình hội nghị kinh doanh)",
    directionsVi: "Dựa vào bảng thông tin lịch trình hội thảo công nghệ, trả lời câu hỏi của khách tham dự.",
    prepTimeSeconds: 45,
    speakTimeSeconds: 15,
    promptText: "What time does the keynote speech begin, and who will be the main speaker?",
    imageUrl: "/images/part1/p1_07.jpg",
    tableData: [
      { "Thời gian": "09:00 AM - 10:30 AM", "Nội dung": "Keynote: Artificial Intelligence in Modern Business", "Diễn giả": "Dr. Sarah Jenkins (Room A)" },
      { "Thời gian": "10:45 AM - 12:00 PM", "Nội dung": "Panel Discussion: Future of Cloud Computing", "Diễn giả": "Tech Leaders Panel (Room B)" },
      { "Thời gian": "12:00 PM - 01:30 PM", "Nội dung": "Networking Lunch & Exhibition", "Diễn giả": "Grand Ballroom" }
    ],
    modelAnswer: "The keynote speech is scheduled to begin at 9:00 AM, and it will be delivered by Dr. Sarah Jenkins in Room A.",
    tipsVi: [
      "Mẫu câu chuẩn xác: 'The keynote speech is scheduled to begin at [Time], and it will be presented/delivered by [Name].'"
    ]
  },

  // PART 5: EXPRESS AN OPINION
  {
    id: "sp-p5-01",
    part: 5,
    partTitle: "Part 5: Express an opinion (Làm việc từ xa vs Văn phòng)",
    directionsVi: "Bày tỏ quan điểm của bạn trong 60 giây: Theo bạn, làm việc từ xa (Work from home) hay làm việc tại văn phòng truyền thống mang lại nhiều lợi ích hơn?",
    prepTimeSeconds: 45,
    speakTimeSeconds: 60,
    promptText: "Do you think working from home offers more benefits than working in a traditional office? Give specific reasons and examples to support your opinion.",
    modelAnswer: "In my opinion, working from home provides significantly more benefits than working in a traditional office. Firstly, it eliminates the daily commute, allowing employees to save considerable time, energy, and transportation expenses. For instance, rather than spending two hours stuck in traffic every day, workers can allocate that time to family, exercise, or completing urgent tasks. Secondly, remote work offers greater flexibility and autonomy, which often leads to higher job satisfaction and improved mental well-being. Although office interactions are valuable, modern digital tools like Zoom and Slack make communication seamless. Therefore, I strongly believe that remote work is a far more advantageous model.",
    tipsVi: [
      "Dàn bài 4 phần: 1. Khẳng định lập trường (1 câu) -> 2. Lý do 1 + Ví dụ (2-3 câu) -> 3. Lý do 2 + Phân tích (2-3 câu) -> 4. Kết luận ngắn (1 câu).",
      "Từ nối quan điểm: 'In my opinion...', 'Firstly,...', 'For instance,...', 'Secondly,...', 'Therefore, I strongly believe that...'"
    ]
  }
];
