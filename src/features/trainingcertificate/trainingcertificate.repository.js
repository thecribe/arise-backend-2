import { TrainingCertificateRequirement } from "../../database/models/TrainingCertificateRequirement.js";

const findAll = async ({ includeInactive = false } = {}, options = {}) => {
  const where = {};

  if (!includeInactive) {
    where.active = true;
  }

  return TrainingCertificateRequirement.findAll({
    where,
    order: [["created_at", "ASC"]],
    ...options,
  });
};

const findById = async (id, options = {}) => {
  return TrainingCertificateRequirement.findByPk(id, options);
};

const findByName = async (name, options = {}) => {
  return TrainingCertificateRequirement.findOne({
    where: {
      name,
    },
    ...options,
  });
};

const create = async (data, options = {}) => {
  return TrainingCertificateRequirement.create(data, options);
};

const update = async (requirement, data, options = {}) => {
  return requirement.update(data, options);
};

export const trainingCertificateRepository = {
  findAll,
  findById,
  findByName,
  create,
  update,
};
