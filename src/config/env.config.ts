import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  BASE_URL: z.string().url().default('https://opensource-demo.orangehrmlive.com'),
  API_URL: z.string().url().default('https://opensource-demo.orangehrmlive.com'),
  ADMIN_USERNAME: z.string().default('Admin'),
  ADMIN_PASSWORD: z.string().default('admin123'),
  ENV: z.enum(['staging', 'production', 'local']).default('staging'),
  CI: z.boolean().default(false),
  SLACK_WEBHOOK: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parseEnv = () => {
  try {
    return envSchema.parse({
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
      ADMIN_USERNAME: process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      ENV: process.env.ENV,
      CI: process.env.CI === 'true',
      SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      throw new Error(`❌ Invalid or missing environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const config: EnvConfig = parseEnv();
