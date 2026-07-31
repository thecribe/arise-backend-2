import { jobRepository } from "./job.repository.js";

import { JOB_STATUS } from "../../common/constants/job-status.js";

const dispatch = async (
  { type, payload, priority = 0, scheduledAt = new Date(), maxAttempts = 5 },
  transaction,
) => {
  return jobRepository.create(
    {
      type,
      payload,
      status: JOB_STATUS.PENDING,
      attempts: 0,
      max_attempts: maxAttempts,
      priority,
      scheduled_at: scheduledAt,
    },
    transaction,
  );
};

export const jobService = {
  dispatch,
};
