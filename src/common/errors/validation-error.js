import { AppError } from "./app-error.js";

/**
 * --------------------------------------------------------------------------
 * ValidationError
 *
 * Used when request or application data fails validation.
 * --------------------------------------------------------------------------
 */

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed.",
    { code = "VALIDATION_ERROR", errors = null } = {},
  ) {
    super(message, {
      statusCode: 422,
      code,
      errors,
    });
  }
}
