"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui";
import { useToast } from "@/hooks";
import { RouteResponseT } from "@types";

interface Props {
  subZedditId: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: React.FC<Props> = ({ subZedditId, isSubscribed }) => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: toggleSubscription, isPending } = useMutation<string, AxiosError<RouteResponseT<null>>>({
    mutationFn: async () => {
      const response = await axios.post<RouteResponseT<any>>("/api/v1/subzeddit/subscribe", { subZedditId });

      toast({
        title: response.data.data === "unsubscribed" ? "Awwwww!" : "Yay!",
        description: response.data.message,
      });

      return response.data.data;
    },

    onSuccess(data, variables, context) {
      React.startTransition(() => {
        router.refresh();
      });
    },
  });

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4" isLoading={isPending} onClick={() => toggleSubscription()}>
      Leave community
    </Button>
  ) : (
    <Button className="w-full mt-1 mb-4" isLoading={isPending} onClick={() => toggleSubscription()}>
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
