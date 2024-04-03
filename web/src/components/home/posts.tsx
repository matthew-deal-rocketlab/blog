'use client'

import { format, parseISO } from 'date-fns'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Post } from '@/app/admin/page'
import HeaderTag from '../ui/header'

export default function Posts({ title, sub_title, id, created_at }: Post) {
  const { push } = useRouter()

  const formattedDate = format(parseISO(created_at), "dd/MM/yyyy 'at' ha")

  const handleRedirect = () => {
    push(`/blog/${id}`)
  }

  return (
    <>
      <div
        onClick={handleRedirect}
        className={cn(
          'group my-2 flex flex-col items-center gap-5 rounded-lg border p-5',
          'hover:cursor-pointer hover:bg-black hover:text-white',
        )}>
        <div className="w-full">
          <HeaderTag
            level="h1"
            text={title}
            className="mt-4 text-xl font-semibold group-hover:text-white"
          />
          <HeaderTag
            level="h2"
            text={sub_title}
            className="mb-4 text-base font-medium group-hover:text-white"
          />
          <p className="mt-2 text-[12px] text-opacity-75">Created at: {formattedDate}</p>
        </div>
      </div>
    </>
  )
}
