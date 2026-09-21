import { Router } from "express";

import { authenticate } from "../../../../common/middleware/authenticate.js";
import { applicantReferenceController } from "./applicant-complaince-reference.controller.js";

const referenceApplicantRouter = Router();

referenceApplicantRouter.get(
  "/references",
  authenticate,
  applicantReferenceController.getReferences,
);

referenceApplicantRouter.get(
  "/references/:referenceId",
  authenticate,
  applicantReferenceController.getReferenceById,
);

referenceApplicantRouter.post(
  "/references",
  authenticate,
  applicantReferenceController.createReference,
);

referenceApplicantRouter.patch(
  "/references/:referenceId",
  authenticate,
  applicantReferenceController.updateReference,
);

referenceApplicantRouter.delete(
  "/references/:referenceId",
  authenticate,
  applicantReferenceController.deleteReference,
);

referenceApplicantRouter.post(
  "/references/submit",
  authenticate,
  applicantReferenceController.submitReferences,
);

export default referenceApplicantRouter;
