import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { recruitmentRepository } from "../recruitment/recruitment.repository.js";
import { interviewRepository } from "./applicant-interview.repository.js";

const MAX_SCORE_PER_CRITERION = 5;
const TOTAL_CRITERIA = 12;
const MAX_RAW_SCORE = TOTAL_CRITERIA * MAX_SCORE_PER_CRITERION;
const MAX_NORMALIZED_SCORE = 50;

const calculateScores = (scores) => {
  if (!scores || typeof scores !== "object") {
    throw new BadRequestError("Interview scores are required.");
  }

  const scoreValues = Object.values(scores);

  if (scoreValues.length !== TOTAL_CRITERIA) {
    throw new BadRequestError(
      `Exactly ${TOTAL_CRITERIA} interview scores are required.`,
    );
  }

  const hasInvalidScore = scoreValues.some(
    (score) =>
      !Number.isInteger(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > MAX_SCORE_PER_CRITERION,
  );

  if (hasInvalidScore) {
    throw new BadRequestError(
      "Each interview score must be a whole number between 0 and 5.",
    );
  }

  const rawScore = scoreValues.reduce(
    (total, score) => total + Number(score),
    0,
  );

  const normalizedScore = Number(
    ((rawScore / MAX_RAW_SCORE) * MAX_NORMALIZED_SCORE).toFixed(2),
  );

  return {
    rawScore,
    normalizedScore,
  };
};

/**
 * Create interview
 */
const createInterview = async (
  applicationId,
  interviewerId,
  data,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
        { transaction },
      );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    const existingInterview =
      await interviewRepository.findInterviewByApplicationId(applicationId, {
        transaction,
      });

    if (existingInterview) {
      throw new BadRequestError(
        "An interview already exists for this application.",
      );
    }

    const { rawScore, normalizedScore } = calculateScores(data.scores);

    const interview = await interviewRepository.createInterview(
      {
        application_id: applicationId,
        interviewer_id: interviewerId,
        interview_date: data.interviewDate,
        scores: data.scores,
        raw_score: rawScore,
        normalized_score: normalizedScore,
        notes: data.notes ?? [],
        interviewer_signature: data.interviewerSignature ?? null,
      },
      { transaction },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_CREATED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW,
      entityId: interview.id,
      metadata: {
        applicationId,
        interviewerId,
        rawScore,
        normalizedScore,
      },
      transaction,
    });

    return interview;
  });
};

/**
 * Get interview by application ID
 */
const getInterviewByApplicationId = async (applicationId) => {
  const interview =
    await interviewRepository.findInterviewByApplicationId(applicationId);

  if (!interview) {
    throw new NotFoundError("Interview not found.");
  }

  return interview;
};

/**
 * Update interview
 */
const updateInterview = async (
  applicationId,
  interviewerId,
  data,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const interview =
      await interviewRepository.findInterviewModelByApplicationId(
        applicationId,
        { transaction },
      );

    if (!interview) {
      throw new NotFoundError("Interview not found.");
    }

    const previousScores =
      typeof interview.scores === "string"
        ? JSON.parse(interview.scores)
        : interview.scores;

    const updatedScores = {
      ...previousScores,
      ...(data.scores ?? {}),
    };

    const { rawScore, normalizedScore } = calculateScores(updatedScores);

    const previousData = interview.toJSON();

    const updatedInterview = await interviewRepository.updateInterview(
      interview,
      {
        ...(data.interviewDate !== undefined && {
          interview_date: data.interviewDate,
        }),

        scores: updatedScores,
        raw_score: rawScore,
        normalized_score: normalizedScore,

        ...(data.notes !== undefined && {
          notes: data.notes,
        }),

        ...(data.interviewerSignature !== undefined && {
          interviewer_signature: data.interviewerSignature,
        }),

        interviewer_id: interviewerId,
      },
      { transaction },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW,
      entityId: interview.id,
      metadata: {
        applicationId,
        interviewerId,
        previousData,
        updatedData: updatedInterview,
      },
      transaction,
    });

    return updatedInterview;
  });
};

const interviewService = {
  createInterview,
  getInterviewByApplicationId,
  updateInterview,
};

export default interviewService;
