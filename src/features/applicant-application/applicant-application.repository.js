import {
  ApplicantApplication,
  ApplicantApplicationPhase,
  ApplicantApplicationSection,
  ApplicantApplicationSectionValue,
  ApplicationSectionReviewComment,
  ApplicationStatusHistory,
  User,
} from "../../database/models/index.js";

const createApplication = async (payload, options = {}) => {
  return ApplicantApplication.create(payload, options);
};

const createApplicationStatusHistory = async (payload, options = {}) => {
  return ApplicationStatusHistory.create(payload, options);
};
const createApplicationPhases = async (payload, options = {}) => {
  return ApplicantApplicationPhase.bulkCreate(payload, options);
};

const createApplicationSections = async (payload, options = {}) => {
  return ApplicantApplicationSection.bulkCreate(payload, options);
};

const findApplicationByApplicantId = async (applicantId, options = {}) => {
  return ApplicantApplication.findOne({
    where: {
      applicant_id: applicantId,
    },

    ...options,
  });
};

const findApplicationById = async (applicationId, options = {}) => {
  return ApplicantApplication.findByPk(applicationId, options);
};

const findApplicationPhases = async (applicationId, options = {}) => {
  return ApplicantApplicationPhase.findAll({
    where: {
      application_id: applicationId,
    },

    ...options,
  });
};

const findApplicationSections = async (applicationId, options = {}) => {
  return ApplicantApplicationSection.findAll({
    where: {
      application_id: applicationId,
    },

    ...options,
  });
};
/**
 * Find one section progress record.
 */
const findApplicationSection = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicantApplicationSection.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    ...options,
  });
};

/**
 * Find saved values for an application section.
 */
const findSectionValues = async (applicationId, sectionId, options = {}) => {
  return ApplicantApplicationSectionValue.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    ...options,
  });
};

/**
 * Create saved section values.
 */
const createSectionValues = async (payload, options = {}) => {
  return ApplicantApplicationSectionValue.create(payload, options);
};

/**
 * Update saved section values.
 */
const updateSectionValues = async (sectionValues, payload, options = {}) => {
  return sectionValues.update(payload, options);
};

const updateApplicationSection = async (
  sectionProgress,
  payload,
  options = {},
) => {
  return sectionProgress.update(payload, options);
};

const updateApplicationPhase = async (phaseProgress, payload, options = {}) => {
  return phaseProgress.update(payload, options);
};
const findApplicationPhase = async (applicationId, phaseId, options = {}) => {
  return ApplicantApplicationPhase.findOne({
    where: {
      application_id: applicationId,
      phase_id: phaseId,
    },
    ...options,
  });
};

const findApplicantBySectionId = async (sectionId, options = {}) => {
  return ApplicantApplicationSection.findOne({
    where: {
      section_id: sectionId,
    },
    include: [
      {
        model: ApplicantApplication,
        as: "application",
        include: [
          {
            model: User,
            as: "applicant",
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      },
    ],

    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find all review comments for an applicant application section.
 *
 * Comments are returned in the order they were originally created.
 *
 * The applicant-facing response does not require the manager/creator details.
 * -----------------------------------------------------------------------------
 */

const findApplicantSectionReviewComments = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicationSectionReviewComment.findAll({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },

    attributes: ["id", "comment", "created_at", "updated_at"],

    order: [
      ["created_at", "ASC"],
      ["id", "ASC"],
    ],

    ...options,
  });
};
export {
  createApplication,
  createApplicationStatusHistory,
  createApplicationPhases,
  createApplicationSections,
  findApplicationByApplicantId,
  findApplicationById,
  findApplicationPhases,
  findApplicationSections,
  findApplicationSection,
  findSectionValues,
  createSectionValues,
  updateSectionValues,
  updateApplicationSection,
  updateApplicationPhase,
  findApplicationPhase,
  findApplicantBySectionId,
  findApplicantSectionReviewComments,
};
