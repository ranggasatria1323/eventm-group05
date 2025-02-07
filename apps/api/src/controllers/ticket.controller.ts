import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getTicket = async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
  
      const ticket = await prisma.ticket.findUnique({
        where: { id: Number(ticketId) },
        include: {
          event: true,
          user: true,
        },
      });
  
      if (!ticket) {
        return res.status(404).json({
          status: 'error',
          message: 'Ticket not found',
          data: null,
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'get ticket success',
        data: ticket,
      });
    } catch (err) {
      res.status(500).json({
        message: JSON.stringify(err),
        data: null,
      });
    }
  };