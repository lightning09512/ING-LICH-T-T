export interface ListeningQuestion {
  id: string;
  part: 1 | 2;
  direction: string;
  questionText: string;
  imageUrl?: string;
  audioScript?: string;
  options: {
    label: 'A' | 'B' | 'C' | 'D';
    text: string;
    vietnamese?: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic?: string;
}

export const LISTENING_BANK: ListeningQuestion[] = [
  // ==========================================
  // PART 1: PHOTOGRAPHS (Mô tả hình ảnh)
  // ==========================================
  {
    id: 'L-P1-01',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_01.jpg',
    audioScript: '(A) A man is typing on a laptop computer. (B) A man is writing in a notebook. (C) A woman is handing a document to a colleague. (D) Some people are putting away their binders.',
    options: [
      { label: 'A', text: 'A man is typing on a laptop computer.', vietnamese: 'Một người đàn ông đang gõ bàn phím trên máy tính xách tay.' },
      { label: 'B', text: 'A man is writing in a notebook.', vietnamese: 'Một người đàn ông đang viết vào cuốn sổ tay.' },
      { label: 'C', text: 'A woman is handing a document to a colleague.', vietnamese: 'Một phụ nữ đang đưa tài liệu cho đồng nghiệp.' },
      { label: 'D', text: 'Some people are putting away their binders.', vietnamese: 'Vài người đang cất bìa tài liệu đi.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Người đàn ông ở bàn làm việc đang đặt tay lên phím của laptop để gõ máy. (B), (C), (D) sai hành động.',
    topic: 'Văn phòng / Máy tính'
  },
  {
    id: 'L-P1-02',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_02.jpg',
    audioScript: '(A) She is adjusting a computer monitor. (B) She is drinking from a coffee cup. (C) She is looking through some file folders. (D) She is arranging books on a shelf.',
    options: [
      { label: 'A', text: 'She is adjusting a computer monitor.', vietnamese: 'Cô ấy đang điều chỉnh màn hình máy tính.' },
      { label: 'B', text: 'She is drinking from a coffee cup.', vietnamese: 'Cô ấy đang uống nước từ tách cà phê.' },
      { label: 'C', text: 'She is looking through some file folders.', vietnamese: 'Cô ấy đang tìm kiếm trong các tập hồ sơ tài liệu.' },
      { label: 'D', text: 'She is arranging books on a shelf.', vietnamese: 'Cô ấy đang sắp xếp sách lên giá sách.' }
    ],
    correctAnswer: 'D',
    explanation: 'Hình ảnh cho thấy người phụ nữ đang đứng trước giá sách và xếp lại các quyển sách (arranging books on a shelf).',
    topic: 'Thư viện / Sắp xếp'
  },
  {
    id: 'L-P1-03',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_03.jpg',
    audioScript: '(A) Some boxes are stacked on a wooden pallet. (B) A forklift is unloading packages from a truck. (C) Workers are carrying crates into a storage room. (D) Merchandise is being displayed in store windows.',
    options: [
      { label: 'A', text: 'Some boxes are stacked on a wooden pallet.', vietnamese: 'Một số thùng các-tông được xếp chồng trên tấm pallet gỗ.' },
      { label: 'B', text: 'A forklift is unloading packages from a truck.', vietnamese: 'Xe nâng đang dỡ các kiện hàng khỏi xe tải.' },
      { label: 'C', text: 'Workers are carrying crates into a storage room.', vietnamese: 'Công nhân đang khiêng các thùng vào kho lưu trữ.' },
      { label: 'D', text: 'Merchandise is being displayed in store windows.', vietnamese: 'Hàng hóa đang được trưng bày ở cửa sổ cửa hàng.' }
    ],
    correctAnswer: 'A',
    explanation: 'Ảnh tĩnh chụp kho hàng cho thấy nhiều thùng hàng được xếp chồng gọn gàng trên tấm pallet gỗ (stacked on a wooden pallet). Không có người điều khiển xe nâng.',
    topic: 'Kho hàng / Hàng hóa'
  },
  {
    id: 'L-P1-04',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_04.jpg',
    audioScript: '(A) People are boarding an airplane. (B) Pedestrians are crossing a street at a crosswalk. (C) Vehicles are parked along the side of the road. (D) Bicycles are chained to an outdoor fence.',
    options: [
      { label: 'A', text: 'People are boarding an airplane.', vietnamese: 'Mọi người đang lên máy bay.' },
      { label: 'B', text: 'Pedestrians are crossing a street at a crosswalk.', vietnamese: 'Người đi bộ đang qua đường tại vạch sang đường.' },
      { label: 'C', text: 'Vehicles are parked along the side of the road.', vietnamese: 'Các phương tiện giao thông đang đỗ dọc bên lề đường.' },
      { label: 'D', text: 'Bicycles are chained to an outdoor fence.', vietnamese: 'Những chiếc xe đạp đang được xích vào hàng rào ngoài trời.' }
    ],
    correctAnswer: 'B',
    explanation: 'Hình ảnh cho thấy nhóm người đi bộ (pedestrians) đang bước qua đường trên vạch kẻ đường dành cho người đi bộ (crosswalk).',
    topic: 'Đường phố / Giao thông'
  },
  {
    id: 'L-P1-05',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_05.jpg',
    audioScript: '(A) Diners are seated at outdoor dining tables. (B) A waiter is clearing dishes from a counter. (C) Menus are being handed out to customers. (D) Food is being prepared in an open kitchen.',
    options: [
      { label: 'A', text: 'Diners are seated at outdoor dining tables.', vietnamese: 'Thực khách đang ngồi tại các bàn ăn ngoài trời.' },
      { label: 'B', text: 'A waiter is clearing dishes from a counter.', vietnamese: 'Bồi bàn đang dọn dẹp bát đĩa khỏi quầy.' },
      { label: 'C', text: 'Menus are being handed out to customers.', vietnamese: 'Thực đơn đang được phát cho khách hàng.' },
      { label: 'D', text: 'Food is being prepared in an open kitchen.', vietnamese: 'Món ăn đang được chuẩn bị trong bếp mở.' }
    ],
    correctAnswer: 'A',
    explanation: 'Bức ảnh chụp góc quán cà phê/nhà hàng ngoài trời với thực khách đang ngồi thưởng thức bữa ăn tại bàn (seated at outdoor dining tables).',
    topic: 'Nhà hàng / Ẩm thực'
  },
  {
    id: 'L-P1-06',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_06.jpg',
    audioScript: '(A) A bridge spans across a wide river. (B) Boats are tied up at a busy harbor. (C) Construction workers are repairing a pier. (D) Water is spraying from an ornamental fountain.',
    options: [
      { label: 'A', text: 'A bridge spans across a wide river.', vietnamese: 'Một cây cầu bắc ngang qua dòng sông rộng.' },
      { label: 'B', text: 'Boats are tied up at a busy harbor.', vietnamese: 'Những chiếc thuyền được cột dây tại bến cảng nhộn nhịp.' },
      { label: 'C', text: 'Construction workers are repairing a pier.', vietnamese: 'Công nhân xây dựng đang sửa chữa một cây cầu tàu.' },
      { label: 'D', text: 'Water is spraying from an ornamental fountain.', vietnamese: 'Nước đang phun lên từ một đài phun nước trang trí.' }
    ],
    correctAnswer: 'A',
    explanation: 'Khung cảnh toàn cảnh cây cầu lớn bắc ngang qua mặt nước (a bridge spans across a river).',
    topic: 'Cảnh quan / Công trình'
  },
  {
    id: 'L-P1-07',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_07.jpg',
    audioScript: '(A) A man is putting on a hard hat. (B) A technician is inspecting industrial machinery. (C) Safety equipment is being stored in a cabinet. (D) Tools are scattered across the floor.',
    options: [
      { label: 'A', text: 'A man is putting on a hard hat.', vietnamese: 'Người đàn ông đang đội mũ bảo hộ.' },
      { label: 'B', text: 'A technician is inspecting industrial machinery.', vietnamese: 'Kỹ thuật viên đang kiểm tra máy móc công nghiệp.' },
      { label: 'C', text: 'Safety equipment is being stored in a cabinet.', vietnamese: 'Thiết bị an toàn đang được cất trong tủ.' },
      { label: 'D', text: 'Tools are scattered across the floor.', vietnamese: 'Dụng cụ vương vãi khắp sàn nhà.' }
    ],
    correctAnswer: 'B',
    explanation: 'Kỹ thuật viên đang chăm chú kiểm tra thiết bị sản xuất trong nhà máy (inspecting industrial machinery).',
    topic: 'Kỹ thuật / Sản xuất'
  },
  {
    id: 'L-P1-08',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_08.jpg',
    audioScript: '(A) A woman is standing at a reception desk. (B) A clerk is handing a receipt to a customer. (C) Some luggage is placed beside an escalator. (D) Passengers are waiting in an airport departure lounge.',
    options: [
      { label: 'A', text: 'A woman is standing at a reception desk.', vietnamese: 'Một phụ nữ đang đứng ở quầy lễ tân.' },
      { label: 'B', text: 'A clerk is handing a receipt to a customer.', vietnamese: 'Nhân viên đang trao hóa đơn cho khách hàng.' },
      { label: 'C', text: 'Some luggage is placed beside an escalator.', vietnamese: 'Một số hành lý được đặt cạnh thang cuốn.' },
      { label: 'D', text: 'Passengers are waiting in an airport departure lounge.', vietnamese: 'Hành khách đang chờ ở phòng chờ sân bay.' }
    ],
    correctAnswer: 'A',
    explanation: 'Người phụ nữ đang đứng tại quầy tiếp tân văn phòng (standing at a reception desk).',
    topic: 'Khách sạn / Lễ tân'
  },
  {
    id: 'L-P1-09',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_09.jpg',
    audioScript: '(A) A train has pulled into a station. (B) Some people are waiting on a platform. (C) Luggage is being loaded onto a cart. (D) Passengers are boarding a subway.',
    options: [
      { label: 'A', text: 'A train has pulled into a station.', vietnamese: 'Một đoàn tàu vừa tiến vào nhà ga.' },
      { label: 'B', text: 'Some people are waiting on a platform.', vietnamese: 'Một số người đang đứng chờ trên sân ga.' },
      { label: 'C', text: 'Luggage is being loaded onto a cart.', vietnamese: 'Hành lý đang được chất lên xe đẩy.' },
      { label: 'D', text: 'Passengers are boarding a subway.', vietnamese: 'Hành khách đang lên tàu điện ngầm.' }
    ],
    correctAnswer: 'B',
    explanation: 'Hình ảnh chụp những người đứng trên sân ga chờ tàu hỏa (waiting on a platform). Đoàn tàu chưa vào bến.',
    topic: 'Giao thông / Ga tàu'
  },
  {
    id: 'L-P1-10',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_10.jpg',
    audioScript: '(A) A cashier is ringing up a sale. (B) Merchandise is being displayed on shelves. (C) A shopper is pushing a grocery cart. (D) A customer is paying for some groceries.',
    options: [
      { label: 'A', text: 'A cashier is ringing up a sale.', vietnamese: 'Thu ngân đang bấm máy thanh toán.' },
      { label: 'B', text: 'Merchandise is being displayed on shelves.', vietnamese: 'Hàng hóa đang được trưng bày trên các kệ.' },
      { label: 'C', text: 'A shopper is pushing a grocery cart.', vietnamese: 'Một người mua hàng đang đẩy xe đựng đồ.' },
      { label: 'D', text: 'A customer is paying for some groceries.', vietnamese: 'Khách hàng đang trả tiền mua đồ tạp hóa.' }
    ],
    correctAnswer: 'D',
    explanation: 'Vị khách đang thanh toán tiền hàng tại quầy thanh toán siêu thị (paying for some groceries).',
    topic: 'Cửa hàng / Mua sắm'
  },
  {
    id: 'L-P1-11',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_11.jpg',
    audioScript: '(A) An office desk is being moved into a room. (B) Filing cabinets have been left open. (C) A chair has been pushed under a table. (D) A potted plant sits in the corner of an office.',
    options: [
      { label: 'A', text: 'An office desk is being moved into a room.', vietnamese: 'Bàn làm việc đang được chuyển vào phòng.' },
      { label: 'B', text: 'Filing cabinets have been left open.', vietnamese: 'Tủ đựng hồ sơ đang để mở.' },
      { label: 'C', text: 'A chair has been pushed under a table.', vietnamese: 'Một chiếc ghế đã được đẩy vào dưới bàn.' },
      { label: 'D', text: 'A potted plant sits in the corner of an office.', vietnamese: 'Một chậu cây cảnh đặt ở góc văn phòng.' }
    ],
    correctAnswer: 'D',
    explanation: 'Góc phòng có chậu cây cảnh xanh tốt (a potted plant sits in the corner). Không có người di chuyển đồ đạc.',
    topic: 'Nội thất / Văn phòng'
  },
  {
    id: 'L-P1-12',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_12.jpg',
    audioScript: '(A) A lamppost has fallen onto the pavement. (B) Construction cones are blocking the walkway. (C) Trees are casting shadows across an outdoor patio. (D) A bicycle has been parked next to a bench.',
    options: [
      { label: 'A', text: 'A lamppost has fallen onto the pavement.', vietnamese: 'Cột đèn bị đổ xuống vỉa hè.' },
      { label: 'B', text: 'Construction cones are blocking the walkway.', vietnamese: 'Cọc tiêu xây dựng đang chặn lối đi bộ.' },
      { label: 'C', text: 'Trees are casting shadows across an outdoor patio.', vietnamese: 'Những cái cây đang đổ bóng xuống khoảng sân ngoài trời.' },
      { label: 'D', text: 'A bicycle has been parked next to a bench.', vietnamese: 'Một chiếc xe đạp dựng cạnh ghế dài.' }
    ],
    correctAnswer: 'C',
    explanation: 'Ảnh chụp ngoại cảnh khuôn viên với bóng cây râm mát đổ dài trên khoảng sân lát gạch (trees casting shadows).',
    topic: 'Cảnh quan / Ngoài trời'
  },

  // ==========================================
  // PART 2: QUESTION - RESPONSE (Hỏi - Đáp)
  // ==========================================
  {
    id: 'L-P2-01',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Where is the monthly sales meeting being held?',
    audioScript: 'Where is the monthly sales meeting being held? (A) In conference room B on the third floor. (B) Yes, every Tuesday morning. (C) About fifty thousand dollars.',
    options: [
      { label: 'A', text: 'In conference room B on the third floor.', vietnamese: 'Ở phòng hội thảo B trên tầng ba.' },
      { label: 'B', text: 'Yes, every Tuesday morning.', vietnamese: 'Vâng, vào mỗi sáng thứ Ba.' },
      { label: 'C', text: 'About fifty thousand dollars.', vietnamese: 'Khoảng năm mươi nghìn đô la.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi bắt đầu bằng "Where" (Ở đâu) chỉ địa điểm, phương án (A) chỉ rõ vị trí "In conference room B". Câu hỏi WH không trả lời bằng Yes/No như (B).',
    topic: 'Hỏi Địa Điểm (Where)'
  },
  {
    id: 'L-P2-02',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'When will the new software update be installed?',
    audioScript: 'When will the new software update be installed? (A) The IT department is doing it on Friday night. (B) No, I haven\'t seen the new monitor. (C) It cost more than expected.',
    options: [
      { label: 'A', text: 'The IT department is doing it on Friday night.', vietnamese: 'Phòng IT sẽ thực hiện vào tối thứ Sáu.' },
      { label: 'B', text: 'No, I haven\'t seen the new monitor.', vietnamese: 'Không, tôi chưa thấy màn hình mới.' },
      { label: 'C', text: 'It cost more than expected.', vietnamese: 'Nó tốn kém hơn dự kiến.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "When" (Khi nào) hỏi mốc thời gian. (A) đưa ra câu trả lời chính xác "on Friday night". (B) bẫy Yes/No; (C) trả lời về chi phí.',
    topic: 'Hỏi Thời Gian (When)'
  },
  {
    id: 'L-P2-03',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Who authorized the budget for the advertising campaign?',
    audioScript: 'Who authorized the budget for the advertising campaign? (A) Vice President Miller approved it yesterday. (B) It will appear on local television. (C) Yes, we reached our annual target.',
    options: [
      { label: 'A', text: 'Vice President Miller approved it yesterday.', vietnamese: 'Phó chủ tịch Miller đã phê duyệt hôm qua.' },
      { label: 'B', text: 'It will appear on local television.', vietnamese: 'Nó sẽ xuất hiện trên truyền hình địa phương.' },
      { label: 'C', text: 'Yes, we reached our annual target.', vietnamese: 'Vâng, chúng ta đã đạt chỉ tiêu năm.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "Who" (Ai) hỏi người chịu trách nhiệm hoặc cấp trên phê duyệt. (A) trả lời người thực hiện là "Vice President Miller".',
    topic: 'Hỏi Người (Who)'
  },
  {
    id: 'L-P2-04',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Why was the shipment to Vancouver delayed?',
    audioScript: 'Why was the shipment to Vancouver delayed? (A) Because of severe winter snowstorms. (B) Three hundred units in total. (C) Yes, it arrived this morning.',
    options: [
      { label: 'A', text: 'Because of severe winter snowstorms.', vietnamese: 'Bởi vì những cơn bão tuyết mùa đông nghiêm trọng.' },
      { label: 'B', text: 'Three hundred units in total.', vietnamese: 'Tổng cộng ba trăm kiện hàng.' },
      { label: 'C', text: 'Yes, it arrived this morning.', vietnamese: 'Vâng, nó đã đến sáng nay.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "Why" (Tại sao) hỏi lý do, (A) bắt đầu bằng "Because of..." giải thích trực tiếp nguyên nhân bão tuyết.',
    topic: 'Hỏi Lý Do (Why)'
  },
  {
    id: 'L-P2-05',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Could you give me a hand unloading these boxes?',
    audioScript: 'Could you give me a hand unloading these boxes? (A) Sure, let me put my jacket down first. (B) Two pairs of work gloves. (C) No, the box was completely empty.',
    options: [
      { label: 'A', text: 'Sure, let me put my jacket down first.', vietnamese: 'Chắc chắn rồi, để tôi cởi áo khoác xuống trước đã.' },
      { label: 'B', text: 'Two pairs of work gloves.', vietnamese: 'Hai đôi găng tay làm việc.' },
      { label: 'C', text: 'No, the box was completely empty.', vietnamese: 'Không, cái hộp hoàn toàn trống rỗng.' }
    ],
    correctAnswer: 'A',
    explanation: '"Give me a hand" là thành ngữ mang nghĩa "giúp một tay". (A) là lời nhận lời giúp đỡ lịch sự: "Sure, let me put my jacket down first".',
    topic: 'Lời Đề Nghị / Yêu Cầu (Could you)'
  },
  {
    id: 'L-P2-06',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'How often do the shuttle buses run between the hotels and the convention center?',
    audioScript: 'How often do the shuttle buses run between the hotels and the convention center? (A) Every fifteen minutes during peak hours. (B) It takes around twenty minutes. (C) At the central bus terminal.',
    options: [
      { label: 'A', text: 'Every fifteen minutes during peak hours.', vietnamese: 'Cứ mỗi 15 phút vào giờ cao điểm.' },
      { label: 'B', text: 'It takes around twenty minutes.', vietnamese: 'Mất khoảng 20 phút.' },
      { label: 'C', text: 'At the central bus terminal.', vietnamese: 'Ở trạm xe buýt trung tâm.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "How often" (Bao lâu một lần) hỏi về tần suất. (A) "Every fifteen minutes" là câu trả lời chỉ tần suất chính xác. (B) bẫy How long (khoảng thời gian).',
    topic: 'Hỏi Tần Suất (How often)'
  },
  {
    id: 'L-P2-07',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Would you prefer to fly directly or take a connecting flight with a layover?',
    audioScript: 'Would you prefer to fly directly or take a connecting flight with a layover? (A) The non-stop flight would save us valuable time. (B) Yes, flying is much faster than the train. (C) Gate 14 is on the left.',
    options: [
      { label: 'A', text: 'The non-stop flight would save us valuable time.', vietnamese: 'Chuyến bay thẳng sẽ giúp chúng ta tiết kiệm thời gian quý báu.' },
      { label: 'B', text: 'Yes, flying is much faster than the train.', vietnamese: 'Vâng, bay nhanh hơn tàu hỏa nhiều.' },
      { label: 'C', text: 'Gate 14 is on the left.', vietnamese: 'Cổng 14 ở phía bên trái.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi lựa chọn "A or B" (fly directly or connecting). (A) chọn phương án bay thẳng (non-stop = direct flight). Câu hỏi lựa chọn không dùng Yes/No.',
    topic: 'Câu Hỏi Lựa Chọn (Or)'
  },
  {
    id: 'L-P2-08',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'The catering order for the banquet hasn\'t been confirmed yet, has it?',
    audioScript: 'The catering order for the banquet hasn\'t been confirmed yet, has it? (A) Actually, Sarah finalized it this morning. (B) Chicken and vegetarian pasta. (C) It was held at the Grand Hotel.',
    options: [
      { label: 'A', text: 'Actually, Sarah finalized it this morning.', vietnamese: 'Thực ra, Sarah đã chốt nó sáng nay rồi.' },
      { label: 'B', text: 'Chicken and vegetarian pasta.', vietnamese: 'Gà và mì Ý chay.' },
      { label: 'C', text: 'It was held at the Grand Hotel.', vietnamese: 'Nó đã được tổ chức ở khách sạn Grand.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi đuôi phủ định (Tag Question). (A) cung cấp thông tin cập nhật thực tế: "Actually, Sarah finalized it this morning".',
    topic: 'Câu Hỏi Đuôi (Tag Question)'
  },
  {
    id: 'L-P2-09',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Should we print handouts for all attendees or just send them a digital link?',
    audioScript: 'Should we print handouts for all attendees or just send them a digital link? (A) A digital link will save on paper and printing costs. (B) In the auditorium at noon. (C) Yes, I attended the session.',
    options: [
      { label: 'A', text: 'A digital link will save on paper and printing costs.', vietnamese: 'Gửi link kỹ thuật số sẽ tiết kiệm giấy và chi phí in ấn.' },
      { label: 'B', text: 'In the auditorium at noon.', vietnamese: 'Ở hội trường vào buổi trưa.' },
      { label: 'C', text: 'Yes, I attended the session.', vietnamese: 'Vâng, tôi đã tham dự buổi học.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi lựa chọn: print handouts hay digital link? (A) chọn digital link và giải thích lợi ích tiết kiệm chi phí in ấn.',
    topic: 'Câu Hỏi Lựa Chọn (Or)'
  },
  {
    id: 'L-P2-10',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Who will be delivering the opening keynote speech at the conference?',
    audioScript: 'Who will be delivering the opening keynote speech at the conference? (A) Dr. Tanaka from our Tokyo research branch. (B) It starts promptly at nine o\'clock. (C) No, I haven\'t registered yet.',
    options: [
      { label: 'A', text: 'Dr. Tanaka from our Tokyo research branch.', vietnamese: 'Tiến sĩ Tanaka từ chi nhánh nghiên cứu Tokyo của chúng ta.' },
      { label: 'B', text: 'It starts promptly at nine o\'clock.', vietnamese: 'Nó bắt đầu đúng 9 giờ sáng.' },
      { label: 'C', text: 'No, I haven\'t registered yet.', vietnamese: 'Chưa, tôi chưa đăng ký.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "Who" hỏi người diễn thuyết. (A) nêu đích danh "Dr. Tanaka from Tokyo". (B) trả lời giờ giấc; (C) trả lời câu hỏi Yes/No.',
    topic: 'Hỏi Người (Who)'
  },
  {
    id: 'L-P2-11',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Isn\'t the client supposed to sign the service contract today?',
    audioScript: 'Isn\'t the client supposed to sign the service contract today? (A) Their legal team asked for a two-day extension. (B) Yes, the sign is outside the main entrance. (C) Five copies were printed.',
    options: [
      { label: 'A', text: 'Their legal team asked for a two-day extension.', vietnamese: 'Đội ngũ pháp lý của họ đã xin gia hạn thêm hai ngày.' },
      { label: 'B', text: 'Yes, the sign is outside the main entrance.', vietnamese: 'Vâng, biển báo ở bên ngoài lối vào chính.' },
      { label: 'C', text: 'Five copies were printed.', vietnamese: 'Năm bản sao đã được in.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi phủ định "Isn\'t...". (A) là câu trả lời gián tiếp điển hình trong TOEIC: giải thích lý do hợp đồng chưa ký được vì đối tác xin gia hạn.',
    topic: 'Câu Hỏi Phủ Định (Negative Question)'
  },
  {
    id: 'L-P2-12',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Have you reserved a table at the Italian bistro for tonight\'s dinner?',
    audioScript: 'Have you reserved a table at the Italian bistro for tonight\'s dinner? (A) They don\'t take reservations on weekends, so we should go early. (B) A seafood pizza and salad, please. (C) Yes, it is located on Maple Street.',
    options: [
      { label: 'A', text: 'They don\'t take reservations on weekends, so we should go early.', vietnamese: 'Họ không nhận đặt bàn vào cuối tuần, nên chúng ta nên đi sớm.' },
      { label: 'B', text: 'A seafood pizza and salad, please.', vietnamese: 'Làm ơn cho một bánh pizza hải sản và salad.' },
      { label: 'C', text: 'Yes, it is located on Maple Street.', vietnamese: 'Vâng, nó nằm ở đường Maple.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi xác nhận đặt bàn. (A) trả lời tình huống thực tế nhà hàng không nhận đặt bàn và đề xuất giải pháp đi sớm.',
    topic: 'Câu Hỏi Yes/No & Trả Lời Gián Tiếp'
  }
];
