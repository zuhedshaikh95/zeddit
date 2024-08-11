"use client";

import { Post as PostT, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import React, { useRef } from "react";

import { formatTimeToNow } from "@/libs/utils";
import EditorOutput from "../editor-output";
import { PostVoteClient } from "@/components/community/post";

interface Props {
  subZedditName: string;
  post: PostT & {
    author: User;
    votes: Vote[];
  };
  commentsAmt: number;
  votesAmt: number;
  currentVote?: Pick<Vote, "type">;
}

const Post: React.FC<Props> = ({ subZedditName, post, commentsAmt, votesAmt, currentVote }) => {
  const postRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient initialVotesAmt={votesAmt} postId={post.id} initialVote={currentVote?.type} />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subZedditName && (
              <>
                <a className="underline text-zinc-900 text-sm underline-offset-2" href={`/z/${subZedditName}`}>
                  /z/{subZedditName}
                </a>
                <span className="px-1">*</span>
              </>
            )}
            <span>Posted by {post.author.name}</span> {formatTimeToNow(post.createdAt)}
          </div>

          <a
            className="text-lg font-semibold py-2 leading-6 text-gray-900"
            href={`/z/${subZedditName}/post/${post.id}`}
          >
            <h2>{post.title}</h2>
          </a>

          <div className="relative text-sm max-h-40 w-full overflow-clip" ref={postRef}>
            <EditorOutput content={post.content} />

            {postRef.current?.clientHeight === 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <a className="w-fit flex items-center gap-2" href={`/z/${subZedditName}/post/${post.id}`}>
          <MessageSquare className="h-4 w-4" /> {commentsAmt} comments
        </a>
      </div>
    </div>
  );
};

export default Post;
