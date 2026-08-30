/**
 * --------------------------------------------------------------------------
 * AppError
 *
 * Base class for all expected application errors.
 *
 * Expected errors should extend this class so the centralized error middleware
 * can distinguish operational/application errors from unexpected system errors.
 * --------------------------------------------------------------------------
 */

export class AppError extends Error {
  constructor(
    message,
    {
      statusCode = 500,
      code = "INTERNAL_SERVER_ERROR",
      errors = null,
      isOperational = true,
    } = {},
  ) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;

    this.code = code;

    this.errors = errors;

    this.isOperational = isOperational;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
