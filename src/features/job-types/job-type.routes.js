import { Router } from "express";

import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { jobTypeController } from "./job-type.controller.js";
import { createJobTypeSchema } from "./schemas/create-job-type.schema.js";
import { updateJobTypeSchema } from "./schemas/update-job-type.schema.js";
import { validate } from "../../common/middleware/validate.js";

const router = Router();

/**
 * Retrieve all job types.
 */
router.get(
  "/",
  // authenticate,
  // authorize(PERMISSIONS.JOB_TYPE_VIEW.name),
  jobTypeController.getAll,
);

/**
 * Create a new job type.
 */
router.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.JOB_TYPE_CREATE.name),
  validate(createJobTypeSchema),
  jobTypeController.create,
);

/**
 * Update a job type.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.JOB_TYPE_UPDATE.name),
  validate(updateJobTypeSchema),
  jobTypeController.update,
);

/**
 * Set the default job type.
 */
router.patch(
  "/:id/default",
  authenticate,
  authorize(PERMISSIONS.JOB_TYPE_UPDATE.name),
  jobTypeController.setDefault,
);

/**
 * Delete a job type.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.JOB_TYPE_DELETE.name),
  jobTypeController.remove,
);

export { router as jobTypeRouter };
