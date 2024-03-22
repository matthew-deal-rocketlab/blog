'use client'

import { format, parseISO } from 'date-fns'
import { useState } from 'react'
import { Pencil } from 'lucide-react'

import Link from 'next/link'
import { Post } from '@/app/page'
import { Button } from '../ui/button'
import { deletePost, updatePost } from '@/actions'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function Posts({
  title: initialTitle,
  sub_title,
  content: initialContent,
  id,
  created_at,
}: Post) {
  const [updatedTitle, setUpdatedTitle] = useState(initialTitle)
  const [updatedContent, setUpdatedContent] = useState(initialContent)

  const { push } = useRouter()

  const formattedDate = format(parseISO(created_at), "dd/MM/yyyy 'at' ha")

  const handleRedirect = () => {
    push(`/blog/${id}`)
  }

  const handleDeletePostClick = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation()
    await deletePost(id)
  }

  const handleUpdatePost = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
    title: string,
    content: string,
    sub_title: string,
  ) => {
    e.stopPropagation() // Prevent the event from bubbling up to the parent
    await updatePost(id, title, content, sub_title)
  }

  return (
    <>
      <div
        onClick={handleRedirect}
        className={cn(
          'group m-2 flex flex-col items-center gap-5 rounded-lg border p-5',
          'hover:cursor-pointer hover:bg-black hover:text-white',
        )}>
        <div className="w-full">
          <h1 className="mt-4 text-xl font-semibold">{initialTitle}</h1>
          <h2 className="mb-4 text-base font-medium">{sub_title}</h2>
          <p className="mt-2 text-[12px] text-black text-opacity-75">Created at: {formattedDate}</p>
        </div>
        <div className="flex w-full flex-row gap-2">
          <Button className="group-hover:bg-red-500 " onClick={e => handleDeletePostClick(e, id)}>
            Delete
          </Button>

          <Dialog>
            <DialogTrigger onClick={e => e.stopPropagation()} asChild>
              <Button
                variant={'outline'}
                className="hover:text-white active:scale-105 group-hover:border-black group-hover:bg-blue-500">
                <Pencil />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="title" className="text-left">
                    Title
                  </Label>
                  <Input
                    id="title"
                    defaultValue={initialTitle}
                    className="col-span-3"
                    onChange={e => setUpdatedTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="content" className="text-left">
                    Content
                  </Label>
                  <Textarea
                    rows={40}
                    id="content"
                    className="col-span-3"
                    defaultValue={initialContent}
                    onChange={e => setUpdatedContent(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose onClick={e => e.stopPropagation()} asChild>
                  <Button variant={'destructive'} type="submit" className="mt-4 sm:mt-0">
                    Cancel
                  </Button>
                </DialogClose>

                <DialogClose onClick={e => e.stopPropagation()} asChild>
                  <Button
                    onClick={e => handleUpdatePost(e, id, updatedTitle, updatedContent, sub_title)}
                    type="submit">
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}