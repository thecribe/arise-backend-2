import {
  findApplicantBySectionId,
  findApplicationById,
} from "../../features/applicant-application/applicant-application.repository.js";

import * as userRepository from "../../features/users/user.repository.js";
import { NotFoundError } from "../errors/not-found-error.js";

import { logger } from "../logger/logger.js";

export const loadUploadUser = async (req, res, next) => {
  try {
    const { sectionId, applicationId, applicantId } = req.params;

    /**
     * -------------------------------------------------------------------------
     * Resolve applicant from application.
     * -------------------------------------------------------------------------
     */
    if (applicationId) {
      const application = await findApplicationById(applicationId);

      if (!application) {
        return next(new NotFoundError("Applicant application not found."));
      }

      req.applicant = application.applicant;

      return next();
    }

    /**
     * -------------------------------------------------------------------------
     * Resolve applicant from application section.
     * -------------------------------------------------------------------------
     */
    if (sectionId) {
      const section = await findApplicantBySectionId(sectionId);

      if (!section) {
        return next(
          new NotFoundError("Applicant application section not found."),
        );
      }

      req.applicant = section.application.applicant;

      return next();
    }

    /**
     * -------------------------------------------------------------------------
     * Resolve applicant directly.
     * -------------------------------------------------------------------------
     */
    if (applicantId) {
      const applicant = await userRepository.findUserProfileById(applicantId);

      if (!applicant) {
        return next(new NotFoundError("Applicant not found."));
      }

      req.applicant = applicant;

      return next();
    }

    /**
     * -------------------------------------------------------------------------
     * No applicant identifier was supplied.
     * -------------------------------------------------------------------------
     */
    req.applicant = req.user;

    return next();
  } catch (error) {
    return next(error);
  }
};
