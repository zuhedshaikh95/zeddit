"use client";

import { CommentVote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import { UserAvatar } from "@/components/global";
import { CommentVotes } from "@/components/postId";
import { Button, Label, Textarea } from "@/components/ui";
import { useToast } from "@/hooks";
import { formatTimeToNow } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentPayloadT, ExtendedCommentI, RouteResponseT } from "@types";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface Props {
  comment: ExtendedCommentI;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: React.FC<Props> = ({ comment, currentVote, postId, votesAmt }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const commentRef = useRef<HTMLDivElement | null>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("");

  const { mutate: commentFn, isPending } = useMutation<string, AxiosError<RouteResponseT>, CommentPayloadT>({
    mutationFn: async ({ postId, text, replyToId }: CommentPayloadT) => {
      const response = await axios.patch<RouteResponseT<string>>("/api/v1/subzeddit/post/comment", {
        postId,
        text,
        replyToId,
      });

      return response.data.data;
    },
    onError(error, variables, context) {
      toast({
        title: "Something went wrong!",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    },
    onSuccess(data, variables, context) {
      router.refresh();
      setIsReplying(false);
      setReply("");
    },
  });

  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          className="h-6 w-6"
          user={{
            name: comment.author.name,
            image: comment.author.image,
          }}
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">u/{comment.author.username}</p>
          <p className="max-h-40 truncate text-xs text-zinc-500">{formatTimeToNow(new Date(comment.createdAt))}</p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes commentId={comment.id} votesAmt={votesAmt} currentVote={currentVote} />

        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>

            <div className="mt-2">
              <Textarea
                id="comment"
                placeholder="What are your thoughts?"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={1}
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button tabIndex={-1} variant="subtle" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  disabled={reply.length === 0}
                  onClick={() => commentFn({ postId, text: reply, replyToId: comment.replyToId ?? comment.id })}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
