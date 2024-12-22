import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.post("/", userController.createUser); // Create a new user
router.post("/login", userController.login); // login
router.patch("/change-role", userController.changeRole); // change role by admin. // maybe add authmiddleware for admin user in future

// ... other user routes ...

export default router;
