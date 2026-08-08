import { sequelize } from "../../config/database.js";
import { jobTypeRepository } from "./job-type.repository.js";

const getAll = async () => {
  return jobTypeRepository.findAll();
};

const create = async (payload) => {
  const existingJobType = await jobTypeRepository.findByName(payload.name);

  if (existingJobType) {
    throw new ConflictError("Job type already exists.");
  }

  const transaction = await sequelize.transaction();

  try {
    const jobType = await jobTypeRepository.create(payload, transaction);

    await transaction.commit();

    return jobType;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const update = async (id, payload) => {
  const jobType = await jobTypeRepository.findById(id);

  if (!jobType) {
    throw new NotFoundError("Job type not found.");
  }

  const existingJobType = await jobTypeRepository.findByName(payload.name);

  if (existingJobType && existingJobType.id !== jobType.id) {
    throw new ConflictError("Job type already exists.");
  }

  const transaction = await sequelize.transaction();

  try {
    await jobTypeRepository.update(jobType, payload, transaction);

    await transaction.commit();

    return jobType;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const setDefault = async (id) => {
  const jobType = await jobTypeRepository.findById(id);

  if (!jobType) {
    throw new NotFoundError("Job type not found.");
  }

  if (jobType.is_default) {
    return jobType;
  }
  const transaction = await sequelize.transaction();

  try {
    await jobTypeRepository.clearDefault(transaction);

    await jobTypeRepository.update(
      jobType,
      {
        is_default: true,
      },
      transaction,
    );

    await transaction.commit();

    return jobType;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const remove = async (id) => {
  const jobType = await jobTypeRepository.findById(id);

  if (!jobType) {
    throw new NotFoundError("Job type not found.");
  }

  /**
   * Never allow deleting the default job type.
   */
  if (jobType.is_default) {
    throw new BadRequestError("The default job type cannot be deleted.");
  }

  const defaultJobType = await jobTypeRepository.findDefault();

  const transaction = await sequelize.transaction();

  try {
    /**
     * Move every user to the default job type.
     */
    await jobTypeRepository.reassignUsers(
      jobType.id,
      defaultJobType.id,
      transaction,
    );

    /**
     * Soft delete the job type.
     */
    await jobTypeRepository.remove(jobType, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

export const jobTypeService = {
  getAll,
  create,
  update,
  setDefault,
  remove,
};
