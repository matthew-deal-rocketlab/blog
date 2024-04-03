'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import Grid from '../ui/grid'
import Posts from './posts'
import { useAuth } from '@/context/authProvider'
import { Post } from '@/app/admin/page'

type AllBlogsProps = {
  data: Post[]
}

export default function AllBlogs({ data }: AllBlogsProps) {
  const { user } = useAuth()

  return (
    <>
      {data.length === 0 && user ? (
        <div className="max-w-3xl text-lg font-medium">
          <p> No Posts have been Created. </p>
          <p className="mb-8">Create a new post to get started.</p>
          <Link href={'/admin'}>
            <Button>Create a post</Button>
          </Link>
        </div>
      ) : (
        'No posts available'
      )}

      <Grid cols={4} className="grid-cols-2 md:grid-cols-4">
        {data.map(({ title, id, content, created_at, sub_title }) => (
          <Posts
            key={id}
            id={id}
            content={content}
            title={title}
            sub_title={sub_title}
            created_at={created_at}
          />
        ))}
      </Grid>
    </>
  )
}
