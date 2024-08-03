"use client";

import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useMemo, useRef } from "react";

import { Post } from "@/components/community/post";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/configs";
import { ExtendedPostT } from "@types";

interface Props {
  initialPosts: ExtendedPostT[];
  subZedditName?: string;
}

const CommunityFeed: React.FC<Props> = ({ initialPosts, subZedditName }) => {
  const lastPostRef = useRef<HTMLElement | null>(null);
  const { data: session } = useSession();
  const { ref, entry } = useIntersection({ root: lastPostRef.current, threshold: 1 });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infinite-post-feed"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `/api/v1/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&subZedditName=${subZedditName}`
      );

      return response.data as ExtendedPostT[]; // Ensure this returns the full RouteResponseT<ExtendedPostT[]> object
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.length === INFINITE_SCROLLING_PAGINATION_RESULTS ? pages.length + 1 : undefined;
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    initialPageParam: 1,
  });

  const posts = useMemo(() => data.pages.flatMap((post) => post) ?? initialPosts, [data, initialPosts]);

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const voteCount = post.votes.reduce((acc, vote) => (vote.type === "UP" ? acc + 1 : acc - 1), 0);

        const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                votesAmt={voteCount}
                currentVote={currentVote}
                commentsAmt={post.comments.length}
                subZedditName={post.subZeddit.name}
                post={post}
              />
            </li>
          );
        }

        return (
          <Post
            votesAmt={voteCount}
            currentVote={currentVote}
            commentsAmt={post.comments.length}
            subZedditName={post.subZeddit.name}
            post={post}
          />
        );
      })}
    </ul>
  );
};

export default CommunityFeed;
