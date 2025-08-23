import { z } from "zod";

import { Timestamp, Status } from "./common";

const User = Timestamp.and(
  z
    .object({
      id: z.number().int(),
      name: z.string(),
      email: z.string().email(),
      status: Status,
      profileImage: z.string().nullish(),
    })
    .passthrough()
);
const CreateUserRequest = z
  .object({
    name: z.string(),
    email: z.string().email(),
    profileImage: z.string().optional(),
  })
  .passthrough();

export const schemas = {
  User,
  CreateUserRequest,
};
