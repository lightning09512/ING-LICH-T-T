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
  {
    id: 'L-P1-13',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_13.jpg',
    audioScript: '(A) Some dishes are drying on a rack. (B) A chef is slicing vegetables on a cutting board. (C) Pots and pans are hanging from a ceiling rack. (D) A sink is being filled with water.',
    options: [
      { label: 'A', text: 'Some dishes are drying on a rack.', vietnamese: 'Vài chiếc đĩa đang ráo nước trên giá phơi.' },
      { label: 'B', text: 'A chef is slicing vegetables on a cutting board.', vietnamese: 'Một đầu bếp đang thái rau củ trên thớt.' },
      { label: 'C', text: 'Pots and pans are hanging from a ceiling rack.', vietnamese: 'Xoong nồi đang được treo trên giá móc trần nhà.' },
      { label: 'D', text: 'A sink is being filled with water.', vietnamese: 'Bồn rửa đang được xả đầy nước.' }
    ],
    correctAnswer: 'C',
    explanation: 'Quan sát gian bếp: Dãy xoong nồi đang được treo từ giá trần (pots and pans are hanging from a ceiling rack).',
    topic: 'Nhà bếp / Dụng cụ'
  },
  {
    id: 'L-P1-14',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_14.jpg',
    audioScript: '(A) Passengers are waiting in a train carriage. (B) Some commuters are walking up a flight of stairs. (C) A train conductor is checking tickets. (D) People are standing on an outdoor balcony.',
    options: [
      { label: 'A', text: 'Passengers are waiting in a train carriage.', vietnamese: 'Hành khách đang chờ trong toa tàu.' },
      { label: 'B', text: 'Some commuters are walking up a flight of stairs.', vietnamese: 'Một số người đi làm đang bước lên cầu thang bộ.' },
      { label: 'C', text: 'A train conductor is checking tickets.', vietnamese: 'Nhân viên soát vé đang kiểm tra vé tàu.' },
      { label: 'D', text: 'People are standing on an outdoor balcony.', vietnamese: 'Mọi người đang đứng trên ban công ngoài trời.' }
    ],
    correctAnswer: 'B',
    explanation: 'Hình ảnh cho thấy người đi bộ đang đi lên các bậc cầu thang (walking up a flight of stairs).',
    topic: 'Giao thông / Di chuyển'
  },
  {
    id: 'L-P1-15',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_15.jpg',
    audioScript: '(A) A painter is working on a canvas. (B) Framed artwork is hanging on a gallery wall. (C) Visitors are admiring sculptures in a museum. (D) An artist is cleaning paintbrushes.',
    options: [
      { label: 'A', text: 'A painter is working on a canvas.', vietnamese: 'Họa sĩ đang vẽ tranh trên vải bạt.' },
      { label: 'B', text: 'Framed artwork is hanging on a gallery wall.', vietnamese: 'Các bức tranh có khung đang treo trên tường phòng tranh.' },
      { label: 'C', text: 'Visitors are admiring sculptures in a museum.', vietnamese: 'Khách tham quan đang chiêm ngưỡng các bức tượng.' },
      { label: 'D', text: 'An artist is cleaning paintbrushes.', vietnamese: 'Nghệ sĩ đang rửa cọ vẽ.' }
    ],
    correctAnswer: 'D',
    explanation: 'Họa sĩ đang dọn dẹp và làm sạch cọ vẽ bên bồn rửa (cleaning paintbrushes).',
    topic: 'Nghệ thuật / Hội họa'
  },
  {
    id: 'L-P1-16',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_16.jpg',
    audioScript: '(A) Some clothing is being folded on a table. (B) Garments are hanging on a retail clothing rack. (C) A customer is trying on a winter jacket. (D) A salesperson is adjusting a store mannequin.',
    options: [
      { label: 'A', text: 'Some clothing is being folded on a table.', vietnamese: 'Quần áo đang được gấp trên bàn.' },
      { label: 'B', text: 'Garments are hanging on a retail clothing rack.', vietnamese: 'Quần áo đang được treo trên giá treo đồ.' },
      { label: 'C', text: 'A customer is trying on a winter jacket.', vietnamese: 'Khách hàng đang mặc thử áo khoác mùa đông.' },
      { label: 'D', text: 'A salesperson is adjusting a store mannequin.', vietnamese: 'Nhân viên bán hàng đang chỉnh sửa ma-nơ-canh.' }
    ],
    correctAnswer: 'B',
    explanation: 'Các trang phục được treo ngay ngắn trên giá treo đồ (garments are hanging on a clothing rack).',
    topic: 'Thời trang / Cửa hàng'
  },
  {
    id: 'L-P1-17',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_17.jpg',
    audioScript: '(A) A road is being paved with asphalt. (B) Construction vehicles are parked near a building site. (C) Workers are digging a trench along a street. (D) Traffic cones are marking a detour route.',
    options: [
      { label: 'A', text: 'A road is being paved with asphalt.', vietnamese: 'Con đường đang được rải nhựa đường.' },
      { label: 'B', text: 'Construction vehicles are parked near a building site.', vietnamese: 'Các xe thi công công trình đang đỗ gần công trường xây dựng.' },
      { label: 'C', text: 'Workers are digging a trench along a street.', vietnamese: 'Công nhân đang đào rãnh dọc theo con phố.' },
      { label: 'D', text: 'Traffic cones are marking a detour route.', vietnamese: 'Cọc tiêu giao thông đang đánh dấu đường vòng.' }
    ],
    correctAnswer: 'B',
    explanation: 'Các phương tiện xe máy công trình hạng nặng đang đỗ cạnh khu vực thi công (construction vehicles are parked).',
    topic: 'Xây dựng / Công trường'
  },
  {
    id: 'L-P1-18',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_18.jpg',
    audioScript: '(A) A musician is playing an acoustic guitar. (B) An audience is cheering at a music concert. (C) Microphones are being set up on a stage. (D) Sound equipment has been arranged on the floor.',
    options: [
      { label: 'A', text: 'A musician is playing an acoustic guitar.', vietnamese: 'Một nhạc sĩ đang chơi đàn guitar mộc.' },
      { label: 'B', text: 'An audience is cheering at a music concert.', vietnamese: 'Khán giả đang reo hò tại một buổi hòa nhạc.' },
      { label: 'C', text: 'Microphones are being set up on a stage.', vietnamese: 'Microphone đang được lắp đặt trên sân khấu.' },
      { label: 'D', text: 'Sound equipment has been arranged on the floor.', vietnamese: 'Thiết bị âm thanh đã được sắp xếp trên sàn.' }
    ],
    correctAnswer: 'D',
    explanation: 'Hệ thống thiết bị âm thanh, dây cáp và loa đài được bố trí cẩn thận trên mặt sàn sân khấu (sound equipment has been arranged).',
    topic: 'Sự kiện / Âm thanh'
  },
  {
    id: 'L-P1-19',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_19.jpg',
    audioScript: '(A) A group of colleagues is gathered around a conference table. (B) A presenter is pointing at a projection screen. (C) Handouts are being distributed to meeting attendees. (D) Office chairs are stacked in a storage room.',
    options: [
      { label: 'A', text: 'A group of colleagues is gathered around a conference table.', vietnamese: 'Một nhóm đồng nghiệp đang ngồi quây quần quanh bàn họp.' },
      { label: 'B', text: 'A presenter is pointing at a projection screen.', vietnamese: 'Người thuyết trình đang chỉ vào màn hình máy chiếu.' },
      { label: 'C', text: 'Handouts are being distributed to meeting attendees.', vietnamese: 'Tài liệu phát tay đang được phát cho người dự họp.' },
      { label: 'D', text: 'Office chairs are stacked in a storage room.', vietnamese: 'Ghế văn phòng đang được xếp chồng trong kho.' }
    ],
    correctAnswer: 'B',
    explanation: 'Người thuyết trình đang đứng cạnh màn hình chiếu và chỉ tay vào biểu đồ (pointing at a projection screen).',
    topic: 'Họp hành / Thuyết trình'
  },
  {
    id: 'L-P1-20',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_20.jpg',
    audioScript: '(A) A delivery person is handing a parcel to a resident. (B) Cardboard boxes are loaded onto a hand truck. (C) A warehouse door has been pulled shut. (D) Packages are scattered on an office floor.',
    options: [
      { label: 'A', text: 'A delivery person is handing a parcel to a resident.', vietnamese: 'Người giao hàng đang đưa bưu kiện cho cư dân.' },
      { label: 'B', text: 'Cardboard boxes are loaded onto a hand truck.', vietnamese: 'Các thùng các-tông được chất lên xe đẩy hàng bằng tay.' },
      { label: 'C', text: 'A warehouse door has been pulled shut.', vietnamese: 'Cửa nhà kho đã được kéo đóng lại.' },
      { label: 'D', text: 'Packages are scattered on an office floor.', vietnamese: 'Các gói bưu kiện vương vãi trên sàn văn phòng.' }
    ],
    correctAnswer: 'D',
    explanation: 'Trong văn phòng, nhiều kiện hàng và phong bì bưu điện trải đều trên sàn nhà chuẩn bị phân loại.',
    topic: 'Văn phòng / Bưu phẩm'
  },
  {
    id: 'L-P1-21',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_21.jpg',
    audioScript: '(A) Bicycles are parked in an outdoor rack. (B) Pedestrians are jogging on a park footpath. (C) Boats are cruising down a scenic canal. (D) Park benches are lined along a tree-lined walkway.',
    options: [
      { label: 'A', text: 'Bicycles are parked in an outdoor rack.', vietnamese: 'Xe đạp đang đỗ trong giá để xe ngoài trời.' },
      { label: 'B', text: 'Pedestrians are jogging on a park footpath.', vietnamese: 'Người đi bộ đang chạy bộ trên đường dạo công viên.' },
      { label: 'C', text: 'Boats are cruising down a scenic canal.', vietnamese: 'Thuyền bè đang dạo trên kênh nước danh lam.' },
      { label: 'D', text: 'Park benches are lined along a tree-lined walkway.', vietnamese: 'Ghế đá công viên xếp dọc con đường rợp bóng cây.' }
    ],
    correctAnswer: 'B',
    explanation: 'Những người chạy bộ thể dục buổi sáng trên lối đi trong công viên (pedestrians are jogging on a footpath).',
    topic: 'Công viên / Thể thao'
  },
  {
    id: 'L-P1-22',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_22.jpg',
    audioScript: '(A) A cashier is scanning groceries at a register. (B) Fresh produce is neatly displayed in wooden crates. (C) Customers are waiting in line at a deli counter. (D) Empty shopping carts are stored outside an entrance.',
    options: [
      { label: 'A', text: 'A cashier is scanning groceries at a register.', vietnamese: 'Thu ngân đang quét mã vạch hàng hóa tại quầy tính tiền.' },
      { label: 'B', text: 'Fresh produce is neatly displayed in wooden crates.', vietnamese: 'Rau củ quả tươi được trưng bày ngăn nắp trong thùng gỗ.' },
      { label: 'C', text: 'Customers are waiting in line at a deli counter.', vietnamese: 'Khách hàng đang xếp hàng chờ ở quầy thực phẩm.' },
      { label: 'D', text: 'Empty shopping carts are stored outside an entrance.', vietnamese: 'Xe đẩy hàng trống được cất bên ngoài lối vào.' }
    ],
    correctAnswer: 'B',
    explanation: 'Các thùng gỗ đựng rau củ tươi được bài trí đẹp mắt ở khu chợ nông sản (fresh produce is neatly displayed in wooden crates).',
    topic: 'Chợ / Thực phẩm'
  },
  {
    id: 'L-P1-23',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_23.jpg',
    audioScript: '(A) A woman is typing on a keyboard while wearing headphones. (B) A technician is replacing a desktop computer component. (C) Documents are being scanned through a copying machine. (D) Office workers are having lunch together.',
    options: [
      { label: 'A', text: 'A woman is typing on a keyboard while wearing headphones.', vietnamese: 'Một phụ nữ đang gõ bàn phím trong khi đeo tai nghe.' },
      { label: 'B', text: 'A technician is replacing a desktop computer component.', vietnamese: 'Kỹ thuật viên đang thay thế linh kiện máy tính bàn.' },
      { label: 'C', text: 'Documents are being scanned through a copying machine.', vietnamese: 'Tài liệu đang được quét qua máy sao chép.' },
      { label: 'D', text: 'Office workers are having lunch together.', vietnamese: 'Nhân viên văn phòng đang ăn trưa cùng nhau.' }
    ],
    correctAnswer: 'B',
    explanation: 'Kỹ thuật viên công nghệ đang thao tác tháo lắp, kiểm tra phần cứng của máy tính để bàn (replacing a desktop computer component).',
    topic: 'Kỹ thuật / Công nghệ'
  },
  {
    id: 'L-P1-24',
    part: 1,
    direction: 'Part 1: Photographs. Listen to four statements about the photograph and select the statement that best describes what you see.',
    questionText: 'Look at the photograph and choose the best statement describing the image.',
    imageUrl: '/images/part1/p1_24.jpg',
    audioScript: '(A) Airplanes are parked at boarding gates. (B) Travelers are carrying their luggage across a terminal. (C) An airport announcement board displays departure times. (D) Ground crew members are loading cargo into an aircraft.',
    options: [
      { label: 'A', text: 'Airplanes are parked at boarding gates.', vietnamese: 'Máy bay đang đậu tại các cửa lên máy bay.' },
      { label: 'B', text: 'Travelers are carrying their luggage across a terminal.', vietnamese: 'Hành khách đang kéo vali hành lý qua sảnh nhà ga.' },
      { label: 'C', text: 'An airport announcement board displays departure times.', vietnamese: 'Bảng thông báo sân bay hiển thị giờ khởi hành các chuyến bay.' },
      { label: 'D', text: 'Ground crew members are loading cargo into an aircraft.', vietnamese: 'Nhân viên mặt đất đang bốc dỡ hàng hóa vào khoang máy bay.' }
    ],
    correctAnswer: 'D',
    explanation: 'Đội ngũ phục vụ mặt đất đang vận chuyển kiện hàng vào hầm hàng máy bay trên đường băng (loading cargo into an aircraft).',
    topic: 'Hàng không / Vận chuyển'
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
