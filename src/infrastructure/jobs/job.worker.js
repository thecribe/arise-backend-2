import { JOB_STATUS } from "../../common/constants/job-status.js";

import { jobRepository } from "./job.repository.js";
import { getHandler } from "./job.handlers.js";

const processJob = async () => {
  const job = await jobRepository.claimNext();

  if (!job) {
    return;
  }

  try {
    const handler = getHandler(job.type);

    if (!handler) {
      throw new Error(`No handler registered for ${job.type}`);
    }

    await handler(job.payload);

    await jobRepository.update(job, {
      status: JOB_STATUS.COMPLETED,
      completed_at: new Date(),
    });
  } catch (error) {
    await jobRepository.update(job, {
      status: JOB_STATUS.FAILED,
      attempts: job.attempts + 1,
      last_error: error.message,
    });
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const startWorker = async () => {
  while (true) {
    try {
      const processed = await processJob();

      // If we found a job, check again immediately.
      if (processed) {
        continue;
      }
    } catch (error) {
      console.error(error);
    }

    // No work found, wait before polling again.
    await sleep(5000);
  }
};

export { startWorker };
