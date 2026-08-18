-- Backfills a gap in the migration history: visitor_logs was originally created
-- with `prisma db push`, so no migration ever declared it and replaying the
-- history into a fresh shadow database failed at the next migration's ALTER.
-- IF NOT EXISTS keeps this a no-op on databases that already have the table.

-- CreateTable
CREATE TABLE IF NOT EXISTS "visitor_logs" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "country" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "city" TEXT,
    "isp" TEXT,
    "page" TEXT NOT NULL DEFAULT '/',
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_logs_pkey" PRIMARY KEY ("id")
);
