import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params
  const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
    cache: 'no-cache',
  })

  if (!res.ok) {
    return <div className="mx-auto mt-24 max-w-sm text-3xl font-medium">No Data Found</div>
  }

  const post = await res.json()

  const formattedDate = format(parseISO(post.created_at), "dd/MM/yyyy 'at' ha")

  return (
    <article className="p-24">
      <div className="mx-auto flex max-w-2xl flex-col justify-center">
        <h1 className="text-5xl font-medium">{post.title}</h1>
        <h2 className="mt-2 text-2xl font-medium">{post.sub_title}</h2>
        <p className="mb-8 text-[12px] text-black text-opacity-75">Created at: {formattedDate}</p>
        <div className="prose mb-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />
        <Link href="/admin">
          <Button>Go Back</Button>
        </Link>
      </div>
    </article>
  )
}
