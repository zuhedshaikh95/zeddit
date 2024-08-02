import { CommunityFeed, MiniCreatePost } from "@/components/community";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/configs";
import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";
import { notFound } from "next/navigation";

export default async function Community({ params }: { params: { community: string } }) {
  const session = await getAuthSession();

  const subZeddit = await db.subZeddit.findFirst({
    where: {
      name: params.community,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subZeddit: true,
        },
      },
    },

    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  if (!subZeddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">z/{params.community}</h1>

      <MiniCreatePost session={session} />

      {/* TODO: Show Posts in user feed  */}
      <CommunityFeed initialPosts={subZeddit.posts} subZedditName={subZeddit.name} />
    </>
  );
}
