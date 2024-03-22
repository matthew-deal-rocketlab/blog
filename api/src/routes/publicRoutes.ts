import { Router } from 'express'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
const pool = require('../db')

interface Post {
  id: number
  title: string
  sub_title: string
  content: string
  created_at: string
}

export const publicRoutes = Router()

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title'],
  },
}

// Get all posts
publicRoutes.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC;')

    const processedPosts = rows.map((post: Post) => ({
      ...post,
      content: sanitizeHtml(marked(post.content) as string, sanitizeOptions),
    }))

    res.json(processedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error retrieving posts')
  }
})

// Get a single post using marked
publicRoutes.get('/posts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1;', [id])

    if (rows.length === 0) {
      return res.status(404).send('Post not found')
    }

    const post = rows[0]
    // Convert markdown content to HTML
    const htmlContent = marked(post.content)
    // Sanitize the HTML content
    const safeHtmlContent = sanitizeHtml(htmlContent as string, sanitizeOptions)

    // Return the post with HTML content
    res.json({
      ...post,
      content: safeHtmlContent,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error retrieving the post')
  }
})
