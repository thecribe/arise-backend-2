import { Op } from "sequelize";
import ApplicantApplicationReference from "../../database/models/ApplicantApplicationReference.js";
import ApplicantApplicationReferenceMailStatus from "../../database/models/ApplicantApplicationReferenceMailStatus.js";
import ApplicantApplicationReferenceResponse from "../../database/models/ApplicantApplicationReferenceResponse.js";

const findReferencesByApplicationId = async (applicationId, options = {}) => {
  return ApplicantApplicationReference.findAll({
    where: {
      application_id: applicationId,
    },
    include: [
      {
        model: ApplicantApplicationReferenceResponse,
        as: "response",
        required: false,
      },
      {
        model: ApplicantApplicationReferenceMailStatus,
        as: "mailStatus",
        required: false,
      },
    ],
    order: [["created_at", "ASC"]],
    ...options,
  });
};

const findReferenceById = async (referenceId, options = {}) => {
  return ApplicantApplicationReference.findByPk(referenceId, {
    include: [
      {
        model: ApplicantApplicationReferenceResponse,
        as: "response",
        required: false,
      },
      {
        model: ApplicantApplicationReferenceMailStatus,
        as: "mailStatus",
        required: false,
      },
    ],
    ...options,
  });
};

const findReferenceByApplicationIdAndId = async (
  applicationId,
  referenceId,
  options = {},
) => {
  return ApplicantApplicationReference.findOne({
    where: {
      id: referenceId,
      application_id: applicationId,
    },
    include: [
      {
        model: ApplicantApplicationReferenceResponse,
        as: "response",
        required: false,
      },
      {
        model: ApplicantApplicationReferenceMailStatus,
        as: "mailStatus",
        required: false,
      },
    ],
    ...options,
  });
};

const createReference = async (payload, options = {}) => {
  return ApplicantApplicationReference.create(payload, options);
};

const updateReference = async (reference, payload, options = {}) => {
  return reference.update(payload, options);
};

const findReferenceResponse = async (referenceId, options = {}) => {
  return ApplicantApplicationReferenceResponse.findOne({
    where: {
      reference_id: referenceId,
    },
    ...options,
  });
};

const createReferenceResponse = async (payload, options = {}) => {
  return ApplicantApplicationReferenceResponse.create(payload, options);
};

const updateReferenceResponse = async (response, payload, options = {}) => {
  return response.update(payload, options);
};

const findReferenceMailStatus = async (referenceId, options = {}) => {
  return ApplicantApplicationReferenceMailStatus.findOne({
    where: {
      reference_id: referenceId,
    },
    ...options,
  });
};

const createReferenceMailStatus = async (payload, options = {}) => {
  return ApplicantApplicationReferenceMailStatus.create(payload, options);
};

const updateReferenceMailStatus = async (mailStatus, payload, options = {}) => {
  return mailStatus.update(payload, options);
};

const findReferencesByApplicationIdAndStatuses = async (
  applicationId,
  statuses,
  options = {},
) => {
  return ApplicantApplicationReference.findAll({
    where: {
      application_id: applicationId,
      status: {
        [Op.in]: statuses,
      },
    },
    ...options,
  });
};

export const referenceRepository = {
  findReferencesByApplicationId,
  findReferenceById,
  findReferenceByApplicationIdAndId,
  createReference,
  updateReference,

  findReferenceResponse,
  createReferenceResponse,
  updateReferenceResponse,

  findReferenceMailStatus,
  createReferenceMailStatus,
  updateReferenceMailStatus,

  findReferencesByApplicationIdAndStatuses,
};
