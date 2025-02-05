import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import type { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

class TransactionController {
  /**
   * Create a new transaction and delete the discount if used
   */
  createTransaction = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { eventId, ticketQuantity, discountId, usePoints, paymentMethod } =
        req.body;
      console.log('Request body:', req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Unauthorized' });
      }

      if (!eventId || !ticketQuantity || !paymentMethod) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid data' });
      }

      if (isNaN(ticketQuantity)) {
        return res
          .status(400)
          .json({ status: 'error', message: 'Invalid ticket quantity' });
      }

      // 🔹 Gunakan Prisma Transaction untuk menjaga konsistensi data
      const transactionResult = await prisma.$transaction(async (prisma) => {
        // 🔹 Cek apakah event tersedia
        const event = await prisma.event.findUnique({
          where: { id: Number(eventId) },
          select: { id: true, stock: true, price: true },
        });

        if (!event) {
          throw new Error('Event not found');
        }

        if (event.stock === null || event.price === null) {
          throw new Error('Invalid event data (stock or price missing)');
        }

        if (event.stock < ticketQuantity) {
          throw new Error('Insufficient ticket stock');
        }

        let totalPrice = event.price * ticketQuantity;
        let pointsUsed = 0;

        // 🔹 Jika ada diskon, gunakan dan tandai sebagai sudah digunakan
        if (discountId) {
          const discount = await prisma.discount.findFirst({
            where: { id: Number(discountId), used: false }, // Pastikan diskon belum digunakan
          });

          if (!discount) {
            throw new Error('Invalid or already used discount ID');
          }

          totalPrice -= (Number(discount.percentage) / 100) * totalPrice;

          // **🔹 Tandai diskon sebagai sudah digunakan, bukan dihapus**
          await prisma.discount.update({
            where: { id: Number(discountId) },
            data: { used: true }, // Tandai diskon sebagai sudah digunakan
          });

          console.log(
            `Discount with ID: ${discountId} has been marked as used.`,
          );
        }

        // 🔹 Jika user menggunakan poin
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (usePoints && user && user.points > 0) {
          pointsUsed = Math.min(user.points, totalPrice);
          totalPrice -= pointsUsed;

          await prisma.user.update({
            where: { id: userId },
            data: { points: user.points - pointsUsed },
          });
        }

        totalPrice = Math.max(0, totalPrice);

        // 🔹 Kurangi stok tiket dari event
        await prisma.event.update({
          where: { id: Number(eventId) },
          data: { stock: { decrement: ticketQuantity } },
        });

        // 🔹 Buat transaksi baru
        return await prisma.transaction.create({
          data: {
            userId: userId,
            eventId: Number(eventId),
            ticketQuantity,
            amount: totalPrice,
            pointsUsed,
            discountId: discountId ? Number(discountId) : undefined,
            paymentMethod: paymentMethod,
            date: new Date(),
          },
        });
      });

      return res.status(201).json({
        status: 'success',
        message: 'Transaction successful',
        data: transactionResult,
      });
    } catch (error: unknown) {
      console.error('Error in createTransaction:', error);
      if (error instanceof Error) {
        return res.status(400).json({
          status: 'error',
          message: error.message || 'Transaction failed',
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Transaction failed due to an unknown error',
        });
      }
    }
  };
  /**
   * Get all transactions related to the Event Organizer's events
   */
  getTransactionStatsByEO = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log('user:', req.user);
      console.log('auth:', req.headers.authorization);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // 🔹 Ambil semua event yang dibuat oleh EO (gunakan `createdBy` untuk filter EO)
      const events = await prisma.event.findMany({
        where: { created_by: userId }, // Pastikan event memiliki `createdBy`
        select: { id: true, title: true },
      });

      const eventIds = events.map((event) => event.id);

      if (eventIds.length === 0) {
        return res
          .status(200)
          .json({ message: 'No transactions found for your events.' });
      }

      // 🔹 Ambil transaksi berdasarkan eventId yang dibuat EO
      const transactions = await prisma.transaction.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds } },
        _sum: { ticketQuantity: true, amount: true },
      });

      // 🔹 Format hasil data untuk frontend chart
      const stats = transactions.map((trx) => {
        const event = events.find((e) => e.id === trx.eventId);
        return {
          eventName: event ? event.title : 'Unknown Event',
          totalTicketsSold: trx._sum.ticketQuantity || 0,
          totalRevenue: trx._sum.amount || 0,
        };
      });
      console.log('Transaksi yang dikembalikan:', stats)

      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  /**
   * Get all transactions with event and user details
   */
  getAllTransactions = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log('Fetching all transactions...');

      // 🔹 Ambil semua transaksi dengan informasi event & user
      const transactions = await prisma.transaction.findMany({
        include: {
          event: { select: { id: true, title: true, price: true } }, // Info event
          user: { select: { id: true, name: true, email: true } }, // Info user
        },
        orderBy: { date: 'desc' }, // Urutkan dari yang terbaru
      });

      // 🔹 Format hasil data agar lebih mudah digunakan di frontend
      const formattedTransactions = transactions.map((txn) => ({
        transactionId: txn.id,
        userId: txn.user.id,
        userName: txn.user.name,
        userEmail: txn.user.email,
        eventId: txn.event.id,
        eventName: txn.event.title,
        ticketQuantity: txn.ticketQuantity,
        amountPaid: txn.amount,
        paymentMethod: txn.paymentMethod,
        date: txn.date,
      }));

      return res.status(200).json({
        status: 'success',
        message: 'All transactions fetched successfully',
        data: formattedTransactions,
      });
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default TransactionController;
