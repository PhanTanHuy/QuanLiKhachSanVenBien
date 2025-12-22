import express from "express";
import { protectedRoute } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddle.js";

const router = express.Router();


router.use(protectedRoute, authorize("Receptionist"));

router.get("/stats", (req, res) => {
  res.json({
    success: true,
    message: "Receptionist stats OK",
    user: req.user
  });
});

router.get("/bookings", (req, res) => {
  res.json({
    success: true,
    message: "Danh sách booking cho lễ tân"
  });
});

export default router;
