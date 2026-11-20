
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 2. Validate name
    const trimmedName = name.trim();

    if (trimmedName.length < 20 || trimmedName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters"
      });
    }

    // 3. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // 4. Validate address
    if (address.length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters"
      });
    }

    // 5. Validate password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
      });
    }

    // 6. Check whether email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered"
      });
    }

    // 7. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8. Create user
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email,
        address,
        password: hashedPassword,
        role: "USER"
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 3. Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Check required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // 2. Validate new password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
      });
    }

    // 3. Get logged-in user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 4. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // 5. Prevent reusing the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    // 6. Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Update password error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { signup, login, updatePassword, getMe };