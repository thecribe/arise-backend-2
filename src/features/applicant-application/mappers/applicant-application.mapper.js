const mapApplicantApplication = ({
  application,
  phases,
  sections,
  getSections,
}) => {
  const sectionsById = new Map(
    sections.map((section) => [
      section.section_id,
      section,
    ]),
  );

  const mappedPhases = phases.map((phase) => {
    const phaseSections = getSections(
      phase.phase_id,
    )
      .map((sectionDefinition) => {
        const sectionProgress =
          sectionsById.get(
            sectionDefinition.id,
          );

        if (!sectionProgress) {
          return null;
        }

        return {
          sectionId:
            sectionProgress.section_id,

          status:
            sectionProgress.status,

          recruiterComment:
            sectionProgress.recruiter_comment,

          submittedAt:
            sectionProgress.submitted_at,

          approvedAt:
            sectionProgress.approved_at,
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
    applicantId:
      application.applicant_id,

    progress:
      application.progress,

    currentPhaseId:
      application.current_phase_id,

    currentSectionId:
      application.current_section_id,

    phases: mappedPhases,

    submittedAt:
      application.submitted_at,

    updatedAt:
      application.updated_at,
  };
};

export {
  mapApplicantApplication,
};