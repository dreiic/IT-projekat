const express = require("express");
const router = express.Router();
const { login, register, verify, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:token", verify);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
