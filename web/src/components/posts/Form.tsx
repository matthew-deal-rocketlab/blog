'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { createPost } from '@/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useAuth } from '@/context/authProvider'
import { Skeleton } from '../ui/skeleton'
import HeaderTag from '../ui/header'
import { Toaster } from '../ui/sonner'

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  sub_title: z.string().min(1, 'Sub Title is required'),
  content: z.string().min(1, 'Content is required'),
})

export default function PostForm() {
  const { isAuthenticated, user } = useAuth()

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: '',
      sub_title: '',
      content: '',
    },
  })

  const handleSubmit = async (formData: z.infer<typeof PostSchema>) => {
    const title = formData.title as string
    const sub_title = formData.sub_title as string
    const content = formData.content as string
    const result = PostSchema.safeParse(formData)

    const user_id = user?.id as number

    if (!result.success) {
      toast.error('Something went wrong, Your post was not created', {
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })
    }

    if (result.success) {
      const result = await createPost(title, content, sub_title, user_id)
      toast.success(result.message, {
        action: {
          label: 'Close',
          onClick: () => {},
        },
      })

      form.reset()
    }

    return
  }

  if (!isAuthenticated) {
    return (
      <div>
        <Skeleton className="mb-4 h-10" />
        <Skeleton className="mb-4 h-10" />
        <Skeleton className="mb-4 h-10" />
        <Skeleton className="mb-4 h-10" />
        <Skeleton className="mb-4 h-10" />
      </div>
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-8 flex flex-col gap-2">
          <HeaderTag text="Write a Blog" level="h2" className="text-2xl font-semibold" />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sub_title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Sub Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Create content using Markdown, and the BE will do some magic!"
                    rows={30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="my-8">Create Post</Button>
        </form>
      </Form>

      <Toaster position="bottom-right" richColors theme="light" />
    </>
  )
}
