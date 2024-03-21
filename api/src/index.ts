// src/server.ts
import express from "express";
import cors from "cors";

import { mainRoutes } from "./routes/mainRoutes";
import { postRoutes } from "./routes/postRoutes";

import { loggerMiddleware } from "./middleware/logger";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(loggerMiddleware); // Use the logger middleware

// Routes

app.use(mainRoutes);
app.use("/api", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
