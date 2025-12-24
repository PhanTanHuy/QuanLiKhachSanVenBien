export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const test = async (req, res) => {
  return res.sendStatus(204);
}
//Cập nhật thông tin user
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.cccd = req.body.cccd || user.cccd;

    await user.save();

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
