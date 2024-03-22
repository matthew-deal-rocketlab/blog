import PostForm from '@/components/posts/Form'
import Posts from '@/components/posts/posts'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export type Post = {
  id: number
  title: string
  sub_title: string
  content: string
  created_at: string
}

export default async function Page() {
  const res = await fetch('http://localhost:3001/api/posts')

  if (!res.ok) {
    return <div>Failed to load</div>
  }

  const data: Post[] = await res.json()

  return (
    <main className="mx-auto mt-10 flex max-w-6xl flex-col p-10 md:px-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="order-2 md:order-1">
            {data.length > 0 && (
              <div className="flex flex-col">
                <h1 className="text-3xl font-semibold">Posts </h1>
                <p className="text-sm">number of posts: {data.length}</p>
              </div>
            )}
            <div className=" overflow-auto md:h-[80vh]">
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
            </div>
          </div>
          <div className="order-1 flex flex-col gap-2 md:order-2 ">
            <PostForm />
          </div>
        </div>
      </Suspense>
    </main>
  )
}
