import { ApplicantInterview } from "../../database/models/ApplicantInterview.js";

const parseScores = (scores) => {
  if (!scores) {
    return {};
  }

  if (typeof scores === "object") {
    return scores;
  }

  try {
    return JSON.parse(scores);
  } catch {
    return {};
  }
};

const formatInterview = (interview) => {
  if (!interview) {
    return null;
  }

  const data = interview.toJSON();

  return {
    ...data,
    scores: parseScores(data.scores),
  };
};

const findInterviewById = async (interviewId, options = {}) => {
  const interview = await ApplicantInterview.findOne({
    ...options,
    where: {
      id: interviewId,
    },
  });

  return formatInterview(interview);
};
const findInterviewByApplicationId = async (applicationId, options = {}) => {
  const interview = await ApplicantInterview.findOne({
    ...options,
    where: {
      application_id: applicationId,
    },
  });

  return formatInterview(interview);
};

const findInterviewModelByApplicationId = async (
  applicationId,
  options = {},
) => {
  return ApplicantInterview.findOne({
    ...options,
    where: {
      application_id: applicationId,
    },
  });
};

const createInterview = async (data, options = {}) => {
  const interview = await ApplicantInterview.create(
    {
      application_id: data.applicationId,
      interviewer_id: data.interviewerId,
      interviewer_name: data.interviewerName,
      interview_date: data.interviewDate,
      scores: JSON.stringify(data.scores),
      raw_score: data.rawScore,
      normalized_score: data.normalizedScore,
      interviewer_signature: data.interviewerSignature ?? null,
    },
    options,
  );

  return formatInterview(interview);
};

const updateInterview = async (interview, data, options = {}) => {
  const updateData = {};

  if (data.interviewerName !== undefined) {
    updateData.interviewer_name = data.interviewerName;
  }

  if (data.interviewDate !== undefined) {
    updateData.interview_date = data.interviewDate;
  }

  if (data.scores !== undefined) {
    updateData.scores = JSON.stringify(data.scores);
  }

  if (data.rawScore !== undefined) {
    updateData.raw_score = data.rawScore;
  }

  if (data.normalizedScore !== undefined) {
    updateData.normalized_score = data.normalizedScore;
  }

  if (data.interviewerSignature !== undefined) {
    updateData.interviewer_signature = data.interviewerSignature;
  }

  await interview.update(updateData, options);

  return formatInterview(interview);
};

export const interviewRepository = {
  findInterviewByApplicationId,
  findInterviewModelByApplicationId,
  createInterview,
  updateInterview,
  findInterviewById,
};
