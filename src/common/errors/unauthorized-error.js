import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * UnauthorizedError
 *
 * Used when authentication is required but the request is not authenticated
 * or the authentication credentials are invalid.
 * --------------------------------------------------------------------------
 */

export class UnauthorizedError extends AppError {
  constructor(
    message = "Authentication is required.",
    { code = "UNAUTHORIZED", errors = null } = {},
  ) {
    super(message, {
      statusCode: 401,
      code,
      errors,
    });
  }
}
