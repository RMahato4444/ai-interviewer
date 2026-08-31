const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");

// ========================================
// GENERATE JWT
// ========================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ========================================
// REGISTER
// ========================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, education, bio } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2. Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 3. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      targetRole: targetRole || "",
      education: education || "",
      bio: bio || "",
    });

    // 7. Generate JWT
    const token = generateToken(user._id);

    // 8. Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        education: user.education,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ========================================
// LOGIN
// ========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id);

    // 6. Return user
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        education: user.education,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
// ========================================
// GET CURRENT USER
// ========================================

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        education: user.education,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// ========================================
// UPDATE PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      targetRole,
      education,
      bio,
    } = req.body;

    // --------------------------------
    // Basic validation
    // --------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // --------------------------------
    // Check whether another user
    // already uses this email
    // --------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
        _id: {
          $ne: req.userId,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already being used by another account",
      });
    }

    // --------------------------------
    // Update user
    // --------------------------------

    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name =
      name.trim();

    user.email =
      normalizedEmail;

    user.targetRole =
      targetRole?.trim() || "";

    user.education =
      education?.trim() || "";

    user.bio =
      bio?.trim() || "";

    await user.save();

    // --------------------------------
    // Response
    // --------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole:
          user.targetRole,
        education:
          user.education,
        bio:
          user.bio,
        profileImage:
          user.profileImage,
        createdAt:
          user.createdAt,
      },
    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile",
    });
  }
};

// ========================================
// UPDATE PROFILE IMAGE
// ========================================

const updateProfileImage = async (
    req,
    res
) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload an image",
            });
        }


        const user =
            await User.findById(
                req.userId
            );


        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }


        // --------------------------------
        // Delete previous image
        // --------------------------------

        if (
            user.profileImage
        ) {

            const previousImagePath =
                path.join(
                    __dirname,
                    "..",
                    user.profileImage
                        .replace(
                            "/uploads/",
                            "uploads/"
                        )
                );

            try {

                if (
                    fs.existsSync(
                        previousImagePath
                    )
                ) {
                    fs.unlinkSync(
                        previousImagePath
                    );
                }

            } catch (
                deleteError
            ) {

                console.error(
                    "OLD PROFILE IMAGE DELETE ERROR:",
                    deleteError
                );

            }
        }


        // --------------------------------
        // Save new image path
        // --------------------------------

        const profileImage =
            `/uploads/profile-images/${req.file.filename}`;


        user.profileImage =
            profileImage;


        await user.save();


        return res.status(200).json({
            success: true,

            message:
                "Profile image updated successfully",

            user: {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                targetRole:
                    user.targetRole,

                education:
                    user.education,

                bio:
                    user.bio,

                profileImage:
                    user.profileImage,

                createdAt:
                    user.createdAt,
            },
        });

    } catch (error) {

        console.error(
            "UPDATE PROFILE IMAGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while updating profile image",
        });
    }
};

// ========================================
// REMOVE PROFILE IMAGE
// ========================================

const removeProfileImage = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found",
            });
        }


        // --------------------------------
        // Delete image file
        // --------------------------------

        if (
            user.profileImage
        ) {

            const relativeImagePath =
                user.profileImage
                    .replace(
                        "/uploads/",
                        ""
                    );


            const imagePath =
                path.join(
                    __dirname,
                    "../uploads",
                    relativeImagePath
                );


            try {

                if (
                    fs.existsSync(
                        imagePath
                    )
                ) {

                    fs.unlinkSync(
                        imagePath
                    );

                }

            } catch (
                fileError
            ) {

                console.error(
                    "PROFILE IMAGE DELETE ERROR:",
                    fileError
                );

            }
        }


        // --------------------------------
        // Clear MongoDB field
        // --------------------------------

        user.profileImage =
            "";

        await user.save();


        return res.status(200).json({
            success: true,

            message:
                "Profile image removed successfully",

            user: {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                targetRole:
                    user.targetRole,

                education:
                    user.education,

                bio:
                    user.bio,

                profileImage:
                    user.profileImage,

                createdAt:
                    user.createdAt,
            },
        });

    } catch (error) {

        console.error(
            "REMOVE PROFILE IMAGE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while removing profile image",
        });
    }
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  getCurrentUser,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
};
