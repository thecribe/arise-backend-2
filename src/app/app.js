import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { apiV1Router } from "../api/v1/index.js";
import { errorHandler } from "../common/middleware/error-handler.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

export { app };
