import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * PROJECT CONFIGURATION GUIDE
 *
 * 1. Define your environment variables in the `envSchema` below using Zod.
 * 2. Set default values in `DEFAULT_CONFIG` for local development.
 * 3. Use `config` object throughout the framework for type-safe access.
 */

const DEFAULT_CONFIG = {
  BASE_URL: 'https://example.com',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'password123',
} as const;

const envSchema = z.object({
  /* Core application URL */
  BASE_URL: z.string().url(),
  /* API URL, defaults to BASE_URL in parseEnv() if not provided */
  API_URL: z.string().url(),
  /* Default admin credentials */
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  /* Execution environment */
  ENV: z.enum(['staging', 'production', 'local']).default('staging'),
  /* CI flag */
  CI: z.boolean().default(false),
  /* Optional Slack integration */
  SLACK_WEBHOOK: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const nonEmpty = (value: string | undefined): string | undefined =>
  value && value.length > 0 ? value : undefined;

const parseEnv = (): EnvConfig => {
  const baseUrl = nonEmpty(process.env.BASE_URL) ?? DEFAULT_CONFIG.BASE_URL;
  const apiUrl = nonEmpty(process.env.API_URL) ?? baseUrl;

  try {
    return envSchema.parse({
      BASE_URL: baseUrl,
      API_URL: apiUrl,
      ADMIN_USERNAME: nonEmpty(process.env.ADMIN_USERNAME) ?? DEFAULT_CONFIG.ADMIN_USERNAME,
      ADMIN_PASSWORD: nonEmpty(process.env.ADMIN_PASSWORD) ?? DEFAULT_CONFIG.ADMIN_PASSWORD,
      ENV: process.env.ENV,
      CI: process.env.CI === 'true',
      SLACK_WEBHOOK: nonEmpty(process.env.SLACK_WEBHOOK),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      throw new Error(
        `❌ Invalid or missing environment variables: ${missingVars}. \nCheck your .env file or environment configuration.`
      );
    }
    throw error;
  }
};

export const config: EnvConfig = parseEnv();
