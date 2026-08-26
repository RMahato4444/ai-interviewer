const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========================================
// CREATE UPLOAD DIRECTORY
// ========================================

const uploadDirectory = path.join(
    __dirname,
    "../uploads/resumes"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

// ========================================
// STORAGE
// ========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, filename);
    },
});

// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF and DOCX files are allowed"
            )
        );
    }
};

// ========================================
// MULTER
// ========================================

const upload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;