const express = require("express");
const {authMe} = require("../controllers/userController.js");



const router = express.Router();
router.get("/me", authMe);

module.exports = router;