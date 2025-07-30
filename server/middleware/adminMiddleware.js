const admin = (req, res, next) => {
  // This middleware should run AFTER the 'protect' middleware
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: "Not authorized as an admin" }); // 403 Forbidden
  }
};

module.exports = { admin };
