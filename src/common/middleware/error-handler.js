import { ZodError } from "zod";

import { ApiResponse } from "../responses/api-response.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ZodError) {
    return ApiResponse.error(res, "Validation failed.", err.flatten(), 422);
  }

  if (err.statusCode) {
    return ApiResponse.error(res, err.message, err.errors, err.statusCode);
  }

  return ApiResponse.error(res, "Internal server error.", null, 500);
};

export { errorHandler };
