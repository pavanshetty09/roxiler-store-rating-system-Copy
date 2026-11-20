
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Restrict access to selected roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }

    next();
  };
};

module.exports = authMiddleware;
module.exports.authorizeRoles = authorizeRoles;
