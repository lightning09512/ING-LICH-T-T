export interface RevisionUnit {
  id: string;
  skill: 'SPEAKING' | 'WRITING';
  unitNumber: number;
  partNumber: 1 | 2 | 3 | 4 | 5;
  partNameVi: string;
  questionCoverageVi: string;
  title: string;
  subtitle: string;
  badge: string;
  overviewVi: string;
  contentSections: {
    heading: string;
    bodyMarkdown: string;
    highlightBox?: {
      type: 'tip' | 'warning' | 'formula';
      title: string;
      text: string;
    };
  }[];
  keyFormulas?: {
    name: string;
    structure: string;
    exampleEn: string;
    exampleVi: string;
  }[];
  quickQuiz: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanationVi: string;
  }[];
}

export const TOEIC_REVISION_ROADMAP: RevisionUnit[] = [
  // ==========================================
  // TOEIC SPEAKING REVISION (LEVEL 0 - 100+)
  // ==========================================
  {
    id: "sp-unit-01",
    skill: "SPEAKING",
    unitNumber: 1,
    partNumber: 1,
    partNameVi: "Part 1: Read a Text Aloud",
    questionCoverageVi: "Câu 1 & 2",
    title: "Unit 1: Tiêu Chí Chấm Điểm & Ngắt Nghỉ Part 1",
    subtitle: "Nắm vững bảng điểm ETS, 3 tiêu chí cốt lõi: Phát âm, Trọng âm, Ngữ điệu",
    badge: "Part 1 • Tiêu Chí",
    overviewVi: "Phần thi Part 1 yêu cầu đọc to 2 đoạn văn ngắn trong 45 giây chuẩn bị và 45 giây nói. Giám khảo chấm điểm dựa trên 3 tiêu chí chính: Pronunciation, Intonation, và Stress.",
    contentSections: [
      {
        heading: "1. Thang Điểm & Tiêu Chí Đánh Giá ETS",
        bodyMarkdown: `Điểm số Part 1 được chia từ mức 0 đến 3 điểm mỗi câu (tối đa 6 điểm cho 2 câu):
- **Điểm 3 (High):** Phát âm chuẩn xác, ngắt nghỉ đúng cụm nghĩa, lên xuống giọng tự nhiên, hầu như không có lỗi phát âm gây hiểu nhầm.
- **Điểm 2 (Medium):** Đọc trôi chảy nhưng còn một số từ phát âm sai âm đuôi hoặc ngữ điệu còn đều đều (monotone).
- **Điểm 1 (Low):** Đọc ngập ngừng, phát âm sai nhiều từ cơ bản làm người nghe khó hiểu.`
      },
      {
        heading: "2. Quy Tắc Ngắt Hơi (Pausing / Chunking)",
        bodyMarkdown: `Không đọc một mạch từ đầu đến cuối câu mà phải chia câu thành các cụm nghĩa (thought groups):
- **Ngắt ngắn (0.3s):** Tại dấu phẩy (,), trước giới từ (in, at, on), trước liên từ (and, but, because).
- **Ngắt dài (0.6s):** Tại dấu chấm (.), dấu chấm hỏi (?), dấu chấm than (!).`,
        highlightBox: {
          type: "tip",
          title: "Mẹo Thực Chiến Cho Nóc Nhà",
          text: "Trong 45 giây chuẩn bị, hãy đọc thầm và dùng mắt lướt tìm trước các từ dài hoặc tên riêng khó đọc để không bị vấp khi máy tính bắt đầu ghi âm!"
        }
      }
    ],
    keyFormulas: [
      {
        name: "Quy tắc ngắt cụm nghĩa",
        structure: "[Chủ ngữ] / [Cụm động từ + Tân ngữ] / [Cụm trạng ngữ chỉ nơi chốn/thời gian].",
        exampleEn: "Passengers for Flight 302 / should proceed to Gate 15 / immediately.",
        exampleVi: "Hành khách của chuyến bay 302 / nên di chuyển đến Cửa 15 / ngay lập tức."
      }
    ],
    quickQuiz: [
      {
        questionText: "Trong câu: 'If you have any questions, please contact our customer service desk at extension 405.', vị trí ngắt giọng tự nhiên nhất là ở đâu?",
        options: [
          "Sau từ 'questions,' và trước cụm 'at extension 405.'",
          "Sau từ 'If' và sau từ 'please'",
          "Đọc một mạch không ngắt nghỉ",
          "Chỉ ngắt ở cuối câu"
        ],
        correctIndex: 0,
        explanationVi: "Ngắt hơi sau dấu phẩy (questions,) và trước cụm giới từ chỉ vị trí/số máy nhánh (at extension 405) giúp câu nói tự nhiên và người nghe dễ nắm bắt."
      }
    ]
  },
  {
    id: "sp-unit-02",
    skill: "SPEAKING",
    unitNumber: 2,
    partNumber: 1,
    partNameVi: "Part 1: Read a Text Aloud",
    questionCoverageVi: "Câu 1 & 2",
    title: "Unit 2 & 3: Bảng Phiên Âm IPA, Trọng Âm & Ngữ Điệu",
    subtitle: "Chinh phục âm đuôi /s/, /ed/, nối âm (Linking) và quy tắc lên/xuống giọng",
    badge: "Part 1 • Phát Âm",
    overviewVi: "Muốn đạt điểm tối đa Part 1 và nói tự nhiên ở các Part sau, việc làm chủ các âm đuôi khó, trọng âm từ và ngữ điệu lên xuống giọng là chìa khóa then chốt.",
    contentSections: [
      {
        heading: "1. Quy Tắc Ngữ Điệu (Intonation) Thần Thánh",
        bodyMarkdown: `- **Xuống giọng cuối câu (Falling Intonation ↘):** Dùng cho câu trần thuật, câu mệnh lệnh và câu hỏi có từ để hỏi (Wh-questions).
- **Lên giọng cuối câu (Rising Intonation ↗):** Dùng cho câu hỏi Yes/No question.
- **Ngữ điệu liệt kê (Listing):** Lên giọng ở các mục phía trước và hạ giọng ở mục cuối cùng: Item 1 ↗, Item 2 ↗, and Item 3 ↘.`
      },
      {
        heading: "2. Phát Âm Âm Đuôi /s/, /es/ và /ed/",
        bodyMarkdown: `- **Đuôi /s, es/:**
  * /s/: Sau phụ âm vô thanh: /p/, /t/, /k/, /f/, /θ/ (tickets, desks).
  * /ɪz/: Sau âm gió: /s/, /z/, /ʃ/, /tʃ/, /dʒ/ (passes, changes).
  * /z/: Các trường hợp còn lại (passengers, stores).
- **Đuôi /ed/:**
  * /ɪd/: Sau /t/, /d/ (visited, decided).
  * /t/: Sau âm vô thanh /p, k, f, s, ʃ, tʃ/ (booked, watched).
  * /d/: Còn lại (delayed, confirmed).`
      }
    ],
    keyFormulas: [
      {
        name: "Công thức ngữ điệu liệt kê",
        structure: "Item 1 (↗) + Item 2 (↗) + and Item 3 (↘)",
        exampleEn: "We sell computers (↗), printers (↗), and office supplies (↘).",
        exampleVi: "Chúng tôi bán máy tính, máy in và dụng cụ văn phòng."
      }
    ],
    quickQuiz: [
      {
        questionText: "Trong câu: 'Do you need help with your luggage?', ngữ điệu ở cuối câu nên như thế nào?",
        options: [
          "Lên giọng (↗) vì đây là câu hỏi Yes/No",
          "Hạ giọng (↘) vì đây là câu hỏi dài",
          "Giữ giọng ngang bằng",
          "Lên giọng ở đầu câu rồi hạ ở cuối câu"
        ],
        correctIndex: 0,
        explanationVi: "Câu hỏi Yes/No trong tiếng Anh chuẩn luôn lên giọng ở âm tiết cuối cùng để tạo sắc thái nghi vấn lịch sự."
      }
    ]
  },
  {
    id: "sp-unit-04",
    skill: "SPEAKING",
    unitNumber: 4,
    partNumber: 2,
    partNameVi: "Part 2: Describe a Picture",
    questionCoverageVi: "Câu 3 & 4",
    title: "Unit 4 & 5: Danh Từ, Tính Từ & Trạng Từ Miêu Tả Tranh",
    subtitle: "Vốn từ vựng mô tả con người, đồ vật và không gian trong Part 2",
    badge: "Part 2 • Từ Vựng Tranh",
    overviewVi: "Part 2 yêu cầu mô tả một bức tranh trong 30 giây. Trang bị các danh từ chỉ vật dụng văn phòng, tính từ chỉ trạng thái và trạng từ chỉ cách thức sẽ giúp câu nói sinh động và đạt điểm cao.",
    contentSections: [
      {
        heading: "1. Danh Từ Văn Phòng & Địa Điểm Phổ Biến",
        bodyMarkdown: `- **Văn phòng:** colleagues, cubicle, projector screen, swivel chair, document, laptop, whiteboard.
- **Đường phố / Ngoài trời:** pedestrian, crosswalk, sidewalk, intersection, storefront, bench, vehicle.
- **Nhà hàng / Siêu thị:** cash register, customer, shopping cart, shelf / shelves, grocery, waitress.`
      },
      {
        heading: "2. Tính Từ & Trạng Từ Đắt Giá",
        bodyMarkdown: `- **neatly arranged:** được sắp xếp gọn gàng, ngăn nắp.
- **crowded / packed with people:** đông đúc người qua lại.
- **attentively listening:** đang chăm chú lắng nghe đồng nghiệp phát biểu.
- **facing each other:** đang ngồi đối diện nhau qua bàn tròn.`
      }
    ],
    quickQuiz: [
      {
        questionText: "Từ nào thích hợp nhất để miêu tả các tài liệu được xếp ngăn nắp trên bàn?",
        options: [
          "neatly organized",
          "badly packed",
          "slowly walking",
          "loudly talking"
        ],
        correctIndex: 0,
        explanationVi: "'neatly organized' (sắp xếp ngăn nắp) là cụm từ rất chuẩn và hay xuất hiện trong tranh công sở Part 2."
      }
    ]
  },
  {
    id: "sp-unit-06",
    skill: "SPEAKING",
    unitNumber: 6,
    partNumber: 2,
    partNameVi: "Part 2: Describe a Picture",
    questionCoverageVi: "Câu 3 & 4",
    title: "Unit 6: Giới Từ Chỉ Vị Trí (Prepositions of Place)",
    subtitle: "Bí quyết định vị không gian: tiền cảnh, hậu cảnh, bên trái, bên phải",
    badge: "Part 2 • Vị Trí Không Gian",
    overviewVi: "Để miêu tả tranh có trật tự logic, học viên cần dùng thành thạo các cụm giới từ xác định vị trí các đối tượng trong bức ảnh.",
    contentSections: [
      {
        heading: "1. Bản Đồ Giới Từ Miêu Tả Bức Tranh",
        bodyMarkdown: `- **In the foreground (Ở tiền cảnh / phía trước):** Đối tượng gần mắt người xem nhất.
- **In the background (Ở hậu cảnh / phía xa):** Tòa nhà, hàng cây, bức tường phía sau.
- **In the middle / In the center (Ở chính giữa):** Nhân vật trọng tâm của bức ảnh.
- **On the left-hand side / On the right-hand side (Ở bên trái / bên phải bức tranh).**
- **Next to / Adjacent to (Bên cạnh), Across from (Đối diện).**`
      }
    ],
    keyFormulas: [
      {
        name: "Cấu trúc giới từ chỉ vị trí",
        structure: "[In the foreground/background], I can see + [Noun phrase + V-ing].",
        exampleEn: "In the foreground, a woman in a blue blouse is typing on her laptop.",
        exampleVi: "Ở phía trước, một người phụ nữ mặc áo xanh đang gõ máy tính."
      }
    ],
    quickQuiz: [
      {
        questionText: "Khi muốn nói về hàng cây ở phía xa phía sau nhóm người, ta dùng cụm từ nào?",
        options: [
          "In the background",
          "In the foreground",
          "In the front",
          "At the right side of the tree"
        ],
        correctIndex: 0,
        explanationVi: "'In the background' được dùng chuẩn xác để chỉ các cảnh vật ở hậu cảnh phía xa."
      }
    ]
  },
  {
    id: "sp-unit-08",
    skill: "SPEAKING",
    unitNumber: 8,
    partNumber: 2,
    partNameVi: "Part 2: Describe a Picture",
    questionCoverageVi: "Câu 3 & 4",
    title: "Unit 8 & 9: Thì Động Từ Trong Miêu Tả Tranh (Tiếp Diễn & Bị Động)",
    subtitle: "Dùng thì Hiện tại tiếp diễn cho người và Bị động cho đồ vật",
    badge: "Part 2 • Ngữ Pháp Thì",
    overviewVi: "Hai cấu trúc ngữ pháp ghi điểm cao nhất trong Part 2 là: Hiện tại tiếp diễn (diễn tả hành động của người) và Hiện tại hoàn thành bị động (diễn tả trạng thái của đồ vật).",
    contentSections: [
      {
        heading: "1. Công Thức Miêu Tả Người: Hiện Tại Tiếp Diễn",
        bodyMarkdown: `- **Cấu trúc:** S + is/are + V-ing + Object
- **Ví dụ người:** Two businesspeople are shaking hands in front of the window.
- **Ví dụ hành động:** A man is pouring coffee into a white ceramic cup.`
      },
      {
        heading: "2. Công Thức Miêu Tả Đồ Vật: Thể Bị Động",
        bodyMarkdown: `- **Cấu trúc trạng thái:** S + has/have been + V3/ed hoặc S + is/are + V3/ed
- **Ví dụ sắp đặt:** Several files have been placed on the wooden meeting table.
- **Ví dụ đồ vật:** The bookshelves are filled with colorful reference manuals.`
      }
    ],
    quickQuiz: [
      {
        questionText: "Chọn câu đúng nhất để miêu tả tranh có nhiều ghế xếp xung quanh bàn họp:",
        options: [
          "Several chairs have been arranged around the meeting table.",
          "Several chairs arranged around the meeting table.",
          "Several chairs is arranging around the table.",
          "A chair have been arranged around table."
        ],
        correctIndex: 0,
        explanationVi: "Chủ ngữ số nhiều 'chairs' đi với 'have been arranged' (thể bị động) thể hiện trạng thái đồ vật đã được sắp xếp sẵn."
      }
    ]
  },
  {
    id: "sp-unit-11",
    skill: "SPEAKING",
    unitNumber: 11,
    partNumber: 2,
    partNameVi: "Part 2: Describe a Picture",
    questionCoverageVi: "Câu 3 & 4",
    title: "Unit 11: Phân Biệt One, Another, Other, Others, The Other",
    subtitle: "Chỉ nhóm người và đối tượng khác nhau trong tranh không bị lặp từ",
    badge: "Part 2 • Phân Biệt Nhóm Người",
    overviewVi: "Khi tranh có nhiều người làm các hoạt động khác nhau, dùng 'one... another... others' giúp câu nói lưu loát và thể hiện vốn ngữ pháp phong phú.",
    contentSections: [
      {
        heading: "1. Bảng Quy Tắc Phân Biệt",
        bodyMarkdown: `- **One person is... while another person is...:** Một người đang... trong khi một người khác đang...
- **Some people are... while others are...:** Một số người đang... trong khi những người còn lại đang...
- **The other person:** Người còn lại (trong tổng số 2 người xác định trong tranh).`
      }
    ],
    quickQuiz: [
      {
        questionText: "Trong bức tranh có nhóm 5 người: 2 người đang nói chuyện, còn những người khác đang ghi chép. Điền vào chỗ trống: 'Two people are talking while ______ are taking notes.'",
        options: [
          "others",
          "another",
          "other",
          "the other person"
        ],
        correctIndex: 0,
        explanationVi: "'others' đóng vai trò là đại từ số nhiều thay thế cho 'other people'."
      }
    ]
  },
  {
    id: "sp-unit-15",
    skill: "SPEAKING",
    unitNumber: 15,
    partNumber: 2,
    partNameVi: "Part 2: Describe a Picture",
    questionCoverageVi: "Câu 3 & 4",
    title: "Unit 15: Công Thức Vàng 4 Bước Miêu Tả Tranh (Hot Training Recipe)",
    subtitle: "Bí quyết nói trọn vẹn trong 30 giây không bao giờ bị bí từ",
    badge: "Part 2 • Công Thức 4 Bước",
    overviewVi: "Công thức độc quyền 4 bước chuẩn ETS giúp thí sinh xử lý mọi bức tranh Part 2 chỉ trong 30 giây một cách mượt mà và tự tin.",
    contentSections: [
      {
        heading: "Quy Trình 4 Bước Chuẩn Điểm Cao",
        bodyMarkdown: `- **Bước 1 (0-5s) - Tổng quan bối cảnh:** Bức tranh chụp ở đâu: This picture was taken in an office / a restaurant / outdoors.
- **Bước 2 (5-18s) - Nhân vật trung tâm:** Ai nổi bật nhất, họ đang làm gì: In the center of the picture, a man in a white shirt is giving a presentation.
- **Bước 3 (18-25s) - Đồ vật & Hậu cảnh:** On the desk, there are some laptops. In the background, colleagues are listening attentively.
- **Bước 4 (25-30s) - Cảm nhận / Bầu không khí:** Overall, the atmosphere seems very productive and professional.`
      }
    ],
    quickQuiz: [
      {
        questionText: "Câu kết thúc (Bước 4) lý tưởng cho một bức tranh văn phòng làm việc vui vẻ là gì?",
        options: [
          "Overall, the atmosphere seems very positive and collaborative.",
          "The man is eating very quickly.",
          "I don't like this picture.",
          "There are three computers in the room."
        ],
        correctIndex: 0,
        explanationVi: "Câu nêu nhận định tổng thể về bầu không khí (atmosphere) giúp bài nói có phần kết tự nhiên, trọn vẹn 30 giây."
      }
    ]
  },
  {
    id: "sp-unit-16",
    skill: "SPEAKING",
    unitNumber: 16,
    partNumber: 3,
    partNameVi: "Part 3 & 4: Response to Questions",
    questionCoverageVi: "Câu 5 - 10",
    title: "Unit 16: Phản Xạ Trả Lời Part 3 & 4 (Response to Questions)",
    subtitle: "Nguyên tắc 'Trả lời trực tiếp + 2 câu mở rộng chi tiết (Reason + Example)'",
    badge: "Part 3 & 4 • Phản Xạ",
    overviewVi: "Part 3 kiểm tra phản xạ trả lời tức thì (15 giây cho Q5, Q6 và 30 giây cho Q7). Part 4 yêu cầu đọc lịch trình/bảng biểu và trả lời qua điện thoại.",
    contentSections: [
      {
        heading: "1. Nguyên Tắc 'Direct Answer + Expand' Cho Part 3",
        bodyMarkdown: `- **Câu 1 - Trả lời trực tiếp:** Nêu câu trả lời thẳng vào trọng tâm câu hỏi, không ậm ừ kéo dài thời gian.
- **Câu 2 - Nêu lý do (Because / Since):** Giải thích tại sao mình lại chọn hoặc làm như vậy.
- **Câu 3 - Đưa ra ví dụ cá nhân (For instance):** Kể ngắn gọn 1 thói quen hoặc trải nghiệm thực tế.`
      },
      {
        heading: "2. Mẹo Xử Lý Part 4 (Lịch Trình Hội Thảo)",
        bodyMarkdown: `- **Xem kỹ các mốc thời gian và địa điểm:** Phòng họp, tên diễn giả, chủ đề bài thuyết trình.
- **Mở đầu lịch sự qua điện thoại:** Certainly! According to the schedule, the presentation will start at 10 AM in Room 204.
- **Xử lý thông tin bị hủy hoặc thay đổi:** Look for cancellation asterisks (*) at the bottom of the table.`
      }
    ],
    quickQuiz: [
      {
        questionText: "Với câu hỏi: 'How often do you go shopping for clothes?', cách trả lời nào ghi điểm cao nhất?",
        options: [
          "I usually go shopping for clothes once a month. I prefer shopping on weekends because there are often big promotional discounts.",
          "Yes, I do.",
          "Shopping is very good.",
          "Once a month."
        ],
        correctIndex: 0,
        explanationVi: "Trả lời đầy đủ câu trần thuật + nêu lý do và thói quen mở rộng giúp đạt điểm tối đa Part 3."
      }
    ]
  },

  // ==========================================
  // TOEIC WRITING REVISION (LEVEL 0 - 100+)
  // ==========================================
  {
    id: "wr-unit-01",
    skill: "WRITING",
    unitNumber: 1,
    partNumber: 1,
    partNameVi: "Tổng Quan Đề Thi Writing",
    questionCoverageVi: "Câu 1 - 8",
    title: "Unit 1: Tổng Quan Bài Thi TOEIC Writing & Tiêu Chí Chấm",
    subtitle: "8 câu hỏi trong 60 phút, thang điểm 200 và các lỗi trừ điểm phổ biến",
    badge: "Writing • Tổng Quan",
    overviewVi: "Bài thi TOEIC Writing gồm 3 phần: Part 1 (5 câu miêu tả tranh), Part 2 (2 email phản hồi), Part 3 (1 bài luận quan điểm 300 từ).",
    contentSections: [
      {
        heading: "1. Cấu Trúc Đề Thi Chi Tiết",
        bodyMarkdown: `- **Part 1 (Câu 1-5):** Viết 1 câu miêu tả tranh có chứa 2 từ khóa. Thời gian: 8 phút. Điểm: 0-3 điểm/câu.
- **Part 2 (Câu 6-7):** Viết email phản hồi thư công việc. Thời gian: 10 phút/email. Điểm: 0-4 điểm/câu.
- **Part 3 (Câu 8):** Viết bài luận nêu quan điểm (tối thiểu 300 từ). Thời gian: 30 phút. Điểm: 0-5 điểm.`
      },
      {
        heading: "2. Các Lỗi Bị Trừ Điểm Nặng Nhất",
        bodyMarkdown: `- **Viết thành 2 câu ở Part 1:** Yêu cầu bắt buộc chỉ viết ĐÚNG 1 CÂU duy nhất (kết thúc bằng 1 dấu chấm).
- **Quên không dùng đủ 2 từ khóa bắt buộc:** Thiếu từ hoặc thay đổi sai nghĩa gốc của từ khóa.
- **Thiếu ý yêu cầu ở Part 2:** Đề yêu cầu nêu 2 giải pháp nhưng chỉ trả lời 1 giải pháp.
- **Bài luận Part 3 dưới 250 từ:** Không đủ số lượng từ tối thiểu để phát triển luận điểm trọn vẹn.`
      }
    ],
    quickQuiz: [
      {
        questionText: "Trong Part 1 của TOEIC Writing, thí sinh được phép viết bao nhiêu câu cho mỗi bức tranh?",
        options: [
          "Đúng một câu duy nhất",
          "Tùy ý, càng nhiều câu càng tốt",
          "Tối thiểu hai câu",
          "Một đoạn văn ngắn từ 3-4 câu"
        ],
        correctIndex: 0,
        explanationVi: "ETS quy định nghiêm ngặt: 'Write ONE sentence based on the picture'. Viết từ 2 câu trở lên sẽ bị trừ điểm cấu trúc nặng."
      }
    ]
  },
  {
    id: "wr-unit-02",
    skill: "WRITING",
    unitNumber: 2,
    partNumber: 1,
    partNameVi: "Part 1: Write a Sentence",
    questionCoverageVi: "Câu 1 - 5",
    title: "Unit 2: Chiến Thuật Viết Câu Theo Tranh Part 1",
    subtitle: "Kỹ thuật biến đổi từ và ghép câu phức với liên từ (while, because, so, although)",
    badge: "Part 1 • Ghép Câu Tranh",
    overviewVi: "Để đạt điểm tối đa 3/3 cho mỗi câu Part 1, bạn không nên chỉ viết câu đơn sơ sài mà hãy ghép câu bằng các liên từ phụ thuộc hoặc thì hoàn thành.",
    contentSections: [
      {
        heading: "1. Kỹ Thuật Biến Đổi Dạng Từ (Word Form)",
        bodyMarkdown: `Đề bài cho phép thay đổi dạng từ:
- **Động từ nguyên thể có thể chia thì:** walk ➔ is walking / walked / walks.
- **Danh từ có thể chuyển số nhiều:** shelf ➔ shelves, customer ➔ customers.
- **Đổi từ loại:** organize (V) ➔ organized (Adj) / organization (N).`
      },
      {
        heading: "2. Các Công Thức Ghép Câu Bất Bại",
        bodyMarkdown: `- **Dùng liên từ 'while' (trong khi):** A woman is typing on a keyboard while talking on the phone.
- **Dùng mệnh đề quan hệ 'who / which':** The doctor who is wearing a white coat is examining a patient.
- **Dùng liên từ chỉ mục đích 'in order to / to':** The colleagues are gathering around the table to discuss the budget.`
      }
    ],
    keyFormulas: [
      {
        name: "Công thức câu ghép với While",
        structure: "[Mệnh đề 1] + while + [Mệnh đề 2 dạng V-ing]",
        exampleEn: "A man is reading a document while holding a coffee cup.",
        exampleVi: "Một người đàn ông đang đọc tài liệu trong khi cầm một cốc cà phê."
      }
    ],
    quickQuiz: [
      {
        questionText: "Với 2 từ khóa: 'discuss' và 'table', câu nào sau đây chuẩn ngữ pháp và đạt điểm cao nhất?",
        options: [
          "The team members are sitting around the table to discuss their new marketing campaign.",
          "The team is discussing about the project on the table.",
          "A man discuss table with his friend.",
          "They are sitting at the table. They discuss the report."
        ],
        correctIndex: 0,
        explanationVi: "Động từ 'discuss' không đi kèm 'about'. Câu thứ nhất viết đúng 1 câu phức hoàn chỉnh, dùng 'around the table' và 'to discuss' chuẩn xác."
      }
    ]
  },
  {
    id: "wr-unit-03",
    skill: "WRITING",
    unitNumber: 3,
    partNumber: 2,
    partNameVi: "Part 2: Respond to an Email",
    questionCoverageVi: "Câu 6 & 7",
    title: "Unit 3: Cấu Trúc Viết Email Chuẩn Công Sở Part 2",
    subtitle: "Bố cục 4 phần của email thương mại chuyên nghiệp: Chào hỏi, Thấu hiểu, Giải quyết, Lời kết",
    badge: "Part 2 • Email Format",
    overviewVi: "Part 2 yêu cầu trả lời email trong 10 phút. Bố cục rõ ràng, văn phong lịch sự và giải quyết đầy đủ tất cả các yêu cầu trong đề là chìa khóa đạt 4/4 điểm.",
    contentSections: [
      {
        heading: "Bố Cục 4 Phần Của Email Chuẩn",
        bodyMarkdown: `- **1. Salutation (Lời chào trang trọng):** Dear Mr./Ms. [Họ], hoặc Dear Hiring Committee,
- **2. Opening (Cảm ơn & Thấu hiểu vấn đề):** Thank you for reaching out to us regarding your recent order. Please accept our sincere apologies for any inconvenience caused.
- **3. Body (Giải quyết từng yêu cầu bằng bullet points):** Sử dụng các số thứ tự (1, 2) hoặc liên từ (First, Additionally) để trả lời đủ 100% các ý đề bài hỏi.
- **4. Closing & Sign-off (Lời kết lịch sự & Chữ ký):** If you have any further questions, please do not hesitate to contact me. Sincerely, [Tên / Chức vụ].`
      }
    ],
    quickQuiz: [
      {
        questionText: "Khi gửi thư phản hồi cho khách hàng tên là 'Robert Smith', lời chào mở đầu chuẩn mực nhất là gì?",
        options: [
          "Dear Mr. Smith,",
          "Dear Robert Smith,",
          "Hey Smith,",
          "Hello Mr. Robert,"
        ],
        correctIndex: 0,
        explanationVi: "Quy chuẩn thư tín tiếng Anh: 'Dear Mr./Ms. + Họ của người nhận' (Dear Mr. Smith,)."
      }
    ]
  },
  {
    id: "wr-unit-04",
    skill: "WRITING",
    unitNumber: 4,
    partNumber: 3,
    partNameVi: "Part 3: Opinion Essay (300 Words)",
    questionCoverageVi: "Câu 8",
    title: "Unit 4: Dàn Bài Bài Luận Quan Điểm 300 Từ Part 3",
    subtitle: "Cấu trúc 4 đoạn: Mở bài (Hook + Thesis) ➔ 2 Đoạn thân bài (PEEL) ➔ Kết bài",
    badge: "Part 3 • Luận 300 Từ",
    overviewVi: "Bài luận Part 3 có thời gian 30 phút. Học sinh cần viết tối thiểu 300 từ với lập luận chặt chẽ và ví dụ thực tế để thuyết phục giám khảo.",
    contentSections: [
      {
        heading: "Cấu Trúc Mô Hình PEEL Cho Đoạn Thân Bài",
        bodyMarkdown: `- **P - Point (Câu chủ đề mở đoạn):** Nêu luận điểm chính của đoạn (First and foremost, remote work substantially reduces daily commuting stress.)
- **E - Explanation (Giải thích chi tiết):** Giải thích tại sao lại như vậy (Without spending hours stuck in rush-hour traffic, employees preserve energy for cognitive tasks.)
- **E - Example (Ví dụ minh họa cụ thể):** Đưa ra dẫn chứng thực tế (For instance, a recent survey showed that remote tech workers reported 30% higher job satisfaction.)
- **L - Link (Câu liên kết kết đoạn):** Chốt lại luận điểm gắn với đề bài (Consequently, this leads to lower burnout rates and higher company productivity.)`
      }
    ],
    quickQuiz: [
      {
        questionText: "Một bài luận TOEIC Writing Part 3 đạt điểm cao nên có bao nhiêu đoạn văn?",
        options: [
          "4 đoạn rõ ràng (Mở bài - Thân bài 1 - Thân bài 2 - Kết bài)",
          "Chỉ viết 1 đoạn văn thật dài",
          "Càng nhiều đoạn càng tốt (7-8 đoạn)",
          "2 đoạn (Mở bài và Thân bài)"
        ],
        correctIndex: 0,
        explanationVi: "Bố cục 4 đoạn học thuật tiêu chuẩn là cấu trúc cân đối, mạch lạc và được giám khảo ETS đánh giá cao nhất."
      }
    ]
  },
  {
    id: "wr-unit-06",
    skill: "WRITING",
    unitNumber: 6,
    partNumber: 2,
    partNameVi: "Part 2: Respond to an Email",
    questionCoverageVi: "Câu 6 & 7",
    title: "Unit 6, 7 & 8: Bộ Mẫu Câu Giao Tiếp Công Việc (Cung Cấp & Hỏi Thông Tin)",
    subtitle: "Cung cấp thông tin, hỏi thăm lịch sự và đề xuất giải pháp trong văn bản",
    badge: "Part 2 • Mẫu Câu Email",
    overviewVi: "Kho mẫu câu giao tiếp công sở giúp bạn viết email Part 2 nhanh chóng và tự nhiên như người đi làm chuyên nghiệp.",
    contentSections: [
      {
        heading: "1. Cung Cấp Thông Tin (Providing Information)",
        bodyMarkdown: `- **I am writing to inform you that:** Tôi viết thư này để thông báo rằng...
- **We are pleased to announce that:** Chúng tôi rất vui mừng thông báo rằng...
- **Please be advised that:** Xin lưu ý rằng công việc bảo trì được lên lịch vào thứ Sáu.`
      },
      {
        heading: "2. Hỏi Thông Tin Lịch Sự (Asking for Information)",
        bodyMarkdown: `- **Could you please provide more details regarding:** Bạn có thể cung cấp thêm chi tiết về...
- **I would appreciate it if you could confirm:** Tôi rất cảm kích nếu bạn có thể xác nhận...
- **Could you let me know whether:** Bạn có thể cho tôi biết liệu phòng hội nghị có sẵn không?`
      },
      {
        heading: "3. Đề Xuất Giải Pháp (Proposing Solutions)",
        bodyMarkdown: `- **To resolve this issue promptly, we would like to offer:** Để giải quyết vấn đề nhanh chóng, chúng tôi muốn đề xuất...
- **I suggest that we reschedule the interview to:** Tôi đề xuất chúng ta dời lịch phỏng vấn sang...`
      }
    ],
    quickQuiz: [
      {
        questionText: "Cách diễn đạt nào lịch sự và chuyên nghiệp nhất khi muốn khách hàng xác nhận lại thời gian hẹn?",
        options: [
          "I would appreciate it if you could confirm your preferred meeting time.",
          "Tell me when you can meet.",
          "You must confirm the time quickly.",
          "What time do you want?"
        ],
        correctIndex: 0,
        explanationVi: "Mẫu câu 'I would appreciate it if you could...' là công thức trang trọng và lịch sự nhất trong thư tín thương mại."
      }
    ]
  }
];
