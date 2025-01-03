import Idea from "../models/Idea.js";
import User from "../models/User.js";

const createIdea = async (ideaData) => {
  try {
    const { author } = ideaData;
    const user = await User.findById(author);
    if (!user) {
      throw new Error("User not found");
    }
    const idea = new Idea(ideaData);
    await idea.save();

    const updatedUser = await User.findByIdAndUpdate(
      author,
      {
        $push: { postedIdeas: idea._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found for updating the idea.");
    }

    return idea;
  } catch (error) {
    throw error;
  }
};

const getUserPostedIdeas = async (userId) => {
  try {
    const ideas = await Idea.find({ author: userId }); // Find ideas where author matches userId
    return ideas;
  } catch (error) {
    throw error;
  }
};

const getIdeas = async (page = 1, limit = 12, search) => {
  //default limit = 12
  try {
    const query = search ? { content: { $regex: search, $options: "i" } } : {};

    const options = {
      sort: { createdAt: -1 }, // Sort by creation date (newest first)
      skip: (page - 1) * limit,
      limit: limit * 1,
    };

    const ideas = await Idea.find(query, null, options);

    const totalIdeas = await Idea.countDocuments(query);

    return { ideas, totalIdeas };
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to fetch ideas.");
  }
};

const getIdeaDetails = async (ideaId) => {
  try {
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      throw new Error("Idea not found");
    }
    return idea;
  } catch (error) {
    throw error;
  }
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

const assignCollaboratorRole = async (
  regionalUserId,
  ideaId,
  collaboratorEmail,
  newRole
) => {
  try {
    const regionalUser = await User.findById(regionalUserId);
    if (!regionalUser || regionalUser.role !== "regional") {
      throw new Error("Only regional users can assign collaborator roles.");
    }

    if (
      ![
        "Team Leader",
        "Researcher",
        "Developer",
        "Designer",
        "Analyst",
      ].includes(newRole)
    ) {
      throw new Error("Invalid Role provided");
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found.");
    }

    const collaboratorIndex = idea.collaborators.findIndex(
      (collaborator) => collaborator.email === collaboratorEmail
    );

    if (collaboratorIndex === -1) {
      throw new Error("Collaborator not found on this idea.");
    }

    if (idea.collaborators[collaboratorIndex].role === newRole) {
      throw new Error("Collaborator already has this role.");
    }

    idea.collaborators[collaboratorIndex].role = newRole; //Efficient way to update
    await idea.save();

    return idea;
  } catch (error) {
    throw error;
  }
};

const addCollaborator = async (ideaId, collaborator) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    const collaboratorExists = idea.collaborators.some(
      (c) => c.user.toString() === collaborator._id.toString()
    );

    if (collaboratorExists) {
      throw new Error("User already requested for collaboration");
    }

    const user = await User.findById(collaborator._id);

    if (!user) {
      throw new Error("User not found");
    }

    const collaboratorToAdd = {
      user: collaborator._id,
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role || "General", // Default role
    };

    idea.collaborators.push(collaboratorToAdd);
    await idea.save();
    return idea;
  } catch (error) {
    throw error;
  }
};

const getIdeaCollaborators = async (ideaId) => {
  try {
    const idea = await Idea.findById(ideaId)
      .populate("collaborators.user", "name, email, role, status, _id")
      .populate("author", "name, _id, email, role"); // Populate the author field

    if (!idea) {
      throw new Error("Idea not found");
    }

    // Extract just the necessary collaborator information to send.
    const collaborators = idea.collaborators.map((collaborator) => ({
      user: collaborator.user?._id,
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role,
      status: collaborator.status,
      _id: collaborator._id,
    }));

    return {
      author: {
        _id: idea.author._id,
        name: idea.author.name,
        email: idea.author.email,
        role: idea.author.role,
      },
      collaborators,
    };
  } catch (error) {
    throw error;
  }
};

const handleCollaborationRequest = async (
  ideaId,
  collaboratorId,
  action,
  authorId
) => {
  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    if (idea.author.toString() !== authorId.toString()) {
      throw new Error("Only the author can respond to collaboration requests");
    }

    const collaboratorIndex = idea.collaborators.findIndex(
      (c) => c.user.toString() === collaboratorId
    );

    if (collaboratorIndex === -1) {
      throw new Error("Collaborator not found for this idea.");
    }

    if (action === "accept") {
      idea.collaborators[collaboratorIndex].status = "Accepted";
    } else if (action === "reject") {
      idea.collaborators.splice(collaboratorIndex, 1); // Remove collaborator
    } else {
      throw new Error('Invalid action. Must be "accept" or "reject".');
    }

    await idea.save();
    return idea;
  } catch (error) {
    throw error;
  }
};

// ... other idea-related service functions as needed

export default {
  createIdea,
  getUserPostedIdeas,
  getIdeas,
  getIdeaDetails,
  voteIdea,
  commentOnIdea,
  updateIdeaStatus,
  evaluateIdea,
  assignCollaboratorRole,
  addCollaborator,
  getIdeaCollaborators,
  handleCollaborationRequest,
};
