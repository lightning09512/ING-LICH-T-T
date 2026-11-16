# PROMPT KỸ THUẬT: XÂY DỰNG WEB APP "ING LỊCH TÉT"
> **Mục tiêu**: Xây dựng nền tảng Web App luyện thi TOEIC gamification với phong cách troll meme hài hước dành riêng cho bạn gái.

---

## 1. TECH STACK BẮT BUỘC
- **Ngôn ngữ**: 100% TypeScript (Strict Type Checking cả Frontend & Backend).
- **Backend**: Node.js + Express.js REST API + tsx runtime.
- **Database (NoSQL)**: Document Database lưu trữ theo Collections (JSON file persistence, tự động seed data, API query `find`, `findOne`, `insertOne`, `updateOne`).
- **Frontend**: React (Vite) + Tailwind CSS Neobrutalism design system + Lucide React.
- **Game Engine & Sound**: 
  - Canvas Particle Engine cho các mặt Trollface bay lơ lửng và tương tác chuột.
  - Web Audio API Synthesizer (tạo âm thanh 8-bit retro không phụ thuộc file mp3).
  - Web Speech API (`SpeechSynthesis`) đọc phát âm tiếng Anh chuẩn giọng bản xứ.
  - `canvas-confetti` cho hiệu ứng ăn mừng khi đạt điểm cao.

---

## 2. GIAO DIỆN & STYLE HƯỚNG TỚI
- **Neobrutalism / Retro Comic**: 
  - Viền đen đậm `border-4 border-black`.
  - Đổ bóng khối cứng `shadow-[4px_4px_0px_#000]` và `shadow-[7px_7px_0px_#000]`.
  - Hiệu ứng phím lún cơ học: `active:translate-x-1 active:translate-y-1 active:shadow-none`.
  - Typography: Font kết hợp giữa Arcade Retro (`VT323`) và Comic vui nhộn (`Comic Neue`, `Fredoka`).
- **Hình động Trollface bay bay (Hero Animation)**:
  - 8-14 mặt Trollface trôi nổi ở background canvas toàn màn hình.
  - Bay lơ lửng, nảy bật cạnh màn hình, xoay nhẹ.
  - Khi rê chuột lại gần, mặt Trollface dạt ra hoặc rung lắc.

---

## 3. CÁC MÀN HÌNH CHÍNH (THEO PHÁC THẢO BẢN VẼ TAY)

### Màn hình 1: Title Screen (Bám sát sketch 1)
- Box viền đen to: **ING LỊCH TÉT** (Việt hóa troll của *English Test*).
- Subtitle viết tay: **"Mập địch"** (kèm hiệu ứng lắc lư và mặt troll nháy mắt).
- Nút bấm to đùng: **[ Bắt đầu ]** (ấn vào phát tiếng bíp retro + confetti + chuyển vào Menu).

### Màn hình 2: Game Mode Select (Bám sát sketch 2)
Menu gồm 3 nút dạng card RPG:
1. **[ 📖 Học bài ] (Level Map phong cách Angry Birds từ Bài 1 -> Bài 26)**:
   - **Bản đồ chọn màn (Stage Select Grid 1 - 26)**:
     - Bài 1 mở khóa sẵn. Các bài từ 2 đến 26 bị khóa (biểu tượng ổ khóa 🔒).
     - Mỗi màn hiển thị số sao đạt được (⭐⭐⭐) dựa trên điểm thi test.
     - Khi bấm vào màn bị khóa: hiệu ứng rung lắc (shake) + phát tiếng buzz và dằn mặt troll: *"Chưa mở khóa đâu Mập địch ơi!"*.
     - Người chơi có thể bấm vào các bài đã học để chơi lại bất cứ lúc nào.
   - **Chế độ Flashcard học từ vựng (Quizlet Style)**:
     - Nạp toàn bộ dữ liệu từ 26 file PDF trong `asset/từ vựng` (tổng cộng hơn 1.400 từ vựng).
     - Thẻ 2 mặt lật mở: Mặt trước từ tiếng Anh + Nút phát âm (Web Speech API). Mặt sau nghĩa tiếng Việt.
     - Hỗ trợ vuốt ngón tay (Touch swipe) trái/phải trên tablet.
     - Có nút xem nhanh danh sách toàn bộ từ vựng của bài đó.
   - **Cơ chế Kiểm Tra Dồn Lũy Tiến (Spaced Repetition Cumulative Quiz)**:
     - Để mở khóa bài tiếp theo, người học bắt buộc phải làm bài kiểm tra và đạt tối thiểu **80%**.
     - Số lượng câu hỏi tăng dần từ 10 câu (Bài 1) lên 25 câu (các bài sau).
     - **Thuật toán trộn từ dồn**: Bài kiểm tra của Bài `N` sẽ lấy ngẫu nhiên 50-60% từ của Bài `N` và 40-50% từ của toàn bộ các Bài từ `1` đến `N-1` (Ví dụ: Bài 15 sẽ dồn từ của toàn bộ từ Bài 1 đến Bài 15).
     - Đạt >= 80%: Nổ pháo hoa `confetti`, chuông thắng cuộc, tặng sao và mở khóa Bài `N + 1`.
     - Dưới 80%: Rung màn hình, tiếng fail, Trollface dằn mặt và bắt buộc ôn lại flashcard để thi lại.
2. **[ ⚡ Ôn tập ]**:
   - Chế độ sinh tồn 15 giây/câu, thanh máu 3 Trái Tim (HP).
   - Chọn đúng: Cộng điểm, streak tăng, pháo hoa.
   - Chọn sai hoặc hết giờ: Rung giật màn hình (screen shake), mất 1 tim, tiếng buzz thất bại kèm Trollface popup dằn mặt: *"Học hành thế đấy à?", "Trừ 1 ly trà sữa!"*.
   - Hết 3 tim -> Game Over.
3. **[ 📝 Luyện đề ]** (Mô phỏng Study4 chuyên nghiệp):
   - Đầy đủ 7 Part của bài thi TOEIC (Part 1 Ảnh, Part 2 Hỏi đáp, Part 3 Hội thoại, Part 4 Thông tin, Part 5 Điền câu, Part 6 Đoạn văn, Part 7 Đọc hiểu).
   - **Audio Player**: Nút phát/dừng, tua -5s, tua +5s, chỉnh tốc độ (0.8x, 1.0x, 1.2x).
   - **Question Palette (Ma trận câu hỏi)**: Lưới ô số 1 -> N hiển thị trạng thái (Chưa làm, Đã chọn, Đang gắn cờ phân vân, Đang xem).
   - Đồng hồ đếm ngược thời gian làm bài (có nút Pause).
   - Nộp bài -> Tính điểm quy đổi chuẩn TOEIC thang 990 (Listening max 495, Reading max 495).
   - Xếp hạng troll bạn gái (ví dụ: *Mập địch sơ sinh* vs *Chiến thần đỉnh nóc*).
   - Tra cứu Transcript và Giải thích chi tiết từng câu.
