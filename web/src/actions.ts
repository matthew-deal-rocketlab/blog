'use server'

import { revalidatePath } from 'next/cache'
import { UseFetch } from './hooks/useFetch'
import { API_BASE_URL } from './contstants'

type ErrorResponse = {
  error: string
}

type SuccessResponse = {
  message: string
}

export async function createPost(
  title: string,
  content: string,
  sub_title: string,
  user_id: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await UseFetch(`${API_BASE_URL}/posts`, 'POST', {
      title,
      content,
      sub_title,
      user_id,
    })

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error || response.statusText }
    }

    revalidatePath('/')

    return { success: true, message: 'Post created successfully.' }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create post.',
    }
  }
}

export async function deletePost(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await UseFetch(`${API_BASE_URL}/posts/${id}`, 'DELETE')

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error || 'Failed to delete post.' }
    }

    revalidatePath('/')

    return { success: true, message: 'Post deleted successfully.' }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete post.',
    }
  }
}

export async function updatePost(
  id: number,
  title: string,
  content: string,
  sub_title: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await UseFetch(`${API_BASE_URL}/posts/${id}`, 'PUT', {
      title,
      content,
      sub_title,
    })

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error || 'Failed to update post.' }
    }

    revalidatePath('/')

    return { success: true, message: 'Post updated successfully.' }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update post.',
    }
  }
}

// login
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const response = await UseFetch(`${API_BASE_URL}/login`, 'POST', {
      email,
      password,
    })

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error || 'Failed to login.' }
    }

    const { token } = await response.json()

    return { success: true, message: 'Login successful.', token }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to login.',
    }
  }
}

export async function register(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const response = await UseFetch(`${API_BASE_URL}/register`, 'POST', {
      email,
      password,
    })

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json()
      return { success: false, message: errorResponse.error || 'Failed to register.' }
    }
    const successResponse: SuccessResponse = await response.json()
    return {
      success: true,
      message: successResponse.message || 'User registered successfully.',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
