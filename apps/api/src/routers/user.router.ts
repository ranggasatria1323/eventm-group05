import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware'; // Pastikan jalur ini benar sesuai struktur proyek Anda
import prisma from '../prisma';

const router = Router();

router.put('/user/role', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is missing',
      });
    }

    await prisma.user.update({
      where: { id: Number(userId) }, // Convert to number
      data: { userType },
    });

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role',
    });
  }
});

export default router;
