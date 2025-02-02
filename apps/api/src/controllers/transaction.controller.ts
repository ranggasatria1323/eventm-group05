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
      const { eventId, ticketQuantity, discountId, usePoints, paymentMethod } = req.body;
      console.log('Request body:', req.body); // Log payload yang diterima
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
      }

      // Validasi data yang diterima
      if (!eventId || !ticketQuantity || !paymentMethod) {
        return res.status(400).json({ status: "error", message: "Invalid data" });
      }

      // Periksa apakah ticketQuantity adalah nomor
      if (isNaN(ticketQuantity)) {
        return res.status(400).json({ status: "error", message: "Invalid ticket quantity" });
      }

      // Gunakan Prisma Transaction untuk mencegah race condition
      const transactionResult = await prisma.$transaction(async (prisma) => {
        // Cek apakah event tersedia
        const event = await prisma.event.findUnique({
          where: { id: Number(eventId) },
          select: { id: true, stock: true, price: true }
        });

        console.log('Event data:', event); // Log data event untuk memastikan stok tersedia

        if (!event) {
          throw new Error("Event not found");
        }

        // Validasi jika event memiliki stok dan harga
        if (event.stock === null || event.price === null) {
          throw new Error("Invalid event data (stock or price missing)");
        }

        // Validasi stok tiket cukup
        if (event.stock < ticketQuantity) {
          throw new Error("Insufficient ticket stock");
        }

        let totalPrice = event.price * ticketQuantity;
        let pointsUsed = 0;

        // Jika ada diskon, kurangi harga
        if (discountId) {
          const discount = await prisma.discount.findUnique({ where: { id: Number(discountId) } });
          if (discount) {
            totalPrice -= (Number(discount.percentage) / 100) * totalPrice;
          }
        }

        // Jika user menggunakan poin
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (usePoints && user && user.points > 0) {
          pointsUsed = Math.min(user.points, totalPrice); // Jangan biarkan total harga negatif
          totalPrice -= pointsUsed;

          // Reset poin setelah digunakan
          await prisma.user.update({
            where: { id: userId },
            data: { points: user.points - pointsUsed }
          });
        }

        totalPrice = Math.max(0, totalPrice); // Pastikan harga tidak negatif

        // Kurangi stok tiket dari event secara aman (hanya jika transaksi berhasil)
        await prisma.event.update({
          where: { id: Number(eventId) },
          data: { stock: { decrement: ticketQuantity } }
        });

        // Buat transaksi setelah stok dikurangi
        return await prisma.transaction.create({
          data: {
            userId: userId,
            eventId: Number(eventId),
            ticketQuantity,
            amount: totalPrice,
            pointsUsed,
            discountId: discountId ? Number(discountId) : undefined,
            paymentMethod: paymentMethod, // Tambahkan metode pembayaran
            date: new Date()
          }
        });
      });

      return res.status(201).json({
        status: "success",
        message: "Transaction successful",
        data: transactionResult,
      });
    } catch (error: unknown) {
      console.error("Error in createTransaction:", error);
      if (error instanceof Error) {
        return res.status(400).json({
          status: "error",
          message: error.message || "Transaction failed",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Transaction failed due to an unknown error",
        });
      }
    }
  };
}

export default TransactionController;
