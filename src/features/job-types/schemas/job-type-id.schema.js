import { z } from "zod";

export const jobTypeIdSchema = z.object({
  id: z.uuid("Invalid job type id."),
});
