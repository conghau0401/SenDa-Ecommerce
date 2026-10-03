# Báo cáo dữ liệu mua hàng (dữ liệu mẫu)

> **Đồ án môn học** – Website bán sen đá "Sen Đá Xinh"
> Sinh viên: **Trần Thị Thanh Hương** · MSSV: **25210281** · Email: 25210281@ms.uit.edu.vn
> Trường Đại học Công nghệ Thông tin – ĐHQG TP. Hồ Chí Minh (UIT)
>
> Dữ liệu được sinh tự động bằng `npm run db:demo-orders` (bộ sinh số có hạt giống cố định – chạy lại ra cùng kết quả).
> **Toàn bộ khách hàng là hư cấu**, chỉ phục vụ minh họa. Số liệu tính tại thời điểm tạo: 03/10/2026.

## 1. Tổng quan (06/07/2026 – 03/10/2026, 90 ngày)

| Chỉ số | Giá trị |
|---|---|
| Tổng số đơn hàng | **150** |
| Đơn hoàn thành | 129 (86.0%) |
| Đơn bị hủy | 12 (8.0%) |
| **Doanh thu** (đơn hoàn thành) | **31.622.000đ** |
| Giá trị trung bình / đơn hoàn thành | 245.132đ |
| Số sản phẩm đã bán (đơn không hủy) | 381 |
| Số khách hàng | 38 – trong đó **27** khách mua từ 2 lần trở lên |
| Đơn được miễn phí ship (≥ 500.000đ) | 14 (10.1%) |

## 2. Đơn hàng theo trạng thái

| Trạng thái | Số đơn | Tỉ lệ |
|---|---|---|
| Mới | 2 | 1.3% |
| Đã xác nhận | 2 | 1.3% |
| Đang giao | 5 | 3.3% |
| Hoàn thành | 129 | 86.0% |
| Đã hủy | 12 | 8.0% |

## 3. Doanh thu theo tháng

| Tháng | Số đơn | Đơn hoàn thành | Doanh thu |
|---|---|---|---|
| 07/2026 | 23 | 21 | 5.673.000đ |
| 08/2026 | 55 | 48 | 11.291.000đ |
| 09/2026 | 63 | 59 | 14.244.000đ |
| 10/2026 | 9 | 1 | 414.000đ |

*Tháng đầu và tháng cuối không đủ ngày. Đơn của vài ngày gần nhất phần lớn chưa hoàn thành nên chưa tính vào doanh thu.*

## 4. Top 10 sản phẩm theo doanh số (đơn không hủy)

| # | Sản phẩm | Số lượng bán | Số đơn | Doanh số |
|---|---|---|---|---|
| 1 | Tiểu Cảnh Terrarium Bình Cầu | 28 | 19 | 8.372.000đ |
| 2 | Sen đá Kim Cương | 21 | 14 | 1.785.000đ |
| 3 | Chuỗi Ngọc Bi | 18 | 15 | 1.782.000đ |
| 4 | Tiểu Cảnh Sa Mạc Mini | 7 | 5 | 1.750.000đ |
| 5 | Sen đá Liên Đài | 33 | 15 | 1.485.000đ |
| 6 | Tiểu Cảnh Chuông Thủy Tinh | 5 | 4 | 1.400.000đ |
| 7 | Sen đá Viền Đỏ Agavoides | 17 | 13 | 1.275.000đ |
| 8 | Sen đá Phật Bà | 26 | 16 | 1.170.000đ |
| 9 | Sen đá Lola | 17 | 11 | 1.105.000đ |
| 10 | Xương Rồng Mammillaria Hoa Hồng | 19 | 12 | 1.045.000đ |

## 5. Top 10 khách hàng (đơn không hủy)

| # | Khách hàng | SĐT | Số đơn | Tổng chi tiêu |
|---|---|---|---|---|
| 1 | Phạm Minh My | 0545***330 | 10 | 3.529.000đ |
| 2 | Phan Mỹ Lan | 0545***183 | 9 | 2.703.000đ |
| 3 | Lý Nhật Nam | 0804***879 | 9 | 2.411.000đ |
| 4 | Lý Tuấn Huy | 0369***313 | 9 | 2.030.000đ |
| 5 | Hoàng Thanh Quỳnh | 0536***549 | 5 | 1.997.000đ |
| 6 | Hồ Thanh Quỳnh | 0994***344 | 8 | 1.540.000đ |
| 7 | Hồ Thu Lan | 0801***049 | 6 | 1.477.000đ |
| 8 | Đặng Thành Huy | 0747***148 | 4 | 1.415.000đ |
| 9 | Huỳnh Thị Thảo | 0513***413 | 4 | 1.297.000đ |
| 10 | Đặng Tuấn Đạt | 0758***692 | 5 | 1.296.000đ |

## 6. Khu vực giao hàng

| Tỉnh / thành | Số đơn | Tỉ lệ |
|---|---|---|
| TP. Hồ Chí Minh | 110 | 79.7% |
| Hà Nội | 13 | 9.4% |
| Cần Thơ | 6 | 4.3% |
| Đồng Nai | 5 | 3.6% |
| Đà Nẵng | 2 | 1.4% |
| Bà Rịa – Vũng Tàu | 1 | 0.7% |
| Khánh Hòa | 1 | 0.7% |

## 7. Phương thức thanh toán

| Phương thức | Số đơn | Tỉ lệ |
|---|---|---|
| Thanh toán khi nhận hàng (COD) | 82 | 59.4% |
| Chuyển khoản ngân hàng | 56 | 40.6% |

## 8. Gợi ý kịch bản quay video demo

1. **Khách hàng:** trang chủ → lọc sản phẩm → chi tiết → *Thêm vào giỏ* (hiệu ứng bay vào giỏ) → *Thanh toán* → đặt hàng → trang cảm ơn (mã đơn, QR chuyển khoản).
2. **Tra cứu đơn:** vào *Tra cứu đơn*, nhập SĐT + mã đơn vừa đặt.
3. **Chatbot Bé Sen:** hỏi "phí ship bao nhiêu", "tư vấn cây dễ chăm dưới 100k", tra cứu đơn qua chat.
4. **Quản trị** (`/admin`): *Tổng quan* (doanh thu, biểu đồ 14 ngày, đơn theo trạng thái) → *Đơn hàng* (lọc theo trạng thái/ngày, đổi trạng thái đơn vừa đặt, **Xuất CSV**) → *Sản phẩm* (bật/tắt nhanh) → *Chatbot* (thống kê, câu chưa hiểu).
5. Mở file CSV vừa xuất bằng Excel để minh họa phần báo cáo dữ liệu.
