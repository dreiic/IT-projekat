const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
router.get("/search", userController.searchUsers);
router.get("/:id/reviews", userController.getUserReviews);
router.get("/:id", userController.getOne);
router.get("/", userController.getAll);

// Login i registracija PREKO AUTH KONTROLERA
router.post("/login", authController.login);
router.post("/register", authController.register);

// Edit profil, dohvati profil, svi korisnici
router.patch("/:id", userController.updateProfile);


module.exports = router;
