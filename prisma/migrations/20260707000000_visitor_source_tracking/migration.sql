-- AlterTable
ALTER TABLE "visitor_logs" ADD COLUMN "source" TEXT,
ADD COLUMN "sourceDetail" TEXT,
ADD COLUMN "referrer" TEXT;

-- CreateIndex
CREATE INDEX "visitor_logs_createdAt_idx" ON "visitor_logs"("createdAt");

-- CreateIndex
CREATE INDEX "visitor_logs_source_idx" ON "visitor_logs"("source");
