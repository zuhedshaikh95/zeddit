import React from "react";

import { CreateComment, PostComment } from "@/components/postId";
import { getAuthSession } from "@/libs/auth";
import { db } from "@/libs/db";

interface Props {
  postId: string;
}

const CommentsSection: React.FC<Props> = async ({ postId }) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
      author: true,
      votes: true,
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1),
              0
            );

            const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id);

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {/* TODO: render replies */}
                {topLevelComment.replies
                  .toSorted((a, b) => b.votes.length - a.votes.length)
                  .map((replyComment) => {
                    const replyVotesAmt = replyComment.votes.reduce(
                      (acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1),
                      0
                    );

                    const replyVote = replyComment.votes.find((vote) => vote.userId === session?.user.id);

                    return (
                      <div key={replyComment.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                        <PostComment
                          comment={replyComment}
                          currentVote={replyVote}
                          postId={postId}
                          votesAmt={replyVotesAmt}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
