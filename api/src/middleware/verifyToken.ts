import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

require('dotenv').config()

interface User {
  id: number
  email: string
}

// This represents the structure of your JWT payload
interface UserPayload {
  id: User['id']
  email: User['email']
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const response = req.headers['authorization']

  const token = response?.split(' ')[1]

  console.log('Token:', token)
  console.log('JWT Secret Key:', process.env.JWT_SECRET_KEY)

  if (!token) {
    console.log('No token')
    return res.status(403).send('A token is required for authentication')
  }

  if (!process.env.JWT_SECRET_KEY) {
    console.log('No JWT Secret Key')
    return res.status(500).send('Internal Server Error: JWT Secret Key not set')
  }

  try {
    console.log('Decoding token')
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as UserPayload
    console.log('Decoded:', decoded)
    req.user = decoded

    console.log('Decoded:', decoded)
  } catch (error) {
    console.error('Error verifying token:', (error as Error).message)
    return res.status(401).send('Invalid Token')
  }
  next()
}

export default verifyToken
