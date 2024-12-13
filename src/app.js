import express from "express";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import * as dotenv from "dotenv"; // Use dotenv correctly
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable parsing of JSON request bodies

app.use("/api/users", userRoutes);
app.use("/api/ideas", ideaRoutes);

// Start the server after connecting to the database
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB and start server:", err);
  });
