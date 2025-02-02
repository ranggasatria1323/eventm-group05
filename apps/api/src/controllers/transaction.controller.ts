import type { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import type { User } from "@prisma/client";

interface AuthRequest extends ExpressRequest {
  user?: User;
}

class TransactionController {
  /**
   * Create a new transaction
   */
  createTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { ticketId, ticketQuantity, discountId, usePoints, paymentMethod } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      // Fetch ticket details
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { event: true }, // ✅ Pastikan tiket memiliki relasi ke event
      });
      if (!ticket) {
        return res.status(404).json({
          status: "error",
          message: "Ticket not found",
        });
      }

      // Fetch user details
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      let totalPrice = (ticket.price.toNumber() ?? 0) * ticketQuantity;
      let pointsUsed = 0;

      // **Gunakan Diskon Jika Ada**
      if (discountId) {
        const discount = await prisma.discount.findUnique({ where: { id: discountId } });
        if (discount) {
          totalPrice -= (discount.percentage.toNumber() / 100) * totalPrice;
        }
      }

      // **Gunakan Poin Jika Dipilih**
      if (usePoints && user.points > 0) {
        pointsUsed = user.points;
        totalPrice -= pointsUsed;
        await prisma.user.update({
          where: { id: userId },
          data: { points: 0 }, // Reset poin setelah digunakan
        });
      }

      // **Pastikan total harga tidak negatif**
      totalPrice = totalPrice < 0 ? 0 : totalPrice;

      // **Buat transaksi**
      const transaction = await prisma.transaction.create({
        data: {
          user: { connect: { id: userId } },
          event: { connect: { id: ticket.event.id } }, // ✅ Gunakan eventId dari tiket
          ticket: { connect: { id: ticketId } }, // ✅ Gunakan ticketId
          ticketQuantity,
          amount: totalPrice,
          pointsUsed,
          discount: discountId ? { connect: { id: discountId } } : undefined,
          date: new Date(),
        },
      });

      return res.status(201).json({
        status: "success",
        message: "Transaction successful",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
