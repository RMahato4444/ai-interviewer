const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        // The user who owns this resume
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Original uploaded filename
        originalName: {
            type: String,
            required: true,
        },

        // Filename saved on our server
        filename: {
            type: String,
            required: true,
        },

        // Location of the uploaded file
        filePath: {
            type: String,
            required: true,
        },

        // PDF or DOCX
        fileType: {
            type: String,
            required: true,
        },

        // Extracted resume text
        extractedText: {
            type: String,
            default: "",
        },

        // AI analysis will be stored here later
        aiAnalysis: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Resume = mongoose.model(
    "Resume",
    resumeSchema
);

module.exports = Resume;