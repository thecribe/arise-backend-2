import { ApiResponse } from "../../common/responses/api-response.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { jobTypeService } from "./job-type.service.js";

/**
 * -----------------------------------------------------------------------------
 * Retrieves all job types.
 * -----------------------------------------------------------------------------
 */
const getAll = asyncHandler(async (req, res) => {
  const jobTypes = await jobTypeService.getAll();

  return ApiResponse.success(
    res,
    {
      jobTypes,
    },
    "Job types retrieved successfully.",
  );
});

/**
 * -----------------------------------------------------------------------------
 * Creates a new job type.
 * -----------------------------------------------------------------------------
 */
const create = asyncHandler(async (req, res) => {
  const jobType = await jobTypeService.create(req.body);

  return ApiResponse.created(
    res,
    {
      jobType,
    },
    "Job type created successfully.",
  );
});

/**
 * -----------------------------------------------------------------------------
 * Updates a job type.
 * -----------------------------------------------------------------------------
 */
const update = asyncHandler(async (req, res) => {
  const jobType = await jobTypeService.update(req.params.id, req.body);

  return ApiResponse.success(
    res,
    {
      jobType,
    },
    "Job type updated successfully.",
  );
});

/**
 * -----------------------------------------------------------------------------
 * Sets the default job type.
 * -----------------------------------------------------------------------------
 */
const setDefault = asyncHandler(async (req, res) => {
  const jobType = await jobTypeService.setDefault(req.params.id);

  return ApiResponse.success(
    res,
    {
      jobType,
    },
    "Default job type updated successfully.",
  );
});

/**
 * -----------------------------------------------------------------------------
 * Deletes a job type.
 * -----------------------------------------------------------------------------
 */
const remove = asyncHandler(async (req, res) => {
  await jobTypeService.remove(req.params.id);

  return ApiResponse.success(res, null, "Job type deleted successfully.");
});

export const jobTypeController = {
  getAll,
  create,
  update,
  setDefault,
  remove,
};
