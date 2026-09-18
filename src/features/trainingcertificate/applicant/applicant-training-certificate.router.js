/**
 * -----------------------------------------------------------------------------
 * File: route.js
 *
 * Description:
 * Routes for applicant training certificates.
 * -----------------------------------------------------------------------------
 */

import { Router } from "express";

import applicantTrainingCertificateController from "./applicant-training-certificate.controller.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { loadRecruitmentUser } from "../../reference/middleware/loadRecruitmentUser.js";
import createUpload from "../../../common/middleware/createUpload.js";
import { applicationParseFormdata } from "../../../common/middleware/applicationParseFormData.js";

const applicantTrainingCertificateRouter = Router();

/**
 * Retrieve all training certificates for an application.
 */
applicantTrainingCertificateRouter.get(
  "/applications/:applicationId",
  authenticate,
  applicantTrainingCertificateController.getTrainingCertificates,
);

/**
 * Retrieve a single training certificate.
 */
applicantTrainingCertificateRouter.get(
  "/applications/:applicationId/:certificateId",
  authenticate,
  applicantTrainingCertificateController.getTrainingCertificateById,
);

/**
 * Create a training certificate.
 */
applicantTrainingCertificateRouter.post(
  "/applications/:applicationId",
  authenticate,
  loadRecruitmentUser,
  createUpload("certificates").any(),
  applicationParseFormdata,
  applicantTrainingCertificateController.createTrainingCertificate,
);

/**
 * Update a training certificate.
 */
applicantTrainingCertificateRouter.patch(
  "/applications/:applicationId/:certificateId",
  authenticate,
  loadRecruitmentUser,
  createUpload("certificates").any(),
  applicationParseFormdata,
  applicantTrainingCertificateController.updateTrainingCertificate,
);

/**
 * Delete a training certificate.
 */
applicantTrainingCertificateRouter.delete(
  "/applications/:applicationId/:certificateId",
  authenticate,
  applicantTrainingCertificateController.deleteTrainingCertificate,
);

//TRAINING COMMENT

/**
 * -----------------------------------------------------------------------------
 * File: route.js
 *
 * Description:
 * Routes for Training Certificate section comments.
 * -----------------------------------------------------------------------------
 */

/**
 * Retrieve comments for an application section.
 */
applicantTrainingCertificateRouter.get(
  "/applications/:applicationId/sections/:sectionId/comments",
  authenticate,
  applicantTrainingCertificateController.getComments,
);

/**
 * Create a section review comment.
 */
applicantTrainingCertificateRouter.post(
  "/applications/:applicationId/sections/:sectionId/comments",
  authenticate,
  applicantTrainingCertificateController.createComment,
);

/**
 * Update a section review comment.
 */
applicantTrainingCertificateRouter.patch(
  "/applications/:applicationId/sections/:sectionId/comments/:commentId",
  authenticate,
  applicantTrainingCertificateController.updateComment,
);

/**
 * Delete a section review comment.
 */
applicantTrainingCertificateRouter.delete(
  "/applications/:applicationId/sections/:sectionId/comments/:commentId",
  authenticate,
  applicantTrainingCertificateController.deleteComment,
);

/**
 * -----------------------------------------------------------------------------
 * File: route.js
 *
 * Description:
 * Routes for Training Certificate section status.
 * -----------------------------------------------------------------------------
 */

/**
 * Retrieve the section status.
 */
applicantTrainingCertificateRouter.get(
  "/applications/:applicationId/sections/:sectionId/status",
  authenticate,
  applicantTrainingCertificateController.getSectionStatus,
);

/**
 * Update the section status.
 */
applicantTrainingCertificateRouter.patch(
  "/applications/:applicationId/sections/:sectionId/status",
  authenticate,
  applicantTrainingCertificateController.updateSectionStatus,
);

export default applicantTrainingCertificateRouter;
