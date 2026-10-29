import { z } from "zod";

export const createRoleSchema = z.object({
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

  permissionIds: z
    .array(z.uuid("Invalid permission ID."))
    .max(100, "Too many permissions selected.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate permissions are not allowed.",
    ),
});
