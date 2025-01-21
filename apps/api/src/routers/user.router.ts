import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware'; // Pastikan jalur ini benar sesuai struktur proyek Anda
import prisma from '../prisma';

const router = Router();

// Rute untuk memperbarui peran pengguna
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

// Rute untuk mendapatkan data pengguna berdasarkan ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user',
    });
  }
});

// Rute untuk mendapatkan semua data pengguna
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      status: 'success',
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
});

export default router;
