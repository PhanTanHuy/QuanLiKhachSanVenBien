const express = require("express");
const { signIn, signOut, signUp } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

module.exports = router;
