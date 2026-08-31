import { env } from "../../config/env.js";

import { AppError } from "../errors/index.js";

import { logError } from "../logger/log-error.js";

import { ApiResponse } from "../responses/api-response.js";

/**
 * --------------------------------------------------------------------------
 * Global Error Handler
 *
 * Handles all errors that reach the Express error pipeline.
 *
 * Responsibilities:
 *
 * - Log errors centrally.
 * - Handle expected application errors.
 * - Handle unexpected system errors.
 * - Prevent sensitive internal details from reaching the client in production.
 * --------------------------------------------------------------------------
 */

export const errorHandler = (err, req, res, next) => {
  /**
   * Prevent attempting to send another response if headers have already
   * been sent.
   */
  if (res.headersSent) {
    return next(err);
  }

  /**
   * Log every error centrally.
   *
   * Services and controllers should not need to manually log errors before
   * throwing them.
   */
  logError(err, req);

  /**
   * Operational / application errors.
   */
  if (err instanceof AppError && err.isOperational) {
    return ApiResponse.error(res, err.statusCode, err.message, {
      code: err.code,
      ...(err.errors ?? {}),
    });
  }

  /**
   * Unexpected / system errors.
   *
   * Do not expose internal implementation details in production.
   */
  const message =
    env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  return ApiResponse.error(res, 500, message, {
    code: "INTERNAL_SERVER_ERROR",
  });
};
