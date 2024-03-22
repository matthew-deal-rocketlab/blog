'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(title: string, content: string, sub_title: string) {
  try {
    const response = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, sub_title }),
    })

    if (!response.ok) {
      return { message: 'Failed to create post.' }
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
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'DELETE',
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
    const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, sub_title }),
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
