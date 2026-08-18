-- AlterTable
ALTER TABLE "visitor_logs" ADD COLUMN "rawRequest" TEXT,
ADD COLUMN "rawResponse" TEXT;

-- CreateIndex
CREATE INDEX "visitor_logs_countryCode_idx" ON "visitor_logs"("countryCode");

-- CreateIndex
CREATE INDEX "visitor_logs_page_idx" ON "visitor_logs"("page");
