import { z } from "zod";

import { postValidator } from "@/libs/validations";

export type RouteResponseT = {
  data: null | any;
  error: boolean;
  message: string;
};

export type PostT = z.infer<typeof postValidator>;
