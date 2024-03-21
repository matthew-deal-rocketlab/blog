import { Router } from "express";

export const mainRoutes = Router();

mainRoutes.get("/", (req, res) => {
  res.send("Hello, World!");
});

mainRoutes.get("/api/greet", (req, res) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}!` });
});
