import { Comment, Post, SubZeddit, User, Vote, VoteType } from "@prisma/client";
import { z } from "zod";

import { commentVoteValidator, postValidator, postVoteValidator } from "@/libs/validations";

export type RouteResponseT<T> = {
  data: T | null;
  error: boolean;
  message: string;
};

export type PostT = z.infer<typeof postValidator>;

export type ExtendedPostT = Post & {
  subZeddit: SubZeddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type PostVotePayloadT = z.infer<typeof postVoteValidator>;

export type CommentVotePayloadT = z.infer<typeof commentVoteValidator>;

export type CachedPostT = {
  id: string;
  title: string;
  authorUserName: string;
  content: string;
  currentVote: VoteType | null;
  createdAt: Date;
};
