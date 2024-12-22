import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        comment: {
          type: String,
          required: true,
        },
        commentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: {
          type: String,
          enum: [
            "General",
            "Team Leader",
            "Researcher",
            "Developer",
            "Designer",
            "Analyst",
          ],
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted"],
          default: "Pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Idea Pending", "Idea in Progress", "Idea Being Evaluated"], // Allowed values
      default: "Idea Pending", // Initial status
    },
    evaluation: {
      score: {
        type: Number,
        min: 0,
        max: 10,
      },
      report: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Idea", ideaSchema);
