import type { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";

import { PostVoteClient } from "@/components/community/post";
import { getAuthSession } from "@/libs/auth";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const PostVoteServer = async ({ postId, initialVotesAmt, initialVote, getData }: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _votesAmt: number = 0;
  let _currentVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1), 0);

    _currentVote = post.votes.find((vote) => vote.userId === session?.user?.id)?.type;
  } else {
    // passed as props
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote;
  }

  return <PostVoteClient postId={postId} initialVotesAmt={_votesAmt} initialVote={_currentVote} />;
};

export default PostVoteServer;
