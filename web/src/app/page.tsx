import PostForm from "@/components/posts/Form";
import Posts from "@/components/posts/posts";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default async function Home() {
  const res = await fetch("http://localhost:3001/api/posts");

  if (!res.ok) {
    return <div>Failed to load</div>;
  }

  const data: Post[] = await res.json();

  return (
    <main className="flex flex-col p-24 max-w-2xl mx-auto">
      <Suspense
        fallback={
          <>
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-10 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-1/4 mb-2" />
            <Skeleton className="h-10 w-1/2" />

            <Skeleton className="h-20 w-full mt-8 mb-2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full mt-8" />
          </>
        }
      >
        {data.length > 0 && (
          <div className="flex items-center  justify-between">
            <h1 className="text-3xl font-semibold">Posts </h1>
            number of posts: {data.length}
          </div>
        )}

        {data.length === 0 ? (
          <div className="text-xl font-semibold">No posts available</div>
        ) : (
          data.map(({ title, id, content, created_at }) => (
            <Posts
              key={id}
              id={id}
              content={content}
              title={title}
              created_at={created_at}
            />
          ))
        )}
        <div className="flex flex-col gap-2">
          <PostForm />
        </div>
      </Suspense>
    </main>
  );
}
