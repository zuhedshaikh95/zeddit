import { z } from "zod";

export const subZedditPayloadValidator = z.object({
  name: z.string().min(3).max(21),
});

export const subZedditSubscriptionValidator = z.object({
  subZedditId: z.string(),
});

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters" })
    .max(120, { message: "Title must be at least 128 characters" }),
  subZedditId: z.string(),
  content: z.any(),
});

export const postVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const commentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const postsRouteQueryValidator = z.object({
  limit: z.string(),
  page: z.string(),
  subZedditName: z.string().nullish().optional(),
});

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export const usernameValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Special characters are not a valid username" }),
});
