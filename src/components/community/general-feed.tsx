import { Feed } from "@/components/community";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/configs";
import { db } from "@/libs/db";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;
