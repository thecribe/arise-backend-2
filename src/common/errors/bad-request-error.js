import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * BadRequestError
 *
 * Used when the client sends a request that cannot be processed because
 * the request itself is invalid.
 * --------------------------------------------------------------------------
 */

export class BadRequestError extends AppError {
  constructor(
    message = "Bad request.",
    { code = "BAD_REQUEST", errors = null } = {},
  ) {
    super(message, {
      statusCode: 400,
      code,
      errors,
    });
  }
}
