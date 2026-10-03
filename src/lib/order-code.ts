// Bỏ các ký tự dễ nhầm (0/O, 1/I/L) để khách đọc qua điện thoại không sai
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Mã đơn dạng SD241003-7K2F (yyMMdd theo giờ VN + 4 ký tự ngẫu nhiên) */
export function generateOrderCode(date = new Date()): string {
  const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const yy = String(vn.getUTCFullYear()).slice(2);
  const mm = String(vn.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(vn.getUTCDate()).padStart(2, "0");
  let rand = "";
  for (let i = 0; i < 4; i++) rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `SD${yy}${mm}${dd}-${rand}`;
}
