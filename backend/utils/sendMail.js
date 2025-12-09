import nodemailer from "nodemailer";

export async function sendResetEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"NO REPLY" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset mật khẩu",
    html: `
        <h3>Yêu cầu khôi phục mật khẩu</h3>
        <p>Bấm vào link bên dưới để đặt lại mật khẩu (hết hạn trong 15 phút):</p>
        <a href="${link}" target="_blank">Reset Password</a>
    `
  });
}
