import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.post("/", userController.createUser); // Create a new user

// ... other user routes ...

export default router;
