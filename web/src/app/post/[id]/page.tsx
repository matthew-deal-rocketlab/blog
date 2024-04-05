import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import { format, parseISO } from 'date-fns'

import * as cheerio from 'cheerio'

import { Post } from '@/app/admin/page'
import BackButton from '@/components/ui/backButton'
import HeaderTag from '@/components/ui/header'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'

import { codeToHtml } from 'shiki'
import { API_BASE_URL } from '@/contstants'
import BackArrow from '@/components/ui/backArrow'
import { cn } from '@/lib/utils'

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params

  const res = await UseFetch(`${API_BASE_URL}/posts/${id}`, 'GET', undefined, false, 'no-cache')

  if (!res.ok) {
    return <div className="mx-auto mt-24 max-w-sm text-3xl font-medium">No Data Found</div>
  }

  const post: Post = await res.json()
  const content = post.content

  // Highlight code blocks
  const $ = cheerio.load(content)
  const highlightPromises = $('pre code')
    .map((index, element) => {
      return (async () => {
        const codeBlock = $(element)
        const rawCode = codeBlock.text() as string

        const highlightedHtml = await codeToHtml(rawCode, {
          lang: 'typescript',
          theme: 'night-owl',
          transformers: [transformerNotationDiff(), transformerNotationHighlight()],
        })

        codeBlock.html(highlightedHtml)
      })()
    })
    .get()

  await Promise.all(highlightPromises)

  const updatedHtml = $.html()

  const formattedDate = format(parseISO(post.created_at), "dd/MM/yyyy 'at' ha")

  return (
    <Section description="Posts" className="p-24">
      <article className="mx-auto flex max-w-4xl flex-col gap-5 px-3">
        <div className="flex max-w-xl flex-col items-start gap-5 sm:flex-row sm:items-center">
          <BackArrow />
          <HeaderTag level="h1" text={post.title} className="text-3xl font-medium sm:text-5xl" />
        </div>
        <HeaderTag
          level="h2"
          text={post.sub_title}
          className="mt-2 text-xl font-medium sm:text-2xl"
        />
        <time className="mb-8 text-[12px] text-black text-opacity-75">
          Created at: {formattedDate}
        </time>

        <div
          className={cn(
            'prose mb-8 max-w-[350px] prose-code:text-base md:max-w-4xl',
            'prose-pre:m-0 prose-pre:overflow-x-auto prose-pre:p-2',
            'prose-code:overflow-x-auto prose-pre:overflow-x-auto',
          )}
          dangerouslySetInnerHTML={{ __html: updatedHtml }}
        />

        <div className="max-w-sm">
          <BackButton />
        </div>
      </article>
    </Section>
  )
}
