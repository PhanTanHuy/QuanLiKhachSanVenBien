import nodemailer from 'nodemailer';

/**
 * Hàm gửi email qua SMTP
 * @param {Object} params
 * @param {string} params.to - Email người nhận
 * @param {string} params.subject - Tiêu đề email
 * @param {string} params.html - Nội dung email (HTML)
 */
export async function sendEmail({ to, subject, html }) {

  // Nếu chưa cấu hình SMTP thì bỏ qua việc gửi email (dùng cho môi trường DEV)
  if (!process.env.SMTP_HOST) {
    console.warn('Chưa cấu hình SMTP, bỏ qua việc gửi email.');
    
   
    console.log({
      to,
      subject,
      html
    });
    return;
  }

  // Khởi tạo transporter để kết nối SMTP server
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Địa chỉ SMTP server (vd: smtp.gmail.com)
    port: Number(process.env.SMTP_PORT || 587), // Cổng SMTP (587 hoặc 465)
    
    // Port 465 dùng SSL → secure = true, các port khác dùng STARTTLS
    secure: Number(process.env.SMTP_PORT) === 465,
    
    auth: {
      user: process.env.SMTP_USER, // Tài khoản email gửi
      pass: process.env.SMTP_PASS  // Mật khẩu / App Password
    }
  });

  // Gửi email
  const info = await transporter.sendMail({
    // Email người gửi (ưu tiên FROM_EMAIL, nếu không có thì dùng SMTP_USER)
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    
    to,       // Email người nhận
    subject,  // Tiêu đề email
    html      // Nội dung email dạng HTML
  });

  // Trả về thông tin kết quả gửi mail (messageId, response, ...)
  return info;
}
