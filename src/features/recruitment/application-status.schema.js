import { z } from "zod";

import {
  APPLICATION_STAGE,
  APPLICATION_STATUS,
} from "../../application-definition/constants.js";

export const updateApplicationStatusSchema = z
  .object({
    status: z
      .enum([
        APPLICATION_STATUS.IN_PROGRESS,
        APPLICATION_STATUS.REJECTED,
        APPLICATION_STATUS.APPROVED,
      ])
      .optional(),

    stage: z
      .enum([
        APPLICATION_STAGE.APPLICATION_FORM,
        APPLICATION_STAGE.INTERVIEW,
        APPLICATION_STAGE.COMPLIANCE,
      ])
      .optional(),

    reason: z
      .string()
      .trim()
      .min(1, "Reason cannot be empty.")
      .max(2000, "Reason cannot exceed 2000 characters.")
      .optional(),
  })
  .refine((data) => data.status || data.stage, {
    message: "At least one of status or stage must be provided.",
  });
