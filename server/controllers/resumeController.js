const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const Resume = require("../models/Resume");
const {
    analyzeResume,
} = require("../services/groqService");
// } = require("../services/geminiService");



// ========================================
// EXTRACT TEXT FROM PDF
// ========================================

const extractPdfText = async (filePath) => {
    const dataBuffer = fs.readFileSync(
        filePath
    );

    const data = await pdfParse(dataBuffer);

    return data.text;
};

// ========================================
// EXTRACT TEXT FROM DOCX
// ========================================

const extractDocxText = async (filePath) => {
    const result =
        await mammoth.extractRawText({
            path: filePath,
        });

    return result.value;
};

// ========================================
// UPLOAD RESUME
// ========================================

const uploadResume = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume",
            });
        }

        const file = req.file;

        let extractedText = "";

        // ====================================
        // PDF
        // ====================================

        if (
            file.mimetype ===
            "application/pdf"
        ) {
            extractedText =
                await extractPdfText(
                    file.path
                );
        }

        // ====================================
        // DOCX
        // ====================================

        else if (
            file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            extractedText =
                await extractDocxText(
                    file.path
                );
        }

        // ====================================
        // SAVE TO DATABASE
        // ====================================

        const resume = await Resume.create({
            user: req.userId,

            originalName:
                file.originalname,

            filename:
                file.filename,

            filePath:
                file.path,

            fileType:
                file.mimetype,

            extractedText:
                extractedText.trim(),
        });

        return res.status(201).json({
            success: true,
            message:
                "Resume uploaded successfully",

            resume: {
                id: resume._id,

                originalName:
                    resume.originalName,

                fileType:
                    resume.fileType,

                extractedText:
                    resume.extractedText,

                createdAt:
                    resume.createdAt,
            },
        });
    } catch (error) {
        console.error(
            "RESUME UPLOAD ERROR:",
            error
        );

        // Delete uploaded file if processing failed
        if (req.file?.path) {
            try {
                fs.unlinkSync(
                    req.file.path
                );
            } catch (deleteError) {
                console.error(
                    "FILE DELETE ERROR:",
                    deleteError.message
                );
            }
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to process resume",
        });
    }
};
// ========================================
// ANALYZE RESUME WITH AI
// ========================================

const analyzeResumeWithAI = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // Find resume belonging to logged-in user
        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.userId,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        // Make sure extracted text exists
        if (
            !resume.extractedText ||
            resume.extractedText.trim().length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "No resume text available for analysis",
            });
        }

        // Send resume text to Gemini
        const aiResponse =
            await analyzeResume(
                resume.extractedText
            );

        let analysis;

        try {
            analysis = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error(
                "AI JSON PARSE ERROR:",
                parseError.message
            );

            console.error(
                "AI RESPONSE:",
                aiResponse
            );

            return res.status(500).json({
                success: false,
                message:
                    "AI returned an invalid analysis format",
            });
        }

        // Save AI analysis
        resume.aiAnalysis = analysis;

        await resume.save();

        return res.status(200).json({
            success: true,
            message:
                "Resume analyzed successfully",

            analysis,
        });
    } catch (error) {
        console.error(
            "AI RESUME ANALYSIS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to analyze resume",
        });
    }
};

// ========================================
// GET ALL USER RESUMES
// ========================================

const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({
            user: req.userId,
        })
            .select(
                "-extractedText -filePath -filename"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            resumes,
        });
    } catch (error) {
        console.error(
            "GET RESUMES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resumes",
        });
    }
};

// ========================================
// GET SINGLE RESUME
// ========================================

const getResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.userId,
        }).select(
            "-filePath -filename"
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        return res.status(200).json({
            success: true,
            resume,
        });
    } catch (error) {
        console.error(
            "GET RESUME ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resume",
        });
    }
};

// ========================================
// DELETE RESUME
// ========================================

const deleteResume = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.userId,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        // Delete physical file
        if (
            resume.filePath &&
            fs.existsSync(resume.filePath)
        ) {
            fs.unlinkSync(resume.filePath);
        }

        // Delete database record
        await Resume.deleteOne({
            _id: resumeId,
        });

        return res.status(200).json({
            success: true,
            message:
                "Resume deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE RESUME ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete resume",
        });
    }
};

module.exports = {
    uploadResume,
    analyzeResumeWithAI,
    getUserResumes,
    getResumeById,
    deleteResume,
};