import express from "express";
import ideaController from "../controllers/ideaController.js";
import {
  authorizeInnovation,
  authorizeRegional,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", ideaController.createIdea);
router.get("/:userId/my-ideas", ideaController.getUserIdeas); // GET route for user's ideas
router.get("/", ideaController.getAllIdeas);
router.get("/:ideaId", ideaController.getIdea);
router.patch(
  "/:ideaId/status",
  authorizeInnovation,
  ideaController.updateIdeaStatus
);
router.post("/:ideaId/vote", ideaController.voteIdea); // vote route
router.post("/:ideaId/comment", ideaController.commentOnIdea); // comment route
router.post(
  "/:ideaId/evaluate",
  authorizeInnovation,
  ideaController.evaluateIdea
); // Evaluate Idea by Innovation manager
router.post("/:ideaId/req-collaboration", ideaController.addCollaborator);
router.patch(
  "/:ideaId/collaborators/",
  ideaController.respondToCollaborationRequest
);
router.get("/:ideaId/collaborators", ideaController.getCollaborators);
router.patch(
  "/:ideaId/assign-role",
  authorizeRegional,
  ideaController.assignRole
); // maybe add authmiddleware for regional user in future

export default router;
