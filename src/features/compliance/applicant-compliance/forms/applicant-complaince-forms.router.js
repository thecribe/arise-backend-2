import { Router } from "express";
import { applicantComplianceController } from "./applicant-complaince-forms.controller.js";
import { authenticate } from "../../../../common/middleware/authenticate.js";
import { loadUploadUser } from "../../../../common/middleware/load-applicant.js";
import createUpload from "../../../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../../../common/middleware/applicationParseFormData.js";

const applicantComplianceRouter = Router();

/**
 * Retrieve all applicant compliance sections.
 */
applicantComplianceRouter.get(
  "/compliance/sections",
  authenticate,
  applicantComplianceController.getSections,
);

/**
 * Retrieve a specific applicant compliance section.
 */
applicantComplianceRouter.get(
  "/compliance/sections/:sectionId",
  authenticate,
  applicantComplianceController.getSection,
);

/**
 * Save an applicant compliance section draft.
 */
applicantComplianceRouter.patch(
  "/compliance/sections/:sectionId/draft",
  authenticate,
  loadUploadUser,
  createUpload("applications").any(),
  applicationParseFormdata,
  applicantComplianceController.saveDraft,
);

/**
 * Submit an applicant compliance section.
 */
applicantComplianceRouter.post(
  "/compliance/sections/:sectionId/submit",
  authenticate,
  loadUploadUser,
  createUpload("applications").any(),
  applicationParseFormdata,
  applicantComplianceController.submitSection,
);

export default applicantComplianceRouter;
