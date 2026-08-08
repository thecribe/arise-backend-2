import {
  ApplicantApplication,
  ApplicantApplicationPhase,
  ApplicantApplicationSection,
} from "../../database/models/index.js";



const createApplication = async (
  payload,
  options = {},
) => {
  return ApplicantApplication.create(
    payload,
    options,
  );
};

const createApplicationPhases = async (
  payload,
  options = {},
) => {
  return ApplicantApplicationPhase.bulkCreate(
    payload,
    options,
  );
};

const createApplicationSections = async (
  payload,
  options = {},
) => {
  return ApplicantApplicationSection.bulkCreate(
    payload,
    options,
  );
};

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

const findApplicationById = async (
  applicationId,
  options = {},
) => {
  return ApplicantApplication.findByPk(
    applicationId,
    options,
  );
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

export {
  createApplication,
  createApplicationPhases,
  createApplicationSections,
  findApplicationByApplicantId,
  findApplicationById,
  findApplicationPhases,
  findApplicationSections,
};