import c_pathRecep from "../../controllers/receptionist/c_pathRecep.js";
import express from "express";
const router = express.Router();

router.get("/", c_pathRecep.getRoomListPage);
router.get("/booking", c_pathRecep.getBookingPage);
router.get("/profile", c_pathRecep.getProfilePage);
router.get("/payment", c_pathRecep.getPaymentPage);


export default router;