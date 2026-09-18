import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import trainingcertificateController from "./trainingcertificate.controller.js";

const trainingCertificateRouter = Router();

/**
 * Retrieve all training certificate requirements.
 */
trainingCertificateRouter.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  trainingcertificateController.getTrainingCertificateRequirements,
);

/**
 * Retrieve a single training certificate requirement.
 */
trainingCertificateRouter.get(
  "/:requirementId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  trainingcertificateController.getTrainingCertificateRequirementById,
);

/**
 * Create a training certificate requirement.
 */
trainingCertificateRouter.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  trainingcertificateController.createTrainingCertificateRequirement,
);

/**
 * Update a training certificate requirement.
 */
trainingCertificateRouter.patch(
  "/:requirementId",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  trainingcertificateController.updateTrainingCertificateRequirement,
);

/**
 * Activate or deactivate a training certificate requirement.
 */
trainingCertificateRouter.patch(
  "/:requirementId/status",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  trainingcertificateController.updateTrainingCertificateRequirementStatus,
);

export default trainingCertificateRouter;
