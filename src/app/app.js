import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { apiV1Router } from "../api/v1/index.js";

import { env } from "../config/env.js";
import { errorHandler } from "../common/middleware/error-handler.js";
import { apiRateLimiter } from "../common/middleware/rate-limiter.js";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const urls =
  "http://localhost:5173, https://developer.cribe.org, http://localhost:5000";
const allowedOrigins = urls
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// ====================== SECURITY ======================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'", "'wasm-unsafe-eval'"],

        connectSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:5173",
          "http://localhost:5000",
          "https://developer.cribe.org",
        ],

        workerSrc: ["'self'", "blob:"],

        imgSrc: ["'self'", "data:", "blob:", "https:"],

        fontSrc: ["'self'", "data:", "https:"],

        styleSrc: ["'self'", "'unsafe-inline'", "https:"],

        frameAncestors: [
          "'self'",
          "http://localhost:5173",
          "https://developer.cribe.org",
          "http://localhost:5000",
        ],
      },
    },
  }),
);

app.set("trust proxy", 1);

// ====================== CORS ======================

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
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

// ====================== GENERAL MIDDLEWARE ======================

app.use(compression());

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan("dev"));

// ====================== API ROUTES ======================
app.use("/api/v1", apiRateLimiter, apiV1Router);
// app.use("/api/v1", apiV1Router);

// ====================== UPLOADS ======================

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ====================== SERVE VITE REACT BUILD ======================

const distPath = path.resolve(__dirname, "dist");

app.use(
  express.static(distPath, {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// React Router fallback
app.get("/{*path}", (req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

// ====================== GLOBAL ERROR HANDLER ======================

app.use(errorHandler);

export { app };
