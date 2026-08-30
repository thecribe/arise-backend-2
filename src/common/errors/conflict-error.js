import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * ConflictError
 *
 * Used when the requested operation conflicts with the current state of
 * a resource.
 * --------------------------------------------------------------------------
 */

export class ConflictError extends AppError {
  constructor(
    message = "The requested operation conflicts with the current resource state.",
    { code = "CONFLICT", errors = null } = {},
  ) {
    super(message, {
      statusCode: 409,
      code,
      errors,
    });
  }
}
