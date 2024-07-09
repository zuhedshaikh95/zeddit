import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import Image from "next/image";
import React from "react";

import { Icons } from "@/components/global";
import { Avatar } from "@/components/ui";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: React.FC<Props> = ({ user, ...props }) => {
  return (
    <Avatar.Root {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            src={user.image}
            fill
            alt="user-avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <Avatar.Fallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </Avatar.Fallback>
      )}
    </Avatar.Root>
  );
};

export default UserAvatar;
