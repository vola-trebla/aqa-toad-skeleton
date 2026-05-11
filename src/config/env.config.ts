import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

// Public OrangeHRM demo target. Credentials for this URL are publicly documented,
// so we allow safe defaults. For any other BASE_URL, ADMIN_USERNAME and ADMIN_PASSWORD
// must be set explicitly - preventing accidental CI runs against real envs with demo creds.
const DEMO_URL = 'https://opensource-demo.orangehrmlive.com';
const DEMO_USERNAME = 'Admin';
const DEMO_PASSWORD = 'admin123';

const envSchema = z.object({
  BASE_URL: z.string().url(),
  API_URL: z.string().url(),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  ENV: z.enum(['staging', 'production', 'local']).default('staging'),
  CI: z.boolean().default(false),
  SLACK_WEBHOOK: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const nonEmpty = (value: string | undefined): string | undefined =>
  value && value.length > 0 ? value : undefined;

const parseEnv = (): EnvConfig => {
  const baseUrl = nonEmpty(process.env.BASE_URL) ?? DEMO_URL;
  const apiUrl = nonEmpty(process.env.API_URL) ?? DEMO_URL;
  const isDemoTarget = baseUrl === DEMO_URL;

  try {
    return envSchema.parse({
      BASE_URL: baseUrl,
      API_URL: apiUrl,
      ADMIN_USERNAME:
        nonEmpty(process.env.ADMIN_USERNAME) ?? (isDemoTarget ? DEMO_USERNAME : undefined),
      ADMIN_PASSWORD:
        nonEmpty(process.env.ADMIN_PASSWORD) ?? (isDemoTarget ? DEMO_PASSWORD : undefined),
      ENV: process.env.ENV,
      CI: process.env.CI === 'true',
      SLACK_WEBHOOK: nonEmpty(process.env.SLACK_WEBHOOK),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      const hint = !isDemoTarget
        ? ' (non-demo BASE_URL requires explicit ADMIN_USERNAME and ADMIN_PASSWORD)'
        : '';
      throw new Error(`❌ Invalid or missing environment variables: ${missingVars}${hint}`);
    }
    throw error;
  }
};

export const config: EnvConfig = parseEnv();
