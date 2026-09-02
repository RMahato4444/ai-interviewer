const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateFinalInterviewFeedback,
} = require("../services/groqService");
// } = require("../services/geminiService");

// ========================================
// CREATE INTERVIEW
// ========================================

const createInterview = async (req, res) => {
  try {
    const { targetRole, interviewType, difficulty, totalQuestions, resumeId } =
      req.body;

    const interviewTypeMap = {
      technical: "Technical",
      behavioral: "Behavioral",
      mixed: "Mixed",

      Technical: "Technical",
      Behavioral: "Behavioral",
      Mixed: "Mixed",

      HR: "Behavioral",
    };

    const normalizedInterviewType = interviewTypeMap[interviewType] || "Mixed";

    // ========================================
    // VALIDATION
    // ========================================

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Target role is required",
      });
    }

    const questionCount = Number(totalQuestions) || 5;

    if (questionCount < 1 || questionCount > 20) {
      return res.status(400).json({
        success: false,
        message: "Number of questions must be between 1 and 20",
      });
    }

    // ========================================
    // FIND RESUME
    // ========================================

    let resume = null;

    if (resumeId) {
      if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resume ID",
        });
      }

      resume = await Resume.findOne({
        _id: resumeId,
        user: req.userId,
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }
    }

    // ========================================
    // RESUME ANALYSIS
    // ========================================

    let resumeAnalysis = {};

    if (resume) {
      resumeAnalysis = resume.aiAnalysis || {};
    }

    // ========================================
    // GENERATE QUESTIONS USING GEMINI
    // ========================================

    const aiResponse = await generateInterviewQuestions({
      targetRole: targetRole.trim(),

      interviewType: normalizedInterviewType,

      difficulty: difficulty || "Medium",

      totalQuestions: questionCount,

      resumeAnalysis,
    });

    // ========================================
    // PARSE AI RESPONSE
    // ========================================

    let generatedData;

    try {
      generatedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("QUESTION JSON PARSE ERROR:", parseError.message);

      console.error("AI RESPONSE:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid question format",
      });
    }

    // ========================================
    // VALIDATE QUESTIONS
    // ========================================

    if (!generatedData.questions || !Array.isArray(generatedData.questions)) {
      return res.status(500).json({
        success: false,
        message: "AI did not return valid questions",
      });
    }

    if (generatedData.questions.length !== questionCount) {
      return res.status(500).json({
        success: false,
        message: "AI generated an incorrect number of questions",
      });
    }

    // ========================================
    // CLEAN QUESTIONS
    // ========================================

    const questions = generatedData.questions.map((item) => ({
      question: item.question,

      category: item.category || "General",

      difficulty: item.difficulty || difficulty || "Medium",

      answer: "",

      feedback: "",

      score: null,

      strengths: [],

      improvements: [],

      answeredAt: null,
    }));

    // ========================================
    // CREATE INTERVIEW
    // ========================================

    const interview = await Interview.create({
      user: req.userId,

      resume: resume ? resume._id : null,

      targetRole: targetRole.trim(),

      interviewType: normalizedInterviewType,

      difficulty: difficulty || "Medium",

      totalQuestions: questionCount,

      questions,

      status: "created",

      currentQuestionIndex: 0,
    });

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,

      message: "Interview created successfully",

      interview: {
        id: interview._id,

        targetRole: interview.targetRole,

        interviewType: interview.interviewType,

        difficulty: interview.difficulty,

        totalQuestions: interview.totalQuestions,

        status: interview.status,

        questions: interview.questions,

        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error("CREATE INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create interview",
    });
  }
};

// ========================================
// GET USER INTERVIEW HISTORY
// ========================================

const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.userId,
    })
      .select(
        "targetRole interviewType difficulty totalQuestions status overallScore createdAt startedAt completedAt",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: interviews.length,

      interviews,
    });
  } catch (error) {
    console.error("GET INTERVIEW HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
};

// ========================================
// GET SINGLE INTERVIEW
// ========================================

const getInterviewById = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId,
    }).populate("resume", "originalName aiAnalysis");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview",
    });
  }
};

// ========================================
// DELETE INTERVIEW
// ========================================

const deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    await Interview.deleteOne({
      _id: interviewId,
    });

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("DELETE INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete interview",
    });
  }
};

// ========================================
// START INTERVIEW
// ========================================

const startInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview is already completed",
      });
    }

    interview.status = "in-progress";

    interview.startedAt = new Date();

    interview.currentQuestionIndex = 0;

    await interview.save();

    return res.status(200).json({
      success: true,

      message: "Interview started successfully",

      interview: {
        id: interview._id,

        status: interview.status,

        currentQuestionIndex: interview.currentQuestionIndex,

        currentQuestion: interview.questions[0],

        totalQuestions: interview.totalQuestions,

        startedAt: interview.startedAt,
      },
    });
  } catch (error) {
    console.error("START INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

// ========================================
// SUBMIT INTERVIEW ANSWER
// ========================================

const submitAnswer = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const { answer } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // ========================================
    // FIND INTERVIEW
    // ========================================

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // ========================================
    // CHECK INTERVIEW STATUS
    // ========================================

    if (interview.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Interview is not in progress",
      });
    }

    // ========================================
    // CURRENT QUESTION
    // ========================================

    const currentIndex = interview.currentQuestionIndex;

    const currentQuestion = interview.questions[currentIndex];

    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: "No current question found",
      });
    }

    // ========================================
    // EVALUATE ANSWER USING GEMINI
    // ========================================

    const aiResponse = await evaluateInterviewAnswer({
      question: currentQuestion.question,

      answer: answer.trim(),

      targetRole: interview.targetRole,

      difficulty: interview.difficulty,
    });

    // ========================================
    // PARSE AI RESPONSE
    // ========================================

    let evaluation;

    try {
      evaluation = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("ANSWER EVALUATION JSON ERROR:", parseError.message);

      console.error("AI RESPONSE:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid evaluation format",
      });
    }

    // ========================================
    // VALIDATE EVALUATION
    // ========================================

    if (typeof evaluation.score !== "number") {
      return res.status(500).json({
        success: false,
        message: "Invalid score returned by AI",
      });
    }

    // ========================================
    // SAVE ANSWER
    // ========================================

    currentQuestion.answer = answer.trim();

    currentQuestion.feedback = evaluation.feedback || "";

    currentQuestion.score = Math.max(0, Math.min(100, evaluation.score));

    currentQuestion.strengths = Array.isArray(evaluation.strengths)
      ? evaluation.strengths
      : [];

    currentQuestion.improvements = Array.isArray(evaluation.improvements)
      ? evaluation.improvements
      : [];

    currentQuestion.answeredAt = new Date();

    // ========================================
    // CHECK IF THIS WAS THE LAST QUESTION
    // ========================================

    const isLastQuestion = currentIndex >= interview.questions.length - 1;

    if (isLastQuestion) {
      // ========================================
      // CALCULATE OVERALL SCORE
      // ========================================

      const scores = interview.questions.map((question) =>
        typeof question.score === "number" ? question.score : 0,
      );

      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      const overallScore = Math.round(totalScore / scores.length);

      interview.overallScore = overallScore;

      // ========================================
      // GENERATE FINAL AI FEEDBACK
      // ========================================

      let finalFeedback = {
        overallFeedback: "",
        strengths: [],
        weaknesses: [],
        recommendations: [],
      };

      try {
        const aiResponse = await generateFinalInterviewFeedback({
          targetRole: interview.targetRole,

          interviewType: interview.interviewType,

          difficulty: interview.difficulty,

          questions: interview.questions,

          overallScore,
        });

        finalFeedback = JSON.parse(aiResponse);
      } catch (error) {
        console.error("FINAL FEEDBACK ERROR:", error.message);
      }

      // ========================================
      // SAVE FINAL FEEDBACK
      // ========================================

      interview.overallFeedback = finalFeedback.overallFeedback || "";

      interview.strengths = Array.isArray(finalFeedback.strengths)
        ? finalFeedback.strengths
        : [];

      interview.weaknesses = Array.isArray(finalFeedback.weaknesses)
        ? finalFeedback.weaknesses
        : [];

      interview.recommendations = Array.isArray(finalFeedback.recommendations)
        ? finalFeedback.recommendations
        : [];

      // ========================================
      // COMPLETE INTERVIEW
      // ========================================

      interview.status = "completed";

      interview.completedAt = new Date();

      interview.currentQuestionIndex = currentIndex;

      await interview.save();

      // ========================================
      // RETURN FINAL RESULT
      // ========================================

      return res.status(200).json({
        success: true,

        message: "Interview completed",

        completed: true,

        evaluation: {
          score: currentQuestion.score,

          feedback: currentQuestion.feedback,

          strengths: currentQuestion.strengths,

          improvements: currentQuestion.improvements,
        },

        result: {
          overallScore: interview.overallScore,

          overallFeedback: interview.overallFeedback,

          strengths: interview.strengths,

          weaknesses: interview.weaknesses,

          recommendations: interview.recommendations,

          totalQuestions: interview.totalQuestions,

          completedAt: interview.completedAt,
        },
      });
    }

    // ========================================
    // MOVE TO NEXT QUESTION
    // ========================================

    interview.currentQuestionIndex = currentIndex + 1;

    await interview.save();

    const nextQuestion = interview.questions[currentIndex + 1];

    return res.status(200).json({
      success: true,

      message: "Answer evaluated successfully",

      completed: false,

      evaluation: {
        score: currentQuestion.score,

        feedback: currentQuestion.feedback,

        strengths: currentQuestion.strengths,

        improvements: currentQuestion.improvements,
      },

      nextQuestion: {
        index: currentIndex + 1,

        question: nextQuestion.question,

        category: nextQuestion.category,

        difficulty: nextQuestion.difficulty,
      },
    });
  } catch (error) {
    console.error("SUBMIT ANSWER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
    });
  }
};

// ========================================
// GET INTERVIEW RESULT
// ========================================

const getInterviewResult = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview ID",
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      user: req.userId,
      status: "completed",
    }).populate("resume", "originalName");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Completed interview not found",
      });
    }

    return res.status(200).json({
      success: true,

      result: {
        id: interview._id,

        targetRole: interview.targetRole,

        interviewType: interview.interviewType,

        difficulty: interview.difficulty,

        totalQuestions: interview.totalQuestions,

        overallScore: interview.overallScore,

        overallFeedback: interview.overallFeedback,

        strengths: interview.strengths,

        weaknesses: interview.weaknesses,

        recommendations: interview.recommendations,

        questions: interview.questions,

        startedAt: interview.startedAt,

        completedAt: interview.completedAt,

        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error("GET INTERVIEW RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview result",
    });
  }
};

module.exports = {
  createInterview,
  getUserInterviews,
  getInterviewById,
  deleteInterview,
  startInterview,
  submitAnswer,
  getInterviewResult,
};
