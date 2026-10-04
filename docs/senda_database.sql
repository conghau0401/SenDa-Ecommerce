-- =============================================================
-- Sen Đá Xinh – Dữ liệu website (SQLite dump)
-- Đồ án môn học IE104.F31.CN1.CNTT – Trần Thị Thanh Hương – 25210281
-- Xuất từ prisma/dev.db lúc 04/10/2026 16:13
-- Khôi phục: sqlite3 prisma/dev.db < docs/senda_database.sql  (xóa dev.db cũ trước)
-- Số dòng mỗi bảng:
--   AdminUser: 1
--   Category: 8
--   ChatConversation: 13
--   ChatFaq: 26
--   ChatMessage: 68
--   Contact: 3
--   Order: 151
--   OrderItem: 278
--   Post: 7
--   Product: 32
--   ProductImage: 58
--   Setting: 5
--   _prisma_migrations: 4
-- =============================================================

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "AdminUser" VALUES(8,'25210281@ms.uit.edu.vn','Trần Thị Thanh Hương','$2b$10$1jcCuI76ZPQ9LgK2wPIjHejpOAWQH5RMkCTK8UABgY7fkyfqX5r0.',1791018442885);
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Category" VALUES(58,'Sen đá mini','sen-da-mini','Những chậu sen đá nhỏ xinh, dễ chăm, hợp bàn làm việc.','/uploads/seed/echeveria-1.webp',1,0,1791018442903,1791041136138);
INSERT INTO "Category" VALUES(59,'Sen đá kim cương','sen-da-kim-cuong','Haworthia với lá trong suốt lấp lánh như pha lê.','/uploads/seed/haworthia-3.webp',1,1,1791018442906,1791018442906);
INSERT INTO "Category" VALUES(60,'Sen đá chuỗi ngọc','sen-da-chuoi-ngoc','Dáng rủ mềm mại, đẹp khi trồng chậu treo.','/uploads/seed/string-1.webp',1,2,1791018442909,1791018442909);
INSERT INTO "Category" VALUES(61,'Sen đá viền đỏ','sen-da-vien-do','Lá viền đỏ rực khi được nắng, cực kỳ nổi bật.','/uploads/seed/redEdge-2.webp',1,3,1791018442911,1791018442911);
INSERT INTO "Category" VALUES(62,'Xương rồng','xuong-rong','Xương rồng cảnh nhỏ gọn, nhiều loại ra hoa đẹp.','/uploads/seed/cactus-7.webp',1,4,1791018442913,1791018442913);
INSERT INTO "Category" VALUES(63,'Tiểu cảnh terrarium','tieu-canh-terrarium','Hệ sinh thái thu nhỏ trong bình thủy tinh.','/uploads/seed/terrarium-1.webp',1,5,1791018442915,1791018442915);
INSERT INTO "Category" VALUES(64,'Chậu & phụ kiện','chau-phu-kien','Chậu sứ, chậu đất nung và phụ kiện trang trí.','/uploads/seed/pot-2.webp',1,6,1791018442917,1791018442917);
INSERT INTO "Category" VALUES(65,'Đất & phân bón','dat-phan-bon','Giá thể, đá trộn và phân bón chuyên cho cây mọng nước.','/uploads/seed/soil-1.webp',1,7,1791018442919,1791018442919);
CREATE TABLE "ChatConversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '{}',
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "unansweredCount" INTEGER NOT NULL DEFAULT 0,
    "isReviewed" BOOLEAN NOT NULL DEFAULT true,
    "pagePath" TEXT,
    "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "ChatConversation" VALUES(11,'8e41fef0-520e-4dc0-b12e-17d8a33d00b0','{}',4,0,1,'/',1791016342918,1791016342918);
INSERT INTO "ChatConversation" VALUES(12,'afdedd5f-9e02-42a1-a68b-4a3f0fcc44be','{}',2,0,1,'/',1791011242918,1791011242918);
INSERT INTO "ChatConversation" VALUES(13,'ab452f9d-b2bf-4bf1-becd-b647fbecf328','{}',2,1,1,'/',1791000442918,1791000442918);
INSERT INTO "ChatConversation" VALUES(14,'62539b35-3a76-4868-ba73-554155cd520b','{"lastIntent":"recommend"}',4,0,1,'/',1791019244882,1791019236655);
INSERT INTO "ChatConversation" VALUES(15,'f6097b91-a5a0-45c9-a294-d8d7c116443c','{"lastIntent":"hours"}',2,0,1,'/',1791021368906,1791021368854);
INSERT INTO "ChatConversation" VALUES(16,'c1f5a78d-b5fb-457c-ab7b-94a03b8a7072','{"lastIntent":"hours"}',2,0,1,'/',1791021386052,1791021386015);
INSERT INTO "ChatConversation" VALUES(17,'09589e03-34bb-4b3c-a219-5f827164e1b4','{"awaiting":"callback","lastIntent":"contact"}',4,0,1,'/tra-cuu-don-hang',1791024244783,1791024234687);
INSERT INTO "ChatConversation" VALUES(18,'1f803632-f095-4179-ae2f-83edd74c6855','{"lastIntent":"faq","awaiting":null}',12,0,1,'/tra-cuu-don-hang',1791024305743,1791024254044);
INSERT INTO "ChatConversation" VALUES(19,'e849680a-4f39-4865-b41e-86833f6f7b3b','{"awaiting":"callback","lastIntent":"contact"}',18,0,1,'/lien-he',1791041296544,1791041231573);
INSERT INTO "ChatConversation" VALUES(20,'dbd8201e-bab9-42bf-9cd5-cc78d69114b4','{"lastIntent":"hours"}',2,0,1,'/lien-he',1791041309933,1791041309919);
INSERT INTO "ChatConversation" VALUES(21,'d9f893b5-839c-4cc9-b62d-59124c45e478','{"lastIntent":"faq","awaiting":null}',4,1,0,'/lien-he',1791041453882,1791041374488);
INSERT INTO "ChatConversation" VALUES(22,'eedce533-5071-4f54-9e91-e3a60b6bf697','{"lastIntent":"contact","awaiting":"callback"}',10,0,1,'/san-pham',1791102247330,1791102230596);
INSERT INTO "ChatConversation" VALUES(23,'7bb2a1ff-891c-4a87-8d67-f36d42461100','{"awaiting":"order","lastIntent":"order_status"}',2,0,1,'/san-pham',1791102252836,1791102252815);
CREATE TABLE "ChatFaq" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'chung',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "ChatFaq" VALUES(50,'Bao lâu thì nhận được hàng?','bao lau nhan, bao lau thi nhan, may ngay, mat may ngay, mat bao lau, thoi gian giao, thoi gian van chuyen, bao gio nhan duoc, giao mat bao lau, ship mat bao lau, bao lau thi toi, khi nao nhan, giao trong bao lau','Thời gian giao hàng dự kiến:
- **Nội thành TP. Hồ Chí Minh:** trong 24 giờ
- **Các tỉnh/thành khác:** 2–4 ngày làm việc
- Vùng sâu, vùng xa có thể thêm 1–2 ngày
Shop sẽ gọi xác nhận trước khi gửi hàng nhé 🚚','Vận chuyển',1,0,2,1791018443151,1791102233841);
INSERT INTO "ChatFaq" VALUES(51,'Shop có giao toàn quốc không?','giao toan quoc, ship toan quoc, co ship tinh, ship tinh khong, giao tinh khong, ship ngoai tinh, giao ngoai tinh, co giao den, giao hang tan noi, giao o tinh','Có ạ! Shop **giao hàng toàn quốc** qua đơn vị vận chuyển uy tín. Cây được đóng hộp chống sốc, cố định gốc nên đi xa vẫn an toàn 🌿','Vận chuyển',1,1,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(52,'Có giao hỏa tốc trong ngày không?','hoa toc, giao gap, giao ngay, trong ngay, giao nhanh, can gap, grab, now','Với đơn **nội thành TP. Hồ Chí Minh**, shop hỗ trợ giao hỏa tốc trong ngày (phí theo app giao hàng). Bạn ghi chú "giao hỏa tốc" khi đặt hoặc nhắn shop để được sắp xếp nhé!','Vận chuyển',1,2,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(53,'Cây được đóng gói thế nào?','dong goi, goi hang, co bi gay, co bi dap, van chuyen co an toan, hop, chong soc','Mỗi chậu được **cố định gốc, bọc lá và đóng hộp carton chống sốc**. Tiểu cảnh terrarium được chèn xốp riêng từng bình. Nếu cây bị dập do vận chuyển, shop đổi mới miễn phí 💚','Vận chuyển',1,3,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(54,'Chính sách bảo hành, đổi trả như thế nào?','bao hanh, doi tra, doi cay, tra hang, hoan tien, cay chet, cay bi hu, cay bi dap, cay bi hong, nhan cay xau, loi','Shop **bảo hành cây 7 ngày** kể từ khi nhận hàng:
- Cây bị dập, gãy, thối do vận chuyển → đổi cây mới miễn phí
- Bạn chỉ cần chụp ảnh/quay video lúc mở hộp và nhắn shop kèm mã đơn
Ngoài ra shop luôn tư vấn chăm sóc trọn đời cho cây mua tại shop 🌱','Bảo hành & đổi trả',1,4,1,1791018443151,1791041231601);
INSERT INTO "ChatFaq" VALUES(55,'Tôi muốn hủy hoặc sửa đơn hàng','huy don, sua don, doi dia chi, thay doi don, doi so luong, them san pham vao don, dat nham','Đơn ở trạng thái **Mới** hoặc **Đã xác nhận** có thể hủy/sửa miễn phí. Bạn nhắn shop qua hotline/Zalo kèm **mã đơn** và nội dung cần sửa nhé. Đơn đã giao cho vận chuyển thì không hủy được ạ.','Đơn hàng',1,5,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(56,'Có cần tạo tài khoản để mua không?','tao tai khoan, dang ky, dang nhap, tai khoan, can dang ky','Không cần ạ! Bạn chỉ cần nhập **họ tên, số điện thoại và địa chỉ** khi thanh toán. Sau khi đặt, dùng SĐT + mã đơn để [tra cứu đơn hàng](/tra-cuu-don-hang) bất cứ lúc nào.','Đơn hàng',1,6,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(57,'Shop có xuất hóa đơn VAT không?','hoa don, vat, xuat hoa don, hoa don do, cong ty mua','Shop có hỗ trợ xuất hóa đơn VAT cho đơn của công ty. Bạn ghi thông tin xuất hóa đơn vào phần **Ghi chú** khi đặt hàng hoặc nhắn shop nhé.','Đơn hàng',1,7,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(58,'Shop có gói quà và viết thiệp không?','goi qua, viet thiep, thiep, giay goi, boc qua, hop qua, ruy bang, loi chuc','Có ạ 🎁 Shop **gói quà và viết thiệp miễn phí**. Bạn ghi lời chúc vào phần **Ghi chú** khi đặt hàng, shop sẽ trang trí xinh xắn trước khi gửi đi.','Quà tặng',1,8,1,1791018443151,1791024305730);
INSERT INTO "ChatFaq" VALUES(59,'Mua số lượng nhiều / quà tặng sự kiện có giá sỉ không?','so luong lon, so luong nhieu, gia si, mua si, mua nhieu, qua su kien, qua cuoi, qua cong ty, qua tang khach, 50 chau, 100 chau, qua hoi nghi, doanh nghiep','Shop nhận đơn **quà tặng sự kiện, đám cưới, doanh nghiệp** với giá ưu đãi theo số lượng (từ 20 phần). Bạn để lại số điện thoại hoặc [gửi liên hệ](/lien-he), shop sẽ báo giá và gửi mẫu trong 24h nhé!','Quà tặng',1,9,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(60,'Có làm tiểu cảnh theo yêu cầu không?','theo yeu cau, thiet ke rieng, lam rieng, custom, dat lam, khac ten, in ten','Có ạ! Shop nhận thiết kế **tiểu cảnh terrarium theo yêu cầu** (chọn cây, màu sỏi, tượng trang trí, khắc tên). Thời gian làm 2–3 ngày. Bạn mô tả ý tưởng hoặc gửi ảnh mẫu qua Zalo để shop tư vấn nhé 🪴','Quà tặng',1,10,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(61,'Cây giao có giống ảnh không? Kích thước bao nhiêu?','giong anh, giong hinh, anh that, kich thuoc, to khong, cao bao nhieu, size, cay lon khong, cay nho','Ảnh trên web là ảnh cây thật tại vườn. Sen đá thường **cao/rộng 5–8cm** (tùy giống). Màu sắc có thể đậm/nhạt hơn ảnh theo mùa và ánh nắng – đó là nét thú vị của sen đá 😊','Sản phẩm',1,11,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(62,'Shop có bán hạt giống sen đá không?','hat giong, ban hat, gieo hat, hat sen da, trong tu hat','Hiện shop **chưa bán hạt giống** ạ, vì sen đá trồng từ hạt rất lâu lớn và tỉ lệ nảy mầm thấp. Bạn có thể nhân giống bằng lá rất dễ – xem [hướng dẫn nhân giống](/tin-tuc/cach-nhan-giong-sen-da-bang-la-cuc-don-gian) nhé 🌱','Sản phẩm',1,12,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(63,'Cây có kèm chậu không?','kem chau, co chau khong, chau nhua, co san chau, trong san','Cây được giao kèm **chậu nhựa ươm** và đã trồng sẵn. Bạn có thể mua thêm [chậu sứ, chậu đất nung](/danh-muc/chau-phu-kien) để thay cho đẹp nhé.','Sản phẩm',1,13,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(64,'Cách chăm sóc sen đá cơ bản','cach cham soc, cham soc sen da, cham soc cay, cham soc xuong rong, nuoi sen da, trong sen da, cham cay, cham soc nhu the nao','5 nguyên tắc chăm sen đá 🌱
- **Ánh sáng:** 4–6 giờ nắng nhẹ mỗi ngày
- **Tưới nước:** khô mới tưới, tưới thì tưới đẫm (5–7 ngày/lần)
- **Đất:** thoát nước tốt, trộn perlite/đá bọt
- **Chậu:** bắt buộc có lỗ thoát nước
- **Thông gió:** đặt nơi thoáng, nhất là mùa mưa
Đọc đầy đủ: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)','Chăm sóc',1,14,2,1791018443151,1791041289491);
INSERT INTO "ChatFaq" VALUES(65,'Bao lâu tưới sen đá một lần?','tuoi nuoc, tuoi bao lau, bao lau tuoi, tuoi may lan, tuoi nhu the nao, luong nuoc, tuoi bao nhieu','Nguyên tắc vàng: **khô mới tưới, tưới thì tưới đẫm** 💧
- Mùa khô: 5–7 ngày/lần
- Mùa mưa: 10–14 ngày/lần
- Tưới vào gốc, tránh đọng nước ở tâm lá
Xem thêm: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)','Chăm sóc',1,15,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(66,'Sen đá cần bao nhiêu nắng?','anh sang, can nang, phoi nang, bao nhieu nang, de o dau, dat o dau, de trong nha duoc khong, thieu nang, vuon dai, bi dai ra','Sen đá cần **4–6 giờ nắng nhẹ/ngày** (nắng sáng là tốt nhất). Cây bị **vươn dài, lá thưa, nhạt màu** là dấu hiệu thiếu sáng.
Để trong phòng/văn phòng, bạn nên chọn giống chịu bóng như [Sen đá Kim Cương, Móng Rồng](/danh-muc/sen-da-kim-cuong) và cho cây "tắm nắng" 1–2 ngày mỗi tuần.','Chăm sóc',1,16,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(67,'Sen đá bị úng, thối gốc phải làm sao?','ung nuoc, bi ung, thoi goc, thoi re, mem nhun, la vang trong, bi thoi, cuu cay, den goc','Cách cứu cây bị úng:
- Nhấc cây khỏi chậu, rũ sạch đất cũ
- Cắt bỏ phần rễ/thân bị thối đến khi thấy mô xanh
- Để vết cắt khô 3–5 ngày nơi thoáng mát
- Trồng lại vào đất khô thoát nước tốt, 5–7 ngày sau mới tưới
Chi tiết: [Vì sao sen đá bị úng nước và cách cứu cây](/tin-tuc/vi-sao-sen-da-bi-ung-nuoc-va-cach-cuu-cay)','Chăm sóc',1,17,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(68,'Sen đá bị rụng lá, héo lá','rung la, heo la, la heo, la kho, nhan la, la teo, la rung','- **Lá dưới cùng khô dần**: hiện tượng tự nhiên, chỉ cần nhặt bỏ
- **Lá nhăn, teo**: cây thiếu nước → tưới đẫm một lần
- **Lá mềm, vàng trong, rụng khi chạm**: dấu hiệu úng → giảm tưới, kiểm tra gốc
Nếu cây mới mua bị rụng lá nhiều, nhắn shop kèm ảnh để được hỗ trợ nhé!','Chăm sóc',1,18,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(69,'Làm sao để sen đá lên màu đẹp?','len mau, giu mau, mat mau, bi xanh, khong do, mau dep, ruc ro hon','3 bí quyết giúp sen đá lên màu: **nắng nhiều hơn** (tăng dần để tránh cháy lá), **chênh lệch nhiệt độ ngày – đêm**, và **tưới ít, hạn chế phân đạm**.
Đọc thêm: [Bí quyết giúp sen đá lên màu rực rỡ](/tin-tuc/bi-quyet-giup-sen-da-len-mau-ruc-ro)','Chăm sóc',1,19,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(70,'Nhân giống sen đá như thế nào?','nhan giong, giam la, giam canh, trong tu la, tach cay, cay con','Nhân giống bằng lá rất dễ:
- Vặn nhẹ lá khỏe, lấy trọn cuống
- Để khô 2–3 ngày
- Đặt nằm trên mặt đất khô, phun sương khi ra rễ
Sau 1–2 tháng là có cây con 🌱 Chi tiết: [Cách nhân giống sen đá bằng lá](/tin-tuc/cach-nhan-giong-sen-da-bang-la-cuc-don-gian)','Chăm sóc',1,20,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(71,'Nên dùng đất gì để trồng sen đá?','dat gi, loai dat, tron dat, dat trong sen da, gia the, cong thuc dat, thay dat, thay chau','Sen đá cần giá thể **thoát nước tốt**: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun. Tiện nhất là dùng [Đất trồng sen đá chuyên dụng](/danh-muc/dat-phan-bon) đã trộn sẵn. Thay chậu tốt nhất vào mùa khô, 1–2 năm/lần.','Chăm sóc',1,21,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(72,'Sen đá bị rệp, sâu bệnh','rep, rep sap, sau, con trung, bi nam, dom trang, dom den, kien','Rệp sáp (đốm trắng như bông) hay gặp nhất: dùng tăm bông thấm cồn lau sạch, cách ly cây và phun thuốc sinh học 7 ngày/lần. Đặt cây nơi thoáng gió để phòng nấm. Bạn gửi ảnh qua Zalo để shop xem giúp nhé!','Chăm sóc',1,22,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(73,'Chăm sóc terrarium như thế nào?','cham terrarium, cham tieu canh, tieu canh tuoi, binh thuy tinh tuoi, terrarium tuoi','Terrarium để nơi có **ánh sáng tán xạ** (gần cửa sổ, không chiếu nắng trực tiếp vào bình). Phun sương nhẹ quanh gốc **10–14 ngày/lần**, mỗi lần 5–10 lần xịt – tuyệt đối không tưới nhiều vì bình không có lỗ thoát nước.
Đọc thêm: [Terrarium – khu rừng nhỏ trong bình thủy tinh](/tin-tuc/terrarium-khu-rung-nho-trong-binh-thuy-tinh)','Chăm sóc',1,23,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(74,'Để sen đá trong phòng máy lạnh được không?','may lanh, dieu hoa, phong lanh, trong phong, phong ngu, van phong co song duoc','Được ạ, nhưng phòng máy lạnh thường **thiếu sáng và khô**. Bạn nên chọn giống chịu bóng (Kim Cương, Móng Rồng), đặt gần cửa sổ, tưới thưa hơn và mỗi tuần mang cây ra ngoài phơi nắng 1–2 ngày.
Gợi ý bày trí: [Sen đá cho bàn làm việc](/tin-tuc/goi-y-bay-tri-sen-da-cho-ban-lam-viec)','Chăm sóc',1,24,0,1791018443151,1791018443151);
INSERT INTO "ChatFaq" VALUES(75,'sen đá mua sỉ ở đâu','sen da mua si o dau, mua si','Bạn có thể mua ở Đà Lạt hoặc nhà của Hậu','chung',1,0,1,1791041434084,1791041453880);
CREATE TABLE "ChatMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "source" TEXT,
    "answered" BOOLEAN NOT NULL DEFAULT true,
    "payload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "ChatMessage" VALUES(33,11,'user','phí ship bao nhiêu vậy shop',NULL,NULL,1,NULL,1791016342918);
INSERT INTO "ChatMessage" VALUES(34,11,'bot','Phí giao hàng đồng giá **30.000đ**/đơn.
🎉 **Miễn phí ship** cho đơn từ **500.000đ**.','shipping_fee','rule',1,NULL,1791016362918);
INSERT INTO "ChatMessage" VALUES(35,11,'user','bao lâu thì nhận được hàng',NULL,NULL,1,NULL,1791016382918);
INSERT INTO "ChatMessage" VALUES(36,11,'bot','Thời gian giao hàng dự kiến:
- **Nội thành TP. Hồ Chí Minh:** trong 24 giờ
- **Các tỉnh/thành khác:** 2–4 ngày làm việc
- Vùng sâu, vùng xa có thể thêm 1–2 ngày
Shop sẽ gọi xác nhận trước khi gửi hàng nhé 🚚','faq','faq',1,NULL,1791016402918);
INSERT INTO "ChatMessage" VALUES(37,12,'user','tư vấn cây dễ chăm để bàn làm việc dưới 100k',NULL,NULL,1,NULL,1791011242918);
INSERT INTO "ChatMessage" VALUES(38,12,'bot','Với tiêu chí **dễ chăm, hợp người mới, chịu bóng, để trong nhà / văn phòng, dưới 100.000đ**, Bé Sen gợi ý:','recommend','rule',1,NULL,1791011262918);
INSERT INTO "ChatMessage" VALUES(39,13,'user','shop có bán hạt giống sen đá không',NULL,NULL,1,NULL,1791000442918);
INSERT INTO "ChatMessage" VALUES(40,13,'bot','Xin lỗi, Bé Sen chưa hiểu ý bạn lắm 🥺 Bạn có thể hỏi về **phí ship, thời gian giao hàng, tư vấn chọn cây, quà tặng, tình trạng đơn hàng**... hoặc chọn nhanh bên dưới nhé!','fallback','rule',0,NULL,1791000462918);
INSERT INTO "ChatMessage" VALUES(41,14,'user','⏰ Giờ làm việc',NULL,NULL,1,NULL,1791019236669);
INSERT INTO "ChatMessage" VALUES(42,14,'bot','Shop làm việc **8:00 – 21:00, Thứ 2 – Chủ nhật** ⏰
Đơn đặt online được nhận 24/7, ngoài giờ shop sẽ xác nhận vào sáng hôm sau nhé!','hours','rule',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791019236707);
INSERT INTO "ChatMessage" VALUES(43,14,'user','🌱 Tư vấn chọn cây',NULL,NULL,1,NULL,1791019244856);
INSERT INTO "ChatMessage" VALUES(44,14,'bot','Bé Sen tư vấn ngay nè 🌱 Bạn cho mình biết thêm: cây để ở đâu (bàn làm việc, ban công...), bạn thích màu gì, hay ngân sách khoảng bao nhiêu?','recommend','rule',1,'{"quickReplies":["Cây dễ chăm cho người mới","Để bàn làm việc, ít nắng","Treo ban công","Màu sắc rực rỡ","Dưới 100k"]}',1791019244878);
INSERT INTO "ChatMessage" VALUES(45,15,'user','⏰ Giờ làm việc',NULL,NULL,1,NULL,1791021368867);
INSERT INTO "ChatMessage" VALUES(46,15,'bot','Shop làm việc **8:00 – 21:00, Thứ 2 – Chủ nhật** ⏰
Đơn đặt online được nhận 24/7, ngoài giờ shop sẽ xác nhận vào sáng hôm sau nhé!','hours','rule',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791021368901);
INSERT INTO "ChatMessage" VALUES(47,16,'user','⏰ Giờ làm việc',NULL,NULL,1,NULL,1791021386021);
INSERT INTO "ChatMessage" VALUES(48,16,'bot','Shop làm việc **8:00 – 21:00, Thứ 2 – Chủ nhật** ⏰
Đơn đặt online được nhận 24/7, ngoài giờ shop sẽ xác nhận vào sáng hôm sau nhé!','hours','rule',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791021386046);
INSERT INTO "ChatMessage" VALUES(49,17,'user','📦 Tra cứu đơn hàng',NULL,NULL,1,NULL,1791024234697);
INSERT INTO "ChatMessage" VALUES(50,17,'bot','Bạn gửi giúp mình **mã đơn hàng** (VD: SD261003-7K2F) và **số điện thoại đặt hàng** để mình kiểm tra nhé 📦','order_status','rule',1,'{"quickReplies":["Tôi không nhớ mã đơn","💬 Gặp nhân viên"]}',1791024234724);
INSERT INTO "ChatMessage" VALUES(51,17,'user','💬 Gặp nhân viên',NULL,NULL,1,NULL,1791024244770);
INSERT INTO "ChatMessage" VALUES(52,17,'bot','Bạn có thể liên hệ nhân viên qua:
- Hotline: **0901 234 567**
- Zalo: [Nhắn Zalo](https://zalo.me/0901234567)
- Facebook: [Fanpage](https://facebook.com/)
- Email: hello@sendaxinh.vn
Hoặc để lại **số điện thoại** ngay tại đây, shop sẽ gọi lại cho bạn 📞','contact','rule',1,'{}',1791024244781);
INSERT INTO "ChatMessage" VALUES(53,18,'user','🚚 Phí ship bao nhiêu?',NULL,NULL,1,NULL,1791024254056);
INSERT INTO "ChatMessage" VALUES(54,18,'bot','Phí giao hàng đồng giá **30.000đ**/đơn.
🎉 **Miễn phí ship** cho đơn từ **500.000đ**.
Thời gian giao: nội thành TP.HCM trong 24h, tỉnh khác 2–4 ngày.','shipping_fee','rule',1,'{"quickReplies":["Bao lâu thì nhận được hàng?","🌱 Tư vấn chọn cây"]}',1791024254065);
INSERT INTO "ChatMessage" VALUES(55,18,'user','Bao lâu thì nhận được hàng?',NULL,NULL,1,NULL,1791024265101);
INSERT INTO "ChatMessage" VALUES(56,18,'bot','Thời gian giao hàng dự kiến:
- **Nội thành TP. Hồ Chí Minh:** trong 24 giờ
- **Các tỉnh/thành khác:** 2–4 ngày làm việc
- Vùng sâu, vùng xa có thể thêm 1–2 ngày
Shop sẽ gọi xác nhận trước khi gửi hàng nhé 🚚','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791024265111);
INSERT INTO "ChatMessage" VALUES(57,18,'user','🌱 Tư vấn chọn cây',NULL,NULL,1,NULL,1791024274371);
INSERT INTO "ChatMessage" VALUES(58,18,'bot','Bé Sen tư vấn ngay nè 🌱 Bạn cho mình biết thêm: cây để ở đâu (bàn làm việc, ban công...), bạn thích màu gì, hay ngân sách khoảng bao nhiêu?','recommend','rule',1,'{"quickReplies":["Cây dễ chăm cho người mới","Để bàn làm việc, ít nắng","Treo ban công","Màu sắc rực rỡ","Dưới 100k"]}',1791024274389);
INSERT INTO "ChatMessage" VALUES(59,18,'user','Để bàn làm việc, ít nắng',NULL,NULL,1,NULL,1791024278386);
INSERT INTO "ChatMessage" VALUES(60,18,'bot','Với tiêu chí **chịu bóng, để trong nhà / văn phòng, nhỏ xinh để bàn**, Bé Sen gợi ý:','recommend','rule',1,'{"products":[{"id":235,"slug":"sen-da-mong-rong","name":"Sen đá Móng Rồng","price":45000,"salePrice":null,"stock":35,"image":"/uploads/seed/pot-5.webp"},{"id":234,"slug":"sen-da-kim-cuong","name":"Sen đá Kim Cương","price":85000,"salePrice":null,"stock":20,"image":"/uploads/seed/haworthia-3.webp"},{"id":236,"slug":"sen-da-kim-cuong-truncata","name":"Sen đá Kim Cương Truncata","price":150000,"salePrice":null,"stock":6,"image":"/uploads/seed/haworthia-4.webp"},{"id":227,"slug":"sen-da-phat-ba","name":"Sen đá Phật Bà","price":45000,"salePrice":null,"stock":40,"image":"/uploads/seed/echeveria-5.webp"}],"quickReplies":["Dưới 50k","Cây chịu bóng","Làm quà tặng","Cách chăm sóc sen đá"]}',1791024278398);
INSERT INTO "ChatMessage" VALUES(61,18,'user','Làm quà tặng',NULL,NULL,1,NULL,1791024296074);
INSERT INTO "ChatMessage" VALUES(62,18,'bot','Gợi ý quà tặng (làm quà tặng) 🎁 Shop **gói quà & viết thiệp miễn phí**, bạn ghi lời chúc ở phần Ghi chú khi đặt nhé!','gift','rule',1,'{"products":[{"id":250,"slug":"tieu-canh-terrarium-binh-cau","name":"Tiểu Cảnh Terrarium Bình Cầu","price":350000,"salePrice":299000,"stock":7,"image":"/uploads/seed/terrarium-1.webp"},{"id":254,"slug":"chau-tuong-em-be-go","name":"Chậu Tượng Em Bé Gỗ","price":85000,"salePrice":null,"stock":15,"image":"/uploads/seed/pot-3.webp"},{"id":251,"slug":"tieu-canh-chuong-thuy-tinh","name":"Tiểu Cảnh Chuông Thủy Tinh","price":280000,"salePrice":null,"stock":9,"image":"/uploads/seed/terrarium-2.webp"},{"id":253,"slug":"chau-su-trang-tron-10cm","name":"Chậu Sứ Trắng Tròn 10cm","price":45000,"salePrice":null,"stock":60,"image":"/uploads/seed/pot-2.webp"}],"quickReplies":["Quà dưới 300k","Tiểu cảnh terrarium","Có gói quà không?","Mua số lượng nhiều"]}',1791024296087);
INSERT INTO "ChatMessage" VALUES(63,18,'user','Có gói quà không?',NULL,NULL,1,NULL,1791024305700);
INSERT INTO "ChatMessage" VALUES(64,18,'bot','Có ạ 🎁 Shop **gói quà và viết thiệp miễn phí**. Bạn ghi lời chúc vào phần **Ghi chú** khi đặt hàng, shop sẽ trang trí xinh xắn trước khi gửi đi.','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791024305731);
INSERT INTO "ChatMessage" VALUES(65,19,'user','Chính sách bảo hành, đổi trả như thế nào?',NULL,NULL,1,NULL,1791041231577);
INSERT INTO "ChatMessage" VALUES(66,19,'bot','Shop **bảo hành cây 7 ngày** kể từ khi nhận hàng:
- Cây bị dập, gãy, thối do vận chuyển → đổi cây mới miễn phí
- Bạn chỉ cần chụp ảnh/quay video lúc mở hộp và nhắn shop kèm mã đơn
Ngoài ra shop luôn tư vấn chăm sóc trọn đời cho cây mua tại shop 🌱','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041231601);
INSERT INTO "ChatMessage" VALUES(67,19,'user','🌱 Tư vấn chọn cây',NULL,NULL,1,NULL,1791041240005);
INSERT INTO "ChatMessage" VALUES(68,19,'bot','Bé Sen tư vấn ngay nè 🌱 Bạn cho mình biết thêm: cây để ở đâu (bàn làm việc, ban công...), bạn thích màu gì, hay ngân sách khoảng bao nhiêu?','recommend','rule',1,'{"quickReplies":["Cây dễ chăm cho người mới","Để bàn làm việc, ít nắng","Treo ban công","Màu sắc rực rỡ","Dưới 100k"]}',1791041240041);
INSERT INTO "ChatMessage" VALUES(69,19,'user','Để bàn làm việc, ít nắng',NULL,NULL,1,NULL,1791041251992);
INSERT INTO "ChatMessage" VALUES(70,19,'bot','Với tiêu chí **chịu bóng, để trong nhà / văn phòng, nhỏ xinh để bàn**, Bé Sen gợi ý:','recommend','rule',1,'{"products":[{"id":235,"slug":"sen-da-mong-rong","name":"Sen đá Móng Rồng","price":45000,"salePrice":null,"stock":35,"image":"/uploads/seed/pot-5.webp"},{"id":234,"slug":"sen-da-kim-cuong","name":"Sen đá Kim Cương","price":85000,"salePrice":null,"stock":19,"image":"/uploads/seed/haworthia-3.webp"},{"id":236,"slug":"sen-da-kim-cuong-truncata","name":"Sen đá Kim Cương Truncata","price":150000,"salePrice":null,"stock":6,"image":"/uploads/seed/haworthia-4.webp"},{"id":227,"slug":"sen-da-phat-ba","name":"Sen đá Phật Bà","price":45000,"salePrice":null,"stock":37,"image":"/uploads/seed/echeveria-5.webp"}],"quickReplies":["Dưới 50k","Cây chịu bóng","Làm quà tặng","Cách chăm sóc sen đá"]}',1791041252009);
INSERT INTO "ChatMessage" VALUES(71,19,'user','Cách chăm sóc sen đá',NULL,NULL,1,NULL,1791041266804);
INSERT INTO "ChatMessage" VALUES(72,19,'bot','5 nguyên tắc chăm sen đá 🌱
- **Ánh sáng:** 4–6 giờ nắng nhẹ mỗi ngày
- **Tưới nước:** khô mới tưới, tưới thì tưới đẫm (5–7 ngày/lần)
- **Đất:** thoát nước tốt, trộn perlite/đá bọt
- **Chậu:** bắt buộc có lỗ thoát nước
- **Thông gió:** đặt nơi thoáng, nhất là mùa mưa
Đọc đầy đủ: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041266819);
INSERT INTO "ChatMessage" VALUES(73,19,'user','🌱 Tư vấn chọn cây',NULL,NULL,1,NULL,1791041277081);
INSERT INTO "ChatMessage" VALUES(74,19,'bot','Bé Sen tư vấn ngay nè 🌱 Bạn cho mình biết thêm: cây để ở đâu (bàn làm việc, ban công...), bạn thích màu gì, hay ngân sách khoảng bao nhiêu?','recommend','rule',1,'{"quickReplies":["Cây dễ chăm cho người mới","Để bàn làm việc, ít nắng","Treo ban công","Màu sắc rực rỡ","Dưới 100k"]}',1791041277100);
INSERT INTO "ChatMessage" VALUES(75,19,'user','Cây dễ chăm cho người mới',NULL,NULL,1,NULL,1791041279455);
INSERT INTO "ChatMessage" VALUES(76,19,'bot','Với tiêu chí **dễ chăm, hợp người mới**, Bé Sen gợi ý:','recommend','rule',1,'{"products":[{"id":227,"slug":"sen-da-phat-ba","name":"Sen đá Phật Bà","price":45000,"salePrice":null,"stock":37,"image":"/uploads/seed/echeveria-5.webp"},{"id":235,"slug":"sen-da-mong-rong","name":"Sen đá Móng Rồng","price":45000,"salePrice":null,"stock":35,"image":"/uploads/seed/pot-5.webp"},{"id":231,"slug":"sen-da-nau","name":"Sen đá Nâu","price":35000,"salePrice":null,"stock":50,"image":"/uploads/seed/graptopetalum-4.webp"},{"id":232,"slug":"sen-da-ngoc-bich","name":"Sen đá Ngọc Bích","price":35000,"salePrice":null,"stock":45,"image":"/uploads/seed/graptopetalum-1.webp"}],"quickReplies":["Dưới 50k","Cây chịu bóng","Làm quà tặng","Cách chăm sóc sen đá"]}',1791041279464);
INSERT INTO "ChatMessage" VALUES(77,19,'user','Dưới 50k',NULL,NULL,1,NULL,1791041283869);
INSERT INTO "ChatMessage" VALUES(78,19,'bot','Với tiêu chí **dưới 50.000đ**, Bé Sen gợi ý:','recommend','rule',1,'{"products":[{"id":227,"slug":"sen-da-phat-ba","name":"Sen đá Phật Bà","price":45000,"salePrice":null,"stock":37,"image":"/uploads/seed/echeveria-5.webp"},{"id":235,"slug":"sen-da-mong-rong","name":"Sen đá Móng Rồng","price":45000,"salePrice":null,"stock":35,"image":"/uploads/seed/pot-5.webp"},{"id":231,"slug":"sen-da-nau","name":"Sen đá Nâu","price":35000,"salePrice":null,"stock":50,"image":"/uploads/seed/graptopetalum-4.webp"},{"id":232,"slug":"sen-da-ngoc-bich","name":"Sen đá Ngọc Bích","price":35000,"salePrice":null,"stock":45,"image":"/uploads/seed/graptopetalum-1.webp"}],"quickReplies":["Dưới 50k","Cây chịu bóng","Làm quà tặng","Cách chăm sóc sen đá"]}',1791041283891);
INSERT INTO "ChatMessage" VALUES(79,19,'user','Cách chăm sóc sen đá',NULL,NULL,1,NULL,1791041289478);
INSERT INTO "ChatMessage" VALUES(80,19,'bot','5 nguyên tắc chăm sen đá 🌱
- **Ánh sáng:** 4–6 giờ nắng nhẹ mỗi ngày
- **Tưới nước:** khô mới tưới, tưới thì tưới đẫm (5–7 ngày/lần)
- **Đất:** thoát nước tốt, trộn perlite/đá bọt
- **Chậu:** bắt buộc có lỗ thoát nước
- **Thông gió:** đặt nơi thoáng, nhất là mùa mưa
Đọc đầy đủ: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041289492);
INSERT INTO "ChatMessage" VALUES(81,19,'user','💬 Gặp nhân viên',NULL,NULL,1,NULL,1791041296522);
INSERT INTO "ChatMessage" VALUES(82,19,'bot','Bạn có thể liên hệ nhân viên qua:
- Hotline: **0901 234 567**
- Zalo: [Nhắn Zalo](https://zalo.me/0901234567)
- Facebook: [Fanpage](https://facebook.com/)
- Email: 25210281@ms.uit.edu.vn
Hoặc để lại **số điện thoại** ngay tại đây, shop sẽ gọi lại cho bạn 📞','contact','rule',1,'{}',1791041296541);
INSERT INTO "ChatMessage" VALUES(83,20,'user','⏰ Giờ làm việc',NULL,NULL,1,NULL,1791041309922);
INSERT INTO "ChatMessage" VALUES(84,20,'bot','Shop làm việc **8:00 – 21:00, Thứ 2 – Chủ nhật** ⏰
Đơn đặt online được nhận 24/7, ngoài giờ shop sẽ xác nhận vào sáng hôm sau nhé!','hours','rule',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041309930);
INSERT INTO "ChatMessage" VALUES(85,21,'user','sen đá mua sier ở đâu',NULL,NULL,1,NULL,1791041374499);
INSERT INTO "ChatMessage" VALUES(86,21,'bot','Xin lỗi, Bé Sen chưa hiểu ý bạn lắm 🥺 Bạn có thể hỏi về **phí ship, thời gian giao hàng, tư vấn chọn cây, quà tặng, tình trạng đơn hàng**... hoặc chọn nhanh bên dưới nhé!','fallback','rule',0,'{"quickReplies":["🌱 Tư vấn chọn cây","🚚 Phí ship bao nhiêu?","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041374510);
INSERT INTO "ChatMessage" VALUES(87,21,'user','sen đá mua sỉ ở đâu',NULL,NULL,1,NULL,1791041453862);
INSERT INTO "ChatMessage" VALUES(88,21,'bot','Bạn có thể mua ở Đà Lạt hoặc nhà của Hậu','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791041453880);
INSERT INTO "ChatMessage" VALUES(89,22,'user','🚚 Phí ship bao nhiêu?',NULL,NULL,1,NULL,1791102230604);
INSERT INTO "ChatMessage" VALUES(90,22,'bot','Phí giao hàng đồng giá **30.000đ**/đơn.
🎉 **Miễn phí ship** cho đơn từ **500.000đ**.
Thời gian giao: nội thành TP.HCM trong 24h, tỉnh khác 2–4 ngày.','shipping_fee','rule',1,'{"quickReplies":["Bao lâu thì nhận được hàng?","🌱 Tư vấn chọn cây"]}',1791102230626);
INSERT INTO "ChatMessage" VALUES(91,22,'user','Bao lâu thì nhận được hàng?',NULL,NULL,1,NULL,1791102233827);
INSERT INTO "ChatMessage" VALUES(92,22,'bot','Thời gian giao hàng dự kiến:
- **Nội thành TP. Hồ Chí Minh:** trong 24 giờ
- **Các tỉnh/thành khác:** 2–4 ngày làm việc
- Vùng sâu, vùng xa có thể thêm 1–2 ngày
Shop sẽ gọi xác nhận trước khi gửi hàng nhé 🚚','faq','faq',1,'{"quickReplies":["🌱 Tư vấn chọn cây","📦 Tra cứu đơn hàng","💬 Gặp nhân viên"]}',1791102233841);
INSERT INTO "ChatMessage" VALUES(93,22,'user','📦 Tra cứu đơn hàng',NULL,NULL,1,NULL,1791102236521);
INSERT INTO "ChatMessage" VALUES(94,22,'bot','Bạn gửi giúp mình **mã đơn hàng** (VD: SD261003-7K2F) và **số điện thoại đặt hàng** để mình kiểm tra nhé 📦','order_status','rule',1,'{"quickReplies":["Tôi không nhớ mã đơn","💬 Gặp nhân viên"]}',1791102236531);
INSERT INTO "ChatMessage" VALUES(95,22,'user','Tôi không nhớ mã đơn',NULL,NULL,1,NULL,1791102240338);
INSERT INTO "ChatMessage" VALUES(96,22,'bot','Không sao ạ! Mã đơn có trong **trang cảm ơn** sau khi đặt hàng (bắt đầu bằng SD...). Nếu không tìm thấy, bạn gọi hotline **0901 234 567** và đọc số điện thoại đặt hàng, nhân viên sẽ kiểm tra giúp bạn nhé 📞','order_status','rule',1,'{"quickReplies":["💬 Gặp nhân viên"]}',1791102240347);
INSERT INTO "ChatMessage" VALUES(97,22,'user','💬 Gặp nhân viên',NULL,NULL,1,NULL,1791102247320);
INSERT INTO "ChatMessage" VALUES(98,22,'bot','Bạn có thể liên hệ nhân viên qua:
- Hotline: **0901 234 567**
- Zalo: [Nhắn Zalo](https://zalo.me/0901234567)
- Facebook: [Fanpage](https://facebook.com/)
- Email: 25210281@ms.uit.edu.vn
Hoặc để lại **số điện thoại** ngay tại đây, shop sẽ gọi lại cho bạn 📞','contact','rule',1,'{}',1791102247327);
INSERT INTO "ChatMessage" VALUES(99,23,'user','📦 Tra cứu đơn hàng',NULL,NULL,1,NULL,1791102252820);
INSERT INTO "ChatMessage" VALUES(100,23,'bot','Bạn gửi giúp mình **mã đơn hàng** (VD: SD261003-7K2F) và **số điện thoại đặt hàng** để mình kiểm tra nhé 📦','order_status','rule',1,'{"quickReplies":["Tôi không nhớ mã đơn","💬 Gặp nhân viên"]}',1791102252833);
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isHandled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "Contact" VALUES(24,'Hoàng Yến','0909111222','Shop ơi cho mình hỏi có nhận làm tiểu cảnh theo yêu cầu cho sự kiện công ty không ạ? Khoảng 50 phần.',1,1791007642918);
INSERT INTO "Contact" VALUES(25,'Minh Tuấn','tuan.nguyen@example.com','Sen đá của mình bị rụng lá nhiều sau khi mua về 1 tuần, shop tư vấn giúp mình với.',1,1790924842918);
INSERT INTO "Contact" VALUES(26,'Thanh Trúc','0938777666','Mình muốn đặt 20 chậu sen đá mini làm quà cưới, shop báo giá sỉ giúp mình.',1,1790672842918);
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "note" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "subtotal" INTEGER NOT NULL,
    "shippingFee" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "internalNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Order" VALUES(402,'SD260706-FMCU','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',172000,30000,202000,'Khách hẹn đổi giờ giao',1783341300000,1783660414982);
INSERT INTO "Order" VALUES(403,'SD260709-TV47','Phan Gia Khang','0734051602','86 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Giao sau 17h','COD','CANCELLED',65000,30000,95000,'Khách đổi ý, đã gọi xác nhận hủy',1783564500000,1783635479912);
INSERT INTO "Order" VALUES(404,'SD260710-GRAH','Huỳnh Thị Thảo','0513859413','171 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','COD','COMPLETED',130000,30000,160000,NULL,1783680480000,1784020277372);
INSERT INTO "Order" VALUES(405,'SD260711-7G58','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',104000,30000,134000,'Khách hẹn đổi giờ giao',1783748580000,1784060741222);
INSERT INTO "Order" VALUES(406,'SD260712-JX5X','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',718000,0,718000,NULL,1783829820000,1784041335430);
INSERT INTO "Order" VALUES(407,'SD260713-EU52','Đặng Đức Huy','0363436004','219 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',99000,30000,129000,NULL,1783921260000,1784110419471);
INSERT INTO "Order" VALUES(408,'SD260714-NGRS','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','BANK_TRANSFER','COMPLETED',203000,30000,233000,NULL,1784005800000,1784348007750);
INSERT INTO "Order" VALUES(409,'SD260716-AGA8','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'BANK_TRANSFER','COMPLETED',241000,30000,271000,NULL,1784210520000,1784404605776);
INSERT INTO "Order" VALUES(410,'SD260717-RRRR','Lý Ngọc Tâm','0791500563','85 Đường Quang Trung, P. 10, Q. Gò Vấp, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',300000,30000,330000,NULL,1784255400000,1784496211089);
INSERT INTO "Order" VALUES(411,'SD260718-XYJP','Đặng Tuấn Đạt','0758332692','215 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',130000,30000,160000,NULL,1784340060000,1784583649281);
INSERT INTO "Order" VALUES(412,'SD260719-VF7U','Hồ Đức Phúc','0844060470','134 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'COD','COMPLETED',200000,30000,230000,NULL,1784461920000,1784712260743);
INSERT INTO "Order" VALUES(413,'SD260720-M2GH','Hồ Hoài Hà','0533767170','20 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',285000,30000,315000,NULL,1784547240000,1784816059166);
INSERT INTO "Order" VALUES(414,'SD260721-YTZA','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',653000,0,653000,NULL,1784611680000,1784836250864);
INSERT INTO "Order" VALUES(415,'SD260722-PXS4','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',206000,30000,236000,'Khách quen, tặng kèm sỏi trang trí',1784722440000,1784981326206);
INSERT INTO "Order" VALUES(416,'SD260724-ADVB','Bùi Văn Tài','0862240941','231 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',180000,30000,210000,NULL,1784891400000,1785149807401);
INSERT INTO "Order" VALUES(417,'SD260725-7XD2','Vũ Phương Vy','0720715466','176 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',80000,30000,110000,NULL,1784964240000,1785282031064);
INSERT INTO "Order" VALUES(418,'SD260726-EMCU','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh','Giao giờ hành chính giúp mình','BANK_TRANSFER','COMPLETED',538000,0,538000,NULL,1785070740000,1785362237108);
INSERT INTO "Order" VALUES(419,'SD260726-ZMUQ','Nguyễn Minh Linh','0993517826','113 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'COD','COMPLETED',35000,30000,65000,NULL,1785068280000,1785293801578);
INSERT INTO "Order" VALUES(420,'SD260727-Z9MT','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',135000,30000,165000,NULL,1785130860000,1785458693043);
INSERT INTO "Order" VALUES(421,'SD260728-98TD','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','CANCELLED',50000,30000,80000,'Không liên lạc được khách 3 lần',1785245100000,1785330628386);
INSERT INTO "Order" VALUES(422,'SD260729-HBNH','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',100000,30000,130000,NULL,1785300120000,1785596487747);
INSERT INTO "Order" VALUES(423,'SD260730-ZUHC','Bùi Văn Tài','0862240941','231 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',184000,30000,214000,NULL,1785394920000,1785652020805);
INSERT INTO "Order" VALUES(424,'SD260731-X47M','Hồ Thu Yến','0787745025','181 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',440000,30000,470000,NULL,1785467520000,1785645069671);
INSERT INTO "Order" VALUES(425,'SD260801-4Y2K','Huỳnh Thị Thảo','0513859413','171 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','CANCELLED',481000,30000,511000,'Không liên lạc được khách 3 lần',1785589080000,1785624454654);
INSERT INTO "Order" VALUES(426,'SD260801-FZTZ','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',120000,30000,150000,NULL,1785547020000,1785819849456);
INSERT INTO "Order" VALUES(427,'SD260802-66QN','Hoàng Thanh Quỳnh','0536008549','73 Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai',NULL,'BANK_TRANSFER','COMPLETED',996000,0,996000,NULL,1785667380000,1785919053948);
INSERT INTO "Order" VALUES(428,'SD260802-EJDC','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',358000,30000,388000,NULL,1785682260000,1786025505688);
INSERT INTO "Order" VALUES(429,'SD260803-HKHH','Huỳnh Đức Tài','0839738383','159 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Giao sau 17h','BANK_TRANSFER','COMPLETED',155000,30000,185000,NULL,1785761040000,1786014315767);
INSERT INTO "Order" VALUES(430,'SD260804-5PRD','Phan Gia Khang','0734051602','86 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','BANK_TRANSFER','COMPLETED',549000,0,549000,NULL,1785824700000,1786091711364);
INSERT INTO "Order" VALUES(431,'SD260804-R27R','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',339000,30000,369000,NULL,1785810360000,1786101551791);
INSERT INTO "Order" VALUES(432,'SD260805-BAP5','Hoàng Thanh Quỳnh','0536008549','73 Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai',NULL,'BANK_TRANSFER','COMPLETED',374000,30000,404000,NULL,1785892800000,1786124863750);
INSERT INTO "Order" VALUES(433,'SD260806-2HC2','Vũ Phương Vy','0720715466','176 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',39000,30000,69000,NULL,1785996000000,1786226392218);
INSERT INTO "Order" VALUES(434,'SD260807-SKTH','Trần Phương Nhi','0595110384','179 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',240000,30000,270000,NULL,1786106280000,1786432048173);
INSERT INTO "Order" VALUES(435,'SD260808-S7TU','Đặng Thành Huy','0747238148','53 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','COMPLETED',245000,30000,275000,NULL,1786189020000,1786474844435);
INSERT INTO "Order" VALUES(436,'SD260808-E529','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',220000,30000,250000,NULL,1786187280000,1786504585143);
INSERT INTO "Order" VALUES(437,'SD260809-HUW2','Huỳnh Thanh Anh','0803312985','17 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',45000,30000,75000,NULL,1786274100000,1786474037847);
INSERT INTO "Order" VALUES(438,'SD260809-3UWJ','Trần Tuấn Long','0950494090','223 Đường Quang Trung, P. 10, Q. Gò Vấp, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',45000,30000,75000,NULL,1786247220000,1786518977731);
INSERT INTO "Order" VALUES(439,'SD260810-HJ6U','Nguyễn Mỹ Thảo','0509709656','94 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',80000,30000,110000,NULL,1786331100000,1786517508038);
INSERT INTO "Order" VALUES(440,'SD260810-NXMH','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh','Mua tặng bạn, không ghi giá trong hộp','COD','COMPLETED',169000,30000,199000,NULL,1786338960000,1786668178184);
INSERT INTO "Order" VALUES(441,'SD260811-89QQ','Nguyễn Minh Linh','0993517826','113 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'BANK_TRANSFER','COMPLETED',99000,30000,129000,'Khách hẹn đổi giờ giao',1786422420000,1786623242997);
INSERT INTO "Order" VALUES(442,'SD260812-P7RF','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','BANK_TRANSFER','COMPLETED',45000,30000,75000,NULL,1786536480000,1786821104719);
INSERT INTO "Order" VALUES(443,'SD260813-6QEV','Đặng Đức Huy','0363436004','219 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','COD','COMPLETED',280000,30000,310000,NULL,1786617960000,1786906945534);
INSERT INTO "Order" VALUES(444,'SD260814-EZUP','Nguyễn Minh Linh','0993517826','113 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'COD','COMPLETED',35000,30000,65000,NULL,1786680060000,1786881633118);
INSERT INTO "Order" VALUES(445,'SD260814-EFEV','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',280000,30000,310000,NULL,1786694400000,1786929732849);
INSERT INTO "Order" VALUES(446,'SD260815-75DG','Đặng Đức Huy','0363436004','219 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','COD','CANCELLED',165000,30000,195000,'Không liên lạc được khách 3 lần',1786788960000,1786819050113);
INSERT INTO "Order" VALUES(447,'SD260815-5V3K','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','COD','COMPLETED',91000,30000,121000,NULL,1786788300000,1787132412589);
INSERT INTO "Order" VALUES(448,'SD260816-TQJ8','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',350000,30000,380000,'Khách hẹn đổi giờ giao',1786882920000,1787087111098);
INSERT INTO "Order" VALUES(449,'SD260816-GDGF','Võ Khánh Vy','0754232764','25 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh','Giao sau 17h','COD','COMPLETED',125000,30000,155000,NULL,1786860060000,1787182524478);
INSERT INTO "Order" VALUES(450,'SD260817-YDNV','Đặng Tuấn Đạt','0758332692','215 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',85000,30000,115000,NULL,1786949400000,1787267827555);
INSERT INTO "Order" VALUES(451,'SD260818-QUNK','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','COD','COMPLETED',90000,30000,120000,NULL,1787063040000,1787255771046);
INSERT INTO "Order" VALUES(452,'SD260818-W9T2','Trần Phương Nhi','0595110384','179 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',250000,30000,280000,NULL,1787024400000,1787296789402);
INSERT INTO "Order" VALUES(453,'SD260819-PPXN','Lý Thanh Vy','0836891035','67 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'BANK_TRANSFER','COMPLETED',85000,30000,115000,NULL,1787142600000,1787322304747);
INSERT INTO "Order" VALUES(454,'SD260820-4RYH','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','COD','COMPLETED',55000,30000,85000,NULL,1787224200000,1787503396374);
INSERT INTO "Order" VALUES(455,'SD260820-TFUK','Huỳnh Ngọc Quỳnh','0836442562','163 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',90000,30000,120000,NULL,1787230380000,1787511938667);
INSERT INTO "Order" VALUES(456,'SD260821-63ZA','Lý Thanh Vy','0836891035','67 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','COMPLETED',175000,30000,205000,NULL,1787316780000,1787577510067);
INSERT INTO "Order" VALUES(457,'SD260821-7M5J','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',78000,30000,108000,NULL,1787287860000,1787535381746);
INSERT INTO "Order" VALUES(458,'SD260822-V39A','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','CANCELLED',104000,30000,134000,'Khách đổi ý, đã gọi xác nhận hủy',1787374800000,1787417741497);
INSERT INTO "Order" VALUES(459,'SD260822-VEX4','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',85000,30000,115000,NULL,1787375280000,1787666120263);
INSERT INTO "Order" VALUES(460,'SD260822-DJ8D','Đặng Ngọc Yến','0585826243','125 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',235000,30000,265000,NULL,1787403180000,1787642165087);
INSERT INTO "Order" VALUES(461,'SD260823-JMNF','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',149000,30000,179000,NULL,1787464020000,1787779317004);
INSERT INTO "Order" VALUES(462,'SD260823-MPUC','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','BANK_TRANSFER','COMPLETED',39000,30000,69000,NULL,1787487900000,1787820939993);
INSERT INTO "Order" VALUES(463,'SD260824-2NFU','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','CANCELLED',65000,30000,95000,'Khách đổi ý, đã gọi xác nhận hủy',1787570640000,1787668363900);
INSERT INTO "Order" VALUES(464,'SD260825-HPNM','Lý Thanh Vy','0836891035','67 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội','Gọi trước khi giao nhé shop','BANK_TRANSFER','COMPLETED',560000,0,560000,NULL,1787656980000,1787944995517);
INSERT INTO "Order" VALUES(465,'SD260825-HS23','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',118000,30000,148000,NULL,1787642700000,1787960371070);
INSERT INTO "Order" VALUES(466,'SD260826-2VUA','Đặng Thành Huy','0747238148','53 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','CANCELLED',99000,30000,129000,'Khách đặt trùng đơn',1787746680000,1787808971925);
INSERT INTO "Order" VALUES(467,'SD260826-3MTT','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',189000,30000,219000,NULL,1787753940000,1787988728848);
INSERT INTO "Order" VALUES(468,'SD260827-5VMB','Bùi Văn Tài','0862240941','231 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh','Giao giờ hành chính giúp mình','COD','CANCELLED',130000,30000,160000,'Khách đổi ý, đã gọi xác nhận hủy',1787815440000,1787899340977);
INSERT INTO "Order" VALUES(469,'SD260827-FKRE','Ngô Ngọc Mai','0943931329','36 Đường Trần Phú, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng',NULL,'BANK_TRANSFER','COMPLETED',598000,0,598000,NULL,1787813460000,1788139769025);
INSERT INTO "Order" VALUES(470,'SD260828-TA5M','Đặng Ngọc Yến','0585826243','125 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',39000,30000,69000,NULL,1787893260000,1788222493064);
INSERT INTO "Order" VALUES(471,'SD260828-4KTC','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'BANK_TRANSFER','COMPLETED',35000,30000,65000,NULL,1787923140000,1788146887842);
INSERT INTO "Order" VALUES(472,'SD260829-Q7Z8','Đỗ Khánh Vy','0376494569','53 Đường Trần Phú, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','BANK_TRANSFER','COMPLETED',78000,30000,108000,NULL,1788007140000,1788269933719);
INSERT INTO "Order" VALUES(473,'SD260829-PJYB','Vũ Tuấn Huy','0832192011','45 Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',549000,0,549000,'Khách hẹn đổi giờ giao',1788012060000,1788248372276);
INSERT INTO "Order" VALUES(474,'SD260829-GZ9J','Nguyễn Mỹ Thảo','0509709656','94 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh','Giao giờ hành chính giúp mình','COD','CANCELLED',99000,30000,129000,'Không liên lạc được khách 3 lần',1788008400000,1788056378260);
INSERT INTO "Order" VALUES(475,'SD260830-ECXC','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',84000,30000,114000,NULL,1788057840000,1788240574572);
INSERT INTO "Order" VALUES(476,'SD260830-3NKT','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',458000,30000,488000,NULL,1788068040000,1788375443255);
INSERT INTO "Order" VALUES(477,'SD260830-GQBX','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',364000,30000,394000,NULL,1788066000000,1788340314884);
INSERT INTO "Order" VALUES(478,'SD260831-DAE3','Đặng Thành Huy','0747238148','53 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','COMPLETED',135000,30000,165000,NULL,1788160500000,1788461739792);
INSERT INTO "Order" VALUES(479,'SD260831-BK97','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',99000,30000,129000,'Đã gọi xác nhận',1788153540000,1788490723387);
INSERT INTO "Order" VALUES(480,'SD260901-DD9E','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội','Để ở phòng bảo vệ nếu không có người nhận','BANK_TRANSFER','COMPLETED',299000,30000,329000,'Khách quen, tặng kèm sỏi trang trí',1788235860000,1788512025167);
INSERT INTO "Order" VALUES(481,'SD260902-88Q3','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','BANK_TRANSFER','COMPLETED',105000,30000,135000,NULL,1788356520000,1788654969512);
INSERT INTO "Order" VALUES(482,'SD260902-PKFG','Huỳnh Thị Thảo','0513859413','171 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',100000,30000,130000,NULL,1788326640000,1788600295295);
INSERT INTO "Order" VALUES(483,'SD260903-TRG3','Hoàng Hoài Quỳnh','0301072762','180 Đường Nguyễn Huệ, P. 1, TP. Vũng Tàu, Bà Rịa – Vũng Tàu','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',45000,30000,75000,NULL,1788444720000,1788728737576);
INSERT INTO "Order" VALUES(484,'SD260903-YJ4Q','Vũ Tuấn Huy','0832192011','45 Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','BANK_TRANSFER','COMPLETED',45000,30000,75000,NULL,1788433380000,1788702770948);
INSERT INTO "Order" VALUES(485,'SD260904-NZN7','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','BANK_TRANSFER','COMPLETED',410000,30000,440000,NULL,1788523020000,1788803924003);
INSERT INTO "Order" VALUES(486,'SD260905-3M6G','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',45000,30000,75000,NULL,1788589440000,1788806688027);
INSERT INTO "Order" VALUES(487,'SD260905-NH9P','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',39000,30000,69000,NULL,1788585420000,1788862531308);
INSERT INTO "Order" VALUES(488,'SD260906-9FV8','Hoàng Thanh Quỳnh','0536008549','73 Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai',NULL,'COD','COMPLETED',214000,30000,244000,'Đã gọi xác nhận',1788705780000,1788927157516);
INSERT INTO "Order" VALUES(489,'SD260906-8HWC','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',245000,30000,275000,'Khách hẹn đổi giờ giao',1788706080000,1789042966535);
INSERT INTO "Order" VALUES(490,'SD260906-QURN','Đặng Ngọc Yến','0585826243','125 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',213000,30000,243000,NULL,1788703380000,1788961301276);
INSERT INTO "Order" VALUES(491,'SD260907-TATU','Nguyễn Minh Linh','0993517826','113 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'BANK_TRANSFER','COMPLETED',84000,30000,114000,NULL,1788744780000,1789055240291);
INSERT INTO "Order" VALUES(492,'SD260907-36RN','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','COD','COMPLETED',255000,30000,285000,NULL,1788786420000,1789091274062);
INSERT INTO "Order" VALUES(493,'SD260908-KWBX','Bùi Văn Tài','0862240941','231 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',224000,30000,254000,NULL,1788871860000,1789131484649);
INSERT INTO "Order" VALUES(494,'SD260908-NV8R','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',365000,30000,395000,NULL,1788868740000,1789189317110);
INSERT INTO "Order" VALUES(495,'SD260909-W9E3','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',170000,30000,200000,NULL,1788933420000,1789123506554);
INSERT INTO "Order" VALUES(496,'SD260909-KBME','Huỳnh Đức Tài','0839738383','159 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',220000,30000,250000,NULL,1788964080000,1789302535186);
INSERT INTO "Order" VALUES(497,'SD260910-HYST','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',150000,30000,180000,NULL,1789012140000,1789320427071);
INSERT INTO "Order" VALUES(498,'SD260911-FHES','Đặng Tuấn Đạt','0758332692','215 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',39000,30000,69000,NULL,1789127340000,1789456279376);
INSERT INTO "Order" VALUES(499,'SD260911-W79T','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội','Giao sau 17h','BANK_TRANSFER','COMPLETED',35000,30000,65000,NULL,1789117200000,1789302162778);
INSERT INTO "Order" VALUES(500,'SD260912-4Z9X','Huỳnh Đức Tài','0839738383','159 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','BANK_TRANSFER','COMPLETED',324000,30000,354000,NULL,1789209180000,1789412664227);
INSERT INTO "Order" VALUES(501,'SD260912-CRSS','Đỗ Tuấn Bảo','0925756854','10 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',150000,30000,180000,NULL,1789221360000,1789454583764);
INSERT INTO "Order" VALUES(502,'SD260912-FCWK','Hồ Thu Yến','0787745025','181 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',45000,30000,75000,NULL,1789189860000,1789446476750);
INSERT INTO "Order" VALUES(503,'SD260913-GUYN','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','COD','COMPLETED',413000,30000,443000,'Khách hẹn đổi giờ giao',1789276620000,1789616105024);
INSERT INTO "Order" VALUES(504,'SD260913-5UNC','Vũ Thị Anh','0936971910','138 Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh','Mua tặng bạn, không ghi giá trong hộp','BANK_TRANSFER','COMPLETED',315000,30000,345000,NULL,1789275900000,1789482105580);
INSERT INTO "Order" VALUES(505,'SD260913-R8H3','Đặng Tuấn Đạt','0758332692','215 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',757000,0,757000,NULL,1789278000000,1789515574015);
INSERT INTO "Order" VALUES(506,'SD260914-9ZKK','Bùi Văn Tài','0862240941','231 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',85000,30000,115000,NULL,1789381020000,1789722582074);
INSERT INTO "Order" VALUES(507,'SD260914-K7NJ','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',263000,30000,293000,'Đóng gói 2 lớp chống sốc',1789362300000,1789662624947);
INSERT INTO "Order" VALUES(508,'SD260915-47QY','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','COMPLETED',155000,30000,185000,NULL,1789480440000,1789783102123);
INSERT INTO "Order" VALUES(509,'SD260915-2URB','Hoàng Thanh Quỳnh','0536008549','73 Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai','Shop chọn cây đẹp giúp em nha','COD','COMPLETED',95000,30000,125000,NULL,1789458660000,1789793104616);
INSERT INTO "Order" VALUES(510,'SD260916-WP6E','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',175000,30000,205000,NULL,1789552980000,1789888792711);
INSERT INTO "Order" VALUES(511,'SD260916-222J','Hoàng Thanh Quỳnh','0536008549','73 Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai',NULL,'COD','COMPLETED',198000,30000,228000,NULL,1789561920000,1789808670870);
INSERT INTO "Order" VALUES(512,'SD260917-7QUD','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh','Mua tặng bạn, không ghi giá trong hộp','BANK_TRANSFER','COMPLETED',165000,30000,195000,NULL,1789646100000,1789953623285);
INSERT INTO "Order" VALUES(513,'SD260917-QUQ7','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',177000,30000,207000,NULL,1789622940000,1789953958886);
INSERT INTO "Order" VALUES(514,'SD260918-4ZD4','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',130000,30000,160000,NULL,1789708080000,1789995997278);
INSERT INTO "Order" VALUES(515,'SD260919-9V3X','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh','Shop chọn cây đẹp giúp em nha','COD','COMPLETED',90000,30000,120000,'Đã gọi xác nhận',1789813800000,1789995369364);
INSERT INTO "Order" VALUES(516,'SD260919-MCCK','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',75000,30000,105000,NULL,1789821300000,1790116662458);
INSERT INTO "Order" VALUES(517,'SD260919-VFSU','Vũ Thu Quỳnh','0522778385','113 Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh','Giao giờ hành chính giúp mình','COD','CANCELLED',683000,0,683000,'Khách đổi ý, đã gọi xác nhận hủy',1789816500000,1789837557406);
INSERT INTO "Order" VALUES(518,'SD260920-YU8H','Phan Gia Khang','0734051602','86 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',370000,30000,400000,NULL,1789891260000,1790207622339);
INSERT INTO "Order" VALUES(519,'SD260920-YQ62','Đặng Ngọc Yến','0585826243','125 Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',295000,30000,325000,NULL,1789909860000,1790085473723);
INSERT INTO "Order" VALUES(520,'SD260920-J2AZ','Huỳnh Đức Tài','0839738383','159 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','BANK_TRANSFER','COMPLETED',469000,30000,499000,NULL,1789904640000,1790229107941);
INSERT INTO "Order" VALUES(521,'SD260921-KRHQ','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',70000,30000,100000,NULL,1789995120000,1790278832437);
INSERT INTO "Order" VALUES(522,'SD260921-EJP4','Đặng Thành Huy','0747238148','53 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội','Shop chọn cây đẹp giúp em nha','BANK_TRANSFER','COMPLETED',835000,0,835000,'Khách quen, tặng kèm sỏi trang trí',1789966140000,1790257635633);
INSERT INTO "Order" VALUES(523,'SD260922-VW37','Trần Tuấn Long','0950494090','223 Đường Quang Trung, P. 10, Q. Gò Vấp, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',104000,30000,134000,'Đã gọi xác nhận',1790050140000,1790273997337);
INSERT INTO "Order" VALUES(524,'SD260922-NZRH','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',860000,0,860000,NULL,1790082900000,1790392732891);
INSERT INTO "Order" VALUES(525,'SD260923-MAAS','Vũ Thu Quỳnh','0522778385','113 Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',90000,30000,120000,NULL,1790148900000,1790430190233);
INSERT INTO "Order" VALUES(526,'SD260923-QVY9','Đặng Tuấn Đạt','0758332692','215 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh','Mua tặng bạn, không ghi giá trong hộp','BANK_TRANSFER','COMPLETED',165000,30000,195000,NULL,1790141700000,1790459966324);
INSERT INTO "Order" VALUES(527,'SD260924-4CRF','Đặng Thành Huy','0747238148','53 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội','Để ở phòng bảo vệ nếu không có người nhận','COD','COMPLETED',110000,30000,140000,NULL,1790250120000,1790475884758);
INSERT INTO "Order" VALUES(528,'SD260924-FQHG','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',415000,30000,445000,NULL,1790253000000,1790439401432);
INSERT INTO "Order" VALUES(529,'SD260925-62NU','Nguyễn Mỹ Thảo','0509709656','94 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',264000,30000,294000,NULL,1790342160000,1790609582560);
INSERT INTO "Order" VALUES(530,'SD260925-T69E','Hồ Thu Lan','0801341049','82 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',234000,30000,264000,NULL,1790332140000,1790663103791);
INSERT INTO "Order" VALUES(531,'SD260926-UJAT','Nguyễn Minh Linh','0993517826','113 Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ',NULL,'COD','COMPLETED',225000,30000,255000,NULL,1790409300000,1790686953963);
INSERT INTO "Order" VALUES(532,'SD260926-M5QH','Vũ Khánh My','0931240518','200 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội',NULL,'COD','COMPLETED',40000,30000,70000,'Đóng gói 2 lớp chống sốc',1790406000000,1790734633236);
INSERT INTO "Order" VALUES(533,'SD260926-R2QK','Huỳnh Đức Tài','0839738383','159 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Giao sau 17h','COD','CANCELLED',78000,30000,108000,'Khách đặt trùng đơn',1790392200000,1790444876381);
INSERT INTO "Order" VALUES(534,'SD260927-V8FU','Trần Phương Nhi','0595110384','179 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',85000,30000,115000,NULL,1790516520000,1790772618109);
INSERT INTO "Order" VALUES(535,'SD260927-SV9V','Phan Mỹ Lan','0545309183','59 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','COD','COMPLETED',135000,30000,165000,NULL,1790506080000,1790706912560);
INSERT INTO "Order" VALUES(536,'SD260927-DZS3','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',170000,30000,200000,NULL,1790502720000,1790697455944);
INSERT INTO "Order" VALUES(537,'SD260928-WN7Q','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','COD','COMPLETED',170000,30000,200000,NULL,1790597160000,1790793978994);
INSERT INTO "Order" VALUES(538,'SD260928-CK95','Huỳnh Thị Thảo','0513859413','171 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',289000,30000,319000,NULL,1790567640000,1790750520171);
INSERT INTO "Order" VALUES(539,'SD260929-J62B','Huỳnh Hoài Lan','0769363207','249 Đường 2/4, P. Vĩnh Phước, TP. Nha Trang, Khánh Hòa',NULL,'COD','SHIPPING',383000,30000,413000,NULL,1790676840000,1790767677740);
INSERT INTO "Order" VALUES(540,'SD260929-JV6J','Hồ Thanh Quỳnh','0994131344','245 Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','COMPLETED',210000,30000,240000,'Khách quen, tặng kèm sỏi trang trí',1790671920000,1790982267716);
INSERT INTO "Order" VALUES(541,'SD260930-5WKT','Huỳnh Thị Thảo','0513859413','171 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','SHIPPING',688000,0,688000,NULL,1790733840000,1790790990386);
INSERT INTO "Order" VALUES(542,'SD260930-AD8E','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',45000,30000,75000,NULL,1790777400000,1791030961856);
INSERT INTO "Order" VALUES(543,'SD261001-K39Z','Vũ Phương Vy','0720715466','176 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Gọi trước khi giao nhé shop','COD','CANCELLED',155000,30000,185000,'Không liên lạc được khách 3 lần',1790858940000,1790952558978);
INSERT INTO "Order" VALUES(544,'SD261001-HNHD','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','COMPLETED',384000,30000,414000,NULL,1790842680000,1791037403530);
INSERT INTO "Order" VALUES(545,'SD261002-EYA3','Lý Nhật Nam','0804167879','109 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','SHIPPING',55000,30000,85000,NULL,1790949420000,1790987624287);
INSERT INTO "Order" VALUES(546,'SD261002-X6CS','Vũ Phương Vy','0720715466','176 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh',NULL,'COD','SHIPPING',277000,30000,307000,NULL,1790915280000,1790977647346);
INSERT INTO "Order" VALUES(547,'SD261002-QWZ5','Phạm Minh My','0545148330','41 Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','SHIPPING',619000,0,619000,NULL,1790934540000,1791017414521);
INSERT INTO "Order" VALUES(548,'SD261003-MQVR','Vũ Ngọc Lan','0999343260','131 Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh',NULL,'BANK_TRANSFER','NEW',434000,30000,464000,NULL,1791000180000,1791000180000);
INSERT INTO "Order" VALUES(549,'SD261003-T2BN','Võ Khánh Vy','0754232764','25 KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','NEW',75000,30000,105000,NULL,1791015660000,1791015660000);
INSERT INTO "Order" VALUES(550,'SD261003-WYWH','Vũ Phương Vy','0720715466','176 Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh','Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!','BANK_TRANSFER','CONFIRMED',637000,0,637000,NULL,1791021240000,1791037403530);
INSERT INTO "Order" VALUES(551,'SD261003-WCVG','Lý Tuấn Huy','0369704313','97 Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh',NULL,'COD','CONFIRMED',340000,30000,370000,'Khách quen, tặng kèm sỏi trang trí',1791003720000,1791037403530);
INSERT INTO "Order" VALUES(552,'SD261003-SYBW','Trần Thị Thanh Hương','0988910189','Linh Đông Thủ đức',NULL,'COD','COMPLETED',1214000,0,1214000,NULL,1791040809953,1791040940560);
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "OrderItem" VALUES(746,402,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(747,402,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,3);
INSERT INTO "OrderItem" VALUES(748,403,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(749,404,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(750,404,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(751,405,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(752,406,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(753,406,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(754,406,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(755,407,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(756,408,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(757,408,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(758,409,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(759,409,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(760,409,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,1);
INSERT INTO "OrderItem" VALUES(761,409,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(762,410,236,'Sen đá Kim Cương Truncata','/uploads/seed/haworthia-4.webp',150000,2);
INSERT INTO "OrderItem" VALUES(763,411,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(764,411,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,1);
INSERT INTO "OrderItem" VALUES(765,411,249,'Xương Rồng Tuyết Hoa Trắng','/uploads/seed/cactus-5.webp',50000,1);
INSERT INTO "OrderItem" VALUES(766,412,231,'Sen đá Nâu','/uploads/seed/graptopetalum-4.webp',35000,1);
INSERT INTO "OrderItem" VALUES(767,412,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(768,412,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(769,413,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,2);
INSERT INTO "OrderItem" VALUES(770,413,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,2);
INSERT INTO "OrderItem" VALUES(771,413,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(772,414,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(773,414,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(774,415,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(775,415,249,'Xương Rồng Tuyết Hoa Trắng','/uploads/seed/cactus-5.webp',50000,1);
INSERT INTO "OrderItem" VALUES(776,415,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(777,416,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,4);
INSERT INTO "OrderItem" VALUES(778,417,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,2);
INSERT INTO "OrderItem" VALUES(779,418,230,'Sen đá Bắp Cải','/uploads/seed/echeveria-12.webp',50000,2);
INSERT INTO "OrderItem" VALUES(780,418,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(781,418,240,'Chuỗi Ngọc Dây Dài 40cm','/uploads/seed/string-2.webp',180000,2);
INSERT INTO "OrderItem" VALUES(782,419,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(783,420,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(784,421,249,'Xương Rồng Tuyết Hoa Trắng','/uploads/seed/cactus-5.webp',50000,1);
INSERT INTO "OrderItem" VALUES(785,422,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(786,422,237,'Sen đá Kim Cương Xanh Mini','/uploads/seed/haworthia-1.webp',55000,1);
INSERT INTO "OrderItem" VALUES(787,423,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(788,423,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(789,424,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,2);
INSERT INTO "OrderItem" VALUES(790,424,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(791,424,240,'Chuỗi Ngọc Dây Dài 40cm','/uploads/seed/string-2.webp',180000,1);
INSERT INTO "OrderItem" VALUES(792,424,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(793,425,239,'Sen đá Đuôi Lừa','/uploads/seed/string-4.webp',95000,1);
INSERT INTO "OrderItem" VALUES(794,425,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(795,425,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(796,425,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,1);
INSERT INTO "OrderItem" VALUES(797,426,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(798,426,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(799,427,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,3);
INSERT INTO "OrderItem" VALUES(800,427,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(801,428,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,2);
INSERT INTO "OrderItem" VALUES(802,428,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,2);
INSERT INTO "OrderItem" VALUES(803,428,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(804,429,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,2);
INSERT INTO "OrderItem" VALUES(805,429,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(806,430,252,'Tiểu Cảnh Sa Mạc Mini','/uploads/seed/terrarium-3.webp',250000,1);
INSERT INTO "OrderItem" VALUES(807,430,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(808,431,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,1);
INSERT INTO "OrderItem" VALUES(809,431,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(810,432,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(811,432,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(812,433,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(813,434,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(814,434,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,3);
INSERT INTO "OrderItem" VALUES(815,435,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(816,435,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,2);
INSERT INTO "OrderItem" VALUES(817,436,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,2);
INSERT INTO "OrderItem" VALUES(818,436,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,2);
INSERT INTO "OrderItem" VALUES(819,437,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(820,438,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(821,439,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,2);
INSERT INTO "OrderItem" VALUES(822,440,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(823,440,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(824,441,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(825,442,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(826,443,251,'Tiểu Cảnh Chuông Thủy Tinh','/uploads/seed/terrarium-2.webp',280000,1);
INSERT INTO "OrderItem" VALUES(827,444,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(828,445,251,'Tiểu Cảnh Chuông Thủy Tinh','/uploads/seed/terrarium-2.webp',280000,1);
INSERT INTO "OrderItem" VALUES(829,446,243,'Sen đá Thạch Bích Đỏ','/uploads/seed/redEdge-6.webp',55000,3);
INSERT INTO "OrderItem" VALUES(830,447,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(831,447,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,1);
INSERT INTO "OrderItem" VALUES(832,448,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(833,448,243,'Sen đá Thạch Bích Đỏ','/uploads/seed/redEdge-6.webp',55000,2);
INSERT INTO "OrderItem" VALUES(834,448,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,2);
INSERT INTO "OrderItem" VALUES(835,449,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(836,449,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(837,450,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(838,451,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(839,452,252,'Tiểu Cảnh Sa Mạc Mini','/uploads/seed/terrarium-3.webp',250000,1);
INSERT INTO "OrderItem" VALUES(840,453,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(841,454,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(842,455,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(843,456,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,4);
INSERT INTO "OrderItem" VALUES(844,456,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,1);
INSERT INTO "OrderItem" VALUES(845,457,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(846,458,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(847,458,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(848,459,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(849,459,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,1);
INSERT INTO "OrderItem" VALUES(850,460,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(851,460,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(852,461,230,'Sen đá Bắp Cải','/uploads/seed/echeveria-12.webp',50000,1);
INSERT INTO "OrderItem" VALUES(853,461,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(854,462,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(855,463,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(856,464,251,'Tiểu Cảnh Chuông Thủy Tinh','/uploads/seed/terrarium-2.webp',280000,2);
INSERT INTO "OrderItem" VALUES(857,465,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,1);
INSERT INTO "OrderItem" VALUES(858,465,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(859,466,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(860,467,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(861,467,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(862,468,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(863,468,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(864,469,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(865,470,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(866,471,231,'Sen đá Nâu','/uploads/seed/graptopetalum-4.webp',35000,1);
INSERT INTO "OrderItem" VALUES(867,472,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(868,473,252,'Tiểu Cảnh Sa Mạc Mini','/uploads/seed/terrarium-3.webp',250000,1);
INSERT INTO "OrderItem" VALUES(869,473,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(870,474,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(871,475,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(872,475,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(873,476,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(874,476,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(875,476,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(876,477,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(877,477,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(878,478,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(879,478,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,2);
INSERT INTO "OrderItem" VALUES(880,479,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(881,480,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(882,481,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,3);
INSERT INTO "OrderItem" VALUES(883,482,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(884,482,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(885,483,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(886,484,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(887,485,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(888,485,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(889,485,255,'Kệ Gỗ Trưng Bày 3 Tầng','/uploads/seed/pot-4.webp',320000,1);
INSERT INTO "OrderItem" VALUES(890,486,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(891,487,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(892,488,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(893,488,243,'Sen đá Thạch Bích Đỏ','/uploads/seed/redEdge-6.webp',55000,2);
INSERT INTO "OrderItem" VALUES(894,489,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,2);
INSERT INTO "OrderItem" VALUES(895,489,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(896,490,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,3);
INSERT INTO "OrderItem" VALUES(897,490,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(898,491,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(899,491,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(900,492,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,3);
INSERT INTO "OrderItem" VALUES(901,493,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(902,493,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(903,493,230,'Sen đá Bắp Cải','/uploads/seed/echeveria-12.webp',50000,2);
INSERT INTO "OrderItem" VALUES(904,494,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(905,494,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(906,494,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,2);
INSERT INTO "OrderItem" VALUES(907,494,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(908,495,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(909,496,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,2);
INSERT INTO "OrderItem" VALUES(910,496,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,2);
INSERT INTO "OrderItem" VALUES(911,497,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,2);
INSERT INTO "OrderItem" VALUES(912,498,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(913,499,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,1);
INSERT INTO "OrderItem" VALUES(914,500,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(915,500,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(916,500,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(917,500,231,'Sen đá Nâu','/uploads/seed/graptopetalum-4.webp',35000,2);
INSERT INTO "OrderItem" VALUES(918,501,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,2);
INSERT INTO "OrderItem" VALUES(919,502,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(920,503,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(921,503,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(922,503,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(923,504,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(924,504,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(925,504,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(926,505,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(927,505,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(928,505,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(929,506,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(930,507,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,2);
INSERT INTO "OrderItem" VALUES(931,507,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(932,508,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,2);
INSERT INTO "OrderItem" VALUES(933,508,256,'Đá Perlite Trộn Đất 1 Lít','/uploads/seed/soil-1.webp',25000,1);
INSERT INTO "OrderItem" VALUES(934,509,239,'Sen đá Đuôi Lừa','/uploads/seed/string-4.webp',95000,1);
INSERT INTO "OrderItem" VALUES(935,510,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(936,510,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,3);
INSERT INTO "OrderItem" VALUES(937,511,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,2);
INSERT INTO "OrderItem" VALUES(938,512,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,2);
INSERT INTO "OrderItem" VALUES(939,512,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(940,513,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(941,513,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(942,514,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(943,514,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(944,515,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(945,516,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(946,517,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(947,517,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(948,518,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(949,518,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(950,518,243,'Sen đá Thạch Bích Đỏ','/uploads/seed/redEdge-6.webp',55000,2);
INSERT INTO "OrderItem" VALUES(951,518,253,'Chậu Sứ Trắng Tròn 10cm','/uploads/seed/pot-2.webp',45000,1);
INSERT INTO "OrderItem" VALUES(952,519,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,2);
INSERT INTO "OrderItem" VALUES(953,519,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(954,519,236,'Sen đá Kim Cương Truncata','/uploads/seed/haworthia-4.webp',150000,1);
INSERT INTO "OrderItem" VALUES(955,520,251,'Tiểu Cảnh Chuông Thủy Tinh','/uploads/seed/terrarium-2.webp',280000,1);
INSERT INTO "OrderItem" VALUES(956,520,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(957,520,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(958,521,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,2);
INSERT INTO "OrderItem" VALUES(959,522,256,'Đá Perlite Trộn Đất 1 Lít','/uploads/seed/soil-1.webp',25000,2);
INSERT INTO "OrderItem" VALUES(960,522,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,3);
INSERT INTO "OrderItem" VALUES(961,522,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(962,522,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,1);
INSERT INTO "OrderItem" VALUES(963,523,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(964,523,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(965,524,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,2);
INSERT INTO "OrderItem" VALUES(966,524,252,'Tiểu Cảnh Sa Mạc Mini','/uploads/seed/terrarium-3.webp',250000,3);
INSERT INTO "OrderItem" VALUES(967,525,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(968,525,232,'Sen đá Ngọc Bích','/uploads/seed/graptopetalum-1.webp',35000,1);
INSERT INTO "OrderItem" VALUES(969,526,230,'Sen đá Bắp Cải','/uploads/seed/echeveria-12.webp',50000,2);
INSERT INTO "OrderItem" VALUES(970,526,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(971,527,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(972,527,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,1);
INSERT INTO "OrderItem" VALUES(973,528,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(974,528,252,'Tiểu Cảnh Sa Mạc Mini','/uploads/seed/terrarium-3.webp',250000,1);
INSERT INTO "OrderItem" VALUES(975,528,237,'Sen đá Kim Cương Xanh Mini','/uploads/seed/haworthia-1.webp',55000,1);
INSERT INTO "OrderItem" VALUES(976,528,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(977,529,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,3);
INSERT INTO "OrderItem" VALUES(978,529,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(979,530,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,2);
INSERT INTO "OrderItem" VALUES(980,530,247,'Xương Rồng Bánh Sinh Nhật','/uploads/seed/cactus-4.webp',65000,1);
INSERT INTO "OrderItem" VALUES(981,530,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(982,531,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,3);
INSERT INTO "OrderItem" VALUES(983,532,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,1);
INSERT INTO "OrderItem" VALUES(984,533,257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','/uploads/seed/soil-2.webp',39000,2);
INSERT INTO "OrderItem" VALUES(985,534,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(986,535,244,'Sen đá Sedum Vàng Cam','/uploads/seed/redEdge-2.webp',40000,2);
INSERT INTO "OrderItem" VALUES(987,535,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(988,536,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(989,537,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(990,538,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(991,538,239,'Sen đá Đuôi Lừa','/uploads/seed/string-4.webp',95000,2);
INSERT INTO "OrderItem" VALUES(992,539,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(993,539,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(994,539,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(995,540,249,'Xương Rồng Tuyết Hoa Trắng','/uploads/seed/cactus-5.webp',50000,2);
INSERT INTO "OrderItem" VALUES(996,540,237,'Sen đá Kim Cương Xanh Mini','/uploads/seed/haworthia-1.webp',55000,2);
INSERT INTO "OrderItem" VALUES(997,541,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(998,541,235,'Sen đá Móng Rồng','/uploads/seed/pot-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(999,542,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(1000,543,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,1);
INSERT INTO "OrderItem" VALUES(1001,543,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,2);
INSERT INTO "OrderItem" VALUES(1002,544,238,'Chuỗi Ngọc Bi','/uploads/seed/string-3.webp',99000,1);
INSERT INTO "OrderItem" VALUES(1003,544,258,'Đá Bọt Pumice 1kg','/uploads/seed/soil-3.webp',35000,3);
INSERT INTO "OrderItem" VALUES(1004,544,240,'Chuỗi Ngọc Dây Dài 40cm','/uploads/seed/string-2.webp',180000,1);
INSERT INTO "OrderItem" VALUES(1005,545,242,'Sen đá Ruby','/uploads/seed/echeveria-2.webp',55000,1);
INSERT INTO "OrderItem" VALUES(1006,546,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,1);
INSERT INTO "OrderItem" VALUES(1007,546,254,'Chậu Tượng Em Bé Gỗ','/uploads/seed/pot-3.webp',85000,2);
INSERT INTO "OrderItem" VALUES(1008,546,233,'Sen đá Hồng Phấn','/uploads/seed/echeveria-10.webp',52000,1);
INSERT INTO "OrderItem" VALUES(1009,547,255,'Kệ Gỗ Trưng Bày 3 Tầng','/uploads/seed/pot-4.webp',320000,1);
INSERT INTO "OrderItem" VALUES(1010,547,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(1011,548,228,'Sen đá Liên Đài','/uploads/seed/echeveria-3.webp',45000,3);
INSERT INTO "OrderItem" VALUES(1012,548,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
INSERT INTO "OrderItem" VALUES(1013,549,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(1014,550,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,2);
INSERT INTO "OrderItem" VALUES(1015,550,248,'Xương Rồng Trứng Chim','/uploads/seed/cactus-2.webp',39000,1);
INSERT INTO "OrderItem" VALUES(1016,551,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,1);
INSERT INTO "OrderItem" VALUES(1017,551,246,'Xương Rồng Mammillaria Hoa Hồng','/uploads/seed/cactus-7.webp',55000,4);
INSERT INTO "OrderItem" VALUES(1018,551,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,1);
INSERT INTO "OrderItem" VALUES(1019,552,227,'Sen đá Phật Bà','/uploads/seed/echeveria-5.webp',45000,2);
INSERT INTO "OrderItem" VALUES(1020,552,229,'Sen đá Lola','/uploads/seed/echeveria-11.webp',65000,1);
INSERT INTO "OrderItem" VALUES(1021,552,234,'Sen đá Kim Cương','/uploads/seed/haworthia-3.webp',85000,1);
INSERT INTO "OrderItem" VALUES(1022,552,241,'Sen đá Viền Đỏ Agavoides','/uploads/seed/redEdge-3.webp',75000,9);
INSERT INTO "OrderItem" VALUES(1023,552,250,'Tiểu Cảnh Terrarium Bình Cầu','/uploads/seed/terrarium-1.webp',299000,1);
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Post" VALUES(51,'Hướng dẫn chăm sóc sen đá cho người mới bắt đầu','huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau','5 nguyên tắc vàng giúp sen đá của bạn luôn căng mọng, lên màu đẹp mà không tốn nhiều công sức.','<p>Sen đá nổi tiếng là loại cây "dễ sống", nhưng không ít bạn vẫn gặp cảnh cây bị úng, vươn dài hoặc rụng lá. Dưới đây là 5 nguyên tắc cơ bản giúp bạn chăm sen đá thành công ngay từ chậu đầu tiên.</p>
<h2>1. Ánh sáng là quan trọng nhất</h2>
<p>Sen đá cần ít nhất 4 giờ nắng mỗi ngày. Nắng sáng là lý tưởng nhất. Nếu cây bị <strong>vươn dài, lá thưa, màu nhạt</strong> thì đó là dấu hiệu thiếu sáng.</p>
<h2>2. Tưới ít mà đẫm</h2>
<p>Chỉ tưới khi đất đã khô hoàn toàn. Khi tưới thì tưới đẫm đến khi nước chảy ra lỗ thoát nước. Tránh tưới lắt nhắt mỗi ngày.</p>
<h2>3. Đất phải thoát nước tốt</h2>
<p>Không dùng đất thịt nguyên chất. Hãy trộn thêm perlite, đá bọt hoặc trấu hun để đất tơi xốp.</p>
<h2>4. Chậu có lỗ thoát nước</h2>
<p>Đây là điều bắt buộc. Chậu không có lỗ sẽ đọng nước dưới đáy và gây thối rễ.</p>
<h2>5. Thông gió</h2>
<p>Đặt cây nơi thoáng gió, đặc biệt vào mùa mưa, để hạn chế nấm bệnh.</p>
<blockquote><p>Mẹo nhỏ: Hãy "bỏ quên" sen đá một chút – chăm quá kỹ mới là nguyên nhân hàng đầu khiến cây chết!</p></blockquote>','/uploads/seed/echeveria-6.webp','PUBLISHED',1790845642918,NULL,NULL,1790845642918,1791018443078);
INSERT INTO "Post" VALUES(52,'Vì sao sen đá bị úng nước và cách cứu cây','vi-sao-sen-da-bi-ung-nuoc-va-cach-cuu-cay','Nhận biết sớm dấu hiệu úng rễ và các bước xử lý để cứu chậu sen đá yêu quý.','<p>Úng nước là "sát thủ" số một của sen đá, đặc biệt vào mùa mưa. Tin vui là nếu phát hiện sớm, bạn hoàn toàn có thể cứu cây.</p>
<h2>Dấu hiệu nhận biết</h2>
<ul><li>Lá dưới chuyển vàng trong, mềm nhũn.</li><li>Thân gần gốc chuyển nâu đen.</li><li>Lá rụng hàng loạt khi chạm nhẹ.</li></ul>
<h2>Các bước cứu cây</h2>
<ol><li>Nhấc cây khỏi chậu, rũ sạch đất cũ.</li><li>Cắt bỏ toàn bộ rễ và phần thân bị thối đến khi thấy mô xanh khỏe.</li><li>Để vết cắt khô 3–5 ngày ở nơi thoáng mát.</li><li>Trồng lại vào đất khô, thoát nước tốt. Chờ 5–7 ngày mới tưới lần đầu.</li></ol>
<p>Nếu thân đã thối quá nhiều, hãy tận dụng những chiếc lá còn khỏe để nhân giống cây mới.</p>','/uploads/seed/echeveria-11.webp','PUBLISHED',1790500042918,NULL,NULL,1790500042918,1791018443082);
INSERT INTO "Post" VALUES(53,'Bí quyết giúp sen đá lên màu rực rỡ','bi-quyet-giup-sen-da-len-mau-ruc-ro','Tại sao sen đá ở vườn lại đỏ rực còn mang về nhà lại xanh lè? Đây là câu trả lời.','<p>Nhiều bạn thắc mắc vì sao chậu sen đá viền đỏ mua về sau vài tuần lại chuyển xanh. Màu sắc của sen đá thực chất là phản ứng của cây với <strong>môi trường "căng thẳng nhẹ"</strong>.</p>
<h2>3 yếu tố giúp cây lên màu</h2>
<h3>Nắng nhiều</h3>
<p>Ánh nắng mạnh kích thích cây sản sinh sắc tố anthocyanin (đỏ, tím) để tự bảo vệ.</p>
<h3>Chênh lệch nhiệt độ ngày – đêm</h3>
<p>Đây là lý do sen đá ở Đà Lạt luôn đẹp hơn. Ở thành phố nóng, bạn có thể tận dụng mùa khô.</p>
<h3>Hạn chế nước và phân đạm</h3>
<p>Tưới ít đi một chút và không bón phân đạm nhiều sẽ giúp cây giữ màu tốt hơn.</p>
<p>Lưu ý: tăng nắng từ từ để tránh cháy lá.</p>','/uploads/seed/redEdge-2.webp','PUBLISHED',1790068042918,NULL,NULL,1790068042918,1791018443084);
INSERT INTO "Post" VALUES(54,'Cách nhân giống sen đá bằng lá cực đơn giản','cach-nhan-giong-sen-da-bang-la-cuc-don-gian','Từ một chiếc lá nhỏ, bạn có thể có cả chậu sen đá mới chỉ sau vài tháng.','<p>Nhân giống bằng lá là cách thú vị và tiết kiệm nhất để mở rộng bộ sưu tập sen đá.</p>
<h2>Chuẩn bị</h2>
<ul><li>Lá sen đá khỏe, còn nguyên phần cuống.</li><li>Khay đất khô, thoát nước tốt.</li></ul>
<h2>Các bước thực hiện</h2>
<ol><li>Nhẹ nhàng vặn lá khỏi thân, đảm bảo lấy trọn phần cuống.</li><li>Để lá ở nơi thoáng mát 2–3 ngày cho vết cắt khô.</li><li>Đặt lá nằm trên mặt đất, không cần vùi.</li><li>Phun sương nhẹ khi thấy rễ nhỏ xuất hiện (sau 2–3 tuần).</li></ol>
<p>Sau khoảng 1–2 tháng, cây con sẽ mọc ra từ cuống lá. Khi lá mẹ héo hẳn là lúc cây con đã tự lập.</p>','/uploads/seed/graptopetalum-5.webp','PUBLISHED',1789549642918,NULL,NULL,1789549642918,1791018443087);
INSERT INTO "Post" VALUES(55,'Gợi ý bày trí sen đá cho bàn làm việc','goi-y-bay-tri-sen-da-cho-ban-lam-viec','Biến góc làm việc thành khu vườn mini xanh mát với vài chậu sen đá nhỏ.','<p>Một vài chậu cây xanh trên bàn làm việc giúp giảm căng thẳng và tăng sự tập trung. Sen đá là lựa chọn lý tưởng vì nhỏ gọn và ít cần chăm sóc.</p>
<h2>Chọn cây phù hợp</h2>
<p>Văn phòng thường thiếu nắng, hãy ưu tiên các giống chịu bóng như <strong>sen đá Móng Rồng, Kim Cương</strong>.</p>
<h2>Phối chậu đồng bộ</h2>
<p>Chọn chậu cùng chất liệu (sứ trắng, đất nung) với kích thước khác nhau để tạo nhịp điệu.</p>
<h2>Đừng quên "tắm nắng"</h2>
<p>Mỗi tuần mang cây ra cửa sổ phơi nắng 1–2 ngày để cây giữ dáng đẹp.</p>','/uploads/seed/pot-2.webp','PUBLISHED',1789031242918,NULL,NULL,1789031242918,1791018443089);
INSERT INTO "Post" VALUES(56,'Terrarium – khu rừng nhỏ trong bình thủy tinh','terrarium-khu-rung-nho-trong-binh-thuy-tinh','Tìm hiểu về terrarium và cách giữ cho tiểu cảnh luôn tươi đẹp.','<p>Terrarium là hệ sinh thái thu nhỏ được tạo trong bình thủy tinh, vừa là cây cảnh vừa là món đồ trang trí độc đáo.</p>
<h2>Terrarium mở và kín</h2>
<p>Với sen đá và xương rồng, hãy dùng <strong>terrarium mở</strong> (miệng bình rộng) để không khí lưu thông, tránh đọng ẩm.</p>
<h2>Cấu tạo các lớp</h2>
<ol><li>Lớp sỏi thoát nước dưới đáy.</li><li>Lớp than hoạt tính chống mùi, nấm.</li><li>Lớp đất trồng.</li><li>Lớp trang trí: cát màu, sỏi, rêu, tiểu cảnh.</li></ol>
<p>Chăm sóc terrarium rất đơn giản: phun sương nhẹ 10–14 ngày/lần và để nơi có ánh sáng tán xạ.</p>','/uploads/seed/terrarium-3.webp','PUBLISHED',1788426442918,NULL,NULL,1788426442918,1791018443092);
INSERT INTO "Post" VALUES(57,'Top 10 giống sen đá dễ trồng nhất (bản nháp)','top-10-giong-sen-da-de-trong-nhat','Bài viết đang soạn.','<p>Nội dung đang được cập nhật...</p>',NULL,'DRAFT',NULL,NULL,NULL,1791018443095,1791018443095);
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "searchText" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "finalPrice" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "shortDesc" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "careGuide" TEXT NOT NULL DEFAULT '',
    "categoryId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "Product" VALUES(227,'Sen đá Phật Bà','sen-da-phat-ba','SD001','sen da phat ba sd001',45000,NULL,45000,37,'Hoa thị xanh phấn, dáng tròn đều như đóa sen.','<p>Sen đá Phật Bà (Echeveria elegans) là giống kinh điển với lớp phấn trắng mờ phủ trên lá xanh ngọc, xếp tầng đều đặn như một bông sen nở.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,1,1,0,0,NULL,NULL,1786871242918,1791040809941);
INSERT INTO "Product" VALUES(228,'Sen đá Liên Đài','sen-da-lien-dai','SD002','sen da lien dai sd002',55000,45000,45000,25,'Lá xanh mướt xếp tầng, sinh trưởng khỏe.','<p>Sen đá Liên Đài có lá dày, mọng nước, xếp tầng xoắn ốc rất đều. Cây khỏe, ít sâu bệnh – lựa chọn tuyệt vời cho người mới bắt đầu.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,1,0,0,1,NULL,NULL,1787000842918,1791018442929);
INSERT INTO "Product" VALUES(229,'Sen đá Lola','sen-da-lola','SD003','sen da lola sd003',65000,NULL,65000,17,'Sắc tím hồng pastel dịu dàng.','<p>Echeveria ''Lola'' nổi tiếng với tông màu hồng tím pastel, lá dày ngắn ôm sát tạo dáng bông hồng nhỏ. Khi đủ nắng màu càng lên đẹp.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,0,1,1,2,NULL,NULL,1790629642918,1791040987202);
INSERT INTO "Product" VALUES(230,'Sen đá Bắp Cải','sen-da-bap-cai','SD004','sen da bap cai sd004',50000,NULL,50000,30,'Lá tròn to xếp chồng như bắp cải tí hon.','<p>Sen đá Bắp Cải có lá tròn, mép hơi gợn, xếp chồng khít vào nhau tạo hình bắp cải nhỏ ngộ nghĩnh – món quà dễ thương cho bạn bè.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,0,0,0,3,NULL,NULL,1787260042918,1791018442935);
INSERT INTO "Product" VALUES(231,'Sen đá Nâu','sen-da-nau','SD005','sen da nau sd005',35000,NULL,35000,50,'Tông nâu đồng ấm áp, cực dễ chăm.','<p>Sen đá Nâu (Graptopetalum ''Bronze'') có màu nâu đồng óng ánh, càng phơi nắng càng đậm màu. Đây là một trong những giống dễ sống nhất.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,0,0,1,4,NULL,NULL,1790655562918,1791018442939);
INSERT INTO "Product" VALUES(232,'Sen đá Ngọc Bích','sen-da-ngoc-bich','SD006','sen da ngoc bich sd006',35000,NULL,35000,45,'Lá xám xanh phủ phấn, nhân giống dễ.','<p>Graptopetalum paraguayense – còn gọi là sen đá Ngọc Bích hay Bóng Ma – có lá xám xanh phủ phấn, dáng thả nhẹ, chỉ cần một chiếc lá là nhân giống được cây mới.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,0,0,0,5,NULL,NULL,1787519242918,1791018442946);
INSERT INTO "Product" VALUES(233,'Sen đá Hồng Phấn','sen-da-hong-phan','SD007','sen da hong phan sd007',60000,52000,52000,4,'Lá hồng phấn mập mạp, rất ăn ảnh.','<p>Sen đá Hồng Phấn (Graptoveria) là giống lai với lá mập, phủ phấn hồng nhạt. Cây lên màu đẹp nhất vào mùa khô khi có chênh lệch nhiệt độ.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',58,1,1,0,1,6,NULL,NULL,1790681482918,1791018442950);
INSERT INTO "Product" VALUES(234,'Sen đá Kim Cương','sen-da-kim-cuong','SD008','sen da kim cuong sd008',85000,NULL,85000,19,'Đầu lá trong suốt lấp lánh như pha lê.','<p>Haworthia cooperi – sen đá Kim Cương – sở hữu những chiếc lá mọng với ''cửa sổ'' trong suốt ở đầu lá, khi có nắng xuyên qua sẽ lấp lánh như viên kim cương.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',59,1,1,1,0,7,NULL,NULL,1787778442918,1791040809948);
INSERT INTO "Product" VALUES(235,'Sen đá Móng Rồng','sen-da-mong-rong','SD009','sen da mong rong sd009',45000,NULL,45000,35,'Lá nhọn sọc trắng mạnh mẽ, chịu bóng tốt.','<p>Sen đá Móng Rồng (Haworthia attenuata) có lá nhọn, mặt dưới điểm những sọc chấm trắng nổi. Cây chịu bóng tốt, rất hợp để trong văn phòng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',59,1,0,1,0,8,NULL,NULL,1787908042918,1791018442961);
INSERT INTO "Product" VALUES(236,'Sen đá Kim Cương Truncata','sen-da-kim-cuong-truncata','SD010','sen da kim cuong truncata sd010',150000,NULL,150000,6,'Lá cắt ngang độc đáo, hàng sưu tầm.','<p>Haworthia truncata có những chiếc lá như bị cắt ngang, xếp thành hai hàng đối xứng. Đây là giống sinh trưởng chậm, được dân chơi sưu tầm rất ưa chuộng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',59,1,0,0,1,9,NULL,NULL,1790720362918,1791018442967);
INSERT INTO "Product" VALUES(237,'Sen đá Kim Cương Xanh Mini','sen-da-kim-cuong-xanh-mini','SD011','sen da kim cuong xanh mini sd011',55000,NULL,55000,0,'Bụi kim cương xanh mọc cụm dày.','<p>Phiên bản mọc cụm của dòng Haworthia, các đầu lá trong suốt chen chúc tạo thành một khối tròn xanh mướt rất bắt mắt.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',59,1,0,0,0,10,NULL,NULL,1788167242918,1791018442970);
INSERT INTO "Product" VALUES(238,'Chuỗi Ngọc Bi','chuoi-ngoc-bi','SD012','chuoi ngoc bi sd012',120000,99000,99000,15,'Những hạt ngọc tròn xanh rủ dài mềm mại.','<p>Chuỗi Ngọc Bi (Senecio rowleyanus) với những chiếc lá tròn như hạt đậu xanh nối thành chuỗi dài, cực đẹp khi trồng chậu treo ban công.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',60,1,1,1,0,11,NULL,NULL,1788296842918,1791018442974);
INSERT INTO "Product" VALUES(239,'Sen đá Đuôi Lừa','sen-da-duoi-lua','SD013','sen da duoi lua sd013',95000,NULL,95000,12,'Lá mập xếp kín thành chuỗi như đuôi lừa.','<p>Sedum morganianum – Đuôi Lừa – có lá xanh phấn mập mạp xếp sát nhau trên cành dài, tạo thành những ''cái đuôi'' rủ xuống rất ngộ nghĩnh.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',60,1,0,0,0,12,NULL,NULL,1788426442918,1791018442978);
INSERT INTO "Product" VALUES(240,'Chuỗi Ngọc Dây Dài 40cm','chuoi-ngoc-day-dai-40cm','SD014','chuoi ngoc day dai 40cm sd014',180000,NULL,180000,5,'Chậu treo dây dài sẵn 40cm, lên dáng ngay.','<p>Chậu Chuỗi Ngọc đã được chăm 8 tháng với dây dài khoảng 40cm, treo lên là có ngay một góc xanh rủ mềm mại cho ban công.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',60,1,0,0,1,13,NULL,NULL,1790772202918,1791018442981);
INSERT INTO "Product" VALUES(241,'Sen đá Viền Đỏ Agavoides','sen-da-vien-do-agavoides','SD015','sen da vien do agavoides sd015',75000,NULL,75000,13,'Lá nhọn xanh, viền đỏ rực khi đủ nắng.','<p>Echeveria agavoides có lá dày nhọn như lá thùa, mép lá chuyển đỏ rực khi được phơi nắng – điểm nhấn cực kỳ nổi bật cho bộ sưu tập.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',61,1,1,1,0,14,NULL,NULL,1788685642918,1791040809949);
INSERT INTO "Product" VALUES(242,'Sen đá Ruby','sen-da-ruby','SD016','sen da ruby sd016',65000,55000,55000,3,'Đầu lá đỏ như hồng ngọc.','<p>Sen đá Ruby có lá xanh ngọc với chóp lá đỏ đậm như viên hồng ngọc. Cây nhỏ gọn, rất hợp làm quà tặng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',61,1,0,0,1,15,NULL,NULL,1790798122918,1791018442989);
INSERT INTO "Product" VALUES(243,'Sen đá Thạch Bích Đỏ','sen-da-thach-bich-do','SD017','sen da thach bich do sd017',55000,NULL,55000,28,'Lá tam giác xếp tháp, đỏ đậm mùa nắng.','<p>Crassula capitella ''Campfire'' – Thạch Bích Đỏ – có lá hình tam giác xếp chồng như ngọn tháp, chuyển đỏ cam rực rỡ khi trời nắng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',61,1,0,0,0,16,NULL,NULL,1788944842918,1791018442994);
INSERT INTO "Product" VALUES(244,'Sen đá Sedum Vàng Cam','sen-da-sedum-vang-cam','SD018','sen da sedum vang cam sd018',40000,NULL,40000,38,'Lá vàng chanh viền cam tươi tắn.','<p>Sedum adolphi có lá vàng chanh, mép chuyển cam khi đủ nắng, mọc thành bụi nhỏ tươi tắn. Rất dễ nhân giống bằng cành.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',61,1,0,0,0,17,NULL,NULL,1789074442918,1791018442998);
INSERT INTO "Product" VALUES(245,'Sen đá Romeo Lửa Đỏ','sen-da-romeo-lua-do','SD019','sen da romeo lua do sd019',180000,NULL,180000,8,'Toàn thân đỏ rượu vang, hàng hiếm.','<p>Echeveria ''Romeo'' có toàn bộ lá màu đỏ rượu vang khi trưởng thành – một trong những giống sen đá đỏ đẹp nhất. Số lượng có hạn.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>',61,0,0,0,0,18,NULL,NULL,1789204042918,1791018443002);
INSERT INTO "Product" VALUES(246,'Xương Rồng Mammillaria Hoa Hồng','xuong-rong-mammillaria-hoa-hong','SD020','xuong rong mammillaria hoa hong sd020',55000,NULL,55000,26,'Ra vòng hoa hồng quanh đỉnh rất đẹp.','<p>Mammillaria là chi xương rồng nổi tiếng ra hoa thành vòng tròn quanh đỉnh. Cây nhỏ gọn, gai mềm, ra hoa quanh năm khi đủ nắng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Xương rồng ưa nắng, cần tối thiểu 6 giờ nắng/ngày. Thiếu nắng cây sẽ vươn dài, mất dáng và khó ra hoa.</p>
<h3>Tưới nước</h3>
<p>Tưới 7–10 ngày/lần khi đất đã khô hoàn toàn. Mùa mưa và mùa đông giảm hẳn lượng nước.</p>
<h3>Đất trồng</h3>
<p>Giá thể nhiều khoáng: 50% đá perlite/pumice + 30% đất + 20% phân trùn quế.</p>
<h3>Lưu ý</h3>
<ul><li>Dùng kẹp hoặc găng tay khi thay chậu để tránh gai.</li><li>Cây ra hoa tốt hơn khi có chênh lệch nhiệt độ ngày – đêm.</li></ul>',62,1,1,1,0,19,NULL,NULL,1789333642918,1791018443008);
INSERT INTO "Product" VALUES(247,'Xương Rồng Bánh Sinh Nhật','xuong-rong-banh-sinh-nhat','SD021','xuong rong banh sinh nhat sd021',65000,NULL,65000,14,'Gai trắng tuyết, hoa đỏ như nến bánh kem.','<p>Mammillaria với lớp gai trắng mịn bao phủ, mùa hoa xuất hiện những bông đỏ nhỏ xếp vòng như nến trên chiếc bánh sinh nhật.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Xương rồng ưa nắng, cần tối thiểu 6 giờ nắng/ngày. Thiếu nắng cây sẽ vươn dài, mất dáng và khó ra hoa.</p>
<h3>Tưới nước</h3>
<p>Tưới 7–10 ngày/lần khi đất đã khô hoàn toàn. Mùa mưa và mùa đông giảm hẳn lượng nước.</p>
<h3>Đất trồng</h3>
<p>Giá thể nhiều khoáng: 50% đá perlite/pumice + 30% đất + 20% phân trùn quế.</p>
<h3>Lưu ý</h3>
<ul><li>Dùng kẹp hoặc găng tay khi thay chậu để tránh gai.</li><li>Cây ra hoa tốt hơn khi có chênh lệch nhiệt độ ngày – đêm.</li></ul>',62,1,0,0,1,20,NULL,NULL,1790862922918,1791018443012);
INSERT INTO "Product" VALUES(248,'Xương Rồng Trứng Chim','xuong-rong-trung-chim','SD022','xuong rong trung chim sd022',45000,39000,39000,33,'Thân tròn gai vàng, hoa vàng kem.','<p>Xương Rồng Trứng Chim có thân tròn nhỏ phủ gai vàng nhạt, nở hoa vàng kem xinh xắn. Gần như không cần chăm sóc.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Xương rồng ưa nắng, cần tối thiểu 6 giờ nắng/ngày. Thiếu nắng cây sẽ vươn dài, mất dáng và khó ra hoa.</p>
<h3>Tưới nước</h3>
<p>Tưới 7–10 ngày/lần khi đất đã khô hoàn toàn. Mùa mưa và mùa đông giảm hẳn lượng nước.</p>
<h3>Đất trồng</h3>
<p>Giá thể nhiều khoáng: 50% đá perlite/pumice + 30% đất + 20% phân trùn quế.</p>
<h3>Lưu ý</h3>
<ul><li>Dùng kẹp hoặc găng tay khi thay chậu để tránh gai.</li><li>Cây ra hoa tốt hơn khi có chênh lệch nhiệt độ ngày – đêm.</li></ul>',62,1,0,0,0,21,NULL,NULL,1789592842918,1791018443020);
INSERT INTO "Product" VALUES(249,'Xương Rồng Tuyết Hoa Trắng','xuong-rong-tuyet-hoa-trang','SD023','xuong rong tuyet hoa trang sd023',50000,NULL,50000,2,'Hoa trắng muốt nổi bật giữa gai.','<p>Giống xương rồng gai mảnh, nở những bông hoa trắng muốt cánh dài thanh thoát, đẹp nhất khi nở rộ vào sáng sớm.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Ánh sáng</h3>
<p>Xương rồng ưa nắng, cần tối thiểu 6 giờ nắng/ngày. Thiếu nắng cây sẽ vươn dài, mất dáng và khó ra hoa.</p>
<h3>Tưới nước</h3>
<p>Tưới 7–10 ngày/lần khi đất đã khô hoàn toàn. Mùa mưa và mùa đông giảm hẳn lượng nước.</p>
<h3>Đất trồng</h3>
<p>Giá thể nhiều khoáng: 50% đá perlite/pumice + 30% đất + 20% phân trùn quế.</p>
<h3>Lưu ý</h3>
<ul><li>Dùng kẹp hoặc găng tay khi thay chậu để tránh gai.</li><li>Cây ra hoa tốt hơn khi có chênh lệch nhiệt độ ngày – đêm.</li></ul>',62,1,0,0,0,22,NULL,NULL,1789722442918,1791018443027);
INSERT INTO "Product" VALUES(250,'Tiểu Cảnh Terrarium Bình Cầu','tieu-canh-terrarium-binh-cau','SD024','tieu canh terrarium binh cau sd024',350000,299000,299000,6,'Bình cầu thủy tinh 15cm, phối 4–5 loại cây.','<p>Tiểu cảnh trong bình cầu thủy tinh đường kính 15cm, phối 4–5 loại sen đá cùng sỏi màu, rêu khô và tượng trang trí. Món quà tinh tế cho dịp đặc biệt.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Vị trí đặt</h3>
<p>Để nơi có ánh sáng tán xạ, gần cửa sổ nhưng không chiếu nắng trực tiếp vào bình thủy tinh (dễ làm nóng và hấp hơi).</p>
<h3>Tưới nước</h3>
<p>Dùng bình xịt phun nhẹ quanh gốc 10–14 ngày/lần, mỗi lần 5–10 lần xịt. Terrarium không có lỗ thoát nước nên tuyệt đối không tưới quá tay.</p>
<h3>Vệ sinh</h3>
<p>Lau thành bình bằng khăn mềm khi bị mờ. Nhặt lá khô, tỉa cây mọc quá dài để giữ bố cục.</p>',63,1,1,1,1,23,NULL,NULL,1790901802918,1791040809950);
INSERT INTO "Product" VALUES(251,'Tiểu Cảnh Chuông Thủy Tinh','tieu-canh-chuong-thuy-tinh','SD025','tieu canh chuong thuy tinh sd025',280000,NULL,280000,9,'Chuông thủy tinh đế gỗ sang trọng.','<p>Một cây sen đá nhỏ đặt trang trọng dưới chuông thủy tinh với đế gỗ tự nhiên – phong cách tối giản, rất hợp bàn làm việc.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Vị trí đặt</h3>
<p>Để nơi có ánh sáng tán xạ, gần cửa sổ nhưng không chiếu nắng trực tiếp vào bình thủy tinh (dễ làm nóng và hấp hơi).</p>
<h3>Tưới nước</h3>
<p>Dùng bình xịt phun nhẹ quanh gốc 10–14 ngày/lần, mỗi lần 5–10 lần xịt. Terrarium không có lỗ thoát nước nên tuyệt đối không tưới quá tay.</p>
<h3>Vệ sinh</h3>
<p>Lau thành bình bằng khăn mềm khi bị mờ. Nhặt lá khô, tỉa cây mọc quá dài để giữ bố cục.</p>',63,1,0,0,0,24,NULL,NULL,1789981642918,1791018443037);
INSERT INTO "Product" VALUES(252,'Tiểu Cảnh Sa Mạc Mini','tieu-canh-sa-mac-mini','SD026','tieu canh sa mac mini sd026',250000,NULL,250000,10,'Xương rồng & sen đá trên nền cát sa mạc.','<p>Tiểu cảnh lấy cảm hứng sa mạc với xương rồng, sen đá và lớp cát vàng – mang thiên nhiên hoang dã vào góc nhỏ của bạn.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Vị trí đặt</h3>
<p>Để nơi có ánh sáng tán xạ, gần cửa sổ nhưng không chiếu nắng trực tiếp vào bình thủy tinh (dễ làm nóng và hấp hơi).</p>
<h3>Tưới nước</h3>
<p>Dùng bình xịt phun nhẹ quanh gốc 10–14 ngày/lần, mỗi lần 5–10 lần xịt. Terrarium không có lỗ thoát nước nên tuyệt đối không tưới quá tay.</p>
<h3>Vệ sinh</h3>
<p>Lau thành bình bằng khăn mềm khi bị mờ. Nhặt lá khô, tỉa cây mọc quá dài để giữ bố cục.</p>',63,1,0,0,0,25,NULL,NULL,1790111242918,1791018443043);
INSERT INTO "Product" VALUES(253,'Chậu Sứ Trắng Tròn 10cm','chau-su-trang-tron-10cm','SD027','chau su trang tron 10cm sd027',45000,NULL,45000,60,'Chậu sứ men trắng, có lỗ thoát nước.','<p>Chậu sứ men trắng bóng, đường kính 10cm, có lỗ thoát nước và đĩa lót. Kiểu dáng tối giản, hợp với mọi loại sen đá.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',64,1,0,1,0,26,NULL,NULL,1790240842918,1791018443050);
INSERT INTO "Product" VALUES(254,'Chậu Tượng Em Bé Gỗ','chau-tuong-em-be-go','SD028','chau tuong em be go sd028',85000,NULL,85000,15,'Chậu hình tượng ngộ nghĩnh, cây làm ''tóc''.','<p>Chậu hình tượng em bé màu gỗ, khi trồng sen đá lên trên trông như mái tóc xanh ngộ nghĩnh. Quà tặng siêu dễ thương.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',64,1,0,0,1,27,NULL,NULL,1790953642918,1791018443056);
INSERT INTO "Product" VALUES(255,'Kệ Gỗ Trưng Bày 3 Tầng','ke-go-trung-bay-3-tang','SD029','ke go trung bay 3 tang sd029',320000,NULL,320000,4,'Kệ gỗ thông, trưng được 12–15 chậu nhỏ.','<p>Kệ gỗ thông tự nhiên 3 tầng, trưng bày được 12–15 chậu sen đá nhỏ, phù hợp ban công hoặc bậu cửa sổ.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',64,1,0,0,0,28,NULL,NULL,1790500042918,1791018443062);
INSERT INTO "Product" VALUES(256,'Đá Perlite Trộn Đất 1 Lít','da-perlite-tron-dat-1-lit','SD030','da perlite tron dat 1 lit sd030',25000,NULL,25000,80,'Tăng độ thoáng, chống úng rễ.','<p>Đá perlite trắng giúp giá thể tơi xốp, thoát nước nhanh – thành phần không thể thiếu khi trồng sen đá và xương rồng.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',65,1,0,0,0,29,NULL,NULL,1790629642918,1791018443067);
INSERT INTO "Product" VALUES(257,'Đất Trồng Sen Đá Chuyên Dụng 2kg','dat-trong-sen-da-chuyen-dung-2kg','SD031','dat trong sen da chuyen dung 2kg sd031',45000,39000,39000,55,'Phối trộn sẵn, dùng ngay không cần trộn.','<p>Giá thể phối trộn sẵn từ đất sạch, perlite, đá bọt và phân trùn quế theo tỉ lệ chuẩn cho cây mọng nước. Mở bao là trồng được ngay.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',65,1,1,0,0,30,NULL,NULL,1790759242918,1791018443070);
INSERT INTO "Product" VALUES(258,'Đá Bọt Pumice 1kg','da-bot-pumice-1kg','SD032','da bot pumice 1kg sd032',35000,NULL,35000,3,'Đá núi lửa giữ ẩm nhẹ, thoáng rễ.','<p>Đá bọt pumice có cấu trúc rỗ giúp giữ một chút ẩm mà vẫn thoáng khí cho rễ, dùng trộn đất hoặc rải mặt chậu.</p>
<h3>Thông tin sản phẩm</h3>
<ul><li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li></ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>','
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>',65,1,0,0,0,31,NULL,NULL,1790888842918,1791018443074);
CREATE TABLE "ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "ProductImage" VALUES(417,227,'/uploads/seed/echeveria-5.webp','Sen đá Phật Bà',0);
INSERT INTO "ProductImage" VALUES(418,227,'/uploads/seed/echeveria-6.webp','Sen đá Phật Bà',1);
INSERT INTO "ProductImage" VALUES(419,228,'/uploads/seed/echeveria-3.webp','Sen đá Liên Đài',0);
INSERT INTO "ProductImage" VALUES(420,228,'/uploads/seed/echeveria-4.webp','Sen đá Liên Đài',1);
INSERT INTO "ProductImage" VALUES(421,229,'/uploads/seed/echeveria-11.webp','Sen đá Lola',0);
INSERT INTO "ProductImage" VALUES(422,229,'/uploads/seed/echeveria-9.webp','Sen đá Lola',1);
INSERT INTO "ProductImage" VALUES(423,230,'/uploads/seed/echeveria-12.webp','Sen đá Bắp Cải',0);
INSERT INTO "ProductImage" VALUES(424,230,'/uploads/seed/echeveria-1.webp','Sen đá Bắp Cải',1);
INSERT INTO "ProductImage" VALUES(425,231,'/uploads/seed/graptopetalum-4.webp','Sen đá Nâu',0);
INSERT INTO "ProductImage" VALUES(426,231,'/uploads/seed/graptopetalum-2.webp','Sen đá Nâu',1);
INSERT INTO "ProductImage" VALUES(427,232,'/uploads/seed/graptopetalum-1.webp','Sen đá Ngọc Bích',0);
INSERT INTO "ProductImage" VALUES(428,232,'/uploads/seed/graptopetalum-5.webp','Sen đá Ngọc Bích',1);
INSERT INTO "ProductImage" VALUES(429,233,'/uploads/seed/echeveria-10.webp','Sen đá Hồng Phấn',0);
INSERT INTO "ProductImage" VALUES(430,233,'/uploads/seed/graptopetalum-3.webp','Sen đá Hồng Phấn',1);
INSERT INTO "ProductImage" VALUES(431,234,'/uploads/seed/haworthia-3.webp','Sen đá Kim Cương',0);
INSERT INTO "ProductImage" VALUES(432,234,'/uploads/seed/haworthia-5.webp','Sen đá Kim Cương',1);
INSERT INTO "ProductImage" VALUES(433,235,'/uploads/seed/pot-5.webp','Sen đá Móng Rồng',0);
INSERT INTO "ProductImage" VALUES(434,235,'/uploads/seed/haworthia-2.webp','Sen đá Móng Rồng',1);
INSERT INTO "ProductImage" VALUES(435,236,'/uploads/seed/haworthia-4.webp','Sen đá Kim Cương Truncata',0);
INSERT INTO "ProductImage" VALUES(436,236,'/uploads/seed/haworthia-1.webp','Sen đá Kim Cương Truncata',1);
INSERT INTO "ProductImage" VALUES(437,237,'/uploads/seed/haworthia-1.webp','Sen đá Kim Cương Xanh Mini',0);
INSERT INTO "ProductImage" VALUES(438,237,'/uploads/seed/haworthia-5.webp','Sen đá Kim Cương Xanh Mini',1);
INSERT INTO "ProductImage" VALUES(439,238,'/uploads/seed/string-3.webp','Chuỗi Ngọc Bi',0);
INSERT INTO "ProductImage" VALUES(440,238,'/uploads/seed/string-1.webp','Chuỗi Ngọc Bi',1);
INSERT INTO "ProductImage" VALUES(441,239,'/uploads/seed/string-4.webp','Sen đá Đuôi Lừa',0);
INSERT INTO "ProductImage" VALUES(442,239,'/uploads/seed/string-2.webp','Sen đá Đuôi Lừa',1);
INSERT INTO "ProductImage" VALUES(443,240,'/uploads/seed/string-2.webp','Chuỗi Ngọc Dây Dài 40cm',0);
INSERT INTO "ProductImage" VALUES(444,240,'/uploads/seed/string-1.webp','Chuỗi Ngọc Dây Dài 40cm',1);
INSERT INTO "ProductImage" VALUES(445,241,'/uploads/seed/redEdge-3.webp','Sen đá Viền Đỏ Agavoides',0);
INSERT INTO "ProductImage" VALUES(446,241,'/uploads/seed/redEdge-1.webp','Sen đá Viền Đỏ Agavoides',1);
INSERT INTO "ProductImage" VALUES(447,242,'/uploads/seed/echeveria-2.webp','Sen đá Ruby',0);
INSERT INTO "ProductImage" VALUES(448,242,'/uploads/seed/redEdge-7.webp','Sen đá Ruby',1);
INSERT INTO "ProductImage" VALUES(449,243,'/uploads/seed/redEdge-6.webp','Sen đá Thạch Bích Đỏ',0);
INSERT INTO "ProductImage" VALUES(450,243,'/uploads/seed/redEdge-5.webp','Sen đá Thạch Bích Đỏ',1);
INSERT INTO "ProductImage" VALUES(451,244,'/uploads/seed/redEdge-2.webp','Sen đá Sedum Vàng Cam',0);
INSERT INTO "ProductImage" VALUES(452,244,'/uploads/seed/redEdge-4.webp','Sen đá Sedum Vàng Cam',1);
INSERT INTO "ProductImage" VALUES(453,245,'/uploads/seed/redEdge-1.webp','Sen đá Romeo Lửa Đỏ',0);
INSERT INTO "ProductImage" VALUES(454,245,'/uploads/seed/redEdge-3.webp','Sen đá Romeo Lửa Đỏ',1);
INSERT INTO "ProductImage" VALUES(455,246,'/uploads/seed/cactus-7.webp','Xương Rồng Mammillaria Hoa Hồng',0);
INSERT INTO "ProductImage" VALUES(456,246,'/uploads/seed/cactus-8.webp','Xương Rồng Mammillaria Hoa Hồng',1);
INSERT INTO "ProductImage" VALUES(457,247,'/uploads/seed/cactus-4.webp','Xương Rồng Bánh Sinh Nhật',0);
INSERT INTO "ProductImage" VALUES(458,247,'/uploads/seed/cactus-3.webp','Xương Rồng Bánh Sinh Nhật',1);
INSERT INTO "ProductImage" VALUES(459,248,'/uploads/seed/cactus-2.webp','Xương Rồng Trứng Chim',0);
INSERT INTO "ProductImage" VALUES(460,248,'/uploads/seed/cactus-1.webp','Xương Rồng Trứng Chim',1);
INSERT INTO "ProductImage" VALUES(461,249,'/uploads/seed/cactus-5.webp','Xương Rồng Tuyết Hoa Trắng',0);
INSERT INTO "ProductImage" VALUES(462,249,'/uploads/seed/cactus-6.webp','Xương Rồng Tuyết Hoa Trắng',1);
INSERT INTO "ProductImage" VALUES(463,250,'/uploads/seed/terrarium-1.webp','Tiểu Cảnh Terrarium Bình Cầu',0);
INSERT INTO "ProductImage" VALUES(464,250,'/uploads/seed/terrarium-3.webp','Tiểu Cảnh Terrarium Bình Cầu',1);
INSERT INTO "ProductImage" VALUES(465,251,'/uploads/seed/terrarium-2.webp','Tiểu Cảnh Chuông Thủy Tinh',0);
INSERT INTO "ProductImage" VALUES(466,252,'/uploads/seed/terrarium-3.webp','Tiểu Cảnh Sa Mạc Mini',0);
INSERT INTO "ProductImage" VALUES(467,252,'/uploads/seed/terrarium-4.webp','Tiểu Cảnh Sa Mạc Mini',1);
INSERT INTO "ProductImage" VALUES(468,253,'/uploads/seed/pot-2.webp','Chậu Sứ Trắng Tròn 10cm',0);
INSERT INTO "ProductImage" VALUES(469,254,'/uploads/seed/pot-3.webp','Chậu Tượng Em Bé Gỗ',0);
INSERT INTO "ProductImage" VALUES(470,255,'/uploads/seed/pot-4.webp','Kệ Gỗ Trưng Bày 3 Tầng',0);
INSERT INTO "ProductImage" VALUES(471,255,'/uploads/seed/pot-1.webp','Kệ Gỗ Trưng Bày 3 Tầng',1);
INSERT INTO "ProductImage" VALUES(472,256,'/uploads/seed/soil-1.webp','Đá Perlite Trộn Đất 1 Lít',0);
INSERT INTO "ProductImage" VALUES(473,257,'/uploads/seed/soil-2.webp','Đất Trồng Sen Đá Chuyên Dụng 2kg',0);
INSERT INTO "ProductImage" VALUES(474,258,'/uploads/seed/soil-3.webp','Đá Bọt Pumice 1kg',0);
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "Setting" VALUES('store','{"name":"Sen Đá Xinh","slogan":"Mang thiên nhiên xanh mát vào từng góc nhỏ","logo":"/uploads/2026/10/c4555725c04d13a0.webp","phone":"0901 234 567","email":"25210281@ms.uit.edu.vn","address":"Trường Đại học Công nghệ Thông tin (UIT)","workingHours":"8:00 – 21:00, Thứ 2 – Chủ nhật","mapEmbedUrl":"https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+%C4%90HQG+TP.HCM&output=embed"}',1791037263087);
INSERT INTO "Setting" VALUES('social','{"facebook":"https://facebook.com/","instagram":"https://instagram.com/","tiktok":"https://tiktok.com/","youtube":"","zalo":"https://zalo.me/0901234567"}',1791018442891);
INSERT INTO "Setting" VALUES('bank','{"bankId":"VCB","bankName":"Vietcombank – CN TP. Hồ Chí Minh","accountNumber":"0123456789","accountName":"NGUYEN VAN A"}',1791018442894);
INSERT INTO "Setting" VALUES('shipping','{"fee":30000,"freeThreshold":500000}',1791018442897);
INSERT INTO "Setting" VALUES('home','{"banners":[{"image":"/uploads/seed/echeveria-5.webp","title":"Sen đá xinh cho góc nhỏ thêm xanh","subtitle":"Hơn 30 giống sen đá & xương rồng khỏe đẹp, đóng gói cẩn thận, giao tận nơi.","ctaText":"Mua ngay","ctaLink":"/san-pham"},{"image":"/uploads/seed/terrarium-1.webp","title":"Tiểu cảnh terrarium – quà tặng tinh tế","subtitle":"Thiết kế thủ công, phối cây theo yêu cầu. Giảm đến 15% trong tháng này.","ctaText":"Xem tiểu cảnh","ctaLink":"/danh-muc/tieu-canh-terrarium"},{"image":"/uploads/seed/banner-1.webp","title":"Miễn phí giao hàng từ 500.000đ","subtitle":"Cây được tuyển chọn kỹ, bảo hành 7 ngày nếu cây gặp vấn đề khi nhận.","ctaText":"Khám phá","ctaLink":"/san-pham?sap-xep=moi-nhat"}]}',1791018442900);
CREATE TABLE "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO "_prisma_migrations" VALUES('affcbd3f-a870-4d19-a9c7-cf3fc1ef5979','4952e63578ae6275eb0478f665df7f70e9ba5475df698e2d5ccfb66494d8a288',1791003488040,'20261003045807_init',NULL,NULL,1791003487999,1);
INSERT INTO "_prisma_migrations" VALUES('ab84cfb6-f1ba-4038-b42b-37aaffb242c6','7d300ae466b0f0b44295de33c931d29087be3766bb5bce926a603574d103556c',1791003870734,'20261003050421_product_final_price',NULL,NULL,1791003870714,1);
INSERT INTO "_prisma_migrations" VALUES('2e9688d9-e582-4b9f-8342-11f36c0e350d','43a08c3e4f1d4e6d8a04a56c3e49b860e565bfc5f3c436b360d427806a5e8a9f',1791003948100,'20261003050548_product_search_text',NULL,NULL,1791003948083,1);
INSERT INTO "_prisma_migrations" VALUES('1f422bcd-02dc-4c73-a3c8-c1a770482fda','a5e987bfe8e2709d1774ccad81eea670e26fd773d9d3955624c8e4d34946078c',1791017272446,'20261003084752_chatbot',NULL,NULL,1791017272424,1);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
CREATE INDEX "Order_phone_idx" ON "Order"("phone");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");
CREATE INDEX "Contact_isHandled_createdAt_idx" ON "Contact"("isHandled", "createdAt");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");
CREATE INDEX "Product_isActive_showOnHome_idx" ON "Product"("isActive", "showOnHome");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
CREATE INDEX "Product_finalPrice_idx" ON "Product"("finalPrice");
CREATE UNIQUE INDEX "ChatConversation_sessionId_key" ON "ChatConversation"("sessionId");
CREATE INDEX "ChatConversation_lastMessageAt_idx" ON "ChatConversation"("lastMessageAt");
CREATE INDEX "ChatConversation_isReviewed_idx" ON "ChatConversation"("isReviewed");
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");
CREATE INDEX "ChatMessage_intent_idx" ON "ChatMessage"("intent");
CREATE INDEX "ChatFaq_isActive_idx" ON "ChatFaq"("isActive");
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('AdminUser',8);
INSERT INTO "sqlite_sequence" VALUES('Category',65);
INSERT INTO "sqlite_sequence" VALUES('ProductImage',475);
INSERT INTO "sqlite_sequence" VALUES('Post',57);
INSERT INTO "sqlite_sequence" VALUES('Order',552);
INSERT INTO "sqlite_sequence" VALUES('OrderItem',1023);
INSERT INTO "sqlite_sequence" VALUES('Contact',26);
INSERT INTO "sqlite_sequence" VALUES('Product',259);
INSERT INTO "sqlite_sequence" VALUES('ChatFaq',75);
INSERT INTO "sqlite_sequence" VALUES('ChatConversation',23);
INSERT INTO "sqlite_sequence" VALUES('ChatMessage',100);
COMMIT;
