'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import Grid from '../ui/grid'
import Posts from './posts'
import { useAuth } from '@/context/authProvider'
import { Post } from '@/app/admin/page'
import { Routes } from '@/contstants'
import { Skeleton } from '../ui/skeleton'

type AllBlogsProps = {
  data: Post[]
}

export default function AllBlogs({ data }: AllBlogsProps) {
  const { user, isLoading } = useAuth()

  if (isLoading)
    return (
      <>
        <Skeleton className="h-5 w-[230px]" />
        <Skeleton className="h-5 w-[250px]" />
        <Skeleton className="mt-5 h-10 w-[100px]" />
      </>
    )

  return (
    <main>
      {data.length === 0 && user ? (
        <div className="max-w-3xl text-lg font-medium">
          <p>
            <strong>No Posts have been Created.</strong>
          </p>
          <p className="mb-8">Create a new post to get started.</p>
          <Link href={Routes.ADMIN}>
            <Button>Create a post</Button>
          </Link>
        </div>
      ) : (
        'No blog posts available'
      )}

      <Grid cols={4} className="grid-cols-1 md:grid-cols-4">
        {data.map(({ title, id, content, created_at, sub_title }, index) => (
          <Posts
            shouldFocus={index === 0}
            key={id}
            id={id}
            content={content}
            title={title}
            sub_title={sub_title}
            created_at={created_at}
          />
        ))}
      </Grid>
    </main>
  )
}
