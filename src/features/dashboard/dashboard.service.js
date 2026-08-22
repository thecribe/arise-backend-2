import { dashboardRepository } from "./dashboard.repository.js";
import applicationDefinitionService from "../../application-definition/service.js";

const getApplicantDashboard = async (applicantId) => {
  const application =
    await dashboardRepository.findApplicationByApplicantId(
      applicantId,
    );

  if (!application) {
    throw new Error(
      "Applicant application not found.",
    );
  }

  const [applicantPhases, applicantSections] =
    await Promise.all([
      dashboardRepository.findApplicationPhases(
        application.id,
      ),

      dashboardRepository.findApplicationSections(
        application.id,
        {
          order: [["updated_at", "DESC"]],
        },
      ),
    ]);

  const phaseDefinitions =
    applicationDefinitionService.getPhases();

  const phases = phaseDefinitions.map((phase) => {
    const applicantPhase = applicantPhases.find(
      (item) => item.phase_id === phase.id,
    );

    return {
      id: phase.id,
      title: phase.title,
      description: phase.description,
      status: applicantPhase?.status ?? "locked",
      ...(applicantPhase?.completed_at && {
        completedAt: applicantPhase.completed_at,
      }),
    };
  });

  const currentPhase =
    phases.find(
      (phase) =>
        phase.id === application.current_phase_id,
    ) ?? null;

  const latestFeedback =
    applicantSections.find(
      (section) =>
        section.recruiter_comment?.trim(),
    );

  return {
    overallProgress: application.progress,
    currentPhase,
    latestFeedback: latestFeedback
      ? {
          author: "Recruitment Manager",
          message: latestFeedback.recruiter_comment,
          createdAt: latestFeedback.updated_at,
        }
      : undefined,
    phases,
  };
};

export {
  getApplicantDashboard,
};