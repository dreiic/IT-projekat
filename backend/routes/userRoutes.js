const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/search", userController.searchUsers);
router.get("/:id/reviews", userController.getUserReviews);
router.get("/:id", userController.getOne);
router.get("/", userController.getAll);
router.patch("/:id", auth, userController.updateProfile);
router.delete("/:id", auth, userController.deleteAccount);

module.exports = router;
