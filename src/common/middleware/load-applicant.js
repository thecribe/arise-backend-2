import { findApplicantBySectionId } from "../../features/applicant-application/applicant-application.repository.js";

export const loadUploadUser = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { sectionId } = req.params;

    const section = await findApplicantBySectionId(sectionId);

    req.applicant = section.application.applicant;

    next();
  } catch (error) {
    next(error);
  }
};
