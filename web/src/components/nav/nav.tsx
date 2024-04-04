'use client'

import { useAuth } from '@/context/authProvider'
import { KEY_JWT_TOKEN, Routes } from '@/contstants'
import { cookieStoreRemove } from '@/utils/cookie-store'
import Link from 'next/link'

export default function Nav() {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    cookieStoreRemove(KEY_JWT_TOKEN)
    logout()
  }

  return (
    <nav className="flex items-center justify-between bg-black p-8 text-white">
      <ul className="flex items-center space-x-4">
        <li>
          <Link href={Routes.HOME} className="text-xl">
            Blog
          </Link>
        </li>
      </ul>

      <ul className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <li>
              <Link href={Routes.ADMIN} className="text-xl">
                Admin
              </Link>
            </li>
            <li>
              <Link href={Routes.LOGIN} onClick={handleLogout} className="text-xl">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={Routes.LOGIN} className="text-xl">
                Login
              </Link>
            </li>
            <li>
              <Link href={Routes.REGISTER} className="text-xl">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
