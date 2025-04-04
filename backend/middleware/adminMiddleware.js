const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access Denied, Admins Only" });
    }
    next();
  };
  
  module.exports = adminMiddleware;
  