import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";

import { apiV1Router } from "../api/v1/index.js";

import { env } from "../config/env.js";
import { errorHandler } from "../common/middleware/error-handler.js";

const allowedOrigins = env.APP_URL.split(",").map((origin) => origin.trim());
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'self'", "http://localhost:5173"],
      },
    },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      /**
       * Allow requests without an Origin header.
       * Examples:
       * - Postman
       * - Mobile apps
       * - Server-to-server requests
       */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS."));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);

// /**
//  * Unknown routes
//  */
// app.use(notFound);

// /**
//  * Global error handler
//  */
// app.use(errorHandler);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * Global error handler.
 *
 * Must be registered after routes and other middleware.
 */
app.use(errorHandler);

export { app };
