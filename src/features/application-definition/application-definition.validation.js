import { z } from "zod";

export const phaseIdSchema = z.object({
  phaseId: z.string().min(1),
});