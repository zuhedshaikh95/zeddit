"use client";

import { useMutation } from "@tanstack/react-query";
import { CommentPayloadT, RouteResponseT } from "@types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button, Label, Textarea } from "@/components/ui";
import { useToast } from "@/hooks";

interface Props {
  postId: string;
  replyToId?: string;
}

const CreateComment: React.FC<Props> = ({ postId, replyToId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = useState<string>("");

  const { mutate: commentFn, isPending } = useMutation<string, AxiosError<RouteResponseT>, CommentPayloadT>({
    mutationFn: async ({ postId, text }: CommentPayloadT) => {
      const response = await axios.patch<RouteResponseT<string>>(`/api/v1/subzeddit/post/comment`, {
        postId,
        text,
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
      setValue("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>

      <div className="mt-2">
        <Textarea
          id="comment"
          placeholder="What are your thoughts?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={1}
        />

        <div className="mt-2 flex justify-end">
          <Button
            onClick={() => commentFn({ postId, text: value, replyToId })}
            isLoading={isPending}
            disabled={value.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
