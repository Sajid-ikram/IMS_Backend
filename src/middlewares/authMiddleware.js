import User from "../models/User.js";

const authorizeRole = (roles) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.body; // Get the userId from the request body (ensure it's sent from the frontend)

      if (!userId) {
        // Handle missing userId
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: `You do not have the required role. Required roles: ${roles.join(
            ", "
          )}`,
        });
      }

      req.user = user; // Add user to the request object for later use if needed.

      next();
    } catch (error) {
      console.error("Error in authorizeRole middleware:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export const authorizeInnovation = authorizeRole(["Innovation"]);
export const authorizeAdmin = authorizeRole(["Admin"]);
export const authorizeRegional = authorizeRole(["Regional"]);
