import express from "express";
import { authMe,  updateProfile} from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/me", protectedRoute, authMe);
router.put("/profile", protectedRoute, updateProfile);

export default router;  