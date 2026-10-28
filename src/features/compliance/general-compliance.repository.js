import { Op } from "sequelize";
import { ApplicantApplication } from "../../database/models/ApplicantApplication.js";
import { User } from "../../database/models/User.js";
import { JobType } from "../../database/models/JobType.js";
import { ApplicationStatusHistory } from "../../database/models/ApplicationStatusHistory.js";
import { ApplicantApplicationSectionValue } from "../../database/models/ApplicantApplicationSectionValue.js";
import { ApplicantApplicationSectionManagerValue } from "../../database/models/ApplicantApplicationSectionManagerValue.js";
import { ApplicantApplicationTrainingCertificate } from "../../database/models/ApplicantApplicationTrainingCertificate.js";
import { TrainingCertificateRequirement } from "../../database/models/TrainingCertificateRequirement.js";
import ApplicantApplicationReference from "../../database/models/ApplicantApplicationReference.js";
import ApplicantApplicationReferenceResponse from "../../database/models/ApplicantApplicationReferenceResponse.js";

const parseValues = (value) => {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Finds approved applications with server-side filtering and pagination.
 *
 * Assumption: ApplicationStatusHistory contains one current-state record
 * per application, updated in place by updateApplicationStatus().
 */
const findApprovedApplications = async (
  { page, limit, search = "", jobTypeId = "" },
  { transaction } = {},
) => {
  const offset = (page - 1) * limit;
  const applicantWhere = {};

  if (search.trim()) {
    const terms = search.trim().split(/\s+/).filter(Boolean);

    applicantWhere[Op.and] = terms.map((term) => {
      const pattern = `%${term}%`;

      return {
        [Op.or]: [
          { first_name: { [Op.like]: pattern } },
          { last_name: { [Op.like]: pattern } },
          { postcode: { [Op.like]: pattern } },
        ],
      };
    });
  }

  if (jobTypeId) {
    applicantWhere.job_type_id = jobTypeId;
  }

  const result = await ApplicantApplication.findAndCountAll({
    attributes: ["id", "applicant_id", "created_at", "updated_at"],

    include: [
      {
        model: User,
        as: "applicant",
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "postcode",
          "job_type_id",
        ],
        where: applicantWhere,
        required: true,
        include: [
          {
            model: JobType,
            as: "jobType",
            attributes: ["id", "name"],
            required: false,
          },
        ],
      },
      {
        model: ApplicationStatusHistory,
        as: "statusHistory",
        attributes: [],
        where: {
          status: "APPROVED",
        },
        required: true,
      },
    ],

    distinct: true,
    limit,
    offset,
    order: [
      ["updated_at", "DESC"],
      ["id", "ASC"],
    ],

    transaction,
  });

  return {
    rows: result.rows,
    total: result.count,
  };
};

/**
 * Retrieves compliance records for the current page of applications.
 */
const findComplianceRecords = async (applicationIds, { transaction } = {}) => {
  if (!applicationIds.length) {
    return {
      sectionValues: [],
      managerValues: [],
      certificates: [],
      requirements: [],
      references: [],
      referenceResponses: [],
    };
  }

  const [sectionValues, managerValues, certificates, requirements, references] =
    await Promise.all([
      ApplicantApplicationSectionValue.findAll({
        where: {
          application_id: {
            [Op.in]: applicationIds,
          },
        },
        attributes: ["id", "application_id", "section_id", "values"],
        transaction,
      }),

      ApplicantApplicationSectionManagerValue.findAll({
        where: {
          application_id: {
            [Op.in]: applicationIds,
          },
        },
        attributes: ["id", "application_id", "section_id", "values"],
        transaction,
      }),

      ApplicantApplicationTrainingCertificate.findAll({
        where: {
          application_id: {
            [Op.in]: applicationIds,
          },
        },
        attributes: [
          "id",
          "application_id",
          "requirement_id",
          "certificate_name",
          "certificate_number",
          "issue_date",
          "expiry_date",
        ],
        transaction,
      }),

      // The current requirement model has an `active` flag but no
      // `mandatory` flag. Therefore, all active requirements are treated
      // as mandatory until the business rule is confirmed.
      TrainingCertificateRequirement.findAll({
        where: {
          active: true,
        },
        attributes: ["id", "name", "description", "active"],
        transaction,
      }),

      ApplicantApplicationReference.findAll({
        where: {
          applicationId: {
            [Op.in]: applicationIds,
          },
        },
        attributes: ["id", "applicationId", "companyName", "status"],
        transaction,
      }),
    ]);

  const referenceIds = references.map((reference) => reference.id);

  const referenceResponses = referenceIds.length
    ? await ApplicantApplicationReferenceResponse.findAll({
        where: {
          referenceId: {
            [Op.in]: referenceIds,
          },
        },
        attributes: ["id", "referenceId"],
        transaction,
      })
    : [];

  return {
    sectionValues: sectionValues.map((record) => ({
      ...record.get({ plain: true }),
      values: parseValues(record.values),
    })),

    managerValues: managerValues.map((record) => ({
      ...record.get({ plain: true }),
      values: parseValues(record.values),
    })),

    certificates: certificates.map((record) => record.get({ plain: true })),

    requirements: requirements.map((record) => record.get({ plain: true })),

    references: references.map((record) => record.get({ plain: true })),

    referenceResponses: referenceResponses.map((record) =>
      record.get({ plain: true }),
    ),
  };
};

const complianceRepository = {
  findApprovedApplications,
  findComplianceRecords,
};

export default complianceRepository;
