/**
 * -----------------------------------------------------------------------------
 * File: recruitment-phase.repository.js
 *
 * Description:
 * Repository responsible for Recruitment Manager phase management.
 *
 * This repository is intentionally separate from the existing
 * recruitment.repository.js so that existing repository methods and
 * feature behaviour remain untouched.
 *
 * Responsibilities:
 *
 * - Find an applicant application.
 * - Find a specific application phase.
 * - Update application phase status.
 * - Update all sections belonging to a phase.
 * -----------------------------------------------------------------------------
 */

import { Op } from "sequelize";
import { ApplicantApplication } from "../../database/models/ApplicantApplication.js";
import { ApplicantApplicationPhase } from "../../database/models/ApplicantApplicationPhase.js";
import { ApplicantApplicationSection } from "../../database/models/ApplicantApplicationSection.js";

/**
 * -----------------------------------------------------------------------------
 * Find applicant application.
 * -----------------------------------------------------------------------------
 */

const findApplicationById = async (applicationId, options = {}) => {
  return ApplicantApplication.findByPk(applicationId, options);
};

/**
 * -----------------------------------------------------------------------------
 * Find application phase.
 * -----------------------------------------------------------------------------
 */

const findApplicationPhase = async ({
  applicationId,
  phaseId,
  transaction,
}) => {
  return ApplicantApplicationPhase.findOne({
    where: {
      application_id: applicationId,
      phase_id: phaseId,
    },

    transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Update application phase status.
 * -----------------------------------------------------------------------------
 */

const updateApplicationPhaseStatus = async ({
  applicationId,
  phaseId,
  status,
  startedAt,
  completedAt,
  transaction,
}) => {
  const [updated] = await ApplicantApplicationPhase.update(
    {
      status,
      started_at: startedAt,
      completed_at: completedAt,
    },
    {
      where: {
        application_id: applicationId,
        phase_id: phaseId,
      },

      transaction,
    },
  );

  return updated;
};

/**
 * -----------------------------------------------------------------------------
 * Update all sections belonging to an application phase.
 *
 * The Recruitment Manager controls phase state.
 *
 * Therefore:
 *
 * locked
 *   → all sections become locked
 *
 * in_progress
 *   → all sections become in_progress
 *
 * approved
 *   → all sections become approved
 * -----------------------------------------------------------------------------
 */

const updatePhaseSectionsStatus = async ({
  applicationId,
  sectionIds,
  status,
  transaction,
}) => {
  if (!sectionIds.length) {
    return 0;
  }

  const [updated] = await ApplicantApplicationSection.update(
    {
      status,

      /**
       * When the entire phase is approved, all sections are approved.
       *
       * Moving a phase back to in_progress or locked clears the approval
       * timestamp because the sections are no longer approved.
       */
      approved_at: status === "approved" ? new Date() : null,
    },
    {
      where: {
        application_id: applicationId,

        section_id: {
          [Op.in]: sectionIds,
        },
      },

      transaction,
    },
  );

  return updated;
};

/**
 * -----------------------------------------------------------------------------
 * Find application sections.
 *
 * Retrieves existing section progress records for the applicant application.
 * -----------------------------------------------------------------------------
 */

const findApplicationSections = async ({
  applicationId,
  sectionIds,
  transaction,
}) => {
  return ApplicantApplicationSection.findAll({
    where: {
      application_id: applicationId,

      section_id: {
        [Op.in]: sectionIds,
      },
    },

    transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Create application sections.
 *
 * Used when a phase is moved to in_progress and the current application
 * definition contains sections that do not yet exist for the applicant.
 * -----------------------------------------------------------------------------
 */

const createApplicationSections = async ({ sections, transaction }) => {
  if (!sections.length) {
    return [];
  }

  return ApplicantApplicationSection.bulkCreate(sections, {
    transaction,
  });
};

export const recruitmentPhaseRepository = {
  findApplicationById,
  findApplicationPhase,
  updateApplicationPhaseStatus,
  updatePhaseSectionsStatus,
  findApplicationSections,
  createApplicationSections,
};
