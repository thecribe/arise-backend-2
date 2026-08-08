import { sequelize } from "../../config/database.js";

import * as applicantApplicationRepository from "./applicant-application.repository.js";
import applicationDefinitionService from "../../application-definition/service.js";

import {
  mapApplicantApplication,
} from "./mappers/applicant-application.mapper.js";

const initializeApplication = async (
  applicantId,
  transaction,
) => {
  const phases =
    applicationDefinitionService.getPhases();

  if (!phases.length) {
    throw new Error(
      "Application definition has no phases.",
    );
  }

  const firstPhase = phases[0];

  const firstPhaseSections =
    applicationDefinitionService.getSections(
      firstPhase.id,
    );

  if (!firstPhaseSections.length) {
    throw new Error(
      `Application phase "${firstPhase.id}" has no sections.`,
    );
  }

  const firstSection = firstPhaseSections[0];

  const startedAt = new Date();

  // ---------------------------------------------------------------------------
  // Create applicant application
  // ---------------------------------------------------------------------------

  const application =
    await applicantApplicationRepository.createApplication(
      {
        applicant_id: applicantId,
        current_phase_id: firstPhase.id,
        current_section_id: firstSection.id,
        progress: 0,
        submitted_at: null,
      },
      {
        transaction,
      },
    );

  // ---------------------------------------------------------------------------
  // Create phase progress records
  // ---------------------------------------------------------------------------

  const phaseRecords = phases.map(
    (phase, index) => ({
      application_id: application.id,

      phase_id: phase.id,

      status:
        index === 0
          ? "in_progress"
          : "locked",

      started_at:
        index === 0
          ? startedAt
          : null,

      completed_at: null,
    }),
  );

  await applicantApplicationRepository.createApplicationPhases(
    phaseRecords,
    {
      transaction,
    },
  );

  // ---------------------------------------------------------------------------
  // Create section progress records
  //
  // Every section in the first phase is available.
  // Sections belonging to later phases are locked.
  // ---------------------------------------------------------------------------

  const sectionRecords = [];

  for (
    const [phaseIndex, phase]
    of phases.entries()
  ) {
    const sections =
      applicationDefinitionService.getSections(
        phase.id,
      );

    for (const section of sections) {
      sectionRecords.push({
        application_id: application.id,

        section_id: section.id,

        status:
          phaseIndex === 0
            ? "in_progress"
            : "locked",

        recruiter_comment: null,

        submitted_at: null,

        approved_at: null,
      });
    }
  }

  await applicantApplicationRepository.createApplicationSections(
    sectionRecords,
    {
      transaction,
    },
  );

  return application;
};

const synchronizeApplication = async (
  application,
  transaction,
) => {
  const phases =
    applicationDefinitionService.getPhases();

  const existingPhases =
    await applicantApplicationRepository.findApplicationPhases(
      application.id,
      {
        transaction,
      },
    );

  const existingSections =
    await applicantApplicationRepository.findApplicationSections(
      application.id,
      {
        transaction,
      },
    );

  // ---------------------------------------------------------------------------
  // Create lookup collections
  // ---------------------------------------------------------------------------

  const existingPhaseMap = new Map(
    existingPhases.map((phase) => [
      phase.phase_id,
      phase,
    ]),
  );

  const existingSectionIds = new Set(
    existingSections.map(
      (section) => section.section_id,
    ),
  );

  // ---------------------------------------------------------------------------
  // Find newly added phases and sections
  // ---------------------------------------------------------------------------

  const newPhaseRecords = [];
  const newSectionRecords = [];

  for (const phase of phases) {
    const phaseProgress =
      existingPhaseMap.get(phase.id);

    // -------------------------------------------------------------------------
    // New phase
    // -------------------------------------------------------------------------

    if (!existingPhaseMap.has(phase.id)) {
      newPhaseRecords.push({
        application_id: application.id,
        phase_id: phase.id,
        status: "locked",
        started_at: null,
        completed_at: null,
      });
    }

    // -------------------------------------------------------------------------
    // New sections
    // -------------------------------------------------------------------------

    const sections =
      applicationDefinitionService.getSections(
        phase.id,
      );

    for (const section of sections) {
      if (existingSectionIds.has(section.id)) {
        continue;
      }

      const sectionStatus =
        phaseProgress?.status === "in_progress"
          ? "in_progress"
          : "locked";

      newSectionRecords.push({
        application_id: application.id,
        section_id: section.id,
        status: sectionStatus,
        recruiter_comment: null,
        submitted_at: null,
        approved_at: null,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Persist new phases
  // ---------------------------------------------------------------------------

  if (newPhaseRecords.length > 0) {
    await applicantApplicationRepository.createApplicationPhases(
      newPhaseRecords,
      {
        transaction,
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Persist new sections
  // ---------------------------------------------------------------------------

  if (newSectionRecords.length > 0) {
    await applicantApplicationRepository.createApplicationSections(
      newSectionRecords,
      {
        transaction,
      },
    );
  }

  return application;
};
/**
 * Get the applicant application.
 *
 * If the applicant does not have an application,
 * one is initialized automatically.
 *
 * Existing applications are synchronized with
 * the current application definition.
 */

const getApplicantApplication = async (
  applicantId,
) => {
  return sequelize.transaction(
    async (transaction) => {
      let application =
        await applicantApplicationRepository.findApplicationByApplicantId(
          applicantId,
          {
            transaction,
          },
        );

      // -----------------------------------------------------------------------
      // Initialize application if it doesn't exist.
      // -----------------------------------------------------------------------

      if (!application) {
        application =
          await initializeApplication(
            applicantId,
            transaction,
          );
      }

      // -----------------------------------------------------------------------
      // Synchronize existing application with
      // current application definition.
      // -----------------------------------------------------------------------

      else {
        await synchronizeApplication(
          application,
          transaction,
        );
      }

      // -----------------------------------------------------------------------
      // Get applicant phase progress.
      // -----------------------------------------------------------------------

      const phases =
        await applicantApplicationRepository.findApplicationPhases(
          application.id,
          {
            transaction,
          },
        );

      // -----------------------------------------------------------------------
      // Get applicant section progress.
      // -----------------------------------------------------------------------

      const sections =
        await applicantApplicationRepository.findApplicationSections(
          application.id,
          {
            transaction,
          },
        );

      // -----------------------------------------------------------------------
      // Map database state + application definition
      // into the frontend contract.
      // -----------------------------------------------------------------------

      return mapApplicantApplication({
  application,
  phases,
  sections,
  getSections: (phaseId) =>
    applicationDefinitionService.getSections(
      phaseId,
    ),
});
    },
  );
};

/**
 * Get saved values for an applicant application section.
 */
const getSectionValues = async (
  applicantId,
  sectionId,
) => {
  const application =
    await applicantApplicationRepository.findApplicationByApplicantId(
      applicantId,
    );

  if (!application) {
    throw new Error(
      "Applicant application not found.",
    );
  }

  // ---------------------------------------------------------------------------
  // Get section definition
  // ---------------------------------------------------------------------------

  const section =
    applicationDefinitionService.getSection(
      sectionId,
    );

  if (!section) {
    throw new Error(
      "Application section definition not found.",
    );
  }

  // ---------------------------------------------------------------------------
  // Get applicant section progress
  // ---------------------------------------------------------------------------

  const sectionProgress =
    await applicantApplicationRepository.findApplicationSection(
      application.id,
      sectionId,
    );

  if (!sectionProgress) {
    throw new Error(
      "Application section not found.",
    );
  }

  // ---------------------------------------------------------------------------
  // Get saved values
  // ---------------------------------------------------------------------------

  const sectionValues =
    await applicantApplicationRepository.findSectionValues(
      application.id,
      sectionId,
    );

  // ---------------------------------------------------------------------------
  // No saved values
  // ---------------------------------------------------------------------------

  if (!sectionValues) {
    return {
      sectionId,
      applicantId,
      status: sectionProgress.status,
      values: section.repeatable
        ? []
        : {},
    };
  }

  // ---------------------------------------------------------------------------
  // Parse JSON stored in database
  // ---------------------------------------------------------------------------

  let values;

  try {
    values = JSON.parse(
      sectionValues.values,
    );
  } catch {
    throw new Error(
      "Invalid section values stored in database.",
    );
  }

  return {
    sectionId,
    applicantId,
    status: sectionProgress.status,
    values,
  };
};

const saveSectionDraft = async (
  applicantId,
  sectionId,
  values,
) => {
  return sequelize.transaction(
    async (transaction) => {
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
        throw new Error(
          "Applicant application not found.",
        );
      }

      // -----------------------------------------------------------------------
      // Find section definition
      // -----------------------------------------------------------------------

      const section =
        applicationDefinitionService.getSection(
          sectionId,
        );

      if (!section) {
        throw new Error(
          "Application section definition not found.",
        );
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
        throw new Error(
          "Application section not found.",
        );
      }

        // -----------------------------------------------------------------------
      // Check section status
      // -----------------------------------------------------------------------

      if (sectionProgress.status === "locked") {
        throw new Error(
          "This application section is locked.",
        );
      }
    

      if (
        sectionProgress.status ===
        "submitted"
      ) {
        throw new Error(
          "This application section has already been submitted.",
        );
      }

      if (
        sectionProgress.status ===
        "approved"
      ) {
        throw new Error(
          "This application section has already been approved.",
        );
      }
      // -----------------------------------------------------------------------
      // Validate repeatable section structure.
      // -----------------------------------------------------------------------

      if (
        section.repeatable &&
        !Array.isArray(values)
      ) {
        throw new Error(
          "Repeatable section values must be an array.",
        );
      }

      // -----------------------------------------------------------------------
      // Validate non-repeatable section structure.
      // -----------------------------------------------------------------------

      if (
        !section.repeatable &&
        (
          values === null ||
          Array.isArray(values) ||
          typeof values !== "object"
        )
      ) {
        throw new Error(
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

      const serializedValues =
        JSON.stringify(values);

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
    },
  );
};
const submitSection = async (
  applicantId,
  sectionId,
) => {
  return sequelize.transaction(
    async (transaction) => {
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
        throw new Error(
          "Applicant application not found.",
        );
      }

      // -----------------------------------------------------------------------
      // Find section definition
      // -----------------------------------------------------------------------

      const section =
        applicationDefinitionService.getSection(
          sectionId,
        );

      if (!section) {
        throw new Error(
          "Application section definition not found.",
        );
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
        throw new Error(
          "Application section not found.",
        );
      }

      // -----------------------------------------------------------------------
      // Check section status
      // -----------------------------------------------------------------------

      if (
        sectionProgress.status === "locked"
      ) {
        throw new Error(
          "This application section is locked.",
        );
      }

      if (
        sectionProgress.status === "submitted"
      ) {
        throw new Error(
          "This application section has already been submitted.",
        );
      }

      if (
        sectionProgress.status === "approved"
      ) {
        throw new Error(
          "This application section has already been approved.",
        );
      }

      // -----------------------------------------------------------------------
      // Make sure values exist
      // -----------------------------------------------------------------------

      const sectionValues =
        await applicantApplicationRepository.findSectionValues(
          application.id,
          sectionId,
          {
            transaction,
          },
        );

      if (!sectionValues) {
        throw new Error(
          "Please save the application section before submitting.",
        );
      }

      // -----------------------------------------------------------------------
      // Validate stored JSON
      // -----------------------------------------------------------------------

      let values;

      try {
        values = JSON.parse(
          sectionValues.values,
        );
      } catch {
        throw new Error(
          "Invalid section values stored in database.",
        );
      }

      if (
        values === null ||
        values === undefined
      ) {
        throw new Error(
          "Application section has no values to submit.",
        );
      }

      // -----------------------------------------------------------------------
      // Submit section
      // -----------------------------------------------------------------------

      const submittedAt = new Date();

      await applicantApplicationRepository.updateApplicationSection(
        sectionProgress,
        {
          status: "submitted",
          submitted_at: submittedAt,
        },
        {
          transaction,
        },
      );

      // -----------------------------------------------------------------------
      // Find the applicant phase this section belongs to
      // -----------------------------------------------------------------------

      const phase =
        applicationDefinitionService.getPhase(
          section.phaseId,
        );

      if (!phase) {
        throw new Error(
          "Application phase definition not found.",
        );
      }

      const phaseProgress =
        await applicantApplicationRepository.findApplicationPhase(
          application.id,
          phase.id,
          {
            transaction,
          },
        );

      if (!phaseProgress) {
        throw new Error(
          "Application phase not found.",
        );
      }

      // -----------------------------------------------------------------------
      // Get all sections belonging to this phase
      // -----------------------------------------------------------------------

      const phaseSections =
        applicationDefinitionService.getSections(
          phase.id,
        );

      // -----------------------------------------------------------------------
      // Get applicant progress for all sections
      // -----------------------------------------------------------------------

      const applicantSections =
        await applicantApplicationRepository.findApplicationSections(
          application.id,
          {
            transaction,
          },
        );

      const applicantSectionMap =
        new Map(
          applicantSections.map(
            (item) => [
              item.section_id,
              item,
            ],
          ),
        );

      // -----------------------------------------------------------------------
      // Determine whether every section has been submitted.
      // -----------------------------------------------------------------------

      const phaseCompleted =
        phaseSections.every(
          (definition) => {
            const progress =
              applicantSectionMap.get(
                definition.id,
              );

            return (
              progress?.status ===
                "submitted" ||
              progress?.status ===
                "approved"
            );
          },
        );

      // -----------------------------------------------------------------------
      // If all sections are submitted,
      // mark the phase as submitted.
      // -----------------------------------------------------------------------

      if (
        phaseCompleted &&
        phaseProgress.status !== "submitted" &&
        phaseProgress.status !== "approved"
      ) {
        await applicantApplicationRepository.updateApplicationPhase(
          phaseProgress,
          {
            status: "submitted",
            completed_at: submittedAt,
          },
          {
            transaction,
          },
        );
      }

      return {
        sectionId,
        applicantId,
        status: "submitted",
        values,
        submittedAt,
        phaseId: phase.id,
        phaseStatus: phaseCompleted
          ? "submitted"
          : phaseProgress.status,
      };
    },
  );
};

export {
  getApplicantApplication,
  getSectionValues,
  saveSectionDraft,
  submitSection
};