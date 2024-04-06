import { Suspense } from 'react'

import { Post } from './admin/page'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'
import AllBlogs from '@/components/blog/blog'
import Container from '@/components/ui/container'
import { API_BASE_URL } from '@/contstants'
import HomeSkeleton from '@/components/ui/skeletons/homeSkeleton'

export default async function Page() {
  const res = await UseFetch(`${API_BASE_URL}/posts`, 'GET', undefined, false, 'no-cache')

  if (!res.ok) return <p>Failed to load blogs</p>

  const data: Post[] = await res.json()

  return (
    <Section description="Blog Posts" className="flex flex-col gap-4 ">
      <Container width="[900]" className="flex flex-col gap-4">
        <Suspense fallback={<HomeSkeleton />}>
          <AllBlogs data={data} />
        </Suspense>
      </Container>
    </Section>
  )
}
