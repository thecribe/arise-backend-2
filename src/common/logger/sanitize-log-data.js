/**
 * --------------------------------------------------------------------------
 * Determines whether a field should be redacted.
 * --------------------------------------------------------------------------
 */

import { SENSITIVE_FIELDS } from "../constants/senstive-fields.js";

const isSensitiveField = (key) => {
  const normalizedKey = key.toLowerCase();

  return SENSITIVE_FIELDS.some(
    (field) => field.toLowerCase() === normalizedKey,
  );
};

/**
 * --------------------------------------------------------------------------
 * Recursively sanitizes objects and arrays before they are written to logs.
 *
 * Sensitive values are replaced with [REDACTED].
 * --------------------------------------------------------------------------
 */

export const sanitizeLogData = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }

  if (typeof data !== "object") {
    return data;
  }

  return Object.entries(data).reduce((sanitized, [key, value]) => {
    if (isSensitiveField(key)) {
      sanitized[key] = "[REDACTED]";
      return sanitized;
    }

    sanitized[key] = sanitizeLogData(value);

    return sanitized;
  }, {});
};
