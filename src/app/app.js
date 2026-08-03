import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { apiV1Router } from "../api/v1/index.js";

import { env } from "../config/env.js";
import { ApiResponse } from "../common/responses/api-response.js";

const allowedOrigins = env.FRONTEND_URL.split(",").map((origin) =>
  origin.trim(),
);
const app = express();

app.use(helmet());

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

app.use((err, req, res, next) => {
  console.error(err);

  return ApiResponse.error(res, 500, "Internal server error.");
});

export { app };
