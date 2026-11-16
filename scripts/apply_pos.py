import json, re

with open('src/data/quizletVocabDays.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scripts/datamuse_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

def determine_pos(word, meaning, tags):
    w = word.strip().lower()
    m = meaning.strip().lower()
    m_clean = re.sub(r'\(.*?\)', '', m).strip()

    # 1. Multi-word phrases
    if ' ' in w:
        if any(w.startswith(p) for p in ['take ', 'get ', 'put ', 'look ', 'make ', 'set ', 'run ', 'go ', 'keep ', 'bring ', 'come ', 'deal ', 'fill ', 'carry ', 'give ', 'hold ', 'hand ']):
            return 'Cụm ĐT (phr v)'
        if any(w.startswith(p) for p in ['in ', 'on ', 'at ', 'by ', 'for ', 'with ', 'due to', 'prior to', 'because of', 'according to', 'instead of', 'in front of', 'next to', 'as well as', 'in order to']):
            return 'Cụm từ (phr)'
        if any(m_clean.startswith(v) for v in ['chợp mắt', 'tham gia', 'liên hệ', 'thực hiện', 'chuẩn bị', 'tập trung vào']):
            return 'Cụm ĐT (phr v)'
        return 'Cụm từ (phr)'

    # Explicit indicators in meaning
    if '(v)' in m or 'động từ' in m:
        return 'Động từ (v)'
    if '(n)' in m or 'danh từ' in m:
        return 'Danh từ (n)'
    if '(adj)' in m or 'tính từ' in m:
        return 'Tính từ (adj)'
    if '(adv)' in m or 'trạng từ' in m:
        return 'Trạng từ (adv)'

    # 2. English Suffix Rules
    if w.endswith('tion') or w.endswith('sion') or w.endswith('ment') or w.endswith('ance') or w.endswith('ence') or w.endswith('ity') or w.endswith('ness') or w.endswith('ship'):
        return 'Danh từ (n)'
    if w.endswith('ly') and not any(w.endswith(x) for x in ['friendly', 'costly', 'orderly', 'timely', 'daily', 'weekly', 'monthly']):
        return 'Trạng từ (adv)'
    if w.endswith('able') or w.endswith('ible') or w.endswith('less') or w.endswith('ful') or w.endswith('ous') or w.endswith('ive') or w.endswith('ic'):
        return 'Tính từ (adj)'
    if w.endswith('ize') or w.endswith('ise') or w.endswith('ify'):
        return 'Động từ (v)'

    # 3. Explicit Vietnamese Indicators
    noun_starts = [
        'sự ', 'cuộc ', 'người ', 'chiếc ', 'cái ', 'nhà ', 'việc ', 'con ', 'đồ ', 'máy ', 
        'thiết bị ', 'phòng ', 'vỉa hè', 'cây', 'lá', 'ghế', 'thủy thủ', 'cặp', 'va li', 'xe', 
        'phương tiện', 'nợ', 'thành tựu', 'động lực', 'kỳ vọng', 'giai đoạn', 'trình độ', 
        'tài liệu', 'hợp đồng', 'trụ sở', 'nhãn hiệu', 'ngói', 'gạch', 'tách', 'chén', 'cốc',
        'chuyến', 'buổi', 'bản', 'mẫu', 'vé', 'tiền', 'khoản', 'phí', 'giá', 'bộ', 'loại',
        'hóa đơn', 'thư', 'báo cáo', 'khách', 'nhân viên', 'bảng', 'đường', 'phố', 'sân bay',
        'ga', 'tàu', 'thuyền', 'mũ', 'áo', 'quần', 'giày', 'túi', 'hộp', 'bút', 'sách', 'ảnh',
        'chiến thắng', 'tiền đạo', 'sức mạnh', 'quân đội', 'điểm yếu', 'thành phần', 'phong cảnh'
    ]
    if any(m_clean.startswith(s) for s in noun_starts):
        return 'Danh từ (n)'

    verb_starts = [
        'đạt được', 'thu được', 'bắt', 'thành lập', 'thúc đẩy', 'mong đợi', 'ra mắt', 
        'khởi động', 'đàm phán', 'gánh chịu', 'chịu đựng', 'nhâm nhi', 'mang', 'định hướng', 
        'tổ chức', 'quản lý', 'cung cấp', 'yêu cầu', 'liên hệ', 'thực hiện', 'chuẩn bị', 'chuẩn bi',
        'gửi', 'nhận', 'ký', 'giảm', 'tăng', 'kiểm tra', 'xác nhận', 'tham gia', 'thông báo', 
        'hủy', 'thay đổi', 'bảo đảm', 'chèo thuyền', 'quan sát', 'mặc', 'đeo', 'sửa chữa',
        'mua', 'bán', 'thuê', 'trả', 'nộp', 'đi', 'đến', 'chạy', 'làm việc', 'nói', 'viết',
        'đọc', 'ký kết', 'đăng ký', 'đặt', 'gặp', 'giúp', 'tìm', 'tìm kiếm', 'phát triển',
        'nghỉ hưu', 'giữ lại', 'phát sóng', 'chấp nhận', 'từ chối', 'hoàn thành', 'tiết kiệm'
    ]
    if any(m_clean.startswith(s) for s in verb_starts):
        return 'Động từ (v)'

    adj_starts = [
        'thuộc về', 'có tính', 'đủ ', 'không ', 'dễ ', 'khó ', 'đáng ', 'tương tự', 'chính', 
        'phụ', 'ban đầu', 'trước đó', 'trước đây', 'tiềm năng', 'sẵn có', 'bận rộn', 'rõ ràng', 
        'chắc chắn', 'hiệu quả', 'rộng', 'hẹp', 'cao', 'thấp', 'nhanh', 'chậm', 'mới', 'cũ',
        'tuyệt vời', 'quan trọng', 'cần thiết', 'thích hợp', 'phù hợp', 'tiện lợi', 'nguy hiểm',
        'cổ xưa', 'rộng rãi', 'yếu', 'khỏe', 'tốt', 'xấu', 'đắt', 'rẻ', 'an toàn'
    ]
    if any(m_clean.startswith(s) for s in adj_starts):
        return 'Tính từ (adj)'

    adv_starts = [
        'một cách', 'rất', 'hoàn toàn', 'lúc đầu', 'gần đây', 'chủ yếu', 'thường xuyên', 'tuyệt đối', 'ngay lập tức'
    ]
    if any(m_clean.startswith(s) for s in adv_starts):
        return 'Trạng từ (adv)'

    # 4. Use Datamuse primary tag
    if tags:
        primary = tags[0]
        if primary == 'n': return 'Danh từ (n)'
        if primary == 'v': return 'Động từ (v)'
        if primary == 'adj': return 'Tính từ (adj)'
        if primary == 'adv': return 'Trạng từ (adv)'

    # Fallback
    return 'Danh từ (n)'

# Apply to all words
stats = {}
for day_k, day_v in data.items():
    for word_obj in day_v['words']:
        w = word_obj['word'].strip().lower()
        tags = cache.get(w, [])
        pos = determine_pos(word_obj['word'], word_obj['meaning'], tags)
        word_obj['partOfSpeech'] = pos
        stats[pos] = stats.get(pos, 0) + 1

print("Part of speech distribution:")
for k, v in sorted(stats.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v}")

# Save updated files
with open('src/data/quizletVocabDays.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('public/data/quizletVocabDays.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('server/data/quizletVocabDays.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('dist/data/quizletVocabDays.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\nSuccessfully updated quizletVocabDays.json across all targets!")
