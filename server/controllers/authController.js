const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const { password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Return response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    // Compare password
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({
      message: "Invalid email or password",
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
