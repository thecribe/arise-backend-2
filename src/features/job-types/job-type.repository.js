import { Op } from "sequelize";

import { JobType, User } from "../../database/models/index.js";

/**
 * -----------------------------------------------------------------------------
 * Retrieves all active job types.
 * -----------------------------------------------------------------------------
 */
const findAll = async () => {
  return JobType.findAll({
    order: [
      ["is_default", "DESC"],
      ["name", "ASC"],
    ],
  });
};

/**
 * -----------------------------------------------------------------------------
 * Retrieves a job type by its identifier.
 * -----------------------------------------------------------------------------
 */
const findById = async (id) => {
  return JobType.findByPk(id);
};

/**
 * -----------------------------------------------------------------------------
 * Retrieves the default job type.
 * -----------------------------------------------------------------------------
 */
const findDefault = async () => {
  return JobType.findOne({
    where: {
      is_default: true,
    },
  });
};

/**
 * -----------------------------------------------------------------------------
 * Retrieves a job type by name.
 * -----------------------------------------------------------------------------
 */
const findByName = async (name) => {
  return JobType.findOne({
    where: {
      name,
    },
  });
};

/**
 * -----------------------------------------------------------------------------
 * Creates a new job type.
 * -----------------------------------------------------------------------------
 */
const create = async (payload, transaction) => {
  return JobType.create(payload, {
    transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Updates a job type.
 * -----------------------------------------------------------------------------
 */
const update = async (jobType, payload, transaction) => {
  return jobType.update(payload, {
    transaction,
  });
};

/**
 * -----------------------------------------------------------------------------
 * Clears the default flag from every job type.
 * -----------------------------------------------------------------------------
 */
const clearDefault = async (transaction) => {
  return JobType.update(
    {
      is_default: false,
    },
    {
      where: {},

      transaction,
    },
  );
};

/**
 * -----------------------------------------------------------------------------
 * Reassigns every user belonging to a job type.
 * -----------------------------------------------------------------------------
 */
const reassignUsers = async (fromJobTypeId, toJobTypeId, transaction) => {
  return User.update(
    {
      job_type_id: toJobTypeId,
    },
    {
      where: {
        job_type_id: fromJobTypeId,
      },

      transaction,
    },
  );
};

/**
 * -----------------------------------------------------------------------------
 * Soft deletes a job type.
 * -----------------------------------------------------------------------------
 */
const remove = async (jobType, transaction) => {
  return jobType.destroy({
    transaction,
  });
};

export const jobTypeRepository = {
  findAll,

  findById,

  findByName,

  findDefault,

  create,

  update,

  clearDefault,

  reassignUsers,

  remove,
};
