-- CreateTable
CREATE TABLE "HustleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HustleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hustle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hustleType" TEXT NOT NULL,
    "workMode" TEXT NOT NULL,
    "priceType" TEXT,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "contactNo" TEXT,
    "categoryId" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "uniId" TEXT NOT NULL,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hustle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HustleCategory_name_key" ON "HustleCategory"("name");

-- CreateIndex
CREATE INDEX "Hustle_authorId_idx" ON "Hustle"("authorId");

-- CreateIndex
CREATE INDEX "Hustle_uniId_idx" ON "Hustle"("uniId");

-- CreateIndex
CREATE INDEX "Hustle_categoryId_idx" ON "Hustle"("categoryId");

-- CreateIndex
CREATE INDEX "Hustle_isApproved_idx" ON "Hustle"("isApproved");

-- AddForeignKey
ALTER TABLE "Hustle" ADD CONSTRAINT "Hustle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HustleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hustle" ADD CONSTRAINT "Hustle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hustle" ADD CONSTRAINT "Hustle_uniId_fkey" FOREIGN KEY ("uniId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
