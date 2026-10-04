# Hướng dẫn chạy chương trình

**Đồ án môn học:** Website bán sen đá "Sen Đá Xinh"
**Sinh viên:** Trần Thị Thanh Hương · MSSV 25210281 · 25210281@ms.uit.edu.vn
**Mã nguồn:** https://github.com/conghau0401/SenDa-Ecommerce

Làm lần lượt 6 bước dưới đây, mất khoảng 5–10 phút. Website chạy hoàn toàn trên máy, **không cần cài thêm cơ sở dữ liệu**: dữ liệu lưu trong một file SQLite được tạo tự động.

---

## Bước 0. Chuẩn bị

| Phần mềm | Phiên bản | Tải về |
|---|---|---|
| **Node.js** (bắt buộc) | **20.9 trở lên**, khuyên dùng **22 LTS** | https://nodejs.org (chọn bản LTS) |
| Git (không bắt buộc) | bất kỳ | https://git-scm.com |

Kiểm tra Node.js đã cài đúng: mở **Terminal** (Windows: **Command Prompt** hoặc **PowerShell**), gõ:

```bash
node -v
```

Kết quả phải là `v20.9.0` trở lên (ví dụ `v22.14.0`).

## Bước 1. Tải mã nguồn

**Cách 1, dùng Git:**

```bash
git clone https://github.com/conghau0401/SenDa-Ecommerce.git
cd SenDa-Ecommerce
```

**Cách 2, không dùng Git:** mở trang GitHub ở trên → nút **Code** → **Download ZIP** → giải nén → mở Terminal **bên trong thư mục vừa giải nén** (thư mục có file `package.json`).

## Bước 2. Cài thư viện

```bash
npm install
```

Lần đầu mất khoảng 1–3 phút tùy tốc độ mạng.

## Bước 3. Tạo file cấu hình `.env`

Sao chép file mẫu `.env.example` thành `.env`:

| Hệ điều hành | Lệnh |
|---|---|
| Windows – Command Prompt | `copy .env.example .env` |
| Windows – PowerShell | `Copy-Item .env.example .env` |
| macOS / Linux | `cp .env.example .env` |

Có thể giữ nguyên nội dung file để chạy thử trên máy. Các giá trị quan trọng:

| Biến | Ý nghĩa |
|---|---|
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Tài khoản quản trị được tạo ở bước 5 |
| `SESSION_SECRET` | Chuỗi bí mật ký phiên đăng nhập. **Bắt buộc đổi thành chuỗi ngẫu nhiên dài ≥ 32 ký tự** nếu đưa website lên Internet |
| `CHATBOT_AI` | `off` (mặc định): chatbot trả lời bằng bộ kiến thức có sẵn, không cần Internet. Xem mục *Chatbot AI* bên dưới |

## Bước 4. Tạo cơ sở dữ liệu

```bash
npx prisma migrate deploy
```

Lệnh này tạo file `prisma/dev.db` và toàn bộ bảng dữ liệu.

## Bước 5. Nạp dữ liệu mẫu

```bash
npm run db:seed
```

Kết quả gồm 8 danh mục, 32 sản phẩm có ảnh, 6 bài viết, **khoảng 150 đơn hàng mẫu trong 90 ngày gần nhất**, 25 câu kiến thức chatbot và tài khoản quản trị. Đơn hàng được tính lùi từ ngày chạy lệnh, nên số đơn chính xác thay đổi nhẹ theo ngày. Mỗi lần chạy lại lệnh này, toàn bộ dữ liệu sẽ được **xóa và tạo lại từ đầu**.

## Bước 6. Chạy website

```bash
npm run dev:warm
```

Đợi đến khi Terminal hiện dòng `🔥 Xong 28/28 trang` (khoảng 30 giây). Lệnh này mở trước tất cả các trang, nên sau đó bấm menu nào cũng hiện ngay. Muốn chạy nhanh mà không mở trước các trang thì dùng `npm run dev`.

| Trang | Địa chỉ |
|---|---|
| Website bán hàng | **http://localhost:3000** |
| Trang quản trị | **http://localhost:3000/admin** |

**Tài khoản quản trị:**

| Email | Mật khẩu |
|---|---|
| `admin@senda.local` | `admin123` |

Dừng chương trình: nhấn **Ctrl + C** trong Terminal.

---

## Chạy bản tối ưu (tùy chọn)

Chế độ ở bước 6 là chế độ phát triển: lần đầu mở mỗi trang sẽ hơi chậm vì phải biên dịch. Để xem tốc độ thực tế như khi triển khai:

```bash
npm run build
npm start
```

Sau đó mở http://localhost:3000. Mỗi lần sửa mã nguồn cần chạy lại `npm run build`.

---

## Gợi ý kiểm tra nhanh các chức năng

**Phía khách hàng** (http://localhost:3000)
1. Trang chủ: banner tự chuyển, danh mục, sản phẩm nổi bật, bài viết.
2. **Sản phẩm**: lọc theo danh mục và khoảng giá, sắp xếp; tìm kiếm thử gõ không dấu, ví dụ `sen da`.
3. Mở một sản phẩm → **Thêm vào giỏ** (ảnh bay vào biểu tượng giỏ hàng) → mở giỏ → **Thanh toán**.
4. Điền họ tên, SĐT (ví dụ `0901234567`), địa chỉ → chọn **Chuyển khoản** → **Đặt hàng** → trang cảm ơn hiện mã đơn và mã QR.
5. **Tra cứu đơn**: nhập SĐT và mã đơn vừa đặt.
6. **Chatbot** (nút chậu cây góc phải dưới): thử hỏi *"phí ship bao nhiêu"*, *"tư vấn cây dễ chăm dưới 100k"*, *"quà sinh nhật bạn gái"*.

**Phía quản trị** (http://localhost:3000/admin)
1. **Tổng quan**: doanh thu 30 ngày, biểu đồ doanh số 14 ngày, đơn theo trạng thái, sản phẩm sắp hết hàng.
2. **Đơn hàng**: lọc theo trạng thái/ngày, mở đơn vừa đặt → **Xác nhận đơn** → **Bắt đầu giao**; bấm **Xuất CSV** để mở bằng Excel.
3. **Sản phẩm**: bật/tắt "Trang chủ", "Nổi bật" ngay trong bảng; thêm sản phẩm mới có ảnh (kéo thả để sắp xếp ảnh).
4. **Chatbot**: thống kê, câu hỏi bot chưa hiểu, thêm kiến thức mới và thử ngay.
5. **Cài đặt**: thông tin cửa hàng, phí ship, banner trang chủ.

---

## Các lệnh khác

| Lệnh | Tác dụng |
|---|---|
| `npm run db:demo-orders` | Chỉ tạo lại đơn hàng mẫu (giữ sản phẩm, cài đặt) và xuất thống kê ra `docs/bao-cao-du-lieu-mua-hang.md` |
| `npm run db:studio` | Mở giao diện xem/sửa cơ sở dữ liệu tại http://localhost:5555 |
| `npm run warmup` | Mở trước các trang khi website đang chạy bằng `npm run dev` |
| `npm run chatbot:test` | Kiểm thử chatbot với 46 câu hỏi mẫu |
| `npm run dev:webpack` | Chạy chế độ phát triển bằng webpack (dùng khi `npm run dev` gặp lỗi) |

## Chatbot AI (tùy chọn)

Mặc định chatbot trả lời bằng bộ luật và kiến thức có sẵn, miễn phí và chạy không cần Internet. Muốn chatbot trả lời tự nhiên hơn bằng AI Claude (tính phí theo lượt dùng):

1. Tạo khóa API tại https://console.anthropic.com.
2. Trong file `.env`, sửa `CHATBOT_AI="on"` và thêm dòng `ANTHROPIC_API_KEY="sk-ant-..."`.
3. Dừng chương trình (Ctrl + C) rồi chạy lại.

Chi tiết: [docs/chatbot.md](docs/chatbot.md).

---

## Xử lý lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `'npm' is not recognized` / `npm: command not found` | Chưa cài Node.js, hoặc cần mở lại Terminal sau khi cài |
| PowerShell báo `running scripts is disabled on this system` | Dùng **Command Prompt** thay PowerShell, hoặc chạy một lần: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `npm install` báo lỗi `sharp` hoặc `Unsupported engine` | Node.js quá cũ, cần cài **Node.js 20.9 trở lên** rồi chạy lại `npm install` |
| `Port 3000 is in use` | Cổng 3000 đang bận: chạy `npm run dev:warm -- 3001` rồi mở http://localhost:3001 |
| `Environment variable not found: DATABASE_URL` | Chưa làm **Bước 3** (thiếu file `.env`) |
| Website báo lỗi bảng không tồn tại (`The table ... does not exist`) | Chưa làm **Bước 4** và **Bước 5** |
| Trang không có sản phẩm, ảnh không hiển thị | Chạy lại `npm run db:seed` (bước này chép ảnh mẫu vào `public/uploads/seed`) |
| `EPERM: operation not permitted ... query_engine` (Windows) | Website đang chạy khóa file của Prisma: nhấn Ctrl + C để dừng, chạy lại lệnh, rồi mở lại website |
| Đăng nhập admin báo sai mật khẩu | Mật khẩu có thể đã bị đổi trong Cài đặt: chạy `npm run db:seed` để đặt lại `admin123` (lệnh này tạo lại toàn bộ dữ liệu mẫu) |
| `npm run dev` báo lỗi Turbopack | Dùng `npm run dev:webpack` |
| Mã QR chuyển khoản không hiện | Mã QR lấy từ dịch vụ VietQR nên máy cần có kết nối Internet |

---

## Cấu trúc thư mục chính

```
SenDa-Ecommerce/
├─ prisma/
│  ├─ schema.prisma        # Thiết kế cơ sở dữ liệu
│  ├─ migrations/          # Lịch sử thay đổi cấu trúc bảng
│  ├─ seed.ts              # Nạp dữ liệu mẫu
│  ├─ seed-data/           # Đơn hàng mẫu, kiến thức chatbot
│  └─ seed-images/         # Ảnh sản phẩm mẫu (kèm CREDITS.md ghi nguồn)
├─ src/
│  ├─ app/(shop)/          # Các trang phía khách hàng
│  ├─ app/admin/           # Các trang quản trị
│  ├─ components/          # Thành phần giao diện
│  ├─ actions/             # Xử lý phía máy chủ (đặt hàng, quản trị, chatbot)
│  └─ lib/                 # Thư viện dùng chung (chatbot, xác thực, định dạng...)
├─ public/images/brand/    # Logo
├─ docs/                   # Tài liệu chatbot, báo cáo dữ liệu
├─ scripts/                # Lệnh tiện ích (warmup, dữ liệu mẫu, kiểm thử chatbot)
├─ README.md               # Giới thiệu đồ án
└─ HUONG_DAN_CHAY.md       # File này
```

---

© 2026 Trần Thị Thanh Hương (MSSV 25210281) – Trường Đại học Công nghệ Thông tin, ĐHQG TP. Hồ Chí Minh.
