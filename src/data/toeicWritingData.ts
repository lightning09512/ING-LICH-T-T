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
];
