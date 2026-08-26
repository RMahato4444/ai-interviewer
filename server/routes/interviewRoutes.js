const express = require("express");

const {
    createInterview,
    getUserInterviews,
    getInterviewById,
    deleteInterview,
    startInterview,
    submitAnswer,
    getInterviewResult,
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// CREATE INTERVIEW
// ========================================

router.post(
    "/",
    protect,
    createInterview
);

// ========================================
// GET USER INTERVIEWS
// ========================================

router.get(
    "/",
    protect,
    getUserInterviews
);

router.get(
    "/:interviewId/result",
    protect,
    getInterviewResult
);

// ========================================
// GET SINGLE INTERVIEW
// ========================================

router.get(
    "/:interviewId",
    protect,
    getInterviewById
);

router.post(
    "/:interviewId/start",
    protect,
    startInterview
);

router.post(
    "/:interviewId/answer",
    protect,
    submitAnswer
);

// ========================================
// DELETE INTERVIEW
// ========================================

router.delete(
    "/:interviewId",
    protect,
    deleteInterview
);

module.exports = router;