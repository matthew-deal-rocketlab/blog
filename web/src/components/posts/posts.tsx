"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Post } from "@/app/page";
import { Button } from "../ui/button";
import { deletePost, updatePost } from "@/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

export default function Posts({
  title: initialTitle,
  content: initialContent,
  id,
  created_at,
}: Post) {
  const [updatedTitle, setUpdatedTitle] = useState(initialTitle);
  const [updatedContent, setUpdatedContent] = useState(initialContent);

  const handleDeletePost = async (id: number) => {
    await deletePost(id);
  };

  const handleUpdatePost = async (
    id: number,
    title: string,
    content: string
  ) => {
    await updatePost(id, title, content);
  };

  const formattedDate = format(parseISO(created_at), "dd/MM/yyyy 'at' ha");

  return (
    <>
      <div className="flex flex-row gap-20 items-center">
        <Link className="w-full" key={id} href={`/blog/${id}`}>
          <div>
            <h2 className="text-xl font-semibold mt-4">{initialTitle}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html:
                  initialContent.length > 50
                    ? `${initialContent.slice(0, 50)}...`
                    : initialContent,
              }}
            />

            <p className="text-[12px] text-black text-opacity-75 mt-2">
              Created at: {formattedDate}
            </p>
          </div>
        </Link>
        <div className="flex flex-row gap-2">
          <Button onClick={() => handleDeletePost(id)}>Delete</Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className="hover:bg-blue-500 hover:text-white active:scale-105"
              >
                <Pencil />
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="content" className="text-left">
                    Content
                  </Label>
                  <Textarea
                    rows={20}
                    id="content"
                    className="col-span-3"
                    defaultValue={initialContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"destructive"} type="submit">
                    Cancel
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      handleUpdatePost(id, updatedTitle, updatedContent)
                    }
                    type="submit"
                  >
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
