# Thiết kế nâng cấp toàn diện Giọng đọc Zero-Delay & Giao diện Hình vẽ Cute (Giảm AI Slop)

**Ngày:** 2026-11-18  
**Dự án:** Ing Lịch Tét (`d:\hoc\GITHUB\Ing Lịch Tét`)  
**Phương án người dùng đã chọn:** Hướng 3 (Kết hợp bộ Doodle/Sticker SVG nét vẽ tay trực tiếp + bộ tranh Mascot/Chibi minh họa vẽ tay ở các điểm nhấn chính)

---

## 1. Mục tiêu & Lý do (Intent & Why)

1. **Giọng đọc tiếng Anh tức thì (0ms cảm nhận), đồng nhất 100% toàn web:**
   - Hiện tại phần Từ vựng (`VocabGameMap`, `LearnVocabScreen`) đã dùng giọng nữ Microsoft Jenny Neural (`en-US-JennyNeural`), nhưng các khu vực khác (`ToeicSpeakingExamScreen`, `ToeicSpeakingRevisionScreen`) vẫn gọi thẳng `window.speechSynthesis` (giọng máy mặc định, khô cứng và dễ kẹt hàng đợi trên Chromium).
   - Các đoạn văn dài ở `RankedExamScreen` và phần Speaking chưa được tải trước (prefetch), giới hạn ký tự prefetch đang dừng ở `500` ký tự, bộ đệm mới chỉ nằm trên RAM (tải lại trang là mất), và endpoint `/api/tts` đang gom hết toàn bộ file MP3 mới trả về thay vì stream ngay chunk đầu tiên.
2. **Loại bỏ cảm giác "AI Slop", giữ trọn nét dễ thương cá nhân hóa bằng hình vẽ tay:**
   - Web là món quà cá nhân hóa dễ thương ("giải cứu bạn gái khỏi nỗi sợ TOEIC", ảnh đại diện thật `/app-icon.png` đội mũ bucket xanh lá phải giữ nguyên tuyệt đối).
   - Tuy nhiên nhiều màn hình đang mang dấu hiệu điển hình của giao diện AI sinh hàng loạt ("AI slop"): mưa emoji hệ điều hành (`🚀`, `🔥`, `🎯`, `✨`, `📋`, `💡`, `🎙️`, `✍️`), icon `<Sparkles />` lặp lại dày đặc, quá nhiều nhãn góc nghiêng nhấp nháy `animate-pulse` chồng chéo trên cùng 1 thẻ (ví dụ `GrammarScreen` có tới 3–4 badge đỏ/vàng/lửa trên một thẻ), và khẩu hiệu IN HOA kiểu quảng cáo.
   - Thay thế bằng nét vẽ sổ tay/truyện tranh đáng yêu (hand-drawn ink & pastel): **SVG Doodle vẽ tay** cho icon/sticker nhỏ + **Tranh minh họa nhân vật/mascot chibi vẽ tay** cho Trang chủ, Menu, Modal Chuỗi học tập và Modal Trái tim.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals (Cần đạt)
- **Mọi nơi phát tiếng Anh trên web** đều đi qua một engine duy nhất `sounds.speakEnglish()` (giọng nữ tự nhiên `en-US-JennyNeural`, từ đơn `0.96x`, câu/đoạn văn `0.86x`–`0.90x`), hỗ trợ đoạn văn lên đến `1200` ký tự (tự chia câu mượt nếu dài hơn).
- **Zero-delay thực tế:**
  - Server `/api/tts` (`api/tts.ts` & `server/src/services/tts.ts`) trả ngay từ bộ nhớ đệm nếu có; nếu chưa có thì **stream từng chunk MP3 ngay khi EdgeTTS sinh ra** (byte đầu tiên về trình duyệt sau ~150–250ms thay vì chờ ghép xong cả đoạn) đồng thời lưu lại vào cache.
  - Client `soundEffects.ts` lưu đệm 2 tầng: **RAM `blobUrlCache`** (0ms trong phiên) + **Persistent Browser `CacheStorage` (`ing-lich-tet-tts-v2`)** (lưu bền vững trên máy người dùng qua các lần F5/mở lại web).
  - Hàng đợi tải trước thông minh (Background Prefetch Queue giới hạn concurrency = 2 để không nghẽn mạng) tải sẵn các từ/câu trong bài học, kịch bản câu hiện tại + câu kế tiếp ở `RankedExamScreen`, `ToeicSpeakingExamScreen`, `ToeicSpeakingRevisionScreen`, cộng thêm kích hoạt `prefetchEnglish` ngay khi `onPointerEnter` / `onTouchStart` vào nút nghe.
  - Khi bấm nút đọc trong lúc bản tải trước còn đang chạy (`inFlight`), không chặn user gesture gây lỗi Autoplay trên Safari/iOS mà phát trực tiếp luồng stream đồng bộ trong click stack.
- **Hệ thống Hình vẽ Doodle & Mascot (Hướng 3):**
  - Tạo thư viện SVG vẽ tay `src/components/DoodleIcons.tsx` (nét bút mực đen tự nhiên `strokeLinecap="round"`, màu tô lệch nhẹ kiểu sổ tay pastel): Ngôi sao vẽ tay, Ngọn lửa nhỏ dễ thương, Trái tim phác tay, Ly trà sữa trân châu, Sổ tay từ vựng, Bút chì/Bút lông, Micro thu âm, Loa phát thanh, Cúp nhỏ, Mũi tên xoắn vẽ tay, Ghim giấy/Băng dính washi tape.
  - Tạo 4 hình minh họa Chibi/Doodle vẽ tay (nền trong suốt hoặc viền sticker trắng trên nền kem `#FFFDF5`, nét mực đen màu nước pastel ấm áp, không bóng bẩy 3D AI) lưu tại `public/doodles/`:
    1. `public/doodles/study-mascot.png`: Mèo mập / gấu nhỏ đội mũ xanh ôm sách TOEIC & ly trà sữa trân châu (dùng trang trí góc `TitleScreen` / `MenuScreen` — **không thay thế** ảnh thật `/app-icon.png`).
    2. `public/doodles/streak-campfire.png`: Đốm lửa trại / bé lửa nhỏ dễ thương đang đọc sách (cho `StreakModal`).
    3. `public/doodles/boba-hearts.png`: Ly trà sữa trân châu đường đen kèm trái tim phác tay (cho `HeartsModal` & hộp nhắc nhở).
    4. `public/doodles/trophy-cat.png`: Cúp vàng vẽ tay dễ thương kèm sao nhỏ (cho khu vực Đấu Xếp Hạng / Hoàn thành bài).
  - Dọn dẹp triệt để "AI Slop" trên các màn hình chính (`TitleScreen`, `MenuScreen`, `Navbar`, `StreakModal`, `HeartsModal`, `VocabGameMap`, `GrammarScreen`, `TestSelectScreen`, `ToeicSwSelectScreen`, `ToeicSpeaking*`, `ToeicWriting*`):
    - Xóa các emoji hệ điều hành lạc quẻ (`🚀`, `🔥`, `✨`, `🎯`, `📋`, `💡`, `💀`, `😂`, `🌐`...) và thay bằng `DoodleIcons` hoặc bỏ hẳn ở những chỗ dư thừa.
    - Giảm mật độ badge: mỗi thẻ tối đa 1 nhãn điểm nhấn kiểu **băng dính giấy (washi tape) / nhãn dán sổ tay** không nhấp nháy `animate-pulse` loạn xạ, bỏ các gradient chói kiểu banner quảng cáo, đổi câu chữ gồng cứng sang giọng tự nhiên, gần gũi.

### Non-Goals (Không làm)
- Không thay đổi cấu trúc dữ liệu từ vựng JSON gốc (`quizletVocabDays*.json`, `study4_test_*.json`) hay logic tính điểm/đồng bộ Firebase.
- Không đụng tới ảnh đại diện cá nhân `/app-icon.png` hay giao diện Hextech riêng của modal tìm trận LoL (`LolMatchFoundModal.tsx`).
- Không thay thế file MP3 gốc của đề thi TOEIC 200 câu (`ToeicExamScreen` vốn phát file audio đề thi thật của ETS/Study4).

### Anti-Goals (Tránh tuyệt đối)
- **Không tạo ra "AI Slop loại mới"**: Tranh minh họa không được mang phong cách 3D bóng loáng, neon cyberpunk, hay chi tiết rối rắm giả tạo; phải là nét vẽ phác tay 2D mực đen + màu pastel phẳng ấm áp như sổ tay học bài.
- Không đổi giọng đọc sang giọng nam hoặc giọng đọc nhanh gấp gáp.

---

## 3. Các phương án đã cân nhắc (Approaches)

1. **Hướng 1 — Chỉ dùng SVG Doodle nội tuyến:** Nhẹ tuyệt đối, thay sạch emoji nhưng thiếu các hình minh họa nhân vật lớn tạo cảm xúc ở Trang chủ và các Modal.
2. **Hướng 2 — Chỉ dùng ảnh minh họa PNG/WebP:** Đẹp ở banner lớn nhưng không thể thay thế gọn nhẹ hàng chục icon nhỏ trong thẻ bài học, nút bấm, nhãn dán.
3. **Hướng 3 (Đã chọn) — Kết hợp SVG Doodle vẽ tay + 4 Sticker Mascot vẽ tay:** Vừa thay sạch emoji/icon AI slop ở cấp độ vi mô bằng SVG 0ms, vừa có điểm nhấn cảm xúc ấm áp ở Trang chủ, Modal Chuỗi ngày và Modal Tim.

---

## 4. Thiết kế kỹ thuật chi tiết

### Phần A: Kiến trúc Giọng đọc Zero-Delay (`api/tts.ts`, `server/src/services/tts.ts`, `src/utils/soundEffects.ts`)

1. **Streaming & Giới hạn độ dài trên Backend (`api/tts.ts` & `server/src/services/tts.ts`):**
   - Tăng giới hạn văn bản từ `800` lên `1500` ký tự (đủ cho mọi đoạn văn Part 1 Read Aloud, Model Answer của Speaking và kịch bản Listening của Ranked).
   - Trong `api/tts.ts`:
     - Nếu `audioCache.has(cacheKey)`: trả về ngay lập tức `Buffer` kèm header `Cache-Control: public, max-age=31536000, immutable`.
     - Nếu chưa có trong cache: thiết lập ngay header `Content-Type: audio/mpeg` và **stream trực tiếp từng `chunk`** (`res.write(chunk)` trên Node handler / `ReadableStream` trên Fetch handler) ngay khi `tts.streamAudio(text)` nhả dữ liệu, đồng thời gom `chunks` lưu vào `audioCache` khi kết thúc luồng. Nhờ đó thời gian chờ âm thanh đầu tiên (TTFB audio) giảm một nửa đối với câu dài.

2. **Engine Âm thanh 2 tầng Cache & Prefetch Hàng đợi (`src/utils/soundEffects.ts`):**
   - **Tầng 1 (RAM):** `blobUrlCache: Map<string, string>` (tối đa 250 mục) — phát tức thì `0ms`.
   - **Tầng 2 (Persistent Disk Cache):** Sử dụng `window.caches.open('ing-lich-tet-tts-v2')`. Khi `prefetchEnglish` hoặc `speakEnglish` tải audio về, lưu `Response` vào `CacheStorage`. Lần sau người dùng mở lại web, `getCachedBlobUrl(cacheKey)` đọc thẳng từ đĩa lên Blob URL trong ~2–5ms mà không tốn request mạng nào.
   - **Hàng đợi Prefetch nền (`enqueuePrefetch(texts: string[])`):** Xử lý tối đa `2` request đồng thời, ưu tiên từ/câu hiện tại trước rồi đến các câu kế tiếp, hỗ trợ độ dài tới `1500` ký tự.
   - **Chia câu thông minh cho đoạn văn rất dài (> 450 ký tự):** Khi đọc một bài mẫu Speaking dài nhiều câu, tách theo dấu kết câu (`. `, `? `, `! `), tải & phát nối tiếp câu 1 ngay lập tức trong khi câu 2, 3 đang được tải ngầm phía sau -> người dùng nghe thấy tiếng đọc ngay tức khắc như câu ngắn!
   - **Sửa lỗi `inFlight` chặn Autoplay:** Khi người dùng bấm nút nghe đúng lúc câu đó đang `inFlight`, gọi `playAudioSource(directUrl, ...)` đồng bộ ngay trong click event stack (để giữ quyền Autoplay trên iOS/Safari/Mobile Chrome), đồng thời vẫn để tiến trình prefetch nền lưu vào cache cho lần bấm thứ 2.
   - **Thêm trạng thái lắng nghe / callback hoặc Promise chuẩn:** `sounds.speakEnglish(text, options?: { rate?: number })` trả về `Promise<void>` luôn `resolve()` chính xác khi đọc xong hoặc khi bấm `sounds.stopSpeaking()`, giúp nút bấm ở Speaking/Ranked hiển thị trạng thái "Đang đọc / Dừng" mượt mà.

3. **Đồng bộ toàn bộ các màn hình sang `sounds.speakEnglish`:**
   - `ToeicSpeakingExamScreen.tsx`: Thay `playNativeSpeech` / `stopNativeSpeech` (đang dùng `window.speechSynthesis`) sang `sounds.speakEnglish` / `sounds.stopSpeaking`. Tự động `enqueuePrefetch` cho `promptText`, `targetScript`, `modelAnswer` của câu hiện tại và câu kế tiếp.
   - `ToeicSpeakingRevisionScreen.tsx`: Thay `handleSpeakText` sang `sounds.speakEnglish` / `sounds.stopSpeaking` và prefetch các câu mẫu trong bài học đang mở.
   - `RankedExamScreen.tsx`: Tự động `enqueuePrefetch` kịch bản `audioScript` của câu hiện tại và 2 câu Listening tiếp theo ngay khi vào trận hoặc chuyển câu.
   - `VocabGameMap.tsx` & `LearnVocabScreen.tsx`: Nâng prefetch lên 5 thẻ kế tiếp bằng hàng đợi nền + thêm `onPointerEnter` prefetch cho các nút loa trong danh sách từ.

---

### Phần B: Thiết kế Hình vẽ Doodle & Khử "AI Slop" (Hướng 3)

1. **Bộ Component Hình vẽ tay `src/components/DoodleIcons.tsx`:**
   Thiết kế bộ icon SVG vẽ tay nét mực đen (`#18181B`, `strokeWidth="2.2"`, đường nét hơi cong tự nhiên kèm mảng màu pastel lệch nhẹ kiểu in risograph/sổ tay):
   - `DoodleStar` (ngôi sao 4–5 cánh phác tay thay cho `✨` và `<Sparkles />`)
   - `DoodleFire` (ngọn lửa nhỏ tròn trịa mắt cười thay cho `🔥`)
   - `DoodleHeart` & `DoodleBrokenHeart` (trái tim mũm mĩm vẽ tay thay cho `❤️`, `💖`, `💔`)
   - `DoodleBoba` (ly trà sữa trân châu vẽ tay thay cho `🧋`)
   - `DoodleBook` (quyển sổ mở có kẹp trang thay cho `📘`, `📚`, `📖`)
   - `DoodlePencil` (cây bút chì nhỏ kèm nét gạch nguệch ngoạc thay cho `✍️`, `📝`)
   - `DoodleMic` (micro retro vẽ tay thay cho `🎙️`)
   - `DoodleTarget` (bia hồng tâm vẽ tay thay cho `🎯`)
   - `DoodleTrophy` (chiếc cúp nhỏ vẽ tay thay cho `🏆`)
   - `DoodleBulb` (bóng đèn ý tưởng nét phác tay thay cho `💡`)
   - `DoodlePin` / `WashiTapeBadge` (miếng băng dính giấy dán góc thẻ thay cho các badge nghiêng chữ IN HOA nhấp nháy)
   - `DoodleUnderline` (nét gạch chân bút dạ màu vàng/hồng dưới tiêu đề)

2. **Bộ 4 Sticker Minh họa Chibi/Doodle (`public/doodles/*.png`):**
   Sử dụng `image-generator` tạo 4 minh họa đồng nhất phong cách **2D hand-drawn ink & soft watercolor/pastel sticker on solid `#FFFDF5` / white sticker border, cozy Japanese/Korean stationery doodle aesthetic, zero 3D gloss**:
   - `public/doodles/mascot-study.png`: Bé mèo trắng mũm mĩm đội nón bucket xanh lá nhạt đang nằm đọc sách TOEIC cạnh ly trà sữa (đặt làm sticker trang trí góc ở `TitleScreen` / `MenuScreen`, giữ nguyên ảnh thật `/app-icon.png` cạnh biệt danh).
   - `public/doodles/mascot-streak.png`: Bé lửa nhỏ ấm áp đeo kính tròn đọc từ vựng (dùng trong `StreakModal`).
   - `public/doodles/mascot-hearts.png`: Ly trà sữa trân châu mặt cười ôm trái tim hồng phấn (dùng trong `HeartsModal`).
   - `public/doodles/mascot-victory.png`: Bé mèo giơ cúp nhỏ ăn mừng với hoa giấy phác tay (dùng ở màn tổng kết / thẻ Đấu Xếp Hạng).

3. **Quy chuẩn tinh chỉnh UI "Bớt AI Slop" trên từng màn hình:**
   - **Nền chấm bi sổ tay dịu nhẹ (`src/index.css`)**: Thêm họa tiết chấm giấy sổ tay cực mờ (`radial-gradient` rất nhạt trên `#FFFDF5`) và giảm độ gắt của bóng/nhấp nháy; giữ `FloatingTrollfaces` nhưng giảm nhẹ `opacity` (`0.07 - 0.16`) để nền thanh thoát, không rối mắt.
   - **`TitleScreen.tsx`**: Bỏ cặp `✨` kẹp hai bên biệt danh (thay bằng nét gạch chân bút dạ `DoodleUnderline` + `DoodleStar` nhỏ xinh), thêm sticker `mascot-study.png` nho nhỏ bên góc hộp tiêu đề, thay `⚠️` / `🌐` bằng icon nét vẽ gọn gàng, đổi badge góc phải thành miếng băng dính giấy `WashiTape` màu hồng pastel dịu mắt.
   - **`MenuScreen.tsx`**:
     - Bỏ `animate-pulse` trên chữ `MỚI`, bỏ các emoji `🎮`, `📘`, `🚀`, `🔥`, `📋`, `🎙️`, `✍️` và thay bằng `DoodleIcons` đồng bộ.
     - Chuyển các nhãn góc chéo màu gắt (`bg-red-600`, `bg-gradient-to-r from-amber-500 to-orange-500`...) thành nhãn dán giấy màu kem/pastel viền mực đen thanh lịch (ví dụ `bg-amber-100 text-amber-950`, `bg-rose-100 text-rose-950`), không xoay lệch lộn xộn nhiều góc khác nhau.
   - **`StreakModal.tsx` & `HeartsModal.tsx`**: Đưa hình vẽ `mascot-streak.png` và `mascot-hearts.png` vào tiêu điểm, thay toàn bộ emoji `🔥`, `❄️`, `⏳`, `💖`, `🧋`, `💀`, `😂` bằng `DoodleFire`, `DoodleBoba`, `DoodleHeart` và câu chữ dễ thương tự nhiên.
   - **`GrammarScreen.tsx`, `VocabGameMap.tsx`, `TestSelectScreen.tsx`, `ToeicSwSelectScreen.tsx`, `ToeicSpeaking*`, `ToeicWriting*`**:
     - Gộp/bỏ các badge trùng lặp trên cùng 1 thẻ (mỗi thẻ chỉ giữ 1 nhãn thông tin gọn gàng).
     - Thay hàng loạt emoji đầu mục (`🎯`, `⚡`, `🔥`, `🚀`, `💡`, `📌`, `👉`) bằng `DoodleBulb`, `DoodlePin`, `DoodleStar` hoặc đầu mục số/chấm mực sạch sẽ.
     - Giảm lạm dụng `<Sparkles />` trên các nút thường.

---

## 5. Phần để dành cho người thực thi (Left to the Builder)
- Tinh chỉnh chính xác tọa độ đường cong Bézier của từng SVG trong `DoodleIcons.tsx` sao cho nét vẽ tự nhiên nhất.
- Chi tiết xử lý tách câu (> 450 ký tự) và quản lý dung lượng `CacheStorage` trong `soundEffects.ts`.
- Tối ưu kích thước hiển thị responsive của 4 sticker trên điện thoại nhỏ (`360px`) và máy tính bảng/desktop.
