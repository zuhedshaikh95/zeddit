"use client";

import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

interface Props {}

const CloseInterceptedModal: React.FC<Props> = ({}) => {
  const router = useRouter();

  return (
    <Button
      variant="subtle"
      className="h-6 w-6 p-0 rounded-md"
      aria-label="close-intercepted-modal"
      onClick={() => router.back()}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseInterceptedModal;
