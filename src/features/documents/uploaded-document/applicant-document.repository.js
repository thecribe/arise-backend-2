import { ApplicantDocument } from "../../../database/models/ApplicantDocument.js";

const findByApplicationId = async (applicationId, options = {}) => {
  return ApplicantDocument.findAll({
    ...options,
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "DESC"]],
  });
};

const findById = async (documentId, options = {}) => {
  return ApplicantDocument.findByPk(documentId, options);
};

const create = async (documentData, options = {}) => {
  return ApplicantDocument.create(documentData, options);
};

const createMany = async (documents, options = {}) => {
  return ApplicantDocument.bulkCreate(documents, options);
};

const deleteById = async (documentId, applicationId, options = {}) => {
  const document = await findByIdAndApplicationId(
    documentId,
    applicationId,
    options,
  );

  if (!document) {
    return null;
  }

  await document.destroy(options);

  return document;
};

const findByIdAndApplicationId = async (
  documentId,
  applicationId,
  options = {},
) => {
  return ApplicantDocument.findOne({
    ...options,
    where: {
      id: documentId,
      application_id: applicationId,
    },
  });
};

export const applicantDocumentRepository = {
  findByApplicationId,
  findById,
  create,
  createMany,
  deleteById,
  findByIdAndApplicationId,
};
