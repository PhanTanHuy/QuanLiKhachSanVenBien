import Contact from "../models/contactModel.js";

export const sendContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    await Contact.create({ name, email, phone, subject, message });

    res.json({
      success: true,
      message: "Gửi liên hệ thành công",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
