'use server'

import { revalidatePath } from 'next/cache'
import { UseFetch } from './hooks/useFetch'

export async function createPost(
  title: string,
  content: string,
  sub_title: string,
  user_id: number,
) {
  try {
    const response = await UseFetch('http://localhost:3001/api/posts', 'POST', {
      title,
      content,
      sub_title,
      user_id,
    })

    if (!response.ok) {
      return { message: response.statusText }
    }

    revalidatePath('/')

    return { message: 'Post created successfully.' }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { message: 'Failed to create post.' }
  }
}

export async function deletePost(id: number) {
  try {
    const response = await UseFetch(`http://localhost:3001/api/posts/${id}`, 'DELETE', {
      id,
    })

    if (!response.ok) {
      return { message: 'Failed to delete post.' }
    }

    revalidatePath('/')

    return { message: 'Post deleted successfully.' }
  } catch (error) {
    console.error('Failed to delete post:', error)
    return { message: 'Failed to delete post.' }
  }
}

export async function updatePost(id: number, title: string, content: string, sub_title: string) {
  try {
    const response = await UseFetch(`http://localhost:3001/api/posts/${id}`, 'PUT', {
      title,
      content,
      sub_title,
    })

    if (!response.ok) {
      return { message: 'Failed to update post.' }
    }

    revalidatePath('/')

    return { message: 'Post updated successfully.' }
  } catch (error) {
    console.error('Failed to update post:', error)
    return { message: 'Failed to update post.' }
  }
}

// login
export async function login(email: string, password: string) {
  try {
    const response = await UseFetch('http://localhost:3001/api/login', 'POST', {
      email,
      password,
    })

    if (!response.ok) {
      return { message: 'Failed to login.' }
    }

    const { token } = await response.json()

    return { token }
  } catch (error) {
    console.error('Failed to login:', error)
    return { message: 'Failed to login.' }
  }
}

type ErrorResponse = {
  error: string
}

type SuccessResponse = {
  message: string
}

type RegisterResponse = {
  message: string
  success: boolean
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  try {
    const response = await UseFetch('http://localhost:3001/api/register', 'POST', {
      email,
      password,
    })

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error }
    }

    const successResponse: SuccessResponse = await response.json()
    return { success: true, message: successResponse.message || 'User registered successfully.' }
  } catch (error) {
    console.error('Failed to register:', error)

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
