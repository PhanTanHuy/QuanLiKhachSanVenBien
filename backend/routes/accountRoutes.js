import express from "express";
import { getAllUsers, getUserRoles, updateUser, deleteUser } from "../controllers/accountController.js";

const router = express.Router();

router.get("/allUser", getAllUsers);
router.get("/enum/roles", getUserRoles);

// update and delete (no auth for testing)
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
