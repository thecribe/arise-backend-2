import {
  findApplicantBySectionId,
  findApplicationById,
} from "../../features/applicant-application/applicant-application.repository.js";

export const loadUploadUser = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { sectionId, applicationId } = req.params;
    if (sectionId) {
      const section = await findApplicantBySectionId(sectionId);
      req.applicant = section.application.applicant;
    }

    if (applicationId) {
      const application = await findApplicationById(applicationId);
      console.log({ applicationId, application });
      req.applicant = application.applicant;
    }

    next();
  } catch (error) {
    next(error);
  }
};
