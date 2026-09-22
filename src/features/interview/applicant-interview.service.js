import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";

import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";

import { sequelize } from "../../config/database.js";
import { recordAuditAction } from "../audit/record-audit-action.js";

import { recruitmentRepository } from "../recruitment/recruitment.repository.js";
import { interviewRepository } from "./applicant-interview.repository.js";

const MAX_RAW_SCORE = 60;
const MAX_NORMALIZED_SCORE = 50;

const SCORE_KEYS = [
  "understandingPersonalCare",
  "handlingMobilityIssues",
  "healthSafetyAwareness",
  "knowledgeOfSafeguarding",
  "nutritionMealPreparation",
  "spokenEnglishCompetency",
  "listeningSkills",
  "abilityToExplainInstructions",
  "empathyProfessionalLanguage",
  "timeManagementAwareness",
  "attitudeWillingnessToLearn",
  "adaptability",
];

const calculateScores = (scores = {}) => {
  const normalizedScores = {};

  for (const key of SCORE_KEYS) {
    const value = Number(scores[key]);

    if (!Number.isInteger(value) || value < 0 || value > 5) {
      throw new BadRequestError(
        `Invalid score for ${key}. Score must be between 0 and 5.`,
      );
    }

    normalizedScores[key] = value;
  }

  const rawScore = SCORE_KEYS.reduce(
    (total, key) => total + normalizedScores[key],
    0,
  );

  const normalizedScore = Number(
    ((rawScore / MAX_RAW_SCORE) * MAX_NORMALIZED_SCORE).toFixed(2),
  );

  return {
    scores: normalizedScores,
    rawScore,
    normalizedScore,
  };
};

const validateInterviewerName = (interviewerName) => {
  if (
    typeof interviewerName !== "string" ||
    interviewerName.trim().length < 2
  ) {
    throw new BadRequestError("A valid interviewer name is required.");
  }

  return interviewerName.trim();
};

const validateInterviewDate = (interviewDate) => {
  if (typeof interviewDate !== "string" || !interviewDate.trim()) {
    throw new BadRequestError("Interview date is required.");
  }

  return interviewDate;
};

const createInterview = async (
  applicationId,
  interviewerId,
  data,
  auditContext = {},
) => {
  const transaction = await sequelize.transaction();

  try {
    const application =
      await recruitmentRepository.findApplicantApplicationByApplicationId(
        applicationId,
        { transaction },
      );

    if (!application) {
      throw new NotFoundError("Application not found.");
    }

    const existingInterview =
      await interviewRepository.findInterviewModelByApplicationId(
        applicationId,
        { transaction },
      );

    if (existingInterview) {
      throw new BadRequestError(
        "An interview already exists for this application.",
      );
    }

    const interviewerName = validateInterviewerName(data.interviewerName);

    const interviewDate = validateInterviewDate(data.interviewDate);

    const calculatedScores = calculateScores(data.scores);

    const interview = await interviewRepository.createInterview(
      {
        applicationId,
        interviewerId,
        interviewerName,
        interviewDate,
        interviewerSignature: data.interviewerSignature
          ? JSON.stringify(data.interviewerSignature)
          : "",
        ...calculatedScores,
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
        rawScore: calculatedScores.rawScore,
        normalizedScore: calculatedScores.normalizedScore,
      },
      transaction,
    });

    await transaction.commit();

    return interview;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getInterviewByApplicationId = async (applicationId) => {
  const interview =
    await interviewRepository.findInterviewByApplicationId(applicationId);

  return {
    ...interview,
    interviewer_signature: interview.interviewer_signature
      ? JSON.parse(interview.interviewer_signature)
      : null,
  };
};

const updateInterview = async (
  applicationId,
  interviewerId,
  data,
  auditContext = {},
) => {
  const transaction = await sequelize.transaction();

  try {
    const interview =
      await interviewRepository.findInterviewModelByApplicationId(
        applicationId,
        { transaction },
      );

    if (!interview) {
      throw new NotFoundError("Interview not found.");
    }

    const currentScores =
      typeof interview.scores === "string"
        ? JSON.parse(interview.scores)
        : interview.scores;

    const mergedScores = {
      ...currentScores,
      ...(data.scores ?? {}),
    };

    const calculatedScores = calculateScores(mergedScores);

    const updateData = {
      ...data,
      ...calculatedScores,
    };

    if (data.interviewerName !== undefined) {
      updateData.interviewerName = validateInterviewerName(
        data.interviewerName,
      );
    }

    if (data.interviewDate !== undefined) {
      updateData.interviewDate = validateInterviewDate(data.interviewDate);
    }
    if (data.interviewerSignature !== undefined) {
      updateData.interviewerSignature = JSON.stringify(
        data.interviewerSignature,
      );
    }

    const updatedInterview = await interviewRepository.updateInterview(
      interview,
      updateData,
      { transaction },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW,
      entityId: interview.id,
      metadata: {
        applicationId,
        updatedBy: interviewerId,
        rawScore: calculatedScores.rawScore,
        normalizedScore: calculatedScores.normalizedScore,
      },
      transaction,
    });

    await transaction.commit();

    return updatedInterview;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  createInterview,
  getInterviewByApplicationId,
  updateInterview,
};
