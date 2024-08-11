"use client";

import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { RouteResponseT } from "@types";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/libs/utils";

interface CommentVotesProps {
  commentId: string;
  votesAmt: number;
  currentVote?: Pick<CommentVote, "type">;
}

const CommentVotes: React.FC<CommentVotesProps> = ({ commentId, votesAmt: _votesAmt, currentVote: _currentVote }) => {
  const { toast } = useToast();
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState(_currentVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation<string, AxiosError<RouteResponseT>, VoteType>({
    mutationFn: async (voteType) => {
      const response = await axios.patch<RouteResponseT<string>>("/api/v1/subzeddit/post/comment/vote", {
        voteType,
        commentId,
      });

      return response.data.data;
    },
    onError: (error, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      return toast({
        title: "Something went wrong.",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type });
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button onClick={() => vote("UP")} size="xs" variant="ghost" aria-label="upvote">
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", { "text-emerald-500 fill-emerald-500": currentVote?.type === "UP" })}
        />
      </Button>

      <p className="text-center py-2 px-1 font-medium text-xs text-zinc-900">{votesAmt}</p>

      <Button onClick={() => vote("DOWN")} size="xs" variant="ghost" aria-label="downvote">
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", { "text-red-500 fill-red-500": currentVote?.type === "DOWN" })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
