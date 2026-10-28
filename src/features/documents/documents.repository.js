import { Op } from "sequelize";
import { ApplicantApplicationSectionValue } from "../../database/models/ApplicantApplicationSectionValue.js";
import { ApplicantApplicationSectionManagerValue } from "../../database/models/ApplicantApplicationSectionManagerValue.js";
import { ApplicantApplicationTrainingCertificate } from "../../database/models/ApplicantApplicationTrainingCertificate.js";
import { TrainingCertificateRequirement } from "../../database/models/TrainingCertificateRequirement.js";
import ApplicantApplicationReference from "../../database/models/ApplicantApplicationReference.js";
import ApplicantApplicationReferenceResponse from "../../database/models/ApplicantApplicationReferenceResponse.js";

const findApplicantSectionValues = async (
  applicationId,
  sectionIds,
  transaction = undefined,
) => {
  if (!sectionIds?.length) {
    return [];
  }

  return ApplicantApplicationSectionValue.findAll({
    where: {
      application_id: applicationId,
      section_id: {
        [Op.in]: sectionIds,
      },
    },
    transaction,
  });
};

const findManagerSectionValues = async (
  applicationId,
  sectionIds,
  transaction = undefined,
) => {
  if (!sectionIds?.length) {
    return [];
  }

  return ApplicantApplicationSectionManagerValue.findAll({
    where: {
      application_id: applicationId,
      section_id: {
        [Op.in]: sectionIds,
      },
    },
    transaction,
  });
};

const findTrainingCertificatesByApplicationId = async (
  applicationId,
  transaction = undefined,
) => {
  return ApplicantApplicationTrainingCertificate.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "ASC"]],
    transaction,
  });
};

const findActiveTrainingCertificateRequirements = async (
  transaction = undefined,
) => {
  return TrainingCertificateRequirement.findAll({
    where: {
      active: true,
    },
    order: [["name", "ASC"]],
    transaction,
  });
};

const findReferencesByApplicationId = async (
  applicationId,
  transaction = undefined,
) => {
  return ApplicantApplicationReference.findAll({
    where: {
      applicationId,
    },
    order: [["created_at", "ASC"]],
    transaction,
  });
};

const findReferenceResponsesByReferenceIds = async (
  referenceIds,
  transaction = undefined,
) => {
  if (!referenceIds?.length) {
    return [];
  }

  return ApplicantApplicationReferenceResponse.findAll({
    where: {
      referenceId: {
        [Op.in]: referenceIds,
      },
    },
    order: [["created_at", "ASC"]],
    transaction,
  });
};

const documentsRepository = {
  findApplicantSectionValues,
  findManagerSectionValues,
  findTrainingCertificatesByApplicationId,
  findActiveTrainingCertificateRequirements,
  findReferencesByApplicationId,
  findReferenceResponsesByReferenceIds,
};

export default documentsRepository;
