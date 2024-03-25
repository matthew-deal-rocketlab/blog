'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { cookieStoreGet } from '@/utils/cookie-store'
import jwtDecoder from '@/utils/auth'

interface DecodedToken {
  header: any // Define more specific types if possible
  payload: User // Assuming the payload can be directly treated as a User
}

interface User {
  id: number
  email: string
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Added loading state

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      const token = await cookieStoreGet('JWT_TOKEN')
      if (token) {
        const decoded = jwtDecoder(token)
        if (decoded && decoded.payload) {
          if (decoded && decoded.payload) {
            setUser(decoded.payload as User)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    fetchTokenAndDecode()
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
