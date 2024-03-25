import Posts from '@/components/home/posts'
import { Post } from './admin/page'

import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { useAuth } from '@/context/authProvider'
import Section from '@/components/ui/section'
import Grid from '@/components/ui/grid'

export default async function Page() {
  const res = await fetch('http://localhost:3001/api/posts', { cache: 'no-cache' })

  console.log(res)

  if (!res.ok) {
    return <div>Failed to load</div>
  }

  const data: Post[] = await res.json()

  return (
    <main className="mx-auto mt-10 flex max-w-6xl  p-10">
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-4 h-10 w-1/3" />
            <Skeleton className="mb-2 h-10 w-1/2" />
            <Skeleton className="mb-4 h-10 w-full" />
            <Skeleton className="mb-2 h-10 w-1/4" />
            <Skeleton className="h-10 w-1/2" />

            <Skeleton className="mb-2 mt-8 h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-8 h-10 w-full" />
          </>
        }>
        <Section description="Blog Posts" className="flex flex-col gap-4">
          {data.length > 0 && (
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold">Posts </h1>
              <p className="text-sm">number of posts: {data.length}</p>
            </div>
          )}
          <Grid cols={4} className="grid-cols-2 md:grid-cols-4">
            {data.length === 0 ? (
              <div className="text-xl font-semibold ">No posts available</div>
            ) : (
              data.map(({ title, id, content, created_at, sub_title }) => (
                <Posts
                  key={id}
                  id={id}
                  content={content}
                  title={title}
                  sub_title={sub_title}
                  created_at={created_at}
                />
              ))
            )}
          </Grid>
        </Section>
      </Suspense>
    </main>
  )
}
