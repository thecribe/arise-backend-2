import { z } from "zod";

export const createJobTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Job type name must be at least 2 characters.")
    .max(100, "Job type name cannot exceed 100 characters."),
});
