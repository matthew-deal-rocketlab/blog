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
