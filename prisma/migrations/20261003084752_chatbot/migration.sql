-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '{}',
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "unansweredCount" INTEGER NOT NULL DEFAULT 0,
    "isReviewed" BOOLEAN NOT NULL DEFAULT true,
    "pagePath" TEXT,
    "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conversationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "source" TEXT,
    "answered" BOOLEAN NOT NULL DEFAULT true,
    "payload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatFaq" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'chung',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatConversation_sessionId_key" ON "ChatConversation"("sessionId");

-- CreateIndex
CREATE INDEX "ChatConversation_lastMessageAt_idx" ON "ChatConversation"("lastMessageAt");

-- CreateIndex
CREATE INDEX "ChatConversation_isReviewed_idx" ON "ChatConversation"("isReviewed");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_intent_idx" ON "ChatMessage"("intent");

-- CreateIndex
CREATE INDEX "ChatFaq_isActive_idx" ON "ChatFaq"("isActive");
