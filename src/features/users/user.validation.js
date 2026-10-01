import { z } from "zod";

/**
 * -----------------------------------------------------------------------------
 * User Validation Schemas
 * -----------------------------------------------------------------------------
 */

// Update user profile
export const updateUserProfileSchema = z
  .object({
    first_name: z.string().trim().min(1).max(100).optional(),
    last_name: z.string().trim().min(1).max(100).optional(),
    phone_number: z.string().trim().max(30).nullable().optional(),
    address: z.string().trim().max(255).nullable().optional(),
    postcode: z.string().trim().max(20).nullable().optional(),
    profile_img: z.any().nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field must be provided.",
  });

// Update user email
export const updateUserEmailSchema = z
  .object({
    email: z.string().trim().email().max(255),
  })
  .strict();

// Update user password
export const updateUserPasswordSchema = z
  .object({
    password: z.string().min(8).max(128),
  })
  .strict();

// Update user account activation
export const updateUserAccountStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();

// Update user role
export const updateUserRoleSchema = z
  .object({
    roleId: z.string().uuid(),
  })
  .strict();
