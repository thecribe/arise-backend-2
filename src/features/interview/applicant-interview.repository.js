import { ApplicantInterview } from "../../database/models/ApplicantInterview.js";

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const formatInterview = (interview) => {
  if (!interview) return null;

  const data = interview.toJSON();

  return {
    ...data,
    scores: parseJson(data.scores, {}),
    notes: parseJson(data.notes, []),
  };
};

/**
 * Find an interview by its ID.
 */
const findInterviewById = async (interviewId, options = {}) => {
  const interview = await ApplicantInterview.findByPk(interviewId, options);

  return formatInterview(interview);
};

/**
 * Find an interview by application ID.
 */
const findInterviewByApplicationId = async (applicationId, options = {}) => {
  const interview = await ApplicantInterview.findOne({
    where: {
      application_id: applicationId,
    },
    ...options,
  });

  return formatInterview(interview);
};

/**
 * Create a new interview.
 */
const createInterview = async (data, options = {}) => {
  const interview = await ApplicantInterview.create(
    {
      ...data,
      scores:
        typeof data.scores === "string"
          ? data.scores
          : JSON.stringify(data.scores ?? {}),

      notes:
        typeof data.notes === "string"
          ? data.notes
          : JSON.stringify(data.notes ?? []),
    },
    options,
  );

  return formatInterview(interview);
};

/**
 * Update an existing interview.
 */
const updateInterview = async (interview, data, options = {}) => {
  const updateData = {
    ...data,
  };

  if (updateData.scores !== undefined) {
    updateData.scores =
      typeof updateData.scores === "string"
        ? updateData.scores
        : JSON.stringify(updateData.scores);
  }

  if (updateData.notes !== undefined) {
    updateData.notes =
      typeof updateData.notes === "string"
        ? updateData.notes
        : JSON.stringify(updateData.notes);
  }

  await interview.update(updateData, options);

  return formatInterview(interview);
};

const findInterviewModelByApplicationId = async (
  applicationId,
  options = {},
) => {
  return ApplicantInterview.findOne({
    where: {
      application_id: applicationId,
    },
    ...options,
  });
};

export const interviewRepository = {
  findInterviewById,
  findInterviewByApplicationId,
  createInterview,
  updateInterview,
  findInterviewModelByApplicationId,
};
