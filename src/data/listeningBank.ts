export interface ListeningQuestion {
  id: string;
  part: 1 | 2;
  direction: string;
  questionText: string;
  questionVi?: string;
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
    audioScript: '(A) Some people are waiting in line. (B) Some people are sitting on chairs. (C) Some people are pulling their suitcases. (D) Some people are standing outside.',
    options: [
      { label: 'A', text: 'Some people are waiting in line.', vietnamese: 'Vài người đang xếp hàng chờ.' },
      { label: 'B', text: 'Some people are sitting on chairs.', vietnamese: 'Vài người đang ngồi trên ghế.' },
      { label: 'C', text: 'Some people are pulling their suitcases.', vietnamese: 'Vài người đang kéo vali của họ.' },
      { label: 'D', text: 'Some people are standing outside.', vietnamese: 'Vài người đang đứng ở bên ngoài.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Các hành khách đang đứng xếp hàng trật tự tại quầy thủ tục sân bay (waiting in line). (B) sai vì không có ai đang ngồi. (C) sai vì vali đang được đặt yên bên cạnh người đứng chờ, không ai kéo đi. (D) sai vì mọi người đang ở trong nhà ga sân bay.',
    topic: 'Sân bay / Xếp hàng'
  },
  {
    id: 'L-P1-02',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_02.jpg',
    audioScript: '(A) Some bicycles are lying on the ground. (B) Some benches are being repaired in a park. (C) Some people are riding bicycles on a path. (D) Some bicycles are parked in a rack.',
    options: [
      { label: 'A', text: 'Some bicycles are lying on the ground.', vietnamese: 'Một số chiếc xe đạp đang nằm trên mặt đất.' },
      { label: 'B', text: 'Some benches are being repaired in a park.', vietnamese: 'Một số ghế dài đang được sửa chữa trong công viên.' },
      { label: 'C', text: 'Some people are riding bicycles on a path.', vietnamese: 'Vài người đang đạp xe trên con đường nhỏ.' },
      { label: 'D', text: 'Some bicycles are parked in a rack.', vietnamese: 'Một số chiếc xe đạp đang đỗ trong giá để xe.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Dãy xe đạp được khóa và đỗ ngay ngắn trong giá để xe ngoài trời (parked in a rack). (A) sai vì xe dựng đứng trong giá, không nằm rạp trên đất. (B) sai vì không có ghế dài nào đang được sửa chữa. (C) sai vì không có ai đang đạp xe.',
    topic: 'Công viên / Phương tiện'
  },
  {
    id: 'L-P1-03',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_03.jpg',
    audioScript: '(A) A man is stacking some finished baskets. (B) A customer is examining a large basket. (C) Some baskets are being carried away. (D) A man is weaving a round basket.',
    options: [
      { label: 'A', text: 'A man is stacking some finished baskets.', vietnamese: 'Một người đàn ông đang xếp chồng các chiếc giỏ đã hoàn thành.' },
      { label: 'B', text: 'A customer is examining a large basket.', vietnamese: 'Một khách hàng đang xem xét một chiếc giỏ lớn.' },
      { label: 'C', text: 'Some baskets are being carried away.', vietnamese: 'Một số chiếc giỏ đang được mang đi.' },
      { label: 'D', text: 'A man is weaving a round basket.', vietnamese: 'Một người đàn ông đang đan một chiếc giỏ tròn.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Người thợ thủ công đang ngồi trên ghế đẩu dùng nan mây đan một chiếc giỏ tròn (weaving a round basket). (A) sai vì giỏ đã xếp sẵn thành chồng bên cạnh, anh ấy không xếp chúng. (B) sai vì không có khách mua hàng. (C) sai vì không có ai đang mang giỏ đi.',
    topic: 'Nghề thủ công / Đan lát'
  },
  {
    id: 'L-P1-04',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_04.jpg',
    audioScript: '(A) He\'s cutting up some vegetables. (B) He\'s wiping down the counter. (C) He\'s wearing a hat. (D) He\'s holding a mug.',
    options: [
      { label: 'A', text: 'He\'s cutting up some vegetables.', vietnamese: 'Anh ấy đang thái một số loại rau củ.' },
      { label: 'B', text: 'He\'s wiping down the counter.', vietnamese: 'Anh ấy đang lau chùi mặt quầy.' },
      { label: 'C', text: 'He\'s wearing a hat.', vietnamese: 'Anh ấy đang đội một chiếc mũ.' },
      { label: 'D', text: 'He\'s holding a mug.', vietnamese: 'Anh ấy đang cầm một chiếc cốc.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Người đầu bếp trong bếp đang dùng dao thái hành và rau củ trên thớt (cutting up some vegetables). (B) sai vì anh ấy không lau quầy. (C) sai vì anh ấy không đội mũ. (D) sai vì chiếc cốc sứ đặt trên quầy, tay anh ấy đang cầm dao thái thức ăn.',
    topic: 'Nhà bếp / Ẩm thực'
  },
  {
    id: 'L-P1-05',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_05.jpg',
    audioScript: '(A) Brochures have been spread out on the carpet. (B) The man is arranging cushions on a sofa. (C) A suitcase has been placed on the floor. (D) The man is posting a notice on the board.',
    options: [
      { label: 'A', text: 'Brochures have been spread out on the carpet.', vietnamese: 'Tờ rơi quảng cáo đã được rải ra trên thảm.' },
      { label: 'B', text: 'The man is arranging cushions on a sofa.', vietnamese: 'Người đàn ông đang sắp xếp gối đệm trên ghế sofa.' },
      { label: 'C', text: 'A suitcase has been placed on the floor.', vietnamese: 'Một chiếc vali đã được đặt trên sàn nhà.' },
      { label: 'D', text: 'The man is posting a notice on the board.', vietnamese: 'Người đàn ông đang dán một thông báo lên bảng.' }
    ],
    correctAnswer: 'C',
    explanation: 'Quan sát ảnh: Chiếc vali kéo du lịch được đặt đứng trên sàn nhà cạnh người đàn ông (a suitcase has been placed on the floor). (A) sai vì tờ rơi được cắm trên giá sách, không rải trên thảm. (B) sai vì người đàn ông đang đứng đọc tài liệu, không chạm vào sofa. (D) sai vì bảng thông báo phía sau trống trơn, anh ấy không dán giấy.',
    topic: 'Khách sạn / Du lịch'
  },
  {
    id: 'L-P1-06',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_06.jpg',
    audioScript: '(A) A worker is wrapping a pallet. (B) Some crates are being stacked outdoors. (C) A man is sweeping the warehouse floor. (D) A worker is driving a forklift.',
    options: [
      { label: 'A', text: 'A worker is wrapping a pallet.', vietnamese: 'Một công nhân đang quấn màng bọc một tấm pallet hàng.' },
      { label: 'B', text: 'Some crates are being stacked outdoors.', vietnamese: 'Một số thùng gỗ đang được xếp chồng ngoài trời.' },
      { label: 'C', text: 'A man is sweeping the warehouse floor.', vietnamese: 'Một người đàn ông đang quét sàn nhà kho.' },
      { label: 'D', text: 'A worker is driving a forklift.', vietnamese: 'Một công nhân đang lái xe nâng hàng.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Nam công nhân kho đang dùng cuộn màng co nilon quấn chặt các thùng hàng trên kệ pallet gỗ (wrapping a pallet). (B) sai vì khung cảnh diễn ra trong nhà kho, không phải ngoài trời. (C) sai vì không có ai đang quét sàn. (D) sai vì xe nâng ở phía sau đang tắt máy đỗ yên, không có người lái.',
    topic: 'Nhà kho / Logistics'
  },
  {
    id: 'L-P1-07',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_07.jpg',
    audioScript: '(A) Two people are pushing a cart along a path. (B) A bench is being moved into a park. (C) Some workers are planting flowers in a garden. (D) People are gathered around a water fountain.',
    options: [
      { label: 'A', text: 'Two people are pushing a cart along a path.', vietnamese: 'Hai người đang đẩy một chiếc xe chở hàng dọc theo lối đi.' },
      { label: 'B', text: 'A bench is being moved into a park.', vietnamese: 'Một chiếc ghế dài đang được chuyển vào công viên.' },
      { label: 'C', text: 'Some workers are planting flowers in a garden.', vietnamese: 'Vài công nhân đang trồng hoa trong vườn.' },
      { label: 'D', text: 'People are gathered around a water fountain.', vietnamese: 'Mọi người đang tụ tập quanh đài phun nước.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Hai người đàn ông và phụ nữ đang cùng nhau đẩy chiếc xe rùa chở đầy các bao tải dọc theo con đường nhựa trong công viên (pushing a cart along a path). (B) sai vì ghế băng đặt cố định bên vệ đường. (C) sai vì không ai đang trồng hoa. (D) đài phun nước ở phía xa và không có nhóm người nào vây quanh.',
    topic: 'Công viên / Lao động ngoài trời'
  },
  {
    id: 'L-P1-08',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_08.jpg',
    audioScript: '(A) She is writing in a notebook at a desk. (B) She is talking on a telephone. (C) She is turning on a computer monitor. (D) She is arranging folders on a bookshelf.',
    options: [
      { label: 'A', text: 'She is writing in a notebook at a desk.', vietnamese: 'Cô ấy đang viết vào một cuốn sổ tay tại bàn làm việc.' },
      { label: 'B', text: 'She is talking on a telephone.', vietnamese: 'Cô ấy đang nói chuyện điện thoại.' },
      { label: 'C', text: 'She is turning on a computer monitor.', vietnamese: 'Cô ấy đang bật màn hình máy tính.' },
      { label: 'D', text: 'She is arranging folders on a bookshelf.', vietnamese: 'Cô ấy đang sắp xếp các tập hồ sơ trên giá sách.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Người phụ nữ ngồi tại bàn làm việc, tay cầm bút đang viết vào cuốn sổ tay (writing in a notebook at a desk). (B) sai vì không có điện thoại. (C) sai vì tay cô ấy đang viết, không thao tác bật màn hình. (D) sai vì các tập tài liệu nằm trên kệ phía sau, cô ấy không sắp xếp chúng.',
    topic: 'Văn phòng / Viết tài liệu'
  },
  {
    id: 'L-P1-09',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_09.jpg',
    audioScript: '(A) A woman is pouring liquid from a pitcher. (B) Dishes are being washed in a sink. (C) Cups are being packed into a box. (D) Some coworkers are sitting at a cafeteria table.',
    options: [
      { label: 'A', text: 'A woman is pouring liquid from a pitcher.', vietnamese: 'Một phụ nữ đang rót chất lỏng từ một chiếc bình.' },
      { label: 'B', text: 'Dishes are being washed in a sink.', vietnamese: 'Bát đĩa đang được rửa trong bồn rửa.' },
      { label: 'C', text: 'Cups are being packed into a box.', vietnamese: 'Những chiếc cốc đang được đóng vào thùng.' },
      { label: 'D', text: 'Some coworkers are sitting at a cafeteria table.', vietnamese: 'Một vài đồng nghiệp đang ngồi tại bàn ăn.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Trong phòng giải lao văn phòng, một nữ nhân viên đang cầm bình thủy tinh rót nước vào cốc sứ (pouring liquid from a pitcher). (B) sai vì không có ai rửa bát. (C) sai vì các cốc đặt trên khay phục vụ, không đóng hộp. (D) sai vì cả hai người đều đang đứng nói chuyện, không ngồi.',
    topic: 'Văn phòng / Nghỉ giải lao'
  },
  {
    id: 'L-P1-10',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_10.jpg',
    audioScript: '(A) Chairs are being unfolded for an event. (B) Some furniture is being moved across a room. (C) A cart is being loaded with heavy boxes. (D) Workers are repairing a window frame.',
    options: [
      { label: 'A', text: 'Chairs are being unfolded for an event.', vietnamese: 'Những chiếc ghế đang được mở ra cho một sự kiện.' },
      { label: 'B', text: 'Some furniture is being moved across a room.', vietnamese: 'Một số đồ nội thất đang được di chuyển qua căn phòng.' },
      { label: 'C', text: 'A cart is being loaded with heavy boxes.', vietnamese: 'Một chiếc xe đẩy đang được chất các thùng hàng nặng.' },
      { label: 'D', text: 'Workers are repairing a window frame.', vietnamese: 'Các công nhân đang sửa chữa khung cửa sổ.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Hai người đàn ông mỗi người cầm một đầu chiếc bàn gỗ dài và đang cùng nhau khiêng nó di chuyển qua phòng (furniture is being moved across a room). (A) sai vì ghế đang xếp chồng dựa vào tường. (C) xe đẩy để trống bên cạnh, không ai chất đồ. (D) khung cửa sổ kính không có ai sửa.',
    topic: 'Nội thất / Chuyển đồ'
  },
  {
    id: 'L-P1-11',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_11.jpg',
    audioScript: '(A) A woman is purchasing souvenirs at a market. (B) Some people are swimming in an outdoor fountain. (C) A man is taking a photograph in a public square. (D) Bicycles are being loaded onto a truck.',
    options: [
      { label: 'A', text: 'A woman is purchasing souvenirs at a market.', vietnamese: 'Một phụ nữ đang mua đồ lưu niệm tại chợ.' },
      { label: 'B', text: 'Some people are swimming in an outdoor fountain.', vietnamese: 'Vài người đang bơi trong đài phun nước ngoài trời.' },
      { label: 'C', text: 'A man is taking a photograph in a public square.', vietnamese: 'Một người đàn ông đang chụp ảnh ở quảng trường công cộng.' },
      { label: 'D', text: 'Bicycles are being loaded onto a truck.', vietnamese: 'Xe đạp đang được bốc lên một chiếc xe tải.' }
    ],
    correctAnswer: 'C',
    explanation: 'Quan sát ảnh: Người đàn ông đang giơ máy ảnh chụp hình người phụ nữ đứng tạo dáng trước đài kỷ niệm bằng đá tại quảng trường (taking a photograph in a public square). (A) sai vì người phụ nữ đang đứng chụp ảnh, không mua sắm ở quầy hàng. (B) không có ai bơi trong đài phun nước. (D) xe đạp đang đỗ thành hàng, không có xe tải.',
    topic: 'Đô thị / Du lịch'
  },
  {
    id: 'L-P1-12',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_12.jpg',
    audioScript: '(A) Food is being served on an outdoor patio. (B) Outdoor chairs are arranged around a patio table. (C) A garden fountain is being cleaned by a worker. (D) Potted plants are being carried indoors.',
    options: [
      { label: 'A', text: 'Food is being served on an outdoor patio.', vietnamese: 'Thức ăn đang được phục vụ trên sân hiên ngoài trời.' },
      { label: 'B', text: 'Outdoor chairs are arranged around a patio table.', vietnamese: 'Những chiếc ghế ngoài trời được sắp xếp quanh chiếc bàn sân hiên.' },
      { label: 'C', text: 'A garden fountain is being cleaned by a worker.', vietnamese: 'Một đài phun nước sân vườn đang được công nhân dọn dẹp.' },
      { label: 'D', text: 'Potted plants are being carried indoors.', vietnamese: 'Các chậu cây cảnh đang được mang vào trong nhà.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Khoảng sân hiên gạch lát có một bộ bàn ghế gỗ ngoài trời gồm 4 chiếc ghế kê quanh bàn (chairs are arranged around a patio table). (A) sai vì mặt bàn trống trơn không có đồ ăn. (C) đài phun nước ở góc sân không có người lau dọn. (D) các chậu cây đặt dọc bờ tường, không ai mang đi.',
    topic: 'Sân hiên / Ngoại cảnh'
  },
  {
    id: 'L-P1-13',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_13.jpg',
    audioScript: '(A) Some notebooks are stacked on a desk. (B) A drawer is being opened. (C) A lamp is covered with folders. (D) Some pens are scattered across a desk.',
    options: [
      { label: 'A', text: 'Some notebooks are stacked on a desk.', vietnamese: 'Một số cuốn sổ tay được xếp chồng trên bàn.' },
      { label: 'B', text: 'A drawer is being opened.', vietnamese: 'Một ngăn kéo đang được kéo mở ra.' },
      { label: 'C', text: 'A lamp is covered with folders.', vietnamese: 'Một chiếc đèn đang bị che bởi các tập hồ sơ.' },
      { label: 'D', text: 'Some pens are scattered across a desk.', vietnamese: 'Vài chiếc bút đang bị vương vãi khắp mặt bàn.' }
    ],
    correctAnswer: 'A',
    explanation: 'Quan sát ảnh: Chồng sổ tay gồm 3 cuốn được đặt ngay ngắn trên mặt bàn (some notebooks are stacked on a desk). (B) sai vì ngăn kéo tủ bàn đang đóng kín. (C) sai vì đèn bàn đứng thẳng cạnh giá sách, không bị che. (D) sai vì bút được cắm cẩn thận trong hộp đựng bút, không bị vương vãi.',
    topic: 'Bàn làm việc / Đồ dùng'
  },
  {
    id: 'L-P1-14',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_14.jpg',
    audioScript: '(A) Shopping carts are being pushed through a store. (B) Boxes are being stacked near an entrance. (C) Groceries have been placed in a cart. (D) Some shopping carts are lined up near an entrance.',
    options: [
      { label: 'A', text: 'Shopping carts are being pushed through a store.', vietnamese: 'Xe đẩy hàng đang được đẩy qua một cửa hàng.' },
      { label: 'B', text: 'Boxes are being stacked near an entrance.', vietnamese: 'Các hộp hàng đang được xếp chồng gần lối ra vào.' },
      { label: 'C', text: 'Groceries have been placed in a cart.', vietnamese: 'Hàng tạp hóa đã được đặt trong xe đẩy.' },
      { label: 'D', text: 'Some shopping carts are lined up near an entrance.', vietnamese: 'Một số xe đẩy hàng được xếp thành hàng gần lối ra vào.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Dãy xe đẩy hàng kim loại được xếp lồng vào nhau gọn gàng bên trong khung chắn kim loại ngay cửa ra vào siêu thị (shopping carts are lined up near an entrance). (A) sai vì không có ai đang đẩy xe. (B) không có thùng hộp nào. (C) các xe đẩy đều trống rỗng.',
    topic: 'Siêu thị / Mua sắm'
  },
  {
    id: 'L-P1-15',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_15.jpg',
    audioScript: '(A) One of the men is holding a broom. (B) One of the men is climbing a ladder. (C) The men are carrying a board. (D) The men are painting a wall.',
    options: [
      { label: 'A', text: 'One of the men is holding a broom.', vietnamese: 'Một trong những người đàn ông đang cầm một chiếc chổi.' },
      { label: 'B', text: 'One of the men is climbing a ladder.', vietnamese: 'Một trong những người đàn ông đang trèo lên thang.' },
      { label: 'C', text: 'The men are carrying a board.', vietnamese: 'Những người đàn ông đang cùng khiêng một tấm ván.' },
      { label: 'D', text: 'The men are painting a wall.', vietnamese: 'Những người đàn ông đang sơn một bức tường.' }
    ],
    correctAnswer: 'C',
    explanation: 'Quan sát ảnh: Hai người đàn ông đang cùng nhau bước đi và khiêng một tấm ván gỗ lớn màu trắng (the men are carrying a board). (A) cây chổi dựng vào tường phía sau, không ai cầm. (B) thang nhôm đặt cạnh góc, không ai trèo. (D) bức tường đã sơn xong, không có ai đang sơn.',
    topic: 'Xưởng mộc / Xây dựng'
  },
  {
    id: 'L-P1-16',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_16.jpg',
    audioScript: '(A) He\'s watering a plant. (B) He\'s opening a door. (C) He\'s pushing a chair. (D) He\'s vacuuming a carpet.',
    options: [
      { label: 'A', text: 'He\'s watering a plant.', vietnamese: 'Anh ấy đang tưới nước cho cây cảnh.' },
      { label: 'B', text: 'He\'s opening a door.', vietnamese: 'Anh ấy đang mở một cánh cửa.' },
      { label: 'C', text: 'He\'s pushing a chair.', vietnamese: 'Anh ấy đang đẩy một chiếc ghế.' },
      { label: 'D', text: 'He\'s vacuuming a carpet.', vietnamese: 'Anh ấy đang hút bụi một tấm thảm.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Người đàn ông đang cúi người dùng cần hút của máy hút bụi để làm sạch tấm thảm sàn nhà (vacuuming a carpet). (A) sai vì chậu cây cảnh đặt sau lưng, không ai tưới. (B) cánh cửa phòng màu trắng đang đóng kín. (C) chiếc ghế bành đặt yên một chỗ.',
    topic: 'Gia đình / Dọn dẹp'
  },
  {
    id: 'L-P1-17',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_17.jpg',
    audioScript: '(A) She\'s stacking some folders on a desk. (B) She\'s refilling a printer with paper. (C) Some folders have been dropped on the floor. (D) A printer is positioned on a cabinet.',
    options: [
      { label: 'A', text: 'She\'s stacking some folders on a desk.', vietnamese: 'Cô ấy đang xếp chồng các tập hồ sơ trên bàn.' },
      { label: 'B', text: 'She\'s refilling a printer with paper.', vietnamese: 'Cô ấy đang nạp thêm giấy vào máy in.' },
      { label: 'C', text: 'Some folders have been dropped on the floor.', vietnamese: 'Một số tập hồ sơ đã bị rơi xuống sàn nhà.' },
      { label: 'D', text: 'A printer is positioned on a cabinet.', vietnamese: 'Một chiếc máy in được đặt trên một chiếc tủ tài liệu.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Trên nóc chiếc tủ ngăn kéo đựng hồ sơ có đặt chiếc máy in văn phòng (a printer is positioned on a cabinet). (A) sai vì cô ấy đang rút hồ sơ từ ngăn kéo tủ, không xếp lên bàn. (B) sai vì máy in để yên, không ai nạp giấy. (C) sàn nhà hoàn toàn sạch sẽ, không có tài liệu rơi.',
    topic: 'Văn phòng / Thiết bị'
  },
  {
    id: 'L-P1-18',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_18.jpg',
    audioScript: '(A) A cabinet has been left open. (B) Mugs have been placed on a counter. (C) The coffee machine is being cleaned. (D) Napkins have been stacked on a chair.',
    options: [
      { label: 'A', text: 'A cabinet has been left open.', vietnamese: 'Một cánh tủ đã bị để mở.' },
      { label: 'B', text: 'Mugs have been placed on a counter.', vietnamese: 'Những chiếc cốc sứ đã được đặt trên quầy.' },
      { label: 'C', text: 'The coffee machine is being cleaned.', vietnamese: 'Chiếc máy pha cà phê đang được vệ sinh.' },
      { label: 'D', text: 'Napkins have been stacked on a chair.', vietnamese: 'Khăn giấy ăn đã được xếp chồng trên một chiếc ghế.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Trên mặt quầy bếp bên cạnh máy pha cà phê có khay đựng các cốc sứ trắng (mugs have been placed on a counter). (A) sai vì các cánh tủ bên dưới đều đóng. (C) sai vì máy pha cà phê để yên không có người lau dọn. (D) sai vì khăn giấy đặt trên quầy, chiếc ghế kê dưới bàn hoàn toàn để trống.',
    topic: 'Phòng nghỉ / Quầy cà phê'
  },
  {
    id: 'L-P1-19',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_19.jpg',
    audioScript: '(A) Some boxes are being loaded onto a delivery truck. (B) A man is pushing a utility cart in a storage room. (C) A woman is assembling metal shelving. (D) Filing cabinets are being unloaded from a vehicle.',
    options: [
      { label: 'A', text: 'Some boxes are being loaded onto a delivery truck.', vietnamese: 'Vài chiếc hộp đang được bốc lên xe tải giao hàng.' },
      { label: 'B', text: 'A man is pushing a utility cart in a storage room.', vietnamese: 'Một người đàn ông đang đẩy chiếc xe chở hàng trong phòng kho.' },
      { label: 'C', text: 'A woman is assembling metal shelving.', vietnamese: 'Một phụ nữ đang lắp ráp kệ kim loại.' },
      { label: 'D', text: 'Filing cabinets are being unloaded from a vehicle.', vietnamese: 'Tủ đựng tài liệu đang được dỡ xuống khỏi xe.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Trong phòng kho/lưu trữ tài liệu, người đàn ông đang đẩy chiếc xe chở các thùng các-tông (pushing a utility cart in a storage room). (A) sai vì không có xe tải nào. (C) người phụ nữ đang với lấy đồ trên giá sách, không lắp kệ. (D) dãy tủ hồ sơ đặt cố định dọc bờ tường.',
    topic: 'Kho lưu trữ / Phân loại'
  },
  {
    id: 'L-P1-20',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_20.jpg',
    audioScript: '(A) Some armchairs are facing a window. (B) A curtain is being drawn across a window. (C) A seating area is illuminated by lamps. (D) Some magazines have been left on a table.',
    options: [
      { label: 'A', text: 'Some armchairs are facing a window.', vietnamese: 'Một số ghế bành đang hướng mặt về phía cửa sổ.' },
      { label: 'B', text: 'A curtain is being drawn across a window.', vietnamese: 'Một tấm rèm cửa đang được kéo qua cửa sổ.' },
      { label: 'C', text: 'A seating area is illuminated by lamps.', vietnamese: 'Khu vực chỗ ngồi đang được thắp sáng bởi những chiếc đèn.' },
      { label: 'D', text: 'Some magazines have been left on a table.', vietnamese: 'Một số tờ tạp chí đã được để lại trên một chiếc bàn.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Bốn cuốn tạp chí được xếp xòe ra ngay ngắn trên mặt bàn cà phê trước ghế sofa (some magazines have been left on a table). (A) sai vì đây là ghế sofa dài hướng về phía trước, không có ghế bành quay vào cửa sổ. (B) không có người nào đang kéo rèm. (C) đèn sàn không bật sáng.',
    topic: 'Phòng khách / Bày trí'
  },
  {
    id: 'L-P1-21',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_21.jpg',
    audioScript: '(A) A fence is being constructed across a field. (B) A man is moving a wheelbarrow along a dirt road. (C) Crops are being harvested with heavy machinery. (D) Horses are running through a pasture.',
    options: [
      { label: 'A', text: 'A fence is being constructed across a field.', vietnamese: 'Một hàng rào đang được xây dựng băng qua cánh đồng.' },
      { label: 'B', text: 'A man is moving a wheelbarrow along a dirt road.', vietnamese: 'Một người đàn ông đang đẩy xe rùa dọc theo con đường đất.' },
      { label: 'C', text: 'Crops are being harvested with heavy machinery.', vietnamese: 'Mùa màng đang được thu hoạch bằng máy móc hạng nặng.' },
      { label: 'D', text: 'Horses are running through a pasture.', vietnamese: 'Đàn ngựa đang chạy qua bãi cỏ chăn thả.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Người nông dân đang đẩy chiếc xe cút kít chở bao tải nặng dọc theo con đường đất cạnh hàng rào gỗ vùng đồi cỏ (moving a wheelbarrow along a dirt road). (A) hàng rào đã có sẵn, không ai đang xây dựng. (C) không có máy móc thu hoạch. (D) không có con ngựa nào.',
    topic: 'Nông thôn / Vận chuyển'
  },
  {
    id: 'L-P1-22',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_22.jpg',
    audioScript: '(A) Audience members are leaving a presentation room. (B) A presenter is pointing at a projection screen. (C) Handouts are being passed out to seminar attendees. (D) A whiteboard is being erased by an instructor.',
    options: [
      { label: 'A', text: 'Audience members are leaving a presentation room.', vietnamese: 'Các khán giả đang rời khỏi phòng thuyết trình.' },
      { label: 'B', text: 'A presenter is pointing at a projection screen.', vietnamese: 'Người thuyết trình đang chỉ tay vào màn hình máy chiếu.' },
      { label: 'C', text: 'Handouts are being passed out to seminar attendees.', vietnamese: 'Tài liệu phát tay đang được phát cho những người tham dự.' },
      { label: 'D', text: 'A whiteboard is being erased by an instructor.', vietnamese: 'Một tấm bảng trắng đang được giảng viên xóa sạch.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Diễn giả đang đứng trên bục giơ tay chỉ vào sơ đồ quy trình "Project Timeline Overview" trên màn hình máy chiếu (pointing at a projection screen). (A) người tham dự vẫn đang ngồi ngay ngắn trên ghế lắng nghe. (C) tài liệu đã để sẵn trên bàn. (D) bảng trắng phía sau không ai lau.',
    topic: 'Thuyết trình / Hội thảo'
  },
  {
    id: 'L-P1-23',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_23.jpg',
    audioScript: '(A) Office workers are sitting at a conference table. (B) Two people are lifting a wooden desk together. (C) Office chairs are being assembled with hand tools. (D) Documents are being shredded in a machine.',
    options: [
      { label: 'A', text: 'Office workers are sitting at a conference table.', vietnamese: 'Các nhân viên văn phòng đang ngồi quanh bàn họp.' },
      { label: 'B', text: 'Two people are lifting a wooden desk together.', vietnamese: 'Hai người đang cùng nhau nhấc một chiếc bàn gỗ lên.' },
      { label: 'C', text: 'Office chairs are being assembled with hand tools.', vietnamese: 'Ghế văn phòng đang được lắp ráp bằng dụng cụ cầm tay.' },
      { label: 'D', text: 'Documents are being shredded in a machine.', vietnamese: 'Tài liệu đang được cắt vụn trong máy hủy giấy.' }
    ],
    correctAnswer: 'B',
    explanation: 'Quan sát ảnh: Một người nam và một người nữ trong trang phục công sở đang khom người nhấc chiếc bàn làm việc bằng gỗ lên để di chuyển (two people are lifting a wooden desk together). (A) họ đang đứng nâng bàn, không ngồi. (C) ghế văn phòng xếp bên cạnh, không có ai lắp ráp. (D) không có máy hủy tài liệu.',
    topic: 'Văn phòng / Chuyển đồ nội thất'
  },
  {
    id: 'L-P1-24',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_24.jpg',
    audioScript: '(A) Meeting participants are shaking hands. (B) A colleague is writing notes on a whiteboard. (C) People are exiting a corporate boardroom. (D) A group of colleagues is examining documents on a table.',
    options: [
      { label: 'A', text: 'Meeting participants are shaking hands.', vietnamese: 'Những người tham gia cuộc họp đang bắt tay nhau.' },
      { label: 'B', text: 'A colleague is writing notes on a whiteboard.', vietnamese: 'Một đồng nghiệp đang ghi chú lên tấm bảng trắng.' },
      { label: 'C', text: 'People are exiting a corporate boardroom.', vietnamese: 'Mọi người đang rời khỏi phòng họp của công ty.' },
      { label: 'D', text: 'A group of colleagues is examining documents on a table.', vietnamese: 'Một nhóm đồng nghiệp đang cùng xem xét các tài liệu trên bàn.' }
    ],
    correctAnswer: 'D',
    explanation: 'Quan sát ảnh: Nhóm 5 nhân viên công sở đang đứng quây quanh chiếc bàn họp dài, cúi người chăm chú nhìn vào các tờ tài liệu trải trên bàn (examining documents on a table). (A) không ai bắt tay nhau. (B) bảng trắng ở tường phía sau để trống, không ai viết. (C) mọi người đang họp, không ai ra về.',
    topic: 'Họp bàn / Thảo luận dự án'
  },

  // ==========================================
  // PART 2: QUESTION - RESPONSE (Hỏi - Đáp)
  // ==========================================
  {
    id: 'L-P2-01',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Where is the monthly sales meeting being held?',
    questionVi: 'Cuộc họp bán hàng hàng tháng được tổ chức ở đâu?',
    audioScript: 'Where is the monthly sales meeting being held? (A) Yes, every Tuesday morning. (B) In conference room B on the third floor. (C) About fifty thousand dollars.',
    options: [
      { label: 'A', text: 'Yes, every Tuesday morning.', vietnamese: 'Vâng, vào mỗi sáng thứ Ba.' },
      { label: 'B', text: 'In conference room B on the third floor.', vietnamese: 'Ở phòng hội thảo B trên tầng ba.' },
      { label: 'C', text: 'About fifty thousand dollars.', vietnamese: 'Khoảng năm mươi nghìn đô la.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi bắt đầu bằng "Where" (Ở đâu) chỉ địa điểm, phương án (B) chỉ rõ vị trí "In conference room B". Câu hỏi WH không trả lời bằng Yes/No như (A).',
    topic: 'Hỏi Địa Điểm (Where)'
  },
  {
    id: 'L-P2-02',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'When will the new software update be installed?',
    questionVi: 'Khi nào bản cập nhật phần mềm mới sẽ được cài đặt?',
    audioScript: 'When will the new software update be installed? (A) No, I haven\'t seen the new monitor. (B) It cost more than expected. (C) The IT department is doing it on Friday night.',
    options: [
      { label: 'A', text: 'No, I haven\'t seen the new monitor.', vietnamese: 'Không, tôi chưa thấy màn hình mới.' },
      { label: 'B', text: 'It cost more than expected.', vietnamese: 'Nó tốn kém hơn dự kiến.' },
      { label: 'C', text: 'The IT department is doing it on Friday night.', vietnamese: 'Phòng IT sẽ thực hiện vào tối thứ Sáu.' }
    ],
    correctAnswer: 'C',
    explanation: 'Câu hỏi "When" (Khi nào) hỏi mốc thời gian. (C) đưa ra câu trả lời chính xác "on Friday night". (A) bẫy Yes/No; (B) trả lời về chi phí.',
    topic: 'Hỏi Thời Gian (When)'
  },
  {
    id: 'L-P2-03',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Who authorized the budget for the advertising campaign?',
    questionVi: 'Ai đã phê duyệt ngân sách cho chiến dịch quảng cáo?',
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
    questionVi: 'Tại sao chuyến hàng gửi đến Vancouver lại bị hoãn?',
    audioScript: 'Why was the shipment to Vancouver delayed? (A) Three hundred units in total. (B) Because of severe winter snowstorms. (C) Yes, it arrived this morning.',
    options: [
      { label: 'A', text: 'Three hundred units in total.', vietnamese: 'Tổng cộng ba trăm kiện hàng.' },
      { label: 'B', text: 'Because of severe winter snowstorms.', vietnamese: 'Bởi vì những cơn bão tuyết mùa đông nghiêm trọng.' },
      { label: 'C', text: 'Yes, it arrived this morning.', vietnamese: 'Vâng, nó đã đến sáng nay.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi "Why" (Tại sao) hỏi lý do, (B) bắt đầu bằng "Because of..." giải thích trực tiếp nguyên nhân bão tuyết.',
    topic: 'Hỏi Lý Do (Why)'
  },
  {
    id: 'L-P2-05',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Could you give me a hand unloading these boxes?',
    questionVi: 'Bạn có thể giúp tôi một tay dỡ những chiếc hộp này được không?',
    audioScript: 'Could you give me a hand unloading these boxes? (A) Two pairs of work gloves. (B) No, the box was completely empty. (C) Sure, let me put my jacket down first.',
    options: [
      { label: 'A', text: 'Two pairs of work gloves.', vietnamese: 'Hai đôi găng tay làm việc.' },
      { label: 'B', text: 'No, the box was completely empty.', vietnamese: 'Không, cái hộp hoàn toàn trống rỗng.' },
      { label: 'C', text: 'Sure, let me put my jacket down first.', vietnamese: 'Chắc chắn rồi, để tôi cởi áo khoác xuống trước đã.' }
    ],
    correctAnswer: 'C',
    explanation: '"Give me a hand" là thành ngữ mang nghĩa "giúp một tay". (C) là lời nhận lời giúp đỡ lịch sự: "Sure, let me put my jacket down first".',
    topic: 'Lời Đề Nghị / Yêu Cầu (Could you)'
  },
  {
    id: 'L-P2-06',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'How often do the shuttle buses run between the hotels and the convention center?',
    questionVi: 'Xe buýt đưa đón giữa khách sạn và trung tâm hội nghị chạy bao lâu một chuyến?',
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
    questionVi: 'Bạn thích bay thẳng hay bay chuyến quá cảnh?',
    audioScript: 'Would you prefer to fly directly or take a connecting flight with a layover? (A) Yes, flying is much faster than the train. (B) The non-stop flight would save us valuable time. (C) Gate 14 is on the left.',
    options: [
      { label: 'A', text: 'Yes, flying is much faster than the train.', vietnamese: 'Vâng, bay nhanh hơn tàu hỏa nhiều.' },
      { label: 'B', text: 'The non-stop flight would save us valuable time.', vietnamese: 'Chuyến bay thẳng sẽ giúp chúng ta tiết kiệm thời gian quý báu.' },
      { label: 'C', text: 'Gate 14 is on the left.', vietnamese: 'Cổng 14 ở phía bên trái.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi lựa chọn "A or B" (fly directly or connecting). (B) chọn phương án bay thẳng (non-stop = direct flight). Câu hỏi lựa chọn không dùng Yes/No.',
    topic: 'Câu Hỏi Lựa Chọn (Or)'
  },
  {
    id: 'L-P2-08',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'The catering order for the banquet hasn\'t been confirmed yet, has it?',
    questionVi: 'Đơn đặt tiệc vẫn chưa được xác nhận, phải không?',
    audioScript: 'The catering order for the banquet hasn\'t been confirmed yet, has it? (A) Chicken and vegetarian pasta. (B) It was held at the Grand Hotel. (C) Actually, Sarah finalized it this morning.',
    options: [
      { label: 'A', text: 'Chicken and vegetarian pasta.', vietnamese: 'Gà và mì Ý chay.' },
      { label: 'B', text: 'It was held at the Grand Hotel.', vietnamese: 'Nó đã được tổ chức ở khách sạn Grand.' },
      { label: 'C', text: 'Actually, Sarah finalized it this morning.', vietnamese: 'Thực ra, Sarah đã chốt nó sáng nay rồi.' }
    ],
    correctAnswer: 'C',
    explanation: 'Câu hỏi đuôi phủ định (Tag Question). (C) cung cấp thông tin cập nhật thực tế: "Actually, Sarah finalized it this morning".',
    topic: 'Câu Hỏi Đuôi (Tag Question)'
  },
  {
    id: 'L-P2-09',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Should we print handouts for all attendees or just send them a digital link?',
    questionVi: 'Chúng ta nên in tài liệu phát tay cho mọi người hay chỉ gửi link điện tử?',
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
    questionVi: 'Ai sẽ là người đọc bài phát biểu khai mạc tại hội nghị?',
    audioScript: 'Who will be delivering the opening keynote speech at the conference? (A) It starts promptly at nine o\'clock. (B) Dr. Tanaka from our Tokyo research branch. (C) No, I haven\'t registered yet.',
    options: [
      { label: 'A', text: 'It starts promptly at nine o\'clock.', vietnamese: 'Nó bắt đầu đúng 9 giờ sáng.' },
      { label: 'B', text: 'Dr. Tanaka from our Tokyo research branch.', vietnamese: 'Tiến sĩ Tanaka từ chi nhánh nghiên cứu Tokyo của chúng ta.' },
      { label: 'C', text: 'No, I haven\'t registered yet.', vietnamese: 'Chưa, tôi chưa đăng ký.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi "Who" hỏi người diễn thuyết. (B) nêu đích danh "Dr. Tanaka from Tokyo". (A) trả lời giờ giấc; (C) trả lời câu hỏi Yes/No.',
    topic: 'Hỏi Người (Who)'
  },
  {
    id: 'L-P2-11',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Isn\'t the client supposed to sign the service contract today?',
    questionVi: 'Chẳng phải hôm nay khách hàng sẽ ký hợp đồng dịch vụ sao?',
    audioScript: 'Isn\'t the client supposed to sign the service contract today? (A) Yes, the sign is outside the main entrance. (B) Five copies were printed. (C) Their legal team asked for a two-day extension.',
    options: [
      { label: 'A', text: 'Yes, the sign is outside the main entrance.', vietnamese: 'Vâng, biển báo ở bên ngoài lối vào chính.' },
      { label: 'B', text: 'Five copies were printed.', vietnamese: 'Năm bản sao đã được in.' },
      { label: 'C', text: 'Their legal team asked for a two-day extension.', vietnamese: 'Đội ngũ pháp lý của họ đã xin gia hạn thêm hai ngày.' }
    ],
    correctAnswer: 'C',
    explanation: 'Câu hỏi phủ định "Isn\'t...". (C) là câu trả lời gián tiếp điển hình trong TOEIC: giải thích lý do hợp đồng chưa ký được vì đối tác xin gia hạn.',
    topic: 'Câu Hỏi Phủ Định (Negative Question)'
  },
  {
    id: 'L-P2-12',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Have you reserved a table at the Italian bistro for tonight\'s dinner?',
    questionVi: 'Bạn đã đặt bàn ở quán ăn Ý cho bữa tối nay chưa?',
    audioScript: 'Have you reserved a table at the Italian bistro for tonight\'s dinner? (A) They don\'t take reservations on weekends, so we should go early. (B) A seafood pizza and salad, please. (C) Yes, it is located on Maple Street.',
    options: [
      { label: 'A', text: 'They don\'t take reservations on weekends, so we should go early.', vietnamese: 'Họ không nhận đặt bàn vào cuối tuần, nên chúng ta nên đi sớm.' },
      { label: 'B', text: 'A seafood pizza and salad, please.', vietnamese: 'Làm ơn cho một bánh pizza hải sản và salad.' },
      { label: 'C', text: 'Yes, it is located on Maple Street.', vietnamese: 'Vâng, nó nằm ở đường Maple.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi xác nhận đặt bàn. (A) trả lời tình huống thực tế nhà hàng không nhận đặt bàn và đề xuất giải pháp đi sớm.',
    topic: 'Câu Hỏi Yes/No & Trả Lời Gián Tiếp'
  },
  {
    id: 'L-P2-13',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'How much does the annual parking permit cost?',
    questionVi: 'Giấy phép đỗ xe hàng năm có giá bao nhiêu?',
    audioScript: 'How much does the annual parking permit cost? (A) In the underground parking garage. (B) It is seventy-five dollars per year. (C) Yes, I have a valid driver\'s license.',
    options: [
      { label: 'A', text: 'In the underground parking garage.', vietnamese: 'Ở trong hầm để xe ngầm.' },
      { label: 'B', text: 'It is seventy-five dollars per year.', vietnamese: 'Nó có giá bảy mươi lăm đô la mỗi năm.' },
      { label: 'C', text: 'Yes, I have a valid driver\'s license.', vietnamese: 'Vâng, tôi có bằng lái xe hợp lệ.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi "How much" hỏi về số tiền. (B) nêu chính xác mức giá "seventy-five dollars".',
    topic: 'Hỏi Giá Tiền (How much)'
  },
  {
    id: 'L-P2-14',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Would you mind reviewing this quarterly financial report before the board meeting?',
    questionVi: 'Bạn có phiền xem qua báo cáo tài chính quý này trước cuộc họp hội đồng quản trị không?',
    audioScript: 'Would you mind reviewing this quarterly financial report before the board meeting? (A) The board room is on the fifth floor. (B) About twenty-five percent increase. (C) Not at all, I will read through it after lunch.',
    options: [
      { label: 'A', text: 'The board room is on the fifth floor.', vietnamese: 'Phòng hội đồng quản trị ở tầng năm.' },
      { label: 'B', text: 'About twenty-five percent increase.', vietnamese: 'Tăng khoảng hai mươi lăm phần trăm.' },
      { label: 'C', text: 'Not at all, I will read through it after lunch.', vietnamese: 'Không phiền chút nào, tôi sẽ đọc kỹ sau bữa trưa.' }
    ],
    correctAnswer: 'C',
    explanation: '"Would you mind..." là lời nhờ vả lịch sự. Trả lời đồng ý bằng "Not at all" (Không phiền gì cả) kèm mốc thời gian thực hiện.',
    topic: 'Yêu Cầu Lịch Sự (Would you mind)'
  },
  {
    id: 'L-P2-15',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Where can I find the extra toner cartridges for the color printer?',
    questionVi: 'Tôi có thể tìm hộp mực dự phòng cho máy in màu ở đâu?',
    audioScript: 'Where can I find the extra toner cartridges for the color printer? (A) Check the top shelf of the supply closet. (B) Printing in full color. (C) Yes, it is out of paper.',
    options: [
      { label: 'A', text: 'Check the top shelf of the supply closet.', vietnamese: 'Hãy kiểm tra ngăn trên cùng của tủ đựng đồ dùng.' },
      { label: 'B', text: 'Printing in full color.', vietnamese: 'In ấn đầy đủ màu sắc.' },
      { label: 'C', text: 'Yes, it is out of paper.', vietnamese: 'Vâng, nó đã hết giấy.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi "Where" hỏi địa điểm cất giữ đồ đạc. (A) chỉ rõ vị trí "the top shelf of the supply closet".',
    topic: 'Hỏi Địa Điểm (Where)'
  },
  {
    id: 'L-P2-16',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Why hasn\'t the renovation of the customer lounge started yet?',
    questionVi: 'Tại sao việc cải tạo phòng chờ của khách hàng vẫn chưa được bắt đầu?',
    audioScript: 'Why hasn\'t the renovation of the customer lounge started yet? (A) New comfortable leather sofas. (B) We are still waiting for municipal building permits. (C) It will take three weeks.',
    options: [
      { label: 'A', text: 'New comfortable leather sofas.', vietnamese: 'Những chiếc ghế bọc da mới êm ái.' },
      { label: 'B', text: 'We are still waiting for municipal building permits.', vietnamese: 'Chúng ta vẫn đang chờ giấy phép xây dựng của thành phố.' },
      { label: 'C', text: 'It will take three weeks.', vietnamese: 'Nó sẽ mất ba tuần.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi "Why" hỏi lý do chậm trễ. (B) giải thích nguyên nhân khách quan: chờ cấp phép từ chính quyền địa phương.',
    topic: 'Hỏi Lý Do (Why)'
  },
  {
    id: 'L-P2-17',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Do you want to take the company shuttle or should we share a taxi?',
    questionVi: 'Bạn muốn đi xe đưa đón công ty hay chúng ta đi chung một chuyến taxi?',
    audioScript: 'Do you want to take the company shuttle or should we share a taxi? (A) Yes, the shuttle has twenty seats. (B) At terminal number two. (C) Taking a taxi will get us to the airport much faster.',
    options: [
      { label: 'A', text: 'Yes, the shuttle has twenty seats.', vietnamese: 'Vâng, xe đưa đón có hai mươi chỗ.' },
      { label: 'B', text: 'At terminal number two.', vietnamese: 'Ở nhà ga số hai.' },
      { label: 'C', text: 'Taking a taxi will get us to the airport much faster.', vietnamese: 'Đi taxi sẽ đưa chúng ta đến sân bay nhanh hơn nhiều.' }
    ],
    correctAnswer: 'C',
    explanation: 'Câu hỏi lựa chọn "A or B". (C) lựa chọn đi taxi và giải thích lý do nhanh hơn. Bẫy Yes/No ở câu (A).',
    topic: 'Câu Hỏi Lựa Chọn (Or)'
  },
  {
    id: 'L-P2-18',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Mr. Henderson submitted the revised marketing proposal, didn\'t he?',
    questionVi: 'Ông Henderson đã nộp bản đề xuất tiếp thị sửa đổi rồi, đúng không?',
    audioScript: 'Mr. Henderson submitted the revised marketing proposal, didn\'t he? (A) Yes, he sent it to the committee this morning. (B) A ten percent discount on selected products. (C) The meeting was rescheduled.',
    options: [
      { label: 'A', text: 'Yes, he sent it to the committee this morning.', vietnamese: 'Vâng, ông ấy đã gửi nó cho hội đồng sáng nay.' },
      { label: 'B', text: 'A ten percent discount on selected products.', vietnamese: 'Giảm giá mười phần trăm cho các sản phẩm chọn lọc.' },
      { label: 'C', text: 'The meeting was rescheduled.', vietnamese: 'Cuộc họp đã được dời lịch.' }
    ],
    correctAnswer: 'A',
    explanation: 'Câu hỏi đuôi xác nhận sự việc đã diễn ra. (A) xác nhận đã nộp và bổ sung thời điểm nộp sáng nay.',
    topic: 'Câu Hỏi Đuôi (Tag Question)'
  },
  {
    id: 'L-P2-19',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Which venue did the event planners choose for the annual gala dinner?',
    questionVi: 'Đơn vị tổ chức sự kiện đã chọn địa điểm nào cho dạ tiệc hàng năm?',
    audioScript: 'Which venue did the event planners choose for the annual gala dinner? (A) Around two hundred guests. (B) The waterfront ballroom at the Grand Hotel. (C) On Saturday evening at seven.',
    options: [
      { label: 'A', text: 'Around two hundred guests.', vietnamese: 'Khoảng hai trăm khách mời.' },
      { label: 'B', text: 'The waterfront ballroom at the Grand Hotel.', vietnamese: 'Phòng đại tiệc ven sông ở khách sạn Grand.' },
      { label: 'C', text: 'On Saturday evening at seven.', vietnamese: 'Vào tối thứ Bảy lúc bảy giờ.' }
    ],
    correctAnswer: 'B',
    explanation: 'Câu hỏi "Which venue" hỏi địa điểm cụ thể. (B) nêu tên phòng đại tiệc của khách sạn Grand.',
    topic: 'Hỏi Lựa Chọn Địa Điểm (Which)'
  },
  {
    id: 'L-P2-20',
    part: 2,
    direction: 'Part 2: Question - Response. Listen to a question or statement and three responses. Select the best response.',
    questionText: 'Have you received the tracking number for the international shipment?',
    questionVi: 'Bạn đã nhận được mã vận đơn theo dõi cho lô hàng quốc tế chưa?',
    audioScript: 'Have you received the tracking number for the international shipment? (A) Three heavy crates of machinery. (B) Yes, it operates worldwide. (C) The supplier just emailed it five minutes ago.',
    options: [
      { label: 'A', text: 'Three heavy crates of machinery.', vietnamese: 'Ba thùng máy móc hạng nặng.' },
      { label: 'B', text: 'Yes, it operates worldwide.', vietnamese: 'Vâng, nó hoạt động trên toàn thế giới.' },
      { label: 'C', text: 'The supplier just emailed it five minutes ago.', vietnamese: 'Nhà cung cấp vừa gửi email cách đây năm phút.' }
    ],
    correctAnswer: 'C',
    explanation: 'Câu hỏi xác nhận việc nhận thông tin. (C) trả lời tình huống thực tế nhà cung ứng vừa gửi email.',
    topic: 'Câu Hỏi Yes/No & Tình Huống Thực Tế'
  }
];
