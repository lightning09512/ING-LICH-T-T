# 🎮 ING LỊCH TÉT (TOEIC Troll Game Cho Nóc Nhà)

> Ứng dụng luyện thi TOEIC phong cách Game Retro & Neobrutalism meme hài hước, bựa nhưng cực kỳ tâm lý dành riêng cho bạn gái.

---

## 🛠️ Công Nghệ Sử Dụng
- **Ngôn ngữ**: TypeScript 100% (Strict mode)
- **Frontend**: React (Vite) + Tailwind CSS Neobrutalism + Lucide Icons
- **Backend**: Node.js + Express.js + tsx
- **Cơ sở dữ liệu**: NoSQL Document Database (JSON file persistence, tự động seed data)
- **Hiệu ứng & Âm thanh**:
  - Background Canvas với các mặt Trollface bay lơ lửng và tương tác chuột
  - Web Audio API Synthesizer (Âm thanh 8-bit retro không phụ thuộc file mp3 ngoài)
  - Web Speech API (Phát âm giọng bản xứ Mỹ chuẩn chỉnh cho từ vựng và câu nghe)
  - `canvas-confetti` (Pháo hoa ăn mừng)

---

## 🚀 Hướng Dẫn Khởi Chạy

### Đăng nhập Google và đồng bộ tiến trình

Tính năng đăng nhập dùng Firebase Authentication; tiến trình từ vựng và ngữ pháp được đồng bộ vào Cloud Firestore theo tài khoản Google.

1. Tạo một dự án Firebase, thêm ứng dụng Web, bật **Authentication → Google** và tạo cơ sở dữ liệu **Cloud Firestore**.
2. Sao chép `.env.example` thành `.env`, rồi điền các giá trị cấu hình Web App Firebase (`VITE_FIREBASE_*`).
3. Trong Firebase Authentication, thêm domain chạy ứng dụng vào **Authorized domains**.
4. Đưa nội dung `firestore.rules` lên mục **Firestore Database → Rules** rồi publish.
5. Khởi động lại ứng dụng bằng `npm run dev`. Trên Vercel, khai báo cùng các biến `VITE_FIREBASE_*` trong Environment Variables và deploy lại.

Người chưa đăng nhập vẫn lưu tiến trình trên thiết bị. Khi đăng nhập lần đầu trên thiết bị đó, tiến trình cũ sẽ được gộp vào tài khoản Google; sau đó tiến trình được lưu theo tài khoản để dùng trên thiết bị khác.

### Cách 1: Chạy cả Frontend & Backend đồng thời (Khuyên dùng)
```bash
npm run dev
```
- **Client (Frontend)**: `http://localhost:5173`
- **Server (Backend API)**: `http://localhost:5000`

### Cách 2: Chạy riêng lẻ
- Chạy Frontend: `npm run client:dev`
- Chạy Backend NoSQL: `npm run server:dev`

---

## 📸 Các Tính Năng Đã Hoàn Thiện

1. **Title Screen (Màn hình mở đầu - Theo phác thảo hình 1)**:
   - Hộp viền đen `ING LỊCH TÉT`
   - Chữ phụ đề viết tay `Mập địch`
   - Nút `Bắt đầu` có hiệu ứng âm thanh 8-bit và chuyển cảnh mượt mà
   - Các mặt Trollface bay bay nảy nảy ở background

2. **Menu Chọn Chế Độ (Theo phác thảo hình 2)**:
   - **Học bài**: Flashcard từ vựng TOEIC, lật mặt thẻ xem nghĩa và câu ví dụ troll, nút phát âm tiếng Anh native.
   - **Ôn tập**: Thử thách sinh tồn 15 giây/câu, thanh máu 3 tim, meme dằn mặt khi trả lời sai, hiệu ứng pháo hoa khi sống sót.
   - **Luyện đề (Chuẩn Study4)**:
     - Đầy đủ 7 Part của TOEIC (Nghe Part 1-4 & Đọc Part 5-7)
     - Audio Player có chỉnh tốc độ (0.8x, 1.0x, 1.2x)
     - Question Palette ma trận câu hỏi (Trạng thái Chưa làm, Đã chọn, Gắn cờ, Đang xem)
     - Đồng hồ đếm ngược
     - Chấm điểm chuẩn thang 990 TOEIC (Listening + Reading)
     - Xếp hạng troll bạn gái & xem lại Transcript + Giải thích chi tiết.
