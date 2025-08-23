import { z } from "zod";

const Timestamp = z
  .object({
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const Status = z.enum(["active", "inactive", "pending"]);

export const schemas = {
  Timestamp,
  Status,
};
