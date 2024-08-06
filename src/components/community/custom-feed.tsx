import { Feed } from "@/components/community";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/configs";
import { db } from "@/libs/db";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

const CustomFeed: React.FC<Props> = async ({ session }) => {
  const followedComunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      subZeddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subZeddit: {
        name: {
          in: followedComunities.map(({ subZeddit }) => subZeddit.id),
        },
      },
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subZeddit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <Feed initialPosts={posts} />;
};

export default CustomFeed;
