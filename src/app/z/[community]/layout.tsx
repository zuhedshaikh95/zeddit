import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { SubscribeLeaveToggle } from "@/components/community";
import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";

export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    community: string;
  };
}) {
  const session = await getAuthSession();

  const subzeddit = await db.subZeddit.findFirst({
    where: {
      name: params.community,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  if (!subzeddit) return notFound();

  const subscription = await db.subscription.findFirst({
    where: {
      subZeddit: {
        name: params.community,
      },
      user: {
        id: session?.user.id,
      },
    },
  });

  const isSubscribed = !!subscription;

  const memberCount = await db.subscription.count({
    where: {
      subZeddit: {
        name: params.community,
      },
    },
  });

  return (
    <section className="sm:container max-w-7xl m-auto h-full pt-12">
      <div>
        {/* TODO: Button to take us back */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* TODO: Info sidebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About z/{subzeddit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subzeddit.createdAt.toDateString()}>
                    {format(subzeddit.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <p className="text-gray-900">{memberCount}</p>
                </dd>
              </div>

              {subzeddit.creatorId === session?.user.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You created this community</p>
                </div>
              )}

              {subzeddit.creatorId !== session?.user.id && (
                <SubscribeLeaveToggle subZedditId={subzeddit.id} isSubscribed={isSubscribed} />
              )}

              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6",
                })}
                href={`/z/${params.community}/create-post`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
