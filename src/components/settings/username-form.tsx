"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { usernameValidator } from "@/libs/validations";
import { RouteResponseT, UsernameFormT } from "@types";
import { Button, Card, Input, Label } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";

interface Props {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameFormT>({
    resolver: zodResolver(usernameValidator),
    defaultValues: {
      name: user.username || "",
    },
  });

  const {
    mutate: updateUsername,
    error,
    isPending: isLoading,
  } = useMutation<string, AxiosError<RouteResponseT>, UsernameFormT>({
    mutationFn: async ({ name }) => {
      const response = await axios.post<RouteResponseT<string>>("/api/v1/username", { name });

      return response.data.data;
    },
    onSuccess(data, variables, context) {
      toast({
        title: "Username changed!",
        description: `Your username has been updated 😁, ${data}`,
      });
      router.refresh();
    },
  });

  const onSubmit: SubmitHandler<UsernameFormT> = (values) => {
    updateUsername(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Your username</Card.Title>
          <Card.Description>Please enter a display name you are comfortable with.</Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>

            <Input id="name" className="pl-6" size={32} {...register("name")} />

            {errors.name && <p className="px-1 text-xs text-red-600 absolute -bottom-5">{errors.name.message}</p>}

            {error && (
              <p className="px-1 text-xs text-red-600 absolute -bottom-5">
                {error.response?.data.message || error.message}
              </p>
            )}
          </div>
        </Card.Content>

        <Card.Footer>
          <Button type="submit" isLoading={isLoading}>
            Change username
          </Button>
        </Card.Footer>
      </Card.Root>
    </form>
  );
};

export default UsernameForm;
