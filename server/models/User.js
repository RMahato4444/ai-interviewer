const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        targetRole: {
            type: String,
            default: "",
            trim: true,
        },

        education: {
            type: String,
            default: "",
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            maxlength: 1000,
        },

        profileImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;