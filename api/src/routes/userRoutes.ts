// src/routes/adminRoutes.ts

import { Router } from 'express'

const pool = require('../db')

export const userRoutes = Router()

// get user by id
userRoutes.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id)

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1;', [userId])

    if (rows.length === 0) {
      return res.status(404).json('User not found')
    }

    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json('Error retrieving the user')
  }
})
