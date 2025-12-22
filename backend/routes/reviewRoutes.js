import express from "express";
import {
  getReviewsByRoom,
  addReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:roomId", getReviewsByRoom);
router.post("/", addReview);

export default router;
