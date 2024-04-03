'use client'

import { useAuth } from '@/context/authProvider'
import { Routes } from '@/contstants'
import Link from 'next/link'

export default function Nav() {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }

  return (
    <nav className="flex items-center justify-between bg-black p-8 text-white">
      <div className="flex items-center space-x-4">
        <Link href={Routes.HOME} className="text-xl">
          Blog
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link href={Routes.ADMIN} className="text-xl">
              Admin
            </Link>
            <Link href={Routes.LOGIN} onClick={handleLogout} className="text-xl">
              logout
            </Link>
          </>
        ) : (
          <>
            <Link href={Routes.LOGIN} className="text-xl">
              Login
            </Link>
            <Link href={Routes.REGISTER} className="text-xl">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
