import { recruitmentRepository } from "../../recruitment/recruitment.repository.js";

export const loadRecruitmentUser = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { applicationId } = req.params;

    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
      );

    req.applicant = application.applicant;

    next();
  } catch (error) {
    next(error);
  }
};
