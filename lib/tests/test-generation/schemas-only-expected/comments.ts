import { z } from "zod";

import { Timestamp } from "./common";
import { Status } from "./common";

const Comment = Timestamp.and(
  z
    .object({
      id: z.number().int(),
      content: z.string(),
      postId: z.number().int(),
      authorId: z.number().int(),
      status: Status,
    })
    .passthrough()
);

export const schemas = {
  Comment,
};
