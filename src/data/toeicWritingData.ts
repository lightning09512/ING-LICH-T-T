export interface WritingQuestion {
  id: string;
  testId: string;
  testName: string;
  part: 1 | 2 | 3;
  partTitle: string;
  questionNumber: number; // 1 to 8
  directionsVi: string;
  timeLimitMinutes: number;
  promptText: string;
  imageUrl?: string; // Dành cho Part 1
  keywords?: string[]; // 2 từ khóa bắt buộc cho Part 1
  emailContext?: {
    from: string;
    to: string;
    date: string;
    subject: string;
    body: string;
    requirementsVi: string[];
  };
  essayPrompt?: {
    topic: string;
    background: string;
    recommendedWords: number;
  };
  modelAnswer: string;
  templateVi?: string; // Dàn bài mẫu / Khung sườn gợi ý cho Nóc Nhà
  tipsVi: string[];
}

export const TOEIC_WRITING_TESTS = [
  { id: "study4-wr-01", name: "STUDY4 Practice Test 01 (ETS Chuẩn)", desc: "8 câu: Viết câu theo tranh, 2 Email & Bài luận 300 từ", badge: "Đề Hot" },
  { id: "study4-wr-02", name: "STUDY4 Practice Test 02 (Thư Tín Công Sở)", desc: "Xử lý khiếu nại khách hàng, đề xuất dự án & Luận quản lý", badge: "Mới Cập Nhật" },
  { id: "study4-wr-03", name: "STUDY4 Practice Test 03 (Dịch Vụ & Logistics)", desc: "Bồi thường hư hại vận chuyển, tư vấn ERP & Luận đào tạo nội bộ", badge: "Mục Tiêu 180+" },
  { id: "study4-wr-04", name: "STUDY4 Practice Test 04 (Marketing & Dự Án)", desc: "Chiến dịch quảng bá số, di dời văn phòng & Luận gắn kết nhân sự", badge: "ETS Chuẩn" },
  { id: "study4-wr-05", name: "STUDY4 Practice Test 05 (Đàm Phán & Nhân Sự)", desc: "Thương lượng hợp đồng đối tác, phân bổ nguồn lực & Luận đánh giá KPI", badge: "Thử Thách 200" },
];

export const TOEIC_WRITING_PARTS = [
  { id: 1, name: "Part 1: Viết câu theo tranh", desc: "Write a sentence based on a picture (Câu 1 - 5)", icon: "🖼️" },
  { id: 2, name: "Part 2: Trả lời Email / Thư yêu cầu", desc: "Respond to a written request (Câu 6 - 7)", icon: "✉️" },
  { id: 3, name: "Part 3: Viết bài luận thể hiện quan điểm", desc: "Write an opinion essay (Câu 8)", icon: "📝" },
];

export const TOEIC_WRITING_QUESTIONS: WritingQuestion[] = [
  // ==========================================
  // STUDY4 PRACTICE TEST 01 (8 CÂU CHUẨN ETS)
  // ==========================================
  {
    id: "wr-t1-q1",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    questionNumber: 1,
    directionsVi: "Hãy viết ĐÚNG MỘT CÂU hoàn chỉnh miêu tả bức tranh, bắt buộc phải sử dụng HAI TỪ KHÓA: 'man' và 'walk'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words. You may change the form of the words and use them in any order.",
    imageUrl: "/images/part1/p1_01.jpg",
    keywords: ["man", "walk"],
    modelAnswer: "A man is walking along the platform while carrying his luggage.",
    tipsVi: [
      "Bắt buộc chỉ viết đúng 1 câu duy nhất (kết thúc bằng 1 dấu chấm). Không viết 2 câu rời rạc.",
      "Ưu tiên dùng thì Hiện tại tiếp diễn (S + is/are + V-ing)."
    ]
  },
  {
    id: "wr-t1-q2",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    questionNumber: 2,
    directionsVi: "Viết MỘT CÂU miêu tả phòng họp, sử dụng 2 từ khóa: 'discuss' và 'table'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_02.jpg",
    keywords: ["discuss", "table"],
    modelAnswer: "The colleagues are sitting around the table to discuss their quarterly project report.",
    tipsVi: [
      "Từ 'discuss' không đi kèm giới từ 'about'. Dùng cụm 'around the table' để miêu tả vị trí ngồi."
    ]
  },
  {
    id: "wr-t1-q3",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    questionNumber: 3,
    directionsVi: "Viết MỘT CÂU miêu tả người làm việc tại bàn, sử dụng 2 từ khóa: 'laptop' và 'while'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_03.jpg",
    keywords: ["laptop", "while"],
    modelAnswer: "The woman is typing on her laptop while taking notes in a notebook.",
    tipsVi: [
      "Liên từ 'while' rất thích hợp để nối 2 hành động song song (typing while taking notes)."
    ]
  },
  {
    id: "wr-t1-q4",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    questionNumber: 4,
    directionsVi: "Viết MỘT CÂU miêu tả tài liệu trên kệ sách, sử dụng 2 từ khóa: 'organize' và 'shelf'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_04.jpg",
    keywords: ["organize", "shelf"],
    modelAnswer: "The books and folders have been neatly organized on the wooden shelves.",
    tipsVi: [
      "Dùng bị động hiện tại hoàn thành: 'have been organized on the wooden shelves'."
    ]
  },
  {
    id: "wr-t1-q5",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    questionNumber: 5,
    directionsVi: "Viết MỘT CÂU miêu tả cảnh siêu thị / cửa hàng, sử dụng 2 từ khóa: 'customer' và 'pay'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_05.jpg",
    keywords: ["customer", "pay"],
    modelAnswer: "A customer is paying for her groceries with a credit card at the checkout counter.",
    tipsVi: [
      "Dùng cụm 'pay for something' + 'at the checkout counter'."
    ]
  },
  {
    id: "wr-t1-q6",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Khiếu nại giao trễ hàng)",
    questionNumber: 6,
    directionsVi: "Đọc email khiếu nại của khách hàng. Viết email phản hồi với tư cách là Customer Service Manager: xin lỗi & giải thích lý do, đưa ra 2 giải pháp bồi thường thỏa đáng.",
    timeLimitMinutes: 10,
    promptText: "Respond to the email as if you are the Customer Service Manager. In your email, apologize and explain the shipping delay, and offer TWO solutions to compensate the customer.",
    emailContext: {
      from: "David Miller <d.miller@techsolutions.com>",
      to: "Customer Support <support@officeprime.com>",
      date: "October 14, 2026 09:30 AM",
      subject: "Urgent: Order #OP-8829 Delivery Delay",
      body: "Dear Customer Support,\n\nI ordered 10 office chairs and 5 conference tables two weeks ago for our upcoming branch opening next Monday. However, the order tracking still shows 'Processing'. This delay is causing a serious disruption to our schedule.\n\nCould you please let me know what happened and when my order will be delivered?\n\nSincerely,\nDavid Miller",
      requirementsVi: [
        "Gửi lời xin lỗi chân thành về sự cố giao trễ",
        "Giải thích lý do khách quan (chuỗi cung ứng bị gián đoạn)",
        "Đưa ra 2 giải pháp cụ thể (giao hàng hỏa tốc miễn phí + hoàn tiền giảm giá 20%)"
      ]
    },
    templateVi: `Dear Mr. Miller,\n\nThank you for contacting Office Prime regarding order #OP-8829.\n\nFirst and foremost, please accept our sincere apologies for the delay and any inconvenience it has caused to your branch opening schedule...\n\nTo resolve this issue promptly, we would like to offer the following solutions:\n1. First, we have upgraded your shipping to express delivery at no extra cost, ensuring the items arrive by this Friday.\n2. Second, we have credited a 20% refund to your original payment method.\n\nSincerely,\nCustomer Service Manager`,
    modelAnswer: `Dear Mr. Miller,\n\nThank you for reaching out to Office Prime regarding your recent order #OP-8829.\n\nPlease accept our sincere apologies for the delay in processing your order and the inconvenience it has caused to your branch opening preparations. Due to an unexpected surge in demand and a temporary warehouse system upgrade early this week, your shipment experienced a delay.\n\nTo resolve this issue and support your upcoming event, we have taken the following immediate actions:\n1. We have expedited your order via express courier at our own expense, and the shipment is scheduled to arrive at your office by Friday, October 17th.\n2. We have credited a 20% refund to your original payment method, along with a 15% discount voucher for your next order.\n\nWe deeply value your business and are committed to ensuring a seamless delivery. Please feel free to reach out if you require any further assistance.\n\nSincerely,\nEmily Watson\nCustomer Service Manager`,
    tipsVi: [
      "Bố cục email chuẩn: Lời chào (Dear Mr. Miller) -> Xin lỗi -> 2 Giải pháp (Bullet points) -> Lời kết lịch sự."
    ]
  },
  {
    id: "wr-t1-q7",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Dời lịch phỏng vấn)",
    questionNumber: 7,
    directionsVi: "Đọc thư từ ứng viên xin dời lịch hẹn. Viết thư xác nhận đồng ý, đề xuất 2 mốc giờ mới và yêu cầu gửi trước CV cập nhật.",
    timeLimitMinutes: 10,
    promptText: "Respond to the job applicant's email. Confirm your agreement to reschedule the interview, suggest TWO alternative dates/times, and request an updated resume.",
    emailContext: {
      from: "Sarah Jenkins <s.jenkins@email.com>",
      to: "HR Department <recruitment@novaglobal.com>",
      date: "November 03, 2026 02:15 PM",
      subject: "Request to Reschedule Interview - Marketing Coordinator Position",
      body: "Dear Hiring Team,\n\nThank you for inviting me to interview for the Marketing Coordinator position this Thursday at 10:00 AM. Unfortunately, due to an unavoidable personal emergency, I will not be able to attend at that time.\n\nWould it be possible to reschedule the interview for another day? I apologize for any inconvenience caused.\n\nBest regards,\nSarah Jenkins",
      requirementsVi: [
        "Xác nhận đồng ý dời lịch phỏng vấn",
        "Đề xuất 2 khung giờ thay thế cụ thể (thứ Sáu 2:00 PM hoặc thứ Hai 10:00 AM)",
        "Yêu cầu gửi trước CV cập nhật"
      ]
    },
    templateVi: `Dear Ms. Jenkins,\n\nThank you for letting us know in advance regarding your interview for the Marketing Coordinator position.\n\nWe completely understand and are glad to reschedule. We can offer you two alternative time slots:\n1. Friday, November 6th, at 2:00 PM\n2. Monday, November 9th, at 10:00 AM\n\nPlease let us know which of these options works best for you. Additionally, please reply with your most updated resume prior to the interview.\n\nBest regards,\nHR Recruitment Team`,
    modelAnswer: `Dear Ms. Jenkins,\n\nThank you for letting us know in advance regarding your interview for the Marketing Coordinator position.\n\nWe understand that unexpected circumstances arise, and we are glad to accommodate your request to reschedule. We would like to propose the following two alternative slots:\n1. Friday, November 6th, at 2:00 PM\n2. Monday, November 9th, at 10:00 AM\n\nPlease confirm which time is most convenient for you so we can reserve the meeting room. In addition, could you please attach your most updated resume and portfolio before your scheduled session?\n\nWe look forward to speaking with you soon.\n\nBest regards,\nMark Evans\nHead of Talent Acquisition\nNova Global`,
    tipsVi: [
      "Luôn giữ giọng văn đồng cảm nhưng chuyên nghiệp: 'We understand that unexpected circumstances arise'."
    ]
  },
  {
    id: "wr-t1-q8",
    testId: "study4-wr-01",
    testName: "STUDY4 Practice Test 01",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Làm việc từ xa vs Văn phòng)",
    questionNumber: 8,
    directionsVi: "Hãy viết bài luận học thuật tối thiểu 300 từ trình bày quan điểm của bạn về: Làm việc từ xa (Work from home) hay Làm việc tại văn phòng truyền thống mang lại nhiều lợi ích hơn?",
    timeLimitMinutes: 30,
    promptText: "Some companies allow their employees to work from home, while others require them to come to the office every day. Which approach do you think is more beneficial for employees and organizations? Support your opinion with specific reasons and examples.",
    essayPrompt: {
      topic: "Remote Working vs. Office Working",
      background: "The debate over remote vs in-office work arrangements has intensified globally.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN CHUẨN TOEIC WRITING 300 TỪ:\n\n1. INTRODUCTION (Mở bài: 40 - 50 từ):\n- Hook/Lead-in: In recent years, the concept of remote working has sparked widespread debate across corporate environments.\n- Thesis Statement: In my opinion, allowing employees to work remotely offers far greater benefits in terms of productivity, work-life balance, and operational cost savings.\n\n2. BODY 1 (Lợi ích về Năng suất & Cân bằng cuộc sống: 100 - 120 từ):\n- Topic Sentence: First and foremost, remote work substantially improves employee well-being and productivity.\n- Explanation: Without lengthy daily commutes, workers save hours each week, reducing stress.\n- Example: For instance, employees can organize flexible schedules, leading to higher focus.\n\n3. BODY 2 (Lợi ích về Chi phí cho Doanh nghiệp: 100 - 120 từ):\n- Topic Sentence: Furthermore, organizations can achieve significant cost reductions and recruit top global talent.\n- Explanation: Companies do not need to invest heavily in massive office facilities and utilities.\n\n4. CONCLUSION (Kết bài: 40 - 50 từ):\n- Summary & Restatement: In conclusion, remote work is a modern and superior arrangement.`,
    modelAnswer: `In recent years, the rapid advancement of digital communication technologies has revolutionized traditional working environments. While some traditional corporations continue to mandate on-site attendance, an increasing number of organizations are embracing remote work. In my view, offering remote work options provides far greater advantages for both employee well-being and overall organizational productivity.\n\nFirst and foremost, remote working substantially enhances employees' mental well-being and personal productivity. Commuting during rush hours in metropolitan areas is notoriously stressful and time-consuming, often consuming two to three hours every single day. By working from home, workers can reclaim this valuable time, which can then be dedicated to rest, exercise, or spending quality time with family. For example, a recent survey among tech professionals revealed that employees working remotely reported lower burnout rates and higher job satisfaction compared to their office-bound counterparts. A happier workforce naturally translates into higher efficiency and lower employee turnover.\n\nFurthermore, from an organizational standpoint, adopting remote policies leads to substantial cost reductions and access to a broader talent pool. Maintaining commercial office spaces in central business districts entails exorbitant expenses, including high rents, utilities, and administrative maintenance. By transitioning to remote or hybrid setups, businesses can downsize office facilities and reallocate those capital investments into technological innovation and employee compensation. In addition, companies are no longer geographically constrained to local applicants; they can recruit top-tier experts from anywhere in the world, fostering international diversity and driving innovation.\n\nIn conclusion, although working in a physical office facilitates immediate face-to-face interactions, the profound benefits of remote work—such as increased flexibility, lower commuting stress, and reduced operational costs—far outweigh any potential drawbacks. Therefore, modern enterprises should proactively adopt flexible remote work arrangements to thrive in the modern global economy.`,
    tipsVi: [
      "Đặt mục tiêu viết từ 300 đến 350 từ.",
      "Chia bài viết thành 4 đoạn rõ ràng (Mở bài - Thân bài 1 - Thân bài 2 - Kết bài) với 1 dòng trống giữa các đoạn."
    ]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 02 (8 CÂU)
  // ==========================================
  {
    id: "wr-t2-q1",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    questionNumber: 1,
    directionsVi: "Viết MỘT CÂU miêu tả nhân viên đang trao đổi trước bảng trắng, sử dụng 2 từ: 'present' và 'whiteboard'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_06.jpg",
    keywords: ["present", "whiteboard"],
    modelAnswer: "A presenter is pointing at the diagrams drawn on the whiteboard to explain the sales strategy.",
    tipsVi: [
      "Dùng 'presenter' hoặc động từ 'is presenting' + 'on the whiteboard'."
    ]
  },
  {
    id: "wr-t2-q2",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    questionNumber: 2,
    directionsVi: "Viết MỘT CÂU miêu tả người đang gọi điện thoại tại bàn làm việc, sử dụng: 'phone' và 'desk'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_07.jpg",
    keywords: ["phone", "desk"],
    modelAnswer: "The employee is talking on the telephone while seated at her wooden desk.",
    tipsVi: [
      "Dùng cụm 'seated at her desk' hoặc 'talking on the phone'."
    ]
  },
  {
    id: "wr-t2-q3",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    questionNumber: 3,
    directionsVi: "Viết MỘT CÂU miêu tả khách hàng tại quầy thông tin, sử dụng: 'inquire' và 'counter'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_08.jpg",
    keywords: ["inquire", "counter"],
    modelAnswer: "A traveler is inquiring about flight schedules at the service counter.",
    tipsVi: [
      "Dùng 'inquire about something' (hỏi về cái gì) + 'at the service counter'."
    ]
  },
  {
    id: "wr-t2-q4",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    questionNumber: 4,
    directionsVi: "Viết MỘT CÂU miêu tả công nhân kiểm tra thiết bị, sử dụng: 'inspect' và 'machine'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_09.jpg",
    keywords: ["inspect", "machine"],
    modelAnswer: "The technician wearing a safety helmet is carefully inspecting the factory machine.",
    tipsVi: [
      "Dùng trạng từ bổ nghĩa 'carefully inspecting the machine'."
    ]
  },
  {
    id: "wr-t2-q5",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    questionNumber: 5,
    directionsVi: "Viết MỘT CÂU miêu tả người đi bộ qua đường, sử dụng: 'cross' và 'street'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_10.jpg",
    keywords: ["cross", "street"],
    modelAnswer: "Several pedestrians are crossing the busy street at the designated crosswalk.",
    tipsVi: [
      "Dùng 'pedestrians are crossing the street at the crosswalk'."
    ]
  },
  {
    id: "wr-t2-q6",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Gợi ý tổ chức tiệc cuối năm)",
    questionNumber: 6,
    directionsVi: "Viết email phản hồi trưởng ban tổ chức: Đề xuất 2 địa điểm tổ chức tiệc và gợi ý 1 hoạt động teambuilding gắn kết nhân viên.",
    timeLimitMinutes: 10,
    promptText: "Respond to the HR director's email by recommending TWO potential venues for the annual gala dinner and ONE team-bonding activity.",
    emailContext: {
      from: "Rebecca Taylor <r.taylor@company.com>",
      to: "All Staff <staff@company.com>",
      date: "December 01, 2026 10:00 AM",
      subject: "Brainstorming Ideas for Annual Company Gala Dinner",
      body: "Hi Everyone,\n\nWe are in the process of planning our Annual Company Year-End Gala Dinner for this coming January. We want this event to be memorable and enjoyable for all employees.\n\nCould you please suggest potential locations for the event, along with an engaging activity we could organize during the evening?\n\nThank you,\nRebecca Taylor\nHead of HR",
      requirementsVi: [
        "Đề xuất 2 địa điểm tổ chức cụ thể (ví dụ: nhà hàng ven sông Riverside hoặc khách sạn 5 sao trung tâm)",
        "Gợi ý 1 trò chơi / hoạt động teambuilding (ví dụ: bốc thăm may mắn Lucky Draw hoặc biểu diễn văn nghệ phòng ban)"
      ]
    },
    templateVi: `Dear Ms. Taylor,\n\nThank you for inviting us to contribute ideas for the upcoming Annual Gala Dinner.\n\nRegarding the venue, I would like to propose two great options:\n1. Riverside Palace Hotel: It has a spacious ballroom and a scenic view by the water.\n2. The Grand Plaza Hotel: Conveniently located in the city center with excellent catering.\n\nAs for the activity, I suggest hosting an inter-departmental musical talent show or a lucky draw with exciting tech prizes.\n\nBest regards,\nMarketing Team`,
    modelAnswer: `Dear Ms. Taylor,\n\nThank you for giving us the opportunity to share ideas for our upcoming Annual Year-End Gala Dinner.\n\nRegarding the venue, I would like to suggest two excellent locations:\n1. Riverside Garden Palace: It offers a spacious banquet hall with breathtaking waterfront views, which would create a memorable dining ambiance.\n2. The Grand Landmark Hotel: Situated centrally in District 1, it provides top-tier catering services and ample parking for all staff.\n\nFor an engaging activity, I highly recommend organizing an 'Inter-Departmental Trivia Quiz & Lucky Draw'. This interactive game will encourage team camaraderie while giving everyone an equal chance to win exciting prizes.\n\nPlease let me know if you need further details or assistance with event logistics.\n\nBest regards,\nDaniel Nguyen\nMarketing Specialist`,
    tipsVi: [
      "Trả lời đúng 2 địa điểm + 1 hoạt động như đề bài yêu cầu."
    ]
  },
  {
    id: "wr-t2-q7",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Gia hạn thời gian nộp báo cáo)",
    questionNumber: 7,
    directionsVi: "Viết email phản hồi trưởng nhóm xin gia hạn nộp báo cáo tài chính thêm 3 ngày: Nêu lý do chính đáng và cam kết tiến độ.",
    timeLimitMinutes: 10,
    promptText: "Respond to your team leader requesting a 3-day deadline extension for the quarterly financial report. Provide valid reasons and guarantee timely completion.",
    emailContext: {
      from: "Arthur Campbell <a.campbell@globalfinance.com>",
      to: "Finance Team <finance@globalfinance.com>",
      date: "May 10, 2026 11:30 AM",
      subject: "Reminder: Q2 Financial Report Submission Deadline",
      body: "Dear Finance Associates,\n\nPlease be reminded that the final draft of the Q2 financial audit report is due this Friday at 5:00 PM. We must consolidate the numbers before presenting to the board of directors next Tuesday.\n\nPlease confirm your submission status.\n\nRegards,\nArthur Campbell",
      requirementsVi: [
        "Xin phép gia hạn deadline thêm 3 ngày (đến thứ Hai tuần sau)",
        "Nêu lý do bất khả kháng (đang đợi số liệu kiểm toán độc lập từ chi nhánh nước ngoài)",
        "Cam kết chất lượng và thời hạn nộp chính xác"
      ]
    },
    templateVi: `Dear Mr. Campbell,\n\nThank you for the reminder regarding the Q2 financial audit report.\n\nI am writing to respectfully request a three-day extension until next Monday at 12:00 PM...\n\nSincerely,\nFinance Associate`,
    modelAnswer: `Dear Mr. Campbell,\n\nThank you for the reminder regarding the submission deadline for the Q2 financial audit report.\n\nI am writing to respectfully request a three-day deadline extension until next Monday, May 15th, at 12:00 PM. While our internal analysis is largely complete, we are currently waiting for the verified international branch audit numbers from our Singapore office, which are expected to arrive by Friday afternoon.\n\nGranting this extension will ensure that our consolidated report is thoroughly vetted, accurate, and completely free of discrepancies before the board presentation. I will personally work over the weekend to finalize the charts and deliverables.\n\nThank you very much for your understanding and continuous support.\n\nSincerely,\nJessica Tran\nSenior Financial Analyst`,
    tipsVi: [
      "Lời xin phép nhã nhặn: 'respectfully request a three-day extension'.",
      "Lý do thuyết phục và cam kết chịu trách nhiệm."
    ]
  },
  {
    id: "wr-t2-q8",
    testId: "study4-wr-02",
    testName: "STUDY4 Practice Test 02",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Làm việc nhóm vs Làm việc độc lập)",
    questionNumber: 8,
    directionsVi: "Hãy viết bài luận 300 từ: Bạn thích làm việc theo nhóm (working in teams) hay làm việc độc lập (working independently)? Nêu lý do và ví dụ minh họa.",
    timeLimitMinutes: 30,
    promptText: "Some people prefer to work as part of a team, while others prefer to work independently on their own tasks. Which working style do you think is more effective? Give specific reasons and examples to support your view.",
    essayPrompt: {
      topic: "Teamwork vs. Independent Work",
      background: "Both collaborative teamwork and solo execution play crucial roles in modern workplace success.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN:\n1. Mở bài: Khẳng định chọn Teamwork vì sức mạnh tổng hợp và đa dạng góc nhìn.\n2. Thân bài 1: Teamwork giúp kết hợp các kỹ năng khác nhau để giải quyết bài toán phức tạp.\n3. Thân bài 2: Teamwork giảm tải áp lực cá nhân và nâng cao tinh thần đoàn kết.\n4. Kết bài: Tóm tắt lại và kết luận Teamwork là yếu tố cốt lõi thành công.`,
    modelAnswer: `In today's interconnected corporate landscape, accomplishing ambitious projects requires exceptional performance. While working independently provides autonomy and allows individuals to focus without distractions, I strongly believe that working as part of a team is far more effective in achieving long-term professional success and innovation.\n\nTo begin with, collaboration allows diverse skill sets and perspectives to converge, leading to superior problem-solving capabilities. In modern industries such as software engineering, marketing, and medicine, complex tasks cannot be mastered by a single individual alone. When people collaborate, each team member brings unique strengths to the table. For instance, in launching a new tech product, designers, engineers, and marketers must brainstorm collectively to ensure that technical functionality aligns seamlessly with user experience and market expectations. The exchange of different viewpoints sparks creativity and prevents blind spots that individual workers might overlook.\n\nMoreover, teamwork significantly alleviates individual pressure and enhances productivity through effective delegation. When tackling massive workloads alone, an employee is susceptible to severe stress and burnout, which ultimately impairs decision-making quality. In contrast, in a well-coordinated team, responsibilities are distributed according to personal expertise, ensuring that tasks are executed concurrently and efficiently. Furthermore, teammates can support one another during crises, providing constructive feedback and mutual motivation. This emotional and professional camaraderie fosters a resilient corporate culture where employees feel supported and valued.\n\nIn conclusion, although independent work has its merits in cultivating individual focus and self-discipline, collaborative teamwork remains indispensable for solving complex problems, fostering innovation, and maintaining sustainable productivity. For these reasons, mastering the art of collaboration is an essential prerequisite for thriving in the modern professional world.`,
    tipsVi: [
      "Luôn có ví dụ thực tế minh họa trong các đoạn thân bài (For instance, in launching a new tech product...).",
      "Giữ giọng điệu khách quan, trang trọng (tránh viết tắt như don't, can't - hãy viết do not, cannot)."
    ]
  }
,

  // ==========================================
  // STUDY4 PRACTICE TEST 03 (8 CÂU)
  // ==========================================
  {
    id: "wr-t3-q1",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    questionNumber: 1,
    directionsVi: "Viết MỘT CÂU miêu tả các chuyên gia đang nghiên cứu bản vẽ/tài liệu, sử dụng: 'review' và 'document'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_11.jpg",
    keywords: ["review", "document"],
    modelAnswer: "The architects are carefully reviewing the project documents spread out on the conference table.",
    tipsVi: [
      "Dùng thì Hiện tại tiếp diễn: 'are reviewing the documents'."
    ]
  },
  {
    id: "wr-t3-q2",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    questionNumber: 2,
    directionsVi: "Viết MỘT CÂU miêu tả nhân viên giao hàng đang khiêng kiện hàng, sử dụng: 'package' và 'deliver'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_12.jpg",
    keywords: ["package", "deliver"],
    modelAnswer: "A courier is delivering a cardboard package to the reception desk.",
    tipsVi: [
      "Dùng cụm 'is delivering a package to...'."
    ]
  },
  {
    id: "wr-t3-q3",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    questionNumber: 3,
    directionsVi: "Viết MỘT CÂU miêu tả kỹ thuật viên đang lắp ráp linh kiện, sử dụng: 'assemble' và 'component'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_13.jpg",
    keywords: ["assemble", "component"],
    modelAnswer: "The assembly line worker is assembling electronic components using precision tools.",
    tipsVi: [
      "Dùng 'is assembling electronic components'."
    ]
  },
  {
    id: "wr-t3-q4",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    questionNumber: 4,
    directionsVi: "Viết MỘT CÂU miêu tả nhân viên vệ sinh đang lau sàn nhà, sử dụng: 'clean' và 'floor'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_14.jpg",
    keywords: ["clean", "floor"],
    modelAnswer: "A janitor is cleaning the hallway floor with a mop near the office entrance.",
    tipsVi: [
      "Dùng 'is cleaning the floor with a mop'."
    ]
  },
  {
    id: "wr-t3-q5",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    questionNumber: 5,
    directionsVi: "Viết MỘT CÂU miêu tả hai đối tác bắt tay nhau ký kết, sử dụng: 'shake' và 'agreement'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_15.jpg",
    keywords: ["shake", "agreement"],
    modelAnswer: "The business executives are shaking hands after reaching a mutual partnership agreement.",
    tipsVi: [
      "Dùng 'are shaking hands after reaching an agreement'."
    ]
  },
  {
    id: "wr-t3-q6",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Bồi thường kiện hàng gốm sứ bị vỡ)",
    questionNumber: 6,
    directionsVi: "Đọc khiếu nại của khách hàng về kiện hàng gốm sứ bị vỡ trong lúc vận chuyển. Viết thư phản hồi: xin lỗi, giải thích thủ tục bồi thường và đề xuất gửi hàng thay thế hỏa tốc.",
    timeLimitMinutes: 10,
    promptText: "Respond to the customer's damage complaint. Express sincere apologies, explain the warranty claim process, and offer to ship an immediate replacement at no cost.",
    emailContext: {
      from: "Helena Rostova <h.rostova@interiordesign.com>",
      to: "Customer Support <support@ceramicslux.com>",
      date: "September 18, 2026 03:45 PM",
      subject: "Damaged Items in Order #CL-4412",
      body: "Dear Customer Support,\n\nUpon opening shipment #CL-4412 delivered today, I was disappointed to find that three out of ten ceramic vases were completely shattered during transit. We need these centerpieces for a private gala dinner this coming Saturday.\n\nPlease advise immediately on how you will resolve this situation.\n\nSincerely,\nHelena Rostova",
      requirementsVi: [
        "Xin lỗi chân thành về sự cố hàng hóa hư hại trong quá trình vận chuyển",
        "Đề xuất gửi ngay 3 bình hoa mới thay thế qua đường chuyển phát hỏa tốc (Express 24h) miễn phí",
        "Tặng mã giảm giá 25% cho đơn hàng tiếp theo để thể hiện thiện chí"
      ]
    },
    templateVi: `Dear Ms. Rostova,\n\nThank you for bringing this issue to our attention. We sincerely apologize for the damaged ceramic vases in order #CL-4412...\n\nTo resolve this immediately before your Saturday event:\n1. We have already dispatched three replacement vases via 24-hour priority air express at no charge.\n2. We have issued a 25% discount voucher for your next order.\n\nSincerely,\nCustomer Support Team`,
    modelAnswer: `Dear Ms. Rostova,\n\nThank you for reaching out to Ceramics Lux regarding order #CL-4412. Please accept our deepest apologies for the damaged ceramic vases you discovered upon unpacking your delivery. We completely understand how critical these centerpieces are for your upcoming gala dinner this Saturday.\n\nTo rectify this situation immediately, we have taken the following steps:\n1. Our warehouse has already prepared and dispatched three brand new replacement vases via 24-hour priority express courier at our own expense. They are guaranteed to arrive at your office by tomorrow afternoon, Friday, September 19th.\n2. There is no need to return the broken items; please safely dispose of them.\n3. Additionally, we have credited a 25% courtesy voucher (code: LUXRESOLVE25) to your account for future purchases.\n\nA tracking link will be emailed to you as soon as the courier scans the package. Please do not hesitate to contact us directly if you need any additional assistance.\n\nWarm regards,\nLiam Henderson\nClient Support Specialist\nCeramics Lux`,
    tipsVi: [
      "Thể hiện tinh thần trách nhiệm cao: không bắt khách hàng gửi lại đồ vỡ, gửi hỏa tốc ngay trong ngày."
    ]
  },
  {
    id: "wr-t3-q7",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Tư vấn triển khai hệ thống ERP)",
    questionNumber: 7,
    directionsVi: "Đọc email từ giám đốc doanh nghiệp vừa và nhỏ hỏi về phần mềm quản trị doanh nghiệp. Phản hồi thư: giới thiệu 2 gói dịch vụ và đặt lịch demo trực tuyến.",
    timeLimitMinutes: 10,
    promptText: "Respond to the inquiry regarding ERP software implementation for SMEs. Introduce TWO package options and propose a schedule for a live online demonstration.",
    emailContext: {
      from: "Marcus Vance <m.vance@vancemanufacturing.com>",
      to: "Sales Solutions <solutions@cloudflowerp.com>",
      date: "July 22, 2026 10:15 AM",
      subject: "Inquiry: Cloud ERP Solution for 50-person Manufacturing Plant",
      body: "Hello Sales Team,\n\nOur manufacturing company has expanded to 50 employees, and our existing manual inventory and accounting systems are becoming inadequate. We are looking for an integrated cloud-based ERP solution that is easy to deploy.\n\nCould you send information about your software tiers and let us know if a product demo is possible?\n\nBest regards,\nMarcus Vance\nManaging Director",
      requirementsVi: [
        "Cảm ơn và giới thiệu 2 gói giải pháp (Standard Cloud cho 50 user và Advanced Manufacturing)",
        "Đề xuất lịch demo trực tiếp 45 phút qua video call (thứ Ba hoặc thứ Năm tuần tới)",
        "Gửi kèm tài liệu case-study tham khảo"
      ]
    },
    templateVi: `Dear Mr. Vance,\n\nThank you for contacting CloudFlow ERP. Congratulations on your company's impressive expansion!\n\nTo address your requirements, we offer two suitable solutions:\n1. Standard Business Tier: Designed for growing teams up to 60 users with automated inventory and billing.\n2. Advanced Manufacturing Tier: Includes real-time shop floor scheduling and supply chain forecasting.\n\nWe would love to demonstrate these features live. Are you available next Tuesday at 10:00 AM or Thursday at 2:00 PM for a 45-minute interactive walkthrough?\n\nBest regards,\nCloudFlow Sales Team`,
    modelAnswer: `Dear Mr. Vance,\n\nThank you for your interest in CloudFlow ERP, and congratulations on your company's substantial business growth!\n\nTo support your 50-person manufacturing plant, we recommend two tailored ERP options:\n1. Standard Cloud Suite: Ideal for growing enterprises, offering centralized inventory tracking, automated accounting, and vendor management with rapid 2-week implementation.\n2. Advanced Manufacturing Tier: Specially equipped with shop-floor job tracking, machine capacity scheduling, and automated bill-of-materials (BOM) calculation.\n\nTo help you determine the best fit, we would be delighted to host a 45-minute personalized demonstration for you and your key managers. Would next Tuesday, July 27th at 10:00 AM or next Thursday, July 29th at 2:00 PM work for your schedule?\n\nI have also attached our recent case study featuring an industrial client who reduced inventory holding costs by 32% within six months of deployment.\n\nLooking forward to your reply.\n\nSincerely,\nSophia Martinez\nEnterprise Solutions Consultant\nCloudFlow ERP`,
    tipsVi: [
      "Trình bày rõ ràng 2 gói giải pháp và đưa ra 2 mốc thời gian cụ thể cho buổi demo."
    ]
  },
  {
    id: "wr-t3-q8",
    testId: "study4-wr-03",
    testName: "STUDY4 Practice Test 03",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Đào tạo nhân viên nội bộ vs Tuyển dụng bên ngoài)",
    questionNumber: 8,
    directionsVi: "Hãy viết bài luận 300 từ: Doanh nghiệp nên ưu tiên đầu tư ngân sách để đào tạo và nâng cao kỹ năng cho nhân viên hiện tại (Internal Training) hay tuyển dụng chuyên gia giàu kinh nghiệm từ bên ngoài (Hiring External Experts)? Nêu lý do và ví dụ.",
    timeLimitMinutes: 30,
    promptText: "When companies face new technological challenges, some prefer to invest heavily in training their existing workforce, while others choose to hire experienced external talent. Which strategy do you think is more beneficial for long-term organizational success? Give reasons and examples to justify your opinion.",
    essayPrompt: {
      topic: "Internal Employee Training vs. External Hiring",
      background: "Rapid technological disruption forces organizations to constantly rethink workforce competency strategies.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN LUẬN 300 TỪ:\n1. Introduction: Giới thiệu cuộc tranh luận giữa upskilling nội bộ và hiring bên ngoài. Khẳng định: Đầu tư đào tạo nội bộ mang lại lợi ích dài hạn bền vững hơn.\n2. Body 1: Tăng lòng trung thành (retention), giảm chi phí tuyển dụng đắt đỏ và nhân viên đã hiểu rõ văn hóa công ty.\n3. Body 2: Tạo động lực phát triển cho toàn bộ nhân sự, duy trì sự gắn kết và tinh thần làm việc.\n4. Conclusion: Khẳng định đào tạo nội bộ là nền tảng cốt lõi, kết hợp tuyển dụng bên ngoài khi thật sự cấp bách.`,
    modelAnswer: `In today's fast-evolving business landscape, organizations constantly face technological disruptions and shifting market demands. When seeking to bridge skill gaps, corporate leaders frequently debate whether to upskill existing personnel or recruit seasoned external specialists. While hiring outside experts can offer immediate proficiency, I firmly believe that investing in internal employee training yields far greater advantages for sustainable long-term organizational growth.\n\nFirst and foremost, comprehensive internal training fosters high employee loyalty and substantially decreases costly staff turnover. When an enterprise actively invests in professional development programs, employees feel genuinely valued and recognized by leadership. This sense of psychological safety and career progression encourages top performers to remain with the company rather than seeking opportunities elsewhere. Furthermore, existing staff already possess invaluable institutional knowledge—they thoroughly understand company culture, internal operational procedures, and client relationships. Consequently, when existing staff acquire new technical competencies, they can implement them with zero onboarding friction, avoiding the extensive culture shock and high recruitment commissions often associated with outside executive hires.\n\nMoreover, prioritizing continuous learning cultivates an inspiring corporate climate of innovation and motivation. When junior and mid-level employees witness their colleagues being promoted after completing rigorous training bootcamps, it creates a powerful meritocratic atmosphere where diligence is visibly rewarded. For instance, global tech leaders like Google and Toyota allocate substantial portions of their budgets to ongoing employee upskilling. These organizations have demonstrated that internally developed leaders exhibit higher dedication during corporate crises compared to imported external executives who might depart when challenges arise.\n\nIn conclusion, although recruiting outside talent is occasionally necessary for emerging specialized niches, dedicating resources to training existing employees remains the superior long-term corporate strategy. Upskilling enhances organizational loyalty, leverages institutional familiarity, and builds an adaptable workforce prepared for future disruptions.`,
    tipsVi: [
      "Sử dụng từ vựng nâng cao: 'upskill', 'bridge skill gaps', 'institutional knowledge', 'costly staff turnover', 'meritocratic atmosphere'.",
      "Đảm bảo dung lượng bài viết từ 310 đến 350 từ."
    ]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 04 (8 CÂU)
  // ==========================================
  {
    id: "wr-t4-q1",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    questionNumber: 1,
    directionsVi: "Viết MỘT CÂU miêu tả hàng hóa trưng bày trên kệ, sử dụng 2 từ khóa: 'display' và 'shelf'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_16.jpg",
    keywords: ["display", "shelf"],
    modelAnswer: "A wide variety of organic products is attractively displayed on the supermarket shelves.",
    tipsVi: [
      "Dùng bị động 'is displayed on the shelves'."
    ]
  },
  {
    id: "wr-t4-q2",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    questionNumber: 2,
    directionsVi: "Viết MỘT CÂU miêu tả người lái xe nâng trong nhà kho, sử dụng: 'operate' và 'forklift'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_17.jpg",
    keywords: ["operate", "forklift"],
    modelAnswer: "A certified warehouse operator is operating a yellow forklift to move wooden pallets.",
    tipsVi: [
      "Dùng 'is operating a forklift'."
    ]
  },
  {
    id: "wr-t4-q3",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    questionNumber: 3,
    directionsVi: "Viết MỘT CÂU miêu tả khán giả tập trung trong khán phòng, sử dụng: 'gather' và 'auditorium'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_18.jpg",
    keywords: ["gather", "auditorium"],
    modelAnswer: "A large audience has gathered inside the spacious auditorium for the annual keynote address.",
    tipsVi: [
      "Dùng 'has gathered inside the auditorium'."
    ]
  },
  {
    id: "wr-t4-q4",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    questionNumber: 4,
    directionsVi: "Viết MỘT CÂU miêu tả người ký kết hợp đồng, sử dụng: 'sign' và 'contract'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_19.jpg",
    keywords: ["sign", "contract"],
    modelAnswer: "The client is using a black fountain pen to sign the commercial lease contract.",
    tipsVi: [
      "Dùng 'to sign the contract'."
    ]
  },
  {
    id: "wr-t4-q5",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    questionNumber: 5,
    directionsVi: "Viết MỘT CÂU miêu tả hành khách lên máy bay, sử dụng: 'board' và 'airplane'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_20.jpg",
    keywords: ["board", "airplane"],
    modelAnswer: "Passengers holding their boarding passes are boarding the commercial airplane via the jet bridge.",
    tipsVi: [
      "Dùng 'are boarding the airplane'."
    ]
  },
  {
    id: "wr-t4-q6",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Kế hoạch chiến dịch Digital Marketing)",
    questionNumber: 6,
    directionsVi: "Viết email cho Giám đốc Marketing đề xuất kế hoạch tung sản phẩm mới: Đề xuất 2 kênh truyền thông hiệu quả và nêu dự toán ngân sách sơ bộ.",
    timeLimitMinutes: 10,
    promptText: "Respond to the CMO's inquiry by proposing TWO digital marketing channels for the new smart-home device launch and providing a preliminary budget estimate.",
    emailContext: {
      from: "Eleanor Sterling <e.sterling@lumitech.com>",
      to: "Marketing Strategy Team <strategy@lumitech.com>",
      date: "August 12, 2026 11:20 AM",
      subject: "Request: Launch Campaign Proposal for LumiHub Gen 3",
      body: "Hi Team,\n\nWith the upcoming launch of our LumiHub Gen 3 smart assistant next quarter, we need to finalize our primary advertising channels to reach tech-savvy millennials and young homeowners.\n\nPlease submit your recommendations regarding marketing channels and an estimated budget breakdown by tomorrow.\n\nRegards,\nEleanor Sterling\nChief Marketing Officer",
      requirementsVi: [
        "Đề xuất 2 kênh tiếp thị số cụ thể (KOL/Influencer tech review trên YouTube/TikTok + Quảng cáo tìm kiếm Google Ads)",
        "Nêu dự toán ngân sách phân bổ sơ bộ (ví dụ: $30,000 cho Influencer và $20,000 cho Search Ads)",
        "Đề xuất tổ chức buổi họp thảo luận chi tiết vào sáng thứ Năm"
      ]
    },
    templateVi: `Dear Ms. Sterling,\n\nThank you for the prompt regarding the LumiHub Gen 3 launch.\n\nTo target millennials and smart homeowners effectively, we propose focusing on two major channels:\n1. Tech Influencer Partnerships (YouTube & TikTok): Sponsoring reputable tech reviewers.\n2. Targeted Search & Social Ads (Google & Meta): Capturing active purchase-intent searches.\n\nRegarding the budget, we suggest an initial allocation of $50,000...\n\nBest regards,\nMarketing Strategy Team`,
    modelAnswer: `Dear Ms. Sterling,\n\nThank you for your guidance regarding the upcoming LumiHub Gen 3 launch. Based on our latest demographic data on smart-home buyers, we strongly recommend deploying the following two primary digital marketing channels:\n\n1. Tech Influencer Sponsorships (YouTube & TikTok): Collaborating with prominent tech creators for hands-on unboxing and integration tutorials. This builds instant consumer trust and authentic product demonstration.\n2. Intent-Based Search & Retargeting Ads (Google & Instagram): Running high-converting search keywords coupled with video remarketing ads to convert visitors who engaged with the influencer content.\n\nFor the preliminary budget, we recommend an initial capital allocation of $50,000, divided into $30,000 for influencer contracts and $20,000 for paid performance advertising over the launch month.\n\nWould you be open to a 30-minute sync this Thursday at 10:30 AM to review our creative mockups?\n\nBest regards,\nNathan Drake\nSenior Marketing Strategist\nLumiTech`,
    tipsVi: [
      "Phân bổ rõ ràng 2 kênh truyền thông và số liệu ngân sách thuyết phục."
    ]
  },
  {
    id: "wr-t4-q7",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Yêu cầu di dời văn phòng sang tầng mới)",
    questionNumber: 7,
    directionsVi: "Đọc email từ Trưởng ban Quản trị tòa nhà hỏi về tiến độ bàn giao mặt bằng văn phòng tầng 8. Viết email phản hồi xác nhận ngày chuyển, đề xuất 2 yêu cầu kỹ thuật cần hỗ trợ.",
    timeLimitMinutes: 10,
    promptText: "Respond to the building facilities manager confirming the office relocation schedule and requesting TWO specific technical setup accommodations.",
    emailContext: {
      from: "Gregory Hayes <g.hayes@metrotowerfacilities.com>",
      to: "Design Department <design@studiozenith.com>",
      date: "November 08, 2026 04:00 PM",
      subject: "Relocation Coordination - Floor 8 Renovation Completion",
      body: "Dear Studio Zenith Design Team,\n\nThe interior renovations on Floor 8 are now finalized, and the space is ready for handover. We need to confirm when your department intends to execute the physical move from Floor 4 to Floor 8.\n\nPlease let us know your planned moving date and any specific facility requirements you need from our maintenance crew.\n\nBest regards,\nGregory Hayes\nFacilities Manager",
      requirementsVi: [
        "Xác nhận ngày chuyển văn phòng chính thức (thứ Bảy tuần sau để tránh gián đoạn công việc)",
        "Đưa ra 2 yêu cầu kỹ thuật: mở khóa thang máy chở hàng từ 8:00 AM đến 2:00 PM và kiểm tra hệ thống dây cáp mạng LAN tốc độ cao",
        "Cảm ơn đội ngũ quản trị tòa nhà đã hoàn thiện mặt bằng đúng hạn"
      ]
    },
    templateVi: `Dear Mr. Hayes,\n\nThank you for notifying us regarding the completion of Floor 8 renovations.\n\nWe plan to carry out our departmental move this coming Saturday, November 14th...\n\nTo ensure a smooth transition, we kindly request two accommodations:\n1. Dedicated access to the freight elevator from 8:00 AM to 2:00 PM.\n2. A pre-move inspection of the high-speed Ethernet ports in the main design bay.\n\nSincerely,\nStudio Zenith Team`,
    modelAnswer: `Dear Mr. Hayes,\n\nThank you very much for notifying us that the Floor 8 renovations have been successfully completed. Our team is excited about transitioning into this new creative space.\n\nTo avoid disrupting our day-to-day client deliverables, we have scheduled our departmental move for this coming Saturday, November 14th, beginning at 8:30 AM.\n\nTo ensure an efficient moving process, we would greatly appreciate your assistance with two specific requirements:\n1. Freight Elevator Reservation: Granting our designated moving contractors exclusive access to freight elevator B between 8:00 AM and 2:00 PM on Saturday.\n2. Network Cabling Verification: Having an on-duty technician verify the high-speed optical fiber ports and wall LAN sockets in the central workstation area prior to Saturday morning.\n\nThank you again for your outstanding cooperation throughout this facility expansion.\n\nSincerely,\nChloe Bennett\nOperations Director\nStudio Zenith`,
    tipsVi: [
      "Ngôn từ lịch thiệp và chuyên nghiệp: 'greatly appreciate your assistance with two specific requirements'."
    ]
  },
  {
    id: "wr-t4-q8",
    testId: "study4-wr-04",
    testName: "STUDY4 Practice Test 04",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Hoạt động ngoại khóa công ty cuối tuần)",
    questionNumber: 8,
    directionsVi: "Hãy viết bài luận 300 từ: Nhiều công ty tổ chức các hoạt động ngoại khóa / teambuilding vào cuối tuần. Bạn nghĩ các hoạt động này nên là tự nguyện (Voluntary) hay bắt buộc (Mandatory) đối với nhân viên? Nêu lý do và ví dụ minh họa.",
    timeLimitMinutes: 30,
    promptText: "Many organizations organize company retreats, social dinners, and team-building events on weekends. Do you believe employee participation in weekend corporate activities should be completely voluntary, or should it be mandatory? Support your perspective with specific reasons and examples.",
    essayPrompt: {
      topic: "Voluntary vs. Mandatory Weekend Company Activities",
      background: "The boundary between personal time and corporate engagement is a growing consideration for modern professionals.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN LUẬN 300 TỪ:\n1. Introduction: Giới thiệu xu hướng teambuilding cuối tuần. Nêu quan điểm rõ ràng: Tham gia bắt buộc gây phản tác dụng, do đó các hoạt động này TUYỆT ĐỐI NÊN LÀ TỰ NGUYỆN (Strictly Voluntary).\n2. Body 1: Tôn trọng quyền riêng tư và cân bằng cuộc sống (work-life balance), phục hồi năng lượng thể chất và tinh thần.\n3. Body 2: Sự ép buộc tạo ra tâm lý ức chế, làm giảm tinh thần đoàn kết thực chất; chỉ khi tự nguyện thì nhân viên mới hào hứng.\n4. Conclusion: Tóm lược và đề xuất công ty nên tổ chức teambuilding trong giờ làm việc thay vì xâm phạm ngày nghỉ.`,
    modelAnswer: `In an effort to cultivate corporate camaraderie and boost morale, many modern enterprises arrange team-building retreats, sports festivals, and dinners during weekends. However, whether attendance should be mandatory or voluntary has sparked heated discussions. In my opinion, weekend corporate activities must be strictly voluntary, as enforcing compulsory participation infringes on personal boundaries and inadvertently diminishes employee satisfaction.\n\nFirst and foremost, weekends represent essential recovery time for employees to rejuvenate mentally and physically, as well as fulfill family commitments. Throughout a grueling forty-hour workweek, staff members expend substantial cognitive energy meeting tight deadlines and managing client demands. The weekend serves as an indispensable window to rest, engage in personal hobbies, and spend quality time with children or elderly parents. When companies mandate weekend attendance, they effectively eliminate this recovery period, leading to chronic fatigue and eventual workplace burnout. Studies consistently demonstrate that well-rested employees exhibit superior cognitive alertness and higher productivity during standard working hours compared to exhausted workers deprived of leisure.\n\nFurthermore, compelling employees to participate in mandatory weekend socializing often breeds resentment and defeats the very purpose of team building. Authentic interpersonal bonds cannot be manufactured through coercion. When reluctant employees are forced to attend under unspoken threats of professional disadvantage or poor performance reviews, the resulting atmosphere is characterized by tension and artificial compliance rather than genuine friendship. Conversely, when events are optional, individuals attend with enthusiastic and open mindsets, fostering authentic networking. If organizations genuinely desire universal participation, they should schedule team-bonding exercises during regular working hours rather than encroaching upon personal weekends.\n\nIn conclusion, while fostering team unity is undeniably beneficial, forcing employees to sacrifice their private weekend time is counterproductive. By maintaining voluntary attendance, organizations demonstrate respect for work-life balance and build a healthier, more loyal corporate workforce.`,
    tipsVi: [
      "Luận điểm rõ ràng, sử dụng các thuật ngữ như 'essential recovery time', 'chronic fatigue', 'artificial compliance', 'infringes on personal boundaries'."
    ]
  },

  // ==========================================
  // STUDY4 PRACTICE TEST 05 (8 CÂU)
  // ==========================================
  {
    id: "wr-t5-q1",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    questionNumber: 1,
    directionsVi: "Viết MỘT CÂU miêu tả các kỹ sư thảo luận bản thiết kế, sử dụng: 'discuss' và 'blueprints'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_21.jpg",
    keywords: ["discuss", "blueprints"],
    modelAnswer: "The civil engineers wearing hard hats are discussing the architectural blueprints at the job site.",
    tipsVi: [
      "Dùng 'are discussing the architectural blueprints'."
    ]
  },
  {
    id: "wr-t5-q2",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    questionNumber: 2,
    directionsVi: "Viết MỘT CÂU miêu tả người phục vụ mang đồ uống cho khách, sử dụng: 'serve' và 'beverage'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_22.jpg",
    keywords: ["serve", "beverage"],
    modelAnswer: "The friendly waitress is serving refreshing beverages to the patrons seated on the outdoor patio.",
    tipsVi: [
      "Dùng 'is serving beverages to...'."
    ]
  },
  {
    id: "wr-t5-q3",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    questionNumber: 3,
    directionsVi: "Viết MỘT CÂU miêu tả kỹ thuật viên điều chỉnh thiết bị phòng thí nghiệm, sử dụng: 'adjust' và 'equipment'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_23.jpg",
    keywords: ["adjust", "equipment"],
    modelAnswer: "A laboratory researcher is adjusting the scientific equipment before initiating the chemical trial.",
    tipsVi: [
      "Dùng 'is adjusting the scientific equipment'."
    ]
  },
  {
    id: "wr-t5-q4",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    questionNumber: 4,
    directionsVi: "Viết MỘT CÂU miêu tả diễn giả đứng tại bục phát biểu, sử dụng: 'stand' và 'podium'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_24.jpg",
    keywords: ["stand", "podium"],
    modelAnswer: "The guest speaker is standing at the podium while addressing the international conference attendees.",
    tipsVi: [
      "Dùng 'is standing at the podium while addressing...'."
    ]
  },
  {
    id: "wr-t5-q5",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    questionNumber: 5,
    directionsVi: "Viết MỘT CÂU miêu tả người đang xách cặp tài liệu trên phố, sử dụng: 'carry' và 'briefcase'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_01.jpg",
    keywords: ["carry", "briefcase"],
    modelAnswer: "A businessman in a navy suit is carrying a leather briefcase as he walks down the metropolitan avenue.",
    tipsVi: [
      "Dùng 'is carrying a leather briefcase'."
    ]
  },
  {
    id: "wr-t5-q6",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Đàm phán gia hạn hợp đồng cung cấp vật tư)",
    questionNumber: 6,
    directionsVi: "Viết email phản hồi nhà cung cấp nguyên vật liệu: Thương lượng về việc tăng giá 8%, đề xuất cam kết hợp đồng 2 năm để giữ nguyên đơn giá cũ.",
    timeLimitMinutes: 10,
    promptText: "Respond to the raw materials supplier regarding their notice of an 8% price increase. Propose a 2-year contract commitment in exchange for retaining the current price schedule.",
    emailContext: {
      from: "Victor Krum <v.krum@globalmetalsupply.com>",
      to: "Procurement Division <procurement@apexmanufacturing.com>",
      date: "October 05, 2026 09:00 AM",
      subject: "Annual Contract Renewal & Price Adjustment Notice",
      body: "Dear Apex Procurement Team,\n\nAs our current annual supply agreement expires on November 30th, we are writing to propose renewal terms. Due to rising raw material extraction costs and international shipping freight rates, we must implement an 8% price adjustment across all aluminum alloys starting next contract period.\n\nPlease let us know if you accept these renewal terms.\n\nBest regards,\nVictor Krum\nCommercial Accounts Director",
      requirementsVi: [
        "Thừa nhận áp lực lạm phát và chi phí vận tải quốc tế",
        "Đề xuất ký hợp đồng dài hạn 2 năm với cam kết giữ nguyên đơn giá hiện tại",
        "Đề nghị tổ chức buổi đàm phán trực tiếp vào đầu tuần tới"
      ]
    },
    templateVi: `Dear Mr. Krum,\n\nThank you for reaching out regarding our annual supply agreement renewal.\n\nWe fully understand the macroeconomic pressures and rising logistics costs impacting the global metal industry. However, an immediate 8% price increase would significantly impact our production budget...\n\nTo establish a win-win partnership, we would like to propose a 2-year long-term volume commitment in exchange for maintaining our existing price structure.\n\nSincerely,\nProcurement Manager`,
    modelAnswer: `Dear Mr. Krum,\n\nThank you for reaching out regarding the renewal of our supply agreement for aluminum alloys. We truly appreciate the outstanding delivery reliability and material quality Global Metal Supply has provided over the past three years.\n\nWe fully recognize the macroeconomic inflationary pressures and soaring international shipping rates your industry is currently facing. Nevertheless, absorbing an immediate 8% price hike would severely impact our operating margins and render our finished automotive components less competitive.\n\nIn order to achieve a mutually advantageous resolution, we would like to offer the following counter-proposal:\n1. Apex Manufacturing is prepared to commit to a 24-month extended supply contract with a guaranteed 15% increase in total purchase volume.\n2. In return, we request that Global Metal Supply maintain our current unit price structure for the first 12 months, with an agreed price cap of no more than 3% in year two.\n\nWe believe this extended volume security will provide your manufacturing operations with stable demand and reliable forecasting. Could we arrange a meeting next Monday at 2:00 PM to finalize the details?\n\nSincerely,\nJonathan Wu\nChief Procurement Officer\nApex Manufacturing`,
    tipsVi: [
      "Thương lượng thông minh: Đổi thời hạn hợp đồng dài hơn (24 months) và sản lượng lớn hơn (+15%) để giữ nguyên đơn giá."
    ]
  },
  {
    id: "wr-t5-q7",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Khảo sát nhu cầu đào tạo phần mềm quản trị)",
    questionNumber: 7,
    directionsVi: "Đọc email từ Trưởng phòng Đào tạo nội bộ. Phản hồi email nêu 2 kỹ năng phần mềm mà phòng ban của bạn muốn được đào tạo và đề xuất thời gian học thích hợp.",
    timeLimitMinutes: 10,
    promptText: "Respond to the Corporate Training Director indicating TWO specific business intelligence software skills your department needs and suggesting a suitable weekly training time.",
    emailContext: {
      from: "Rachel Adams <r.adams@corporatehub.com>",
      to: "Department Heads <heads@corporatehub.com>",
      date: "September 02, 2026 11:45 AM",
      subject: "Survey: Q4 Internal Software & Tech Upskilling Program",
      body: "Dear Department Managers,\n\nAs part of our continuous professional development initiatives, HR is organizing quarterly technical upskilling courses. We want to align the curriculum with your team's immediate operational needs.\n\nPlease reply with the specific data analysis software or workflow tools your team requires training on, and recommend a day/time that minimizes work disruption.\n\nBest regards,\nRachel Adams\nDirector of Talent Development",
      requirementsVi: [
        "Nêu rõ 2 kỹ năng phần mềm phân tích dữ liệu cần thiết (Power BI Dashboard và Advanced SQL Querying)",
        "Đề xuất khung giờ học lý tưởng (thứ Sáu từ 2:00 PM - 4:00 PM khi khối lượng việc giảm bớt)",
        "Ước tính số lượng nhân viên tham gia khóa học (khoảng 8 người)"
      ]
    },
    templateVi: `Dear Ms. Adams,\n\nThank you for organizing the Q4 technical upskilling program.\n\nFor the Finance and Operations team, we would like to request training on two critical tools:\n1. Microsoft Power BI: Designing automated real-time financial reporting dashboards.\n2. Advanced SQL: Querying relational databases directly for ad-hoc reports.\n\nWe recommend hosting the sessions on Friday afternoons from 2:00 PM to 4:00 PM...\n\nBest regards,\nOperations Head`,
    modelAnswer: `Dear Ms. Adams,\n\nThank you for reaching out regarding the upcoming Q4 technical upskilling initiatives. This program comes at a perfect time as our department seeks to enhance its data analytics capabilities.\n\nTo optimize our team's operational efficiency, we would like to request dedicated training on the following two competencies:\n1. Advanced Microsoft Power BI: Training on building dynamic data models and automated executive dashboards to replace manual spreadsheets.\n2. SQL Database Querying: Enabling our financial analysts to extract and query transaction data directly from our central servers without relying on IT assistance.\n\nWe estimate that 8 members from our team will actively participate. To minimize disruption to daily operations, we recommend scheduling two-hour training workshops on Friday afternoons, from 2:00 PM to 4:00 PM, when operational workloads are typically lighter.\n\nPlease let me know once the instructor schedules are confirmed.\n\nWarm regards,\nSamantha Reed\nHead of Business Operations`,
    tipsVi: [
      "Trả lời đầy đủ 3 yêu cầu: 2 công cụ (Power BI & SQL), khung giờ (Friday afternoon), số người tham gia (8 members)."
    ]
  },
  {
    id: "wr-t5-q8",
    testId: "study4-wr-05",
    testName: "STUDY4 Practice Test 05",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Đánh giá hiệu suất: Kết quả vs Thái độ & Nỗ lực)",
    questionNumber: 8,
    directionsVi: "Hãy viết bài luận 300 từ: Khi đánh giá hiệu suất nhân viên (Employee Performance Evaluation), doanh nghiệp nên chỉ căn cứ vào kết quả công việc cuối cùng (Results) hay nên tính đến cả thái độ làm việc và sự nỗ lực (Attitude and Effort)? Nêu quan điểm và ví dụ.",
    timeLimitMinutes: 30,
    promptText: "When evaluating an employee's annual performance, some business leaders argue that only tangible business results should matter, while others believe that an employee's daily attitude, work ethic, and effort are equally critical. Which approach do you consider more effective for sustainable organizational success? Give reasons and examples.",
    essayPrompt: {
      topic: "Performance Evaluation: Results vs. Attitude & Effort",
      background: "Modern human resources management actively reevaluates holistic performance metrics versus pure numerical KPIs.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN LUẬN 300 TỪ:\n1. Introduction: Nêu vấn đề đánh giá hiệu suất giữa pure results (KPI) và holistic approach (kết quả + nỗ lực/thái độ). Khẳng định: Đánh giá toàn diện cả kết quả lẫn thái độ là chiến lược vượt trội.\n2. Body 1: Nguy cơ nếu chỉ nhìn vào kết quả thuần túy: tạo ra văn hóa độc hại 'bất chấp thủ đoạn', làm hỏng tinh thần đồng đội.\n3. Body 2: Đánh giá thái độ và nỗ lực giúp nhận diện những nhân viên bền bỉ, hỗ trợ đồng đội, sẵn sàng gánh vác việc khó và có tiềm năng lãnh đạo dài hạn.\n4. Conclusion: Tái khẳng định một hệ thống đánh giá cân bằng (Balanced Assessment) sẽ giúp doanh nghiệp phát triển bền vững.`,
    modelAnswer: `In modern human resources management, establishing an equitable and effective employee evaluation system is essential for organizational health. While proponents of strict meritocracy argue that only tangible, quantifiable results should govern performance reviews, others contend that work ethic, attitude, and personal effort must carry equal weight. In my view, a holistic evaluation framework that balances measurable outcomes with attitude and diligence is far more effective in fostering sustainable long-term corporate success.\n\nTo begin with, relying exclusively on numerical KPIs can incentivize harmful behaviors and degrade corporate culture. When an organization signals that only bottom-line results matter, ambitious employees may prioritize immediate individual metrics at the expense of teamwork, ethics, and regulatory compliance. For instance, in high-pressure sales environments, salespeople might employ aggressive or deceptive tactics to hit quarterly quotas, damaging client relationships and corporate reputation. Furthermore, an overemphasis on pure results overlooks external market volatility, such as supply chain breakdowns or economic downturns, which can negatively impact outcomes despite an employee's exemplary effort and dedication.\n\nConversely, integrating work ethic and positive attitude into appraisals nurtures a collaborative and resilient organizational climate. High-performing companies depend heavily on intangible contributions, such as mentoring junior staff, resolving cross-departmental conflicts, and maintaining optimism during corporate crises. An employee who consistently demonstrates integrity, teamwork, and continuous learning often serves as the cultural glue holding an organization together. Rewarding these qualities ensures that diligent contributors feel appreciated, preventing demoralization and talent loss while cultivating future ethical leaders.\n\nIn conclusion, while tangible business results remain vital for financial viability, an effective appraisal system must never ignore character, effort, and team collaboration. By adopting a balanced evaluation methodology that honors both quantitative achievements and qualitative dedication, enterprises can inspire sustainable excellence and foster an enduring culture of integrity.`,
    tipsVi: [
      "Luận cứ sâu sắc, sử dụng các thuật ngữ chuyên ngành: 'strict meritocracy', 'quantifiable results', 'bottom-line results', 'holistic evaluation framework', 'intangible contributions'."
    ]
  }
];
