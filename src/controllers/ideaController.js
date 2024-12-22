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

const getAllIdeas = async (req, res) => {
  try {
    const { page, limit, search } = req.query; //get from query string

    const { ideas, totalIdeas } = await ideaService.getIdeas(
      page,
      limit,
      search
    );

    res.json({
      ideas,
      totalIdeas,
      currentPage: parseInt(page) || 1,
      totalPages: Math.ceil(totalIdeas / (parseInt(limit) || 12)),
    });
  } catch (error) {
    console.error("Error in getAllIdeas controller:", error);
    res.status(500).json({ error: error.message || "Failed to fetch ideas" }); //send error
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

const assignRole = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { collaboratorEmail, newRole } = req.body; //Receive these two from the req body
    const regionalUserId = req.user._id; // Get the regional user's ID (make sure your authentication middleware sets req.user)

    if (!collaboratorEmail || !newRole) {
      // Input validation
      return res
        .status(400)
        .json({ error: "Both collaboratorEmail and newRole is required" });
    }

    const updatedIdea = await ideaService.assignCollaboratorRole(
      regionalUserId,
      ideaId,
      collaboratorEmail,
      newRole
    );

    res.json(updatedIdea); //Return the updated idea
  } catch (error) {
    console.error("Error assigning collaborator role:", error);
    res.status(400).json({ error: error.message || "Failed to assign role." });
  }
};

const addCollaborator = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const collaborator = req.body; // Get collaborator data from the request body

    if (!collaborator) {
      return res
        .status(400)
        .json({ error: "Collaborator's information not found" });
    }

    const updatedIdea = await ideaService.addCollaborator(ideaId, collaborator);
    res.status(200).json(updatedIdea);
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to add collaborator." });
  }
};

const getCollaborators = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const collaborators = await ideaService.getIdeaCollaborators(ideaId);

    res.json(collaborators); //collaborators list in response
  } catch (error) {
    res
      .status(404)
      .json({ error: error.message || "Failed to get collaborators" });
  }
};

const respondToCollaborationRequest = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { collaboratorId, action } = req.body;
    const authorId = req.user._id; // Get the author's ID from the authenticated user

    if (!collaboratorId || !action) {
      return res
        .status(400)
        .json({ error: "Collaborator ID and action are required." });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    if (idea.author.toString() !== authorId.toString()) {
      //Check if he is the author
      return res.status(403).json({
        error: "Only the author can respond to collaboration requests",
      });
    }

    const updatedIdea = await ideaService.handleCollaborationRequest(
      ideaId,
      collaboratorId,
      action
    );

    res.json(updatedIdea);
  } catch (error) {
    console.error("Error responding to collaboration request:", error);
    res.status(400).json({
      error: error.message || "Failed to respond to collaboration request.",
    });
  }
};

export default {
  createIdea,
  getAllIdeas,
  voteIdea,
  commentOnIdea,
  updateIdeaStatus,
  evaluateIdea,
  assignRole,
  addCollaborator,
  getCollaborators,
  respondToCollaborationRequest,
};
