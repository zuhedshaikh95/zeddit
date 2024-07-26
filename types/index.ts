import { SubZeddit, User, Vote } from "@prisma/client";
import { z } from "zod";

import { postValidator } from "@/libs/validations";

export type RouteResponseT<T> = {
  data: T | null;
  error: boolean;
  message: string;
};

export type PostT = z.infer<typeof postValidator>;

export type ExtendedPostT = {
  subZeddit: SubZeddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
