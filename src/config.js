const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.string().default('3000'),
    CORS_ORIGIN: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.errors);
    process.exit(1);
}

module.exports = parsed.data;
