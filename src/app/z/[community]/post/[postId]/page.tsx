import { redis } from "@/libs/redis";
import { Post as PostT, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import { PostVoteServer } from "@/components/community/post";
import { Button } from "@/components/ui/button";
import { db } from "@/libs/db";
import { cn, formatTimeToNow } from "@/libs/utils";
import { CachedPostT } from "@types";
import { CommentsSection } from "@/components/postId";

const EditorOutput = dynamic(async () => (await import("@/components/community")).EditorOutput, { ssr: false });

// export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Post({ params }: { params: { postId: string } }) {
  const cachedPost = await redis.hgetall<CachedPostT>(`post:${params.postId}`);

  let post: (PostT & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteSkeleton />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost?.id!}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/${post?.author.name ?? cachedPost?.authorUserName}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost?.createdAt!))}
          </p>

          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">{post?.title ?? cachedPost?.title}</h1>

          <EditorOutput content={post?.content ?? cachedPost?.content} />

          <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}>
            <CommentsSection postId={post?.id ?? cachedPost?.id!} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function PostVoteSkeleton() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <Button size="sm" variant="ghost" aria-label="upvote">
        <ArrowBigUp className={cn("h-5 w-5 text-zinc-700")} />
      </Button>

      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>

      <Button size="sm" variant="ghost" aria-label="downvote">
        <ArrowBigDown className={cn("h-5 w-5 text-zinc-700")} />
      </Button>
    </div>
  );
}
