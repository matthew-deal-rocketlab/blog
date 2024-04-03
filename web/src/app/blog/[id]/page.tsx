import Content from '@/components/posts/content'
import BackButton from '@/components/ui/backButton'
import Container from '@/components/ui/container'
import HeaderTag from '@/components/ui/header'
import Section from '@/components/ui/section'
import { UseFetch } from '@/hooks/useFetch'
import { format, parseISO } from 'date-fns'

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params

  const res = await UseFetch(
    `http://localhost:3001/api/posts/${id}`,
    'GET',
    undefined,
    false,
    'no-cache',
  )

  if (!res.ok) {
    return <div className="mx-auto mt-24 max-w-sm text-3xl font-medium">No Data Found</div>
  }

  const post = await res.json()

  const formattedDate = format(parseISO(post.created_at), "dd/MM/yyyy 'at' ha")

  return (
    <Section description="Posts" className="p-24">
      <Container width="4xl">
        <HeaderTag level="h1" text={post.title} className="text-5xl font-medium" />
        <HeaderTag level="h2" text={post.sub_title} className="mt-2 text-2xl font-medium" />
        <p className="mb-8 text-[12px] text-black text-opacity-75">Created at: {formattedDate}</p>
        <Content post={post} />
        <div className="max-w-sm">
          <BackButton />
        </div>
      </Container>
    </Section>
  )
}
