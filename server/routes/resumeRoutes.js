const express = require("express");

const {
    uploadResume,
    analyzeResumeWithAI,
    getUserResumes,
    getResumeById,
    deleteResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ========================================
// GET ALL USER RESUMES
// ========================================

router.get(
    "/",
    protect,
    getUserResumes
);

// ========================================
// UPLOAD RESUME
// ========================================

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);

// ========================================
// GET SINGLE RESUME
// ========================================

router.get(
    "/:resumeId",
    protect,
    getResumeById
);

// ========================================
// ANALYZE RESUME
// ========================================

router.post(
    "/:resumeId/analyze",
    protect,
    analyzeResumeWithAI
);

// ========================================
// DELETE RESUME
// ========================================

router.delete(
    "/:resumeId",
    protect,
    deleteResume
);

module.exports = router;