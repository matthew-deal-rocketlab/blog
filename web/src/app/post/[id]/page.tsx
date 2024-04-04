import { Post } from '@/app/admin/page'
import BackButton from '@/components/ui/backButton'
import HeaderTag from '@/components/ui/header'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'
import { format, parseISO } from 'date-fns'
import * as cheerio from 'cheerio'

import { codeToHtml } from 'shiki'
import { API_BASE_URL } from '@/contstants'

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
  await Promise.all(
    $('pre code')
      .map(async (index, element) => {
        const codeBlock = $(element)
        const rawCode = codeBlock.text()
        const highlightedHtml = await codeToHtml(rawCode, {
          lang: 'typescript',
          theme: 'night-owl',
        })
        codeBlock.html(highlightedHtml)
      })
      .get(),
  )

  const updatedHtml = $.html()

  const formattedDate = format(parseISO(post.created_at), "dd/MM/yyyy 'at' ha")

  return (
    <Section description="Posts" className="p-24">
      <article className="mx-auto flex max-w-4xl flex-col gap-5 px-3">
        <HeaderTag level="h1" text={post.title} className="text-5xl font-medium" />
        <HeaderTag level="h2" text={post.sub_title} className="mt-2 text-2xl font-medium" />
        <time className="mb-8 text-[12px] text-black text-opacity-75">
          Created at: {formattedDate}
        </time>

        <div
          className="prose mb-8 max-w-4xl prose-code:text-base prose-pre:m-0 prose-pre:p-4 "
          dangerouslySetInnerHTML={{ __html: updatedHtml }}
        />

        <div className="max-w-sm">
          <BackButton />
        </div>
      </article>
    </Section>
  )
}
