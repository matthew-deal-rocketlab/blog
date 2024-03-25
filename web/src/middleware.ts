import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookieStoreGet } from './utils/cookie-store'

export async function middleware(request: NextRequest) {
  const jwtToken = await cookieStoreGet('JWT_TOKEN')

  // Define auth-required paths
  const authRequiredPaths = ['/admin']

  const path = request.nextUrl.pathname

  // Redirect to login if trying to access an auth-required path without a token
  if (authRequiredPaths.includes(path)) {
    // Check if the user is authenticated
    if (!jwtToken) {
      // If the user is not authenticated, redirect to the login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Allow access to all other paths without token
  return NextResponse.next()
}
