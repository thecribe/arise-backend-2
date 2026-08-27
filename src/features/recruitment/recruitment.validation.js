import { z } from "zod";

export const updateApplicationSectionStatusSchema = z
  .object({
    status: z.enum(["in_progress", "approved", "rejected"]),

    comment: z.string().trim().min(1, "Comment cannot be empty.").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "rejected" && !data.comment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["comment"],
        message: "A comment is required when rejecting a section.",
      });
    }
  });

export const createSectionReviewCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment is required.")
    .max(5000, "Comment cannot exceed 5000 characters."),
});

export const updateSectionReviewCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment is required.")
    .max(5000, "Comment cannot exceed 5000 characters."),
});

/**
 * -----------------------------------------------------------------------------
 * Update Application Phase Status Schema
 * -----------------------------------------------------------------------------
 */

export const updateApplicationPhaseStatusSchema = z.object({
  status: z.enum(["locked", "in_progress", "approved"]),
});

/**
 * -----------------------------------------------------------------------------
 * Valid application phase status transitions.
 * -----------------------------------------------------------------------------
 */
