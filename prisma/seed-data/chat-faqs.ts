/**
 * Bộ câu hỏi – đáp ban đầu cho chatbot (seed vào bảng ChatFaq).
 * Sau khi seed, admin chỉnh sửa / thêm mới tại /admin/chatbot/kien-thuc.
 * Nội dung bám theo chính sách đang hiển thị trên website (bảo hành 7 ngày, đóng gói, giao 24h nội thành...).
 *
 * Cú pháp câu trả lời: **đậm**, [chữ](/duong-dan), xuống dòng, dòng bắt đầu bằng "- " là gạch đầu dòng.
 */
export type SeedFaq = { category: string; question: string; keywords: string[]; answer: string };

export const CHAT_FAQS: SeedFaq[] = [
  // ---------------- Vận chuyển ----------------
  {
    category: "Vận chuyển",
    question: "Bao lâu thì nhận được hàng?",
    keywords: ["bao lau nhan", "bao lau thi nhan", "may ngay", "mat may ngay", "mat bao lau", "thoi gian giao", "thoi gian van chuyen", "bao gio nhan duoc", "giao mat bao lau", "ship mat bao lau", "bao lau thi toi", "khi nao nhan", "giao trong bao lau"],
    answer:
      "Thời gian giao hàng dự kiến:\n- **Nội thành TP. Hồ Chí Minh:** trong 24 giờ\n- **Các tỉnh/thành khác:** 2–4 ngày làm việc\n- Vùng sâu, vùng xa có thể thêm 1–2 ngày\nShop sẽ gọi xác nhận trước khi gửi hàng nhé 🚚",
  },
  {
    category: "Vận chuyển",
    question: "Shop có giao toàn quốc không?",
    keywords: ["giao toan quoc", "ship toan quoc", "co ship tinh", "ship tinh khong", "giao tinh khong", "ship ngoai tinh", "giao ngoai tinh", "co giao den", "giao hang tan noi", "giao o tinh"],
    answer:
      "Có ạ! Shop **giao hàng toàn quốc** qua đơn vị vận chuyển uy tín. Cây được đóng hộp chống sốc, cố định gốc nên đi xa vẫn an toàn 🌿",
  },
  {
    category: "Vận chuyển",
    question: "Có giao hỏa tốc trong ngày không?",
    keywords: ["hoa toc", "giao gap", "giao ngay", "trong ngay", "giao nhanh", "can gap", "grab", "now"],
    answer:
      "Với đơn **nội thành TP. Hồ Chí Minh**, shop hỗ trợ giao hỏa tốc trong ngày (phí theo app giao hàng). Bạn ghi chú \"giao hỏa tốc\" khi đặt hoặc nhắn shop để được sắp xếp nhé!",
  },
  {
    category: "Vận chuyển",
    question: "Cây được đóng gói thế nào?",
    keywords: ["dong goi", "goi hang", "co bi gay", "co bi dap", "van chuyen co an toan", "hop", "chong soc"],
    answer:
      "Mỗi chậu được **cố định gốc, bọc lá và đóng hộp carton chống sốc**. Tiểu cảnh terrarium được chèn xốp riêng từng bình. Nếu cây bị dập do vận chuyển, shop đổi mới miễn phí 💚",
  },

  // ---------------- Bảo hành / đổi trả ----------------
  {
    category: "Bảo hành & đổi trả",
    question: "Chính sách bảo hành, đổi trả như thế nào?",
    keywords: ["bao hanh", "doi tra", "doi cay", "tra hang", "hoan tien", "cay chet", "cay bi hu", "cay bi dap", "cay bi hong", "nhan cay xau", "loi"],
    answer:
      "Shop **bảo hành cây 7 ngày** kể từ khi nhận hàng:\n- Cây bị dập, gãy, thối do vận chuyển → đổi cây mới miễn phí\n- Bạn chỉ cần chụp ảnh/quay video lúc mở hộp và nhắn shop kèm mã đơn\nNgoài ra shop luôn tư vấn chăm sóc trọn đời cho cây mua tại shop 🌱",
  },
  {
    category: "Đơn hàng",
    question: "Tôi muốn hủy hoặc sửa đơn hàng",
    keywords: ["huy don", "sua don", "doi dia chi", "thay doi don", "doi so luong", "them san pham vao don", "dat nham"],
    answer:
      "Đơn ở trạng thái **Mới** hoặc **Đã xác nhận** có thể hủy/sửa miễn phí. Bạn nhắn shop qua hotline/Zalo kèm **mã đơn** và nội dung cần sửa nhé. Đơn đã giao cho vận chuyển thì không hủy được ạ.",
  },
  {
    category: "Đơn hàng",
    question: "Có cần tạo tài khoản để mua không?",
    keywords: ["tao tai khoan", "dang ky", "dang nhap", "tai khoan", "can dang ky"],
    answer:
      "Không cần ạ! Bạn chỉ cần nhập **họ tên, số điện thoại và địa chỉ** khi thanh toán. Sau khi đặt, dùng SĐT + mã đơn để [tra cứu đơn hàng](/tra-cuu-don-hang) bất cứ lúc nào.",
  },
  {
    category: "Đơn hàng",
    question: "Shop có xuất hóa đơn VAT không?",
    keywords: ["hoa don", "vat", "xuat hoa don", "hoa don do", "cong ty mua"],
    answer: "Shop có hỗ trợ xuất hóa đơn VAT cho đơn của công ty. Bạn ghi thông tin xuất hóa đơn vào phần **Ghi chú** khi đặt hàng hoặc nhắn shop nhé.",
  },

  // ---------------- Quà tặng / số lượng lớn ----------------
  {
    category: "Quà tặng",
    question: "Shop có gói quà và viết thiệp không?",
    keywords: ["goi qua", "viet thiep", "thiep", "giay goi", "boc qua", "hop qua", "ruy bang", "loi chuc"],
    answer:
      "Có ạ 🎁 Shop **gói quà và viết thiệp miễn phí**. Bạn ghi lời chúc vào phần **Ghi chú** khi đặt hàng, shop sẽ trang trí xinh xắn trước khi gửi đi.",
  },
  {
    category: "Quà tặng",
    question: "Mua số lượng nhiều / quà tặng sự kiện có giá sỉ không?",
    keywords: ["so luong lon", "so luong nhieu", "gia si", "mua si", "mua nhieu", "qua su kien", "qua cuoi", "qua cong ty", "qua tang khach", "50 chau", "100 chau", "qua hoi nghi", "doanh nghiep"],
    answer:
      "Shop nhận đơn **quà tặng sự kiện, đám cưới, doanh nghiệp** với giá ưu đãi theo số lượng (từ 20 phần). Bạn để lại số điện thoại hoặc [gửi liên hệ](/lien-he), shop sẽ báo giá và gửi mẫu trong 24h nhé!",
  },
  {
    category: "Quà tặng",
    question: "Có làm tiểu cảnh theo yêu cầu không?",
    keywords: ["theo yeu cau", "thiet ke rieng", "lam rieng", "custom", "dat lam", "khac ten", "in ten"],
    answer:
      "Có ạ! Shop nhận thiết kế **tiểu cảnh terrarium theo yêu cầu** (chọn cây, màu sỏi, tượng trang trí, khắc tên). Thời gian làm 2–3 ngày. Bạn mô tả ý tưởng hoặc gửi ảnh mẫu qua Zalo để shop tư vấn nhé 🪴",
  },

  // ---------------- Sản phẩm ----------------
  {
    category: "Sản phẩm",
    question: "Cây giao có giống ảnh không? Kích thước bao nhiêu?",
    keywords: ["giong anh", "giong hinh", "anh that", "kich thuoc", "to khong", "cao bao nhieu", "size", "cay lon khong", "cay nho"],
    answer:
      "Ảnh trên web là ảnh cây thật tại vườn. Sen đá thường **cao/rộng 5–8cm** (tùy giống). Màu sắc có thể đậm/nhạt hơn ảnh theo mùa và ánh nắng – đó là nét thú vị của sen đá 😊",
  },
  {
    category: "Sản phẩm",
    question: "Shop có bán hạt giống sen đá không?",
    keywords: ["hat giong", "ban hat", "gieo hat", "hat sen da", "trong tu hat"],
    answer:
      "Hiện shop **chưa bán hạt giống** ạ, vì sen đá trồng từ hạt rất lâu lớn và tỉ lệ nảy mầm thấp. Bạn có thể nhân giống bằng lá rất dễ – xem [hướng dẫn nhân giống](/tin-tuc/cach-nhan-giong-sen-da-bang-la-cuc-don-gian) nhé 🌱",
  },
  {
    category: "Sản phẩm",
    question: "Cây có kèm chậu không?",
    keywords: ["kem chau", "co chau khong", "chau nhua", "co san chau", "trong san"],
    answer:
      "Cây được giao kèm **chậu nhựa ươm** và đã trồng sẵn. Bạn có thể mua thêm [chậu sứ, chậu đất nung](/danh-muc/chau-phu-kien) để thay cho đẹp nhé.",
  },

  // ---------------- Chăm sóc ----------------
  {
    category: "Chăm sóc",
    question: "Cách chăm sóc sen đá cơ bản",
    keywords: ["cach cham soc", "cham soc sen da", "cham soc cay", "cham soc xuong rong", "nuoi sen da", "trong sen da", "cham cay", "cham soc nhu the nao"],
    answer:
      "5 nguyên tắc chăm sen đá 🌱\n- **Ánh sáng:** 4–6 giờ nắng nhẹ mỗi ngày\n- **Tưới nước:** khô mới tưới, tưới thì tưới đẫm (5–7 ngày/lần)\n- **Đất:** thoát nước tốt, trộn perlite/đá bọt\n- **Chậu:** bắt buộc có lỗ thoát nước\n- **Thông gió:** đặt nơi thoáng, nhất là mùa mưa\nĐọc đầy đủ: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)",
  },
  {
    category: "Chăm sóc",
    question: "Bao lâu tưới sen đá một lần?",
    keywords: ["tuoi nuoc", "tuoi bao lau", "bao lau tuoi", "tuoi may lan", "tuoi nhu the nao", "luong nuoc", "tuoi bao nhieu"],
    answer:
      "Nguyên tắc vàng: **khô mới tưới, tưới thì tưới đẫm** 💧\n- Mùa khô: 5–7 ngày/lần\n- Mùa mưa: 10–14 ngày/lần\n- Tưới vào gốc, tránh đọng nước ở tâm lá\nXem thêm: [Hướng dẫn chăm sóc sen đá cho người mới](/tin-tuc/huong-dan-cham-soc-sen-da-cho-nguoi-moi-bat-dau)",
  },
  {
    category: "Chăm sóc",
    question: "Sen đá cần bao nhiêu nắng?",
    keywords: ["anh sang", "can nang", "phoi nang", "bao nhieu nang", "de o dau", "dat o dau", "de trong nha duoc khong", "thieu nang", "vuon dai", "bi dai ra"],
    answer:
      "Sen đá cần **4–6 giờ nắng nhẹ/ngày** (nắng sáng là tốt nhất). Cây bị **vươn dài, lá thưa, nhạt màu** là dấu hiệu thiếu sáng.\nĐể trong phòng/văn phòng, bạn nên chọn giống chịu bóng như [Sen đá Kim Cương, Móng Rồng](/danh-muc/sen-da-kim-cuong) và cho cây \"tắm nắng\" 1–2 ngày mỗi tuần.",
  },
  {
    category: "Chăm sóc",
    question: "Sen đá bị úng, thối gốc phải làm sao?",
    keywords: ["ung nuoc", "bi ung", "thoi goc", "thoi re", "mem nhun", "la vang trong", "bi thoi", "cuu cay", "den goc"],
    answer:
      "Cách cứu cây bị úng:\n- Nhấc cây khỏi chậu, rũ sạch đất cũ\n- Cắt bỏ phần rễ/thân bị thối đến khi thấy mô xanh\n- Để vết cắt khô 3–5 ngày nơi thoáng mát\n- Trồng lại vào đất khô thoát nước tốt, 5–7 ngày sau mới tưới\nChi tiết: [Vì sao sen đá bị úng nước và cách cứu cây](/tin-tuc/vi-sao-sen-da-bi-ung-nuoc-va-cach-cuu-cay)",
  },
  {
    category: "Chăm sóc",
    question: "Sen đá bị rụng lá, héo lá",
    keywords: ["rung la", "heo la", "la heo", "la kho", "nhan la", "la teo", "la rung"],
    answer:
      "- **Lá dưới cùng khô dần**: hiện tượng tự nhiên, chỉ cần nhặt bỏ\n- **Lá nhăn, teo**: cây thiếu nước → tưới đẫm một lần\n- **Lá mềm, vàng trong, rụng khi chạm**: dấu hiệu úng → giảm tưới, kiểm tra gốc\nNếu cây mới mua bị rụng lá nhiều, nhắn shop kèm ảnh để được hỗ trợ nhé!",
  },
  {
    category: "Chăm sóc",
    question: "Làm sao để sen đá lên màu đẹp?",
    keywords: ["len mau", "giu mau", "mat mau", "bi xanh", "khong do", "mau dep", "ruc ro hon"],
    answer:
      "3 bí quyết giúp sen đá lên màu: **nắng nhiều hơn** (tăng dần để tránh cháy lá), **chênh lệch nhiệt độ ngày – đêm**, và **tưới ít, hạn chế phân đạm**.\nĐọc thêm: [Bí quyết giúp sen đá lên màu rực rỡ](/tin-tuc/bi-quyet-giup-sen-da-len-mau-ruc-ro)",
  },
  {
    category: "Chăm sóc",
    question: "Nhân giống sen đá như thế nào?",
    keywords: ["nhan giong", "giam la", "giam canh", "trong tu la", "tach cay", "cay con"],
    answer:
      "Nhân giống bằng lá rất dễ:\n- Vặn nhẹ lá khỏe, lấy trọn cuống\n- Để khô 2–3 ngày\n- Đặt nằm trên mặt đất khô, phun sương khi ra rễ\nSau 1–2 tháng là có cây con 🌱 Chi tiết: [Cách nhân giống sen đá bằng lá](/tin-tuc/cach-nhan-giong-sen-da-bang-la-cuc-don-gian)",
  },
  {
    category: "Chăm sóc",
    question: "Nên dùng đất gì để trồng sen đá?",
    keywords: ["dat gi", "loai dat", "tron dat", "dat trong sen da", "gia the", "cong thuc dat", "thay dat", "thay chau"],
    answer:
      "Sen đá cần giá thể **thoát nước tốt**: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun. Tiện nhất là dùng [Đất trồng sen đá chuyên dụng](/danh-muc/dat-phan-bon) đã trộn sẵn. Thay chậu tốt nhất vào mùa khô, 1–2 năm/lần.",
  },
  {
    category: "Chăm sóc",
    question: "Sen đá bị rệp, sâu bệnh",
    keywords: ["rep", "rep sap", "sau", "con trung", "bi nam", "dom trang", "dom den", "kien"],
    answer:
      "Rệp sáp (đốm trắng như bông) hay gặp nhất: dùng tăm bông thấm cồn lau sạch, cách ly cây và phun thuốc sinh học 7 ngày/lần. Đặt cây nơi thoáng gió để phòng nấm. Bạn gửi ảnh qua Zalo để shop xem giúp nhé!",
  },
  {
    category: "Chăm sóc",
    question: "Chăm sóc terrarium như thế nào?",
    keywords: ["cham terrarium", "cham tieu canh", "tieu canh tuoi", "binh thuy tinh tuoi", "terrarium tuoi"],
    answer:
      "Terrarium để nơi có **ánh sáng tán xạ** (gần cửa sổ, không chiếu nắng trực tiếp vào bình). Phun sương nhẹ quanh gốc **10–14 ngày/lần**, mỗi lần 5–10 lần xịt – tuyệt đối không tưới nhiều vì bình không có lỗ thoát nước.\nĐọc thêm: [Terrarium – khu rừng nhỏ trong bình thủy tinh](/tin-tuc/terrarium-khu-rung-nho-trong-binh-thuy-tinh)",
  },
  {
    category: "Chăm sóc",
    question: "Để sen đá trong phòng máy lạnh được không?",
    keywords: ["may lanh", "dieu hoa", "phong lanh", "trong phong", "phong ngu", "van phong co song duoc"],
    answer:
      "Được ạ, nhưng phòng máy lạnh thường **thiếu sáng và khô**. Bạn nên chọn giống chịu bóng (Kim Cương, Móng Rồng), đặt gần cửa sổ, tưới thưa hơn và mỗi tuần mang cây ra ngoài phơi nắng 1–2 ngày.\nGợi ý bày trí: [Sen đá cho bàn làm việc](/tin-tuc/goi-y-bay-tri-sen-da-cho-ban-lam-viec)",
  },
];
