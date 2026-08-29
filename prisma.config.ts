import { defineConfig, env } from 'prisma/config';

// Prisma 7 moved the datasource connection URL out of schema.prisma and into
// this config file (the schema itself no longer has network access to read
// env vars). This only wires up the CLI (generate/migrate/db push/studio/seed);
// the app's runtime PrismaClient gets its own connection via the adapter in
// src/lib/db.ts.
type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
