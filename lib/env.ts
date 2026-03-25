import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_AUTH_SERVICE_URL: z.string().url(),
  SESSION_COOKIE_NAME: z.string().min(1).default("auth_session"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  NODE_ENV: process.env.NODE_ENV,
});
