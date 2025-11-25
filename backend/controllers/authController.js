import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m"; // dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, password, email, displayName, phone } = req.body;
    if (!username || !password || !email || !displayName || !phone) {
      return res
        .status(400)
        .json({
          message: "Thiếu username, password, email, displayName hoặc phone",
        });
    }
		//kiem tra username da ton tai chua
		const duplicate = await User.findOne({ username });
		if(duplicate){
			return res.status(409).json({message: "Username đã tồn tại"});
		}
		//ma hoa password
		const hashedPassword = await bcrypt.hash(password, 10);
		//tao user moi
		await User.create({
			username,
			hashedPassword,
			email,
			displayName,
			phone
		});
		return res.sendStatus(204);
	
  } catch (error) {
		console.error("Lỗi khi gọi signUp",error);
		return res.status(500).json({message: "Lỗi hệ thống"});
	}
};
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res
      .status(200)
      .json({ message: `User ${user.displayName} đã logged in!`, accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xoá refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      // xoá cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};