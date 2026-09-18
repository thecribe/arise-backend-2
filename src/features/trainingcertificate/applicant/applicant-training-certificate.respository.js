/**
 * -----------------------------------------------------------------------------
 * File: repository.js
 *
 * Description:
 * Repository for managing applicant training certificates.
 *
 * Responsibilities:
 * - Retrieve certificates
 * - Find certificates by application and ID
 * - Create certificates
 * - Update certificates
 * - Delete certificates through Sequelize paranoid mode
 * -----------------------------------------------------------------------------
 */

import { ApplicantApplicationTrainingCertificate } from "../../../database/models/ApplicantApplicationTrainingCertificate.js";
import { ApplicationSectionReviewComment } from "../../../database/models/ApplicationSectionReviewComment.js";
import { User } from "../../../database/models/User.js";

/**
 * Find all certificates belonging to an application.
 *

 */
const findByApplicationId = async (applicationId, options = {}) => {
  return ApplicantApplicationTrainingCertificate.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "ASC"]],
    ...options,
  });
};

/**
 * Find a certificate by application ID and certificate ID.

 */
const findByApplicationIdAndId = async (
  applicationId,
  certificateId,
  options = {},
) => {
  return ApplicantApplicationTrainingCertificate.findOne({
    where: {
      application_id: applicationId,
      id: certificateId,
    },
    ...options,
  });
};

/**
 * Find a certificate by application ID and requirement ID.
 *
 * Useful for checking whether an applicant has uploaded
 * a particular mandatory certificate.
 *

 */
const findByApplicationIdAndRequirementId = async (
  applicationId,
  requirementId,
  options = {},
) => {
  return ApplicantApplicationTrainingCertificate.findOne({
    where: {
      application_id: applicationId,
      requirement_id: requirementId,
    },
    ...options,
  });
};

/**
 * Create a training certificate.
 *

 */
const create = async (data, options = {}) => {
  return ApplicantApplicationTrainingCertificate.create(data, options);
};

/**
 * Update a training certificate.
 *

 */
const update = async (certificate, data, options = {}) => {
  return certificate.update(data, options);
};

/**
 * Delete a training certificate.
 *
 * Sequelize paranoid mode performs a soft delete.
 *

 */
const destroy = async (certificate, options = {}) => {
  return certificate.destroy(options);
};

//TRAINING COMMENT

/**
 * -----------------------------------------------------------------------------
 * File: repository.js
 *
 * Description:
 * Repository for application section review comments.
 * -----------------------------------------------------------------------------
 */

/**
 * Find all comments for an application section.
 */
const findCommentByApplicationIdAndSectionId = async (
  applicationId,
  sectionId,
  options = {},
) => {
  return ApplicationSectionReviewComment.findAll({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    include: [
      {
        model: User,
        as: "creator",

        attributes: ["id", "first_name", "last_name"],
      },
    ],
    order: [["created_at", "ASC"]],
    ...options,
  });
};

/**
 * Find a specific comment.
 */
const findCommentByApplicationIdAndSectionIdAndId = async (
  applicationId,
  sectionId,
  commentId,
  options = {},
) => {
  return ApplicationSectionReviewComment.findOne({
    where: {
      id: commentId,
      application_id: applicationId,
      section_id: sectionId,
    },
    ...options,
  });
};

/**
 * Create a comment.
 */
const createComment = async (data, options = {}) => {
  return ApplicationSectionReviewComment.create(data, options);
};

/**
 * Update a comment.
 */
const updateComment = async (comment, data, options = {}) => {
  return comment.update(data, options);
};

/**
 * Delete a comment.
 */
const destroyComment = async (comment, options = {}) => {
  return comment.destroy(options);
};

//Traiinng ceritificate status

/**
 * Update an application section.
 */
const updateCertificateStatus = async (section, data, options = {}) => {
  return section.update(data, options);
};

export const applicantTainingCertificateRepository = {
  findByApplicationId,
  findByApplicationIdAndId,
  findByApplicationIdAndRequirementId,
  create,
  update,
  destroy,

  //COMMNENT
  findCommentByApplicationIdAndSectionId,
  findCommentByApplicationIdAndSectionIdAndId,
  createComment,
  updateComment,
  destroyComment,

  //UPDATE STATUS
  updateCertificateStatus,
};
