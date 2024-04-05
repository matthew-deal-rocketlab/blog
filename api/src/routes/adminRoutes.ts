// src/routes/adminRoutes.ts
import { Router } from 'express'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { sanitizeOptions } from './publicRoutes'
import { Post } from '../types/postTypes'

const pool = require('../db')

export const adminRoutes = Router()

// Create a new post
adminRoutes.post('/posts', async (req, res) => {
  const { title, content, sub_title, category, type } = req.body

  if (!req.user || !req.user.id) {
    return res.status(403).send('Unauthorized access - user not identified')
  }
  const user_id = req.user.id

  if (type == null || type === '') {
    return res.status(400).send('Missing type')
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, sub_title, category, type, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      [title, content, sub_title, category, type, user_id],
    )

    const newPost = rows[0]
    res.status(200).json(newPost)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating the post')
  }
})

// Delete a post
adminRoutes.delete('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id)

  if (!req.user || !req.user.id) {
    return res.status(403).send('Unauthorized access - user not identified')
  }

  try {
    const fetchRes = await pool.query('SELECT * FROM posts WHERE id = $1;', [postId])

    if (fetchRes.rows.length === 0) {
      return res.status(404).send('Post not found')
    }

    // Check if the user ID associated with the post matches the authenticated user ID
    if (fetchRes.rows[0].user_id !== req.user.id) {
      return res.status(403).send('Unauthorized access - user not authorized to delete this post')
    }

    await pool.query('DELETE FROM posts WHERE id = $1;', [postId])

    res.json(fetchRes.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send('Error deleting the post')
  }
})

// Update a post
adminRoutes.put('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id)
  const { title, content, sub_title, category, type } = req.body

  if (!req.user || !req.user.id) {
    return res.status(403).json('Unauthorized access - user not identified')
  }

  try {
    const fetchRes = await pool.query('SELECT * FROM posts WHERE id = $1;', [postId])

    if (fetchRes.rows.length === 0) {
      return res.status(404).json('Post not found')
    }

    // Check if the user ID associated with the post matches the authenticated user ID
    if (fetchRes.rows[0].user_id !== req.user.id) {
      return res.status(403).json('Unauthorized access - user not authorized to update this post')
    }

    const { rows } = await pool.query(
      'UPDATE posts SET title = $1, content = $2, sub_title = $3, category = $4, type = $5 WHERE id = $6 RETURNING *;',
      [title, content, sub_title, category, type, postId],
    )

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json('Error updating the post')
  }
})

// Get all posts for the authenticated user
adminRoutes.get('/my-posts', async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(403).json('Unauthorized access - user not identified')
  }
  const user_id = req.user.id

  try {
    const { rows } = await pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC;',
      [user_id],
    )
    const processedPosts = rows.map((post: Post) => ({
      ...post,
      content: sanitizeHtml(marked(post.content) as string, sanitizeOptions),
    }))

    res.json(processedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json('Error retrieving user posts')
  }
})
