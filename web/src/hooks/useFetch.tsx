import { cookieStoreGet } from '@/utils/cookie-store'

export async function UseFetch(
  url: string,
  method: string,
  body?: any,
  includeAuthorization = true,
  cache: RequestCache = 'default',
) {
  let headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  if (includeAuthorization) {
    const token = await cookieStoreGet('JWT_TOKEN')
    headers['Authorization'] = `Bearer ${token}`
  }

  if (cache !== 'default') {
    headers['Cache-Control'] = cache
  }

  const options: RequestInit = {
    method: method.toUpperCase(),
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error('Error fetching data')
  }
}
