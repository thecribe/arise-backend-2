import { ApplicantDeclaration } from "../../database/models/ApplicantDeclaration.js";

const findDeclaration = async (applicationId, sectionId, options = {}) => {
  return ApplicantDeclaration.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    ...options,
  });
};

const findDeclarationsByApplicationId = async (applicationId, options = {}) => {
  return ApplicantDeclaration.findAll({
    where: {
      application_id: applicationId,
    },
    order: [["created_at", "ASC"]],
    ...options,
  });
};

const createDeclaration = async (
  { applicationId, sectionId, values },
  options = {},
) => {
  return ApplicantDeclaration.create(
    {
      application_id: applicationId,
      section_id: sectionId,
      values,
    },
    options,
  );
};

const updateDeclaration = async (declaration, values, options = {}) => {
  declaration.values = values;

  await declaration.save(options);

  return declaration;
};

const updateApplicationSectionStatus = async (
  section,
  status,
  options = {},
) => {
  section.status = status;

  await section.save(options);

  return section;
};
export {
  findDeclaration,
  findDeclarationsByApplicationId,
  createDeclaration,
  updateDeclaration,
  updateApplicationSectionStatus,
};
