import ideaService from "../services/ideaService.js";
import mongoose from "mongoose";

const createIdea = async (req, res) => {
  try {
    const idea = await ideaService.createIdea(req.body);
    res.status(201).json(idea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const voteIdea = async (req, res) => {
  try {
    const { ideaId } = req.params; // Get the ideaId from the URL parameters
    const { userId } = req.body;

    if (!userId) {
      // Check if userId is provided in the body
      return res.status(400).json({ error: "User ID is required" });
    }

    //Validation: Critical - check if userId is a valid ObjectId.
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" }); // Important: Return immediately if invalid
    }

    const updatedIdea = await ideaService.voteIdea(ideaId, userId);

    res.json(updatedIdea);
  } catch (error) {
    console.error("Error in voteIdea controller:", error);
    res.status(400).json({ error: error.message }); // Handle errors gracefully
  }
};

const updateIdeaStatus = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { status } = req.body;

    const updatedIdea = await ideaService.updateIdeaStatus(ideaId, status);
    res.json(updatedIdea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const commentOnIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { userId } = req.body;
    const { comment } = req.body;

    //Validation: Critical - check if userId is a valid ObjectId.
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" }); // Important: Return immediately if invalid
    }

    const commentData = {
      comment,
      commentBy: userId,
    };

    const updatedIdea = await ideaService.commentOnIdea(ideaId, commentData);

    res.json(updatedIdea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const evaluateIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { score, report } = req.body; // Get score AND report (Google Drive link) from body

    const updatedIdea = await ideaService.evaluateIdea(ideaId, {
      score,
      report,
    }); // Pass the report link
    res.status(200).json(updatedIdea);
  } catch (error) {
    console.error("Error in evaluateIdea controller:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate idea" });
  }
};

export default {
  createIdea,
  voteIdea,
  commentOnIdea,
  updateIdeaStatus,
  evaluateIdea,
};
