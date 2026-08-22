import {
  ApplicantApplication,
  ApplicantApplicationPhase,
  ApplicantApplicationSection,
} from "../../database/models/index.js";

const findApplicationByApplicantId = async (
  applicantId,
  options = {},
) => {
  return ApplicantApplication.findOne({
    where: {
      applicant_id: applicantId,
    },
    ...options,
  });
};

const findApplicationPhases = async (
  applicationId,
  options = {},
) => {
  return ApplicantApplicationPhase.findAll({
    where: {
      application_id: applicationId,
    },
    ...options,
  });
};

const findApplicationSections = async (
  applicationId,
  options = {},
) => {
  return ApplicantApplicationSection.findAll({
    where: {
      application_id: applicationId,
    },
    ...options,
  });
};

export const dashboardRepository= {
  findApplicationByApplicantId,
  findApplicationPhases,
  findApplicationSections,
};