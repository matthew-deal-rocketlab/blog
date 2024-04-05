import PostForm from '@/components/posts/Form'
import Posts from '@/components/posts/posts'
import HeaderTag from '@/components/ui/header'
import AdminSkelton from '@/components/ui/skeletons/adminSkeleton'
import { API_BASE_URL } from '@/contstants'
import { UseFetch } from '@/hooks/useFetch'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export type Post = {
  id: number
  title: string
  sub_title: string
  content: string
  created_at: string
  category?: string
  type?: string
  shouldFocus?: boolean
}

export default async function Page() {
  const res = await UseFetch(`${API_BASE_URL}/my-posts`, 'GET', undefined, true, 'no-cache')

  if (res.status === 401) {
    return redirect('/login')
  }

  if (!res.ok) {
    return <div>Failed to load blogs</div>
  }

  const data: Post[] = await res.json()

  return (
    <main className="mx-auto mt-10 flex max-w-6xl flex-col p-10 md:px-20">
      <Suspense fallback={<AdminSkelton />}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="order-2 md:order-1">
            {data.length > 0 && (
              <div className="flex flex-col">
                <HeaderTag text="Your Posts" level="h1" className="text-3xl font-semibold" />
                <p className="text-sm">number of posts: {data.length}</p>
              </div>
            )}
            <div className=" overflow-auto md:h-[80vh]">
              {data.length === 0 ? (
                <p className="text-xl font-semibold">You haven&apos;t created any posts yet</p>
              ) : (
                data.map(({ title, id, content, created_at, sub_title, category, type }) => (
                  <Posts
                    key={id}
                    id={id}
                    content={content}
                    category={category}
                    type={type}
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
