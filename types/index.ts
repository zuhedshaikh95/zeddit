import { Comment, CommentVote, Post, Prisma, SubZeddit, User, Vote, VoteType } from "@prisma/client";
import { z } from "zod";

import { commentValidator, commentVoteValidator, postValidator, postVoteValidator } from "@/libs/validations";

export type RouteResponseT<T = undefined> = {
  data: T;
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

export interface ExtendedCommentI extends Comment {
  votes: CommentVote[];
  author: User;
}

export type CommentPayloadT = z.infer<typeof commentValidator>;

export interface ExtendedSubZedditI extends SubZeddit {
  _count: Prisma.SubZedditCountOutputType;
}
