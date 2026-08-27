import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_AUTH_SERVICE_URL: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z
      .string()
      .min(
        1,
        "Missing NEXT_PUBLIC_AUTH_SERVICE_URL. Set it in .env.local (or .env) as a full URL, e.g. http://localhost:3001",
      )
      .url({
        message:
          "NEXT_PUBLIC_AUTH_SERVICE_URL must be a valid URL (including http/https)",
      }),
  ),
  SESSION_COOKIE_NAME: z.string().min(1).default("auth_session"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function readEnv(): Env {
  if (cachedEnv) return cachedEnv;
  cachedEnv = envSchema.parse({
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    NODE_ENV: process.env.NODE_ENV,
  });
  return cachedEnv;
}

export const env = new Proxy({} as Env, {
  get(_, prop: keyof Env) {
    return readEnv()[prop];
  },
});
