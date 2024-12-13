import User from "../models/User.js";

const authorizeInnovation = async (req, res, next) => {
  try {
    const { userId } = req.body; // Get the userId from the request body (ensure it's sent from the frontend)

    if (!userId) {
      //Handle missing userId
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "innovation") {
      return res.status(403).json({
        error: "You are not Innovation Manager",
      });
    }

    req.user = user; // Add user to the request object for later use if needed.

    next();
  } catch (error) {
    console.error("Error in authorizeInnovation middleware:", error);
    res.status(500).json({
      error: error.message || "An error occurred during authorization",
    });
  }
};

export default { authorizeInnovation };
