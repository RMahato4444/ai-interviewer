const express = require("express");
const profileImageUpload = require("../middleware/profileImageUploadMiddleware");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Current logged-in user
router.get("/me", protect, getCurrentUser);

// Update current profile

router.put("/profile", protect, updateProfile);

// Update profile image

router.put(
  "/profile/image",
  protect,
  profileImageUpload.single("profileImage"),
  updateProfileImage,
);

// Remove profile image

router.delete("/profile/image", protect, removeProfileImage);

module.exports = router;
