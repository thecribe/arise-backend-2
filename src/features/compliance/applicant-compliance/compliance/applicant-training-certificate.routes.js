import { Router } from "express";

import { authenticate } from "../../../../common/middleware/authenticate.js";
import trainingCertificateController from "./training-certificate.controller.js";
import { loadUploadUser } from "../../../../common/middleware/load-applicant.js";
import createUpload from "../../../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../../../common/middleware/applicationParseFormData.js";

const trainingCertificateApplicantRouter = Router();

/**
 * GET /training-certificates/:sectionId
 */
trainingCertificateApplicantRouter.get(
  "/training-certificates/:sectionId",
  authenticate,
  trainingCertificateController.getTrainingCertificates,
);

/**
 * GET /training-certificates/:sectionId/:certificateId
 */
trainingCertificateApplicantRouter.get(
  "/training-certificates/:sectionId/:certificateId",
  authenticate,
  trainingCertificateController.getTrainingCertificateById,
);

/**
 * POST /training-certificates/:sectionId
 */
trainingCertificateApplicantRouter.post(
  "/training-certificates/:sectionId",
  authenticate,
  loadUploadUser,
  createUpload("certificates").any(),
  applicationParseFormdata,
  trainingCertificateController.createTrainingCertificate,
);

/**
 * PATCH /training-certificates/:sectionId/:certificateId
 */
trainingCertificateApplicantRouter.patch(
  "/training-certificates/:sectionId/:certificateId",
  authenticate,
  loadUploadUser,
  createUpload("certificates").any(),
  applicationParseFormdata,
  trainingCertificateController.updateTrainingCertificate,
);

/**
 * DELETE /training-certificates/:sectionId/:certificateId
 */
trainingCertificateApplicantRouter.delete(
  "/training-certificates/:sectionId/:certificateId",
  authenticate,
  trainingCertificateController.deleteTrainingCertificate,
);

/**
 * POST /training-certificates/:sectionId/submit
 */
trainingCertificateApplicantRouter.post(
  "/training-certificates/:sectionId/submit",
  authenticate,

  trainingCertificateController.submitTrainingCertificates,
);

export default trainingCertificateApplicantRouter;
