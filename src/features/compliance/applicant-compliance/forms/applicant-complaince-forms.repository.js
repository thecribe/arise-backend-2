
import { ApplicantApplication } from "../../../../database/models/ApplicantApplication.js";
import { ApplicantApplicationSection } from "../../../../database/models/ApplicantApplicationSection.js";
import { ApplicantApplicationSectionValue } from "../../../../database/models/ApplicantApplicationSectionValue.js";
import { ApplicationSectionReviewComment } from "../../../../database/models/ApplicationSectionReviewComment.js";

/**
 * ---------------------------------------------------------------------------
 * APPLICATION
 * ---------------------------------------------------------------------------
 */

/**
 * Find an applicant's application.
 */
const findApplicationByApplicantId = async (applicantId, options = {}) => {
  return ApplicantApplication.findOne({
    where: {
      applicant_id: applicantId,
    },
    ...options,
  });
};

/**
 * ---------------------------------------------------------------------------
 * SECTIONS
 * ---------------------------------------------------------------------------
 */

/**
 * Find all application sections.
 */
const findSectionsByApplicationId = async (applicationId, options = {}) => {
  return ApplicantApplicationSection.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "ASC"]],
    ...options,
  });
};

/**
 * Find a specific application section.
 */
const findSectionByApplicationIdAndSectionId = async (
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
 * Update an application section.
 */
const updateSection = async (section, data, options = {}) => {
  return section.update(data, options);
};

/**
 * ---------------------------------------------------------------------------
 * SECTION VALUES
 * ---------------------------------------------------------------------------
 */

/**
 * Find saved section values.
 */
const findValuesByApplicationIdAndSectionId = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicantApplicationSectionValue.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    ...options,
  });
};

/**
 * Create section values.
 */
const createValues = async (data, options = {}) => {
  return ApplicantApplicationSectionValue.create(data, options);
};

/**
 * Update section values.
 */
const updateValues = async (values, data, options = {}) => {
  return values.update(data, options);
};

/**
 * ---------------------------------------------------------------------------
 * REVIEW COMMENTS
 * ---------------------------------------------------------------------------
 */

/**
 * Find all review comments for a section.
 */
const findCommentsByApplicationIdAndSectionId = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicationSectionReviewComment.findAll({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    order: [["created_at", "DESC"]],
    ...options,
  });
};

export const applicantComplianceRepository = {
  // Application
  findApplicationByApplicantId,

  // Sections
  findSectionsByApplicationId,
  findSectionByApplicationIdAndSectionId,
  updateSection,

  // Values
  findValuesByApplicationIdAndSectionId,
  createValues,
  updateValues,

  // Comments
  findCommentsByApplicationIdAndSectionId,
};
