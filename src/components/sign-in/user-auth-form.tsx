"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

import { Icons } from "@/components/global";
import { Button } from "@/components/ui";
import { useToast } from "@/hooks";
import { cn } from "@/libs/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: React.FC<Props> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error: any) {
      console.error("Google Login Error:", error.message);
      toast({
        title: "Something went wrong!",
        description: "There was a problem logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        onClick={handleLoginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
