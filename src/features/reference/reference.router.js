import { Router } from "express";

import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";

import { PERMISSIONS } from "../../common/constants/permissions.js";

import { referenceController } from "./reference.controller.js";
import { loadRecruitmentUser } from "./middleware/loadRecruitmentUser.js";
import { applicationParseFormdata } from "../../common/middleware/applicationParseFormData.js";
import createUpload from "../../common/middleware/createUpload.js";

// import { createReferenceSchema } from "./schemas/create-reference.schema.js";
// import { updateReferenceSchema } from "./schemas/update-reference.schema.js";
// import { submitReferencesSchema } from "./schemas/submit-references.schema.js";

const referenceRouter = Router();
/**
 * Retrieve all references for an application.
 */
referenceRouter.get(
  "/applications/:applicationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  referenceController.getReferences,
);

/**
 * Create a new reference.
 */
referenceRouter.post(
  "/applications/:applicationId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  //   validate(createReferenceSchema),
  referenceController.createReference,
);

/**
 * Update a reference.
 */
referenceRouter.patch(
  "/applications/:applicationId/:referenceId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  //   validate(updateReferenceSchema),
  referenceController.updateReference,
);
/**
 * Update a reference as a manager.
 */
referenceRouter.patch(
  "/applications/:applicationId/:referenceId/manager",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  referenceController.updateManagerReference,
);

/**
 * Submit all references for an application.
 */
referenceRouter.post(
  "/applications/:applicationId/submit",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_SUBMIT.name),
  //   validate(submitReferencesSchema),
  referenceController.submitReferences,
);

/**
 * Update the status of a reference.
 */
referenceRouter.patch(
  "/applications/:applicationId/:referenceId/status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  referenceController.updateReferenceStatus,
);

/**
 * Retrieve the response submitted for a reference.
 */
referenceRouter.get(
  "/applications/:applicationId/:referenceId/response",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  referenceController.getReferenceResponse,
);

/**
 * Save a reference response on behalf of the referee.
 */
referenceRouter.post(
  "/applications/:applicationId/:referenceId/response",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  loadRecruitmentUser,
  createUpload("reference").any(),
  applicationParseFormdata,
  referenceController.saveManagerReferenceResponse,
);

/**
 * Update the mail status of a reference.
 */
referenceRouter.patch(
  "/applications/:applicationId/:referenceId/mail-status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_UPDATE.name),
  referenceController.updateReferenceMailStatus,
);

/**
 * Submit a reference response.
 *
 * Token validation middleware will be added later.
 */
referenceRouter.post(
  "/references/:referenceId/response",
  referenceController.saveReferenceResponse,
);

/**
 * Refuse to provide a reference.
 *
 * Token validation middleware will be added later.
 */
referenceRouter.post(
  "/references/:referenceId/refuse",
  referenceController.refuseReference,
);

export { referenceRouter };
