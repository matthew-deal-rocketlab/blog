'use client'

import { useAuth } from '@/context/authProvider'
import { cookieStoreRemove } from '@/utils/cookie-store'
import Link from 'next/link'

export default function Nav() {
  const { isAuthenticated } = useAuth()

  const handleLogout = async () => {
    cookieStoreRemove('JWT_TOKEN')
  }

  return (
    <nav className="flex items-center justify-between bg-black p-8 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl">
          Blog
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link href="/admin" className="text-xl">
              Admin
            </Link>
            <Link href="/login" onClick={handleLogout} className="text-xl">
              logout
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="text-xl">
              Login
            </Link>
            <Link href="/register" className="text-xl">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
