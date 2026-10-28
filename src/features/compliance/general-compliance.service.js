import { sequelize } from "../../config/database.js";
import complianceRepository from "./general-compliance.repository.js";

const COMPLIANCE_SECTION_IDS = {
  identityCompliance: "identity-compliance",
  rightToWork: "right-to-work",
  dbs: "dbs",
  professionalMemberships: "professional-memberships",
};

/**
 * Group records by application ID.
 *
 * This avoids repeatedly scanning the complete record arrays
 * for every applicant.
 */
const groupByApplicationId = (records = []) => {
  const result = new Map();

  for (const record of records) {
    const applicationId = record.application_id;

    if (!result.has(applicationId)) {
      result.set(applicationId, []);
    }

    result.get(applicationId).push(record);
  }

  return result;
};

/**
 * Select the most recently updated record for each section.
 */
const buildSectionMap = (records = []) => {
  const result = new Map();

  for (const record of records) {
    const existing = result.get(record.section_id);

    const recordUpdatedAt = new Date(record.updated_at ?? 0).getTime();

    const existingUpdatedAt = existing
      ? new Date(existing.updated_at ?? 0).getTime()
      : -Infinity;

    if (!existing || recordUpdatedAt >= existingUpdatedAt) {
      result.set(record.section_id, record);
    }
  }

  return result;
};

/**
 * Return a section's stored values.
 */
const getSectionValue = (sectionMap, sectionId) => {
  return sectionMap.get(sectionId)?.values ?? null;
};

/**
 * Build the top-level training requirement list.
 *
 * This list is independent of the applicant page, ensuring
 * that the frontend always receives the available columns.
 */
const buildTrainingRequirements = (requirements = []) => {
  return requirements.map((requirement) => ({
    id: requirement.id,
    name: requirement.name,
    description: requirement.description ?? null,
  }));
};

/**
 * Build an applicant's training compliance.
 *
 * Every active requirement is returned, including requirements
 * that have no uploaded certificate.
 */
const buildTraining = (
  applicationId,
  certificatesByApplication,
  requirements,
) => {
  const applicantCertificates =
    certificatesByApplication.get(applicationId) ?? [];

  const requirementDetails = requirements.map((requirement) => {
    const uploadedCertificates = applicantCertificates
      .filter((certificate) => certificate.requirement_id === requirement.id)
      .map((certificate) => ({
        id: certificate.id,
        certificateName: certificate.certificate_name,
        certificateNumber: certificate.certificate_number,
        issueDate: certificate.issue_date,
        expiryDate: certificate.expiry_date,
      }));

    return {
      requirementId: requirement.id,
      name: requirement.name,
      description: requirement.description ?? null,
      uploaded: uploadedCertificates.length > 0,
      certificates: uploadedCertificates,
    };
  });

  const missingCertificates = requirementDetails.filter(
    (requirement) => !requirement.uploaded,
  );

  return {
    requiredCount: requirementDetails.length,
    uploadedCount: requirementDetails.length - missingCertificates.length,
    missingCount: missingCertificates.length,
    missingCertificates,
    requirements: requirementDetails,
  };
};

/**
 * Build an applicant's reference compliance.
 *
 * A reference counts as received when a corresponding response
 * record exists.
 */
const buildReferences = (
  applicationId,
  referencesByApplication,
  allResponses,
) => {
  const references = referencesByApplication.get(applicationId) ?? [];

  const referenceIds = new Set(references.map((reference) => reference.id));

  const responseReferenceIds = new Set(
    allResponses
      .filter((response) => referenceIds.has(response.referenceId))
      .map((response) => response.referenceId),
  );

  const responsesReceived = responseReferenceIds.size;

  return {
    total: references.length,
    responsesReceived,
    outstanding: references.length - responsesReceived,
  };
};

/**
 * Transform one application and its related compliance records
 * into the frontend API contract.
 */
const buildComplianceApplicant = (application, records, groupedRecords) => {
  const applicant = application.applicant;
  const applicationId = application.id;

  const sectionValues = groupedRecords.sectionValues.get(applicationId) ?? [];

  const managerValues = groupedRecords.managerValues.get(applicationId) ?? [];

  const applicantSections = buildSectionMap(sectionValues);
  const applicantManagerSections = buildSectionMap(managerValues);

  return {
    id: applicant.id,
    applicationId,

    firstName: applicant.first_name,
    lastName: applicant.last_name,

    fullName: [applicant.first_name, applicant.last_name]
      .filter(Boolean)
      .join(" "),

    email: applicant.email,
    phoneNumber: applicant.phone_number,
    postcode: applicant.postcode,

    jobType: applicant.jobType
      ? {
          id: applicant.jobType.id,
          name: applicant.jobType.name,
        }
      : null,

    compliance: {
      identity: getSectionValue(
        applicantSections,
        COMPLIANCE_SECTION_IDS.identityCompliance,
      ),

      rightToWork: getSectionValue(
        applicantManagerSections,
        COMPLIANCE_SECTION_IDS.rightToWork,
      ),

      dbs: getSectionValue(
        applicantManagerSections,
        COMPLIANCE_SECTION_IDS.dbs,
      ),

      professionalMemberships: getSectionValue(
        applicantSections,
        COMPLIANCE_SECTION_IDS.professionalMemberships,
      ),

      training: buildTraining(
        applicationId,
        groupedRecords.certificates,
        records.requirements,
      ),

      references: buildReferences(
        applicationId,
        groupedRecords.references,
        records.referenceResponses,
      ),
    },
  };
};

/**
 * Retrieve paginated compliance records.
 */
const listCompliance = async ({
  page = 1,
  limit = 10,
  search = "",
  jobTypeId = "",
}) => {
  const normalizedPage = Math.max(1, Number(page) || 1);

  const normalizedLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  return sequelize.transaction(async (transaction) => {
    const { rows, total } = await complianceRepository.findApprovedApplications(
      {
        page: normalizedPage,
        limit: normalizedLimit,
        search: search.trim(),
        jobTypeId,
      },
      { transaction },
    );

    const applicationIds = rows.map((application) => application.id);

    const records = await complianceRepository.findComplianceRecords(
      applicationIds,
      { transaction },
    );

    const groupedRecords = {
      sectionValues: groupByApplicationId(records.sectionValues),
      managerValues: groupByApplicationId(records.managerValues),
      certificates: groupByApplicationId(records.certificates),
      references: groupByApplicationId(records.references),
    };

    return {
      data: rows.map((application) =>
        buildComplianceApplicant(
          application.get({ plain: true }),
          records,
          groupedRecords,
        ),
      ),

      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        totalPages: Math.ceil(total / normalizedLimit),
      },

      // Available training columns are returned independently
      // of the current page's applicants.
      trainingRequirements: buildTrainingRequirements(records.requirements),
    };
  });
};

const complianceService = {
  listCompliance,
};

export default complianceService;
