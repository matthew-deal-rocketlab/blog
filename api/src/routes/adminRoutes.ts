// src/routes/adminRoutes.ts
import { Router } from 'express'

const pool = require('../db')

export const adminRoutes = Router()

// Create a new post
adminRoutes.post('/posts', async (req, res) => {
  const { title, content, sub_title } = req.body
  if (!title || !content || !sub_title) {
    return res.status(400).send('Missing title or content')
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, sub_title) VALUES ($1, $2, $3) RETURNING *;',
      [title, content, sub_title],
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

  try {
    const fetchRes = await pool.query('SELECT * FROM posts WHERE id = $1;', [postId])

    if (fetchRes.rows.length === 0) {
      return res.status(404).send('Post not found')
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
  const { title, content, sub_title } = req.body

  try {
    const fetchRes = await pool.query('SELECT * FROM posts WHERE id = $1;', [postId])

    if (fetchRes.rows.length === 0) {
      return res.status(404).send('Post not found')
    }

    const { rows } = await pool.query(
      'UPDATE posts SET title = $1, content = $2, sub_title = $3 WHERE id = $4 RETURNING *;',
      [title, content, sub_title, postId],
    )

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating the post')
  }
})
