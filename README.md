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

### Tạo tài khoản email và đồng bộ tiến trình

Người học có thể đăng nhập bằng tài khoản Google hoặc email và mật khẩu qua Firebase Authentication. Tiến trình từ vựng và ngữ pháp được đồng bộ vào Cloud Firestore theo tài khoản.

1. Tạo dự án tại [Firebase Console](https://console.firebase.google.com/), rồi thêm ứng dụng Web (biểu tượng `</>`).
2. Trong **Project settings → General → Your apps**, sao chép cấu hình Web App vào `.env` theo các tên biến trong `.env.example`.
3. Vào **Authentication → Sign-in method**, bật **Email/Password** và **Google**. Khi bật Google, chọn email hỗ trợ rồi lưu.
4. Vào **Firestore Database → Create database** để tạo cơ sở dữ liệu.
5. Trong tab **Firestore Database → Rules**, dán nội dung file `firestore.rules` rồi bấm **Publish**. Quy tắc chỉ cho phép người dùng đọc/ghi tiến trình theo UID của chính tài khoản đó.
6. Khi chạy local, khởi động lại bằng `npm run dev`. Trên Vercel, thêm cùng các biến `VITE_FIREBASE_*` ở **Project → Settings → Environment Variables**, rồi deploy lại. Nếu domain production chưa được Firebase chấp nhận, thêm domain đó trong **Authentication → Settings → Authorized domains**.

#### Đăng nhập Google bằng chuyển hướng trên Vercel

Nút Google dùng chuyển hướng toàn trang, không mở popup. Để Firebase hoàn tất chuyển hướng trên domain Vercel:

1. Trong **Firebase → Authentication → Settings → Authorized domains**, thêm `ing-lich-tet.vercel.app`.
2. Trong **Vercel → Project → Settings → Environment Variables**, đặt `VITE_FIREBASE_AUTH_DOMAIN` thành `ing-lich-tet.vercel.app` cho Production.
3. Trong **Google Cloud Console → APIs & Services → Credentials**, mở OAuth Web client đang dùng cho Firebase Google sign-in và thêm URI này vào **Authorized redirect URIs**: `https://ing-lich-tet.vercel.app/__/auth/handler`.
4. Deploy lại. `vercel.json` đã chuyển tiếp đường dẫn `/__/auth/*` tới Firebase để luồng chuyển hướng hoạt động cùng domain.

Với domain production khác, thay `ing-lich-tet.vercel.app` bằng domain đó ở cả ba nơi.

Người chưa đăng nhập vẫn lưu tiến trình trên thiết bị. Khi đăng ký hoặc đăng nhập lần đầu, tiến trình cục bộ được gộp vào tài khoản Firebase để dùng trên thiết bị khác. Mật khẩu do Firebase Authentication quản lý; ứng dụng cũng hỗ trợ gửi email đặt lại mật khẩu.

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
