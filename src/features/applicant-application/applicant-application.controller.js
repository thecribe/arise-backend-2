import * as applicantApplicationService from "./applicant-application.service.js";

const getApplicantApplication = async (req, res) => {
  const applicantId = req.user.id;

  const application =
    await applicantApplicationService.getApplicantApplication(
      applicantId,
    );

  return res.status(200).json({
    success: true,
    data: application,
  });
};

export const applicantApplicationController = {
  getApplicantApplication,
};