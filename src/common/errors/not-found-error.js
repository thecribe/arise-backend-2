import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * NotFoundError
 *
 * Used when a requested resource does not exist.
 * --------------------------------------------------------------------------
 */

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found.",
    { code = "NOT_FOUND", errors = null } = {},
  ) {
    super(message, {
      statusCode: 404,
      code,
      errors,
    });
  }
}
