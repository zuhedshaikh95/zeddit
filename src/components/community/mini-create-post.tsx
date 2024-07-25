"use client";

import { ImageIcon, Link2 } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { UserAvatar } from "@/components/global";
import { Button, Input } from "@/components/ui";

interface Props {
  session: Session | null;
}

const MiniCreatePost: React.FC<Props> = ({ session }) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative h-fit">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input readOnly onClick={() => router.push(pathName + "/create-post")} placeholder="Create Post" />

        <Button variant="ghost" onClick={() => router.push(pathName + "/create-post")}>
          <ImageIcon className="text-zinc-600" />
        </Button>

        <Button variant="ghost" onClick={() => router.push(pathName + "/create-post")}>
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
