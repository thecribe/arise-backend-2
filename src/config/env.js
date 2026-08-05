import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  APP_NAME: z.string(),

  APP_URL: z.string(),
  API_URL: z.string(),

  API_PREFIX: z.string(),

  API_VERSION: z.string(),
  // FRONTEND_URL: z.string(),

  DB_HOST: z.string(),

  DB_PORT: z.coerce.number(),

  DB_DATABASE: z.string(),

  DB_USERNAME: z.string(),

  DB_PASSWORD: z.string().optional(),

  JWT_SECRET: z.string(),

  JWT_EXPIRES_IN: z.string(),

  JWT_REFRESH_SECRET: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  RESEND_API_KEY: z.string().optional(),

  UPLOAD_PATH: z.string(),

  LOG_LEVEL: z.string(),
});

const env = envSchema.parse(process.env);

export { env };
