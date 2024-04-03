const pool = require('../db')
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Router, Request, Response } from 'express'

export type User = {
  id: number
  email: string
  password: string
}

export const authRoutes = Router()

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

authRoutes.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hashedPassword = await hashPassword(password)

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;',
      [email, hashedPassword],
    )

    // If the user was successfully inserted, return the user data
    res.json({ user: result.rows[0], message: 'User registered successfully.' })
  } catch (error: any) {
    console.error(error)
    // Check if the error message indicates a duplicate key violation
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'User already exists' })
    }

    console.error(error)
    res.status(500).json({ error: 'Error creating new user' })
  }
})

authRoutes.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Wrong email or password' })
    }

    const user = rows[0]
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: 'Wrong email or password' })
    }

    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: 'Internal Server Error: JWT Secret Key not set' })
    }

    // Access token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '3h',
    })

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error during login' })
  }
})
