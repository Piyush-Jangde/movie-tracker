const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );


      req.user = await User.findById(
        decoded.id
      ).select("-password");

      next();

    } else {
      res.status(401).json({
        message: "Not authorized, no token",
      });
    }

  } catch (error) {
  console.log("FULL ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};

module.exports = protect;