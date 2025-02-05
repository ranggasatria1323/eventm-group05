import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import type { User } from "@prisma/client";

interface AuthRequest extends Request {
  user?: User;
}

// Mendapatkan diskon aktif pengguna yang belum digunakan
export const getUserDiscounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is missing",
      });
    }

    const now = new Date();

    // Ambil semua diskon aktif pengguna yang belum digunakan
    const discounts = await prisma.discount.findMany({
      where: {
        userId,
        endDate: { gt: now }, // Diskon masih berlaku
      },
      select: {
        id: true,
        percentage: true,
        startDate: true,
        endDate: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await prisma.discount.findMany();

    return res.status(200).json({ status: "success", data: discounts });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return res.status(500).json({ status: "error", message: "Failed to fetch discounts" });
  }
};

