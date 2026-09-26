import { logger } from "../../../common/logger/logger.js";

const mapApplicantApplication = ({
  application,
  phases,
  sections,
  getSections,
}) => {
  const sectionsById = new Map(
    sections.map((section) => [section.section_id, section]),
  );

  // logger.info("User section", { sections });

  /**
   * Get all section definitions across all phases.
   *
   * This is the source of truth for the total number of sections
   * that make up the application.
   */
  const allSectionDefinitions = phases.flatMap((phase) =>
    getSections(phase.phase_id),
  );

  const totalSections = allSectionDefinitions.length;

  /**
   * A section contributes to application progress when it has
   * been submitted or approved.
   */
  const completedSections = allSectionDefinitions.reduce(
    (count, sectionDefinition) => {
      const sectionProgress = sectionsById.get(sectionDefinition.id);

      if (
        sectionProgress?.status === "submitted" ||
        sectionProgress?.status === "approved"
      ) {
        return count + 1;
      }

      return count;
    },
    0,
  );

  /**
   * Calculate percentage.
   *
   * If there are no sections, progress is 0 rather than NaN.
   */
  const progress =
    totalSections > 0
      ? Math.round((completedSections / totalSections) * 100)
      : 0;

  const mappedPhases = phases.map((phase) => {
    const phaseSections = getSections(phase.phase_id)
      .map((sectionDefinition) => {
        const sectionProgress = sectionsById.get(sectionDefinition.id);

        if (!sectionProgress) {
          return null;
        }

        return {
          sectionId: sectionProgress.section_id,
          status: sectionProgress.status,
          recruiterComment: sectionProgress.recruiter_comment,
          submittedAt: sectionProgress.submitted_at,
          approvedAt: sectionProgress.approved_at,
        };
      })
      .filter(Boolean);

    return {
      phaseId: phase.phase_id,
      status: phase.status,
      startedAt: phase.started_at,
      completedAt: phase.completed_at,
      sections: phaseSections,
    };
  });

  return {
    applicantId: application.applicant_id,
    progress,
    currentPhaseId: application.current_phase_id,
    currentSectionId: application.current_section_id,
    phases: mappedPhases,
    submittedAt: application.submitted_at,
    updatedAt: application.updated_at,
  };
};

export { mapApplicantApplication };
