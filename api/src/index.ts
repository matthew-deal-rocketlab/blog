// src/server.ts
import express from 'express'
import cors from 'cors'
import verifyToken from './middleware/verifyToken'

import { adminRoutes } from './routes/adminRoutes'
import { authRoutes } from './routes/authRoutes'
import { publicRoutes } from './routes/publicRoutes'
import { userRoutes } from './routes/userRoutes'

const app = express()

const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes

app.use('/api', authRoutes)
app.use('/api', publicRoutes)
app.use('/api', verifyToken, adminRoutes)
app.use('/api', verifyToken, userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
