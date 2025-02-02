/*
  Warnings:

  - You are about to drop the column `max_voucher_discount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketQuantity` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_ticketId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "max_voucher_discount",
ADD COLUMN     "stock" INTEGER;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "ticketId",
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "ticketQuantity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_TicketToTransaction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TicketToTransaction_AB_unique" ON "_TicketToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_TicketToTransaction_B_index" ON "_TicketToTransaction"("B");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToTransaction" ADD CONSTRAINT "_TicketToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToTransaction" ADD CONSTRAINT "_TicketToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
