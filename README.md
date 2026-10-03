# 🌱 Sen Đá Xinh – Website bán sen đá

**Đồ án môn học** · Trường Đại học Công nghệ Thông tin – ĐHQG TP. Hồ Chí Minh (UIT)

| | |
|---|---|
| Sinh viên thực hiện | **Trần Thị Thanh Hương** |
| Mã số sinh viên | **25210281** |
| Email | [25210281@ms.uit.edu.vn](mailto:25210281@ms.uit.edu.vn) |
| Năm thực hiện | 2026 |

Website thương mại điện tử bán sen đá, xương rồng và tiểu cảnh terrarium. Hệ thống gồm trang bán hàng cho khách, trang quản trị cho chủ shop, và chatbot tư vấn "Bé Sen".

---

## Chức năng chính

**Phía khách hàng**
- Trang chủ: banner, danh mục, sản phẩm nổi bật, sản phẩm mới, bài viết.
- Danh sách sản phẩm: lọc theo danh mục, khoảng giá, sắp xếp, tìm kiếm (gõ có dấu hoặc không dấu đều được), phân trang.
- Chi tiết sản phẩm: nhiều ảnh, giá khuyến mãi, tồn kho, hướng dẫn chăm sóc, sản phẩm liên quan.
- Giỏ hàng dạng ngăn trượt, hiệu ứng ảnh bay vào giỏ; giỏ được lưu trên trình duyệt.
- Thanh toán 1 bước, không cần tài khoản: COD hoặc chuyển khoản (mã QR VietQR).
- Tra cứu đơn hàng bằng SĐT + mã đơn; tin tức; liên hệ.
- **Chatbot "Bé Sen"**: tư vấn chọn cây theo nhu cầu và ngân sách, quà tặng, phí ship, thời gian giao hàng, tình trạng đơn hàng…

**Phía quản trị** (`/admin`)
- Tổng quan: doanh thu, biểu đồ doanh số 14 ngày, đơn theo trạng thái, sản phẩm sắp hết hàng.
- Quản lý sản phẩm (nhiều ảnh, kéo thả sắp xếp, soạn thảo rich text, bật/tắt hiển thị ngay trong bảng), danh mục, tin tức, liên hệ.
- Đơn hàng: lọc theo trạng thái/ngày/SĐT, đổi trạng thái (hủy đơn tự hoàn tồn kho), ghi chú nội bộ, **xuất CSV cho Excel**.
- Chatbot: lịch sử hội thoại, thống kê, câu hỏi bot chưa hiểu, chỉnh sửa bộ kiến thức.
- Cài đặt cửa hàng: thông tin liên hệ, logo, mạng xã hội, chuyển khoản, phí ship, banner.

## Công nghệ

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma ORM + SQLite · Framer Motion · Tiptap · Zod.

---

## Cài đặt & chạy

Yêu cầu: **Node.js 20 trở lên**.

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file cấu hình (sau đó có thể sửa SESSION_SECRET trong .env)
cp .env.example .env            # Windows (cmd): copy .env.example .env

# 3. Tạo cơ sở dữ liệu
npx prisma migrate deploy

# 4. Nạp dữ liệu mẫu: 8 danh mục, 32 sản phẩm, 6 bài viết, 150 đơn hàng mẫu, 25 câu kiến thức chatbot
npm run db:seed

# 5. Chạy website
npm run dev:warm                # chạy và tự mở trước các trang (bấm menu không phải chờ)
```

Mở **http://localhost:3000**. Trang quản trị: **http://localhost:3000/admin**.

### Tài khoản quản trị mặc định

| Email | Mật khẩu |
|---|---|
| `admin@senda.local` | `admin123` |

Khai báo trong `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). Có thể đổi mật khẩu tại **Cài đặt → Tài khoản**.

### Các lệnh thường dùng

| Lệnh | Tác dụng |
|---|---|
| `npm run dev:warm` | Chạy website (chế độ phát triển) và tự mở trước mọi trang |
| `npm run dev` | Chạy website (chế độ phát triển) |
| `npm run build` rồi `npm start` | Chạy bản tối ưu (nhanh như khi triển khai thật) |
| `npm run db:seed` | **Xóa và tạo lại toàn bộ** dữ liệu mẫu |
| `npm run db:demo-orders` | Chỉ tạo lại **đơn hàng mẫu** (giữ nguyên sản phẩm, cài đặt) và xuất thống kê ra `docs/bao-cao-du-lieu-mua-hang.md` |
| `npm run db:studio` | Xem/sửa cơ sở dữ liệu bằng giao diện |
| `npm run chatbot:test` | Kiểm thử chatbot với 46 câu hỏi mẫu |

---

## Dữ liệu mẫu cho báo cáo

- **150 đơn hàng trong 90 ngày** từ 38 khách hàng (27 khách mua lại), đủ các trạng thái, có xu hướng tăng trưởng theo tháng.
- Dữ liệu được sinh bằng bộ sinh số có **hạt giống cố định**: chạy lại trong cùng một ngày sẽ ra đúng cùng số liệu và mã đơn, khớp với báo cáo. Vì khoảng 90 ngày tính lùi từ hôm nay, chạy vào ngày khác thì ngày đặt và số liệu sẽ thay đổi theo.
- **Toàn bộ khách hàng là hư cấu** (tên, số điện thoại, địa chỉ), chỉ dùng để minh họa.
- Bảng thống kê: [docs/bao-cao-du-lieu-mua-hang.md](docs/bao-cao-du-lieu-mua-hang.md). Xuất danh sách đơn ra Excel: **Admin → Đơn hàng → Xuất CSV**.

## Tài liệu

- [docs/chatbot.md](docs/chatbot.md): dữ liệu chatbot hỗ trợ và cách mở rộng.
- [docs/bao-cao-du-lieu-mua-hang.md](docs/bao-cao-du-lieu-mua-hang.md): thống kê dữ liệu mua hàng mẫu.

## Nguồn tài nguyên

- Ảnh sản phẩm mẫu: [Wikimedia Commons](https://commons.wikimedia.org), giấy phép tự do; ghi nguồn tác giả tại [prisma/seed-images/CREDITS.md](prisma/seed-images/CREDITS.md).
- Font chữ [Be Vietnam Pro](https://github.com/bettergui/BeVietnamPro) (SIL Open Font License); biểu tượng [Lucide](https://lucide.dev) (ISC).
- Mã QR thanh toán tạo bởi dịch vụ [VietQR](https://vietqr.io). Thông tin tài khoản ngân hàng trong dữ liệu mẫu chỉ để minh họa, cần thay bằng tài khoản thật trong **Cài đặt → Chuyển khoản** trước khi nhận thanh toán.

---

© 2026 **Trần Thị Thanh Hương** (MSSV 25210281) – Trường Đại học Công nghệ Thông tin, ĐHQG TP. Hồ Chí Minh. Mọi quyền được bảo lưu.
Mã nguồn được thực hiện cho mục đích học tập trong khuôn khổ đồ án môn học.
