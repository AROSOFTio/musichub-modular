CREATE TYPE "SupportTicketStatus" AS ENUM ('NEW', 'OPEN', 'AWAITING_USER', 'RESOLVED', 'CLOSED');
CREATE TYPE "SupportTicketCategory" AS ENUM ('ADVERTISE', 'SONG_REQUEST', 'SONG_REMOVAL', 'OTHER');
CREATE TYPE "SupportMessageAuthorType" AS ENUM ('REQUESTER', 'ADMIN', 'SYSTEM');
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('NOT_CONFIGURED', 'PENDING', 'SENT', 'FAILED');

CREATE TABLE "support_tickets" (
  "id" TEXT NOT NULL,
  "ticketNumber" SERIAL NOT NULL,
  "category" "SupportTicketCategory" NOT NULL,
  "status" "SupportTicketStatus" NOT NULL DEFAULT 'NEW',
  "subject" TEXT NOT NULL,
  "requesterName" TEXT NOT NULL,
  "requesterEmail" TEXT NOT NULL,
  "requesterPhone" TEXT,
  "assignedToId" TEXT,
  "metadata" JSONB,
  "emailDeliveryStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
  "emailError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "closedAt" TIMESTAMP(3),
  CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "support_messages" (
  "id" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "authorType" "SupportMessageAuthorType" NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorEmail" TEXT,
  "adminUserId" TEXT,
  "body" TEXT NOT NULL,
  "emailDeliveryStatus" "EmailDeliveryStatus" NOT NULL DEFAULT 'NOT_CONFIGURED',
  "emailError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "support_attachments" (
  "id" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "messageId" TEXT,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "filePath" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "support_attachments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inbound_email_mappings" (
  "id" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "replyToken" TEXT NOT NULL,
  "inboundEmail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "inbound_email_mappings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "support_tickets_ticketNumber_key" ON "support_tickets"("ticketNumber");
CREATE INDEX "support_tickets_category_status_createdAt_idx" ON "support_tickets"("category", "status", "createdAt");
CREATE INDEX "support_tickets_requesterEmail_idx" ON "support_tickets"("requesterEmail");
CREATE INDEX "support_tickets_assignedToId_idx" ON "support_tickets"("assignedToId");
CREATE INDEX "support_messages_ticketId_createdAt_idx" ON "support_messages"("ticketId", "createdAt");
CREATE INDEX "support_messages_adminUserId_idx" ON "support_messages"("adminUserId");
CREATE INDEX "support_attachments_ticketId_idx" ON "support_attachments"("ticketId");
CREATE INDEX "support_attachments_messageId_idx" ON "support_attachments"("messageId");
CREATE UNIQUE INDEX "inbound_email_mappings_replyToken_key" ON "inbound_email_mappings"("replyToken");
CREATE INDEX "inbound_email_mappings_ticketId_idx" ON "inbound_email_mappings"("ticketId");

ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "support_attachments" ADD CONSTRAINT "support_attachments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "support_attachments" ADD CONSTRAINT "support_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "support_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "inbound_email_mappings" ADD CONSTRAINT "inbound_email_mappings_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
