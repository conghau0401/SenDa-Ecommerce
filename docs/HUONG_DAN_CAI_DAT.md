# Hướng dẫn cài đặt

**Đồ án:** Website bán sen đá "Sen Đá Xinh" · Môn Internet và công nghệ Web (IE104.F31.CN1.CNTT)
**Sinh viên:** Trần Thị Thanh Hương – MSSV 25210281 · **GVHD:** ThS. Mai Xuân Hùng

## Yêu cầu

- **Node.js 20.9 trở lên** (khuyên dùng 22 LTS): https://nodejs.org
- Không cần cài cơ sở dữ liệu (dùng SQLite, tự tạo khi cài).

## Cài đặt và chạy

Mở Terminal trong thư mục mã nguồn, chạy lần lượt:

```bash
npm install
copy .env.example .env          # macOS/Linux: cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev:warm
```

Đợi Terminal báo `🔥 Xong 28/28 trang`, rồi mở:

- Website: **http://localhost:3000**
- Quản trị: **http://localhost:3000/admin**

## Tài khoản quản trị (để test)

| Email | Mật khẩu |
|---|---|
| `25210281@ms.uit.edu.vn` | `25210281` |

---

Gặp lỗi hoặc cần hướng dẫn chi tiết: xem [HUONG_DAN_CHAY.md](../HUONG_DAN_CHAY.md).
