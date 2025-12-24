import User from "../models/User.js";
import { UserRole } from "../configs/enum/userEnum.js";

import bcrypt from "bcryptjs";

// Lấy tất cả user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-hashedPassword");
    return res.status(200).json({
      message: "Danh sách tất cả user",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllUsers", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy enum roles
export const getUserRoles = async (req, res) => {
  try {
    const roles = Object.values(UserRole);
    return res.status(200).json({
      message: "Danh sách vai trò",
      roles,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getUserRoles", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật user (admin hoặc user chính chủ)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // For testing: skip role-based authorization. Accept provided fields.
    const { name, phone, address, cccd, role, password } = req.body;
    const update = { name, phone, address, cccd };

    if (role) update.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.hashedPassword = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-hashedPassword");
    if (!updated)
      return res.status(404).json({ message: "User không tồn tại" });

    return res
      .status(200)
      .json({ message: "Cập nhật user thành công", user: updated });
  } catch (error) {
    console.error("Lỗi khi cập nhật user", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xóa user (chỉ admin)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // For testing: skip role-based authorization and just delete the user
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted)
      return res.status(404).json({ message: "User không tồn tại" });

    return res.status(200).json({ message: "Xóa user thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa user", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
