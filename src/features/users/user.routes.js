import { Router } from "express";

import {
  updateUserProfileController,
  updateUserEmailController,
  updateUserPasswordController,
  updateUserAccountStatusController,
  updateUserRoleController,
  getApplicationStatus,
  updateApplicationStatus,
  getUserProfileController,
} from "./user.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import { authorize } from "../../common/middleware/authorize.js";
import { loadUploadUser } from "../../common/middleware/load-applicant.js";
import createUpload from "../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";

const router = Router();

/**
 * -----------------------------------------------------------------------------
 * User Routes
 * -----------------------------------------------------------------------------
 */
router.get(
  "/:applicantId/profile",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  getUserProfileController,
);
/**
 * Update user profile.
 */
router.patch(
  "/:applicantId/profile",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  loadUploadUser,
  createUpload("user-profile").any(),
  applicationParseFormdata,
  updateUserProfileController,
);

/**
 * Update user email.
 */
router.patch(
  "/:applicantId/email",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  updateUserEmailController,
);

/**
 * Update user password.
 */
router.patch(
  "/:applicantId/password",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  updateUserPasswordController,
);

/**
 * Update user account activation status.
 */
router.patch(
  "/:applicantId/account-status",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  updateUserAccountStatusController,
);

/**
 * Assign or change a user's role.
 */
router.patch(
  "/:applicantId/role",
  authenticate,
  authorize(PERMISSIONS.STAFF_VIEW.name),
  updateUserRoleController,
);

router.get("/:applicantId/application-status", getApplicationStatus);

router.patch("/:applicantId/application-status", updateApplicationStatus);

export { router as userRouter };
