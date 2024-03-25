'use'

import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 * Verifies the JWT token using a secret or public key.
 *
 * @param token - The JWT token to verify.
 * @param secret - The secret key or public key used to verify the token's signature.
 * @returns The decoded token payload if verification is successful.
 * @throws Will throw an error if the token is invalid, expired, or not yet active.
 */

function verifyToken(token: string, secret: string): JwtPayload | string {
  console.log('Token:', token)
  try {
    // Verify the token
    const decoded = jwt.verify(token.value, secret)
    console.log('Token is valid:', decoded)
    return decoded as JwtPayload | string // Token is valid, return decoded payload
  } catch (error) {
    console.error('Token verification failed:', error)
    throw error // Rethrow the error to be handled by the caller
  }
}

export default verifyToken
