import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * ForbiddenError
 *
 * Used when the authenticated user does not have permission to perform
 * the requested action.
 * --------------------------------------------------------------------------
 */

export class ForbiddenError extends AppError {
  constructor(
    message = "You do not have permission to perform this action.",
    { code = "FORBIDDEN", errors = null } = {},
  ) {
    super(message, {
      statusCode: 403,
      code,
      errors,
    });
  }
}
