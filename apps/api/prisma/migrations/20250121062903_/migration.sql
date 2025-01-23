/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "userType" SET DATA TYPE TEXT;
