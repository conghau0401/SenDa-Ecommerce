-- Thêm cột finalPrice (= salePrice ?? price), backfill từ dữ liệu sẵn có
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "finalPrice" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "shortDesc" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "careGuide" TEXT NOT NULL DEFAULT '',
    "categoryId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("careGuide", "categoryId", "createdAt", "description", "id", "isActive", "isFeatured", "isNew", "metaDescription", "metaTitle", "name", "price", "salePrice", "finalPrice", "shortDesc", "showOnHome", "sku", "slug", "sortOrder", "stock", "updatedAt") SELECT "careGuide", "categoryId", "createdAt", "description", "id", "isActive", "isFeatured", "isNew", "metaDescription", "metaTitle", "name", "price", "salePrice", COALESCE("salePrice", "price"), "shortDesc", "showOnHome", "sku", "slug", "sortOrder", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");
CREATE INDEX "Product_isActive_showOnHome_idx" ON "Product"("isActive", "showOnHome");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
CREATE INDEX "Product_finalPrice_idx" ON "Product"("finalPrice");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
