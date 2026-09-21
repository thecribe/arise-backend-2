import { Op } from "sequelize";
import { ApplicantApplication } from "../../../../database/models/ApplicantApplication.js";
import ApplicantApplicationReference from "../../../../database/models/ApplicantApplicationReference.js";
import ApplicantApplicationReferenceMailStatus from "../../../../database/models/ApplicantApplicationReferenceMailStatus.js";

/**
 * Find an application belonging to an applicant.
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
 * Find all references belonging to an application.
 *
 * Applicant-facing queries intentionally exclude mailStatus.
 */
const findApplicantReferencesByApplicationId = async (
  applicationId,
  options = {},
) => {
  return ApplicantApplicationReference.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["createdAt", "ASC"]],
    ...options,
  });
};

/**
 * Find all references with internal mail status.
 *
 * Use this method for manager-side operations only.
 */
const findManagerReferencesByApplicationId = async (
  applicationId,
  options = {},
) => {
  return ApplicantApplicationReference.findAll({
    where: {
      application_id: applicationId,
    },
    include: [
      {
        model: ApplicantApplicationReferenceMailStatus,
        as: "mailStatus",
        required: false,
      },
    ],
    order: [["createdAt", "ASC"]],
    ...options,
  });
};

/**
 * Find one reference belonging to an application.
 */
const findReferenceById = async (referenceId, applicationId, options = {}) => {
  return ApplicantApplicationReference.findOne({
    where: {
      id: referenceId,
      application_id: applicationId,
    },
    ...options,
  });
};

/**
 * Create a reference and its mail status atomically.
 */
const createReference = async (data, options = {}) => {
  const { transaction } = options;

  const reference = await ApplicantApplicationReference.create(
    {
      ...data,
      status: "in_progress",
    },
    {
      transaction,
    },
  );

  await ApplicantApplicationReferenceMailStatus.create(
    {
      referenceId: reference.id,
      status: "Not sent",
    },
    {
      transaction,
    },
  );

  return reference;
};

/**
 * Update an individual reference.
 */
const updateReference = async (reference, data, options = {}) => {
  return reference.update(data, options);
};

/**
 * Delete an individual reference.
 */
const deleteReference = async (reference, options = {}) => {
  return reference.destroy(options);
};

/**
 * Submit all references that are still in progress or rejected.
 *
 * Existing submitted and approved references remain unchanged.
 */
const submitEligibleReferences = async (applicationId, options = {}) => {
  const { transaction } = options;

  const [affectedCount] = await ApplicantApplicationReference.update(
    {
      status: "submitted",
      updatedAt: new Date(),
    },
    {
      where: {
        application_id: applicationId,
        status: {
          [Op.in]: ["in_progress", "rejected"],
        },
      },
      transaction,
    },
  );

  return affectedCount;
};

export const referenceRepository = {
  findApplicationByApplicantId,
  findApplicantReferencesByApplicationId,
  findManagerReferencesByApplicationId,
  findReferenceById,
  createReference,
  updateReference,
  deleteReference,
  submitEligibleReferences,
};

export default referenceRepository;
