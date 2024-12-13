import Idea from "../models/Idea.js";
import User from "../models/User.js";

const createIdea = async (ideaData) => {
  const idea = new Idea(ideaData);
  await idea.save();
  return idea;
};

const updateIdeaStatus = async (ideaId, newStatus) => {
  try {
    if (
      !["Idea Pending", "Idea in Progress", "Idea Being Evaluated"].includes(
        newStatus
      )
    ) {
      throw new Error("Invalid status value");
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      ideaId,
      { status: newStatus },
      { new: true, runValidators: true } // Return the updated document & run validation
    );

    if (!updatedIdea) {
      throw new Error("Idea not found");
    }

    return updatedIdea;
  } catch (error) {
    throw error;
  }
};

const voteIdea = async (ideaId, userId) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const voterIndex = idea.voters.indexOf(userId);

    if (voterIndex === -1) {
      // User has not voted yet
      idea.votes++;
      idea.voters.push(userId);
    } else {
      // User has already voted, so remove the vote
      idea.votes--;
      idea.voters.splice(voterIndex, 1); // efficient way to remove from voters
    }

    await idea.save();
    return idea;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};

const commentOnIdea = async (ideaId, commentData) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    idea.comments.push(commentData);
    await idea.save();
    return idea;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};

const evaluateIdea = async (ideaId, evaluationData) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    idea.evaluation = {
      score: evaluationData.score,
      report: evaluationData.report, // Store Google Drive link directly
    };

    await idea.save();
    return idea;
  } catch (error) {
    throw error;
  }
};

// ... other idea-related service functions as needed

export default {
  createIdea,
  voteIdea,
  commentOnIdea,
  updateIdeaStatus,
  evaluateIdea,
};
