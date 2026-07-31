import { Op } from "sequelize";

import { Job } from "../../database/models/Job.js";
import { sequelize } from "../../config/database.js";
import { JOB_STATUS } from "../../common/constants/job-status.js";

const create = async (payload, transaction) => {
  return Job.create(payload, {
    transaction,
  });
};

const findNext = async () => {
  return Job.findOne({
    where: {
      status: "PENDING",
      scheduled_at: {
        [Op.lte]: new Date(),
      },
    },

    order: [
      ["priority", "DESC"],
      ["created_at", "ASC"],
    ],
  });
};

const update = async (job, payload) => {
  return job.update(payload);
};

const claimNext = async () => {
  const transaction = await sequelize.transaction();

  try {
    const job = await Job.findOne({
      where: {
        status: JOB_STATUS.PENDING,
        scheduled_at: {
          [Op.lte]: new Date(),
        },
      },

      order: [
        ["priority", "DESC"],
        ["created_at", "ASC"],
      ],

      transaction,

      lock: true,
    });

    if (!job) {
      await transaction.commit();
      return null;
    }

    await job.update(
      {
        status: JOB_STATUS.PROCESSING,
        started_at: new Date(),
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    return job;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const jobRepository = {
  create,
  findNext,
  update,
  claimNext,
};
