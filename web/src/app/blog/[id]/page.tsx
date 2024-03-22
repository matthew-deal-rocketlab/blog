import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import Link from "next/link";

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = params;
  const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const post = await res.json();

  const formattedDate = format(parseISO(post.created_at), "dd/MM/yyyy 'at' ha");

  return (
    <article className="p-24">
      <div className="max-w-2xl mx-auto flex flex-col justify-center">
        <h1 className="text-5xl font-medium">{post.title}</h1>
        <h2 className="text-2xl font-medium mt-2">{post.sub_title}</h2>
        <p className="text-[12px] text-black text-opacity-75 mb-8">
          Created at: {formattedDate}
        </p>
        <div
          className="prose mb-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <Link href="/">
          <Button>Go Back</Button>
        </Link>
      </div>
    </article>
  );
}
