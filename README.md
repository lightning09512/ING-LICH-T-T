<div align="center">

# 🤪 ING LỊCH TÉT
### Web App Luyện Thi TOEIC Gamification Meme Troll Bạn Gái

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Neobrutalism-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://g-lich-tet.vercel.app)

**Website trải nghiệm trực tiếp**: [👉 g-lich-tet.vercel.app](https://g-lich-tet.vercel.app)

<br/>

> *"Học TOEIC không quạu — biến nỗi sợ tiếng Anh của Nóc Nhà thành tiếng cười và chuỗi ngày leo rank bất tận."*

</div>

---

## 💡 Giới Thiệu

**Ing Lịch Tét** (Việt hóa hài hước của *English Test*) là ứng dụng web luyện thi TOEIC được thiết kế theo phong cách đồ họa **Neobrutalism** cổ điển kết hợp yếu tố **Gamification**. 

Dự án ra đời nhằm mục đích giúp bạn gái ("Mập địch") có thêm động lực học từ vựng và ngữ pháp mỗi ngày mà không bị nhàm chán như khi cày giáo trình truyền thống.

---

## ✨ Tính Năng Nổi Bật

### 1. 🗺️ Vượt Màn Từ Vựng 26 Ngày (Angry Birds Style)
- **Hệ thống 26 bài học** tích hợp hơn **1.400+ từ vựng** chọn lọc từ bộ Quizlet TOEIC trọng điểm.
- **Flashcard tương tác**: Mặt trước hiển thị từ, phiên âm IPA, câu ví dụ thực tế và nút phát âm; mặt sau là nghĩa tiếng Việt kèm ảnh minh họa.
- **Cơ chế khóa màn & Lặp lại ngắt quãng (Spaced Repetition)**: Đạt từ 80% điểm bài test mới mở khóa ngày tiếp theo. Bài kiểm tra tự động dồn từ vựng của các ngày trước đó để chống quên.

### 2. 📚 Ngữ Pháp Trực Quan & Ngân Hàng Đề Part 5 Random
- **Trọn bộ 12 thì tiếng Anh**: Trình bày dạng khối màu sắc trực quan (khẳng định, phủ định, nghi vấn, dấu hiệu nhận biết, mẹo bẫy ETS).
- **Quy tắc trật tự từ loại**: Sơ đồ vị trí danh từ, tính từ, trạng từ, động từ nối (Linking Verbs) và cấu trúc đặc biệt.
- **10 Chuyên đề trọng điểm**: Bị động, quan hệ, điều kiện, đảo ngữ, To-V/V-ing, liên từ...
- **Test ngẫu nhiên 10 câu**: Hệ thống tự động bốc ngẫu nhiên 10 câu từ ngân hàng hơn 200+ câu trắc nghiệm chuẩn format Part 5, giải thích chi tiết từng đáp án.

### 3. ⚡ Thách Đấu Sinh Tồn 15s (Troll Mode)
- Đếm ngược 15 giây mỗi câu hỏi, cấp sẵn 3 Mạng Tim (HP).
- Trả lời đúng nhận pháo hoa confetti; trả lời sai hoặc hết giờ bị trừ máu kèm meme Trollface dằn mặt trừ ly trà sữa.

### 4. 📝 Luyện Đề TOEIC Chuẩn Format
- Bộ đề thi đầy đủ cả 2 phần **Listening (Part 1 - 4)** và **Reading (Part 5 - 7)**.
- Trình phát âm thanh có tùy chỉnh tốc độ đọc (0.8x, 1.0x, 1.2x).
- Bảng ma trận câu hỏi (Question Palette), gắn cờ phân vân, đồng hồ đếm ngược và chấm điểm thang 990.

### 5. 📻 Góc Nhạc Lofi Chill Boombox
- Tích hợp 7 playlist Lofi / Chillhop thời lượng 1 - 2 tiếng (Lofi Girl, Coffee Shop Rain, Ghibli Lofi, Jazz Piano...).
- **Chạy ngầm xuyên suốt**: Đóng bảng nhạc vẫn nghe qua nút nổi góc màn hình. Hỗ trợ chạy ngầm cả khi tắt/khóa màn hình điện thoại.

---

## 🛠️ Tech Stack

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS (Neobrutalism design system: viền đen đậm, shadow cứng) |
| **Typography**| Nunito (Body & Thẻ từ) + Baloo 2 (Tiêu đề game) — Chuẩn 100% tiếng Việt |
| **Game Engine**| HTML5 Canvas Particle Engine (Mặt Trollface bay lơ lửng & né chuột) |
| **Audio** | Web Audio API (Synthesizer âm thanh 8-bit retro) + Edge Neural TTS |
| **Hiệu ứng** | canvas-confetti, Lucide React Icons |
| **Deploy** | Vercel (Auto-deploy on Git Push) |

---

## 🚀 Cài Đặt & Chạy Local

Yêu cầu máy đã cài đặt **Node.js** (phiên bản 18+).

```bash
# 1. Clone repository
git clone https://github.com/lightning09512/ING-LICH-T-T.git
cd ING-LICH-T-T

# 2. Cài đặt dependencies
npm install

# 3. Khởi động môi trường phát triển (Frontend & Backend)
npm run dev
```

Mở trình duyệt truy cập:
- **Client (Frontend)**: `http://localhost:5173`
- **Server API**: `http://localhost:5000`

```bash
# Build production
npm run build
```

---

## 📂 Cấu Trúc Dự Án

```
├── api/                # Vercel Serverless Functions (TTS API endpoint)
├── public/             # Assets tĩnh (Trollface, hình ảnh từ vựng)
├── src/
│   ├── components/     # UI screens (Flashcards, Grammar, Survival, Exam, Lofi)
│   ├── data/           # Dữ liệu từ vựng 26 ngày, ngữ pháp, đề thi TOEIC
│   ├── utils/          # Bộ tạo âm thanh 8-bit retro, Web Audio synthesizer
│   ├── App.tsx         # Root Router & Navigation
│   └── main.tsx        # Entry point
├── tailwind.config.js  # Cấu hình màu sắc, shadow và font Neobrutalism
└── vercel.json         # Routing & Cấu hình deployment Vercel
```

---

<div align="center">

Dành trọn tình cảm & sự kiên nhẫn cho **Nóc Nhà** đỗ TOEIC 800+ 💖

</div>
