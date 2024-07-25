"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

import { Button, Input } from "@/components/ui";
import { RouteResponseT } from "@types";
import { useToast } from "@/hooks";

export default function CreateCommunity() {
  const router = useRouter();
  const { toast } = useToast();
  const [input, setInput] = useState<string>("");

  const {
    mutate: createCommunity,
    isPending,
    error,
  } = useMutation<string, AxiosError<RouteResponseT>>({
    mutationFn: async () => {
      const response = await axios.post<RouteResponseT>("/api/v1/subzeddit", { name: input });

      toast({
        title: "Yay!",
        description: response.data.message,
      });

      return response.data.data;
    },
    onSuccess(data, variables, context) {
      router.push(`/r/${data}`);
    },
  });

  return (
    <section className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">Community names including capitalization cannot be changed.</p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 select-none">
              z/
            </p>

            <Input className="pl-6" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
          {error && (
            <p className="absolute text-xs text-red-500 p-2">{error?.response?.data.message || error?.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>

          <Button isLoading={isPending} disabled={!input.length} onClick={() => createCommunity()}>
            Create
          </Button>
        </div>
      </div>
    </section>
  );
}
