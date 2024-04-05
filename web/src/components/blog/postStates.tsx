import { Post } from '@/app/admin/page'
import { Routes } from '@/contstants'
import Link from 'next/link'
import { Button } from '../ui/button'
import { User } from '@/context/authProvider'

type PostStatesProps = {
  data: Post[]
  user: User | null
}

export default function PostStates({ data, user }: PostStatesProps) {
  return (
    <>
      {data.length === 0 && user && (
        <div className="max-w-3xl text-lg font-medium">
          <p>
            <strong>No Posts have been Created.</strong>
          </p>
          <p className="mb-8">Create a new post to get started.</p>
          <Link href={Routes.ADMIN}>
            <Button>Create a post</Button>
          </Link>
        </div>
      )}

      {data.length === 0 && !user && (
        <div className="max-w-3xl text-lg font-medium">
          <p>
            <strong>No Posts have been Created.</strong>
          </p>
          <p className="mb-8">Check back later for new posts.</p>
        </div>
      )}
    </>
  )
}
