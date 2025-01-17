/*
  Warnings:

  - You are about to drop the column `basePrice` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `events` table. All the data in the column will be lost.
  - You are about to alter the column `location` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `created_by` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizerId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "basePrice",
DROP COLUMN "capacity",
DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "name",
DROP COLUMN "organizerId",
DROP COLUMN "startDate",
ADD COLUMN     "category" VARCHAR(50),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "event_type" VARCHAR(50),
ADD COLUMN     "image" VARCHAR(50),
ADD COLUMN     "max_voucher_discount" INTEGER,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "title" VARCHAR(200),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "location" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
