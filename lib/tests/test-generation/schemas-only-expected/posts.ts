import { z } from "zod";

import { Timestamp } from "./common";
import { Status } from "./common";

const Post = Timestamp.and(
  z
    .object({
      id: z.number().int(),
      title: z.string(),
      content: z.string(),
      authorId: z.number().int(),
      status: Status,
      tags: z.array(z.string()).optional(),
    })
    .passthrough()
);
const CreatePostRequest = z
  .object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
  })
  .passthrough();

export const schemas = {
  Post,
  CreatePostRequest,
};
