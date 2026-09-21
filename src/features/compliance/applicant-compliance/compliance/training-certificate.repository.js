/**
 * -----------------------------------------------------------------------------
 * File: training-certificate.repository.js
 *
 * Description:
 * Repository for applicant training certificate operations.
 *
 * Responsibilities:
 * - Fetch applicant applications.
 * - Fetch active certificate requirements.
 * - Fetch applicant certificates.
 * - Create, update, and delete certificates.
 * - Fetch and update application section status.
 * - Fetch section review comments.
 *
 * Notes:
 * - sectionId is supplied by the frontend.
 * - Audit logging belongs in the service layer.
 * - This repository is applicant-only.
 * -----------------------------------------------------------------------------
 */

import { ApplicantApplication } from "../../../../database/models/ApplicantApplication.js";

import { ApplicantApplicationSection } from "../../../../database/models/ApplicantApplicationSection.js";

import { ApplicantApplicationTrainingCertificate } from "../../../../database/models/ApplicantApplicationTrainingCertificate.js";

import { TrainingCertificateRequirement } from "../../../../database/models/TrainingCertificateRequirement.js";

import { ApplicationSectionReviewComment } from "../../../../database/models/ApplicationSectionReviewComment.js";

/**
 * -----------------------------------------------------------------------------
 * Find application by application ID.
 * -----------------------------------------------------------------------------
 */
const findApplicationById = async (applicationId, options = {}) => {
  return ApplicantApplication.findOne({
    where: {
      id: applicationId,
    },
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find application by applicant ID.
 * -----------------------------------------------------------------------------
 */
const findApplicationByApplicantId = async (applicantId, options = {}) => {
  return ApplicantApplication.findOne({
    where: {
      applicant_id: applicantId,
    },
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find all active training certificate requirements.
 *
 * All active requirements are mandatory.
 * -----------------------------------------------------------------------------
 */
const findActiveRequirements = async (options = {}) => {
  return TrainingCertificateRequirement.findAll({
    where: {
      active: true,
    },
    order: [["created_at", "ASC"]],
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find all applicant training certificates.
 * -----------------------------------------------------------------------------
 */
const findCertificatesByApplicationId = async (applicationId, options = {}) => {
  return ApplicantApplicationTrainingCertificate.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "ASC"]],
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find one certificate belonging to an application.
 * -----------------------------------------------------------------------------
 */
const findCertificateById = async (
  certificateId,
  applicationId,
  options = {},
) => {
  return ApplicantApplicationTrainingCertificate.findOne({
    where: {
      id: certificateId,
      application_id: applicationId,
    },
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Create an applicant training certificate.
 * -----------------------------------------------------------------------------
 */
const createCertificate = async (payload, options = {}) => {
  return ApplicantApplicationTrainingCertificate.create(payload, {
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update an applicant training certificate.
 * -----------------------------------------------------------------------------
 */
const updateCertificate = async (certificate, payload, options = {}) => {
  return certificate.update(payload, {
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Delete an applicant training certificate.
 * -----------------------------------------------------------------------------
 */
const deleteCertificate = async (certificate, options = {}) => {
  return certificate.destroy({
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find an application section by application ID and section ID.
 * -----------------------------------------------------------------------------
 */
const findSectionByApplicationId = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicantApplicationSection.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update application section status.
 * -----------------------------------------------------------------------------
 */
const updateSectionStatus = async (section, payload, options = {}) => {
  return section.update(payload, {
    transaction: options.transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find review comments for an application section.
 * -----------------------------------------------------------------------------
 */
const findSectionReviewComments = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicationSectionReviewComment.findAll({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    order: [["created_at", "ASC"]],
    transaction: options.transaction,
  });
};

export const trainingCertificateRepository = {
  findApplicationById,
  findApplicationByApplicantId,
  findActiveRequirements,
  findCertificatesByApplicationId,
  findCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  findSectionByApplicationId,
  updateSectionStatus,
  findSectionReviewComments,
};
