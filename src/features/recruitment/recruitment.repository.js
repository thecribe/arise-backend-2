/**
 * -----------------------------------------------------------------------------
 * File: recruitment.repository.js
 *
 * Description:
 * Database queries for the Recruitment feature.
 *
 * Responsibilities:
 * - Retrieve Recruitment filter data stored in the database.
 * - Retrieve Recruitment applicants.
 *
 * Business logic remains inside recruitment.service.js.
 * -----------------------------------------------------------------------------
 */

import { Op, literal } from "sequelize";

import {
  JobType,
  User,
  ApplicantApplication,
  ApplicationStatusHistory,
  ApplicantApplicationPhase,
  ApplicantApplicationSection,
  ApplicantApplicationSectionValue,
  ApplicationSectionReviewComment,
} from "../../database/models/index.js";

/**
 * -----------------------------------------------------------------------------
 * Find job types.
 * -----------------------------------------------------------------------------
 *
 * Job types are stored in the database and are used by the Recruitment
 * applicant filter.
 */
const findJobTypes = async () => {
  return JobType.findAll({
    attributes: ["id", "name"],

    /**
     * Keep filter options consistently ordered.
     */
    order: [["name", "ASC"]],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find Recruitment applicants.
 * -----------------------------------------------------------------------------
 *
 * Supported filters:
 *
 * - search
 * - jobTypeId
 * - phaseId
 * - status
 *
 * Pagination is handled at the database level.
 *
 * Important:
 *
 * Application status is NOT stored directly on ApplicantApplication.
 * The current status is determined by the latest record in
 * application_status_history.
 * -----------------------------------------------------------------------------
 */
const findApplicants = async ({
  page,
  pageSize,
  search,
  jobTypeId,
  phaseId,
  status,
}) => {
  // ---------------------------------------------------------------------------
  // Calculate pagination offset.
  // ---------------------------------------------------------------------------

  const offset = (page - 1) * pageSize;

  // ---------------------------------------------------------------------------
  // Application-level filters.
  //
  // Keeping these inside an Op.and array allows additional application
  // filters to be added later without replacing existing conditions.
  // ---------------------------------------------------------------------------

  const applicationConditions = [];

  // ---------------------------------------------------------------------------
  // Filter by current application phase.
  //
  // current_phase_id already exists directly on ApplicantApplication.
  // Therefore, we do not need ApplicantApplicationPhase for this filter.
  // ---------------------------------------------------------------------------

  if (phaseId) {
    applicationConditions.push({
      current_phase_id: phaseId,
    });
  }

  // ---------------------------------------------------------------------------
  // Filter by current application status.
  //
  // An application can have many status history records.
  //
  // Example:
  //
  // IN_PROGRESS
  //      ↓
  // REJECTED
  //      ↓
  // IN_PROGRESS
  //
  // Only the latest record represents the current status.
  // ---------------------------------------------------------------------------

  if (status) {
    applicationConditions.push(
      literal(`
        EXISTS (
          SELECT 1
          FROM application_status_history AS current_status

          WHERE current_status.application_id =
            ApplicantApplication.id

            AND current_status.status =
              '${status}'

            AND NOT EXISTS (
              SELECT 1
              FROM application_status_history AS newer_status

              WHERE newer_status.application_id =
                current_status.application_id

                AND (
                  newer_status.created_at >
                    current_status.created_at

                  OR (
                    newer_status.created_at =
                      current_status.created_at

                    AND newer_status.id >
                      current_status.id
                  )
                )
            )
        )
      `),
    );
  }

  // ---------------------------------------------------------------------------
  // Build the application WHERE clause.
  //
  // If no application-level filters exist, an empty object is used.
  // ---------------------------------------------------------------------------

  const where =
    applicationConditions.length > 0
      ? {
          [Op.and]: applicationConditions,
        }
      : {};

  // ---------------------------------------------------------------------------
  // Applicant-level filters.
  //
  // Applicant information is stored on User.
  // ---------------------------------------------------------------------------

  const applicantWhere = {};

  // ---------------------------------------------------------------------------
  // Search applicant by first name or last name.
  // ---------------------------------------------------------------------------

  if (search) {
    applicantWhere[Op.or] = [
      {
        first_name: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        last_name: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // Filter applicant by job type.
  // ---------------------------------------------------------------------------

  if (jobTypeId) {
    applicantWhere.job_type_id = jobTypeId;
  }

  // ---------------------------------------------------------------------------
  // Execute applicant query.
  // ---------------------------------------------------------------------------

  const { rows, count } = await ApplicantApplication.findAndCountAll({
    where,

    attributes: [
      "id",
      "applicant_id",
      "current_phase_id",
      "current_section_id",
      "progress",
      "submitted_at",
      "created_at",
      "updated_at",

      // ---------------------------------------------------------------------
      // Current application status.
      //
      // The latest status-history record is returned as current_status.
      // ---------------------------------------------------------------------

      [
        literal(`
            (
              SELECT status
              FROM application_status_history AS latest_status

              WHERE latest_status.application_id =
                ApplicantApplication.id

              ORDER BY
                latest_status.created_at DESC,
                latest_status.id DESC

              LIMIT 1
            )
          `),

        "current_status",
      ],
    ],

    // -----------------------------------------------------------------------
    // Applicant relationship.
    // -----------------------------------------------------------------------

    include: [
      {
        model: User,
        as: "applicant",

        attributes: ["id", "first_name", "last_name", "email", "job_type_id"],

        /**
         * Only apply the User WHERE clause when a search
         * or job type filter has been provided.
         */
        where:
          Object.keys(applicantWhere).length > 0 ? applicantWhere : undefined,

        // -------------------------------------------------------------------
        // Job type relationship.
        // -------------------------------------------------------------------

        include: [
          {
            model: JobType,
            as: "jobType",

            attributes: ["id", "name"],

            required: false,
          },
        ],
      },
    ],

    /**
     * Prevent duplicate application records caused by joins.
     */
    distinct: true,

    /**
     * Newest applications first.
     */
    order: [["created_at", "DESC"]],

    // -----------------------------------------------------------------------
    // Pagination.
    // -----------------------------------------------------------------------

    limit: pageSize,
    offset,
  });

  // ---------------------------------------------------------------------------
  // Return paginated result.
  // ---------------------------------------------------------------------------

  return {
    data: rows,

    pagination: {
      page,
      pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

/**
 * =============================================================================
 * SINGLE APPLICANT QUERIES
 * =============================================================================
 */

/**
 * -----------------------------------------------------------------------------
 * Find a single applicant application.
 * -----------------------------------------------------------------------------
 *
 * Important:
 *
 * This query intentionally does NOT load:
 *
 * - application sections
 * - section values
 * - section comments
 * - field definitions
 *
 * Those are loaded separately when the manager selects a section.
 */
const findApplicantApplicationById = async (applicantId) => {
  return ApplicantApplication.findOne({
    where: {
      applicant_id: applicantId,
    },

    attributes: [
      "id",
      "applicant_id",
      "current_phase_id",
      "current_section_id",
      "progress",
      "submitted_at",
      "created_at",
      "updated_at",
    ],

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
          "address",
          "postcode",
          "job_type_id",
        ],

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
      },
    ],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find latest application status.
 * -----------------------------------------------------------------------------
 *
 * The application does not store its current status directly.
 *
 * The latest status history record represents the current status.
 */
const findLatestApplicationStatus = async (applicationId) => {
  return ApplicationStatusHistory.findOne({
    where: {
      application_id: applicationId,
    },

    attributes: [
      "id",
      "previous_status",
      "status",
      "reason",
      "changed_by",
      "created_at",
    ],

    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find applicant application phases.
 * -----------------------------------------------------------------------------
 *
 * These records contain applicant-specific progress.
 *
 * Phase titles and descriptions are resolved later from the application
 * definition service.
 */
const findApplicantApplicationPhases = async (applicationId) => {
  return ApplicantApplicationPhase.findAll({
    where: {
      application_id: applicationId,
    },

    attributes: [
      "id",
      "application_id",
      "phase_id",
      "status",
      "started_at",
      "completed_at",
    ],

    order: [["created_at", "ASC"]],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find applicant application sections.
 * -----------------------------------------------------------------------------
 *
 * Only lightweight section progress is retrieved here.
 *
 * Section values are intentionally NOT loaded.
 */
const findApplicantApplicationSections = async (applicationId) => {
  return ApplicantApplicationSection.findAll({
    where: {
      application_id: applicationId,
    },

    attributes: [
      "id",
      "application_id",
      "section_id",
      "status",
      "submitted_at",
      "approved_at",
    ],

    order: [["created_at", "ASC"]],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Find a single application section for Recruitment review.
 * -----------------------------------------------------------------------------
 *
 * This query retrieves only the database information belonging to the
 * requested application section.
 *
 * Application-definition information such as:
 *
 * - title
 * - description
 * - fields
 * - order
 * - repeatable
 *
 * is resolved by the Recruitment service because those values come from the
 * application definition rather than the database.
 *
 * The repository is therefore responsible only for:
 *
 * - application section progress
 * - saved applicant values
 * - review comments
 * -----------------------------------------------------------------------------
 */
const findApplicationSectionDetails = async (
  applicationId,
  sectionId,
  options = {},
) => {
  /**
   * ---------------------------------------------------------------------------
   * Find section progress.
   * ---------------------------------------------------------------------------
   */
  const section = await ApplicantApplicationSection.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },

    ...options,
  });

  if (!section) {
    return null;
  }

  /**
   * ---------------------------------------------------------------------------
   * Find saved applicant values.
   * ---------------------------------------------------------------------------
   */
  const sectionValues = await ApplicantApplicationSectionValue.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },

    ...options,
  });

  /**
   * ---------------------------------------------------------------------------
   * Find all review comments.
   *
   * Comments are returned oldest first because they represent a review
   * history.
   * ---------------------------------------------------------------------------
   */
  const comments = await ApplicationSectionReviewComment.findAll({
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

    order: [
      ["created_at", "ASC"],
      ["id", "ASC"],
    ],

    ...options,
  });

  return {
    section,
    sectionValues,
    comments,
  };
};

const findApplicationSection = async ({
  applicationId,
  sectionId,
  transaction,
}) => {
  return ApplicantApplicationSection.findOne({
    where: {
      application_id: applicationId,
      section_id: sectionId,
    },
    transaction,
  });
};

const updateApplicationSectionStatus = async ({
  applicationId,
  sectionId,
  status,
  transaction,
}) => {
  const [updated] = await ApplicantApplicationSection.update(
    {
      status,

      /**
       * Only set approved_at when approving.
       */
      approved_at: status === "approved" ? new Date() : null,
    },
    {
      where: {
        application_id: applicationId,
        section_id: sectionId,
      },
      transaction,
    },
  );

  return updated;
};

/**
 * -----------------------------------------------------------------------------
 * Create a Recruitment Manager review comment.
 * -----------------------------------------------------------------------------
 */
const createSectionReviewComment = async ({
  applicationId,
  sectionId,
  comment,
  managerId,
  options = {},
}) => {
  return ApplicationSectionReviewComment.create(
    {
      application_id: applicationId,
      section_id: sectionId,
      comment,
      created_by: managerId,
    },
    options,
  );
};

/**
 * -----------------------------------------------------------------------------
 * Find a single section review comment.
 * -----------------------------------------------------------------------------
 *
 * Includes the manager who created the comment.
 */
const findSectionReviewCommentById = async (commentId, options = {}) => {
  return ApplicationSectionReviewComment.findByPk(commentId, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "first_name", "last_name"],
      },
    ],

    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update a Recruitment Manager review comment.
 * -----------------------------------------------------------------------------
 */
const updateSectionReviewComment = async (commentId, values, options = {}) => {
  const comment = await ApplicationSectionReviewComment.findByPk(
    commentId,
    options,
  );

  if (!comment) {
    return null;
  }

  await comment.update(values, options);

  return comment;
};

/**
 * -----------------------------------------------------------------------------
 * Delete a Recruitment Manager review comment.
 * -----------------------------------------------------------------------------
 */
const deleteSectionReviewComment = async (commentId, options = {}) => {
  return ApplicationSectionReviewComment.destroy({
    where: {
      id: commentId,
    },

    ...options,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Export Recruitment repository.
 * -----------------------------------------------------------------------------
 */

export const recruitmentRepository = {
  findJobTypes,
  findApplicants,

  findApplicantApplicationById,
  findLatestApplicationStatus,
  findApplicantApplicationPhases,
  findApplicantApplicationSections,

  findApplicationSectionDetails,

  findApplicationSection,
  updateApplicationSectionStatus,

  createSectionReviewComment,
  findSectionReviewCommentById,
  updateSectionReviewComment,
  deleteSectionReviewComment,
};
