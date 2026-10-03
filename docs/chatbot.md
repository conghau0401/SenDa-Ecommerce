# Chatbot "Bé Sen": dữ liệu hỗ trợ & cách mở rộng

Tài liệu này thống kê **những gì chatbot trả lời được**, **dữ liệu lấy từ đâu** và **cách bổ sung thêm**. Hãy cập nhật file này mỗi khi thêm chủ đề mới.

> Cập nhật lần cuối: 03/10/2026 · Bộ kiểm thử: `npm run chatbot:test` (46/46 ca đạt)

---

## 1. Tổng quan

| Hạng mục | Số lượng | Sửa ở đâu |
|---|---|---|
| Chủ đề tra **dữ liệu thật** (phí ship, đơn hàng, sản phẩm…) | 12 | Dữ liệu gốc trong admin (Cài đặt, Sản phẩm, Đơn hàng) |
| Câu hỏi – đáp tĩnh (FAQ) | 25 (6 nhóm) | **Admin → Chatbot → Kiến thức** |
| Đặc điểm để tư vấn chọn cây | 11 | `src/lib/chatbot/knowledge.ts` → `TRAITS` |
| Chủ đề giao tiếp (chào, cảm ơn, tạm biệt) | 3 | `src/lib/chatbot/knowledge.ts` → `INTENT_PHRASES` |
| Ca kiểm thử tự động | 46 | `scripts/test-chatbot.mts` |

### Cách chatbot trả lời một câu hỏi

```
Khách gõ câu hỏi
  │
  ├─ 1. Đang chờ SĐT gọi lại? ───────────────► lưu thành Liên hệ trong admin
  ├─ 2. Khách nói "không nhớ mã đơn"? ─────────► hướng dẫn tìm mã / gọi hotline
  ├─ 3. Có mã đơn (SD……-XXXX) hoặc đang chờ SĐT tra đơn? ─► tra cứu đơn hàng
  └─ 4. Chấm điểm theo từ khóa:
        ├─ Nhắc đúng tên sản phẩm ───────────► giá + tồn kho + thẻ sản phẩm
        ├─ FAQ khớp mạnh nhất ───────────────► câu trả lời FAQ (admin soạn)
        ├─ Chủ đề có sẵn khớp mạnh nhất ─────► tra dữ liệu thật (cài đặt, sản phẩm…)
        ├─ Có đặc điểm/ngân sách ────────────► tư vấn chọn cây / quà tặng
        └─ Không khớp gì ────────────────────► "Bé Sen chưa hiểu" + gợi ý (đánh dấu để admin xem)
  │
  └─ (Tùy chọn) Bật AI: Claude diễn đạt lại câu trả lời cho tự nhiên, CHỈ dựa trên dữ liệu đã tra
```

- **Không phân biệt có dấu / không dấu:** "phí ship" và "phi ship" đều hiểu như nhau.
- Những từ dễ nhầm khi bỏ dấu thì so khớp **có dấu**, ví dụ "dưới" ≠ "Đuôi" (Sen đá Đuôi Lừa), "bị" ≠ "Bi" (Chuỗi Ngọc Bi), "đỏ" ≠ "đồ".

---

## 2. Chủ đề tra dữ liệu thật (tự cập nhật theo admin)

Các chủ đề này **không cần soạn câu trả lời**: sửa dữ liệu gốc là chatbot trả lời theo dữ liệu mới.

| # | Chủ đề | Ví dụ câu khách hỏi | Dữ liệu lấy từ | Sửa ở đâu |
|---|---|---|---|---|
| 1 | Phí vận chuyển | "phí ship bao nhiêu", "có freeship không" | Phí ship cố định + ngưỡng miễn phí | Cài đặt → Giao hàng |
| 2 | Giờ làm việc | "mở cửa mấy giờ", "chủ nhật có làm không" | Giờ mở cửa | Cài đặt → Cửa hàng |
| 3 | Địa chỉ cửa hàng | "shop ở đâu", "ghé shop xem cây" | Địa chỉ + link trang Liên hệ (bản đồ) | Cài đặt → Cửa hàng |
| 4 | Thanh toán | "thanh toán thế nào", "có COD không", "STK" | COD + ngân hàng, STK, chủ TK | Cài đặt → Chuyển khoản |
| 5 | Liên hệ / gặp nhân viên | "gặp nhân viên", "hotline", "zalo" | Hotline, Zalo, Facebook, Email. Khách có thể **để lại SĐT** → tạo mục trong **Admin → Liên hệ** | Cài đặt → Cửa hàng, Mạng xã hội |
| 6 | Tình trạng đơn hàng | "kiểm tra đơn", "đơn của tôi giao chưa" | Đơn hàng: trạng thái, số SP, tổng tiền, thanh toán | Admin → Đơn hàng |
| 7 | Tư vấn chọn cây | "cây dễ chăm dưới 100k", "cây để văn phòng" | Sản phẩm đang bán: danh mục, giá, tồn kho (xem mục 4) | Admin → Sản phẩm |
| 8 | Quà tặng | "quà sinh nhật bạn gái", "quà dưới 300k" | Sản phẩm (ưu tiên terrarium, chậu tượng, cây màu hồng) + thông tin gói quà miễn phí | Admin → Sản phẩm |
| 9 | Giá / tồn kho sản phẩm cụ thể | "sen đá Lola giá bao nhiêu", "chuỗi ngọc bi còn không" | Tên, giá bán, giá gốc, tồn kho | Admin → Sản phẩm |
| 10 | Khuyến mãi | "có khuyến mãi gì không", "đang sale" | Sản phẩm có giá khuyến mãi + ngưỡng miễn phí ship | Admin → Sản phẩm, Cài đặt |
| 11 | Danh mục | "shop bán những gì", "có những loại nào" | Danh mục đang hiển thị | Admin → Danh mục |
| 12 | Cách đặt hàng | "đặt hàng thế nào", "mua ở đâu" | Câu trả lời cố định (quy trình 3 bước, không cần tài khoản) | `engine.ts` |

Ngoài ra bot hiểu **chào hỏi / cảm ơn / tạm biệt**.

### Tra cứu đơn hàng: an toàn thông tin

- Bot chỉ trả thông tin khi khách cung cấp **đủ mã đơn + SĐT đặt hàng**, giống trang Tra cứu đơn.
- Khách có thể gửi mã đơn và SĐT trong 2 tin nhắn riêng, bot tự ghép lại.
- Mã đơn chấp nhận nhiều cách gõ: `SD261003-7K2F`, `sd2610037k2f`.
- Chống dò mã đơn: tối đa **8 lần tra cứu / 15 phút / IP**.
- Bot không bao giờ hiển thị địa chỉ hay tên khách, chỉ hiện trạng thái, số sản phẩm, tổng tiền và hình thức thanh toán.

---

## 3. Bộ câu hỏi – đáp (FAQ): 25 câu

Admin sửa, thêm, tắt tại **Admin → Chatbot → Kiến thức**. Dữ liệu ban đầu nằm ở `prisma/seed-data/chat-faqs.ts`.

**Vận chuyển** (4)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 1 | Bao lâu thì nhận được hàng? | bao lau nhan, may ngay, mat may ngay, thoi gian giao |
| 2 | Shop có giao toàn quốc không? | giao toan quoc, ship toan quoc, co ship tinh |
| 3 | Có giao hỏa tốc trong ngày không? | hoa toc, giao gap, giao ngay, trong ngay |
| 4 | Cây được đóng gói thế nào? | dong goi, goi hang, co bi gay, co bi dap |

**Bảo hành & đổi trả** (1)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 5 | Chính sách bảo hành, đổi trả như thế nào? | bao hanh, doi tra, doi cay, tra hang, cay bi dap |

**Đơn hàng** (3)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 6 | Tôi muốn hủy hoặc sửa đơn hàng | huy don, sua don, doi dia chi, thay doi don |
| 7 | Có cần tạo tài khoản để mua không? | tao tai khoan, dang ky, dang nhap |
| 8 | Shop có xuất hóa đơn VAT không? | hoa don, vat, xuat hoa don |

**Quà tặng** (3)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 9 | Shop có gói quà và viết thiệp không? | goi qua, viet thiep, thiep, giay goi |
| 10 | Mua số lượng nhiều / quà tặng sự kiện có giá sỉ không? | so luong lon, gia si, mua si, qua cuoi, qua cong ty |
| 11 | Có làm tiểu cảnh theo yêu cầu không? | theo yeu cau, thiet ke rieng, custom, khac ten |

**Sản phẩm** (3)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 12 | Cây giao có giống ảnh không? Kích thước bao nhiêu? | giong anh, anh that, kich thuoc, cao bao nhieu |
| 13 | Shop có bán hạt giống sen đá không? | hat giong, ban hat, gieo hat |
| 14 | Cây có kèm chậu không? | kem chau, co chau khong, chau nhua |

**Chăm sóc** (11)

| # | Câu hỏi mẫu | Một số từ khóa nhận diện |
|---|---|---|
| 15 | Cách chăm sóc sen đá cơ bản | cach cham soc, cham soc sen da, nuoi sen da |
| 16 | Bao lâu tưới sen đá một lần? | tuoi nuoc, tuoi bao lau, tuoi may lan |
| 17 | Sen đá cần bao nhiêu nắng? | anh sang, can nang, phoi nang, vuon dai |
| 18 | Sen đá bị úng, thối gốc phải làm sao? | ung nuoc, bi ung, thoi goc, thoi re |
| 19 | Sen đá bị rụng lá, héo lá | rung la, heo la, la kho, nhan la |
| 20 | Làm sao để sen đá lên màu đẹp? | len mau, giu mau, mat mau |
| 21 | Nhân giống sen đá như thế nào? | nhan giong, giam la, giam canh |
| 22 | Nên dùng đất gì để trồng sen đá? | dat gi, loai dat, tron dat, thay chau |
| 23 | Sen đá bị rệp, sâu bệnh | rep, rep sap, sau, bi nam |
| 24 | Chăm sóc terrarium như thế nào? | cham terrarium, cham tieu canh |
| 25 | Để sen đá trong phòng máy lạnh được không? | may lanh, dieu hoa, phong lanh |

Nhiều câu trả lời chăm sóc có **liên kết tới bài viết** trong mục Tin tức. Nếu đổi slug bài viết, nhớ sửa lại link trong FAQ.

---

## 4. Tư vấn chọn cây & quà tặng

Bot đọc **đặc điểm** và **ngân sách** trong câu, rồi chấm điểm từng sản phẩm **còn hàng**:

- +2 nếu sản phẩm thuộc danh mục phù hợp;
- +1,5 nếu tên sản phẩm chứa từ gợi ý;
- +0,5 nếu là sản phẩm nổi bật.

Bot gợi ý tối đa 4 sản phẩm. Khách bấm **+** trên thẻ sản phẩm là thêm vào giỏ ngay trong khung chat.

| Đặc điểm | Khách nói (ví dụ) | Danh mục ưu tiên | Từ gợi ý trong tên SP |
|---|---|---|---|
| Dễ chăm, hợp người mới | dễ chăm, người mới, lười, bận rộn, hay quên tưới | Sen đá mini, Kim cương, Xương rồng | nâu, ngọc bích, móng rồng, trứng chim, phật bà |
| Chịu bóng, trong nhà/văn phòng | chịu bóng, ít nắng, văn phòng, bàn làm việc, máy lạnh | Sen đá kim cương | móng rồng, kim cương |
| Dáng rủ, chậu treo | treo, dáng rủ, ban công treo, chuỗi ngọc | Sen đá chuỗi ngọc | |
| Màu sắc nổi bật | màu đỏ, hồng, tím, rực rỡ, lên màu | Sen đá viền đỏ | lola, hồng phấn, ruby, romeo |
| Xương rồng / ra hoa | xương rồng, ra hoa, nở hoa | Xương rồng | |
| Tiểu cảnh terrarium | tiểu cảnh, terrarium, bình thủy tinh | Tiểu cảnh terrarium | |
| Nhỏ xinh để bàn | mini, nhỏ xinh, để bàn, bàn học | Sen đá mini | |
| Chậu & phụ kiện | chậu sứ, chậu đất nung, kệ gỗ, phụ kiện | Chậu & phụ kiện | |
| Đất & phân bón | đất trồng, phân bón, giá thể, perlite | Đất & phân bón | |
| Làm quà tặng | quà, quà tặng, sinh nhật, khai trương, tân gia | Terrarium, Chậu & phụ kiện | terrarium, tượng, chuông, lola, hồng phấn |
| Giống hiếm, sưu tầm | hiếm, độc lạ, sưu tầm, cao cấp | | truncata, romeo |

**Ngân sách bot hiểu được:**

| Khách gõ | Bot hiểu |
|---|---|
| dưới 100k, tối đa 100 nghìn, không quá 100.000đ | ≤ 100.000đ |
| trên 200k, từ 200k | ≥ 200.000đ |
| khoảng 300k, tầm 300 nghìn | 180.000đ – 375.000đ (±) |
| từ 50k đến 150k | 50.000đ – 150.000đ |
| 1tr, 1 triệu, 1 củ | khoảng 1 triệu (600.000đ – 1.250.000đ) |
| SĐT, số lượng ("mua 2 chậu") | không bị hiểu nhầm là ngân sách |
| rẻ, giá rẻ, sinh viên, tiết kiệm | ≤ 60.000đ |

Nếu không có sản phẩm nào trong ngân sách, bot gợi ý mẫu gần nhất và nói rõ điều đó. Nếu khách chỉ nêu ngân sách mà không nêu đặc điểm, bot chỉ gợi ý cây (không gợi ý chậu, đất).

---

## 5. Dữ liệu lưu trong admin

| Dữ liệu | Bảng | Xem ở |
|---|---|---|
| Mọi hội thoại & tin nhắn (khách + bot), trang khách mở chat, ý định nhận diện, nguồn trả lời (Luật / Kiến thức / AI), câu bot chưa hiểu | `ChatConversation`, `ChatMessage` | Admin → Chatbot → Hội thoại & thống kê |
| Bộ kiến thức FAQ + **lượt dùng** từng câu | `ChatFaq` | Admin → Chatbot → Kiến thức |
| SĐT khách để lại nhờ gọi lại | `Contact` | Admin → Liên hệ |

**Thống kê trên trang admin:** số hội thoại 7 ngày, số tin nhắn của khách, **tỉ lệ bot hiểu câu hỏi**, các chủ đề khách hỏi nhiều nhất, danh sách câu bot chưa hiểu (có nút **"Thêm kiến thức"** điền sẵn câu hỏi).

- Hội thoại có câu bot chưa hiểu được gắn nhãn **"Cần xem"** và đếm trên badge **Chatbot** ở sidebar. Admin mở xem thì nhãn tự bỏ.
- Phiên chat được nhận diện bằng một mã ngẫu nhiên lưu ở trình duyệt khách (localStorage). Tải lại trang vẫn giữ lịch sử; nút ⟲ trong khung chat bắt đầu cuộc trò chuyện mới.
- Giới hạn chống spam: **20 tin/phút/IP**, tối đa 500 ký tự mỗi tin.

---

## 6. Chế độ AI (tùy chọn)

Mặc định chatbot **không dùng AI**: miễn phí, chạy offline, câu trả lời có thể kiểm soát hoàn toàn. Bật AI để câu trả lời tự nhiên hơn và hiểu được các câu diễn đạt lạ:

```env
CHATBOT_AI="on"
CHATBOT_AI_MODEL="claude-opus-5-5"
ANTHROPIC_API_KEY="sk-ant-..."   # hoặc đăng nhập bằng `ant auth login`
```

Khởi động lại server sau khi đổi `.env`. Trang Admin → Chatbot sẽ hiện nhãn "Đang bật AI (Claude)".

**Cách AI hoạt động:**
- Bộ luật vẫn chạy trước để tra dữ liệu thật (đơn hàng đã xác minh, sản phẩm gợi ý, FAQ khớp).
- Claude nhận thông tin cửa hàng, danh mục, danh sách sản phẩm (tên, giá, tồn kho), toàn bộ FAQ, 10 tin nhắn gần nhất và kết quả tra cứu, rồi viết lại câu trả lời bằng giọng "Bé Sen".
- Claude được dặn **chỉ dùng dữ liệu được cung cấp**: không bịa giá, chính sách hay trạng thái đơn.
- Thẻ sản phẩm và nút trả lời nhanh vẫn do bộ luật tạo, nên luôn đúng dữ liệu.
- Phần thông tin cửa hàng được **cache** giữa các lượt để giảm chi phí; mức suy luận `low` cho phản hồi nhanh.
- Bật sẵn **fallback phía server** (`fallbacks: "default"`): nếu model chính từ chối trả lời vì bộ lọc an toàn, Anthropic tự chạy lại trên model dự phòng.
- Lỗi mạng, hết hạn mức, thiếu khóa API hoặc bị từ chối: bot **tự quay về câu trả lời của bộ luật**, khách không thấy lỗi.
- **Dữ liệu gửi cho Anthropic:** nội dung chat của khách và dữ liệu công khai của shop. Thông tin đơn hàng chỉ được gửi khi khách đã xác minh đủ mã đơn + SĐT, và chỉ gồm trạng thái, số sản phẩm, tổng tiền.

---

## 7. Chưa hỗ trợ (gợi ý phát triển tiếp)

| Chưa hỗ trợ | Hiện tại bot làm gì | Gợi ý |
|---|---|---|
| Đặt hàng trực tiếp trong chat | Hướng dẫn cách đặt + thẻ sản phẩm có nút thêm giỏ | Thêm luồng hỏi họ tên/SĐT/địa chỉ rồi gọi `placeOrder` |
| Nhân viên chat trực tiếp (live chat) | Cho khách để lại SĐT → tạo Liên hệ | Thêm trạng thái "chờ nhân viên" + màn hình trả lời trong admin |
| Gửi ảnh cây bị bệnh để chẩn đoán | Khuyên gửi ảnh qua Zalo | Bật AI + cho phép tải ảnh (Claude hiểu được hình ảnh) |
| Mã giảm giá / voucher | Báo sản phẩm đang giảm giá + freeship | Thêm bảng Voucher và chủ đề tra cứu |
| Phí ship theo tỉnh/thành | Phí cố định + ngưỡng miễn phí | Mở rộng Cài đặt giao hàng theo vùng |
| Tiếng Anh | Chỉ tiếng Việt | Bật AI (Claude hiểu đa ngôn ngữ) hoặc thêm từ khóa tiếng Anh |

---

## 8. Cách mở rộng

### A. Thêm câu hỏi – đáp (không cần lập trình)

1. Vào **Admin → Chatbot → Hội thoại & thống kê**, xem danh sách **"Câu hỏi bot chưa hiểu"**.
2. Bấm **"Thêm kiến thức"**: form mở sẵn với câu hỏi của khách.
3. Soạn **từ khóa** và **câu trả lời**, xem trước, rồi lưu.
4. Dùng khung **"Thử chatbot"** bên phải để kiểm tra ngay.

**Mẹo viết từ khóa:**
- Gõ **không dấu** (`mat may ngay`) để khớp cả khi khách gõ có hay không dấu. Chỉ gõ có dấu khi bỏ dấu sẽ gây nhầm (`đỏ`, `quà`).
- Ưu tiên **cụm 2–4 từ** đặc trưng (`ship mat bao lau`) hơn từ đơn (`ship`). Cụm dài được cộng nhiều điểm hơn.
- Tránh từ khóa quá chung (`cay`, `shop`, `gia`) vì dễ "giành" câu hỏi của chủ đề khác.
- FAQ được ưu tiên hơn chủ đề có sẵn khi điểm bằng hoặc cao hơn. Nếu một FAQ trả lời nhầm câu khác, hãy bớt từ khóa chung của FAQ đó.
- Định dạng câu trả lời: `**đậm**`, `[chữ](/duong-dan)`, xuống dòng, dòng bắt đầu `- ` thành gạch đầu dòng.

### B. Thêm đặc điểm tư vấn / chủ đề mới (lập trình viên)

| Muốn | Sửa |
|---|---|
| Thêm cách nói cho chủ đề có sẵn (VD: thêm "freeship" cho phí ship) | `INTENT_PHRASES` trong `src/lib/chatbot/knowledge.ts` |
| Thêm đặc điểm tư vấn (VD: "hợp phong thủy") | `TRAITS` trong `knowledge.ts`: cụm từ + danh mục + từ gợi ý tên SP |
| Thêm chủ đề tra dữ liệu mới (VD: voucher) | Thêm `IntentId` + nhãn trong `knowledge.ts`, viết xử lý trong `switch` của `src/lib/chatbot/engine.ts` |
| Sửa nút trả lời nhanh | `QUICK_REPLIES` trong `knowledge.ts` |
| Đổi giọng văn / quy tắc của AI | `buildSystemPrompt()` trong `src/lib/chatbot/ai.ts` |
| Đổi FAQ mặc định khi seed | `prisma/seed-data/chat-faqs.ts` |

Sau khi sửa, **thêm ca kiểm thử** vào `scripts/test-chatbot.mts` rồi chạy:

```bash
npm run chatbot:test
```

### C. Sơ đồ file

| File | Vai trò |
|---|---|
| `src/lib/chatbot/knowledge.ts` | Dữ liệu nhận diện: chủ đề, cụm từ, đặc điểm tư vấn, nút trả lời nhanh |
| `src/lib/chatbot/text.ts` | Xử lý tiếng Việt: bỏ dấu, khớp cụm từ, tách ngân sách / SĐT / mã đơn |
| `src/lib/chatbot/engine.ts` | Bộ não: chấm điểm, tra dữ liệu, tạo câu trả lời |
| `src/lib/chatbot/ai.ts` | Chế độ AI tùy chọn (Claude) |
| `src/actions/chat.ts` | API cho widget: gửi tin, lấy lịch sử, lưu DB, giới hạn spam |
| `src/components/chat/*` | Giao diện widget: nút chat, khung chat, linh vật, hiển thị định dạng |
| `src/app/admin/(panel)/chatbot/*` | Trang admin: thống kê, hội thoại, kiến thức |
| `prisma/seed-data/chat-faqs.ts` | 25 câu FAQ ban đầu |
| `scripts/test-chatbot.mts` | 46 ca kiểm thử tự động |
