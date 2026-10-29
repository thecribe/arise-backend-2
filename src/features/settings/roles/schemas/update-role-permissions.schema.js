import { z } from "zod";

export const updateRolePermissionsSchema = z.object({
  permissionIds: z
    .array(z.uuid("Invalid permission ID."))
    .max(100, "Too many permissions selected.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate permissions are not allowed.",
    ),
});
