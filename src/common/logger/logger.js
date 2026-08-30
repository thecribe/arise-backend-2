import winston from "winston";
import path from "path";

import { env } from "../../config/env.js";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

/**
 * --------------------------------------------------------------------------
 * Log directory
 *
 * Logs are stored at the project root:
 *
 * logs/
 *   error.log
 *   combined.log
 * --------------------------------------------------------------------------
 */

const logsDirectory = path.join(process.cwd(), "logs");

/**
 * --------------------------------------------------------------------------
 * Development console format
 * --------------------------------------------------------------------------
 */

const developmentFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...metadata }) => {
    const metadataString =
      Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";

    return [`${timestamp} ${level}: ${message}`, stack, metadataString]
      .filter(Boolean)
      .join("\n");
  }),
);

/**
 * --------------------------------------------------------------------------
 * Production / file format
 *
 * JSON is preferred for files because it is easier to search and process.
 * --------------------------------------------------------------------------
 */

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * --------------------------------------------------------------------------
 * Logger transports
 * --------------------------------------------------------------------------
 */

const transports = [
  /**
   * Errors only.
   */
  new winston.transports.File({
    filename: path.join(logsDirectory, "error.log"),
    level: "error",
  }),

  /**
   * All configured application logs.
   */
  new winston.transports.File({
    filename: path.join(logsDirectory, "combined.log"),
  }),
];

/**
 * --------------------------------------------------------------------------
 * Development console logging
 * --------------------------------------------------------------------------
 */

if (env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: developmentFormat,
    }),
  );
}

/**
 * --------------------------------------------------------------------------
 * Central application logger
 * --------------------------------------------------------------------------
 */

export const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",

  format: fileFormat,

  transports,

  /**
   * Do not allow an unhandled logger error to crash the application.
   */
  exitOnError: false,
});
