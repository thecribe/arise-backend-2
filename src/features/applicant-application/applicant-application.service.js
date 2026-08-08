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

export {
  getApplicantApplication,
};