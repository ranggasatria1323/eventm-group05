import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

// Menambahkan Review
export const addReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { eventId, comment, rating } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    console.log('User:', req.user);
    console.log('Body:', { eventId, comment, rating });

    // Validasi input
    if (!eventId || !comment || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Event ID, comment, and rating (1–5) are required.',
      });
    }

    // Tambahkan review ke database
    const review = await prisma.review.create({
      data: {
        eventId: Number(eventId),
        userId: req.user.id,
        comment,
        rating: Number(rating),
      },
    });

    console.log('Review Created:', review);

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully.',
      data: review,
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    next(error);
  }
};

// Mengambil Semua Review untuk Event Tertentu
export const getReviewsByEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { eventId } = req.params;

  try {
    if (!eventId) {
      return res.status(400).json({
        status: 'error',
        message: 'Event ID is required.',
      });
    }

    console.log('Fetching reviews for Event ID:', eventId);

    // Ambil semua review berdasarkan event ID
    const reviews = await prisma.review.findMany({
      where: {
        eventId: Number(eventId),
      },
      include: {
        user: {
          select: {
            name: true, // Sertakan nama pengguna
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Urutkan berdasarkan tanggal posting
      },
    });

    console.log('Reviews Fetched:', reviews);

    res.status(200).json({
      status: 'success',
      data: reviews,
    });
  } catch (error) {
    console.error('Error in getReviewsByEvent:', error);
    next(error);
  }
};
