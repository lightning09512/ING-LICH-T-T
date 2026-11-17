export interface WritingQuestion {
  id: string;
  part: 1 | 2 | 3;
  partTitle: string;
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

export const TOEIC_WRITING_PARTS = [
  { id: 1, name: "Part 1: Viết câu theo tranh", desc: "Write a sentence based on a picture (Câu 1 - 5)", icon: "🖼️" },
  { id: 2, name: "Part 2: Trả lời Email / Thư yêu cầu", desc: "Respond to a written request (Câu 6 - 7)", icon: "✉️" },
  { id: 3, name: "Part 3: Viết bài luận thể hiện quan điểm", desc: "Write an opinion essay (Câu 8)", icon: "📝" },
];

export const TOEIC_WRITING_QUESTIONS: WritingQuestion[] = [
  // PART 1: WRITE A SENTENCE BASED ON A PICTURE
  {
    id: "wr-p1-01",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 1)",
    directionsVi: "Hãy viết ĐÚNG MỘT CÂU hoàn chỉnh miêu tả bức tranh, bắt buộc phải sử dụng HAI TỪ KHÓA được cho dưới đây. Có thể thay đổi dạng từ (chia thì, số ít/nhiều) và trật tự từ.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words. You may change the form of the words and use them in any order.",
    imageUrl: "/images/part1/p1_01.jpg",
    keywords: ["man", "walk"],
    modelAnswer: "A man is walking along the platform while carrying his luggage.",
    tipsVi: [
      "Bắt buộc chỉ viết đúng 1 câu duy nhất (kết thúc bằng 1 dấu chấm). Không viết 2 câu rời rạc.",
      "Ưu tiên dùng thì Hiện tại tiếp diễn (S + is/are + V-ing) hoặc Bị động.",
      "Có thể ghép câu bằng liên từ như 'while', 'and', 'because', 'so' để câu văn phong phú ngữ pháp hơn."
    ]
  },
  {
    id: "wr-p1-02",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 2)",
    directionsVi: "Viết MỘT CÂU miêu tả phòng họp, sử dụng 2 từ khóa: 'discuss' và 'table'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_02.jpg",
    keywords: ["discuss", "table"],
    modelAnswer: "The colleagues are sitting around the table to discuss their quarterly project report.",
    tipsVi: [
      "Từ 'discuss' không đi kèm giới từ 'about' (chú ý lỗi phổ biến discuss something chứ không phải discuss about something).",
      "Sử dụng cụm 'around the table' để miêu tả vị trí ngồi tự nhiên."
    ]
  },
  {
    id: "wr-p1-03",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 3)",
    directionsVi: "Viết MỘT CÂU miêu tả người làm việc tại bàn, sử dụng 2 từ khóa: 'laptop' và 'while'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_03.jpg",
    keywords: ["laptop", "while"],
    modelAnswer: "The woman is typing on her laptop while taking notes in a notebook.",
    tipsVi: [
      "Liên từ 'while' rất thích hợp để nối 2 hành động diễn ra song song (typing while taking notes).",
      "Kiểm tra kỹ chia động từ ngôi thứ 3 số ít (The woman is typing)."
    ]
  },
  {
    id: "wr-p1-04",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 4)",
    directionsVi: "Viết MỘT CÂU miêu tả kệ sách hoặc tài liệu, sử dụng 2 từ khóa: 'organize' và 'shelf'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_04.jpg",
    keywords: ["organize", "shelf"],
    modelAnswer: "The books and folders have been neatly organized on the wooden shelves.",
    tipsVi: [
      "Thử dùng câu bị động ở thì hiện tại hoàn thành: 'have been organized on the shelf' để được giám khảo chấm điểm cấu trúc cao.",
      "Nhớ số nhiều của 'shelf' là 'shelves'."
    ]
  },
  {
    id: "wr-p1-05",
    part: 1,
    partTitle: "Part 1: Write a sentence based on a picture (Câu 5)",
    directionsVi: "Viết MỘT CÂU miêu tả cảnh siêu thị / cửa hàng, sử dụng 2 từ khóa: 'customer' và 'pay'.",
    timeLimitMinutes: 2,
    promptText: "Write ONE sentence that is based on the picture and uses the TWO given words.",
    imageUrl: "/images/part1/p1_05.jpg",
    keywords: ["customer", "pay"],
    modelAnswer: "A customer is paying for her groceries with a credit card at the checkout counter.",
    tipsVi: [
      "Dùng cụm 'pay for something' (trả tiền cho cái gì) + 'at the checkout counter'.",
      "Đảm bảo có chủ ngữ, vị ngữ đầy đủ và viết hoa chữ cái đầu câu."
    ]
  },

  // PART 2: RESPOND TO A WRITTEN REQUEST (EMAIL)
  {
    id: "wr-p2-01",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Khiếu nại giao trễ đơn hàng)",
    directionsVi: "Đọc email khiếu nại của khách hàng bên dưới. Viết email phản hồi với tư cách là Quản lý chăm sóc khách hàng (Customer Service Manager), đáp ứng đủ 2 yêu cầu: (1) Xin lỗi và giải thích lý do giao trễ, (2) Đưa ra 2 giải pháp bồi thường thỏa đáng.",
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
        "Giải thích lý do khách quan (ví dụ: chuỗi cung ứng bị tắc nghẽn hoặc thời tiết)",
        "Đưa ra 2 giải pháp cụ thể (ví dụ: giao hàng hỏa tốc miễn phí + giảm giá 20% cho đơn sau)"
      ]
    },
    templateVi: `Dear Mr. Miller,

Thank you for contacting Office Prime regarding order #OP-8829.

First and foremost, please accept our sincere apologies for the delay and any inconvenience it has caused to your branch opening schedule. [Giải thích ngắn gọn lý do: Due to an unexpected supply chain disruption...]

To resolve this issue promptly, we would like to offer the following solutions:
1. First, we have upgraded your shipping to express delivery at no extra cost, ensuring the items arrive by this Friday.
2. Second, we would like to offer you a 20% discount coupon applicable to your next purchase.

If you have any further questions, please do not hesitate to contact me directly at this email.

Sincerely,
Customer Service Manager
Office Prime Team`,
    modelAnswer: `Dear Mr. Miller,

Thank you for reaching out to Office Prime regarding your recent order #OP-8829.

Please accept our sincere apologies for the delay in processing your order and the inconvenience it has caused to your branch opening preparations. Due to an unexpected surge in demand and a temporary warehouse system upgrade early this week, your shipment experienced a delay.

To resolve this issue and support your upcoming event, we have taken the following immediate actions:
1. We have expedited your order via express courier at our own expense, and the shipment is scheduled to arrive at your office by Friday, October 17th.
2. We have credited a 20% refund to your original payment method, along with a 15% discount voucher for your next order.

We deeply value your business and are committed to ensuring a seamless delivery. Please feel free to reach out if you require any further assistance.

Sincerely,
Emily Watson
Customer Service Manager`,
    tipsVi: [
      "Bố cục email chuẩn công sở: Lời chào (Dear Mr. X) -> Cảm ơn & Xin lỗi -> Giải quyết vấn đề (Bullet points) -> Lời kết lịch sự (Sincerely/Best regards).",
      "Đáp ứng đầy đủ 100% các yêu cầu đề bài nêu (2 giải pháp bồi thường).",
      "Độ dài lý tưởng: 70 - 120 từ."
    ]
  },
  {
    id: "wr-p2-02",
    part: 2,
    partTitle: "Part 2: Respond to an Email (Đổi lịch hẹn phỏng vấn)",
    directionsVi: "Đọc email từ ứng viên xin dời lịch phỏng vấn. Hãy viết thư phản hồi xác nhận đồng ý dời lịch, nêu 2 mốc thời gian mới có thể chọn, và yêu cầu ứng viên gửi trước CV cập nhật.",
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
        "Đề xuất 2 khung giờ thay thế cụ thể (ví dụ: thứ Sáu 2:00 PM hoặc thứ Hai tuần sau 10:00 AM)",
        "Yêu cầu ứng viên gửi bản CV mới nhất trước buổi hẹn"
      ]
    },
    templateVi: `Dear Ms. Jenkins,

Thank you for informing us about your situation regarding the Marketing Coordinator interview.

We completely understand and are happy to reschedule. We can offer you two alternative time slots:
- Friday, November 6th, at 2:00 PM
- Monday, November 9th, at 10:00 AM

Please let us know which of these options works best for you. Additionally, please reply with your most updated resume prior to the interview.

Best regards,
HR Recruitment Team`,
    modelAnswer: `Dear Ms. Jenkins,

Thank you for letting us know in advance regarding your interview for the Marketing Coordinator position.

We understand that unexpected circumstances arise, and we are glad to accommodate your request to reschedule. We would like to propose the following two alternative slots:
1. Friday, November 6th, at 2:00 PM
2. Monday, November 9th, at 10:00 AM

Please confirm which time is most convenient for you so we can reserve the meeting room. In addition, could you please attach your most updated resume and portfolio before your scheduled session?

We look forward to speaking with you soon.

Best regards,
Mark Evans
Head of Talent Acquisition
Nova Global`,
    tipsVi: [
      "Luôn giữ giọng văn chuyên nghiệp, đồng cảm nhưng rõ ràng, súc tích.",
      "Nhớ kiểm tra đúng tên người nhận (Ms. Jenkins).",
      "Sử dụng các cụm từ đắt giá: 'accommodate your request', 'alternative slots', 'look forward to'."
    ]
  },

  // PART 3: WRITE AN OPINION ESSAY
  {
    id: "wr-p3-01",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Làm việc từ xa vs Làm tại văn phòng)",
    directionsVi: "Hãy viết một bài luận học thuật (tối thiểu 300 từ) trình bày quan điểm của bạn về việc các công ty nên cho phép nhân viên làm việc từ xa (Work from home) hay bắt buộc làm việc tại văn phòng.",
    timeLimitMinutes: 30,
    promptText: "Some companies allow their employees to work from home, while others require them to come to the office every day. Which approach do you think is more beneficial for employees and organizations? Support your opinion with specific reasons and examples.",
    essayPrompt: {
      topic: "Remote Working vs. Office Working",
      background: "The debate over remote vs in-office work arrangements has intensified globally.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN CHUẨN TOEIC WRITING 300 TỪ:

1. INTRODUCTION (Mở bài: 40 - 50 từ):
- Hook/Lead-in: In recent years, the concept of remote working has sparked widespread debate across corporate environments.
- Thesis Statement: In my opinion, allowing employees to work remotely offers far greater benefits in terms of productivity, work-life balance, and operational cost savings.

2. BODY 1 (Lợi ích về Năng suất & Cân bằng cuộc sống: 100 - 120 từ):
- Topic Sentence: First and foremost, remote work substantially improves employee well-being and productivity.
- Explanation: Without lengthy daily commutes, workers save hours each week, reducing stress and physical fatigue.
- Example: For instance, employees can organize flexible schedules, leading to higher focus and fewer office interruptions.

3. BODY 2 (Lợi ích về Chi phí cho Doanh nghiệp: 100 - 120 từ):
- Topic Sentence: Furthermore, organizations can achieve significant cost reductions and recruit top global talent.
- Explanation: Companies do not need to invest heavily in massive office facilities, utilities, and on-site maintenance.
- Example: Many tech firms have saved millions annually by adopting flexible hybrid or remote policies while expanding their talent pool internationally.

4. CONCLUSION (Kết bài: 40 - 50 từ):
- Summary & Restatement: In conclusion, although office interactions foster immediate team bonding, I firmly believe that remote work is a modern and superior arrangement for both workers and companies.`,
    modelAnswer: `In recent years, the rapid advancement of digital communication technologies has revolutionized traditional working environments. While some traditional corporations continue to mandate on-site attendance, an increasing number of organizations are embracing remote work. In my view, offering remote work options provides far greater advantages for both employee well-being and overall organizational productivity.

First and foremost, remote working substantially enhances employees' mental well-being and personal productivity. Commuting during rush hours in metropolitan areas is notoriously stressful and time-consuming, often consuming two to three hours every single day. By working from home, workers can reclaim this valuable time, which can then be dedicated to rest, exercise, or spending quality time with family. For example, a recent survey among tech professionals revealed that employees working remotely reported lower burnout rates and higher job satisfaction compared to their office-bound counterparts. A happier workforce naturally translates into higher efficiency and lower employee turnover.

Furthermore, from an organizational standpoint, adopting remote policies leads to substantial cost reductions and access to a broader talent pool. Maintaining commercial office spaces in central business districts entails exorbitant expenses, including high rents, utilities, and administrative maintenance. By transitioning to remote or hybrid setups, businesses can downsize office facilities and reallocate those capital investments into technological innovation and employee compensation. In addition, companies are no longer geographically constrained to local applicants; they can recruit top-tier experts from anywhere in the world, fostering international diversity and driving innovation.

In conclusion, although working in a physical office facilitates immediate face-to-face interactions, the profound benefits of remote work—such as increased flexibility, lower commuting stress, and reduced operational costs—far outweigh any potential drawbacks. Therefore, modern enterprises should proactively adopt flexible remote work arrangements to thrive in the modern global economy.`,
    tipsVi: [
      "Đặt mục tiêu viết từ 300 đến 350 từ để đảm bảo đủ chiều sâu luận điểm.",
      "Chia bài viết thành 4 đoạn rõ ràng (Mở bài - Thân bài 1 - Thân bài 2 - Kết bài) với 1 dòng trống giữa các đoạn.",
      "Sử dụng các từ liên kết học thuật đắt giá: 'First and foremost', 'Furthermore', 'For example', 'In conclusion', 'substantially', 'exorbitant expenses'."
    ]
  },
  {
    id: "wr-p3-02",
    part: 3,
    partTitle: "Part 3: Opinion Essay (Làm việc nhóm vs Làm việc độc lập)",
    directionsVi: "Hãy viết một bài luận học thuật (tối thiểu 300 từ) về việc: Bạn thích làm việc theo nhóm (working in teams) hay làm việc độc lập (working independently)? Nêu lý do và ví dụ minh họa.",
    timeLimitMinutes: 30,
    promptText: "Some people prefer to work as part of a team, while others prefer to work independently on their own tasks. Which working style do you think is more effective? Give specific reasons and examples to support your view.",
    essayPrompt: {
      topic: "Teamwork vs. Independent Work",
      background: "Both collaborative teamwork and solo execution play crucial roles in modern workplace success.",
      recommendedWords: 300
    },
    templateVi: `DÀN BÀI 4 ĐOẠN:
1. Mở bài: Giới thiệu cuộc tranh luận giữa Teamwork và Independent work. Khẳng định chọn Teamwork vì sức mạnh tổng hợp và đa dạng góc nhìn.
2. Thân bài 1: Teamwork giúp kết hợp các kỹ năng khác nhau và giải quyết các bài toán phức tạp mà 1 người khó làm nổi.
3. Thân bài 2: Teamwork tạo môi trường học hỏi lẫn nhau, giảm tải áp lực cá nhân và tăng tính gắn kết văn hóa doanh nghiệp.
4. Kết bài: Tóm tắt lại và kết luận Teamwork là yếu tố cốt lõi của thành công trong thời đại số.`,
    modelAnswer: `In today's interconnected corporate landscape, accomplishing ambitious projects requires exceptional performance. While working independently provides autonomy and allows individuals to focus without distractions, I strongly believe that working as part of a team is far more effective in achieving long-term professional success and innovation.

To begin with, collaboration allows diverse skill sets and perspectives to converge, leading to superior problem-solving capabilities. In modern industries such as software engineering, marketing, and medicine, complex tasks cannot be mastered by a single individual alone. When people collaborate, each team member brings unique strengths to the table. For instance, in launching a new tech product, designers, engineers, and marketers must brainstorm collectively to ensure that technical functionality aligns seamlessly with user experience and market expectations. The exchange of different viewpoints sparks creativity and prevents blind spots that individual workers might overlook.

Moreover, teamwork significantly alleviates individual pressure and enhances productivity through effective delegation. When tackling massive workloads alone, an employee is susceptible to severe stress and burnout, which ultimately impairs decision-making quality. In contrast, in a well-coordinated team, responsibilities are distributed according to personal expertise, ensuring that tasks are executed concurrently and efficiently. Furthermore, teammates can support one another during crises, providing constructive feedback and mutual motivation. This emotional and professional camaraderie fosters a resilient corporate culture where employees feel supported and valued.

In conclusion, although independent work has its merits in cultivating individual focus and self-discipline, collaborative teamwork remains indispensable for solving complex problems, fostering innovation, and maintaining sustainable productivity. For these reasons, mastering the art of collaboration is an essential prerequisite for thriving in the modern professional world.`,
    tipsVi: [
      "Luôn có ví dụ thực tế minh họa trong các đoạn thân bài (For instance, in launching a new tech product...).",
      "Giữ giọng điệu khách quan, trang trọng (tránh viết tắt như don't, can't - hãy viết do not, cannot).",
      "Đọc lại bài trong 3-5 phút cuối để sửa lỗi chính tả và mạo từ (a/an/the)."
    ]
  }
];
