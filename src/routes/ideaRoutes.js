import express from "express";
import ideaController from "../controllers/ideaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", ideaController.createIdea);
router.get("/", ideaController.getAllIdeas);
router.patch("/:ideaId/status", ideaController.updateIdeaStatus);
router.post("/:ideaId/vote", ideaController.voteIdea); // vote route
router.post("/:ideaId/comment", ideaController.commentOnIdea); // comment route
router.post(
  "/:ideaId/evaluate",
  authMiddleware.authorizeInnovation,
  ideaController.evaluateIdea
); // Evaluate Idea by Innovation manager
router.post("/:ideaId/req-collaboration", ideaController.addCollaborator);
router.patch(
  "/:ideaId/collaborators/:collaboratorId",
  ideaController.respondToCollaborationRequest
);
router.get("/:ideaId/collaborators", ideaController.getCollaborators);
router.patch("/:ideaId/assign-role", ideaController.assignRole); // maybe add authmiddleware for regional user in future

export default router;
