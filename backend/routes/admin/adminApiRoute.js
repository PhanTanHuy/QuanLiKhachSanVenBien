import express from "express";
import { protectedRoute } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddle.js";

const router = express.Router();

//  API admin bắt buộc login + role
router.use(protectedRoute, authorize("admin"));

router.get("/stats", (req, res) => {
  res.json({ message: "Admin stats OK" });
});

router.post("/rooms", (req, res) => {
  res.json({ message: "Tạo phòng OK" });
});

export default router;
