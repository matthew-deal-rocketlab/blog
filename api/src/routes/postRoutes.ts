// src/routes/postRoutes.ts
import { Router } from "express";
import { marked } from "marked";

interface Post {
  id: number;
  title: string;
  sub_title: string;
  content: string;
  created_at: string;
}

const pool = require("../db");
const sanitizeHtml = require("sanitize-html");

export const postRoutes = Router();

// Get all posts
postRoutes.get("/posts", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC;"
    );

    const processedPosts = rows.map((post: Post) => ({
      ...post,
      content: sanitizeHtml(marked(post.content)),
    }));

    res.json(processedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});

// Get a single post using marked
postRoutes.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1;", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    const post = rows[0];
    // Convert markdown content to HTML
    const htmlContent = marked(post.content);
    // Sanitize the HTML content
    const safeHtmlContent = sanitizeHtml(htmlContent);

    // Return the post with HTML content
    res.json({
      ...post,
      content: safeHtmlContent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving the post");
  }
});

// Create a new post
postRoutes.post("/posts", async (req, res) => {
  const { title, content, sub_title } = req.body;
  if (!title || !content || !sub_title) {
    return res.status(400).send("Missing title or content");
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO posts (title, content, sub_title) VALUES ($1, $2, $3) RETURNING *;",
      [title, content, sub_title]
    );

    const newPost = rows[0];
    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the post");
  }
});

// Delete a post
postRoutes.delete("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const fetchRes = await pool.query("SELECT * FROM posts WHERE id = $1;", [
      postId,
    ]);

    if (fetchRes.rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    await pool.query("DELETE FROM posts WHERE id = $1;", [postId]);

    res.json(fetchRes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the post");
  }
});

// Update a post
postRoutes.put("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, sub_title } = req.body;

  try {
    const fetchRes = await pool.query("SELECT * FROM posts WHERE id = $1;", [
      postId,
    ]);

    if (fetchRes.rows.length === 0) {
      return res.status(404).send("Post not found");
    }

    const { rows } = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;",
      [title, content, postId, sub_title]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the post");
  }
});
