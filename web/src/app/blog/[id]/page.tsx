import BackButton from '@/components/ui/backButton'
import Container from '@/components/ui/container'
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
      <Container width="2xl">
        <h1 className="text-5xl font-medium">{post.title}</h1>
        <h2 className="mt-2 text-2xl font-medium">{post.sub_title}</h2>
        <p className="mb-8 text-[12px] text-black text-opacity-75">Created at: {formattedDate}</p>
        <div className="prose mb-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="max-w-sm">
          <BackButton />
        </div>
      </Container>
    </Section>
  )
}
