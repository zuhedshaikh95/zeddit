"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { UserAvatar } from "@/components/global";
import { DropdownMenu } from "@/components/ui";

interface Props {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: React.FC<Props> = ({ user }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <UserAvatar
          className="h-8 w-8"
          user={{ name: user.name, image: user.image }}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-2 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu.Separator />

        <DropdownMenu.Item asChild>
          <Link href="/">Feed</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link href="/">Create community</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link href="/">Settings</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}/sign-in` });
          }}
        >
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserAccountNav;
