import { Suspense } from 'react'

import { Post } from './admin/page'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'
import AllBlogs from '@/components/blog/blog'
import Container from '@/components/ui/container'
import HeaderTag from '@/components/ui/header'
import BlogSkeleton from '@/components/ui/skeletons/blogSkeleton'
import { API_BASE_URL } from '@/contstants'

export default async function Page() {
  const res = await UseFetch(`${API_BASE_URL}/posts`, 'GET', undefined, false, 'no-cache')

  if (!res.ok) {
    return <p>Failed to load blogs</p>
  }

  const data: Post[] = await res.json()

  return (
    <Suspense fallback={<BlogSkeleton />}>
      <Section description="Blog Posts" className="flex flex-col gap-4 ">
        <Container width="[900]" className="flex flex-col gap-4">
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
