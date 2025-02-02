/*
  Warnings:

  - You are about to drop the column `stock` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `ticketQuantity` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `_TicketToTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ticketId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TicketToTransaction" DROP CONSTRAINT "_TicketToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_TicketToTransaction" DROP CONSTRAINT "_TicketToTransaction_B_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_eventId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "stock",
ADD COLUMN     "max_voucher_discount" INTEGER;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "eventId",
DROP COLUMN "ticketQuantity",
ADD COLUMN     "ticketId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_TicketToTransaction";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
