import { Post } from './admin/page'

import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'
import AllBlogs from '@/components/home/allBlogs'
import Container from '@/components/ui/container'
import HeaderTag from '@/components/ui/header'

export default async function Page() {
  const res = await UseFetch('http://localhost:3001/api/posts', 'GET', undefined, false, 'no-cache')

  if (!res.ok) {
    return <div>Failed to load blogs</div>
  }

  const data: Post[] = await res.json()

  return (
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
        <Container width="6xl" className="flex flex-col gap-4">
          {data.length > 0 && (
            <div className="flex flex-col">
              <HeaderTag level="h1" text="Posts" className="text-3xl font-semibold" />
              <p className="text-sm">number of posts: {data.length}</p>
            </div>
          )}
          <AllBlogs data={data} />
        </Container>
      </Section>
    </Suspense>
  )
}
