/**
 * -----------------------------------------------------------------------------
 * File: recruitment.service.js
 *
 * Description:
 * Business logic for the Recruitment feature.
 * -----------------------------------------------------------------------------
 */

import { recruitmentRepository } from "./recruitment.repository.js";

import applicationDefinitionService from "../../application-definition/service.js";
import {
  canManagerUpdateSectionStatus,
  validatePhaseStatusTransition,
} from "./application-section-status.utils.js";
import { recruitmentPhaseRepository } from "./recruitment-phase.repository.js";
import { sequelize } from "../../config/database.js";
import * as applicantApplicationRepository from "../applicant-application/applicant-application.repository.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { ForbiddenError } from "../../common/errors/forbidden-error.js";
import { UnauthorizedError } from "../../common/errors/unauthorized-error.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";

/**
 * -----------------------------------------------------------------------------
 * Map Recruitment section review comment.
 *
 * Converts the database model into the API response contract.
 * -----------------------------------------------------------------------------
 */
const mapSectionReviewComment = (comment) => {
  const data = comment.get({ plain: true });

  return {
    id: data.id,

    comment: data.comment,

    createdAt: data.createdAt,

    updatedAt: data.updatedAt,

    createdBy: {
      id: data.creator?.id ?? data.created_by,

      name: [data.creator?.first_name, data.creator?.last_name]
        .filter(Boolean)
        .join(" "),
    },
  };
};

/**
 * -----------------------------------------------------------------------------
 * Get Recruitment default data.
 * -----------------------------------------------------------------------------
 *
 * Job types come from the database.
 *
 * Application phases come from the hardcoded application definition.
 */
const getRecruitmentDefaultData = async () => {
  const jobTypes = await recruitmentRepository.findJobTypes();

  const phases = applicationDefinitionService.getPhases();

  return {
    jobTypes,
    phases,
  };
};

/**
 * -----------------------------------------------------------------------------
 * Get Recruitment applicants.
 * -----------------------------------------------------------------------------
 *
 * The query has already been validated by the controller.
 *
 * The service is responsible for:
 * - Validating application-definition references.
 * - Calling the repository.
 * - Mapping database records into the Recruitment API contract.
 * -----------------------------------------------------------------------------
 */
const getRecruitmentApplicants = async (filters) => {
  // ---------------------------------------------------------------------------
  // Validate the requested phase.
  //
  // Phase IDs are defined by the application definition rather than the
  // database, so this validation must happen against the definition service.
  // ---------------------------------------------------------------------------

  if (filters.phaseId) {
    const phase = applicationDefinitionService.getPhase(filters.phaseId);

    if (!phase) {
      throw new NotFoundError("Application phase not found.");
    }
  }

  // ---------------------------------------------------------------------------
  // Get applicants from the repository.
  // ---------------------------------------------------------------------------

  const result = await recruitmentRepository.findApplicants(filters);

  // ---------------------------------------------------------------------------
  // Map database records into the Recruitment API contract.
  // ---------------------------------------------------------------------------

  const data = result.data.map((application) => {
    const currentStage = applicationDefinitionService.getPhase(
      application.current_phase_id,
    );

    const currentStatus = application.get("current_status");

    if (!currentStatus) {
      throw new NotFoundError(
        `Application "${application.id}" has no status history.`,
      );
    }

    return {
      applicantId: application.applicant_id,

      applicationId: application.id,

      applicant: {
        id: application.applicant.id,

        firstName: application.applicant.first_name,

        lastName: application.applicant.last_name,

        email: application.applicant.email,
      },

      jobType: application.applicant.jobType
        ? {
            id: application.applicant.jobType.id,

            name: application.applicant.jobType.name,
          }
        : null,

      /**
       * Current application lifecycle status.
       */
      status: currentStatus,

      /**
       * Current application phase.
       */
      currentStage: currentStage
        ? {
            id: currentStage.id,
            title: currentStage.title,
            description: currentStage.description,
            order: currentStage.order,
          }
        : null,

      progress: application.progress,

      submittedAt: application.submitted_at,

      createdAt: application.created_at,

      updatedAt: application.updated_at,
    };
  });

  return {
    data,

    pagination: result.pagination,
  };
};

/**
 * =============================================================================
 * SINGLE APPLICANT
 * =============================================================================
 */

/**
 * -----------------------------------------------------------------------------
 * Resolve the current phase.
 *
 * Priority:
 *
 * 1. Valid phase stored on the application.
 * 2. First phase from the application definition.
 *
 * This prevents an incomplete application record from producing an empty
 * current phase on the frontend.
 * -----------------------------------------------------------------------------
 */
const resolveCurrentPhase = (application) => {
  const phases = applicationDefinitionService.getPhases();

  if (!phases.length) {
    throw new NotFoundError("Application definition has no phases.");
  }

  // ---------------------------------------------------------------------------
  // Prefer database value.
  // ---------------------------------------------------------------------------

  if (application.current_phase_id) {
    const currentPhase = applicationDefinitionService.getPhase(
      application.current_phase_id,
    );

    if (currentPhase) {
      return currentPhase;
    }
  }

  // ---------------------------------------------------------------------------
  // Fall back to first phase.
  // ---------------------------------------------------------------------------

  return phases[0];
};

/**
 * -----------------------------------------------------------------------------
 * Resolve current section.
 *
 * Priority:
 *
 * 1. Valid section stored on application.
 * 2. First section belonging to current phase.
 * 3. null if the phase has no sections.
 * -----------------------------------------------------------------------------
 */
const resolveCurrentSection = (application, currentPhase) => {
  // ---------------------------------------------------------------------------
  // Prefer database value.
  // ---------------------------------------------------------------------------

  if (application.current_section_id) {
    const currentSection = applicationDefinitionService.getSection(
      application.current_section_id,
    );

    if (currentSection) {
      return currentSection;
    }
  }

  // ---------------------------------------------------------------------------
  // Fall back to first section of current phase.
  // ---------------------------------------------------------------------------

  const phaseSections = applicationDefinitionService.getSections(
    currentPhase.id,
  );

  return phaseSections[0] ?? null;
};

/**
 * -----------------------------------------------------------------------------
 * Get a single Recruitment applicant.
 * -----------------------------------------------------------------------------
 *
 * Returns the lightweight applicant/application contract.
 *
 * Detailed section fields, values, repeatable entries and comments are NOT
 * returned here.
 */
const getRecruitmentApplicant = async (applicantId) => {
  // ---------------------------------------------------------------------------
  // Find application.
  // ---------------------------------------------------------------------------

  const application =
    await recruitmentRepository.findApplicantApplicationById(applicantId);

  // ---------------------------------------------------------------------------
  // An application itself is required.
  //
  // We do not manufacture an application when one does not exist.
  // ---------------------------------------------------------------------------

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  // ---------------------------------------------------------------------------
  // Resolve default/current phase and section.
  // ---------------------------------------------------------------------------

  const currentPhase = resolveCurrentPhase(application);

  const currentSection = resolveCurrentSection(application, currentPhase);

  // ---------------------------------------------------------------------------
  // Fetch applicant progress/status records.
  // ---------------------------------------------------------------------------

  const [latestStatus, phaseRecords, sectionRecords] = await Promise.all([
    recruitmentRepository.findLatestApplicationStatus(application.id),

    recruitmentRepository.findApplicantApplicationPhases(application.id),

    recruitmentRepository.findApplicantApplicationSections(application.id),
  ]);

  // ---------------------------------------------------------------------------
  // Resolve current application status.
  //
  // Existing applications should normally always have a status history because
  // initializeApplication creates the initial IN_PROGRESS record.
  //
  // If the record is missing, IN_PROGRESS is used as a defensive fallback.
  // ---------------------------------------------------------------------------

  const currentStatus = latestStatus?.status ?? "IN_PROGRESS";

  // ---------------------------------------------------------------------------
  // Create phase lookup.
  // ---------------------------------------------------------------------------

  const phaseMap = new Map(
    phaseRecords.map((phase) => [phase.phase_id, phase]),
  );

  // ---------------------------------------------------------------------------
  // Create section lookup grouped by phase.
  // ---------------------------------------------------------------------------

  const sectionsByPhase = new Map();

  for (const sectionRecord of sectionRecords) {
    const sectionDefinition = applicationDefinitionService.getSection(
      sectionRecord.section_id,
    );

    // -------------------------------------------------------------------------
    // Ignore stale database section records that no longer exist in the
    // application definition.
    // -------------------------------------------------------------------------

    if (!sectionDefinition) {
      continue;
    }

    const phaseId = sectionDefinition.phaseId;

    if (!sectionsByPhase.has(phaseId)) {
      sectionsByPhase.set(phaseId, []);
    }

    sectionsByPhase.get(phaseId).push({
      id: sectionDefinition.id,

      title: sectionDefinition.title,

      status: sectionRecord.status,
    });
  }

  // ---------------------------------------------------------------------------
  // Build phases from the application definition.
  //
  // This guarantees that the frontend always receives the complete application
  // structure, even if some progress records are missing.
  // ---------------------------------------------------------------------------

  const phases = applicationDefinitionService.getPhases().map((phase) => {
    const phaseRecord = phaseMap.get(phase.id);

    const isCurrentPhase = phase.id === currentPhase.id;

    // ---------------------------------------------------------------------
    // Determine phase status.
    //
    // Database status wins.
    //
    // If there is no database record:
    //
    // - current phase -> in_progress
    // - other phases  -> locked
    // ---------------------------------------------------------------------

    const phaseStatus =
      phaseRecord?.status ?? (isCurrentPhase ? "in_progress" : "locked");

    // ---------------------------------------------------------------------
    // Get database section summaries.
    // ---------------------------------------------------------------------

    const existingSections = sectionsByPhase.get(phase.id) ?? [];

    // ---------------------------------------------------------------------
    // Create lookup for existing sections.
    // ---------------------------------------------------------------------

    const existingSectionMap = new Map(
      existingSections.map((section) => [section.id, section]),
    );

    // ---------------------------------------------------------------------
    // Build sections from the definition.
    //
    // This guarantees sections are returned even when progress records
    // have not been created yet.
    // ---------------------------------------------------------------------

    const sections = applicationDefinitionService
      .getSections(phase.id)
      .map((section) => {
        const existingSection = existingSectionMap.get(section.id);

        return {
          id: section.id,

          title: section.title,

          status:
            existingSection?.status ??
            (isCurrentPhase ? "in_progress" : "locked"),
        };
      });

    return {
      id: phase.id,

      title: phase.title,

      description: phase.description,

      order: phase.order,

      status: phaseStatus,

      sections,
    };
  });

  // ---------------------------------------------------------------------------
  // Resolve progress.
  //
  // Missing progress defaults to 0.
  // ---------------------------------------------------------------------------

  const progress = Number.isFinite(Number(application.progress))
    ? Number(application.progress)
    : 0;

  // ---------------------------------------------------------------------------
  // Return Recruitment applicant detail.
  // ---------------------------------------------------------------------------

  return {
    applicant: {
      id: application.applicant.id,

      firstName: application.applicant.first_name,

      lastName: application.applicant.last_name,

      email: application.applicant.email,

      phone: application.applicant.phone_number ?? null,

      address: application.applicant.address ?? null,

      postcode: application.applicant.postcode ?? null,
    },

    jobType: application.applicant.jobType
      ? {
          id: application.applicant.jobType.id,

          name: application.applicant.jobType.name,
        }
      : null,

    /**
     * Current overall application status.
     */
    status: currentStatus,
    application_status: application.statusHistory[0],

    /**
     * Latest status transition.
     *
     * This is useful for the applicant detail page and gives us the reason
     * behind a rejection when one exists.
     */
    latestStatus: latestStatus
      ? {
          id: latestStatus.id,

          previousStatus: latestStatus.previous_status,

          status: latestStatus.status,

          reason: latestStatus.reason,

          changedBy: latestStatus.changed_by,

          createdAt: latestStatus.created_at,
        }
      : null,

    application: {
      id: application.id,

      currentPhase: currentPhase
        ? {
            id: currentPhase.id,

            title: currentPhase.title,

            description: currentPhase.description,

            order: currentPhase.order,
          }
        : null,

      currentSection: currentSection
        ? {
            id: currentSection.id,

            title: currentSection.title,
          }
        : null,

      progress,

      submittedAt: application.submitted_at ?? null,

      createdAt: application.created_at,

      updatedAt: application.updated_at,

      phases,
    },
  };
};

/**
 * -----------------------------------------------------------------------------
 * Get a single application section for Recruitment review.
 * -----------------------------------------------------------------------------
 *
 * The repository provides database state:
 *
 * - section progress
 * - saved applicant values
 * - review comments
 *
 * The application definition provides:
 *
 * - section title
 * - description
 * - order
 * - fields
 * - repeatable configuration
 *
 * The service combines both into the Recruitment API contract.
 * -----------------------------------------------------------------------------
 */
const getRecruitmentApplicantSection = async (applicationId, sectionId) => {
  /**
   * ---------------------------------------------------------------------------
   * Validate the application definition section first.
   * ---------------------------------------------------------------------------
   *
   * Section definitions are not stored in the database.
   */
  const sectionDefinition = applicationDefinitionService.getSection(sectionId);

  if (!sectionDefinition) {
    throw new NotFoundError("Application section definition not found.");
  }

  /**
   * ---------------------------------------------------------------------------
   * Retrieve database information.
   * ---------------------------------------------------------------------------
   */
  const result = await recruitmentRepository.findApplicationSectionDetails(
    applicationId,
    sectionId,
  );

  if (!result) {
    throw new NotFoundError("Application section not found.");
  }

  const { section, sectionValues, comments } = result;

  /**
   * ---------------------------------------------------------------------------
   * Resolve applicant values.
   *
   * The database may not contain saved values yet.
   *
   * We therefore return the appropriate empty structure rather than forcing
   * the frontend to handle null values.
   *
   * Normal section:
   *
   * {}
   *
   * Repeatable section:
   *
   * []
   * ---------------------------------------------------------------------------
   */
  let values;

  if (!sectionValues) {
    values = sectionDefinition.repeatable ? [] : {};
  } else {
    /**
     * -------------------------------------------------------------------------
     * Parse the JSON stored in the database.
     * -------------------------------------------------------------------------
     */
    try {
      values = JSON.parse(sectionValues.values);
    } catch {
      throw new ConflictError("Invalid section values stored in database.");
    }

    /**
     * -------------------------------------------------------------------------
     * Protect the API contract from malformed/null values.
     * -------------------------------------------------------------------------
     */
    if (values === null || values === undefined) {
      values = sectionDefinition.repeatable ? [] : {};
    }

    /**
     * -------------------------------------------------------------------------
     * Ensure repeatable sections always return arrays.
     * -------------------------------------------------------------------------
     */
    if (sectionDefinition.repeatable && !Array.isArray(values)) {
      throw new ConflictError("Invalid repeatable section values.");
    }

    /**
     * -------------------------------------------------------------------------
     * Ensure normal sections always return objects.
     * -------------------------------------------------------------------------
     */
    if (
      !sectionDefinition.repeatable &&
      (Array.isArray(values) || typeof values !== "object")
    ) {
      throw new ConflictError("Invalid non-repeatable section values.");
    }
  }

  /**
   * ---------------------------------------------------------------------------
   * Map review comments.
   *
   * Comments remain historical records and are returned oldest first by the
   * repository.
   * ---------------------------------------------------------------------------
   */

  const reviewComments = comments.map(mapSectionReviewComment);

  /**
   * ---------------------------------------------------------------------------
   * Return Recruitment section contract.
   * ---------------------------------------------------------------------------
   */
  return {
    id: sectionDefinition.id,

    /**
     * Application-definition metadata.
     */
    phaseId: sectionDefinition.phaseId,

    title: sectionDefinition.title,

    description: sectionDefinition.description,

    order: sectionDefinition.order,

    repeatable: sectionDefinition.repeatable,

    minItems: sectionDefinition.minItems,

    maxItems: sectionDefinition.maxItems,

    /**
     * Applicant-specific section status.
     */
    status: section.status,

    /**
     * Application-definition fields.
     */
    fields: sectionDefinition.fields,

    /**
     * Applicant submitted values.
     */
    values,

    /**
     * Review history.
     */
    review: {
      comments: reviewComments,
    },
  };
};

const updateApplicationSectionStatus = async ({
  applicationId,
  sectionId,
  status,
  comment,
  managerId,
}) => {
  return sequelize.transaction(async (transaction) => {
    /**
     * -------------------------------------------------------------------------
     * Find current section record.
     * -------------------------------------------------------------------------
     */

    const applicationSection =
      await recruitmentRepository.findApplicationSection({
        applicationId,
        sectionId,
        transaction,
      });

    if (!applicationSection) {
      throw new NotFoundError("Application section not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Validate status transition.
     * -------------------------------------------------------------------------
     */

    const canUpdate = canManagerUpdateSectionStatus(
      applicationSection.status,
      status,
    );

    if (!canUpdate) {
      throw new ConflictError(
        `Cannot change section status from "${applicationSection.status}" to "${status}".`,
      );
    }

    /**
     * -------------------------------------------------------------------------
     * Update the section status.
     * -------------------------------------------------------------------------
     */

    await recruitmentRepository.updateApplicationSectionStatus({
      applicationId,
      sectionId,
      status,
      transaction,
    });

    /**
     * -------------------------------------------------------------------------
     * If rejecting, create the rejection comment.
     *
     * This uses the separate comment model you created earlier.
     * -------------------------------------------------------------------------
     */
    if (status === "rejected") {
      if (!comment?.trim()) {
        throw new ForbiddenError(
          "A comment is required when rejecting a section.",
        );
      }

      await recruitmentRepository.createSectionReviewComment({
        applicationId,
        sectionId,
        comment,
        managerId: managerId,
        transaction,
      });
    }

    /**
     * -------------------------------------------------------------------------
     * Return updated section.
     * -------------------------------------------------------------------------
     */

    return recruitmentRepository.findApplicationSection({
      applicationId,
      sectionId,
      transaction,
    });
  });
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
}) => {
  /**
   * ---------------------------------------------------------------------------
   * Ensure the application section exists.
   * ---------------------------------------------------------------------------
   */

  const section = await recruitmentRepository.findApplicationSection({
    applicationId,
    sectionId,
  });

  if (!section) {
    throw new NotFoundError("Application section not found.");
  }

  /**
   * ---------------------------------------------------------------------------
   * Create the comment.
   * ---------------------------------------------------------------------------
   */

  const createdComment = await recruitmentRepository.createSectionReviewComment(
    {
      applicationId,
      sectionId,
      comment,
      managerId,
    },
  );

  /**
   * ---------------------------------------------------------------------------
   * Retrieve the comment again with creator information.
   * ---------------------------------------------------------------------------
   */

  const commentWithCreator =
    await recruitmentRepository.findSectionReviewCommentById(createdComment.id);

  if (!commentWithCreator) {
    throw new ForbiddenError("Review comment could not be retrieved.");
  }

  return mapSectionReviewComment(commentWithCreator);
};

/**
 * -----------------------------------------------------------------------------
 * Update a Recruitment Manager review comment.
 * -----------------------------------------------------------------------------
 */
const updateSectionReviewComment = async ({
  applicationId,
  sectionId,
  commentId,
  comment,
  managerId,
}) => {
  /**
   * ---------------------------------------------------------------------------
   * Find the existing comment.
   * ---------------------------------------------------------------------------
   */

  const existingComment =
    await recruitmentRepository.findSectionReviewCommentById(commentId);

  if (!existingComment) {
    throw new NotFoundError("Review comment not found.");
  }

  /**
   * ---------------------------------------------------------------------------
   * Ensure the comment belongs to this application.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.application_id !== applicationId) {
    throw new UnauthorizedError(
      "Review comment does not belong to this application.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Ensure the comment belongs to this section.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.section_id !== sectionId) {
    throw new UnauthorizedError(
      "Review comment does not belong to this application section.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Only the creator can edit the comment.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.created_by !== managerId) {
    throw new UnauthorizedError(
      "You are not allowed to edit this review comment.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Update the comment.
   * ---------------------------------------------------------------------------
   */

  await recruitmentRepository.updateSectionReviewComment(commentId, {
    comment,
  });

  /**
   * ---------------------------------------------------------------------------
   * Retrieve the updated comment.
   * ---------------------------------------------------------------------------
   */

  const updatedComment =
    await recruitmentRepository.findSectionReviewCommentById(commentId);

  if (!updatedComment) {
    throw new BadRequestError("Updated review comment could not be retrieved.");
  }

  return mapSectionReviewComment(updatedComment);
};

/**
 * -----------------------------------------------------------------------------
 * Delete a Recruitment Manager review comment.
 * -----------------------------------------------------------------------------
 */
const deleteSectionReviewComment = async ({
  applicationId,
  sectionId,
  commentId,
  managerId,
}) => {
  /**
   * ---------------------------------------------------------------------------
   * Find the existing comment.
   * ---------------------------------------------------------------------------
   */

  const existingComment =
    await recruitmentRepository.findSectionReviewCommentById(commentId);

  if (!existingComment) {
    throw new NotFoundError("Review comment not found.");
  }

  /**
   * ---------------------------------------------------------------------------
   * Ensure the comment belongs to this application.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.application_id !== applicationId) {
    throw new ForbiddenError(
      "Review comment does not belong to this application.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Ensure the comment belongs to this section.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.section_id !== sectionId) {
    throw new ForbiddenError(
      "Review comment does not belong to this application section.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Only the creator can delete the comment.
   * ---------------------------------------------------------------------------
   */

  if (existingComment.created_by !== managerId) {
    throw new UnauthorizedError(
      "You are not allowed to delete this review comment.",
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * Delete the comment.
   * ---------------------------------------------------------------------------
   */

  await recruitmentRepository.deleteSectionReviewComment(commentId);
};

/**
 * -----------------------------------------------------------------------------
 * Update Application Phase Status
 *
 * Recruitment Managers control application phase progression.
 *
 * When a phase becomes in_progress:
 *
 * - Ensure all sections defined for that phase exist for the applicant.
 * - Create any missing section records.
 * - Set all phase sections to in_progress.
 *
 * When a phase becomes approved:
 *
 * - All sections become approved.
 *
 * When a phase becomes locked:
 *
 * - All sections become locked.
 * -----------------------------------------------------------------------------
 */

const updateApplicationPhaseStatus = async ({
  applicationId,
  phaseId,
  status,
}) => {
  return sequelize.transaction(async (transaction) => {
    /**
     * -------------------------------------------------------------------------
     * Validate application.
     * -------------------------------------------------------------------------
     */

    const application = await recruitmentPhaseRepository.findApplicationById(
      applicationId,
      {
        transaction,
      },
    );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Validate phase definition.
     * -------------------------------------------------------------------------
     */

    const phaseDefinition = applicationDefinitionService.getPhase(phaseId);

    if (!phaseDefinition) {
      throw new NotFoundError("Application phase definition not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Find applicant phase progress.
     * -------------------------------------------------------------------------
     */

    const phase = await recruitmentPhaseRepository.findApplicationPhase({
      applicationId,
      phaseId,
      transaction,
    });

    if (!phase) {
      throw new NotFoundError("Applicant application phase not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Validate phase transition.
     * -------------------------------------------------------------------------
     */

    validatePhaseStatusTransition({
      currentStatus: phase.status,
      nextStatus: status,
    });

    /**
     * -------------------------------------------------------------------------
     * Get all sections belonging to this phase.
     * -------------------------------------------------------------------------
     */

    const phaseSections =
      applicationDefinitionService.getSections(phaseId) ?? [];

    const sectionIds = phaseSections.map((section) => section.id);

    /**
     * -------------------------------------------------------------------------
     * When moving a phase to in_progress, synchronize section records.
     *
     * This ensures every section currently defined for the phase exists
     * for the applicant.
     * -------------------------------------------------------------------------
     */

    if (status === "in_progress" && sectionIds.length > 0) {
      const existingSections =
        await recruitmentPhaseRepository.findApplicationSections({
          applicationId,
          sectionIds,
          transaction,
        });

      /**
       * Create a lookup of existing section IDs.
       */

      const existingSectionIds = new Set(
        existingSections.map((section) => section.section_id),
      );

      /**
       * Find sections in the definition that do not yet have an
       * applicant-specific progress record.
       */

      const missingSections = phaseSections.filter(
        (section) => !existingSectionIds.has(section.id),
      );

      /**
       * Create missing section records.
       */

      if (missingSections.length > 0) {
        await recruitmentPhaseRepository.createApplicationSections({
          sections: missingSections.map((section) => ({
            application_id: applicationId,

            section_id: section.id,

            status: "in_progress",

            recruiter_comment: null,

            submitted_at: null,

            approved_at: null,
          })),

          transaction,
        });
      }
    }

    /**
     * -------------------------------------------------------------------------
     * Resolve phase timestamps.
     * -------------------------------------------------------------------------
     */

    let startedAt = phase.started_at;
    let completedAt = phase.completed_at;

    if (status === "in_progress") {
      /**
       * Preserve the original start date if one exists.
       *
       * If the phase has never been started, set it now.
       */

      startedAt = phase.started_at ?? new Date();

      /**
       * Reopening a phase means it is no longer completed.
       */

      completedAt = null;
    }

    if (status === "approved") {
      completedAt = new Date();
    }

    if (status === "locked") {
      startedAt = null;
      completedAt = null;
    }

    /**
     * -------------------------------------------------------------------------
     * Update phase status.
     * -------------------------------------------------------------------------
     */

    const updated =
      await recruitmentPhaseRepository.updateApplicationPhaseStatus({
        applicationId,
        phaseId,
        status,
        startedAt,
        completedAt,
        transaction,
      });

    if (!updated) {
      throw new ConflictError("Failed to update application phase status.");
    }

    /**
     * -------------------------------------------------------------------------
     * Synchronize all existing sections belonging to this phase.
     *
     * Missing sections have already been created above when required.
     * -------------------------------------------------------------------------
     */

    await recruitmentPhaseRepository.updatePhaseSectionsStatus({
      applicationId,
      sectionIds,
      status,
      transaction,
    });

    /**
     * -------------------------------------------------------------------------
     * Retrieve final database state.
     * -------------------------------------------------------------------------
     */

    const updatedPhase = await recruitmentPhaseRepository.findApplicationPhase({
      applicationId,
      phaseId,
      transaction,
    });

    if (!updatedPhase) {
      throw new ConflictError("Failed to retrieve updated application phase.");
    }

    /**
     * -------------------------------------------------------------------------
     * Return API contract.
     * -------------------------------------------------------------------------
     */

    return {
      id: updatedPhase.phase_id,

      status: updatedPhase.status,

      startedAt: updatedPhase.started_at
        ? updatedPhase.started_at.toISOString()
        : null,

      completedAt: updatedPhase.completed_at
        ? updatedPhase.completed_at.toISOString()
        : null,
    };
  });
};

const updateApplicationData = async (applicantId, sectionId, values) => {
  return sequelize.transaction(async (transaction) => {
    // -----------------------------------------------------------------------
    // Find applicant application
    // -----------------------------------------------------------------------

    const application =
      await applicantApplicationRepository.findApplicationByApplicantId(
        applicantId,
        {
          transaction,
        },
      );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    // -----------------------------------------------------------------------
    // Find section definition
    // -----------------------------------------------------------------------

    const section = applicationDefinitionService.getSection(sectionId);

    if (!section) {
      throw new NotFoundError("Application section definition not found.");
    }

    // convert values to array for repeateable sections

    if (section.repeatable && !Array.isArray(values)) {
      values = Object.values(values).map((item) => JSON.parse(item));
    }

    // -----------------------------------------------------------------------
    // Find applicant section progress
    // -----------------------------------------------------------------------

    const sectionProgress =
      await applicantApplicationRepository.findApplicationSection(
        application.id,
        sectionId,
        {
          transaction,
        },
      );

    if (!sectionProgress) {
      throw new NotFoundError("Application section not found.");
    }

    // -----------------------------------------------------------------------
    // Check section status
    // -----------------------------------------------------------------------

    // if (sectionProgress.status === "locked") {
    //   throw new ConflictError("This application section is locked.");
    // }

    // if (sectionProgress.status === "submitted") {
    //   throw new ConflictError("This application section has already been submitted.");
    // }

    // if (sectionProgress.status === "approved") {
    //   throw new ConflictError("This application section has already been approved.");
    // }
    // -----------------------------------------------------------------------
    // Validate repeatable section structure.
    // -----------------------------------------------------------------------

    if (section.repeatable && !Array.isArray(values)) {
      throw new ConflictError("Repeatable section values must be an array.");
    }

    // -----------------------------------------------------------------------
    // Validate non-repeatable section structure.
    // -----------------------------------------------------------------------

    if (
      !section.repeatable &&
      (values === null || Array.isArray(values) || typeof values !== "object")
    ) {
      throw new ConflictError(
        "Non-repeatable section values must be an object.",
      );
    }

    // -----------------------------------------------------------------------
    // Find existing saved values.
    // -----------------------------------------------------------------------

    const existingValues =
      await applicantApplicationRepository.findSectionValues(
        application.id,
        sectionId,
        {
          transaction,
        },
      );

    // -----------------------------------------------------------------------
    // Convert values to JSON string.
    //
    // The database stores this as a string because of the
    // MySQL JSON/default-value compatibility issue.
    // -----------------------------------------------------------------------

    const serializedValues = JSON.stringify(values);

    // -----------------------------------------------------------------------
    // Create or update.
    // -----------------------------------------------------------------------

    if (!existingValues) {
      await applicantApplicationRepository.createSectionValues(
        {
          application_id: application.id,
          section_id: sectionId,
          values: serializedValues,
        },
        {
          transaction,
        },
      );
    } else {
      await applicantApplicationRepository.updateSectionValues(
        existingValues,
        {
          values: serializedValues,
        },
        {
          transaction,
        },
      );
    }

    // -----------------------------------------------------------------------
    // Return the same structure expected by the frontend.
    //
    // Saving a draft does NOT change the section status.
    // -----------------------------------------------------------------------

    return {
      sectionId,
      applicantId,
      status: sectionProgress.status,
      values,
    };
  });
};
export {
  getRecruitmentDefaultData,
  getRecruitmentApplicants,
  getRecruitmentApplicant,
  getRecruitmentApplicantSection,
  updateApplicationSectionStatus,
  createSectionReviewComment,
  updateSectionReviewComment,
  deleteSectionReviewComment,
  updateApplicationPhaseStatus,
  updateApplicationData,
};
