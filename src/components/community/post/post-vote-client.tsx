"use client";

import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { useToast } from "@/hooks";
import { cn } from "@/libs/utils";
import { RouteResponseT } from "@types";

interface Props {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: React.FC<Props> = ({ initialVotesAmt, postId, initialVote }) => {
  const { toast } = useToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote, error } = useMutation<string, AxiosError<RouteResponseT>, VoteType>({
    mutationFn: async (voteType: VoteType) => {
      const response = await axios.patch<RouteResponseT<string>>("/api/v1/subzeddit/post/vote", { postId, voteType });

      return response.data.data;
    },
    onError(error, voteType) {
      if (error.status === 401) {
      }

      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      toast({
        title: "Something went wrong!",
        description: error.response?.data.message || error.message,
        variant: "destructive",
      });
    },
    onMutate: (voteType) => {
      if (currentVote === voteType) {
        setCurrentVote(undefined);

        if (voteType === "UP") setVotesAmt((prev) => prev - 1);
        else setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote(voteType);

        if (voteType === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote" onClick={() => vote("UP")}>
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>

      <p className="text-center py-2 font-medium text-sm text-zinc-900">{votesAmt}</p>

      <Button size="sm" variant="ghost" aria-label="downvote" onClick={() => vote("DOWN")}>
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
