import { logger } from "./logger.js";
import { sanitizeLogData } from "./sanitize-log-data.js";

/**
 * --------------------------------------------------------------------------
 * logError
 *
 * Centralized error logging helper.
 *
 * Converts an Express error and request into safe structured log metadata.
 * This allows the error middleware to log errors without knowing how logging
 * is implemented.
 * --------------------------------------------------------------------------
 */

export const logError = (err, req) => {
  const statusCode = err.statusCode || 500;

  const code = err.code || "INTERNAL_SERVER_ERROR";

  const userId = req.user?.id || null;

  const requestBody = req.body
    ? sanitizeLogData(req.body)
    : null;

  logger.error(err.message || "Internal Server Error", {
    timestamp: new Date().toISOString(),

    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode,
      code,
      isOperational: err.isOperational ?? false,
    },

    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      userId,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      body: requestBody,
    },
  });
};