import { AppError } from "../errors/index.js";
import { ApiResponse } from "../responses/api-response.js";

/**
 * --------------------------------------------------------------------------
 * Global Error Handler
 *
 * Handles all errors that reach the Express error pipeline.
 *
 * Expected application errors should extend AppError.
 *
 * Unexpected errors are treated as internal server errors and should not
 * expose implementation details in production.
 * --------------------------------------------------------------------------
 */

export const errorHandler = (err, req, res, next) => {
  /**
   * ------------------------------------------------------------------------
   * Prevent attempting to send another response if Express has already sent
   * response headers.
   * ------------------------------------------------------------------------
   */

  if (res.headersSent) {
    return next(err);
  }

  /**
   * ------------------------------------------------------------------------
   * Operational / application errors
   *
   * These are intentional errors thrown by the application, such as:
   *
   * - NotFoundError
   * - ValidationError
   * - UnauthorizedError
   * - ForbiddenError
   * - ConflictError
   * - BadRequestError
   * ------------------------------------------------------------------------
   */

  if (err instanceof AppError && err.isOperational) {
    return ApiResponse.error(res, err.statusCode, err.message, {
      code: err.code,
      ...(err.errors ?? {}),
    });
  }

  /**
   * ------------------------------------------------------------------------
   * Unexpected / system errors
   *
   * These should not expose implementation details in production.
   *
   * We will add centralized file logging in STEP 4.
   * ------------------------------------------------------------------------
   */

  const isProduction = process.env.NODE_ENV === "production";

  const message = isProduction
    ? "Internal Server Error"
    : err.message || "Internal Server Error";

  return ApiResponse.error(res, 500, message, {
    code: "INTERNAL_SERVER_ERROR",
  });
};
