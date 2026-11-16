export interface VocabItem {
  _id: string;
  word: string;
  type: string;
  ipa: string;
  meaning: string;
  exampleEn: string;
  exampleVi: string;
  topic: string;
  level: string;
}

export interface ToeicQuestion {
  id: number;
  part: number;
  direction?: string;
  imageUrl?: string;
  audioText?: string;
  audioUrl?: string;
  passage?: string;
  questionText: string;
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  transcript?: string;
}

export interface ToeicTest {
  _id: string;
  title: string;
  code: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  questions: ToeicQuestion[];
}

export const initialVocabList: VocabItem[] = [
  {
    _id: "vocab_1",
    word: "negotiate",
    type: "verb",
    ipa: "/nɪˈɡoʊʃieɪt/",
    meaning: "Đàm phán, thương lượng",
    exampleEn: "She tried to negotiate with her boyfriend for extra trà sữa.",
    exampleVi: "Cô ấy cố đàm phán với bạn trai để được thêm một ly trà sữa.",
    topic: "Business & Contract",
    level: "Intermediate"
  },
  {
    _id: "vocab_2",
    word: "mandatory",
    type: "adjective",
    ipa: "/ˈmændətɔːri/",
    meaning: "Bắt buộc, có tính cưỡng chế",
    exampleEn: "Doing TOEIC test everyday is mandatory for Mập địch.",
    exampleVi: "Làm đề TOEIC mỗi ngày là bắt buộc đối với Mập địch.",
    topic: "Office & Rules",
    level: "Intermediate"
  },
  {
    _id: "vocab_3",
    word: "procrastinate",
    type: "verb",
    ipa: "/prəˈkræstɪneɪt/",
    meaning: "Trì hoãn, chần chừ",
    exampleEn: "Don't procrastinate your study to scroll TikTok!",
    exampleVi: "Đừng có chần chừ học bài để lướt tóp tóp nữa!",
    topic: "Life & Study",
    level: "Advanced"
  },
  {
    _id: "vocab_4",
    word: "accommodate",
    type: "verb",
    ipa: "/əˈkɑːmədeɪt/",
    meaning: "Cung cấp chỗ ở, đáp ứng nhu cầu",
    exampleEn: "The hotel can accommodate up to 300 guests.",
    exampleVi: "Khách sạn có thể đáp ứng chỗ nghỉ cho tối đa 300 khách.",
    topic: "Travel & Hospitality",
    level: "Intermediate"
  },
  {
    _id: "vocab_5",
    word: "reimburse",
    type: "verb",
    ipa: "/ˌriːɪmˈbɜːrs/",
    meaning: "Hoàn lại tiền, bồi hoàn",
    exampleEn: "The company will reimburse you for travel expenses.",
    exampleVi: "Công ty sẽ hoàn trả chi phí công tác cho bạn.",
    topic: "Finance & Accounting",
    level: "Advanced"
  },
  {
    _id: "vocab_6",
    word: "implement",
    type: "verb",
    ipa: "/ˈɪmplɪment/",
    meaning: "Triển khai, thực hiện",
    exampleEn: "We must implement the new diet plan immediately!",
    exampleVi: "Chúng ta phải triển khai ngay kế hoạch ăn kiêng thôi!",
    topic: "Management",
    level: "Intermediate"
  },
  {
    _id: "vocab_7",
    word: "confidential",
    type: "adjective",
    ipa: "/ˌkɑːnfɪˈdenʃl/",
    meaning: "Bảo mật, tuyệt mật",
    exampleEn: "Her true weight is strictly confidential information.",
    exampleVi: "Cân nặng thực tế của cô ấy là thông tin tuyệt mật.",
    topic: "Office & Security",
    level: "Advanced"
  },
  {
    _id: "vocab_8",
    word: "complimentary",
    type: "adjective",
    ipa: "/ˌkɑːmplɪˈmentri/",
    meaning: "Miễn phí (quà tặng kèm)",
    exampleEn: "Enjoy complimentary snacks while taking the test.",
    exampleVi: "Thưởng thức đồ ăn nhẹ miễn phí trong lúc làm bài nhé.",
    topic: "Customer Service",
    level: "Intermediate"
  },
  {
    _id: "vocab_9",
    word: "collaborate",
    type: "verb",
    ipa: "/kəˈlæbəreɪt/",
    meaning: "Hợp tác, làm việc chung",
    exampleEn: "We need to collaborate closely to pass TOEIC 800+.",
    exampleVi: "Chúng ta cần hợp tác chặt chẽ để cùng đạt TOEIC 800+.",
    topic: "Teamwork",
    level: "Intermediate"
  },
  {
    _id: "vocab_10",
    word: "eligible",
    type: "adjective",
    ipa: "/ˈelɪdʒəbl/",
    meaning: "Đủ điều kiện, xứng đáng",
    exampleEn: "She is eligible to receive a giant teddy bear after getting 900 TOEIC.",
    exampleVi: "Cô ấy đủ điều kiện nhận gấu bông khổng lồ sau khi đạt 900 TOEIC.",
    topic: "HR & Recruitment",
    level: "Intermediate"
  }
];

export const initialTest: ToeicTest = {
  _id: "test_mini_01",
  title: "Đề Thi Thử Thách Mập Địch #01 (Đủ 7 Parts)",
  code: "ING-LICH-01",
  durationMinutes: 25,
  totalQuestions: 10,
  description: "Bao quát đầy đủ 7 Part TOEIC (Nghe Part 1-4 & Đọc Part 5-7). Có audio voice phát âm, tra cứu transcript và chấm điểm 990!",
  questions: [
    {
      id: 1,
      part: 1,
      direction: "Part 1: Photographs. Nhìn hình ảnh và nghe các câu miêu tả để chọn đáp án đúng.",
      audioText: "Statement A: A man is typing on a laptop at the desk. Statement B: A woman is painting a picture on an easel. Statement C: Some people are walking in the park. Statement D: Books are being packed into moving boxes.",
      questionText: "Look at the photo and choose the best description:",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
      options: [
        { label: "A", text: "A man is typing on a laptop at the desk." },
        { label: "B", text: "A woman is painting a picture on an easel." },
        { label: "C", text: "Some people are walking in the park." },
        { label: "D", text: "Books are being packed into moving boxes." }
      ],
      correctAnswer: "A",
      explanation: "Trong bức tranh trên bàn làm việc, người đàn ông đang gõ phím trên máy tính xách tay (typing on a laptop).",
      transcript: "(A) A man is typing on a laptop at the desk. (B) A woman is painting... (C) Some people... (D) Books..."
    },
    {
      id: 2,
      part: 2,
      direction: "Part 2: Question - Response. Nghe câu hỏi và chọn phản hồi đúng nhất.",
      audioText: "When will the marketing report be finalized? (A) Yes, I sent the email yesterday. (B) By Friday afternoon at the latest. (C) In the conference room on the second floor.",
      questionText: "When will the marketing report be finalized?",
      options: [
        { label: "A", text: "Yes, I sent the email yesterday." },
        { label: "B", text: "By Friday afternoon at the latest." },
        { label: "C", text: "In the conference room on the second floor." }
      ],
      correctAnswer: "B",
      explanation: "Câu hỏi bắt đầu bằng 'When' (Khi nào). Đáp án (B) 'By Friday afternoon at the latest' đưa ra mốc thời gian cụ thể.",
      transcript: "M: When will the marketing report be finalized? - W: (A) Yes, I sent... (B) By Friday afternoon at the latest. (C) In the conference..."
    },
    {
      id: 3,
      part: 2,
      direction: "Part 2: Question - Response.",
      audioText: "Would you like to join us for lunch today? (A) I would love to, but I have a meeting at noon. (B) The salad was very delicious. (C) Around twenty dollars.",
      questionText: "Would you like to join us for lunch today?",
      options: [
        { label: "A", text: "I would love to, but I have a meeting at noon." },
        { label: "B", text: "The salad was very delicious." },
        { label: "C", text: "Around twenty dollars." }
      ],
      correctAnswer: "A",
      explanation: "Lời mời ăn trưa 'Would you like to join us...'. Câu (A) là câu từ chối lịch sự kèm lý do bận họp lúc 12h trưa.",
      transcript: "W: Would you like to join us for lunch today? - M: (A) I would love to, but I have a meeting at noon..."
    },
    {
      id: 4,
      part: 3,
      direction: "Part 3: Short Conversations. Nghe đoạn hội thoại và trả lời câu hỏi.",
      audioText: "Man: Hi Sarah, did you get a chance to review the revised budget proposal? Woman: Yes, Mark. Overall it looks solid, but we need to allocate more funds for digital advertising in Q3. Man: Good point. I will update the spreadsheet and send it to the director before 4 PM.",
      questionText: "What does the woman recommend doing?",
      options: [
        { label: "A", text: "Hiring a new marketing director" },
        { label: "B", text: "Allocating more money for digital advertising" },
        { label: "C", text: "Postponing the product launch" },
        { label: "D", text: "Canceling the upcoming meeting" }
      ],
      correctAnswer: "B",
      explanation: "Người phụ nữ đề xuất: 'we need to allocate more funds for digital advertising in Q3'. Chọn (B).",
      transcript: "M: ...review the budget? W: ...we need to allocate more funds for digital advertising... M: I will update the spreadsheet."
    },
    {
      id: 5,
      part: 4,
      direction: "Part 4: Short Talks. Nghe thông báo ở sân bay và trả lời câu hỏi.",
      audioText: "Attention all passengers on flight VN-246 to Tokyo. Due to adverse weather conditions at our destination, departure has been delayed by approximately 45 minutes. Please remain seated near gate B12. Complimentary beverages are available at the service counter.",
      questionText: "Why has the flight been delayed?",
      options: [
        { label: "A", text: "Mechanical problems with the airplane" },
        { label: "B", text: "Unfavorable weather conditions" },
        { label: "C", text: "Air traffic controller strike" },
        { label: "D", text: "Missing crew members" }
      ],
      correctAnswer: "B",
      explanation: "Thông báo nêu rõ: 'Due to adverse weather conditions at our destination' (thời tiết bất lợi). Chọn (B).",
      transcript: "Attention all passengers... Due to adverse weather conditions... delayed by 45 minutes."
    },
    {
      id: 6,
      part: 5,
      direction: "Part 5: Incomplete Sentences. Điền từ thích hợp vào chỗ trống.",
      questionText: "All employees are reminded to submit their travel expense reports _______ the end of the month.",
      options: [
        { label: "A", text: "before" },
        { label: "B", text: "among" },
        { label: "C", text: "between" },
        { label: "D", text: "throughout" }
      ],
      correctAnswer: "A",
      explanation: "Chỉ thời điểm hoàn tất trước hạn chót ('the end of the month') dùng 'before'.",
      transcript: "No audio for Reading Part 5."
    },
    {
      id: 7,
      part: 5,
      direction: "Part 5: Incomplete Sentences.",
      questionText: "Ms. Tanaka _______ the customer service department since she joined the company five years ago.",
      options: [
        { label: "A", text: "managed" },
        { label: "B", text: "is managing" },
        { label: "C", text: "has managed" },
        { label: "D", text: "will manage" }
      ],
      correctAnswer: "C",
      explanation: "Cấu trúc thì hiện tại hoàn thành với 'since + mốc quá khứ'. Chủ ngữ số ít nên dùng 'has managed'.",
      transcript: "No audio for Reading Part 5."
    },
    {
      id: 8,
      part: 6,
      direction: "Part 6: Text Completion. Đọc thông báo và chọn từ phù hợp điền vào chỗ trống.",
      passage: "To: All Staff\nFrom: Operations Team\nSubject: Office Renovation\n\nPlease be advised that our 4th floor conference rooms will be closed for refurbishment starting next Monday. We expect the project to take two weeks. During this period, please _______ your meetings to the 2nd floor rooms or utilize virtual conferencing tools.",
      questionText: "Choose the word that best completes the sentence in the memo:",
      options: [
        { label: "A", text: "reschedule" },
        { label: "B", text: "dismiss" },
        { label: "C", text: "terminate" },
        { label: "D", text: "abandon" }
      ],
      correctAnswer: "A",
      explanation: "Phòng họp tầng 4 đang sửa chữa nên nhân viên được yêu cầu dời lịch / xếp lại lịch họp ('reschedule meetings') sang phòng tầng 2.",
      transcript: "Memo reading passage."
    },
    {
      id: 9,
      part: 7,
      direction: "Part 7: Reading Comprehension. Đọc bài báo thông cáo báo chí và trả lời câu hỏi.",
      passage: "FOR IMMEDIATE RELEASE\nBrightSky Solar Secures $50 Million Contract\n\nSEATTLE — BrightSky Solar announced today that it has signed a multi-year agreement with Cascade Power to build a 200-megawatt solar farm in Eastern Oregon. Construction is scheduled to commence in March, with commercial operations slated for late November next year. The project is projected to generate over 300 temporary construction jobs and provide clean renewable electricity for approximately 45,000 households.",
      questionText: "When is the construction of the solar farm scheduled to begin?",
      options: [
        { label: "A", text: "In January" },
        { label: "B", text: "In March" },
        { label: "C", text: "In November" },
        { label: "D", text: "Next year" }
      ],
      correctAnswer: "B",
      explanation: "Bài báo viết: 'Construction is scheduled to commence in March...' (commence = begin = bắt đầu). Chọn (B).",
      transcript: "Reading Part 7 Press release."
    },
    {
      id: 10,
      part: 7,
      direction: "Part 7: Reading Comprehension.",
      passage: "FOR IMMEDIATE RELEASE\nBrightSky Solar Secures $50 Million Contract\n(Xem đoạn văn bản ở câu 9)",
      questionText: "How many homes will the project supply with renewable power?",
      options: [
        { label: "A", text: "Approximately 300" },
        { label: "B", text: "Around 50,000" },
        { label: "C", text: "Approximately 45,000" },
        { label: "D", text: "Over 200,000" }
      ],
      correctAnswer: "C",
      explanation: "Cuối bài báo viết: '...provide clean renewable electricity for approximately 45,000 households.' (households = homes). Chọn (C).",
      transcript: "Reading Part 7 Question 10."
    }
  ]
};
