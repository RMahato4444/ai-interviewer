const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // User's answer
    answer: {
      type: String,
      default: "",
    },

    // AI evaluation
    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    strengths: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    answeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    // ========================================
    // USER
    // ========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // RESUME
    // ========================================

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    // ========================================
    // INTERVIEW SETTINGS
    // ========================================

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    interviewType: {
      type: String,
      enum: ["Technical", "Behavioral", "Mixed"],
      default: "Mixed",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    totalQuestions: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },

    // ========================================
    // QUESTIONS
    // ========================================

    questions: {
      type: [questionSchema],
      default: [],
    },

    // ========================================
    // INTERVIEW STATUS
    // ========================================

    status: {
      type: String,
      enum: ["created", "in-progress", "completed", "cancelled"],
      default: "created",
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    // ========================================
    // FINAL RESULT
    // ========================================

    overallScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
