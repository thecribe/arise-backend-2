import { z } from "zod";

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(100, "Role name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters.")
    .nullable()
    .optional(),
});
