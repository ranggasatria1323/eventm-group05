import type { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import type { User } from "@prisma/client";
import path from "path";
import fs from "fs";

interface AuthRequest extends ExpressRequest {
  user?: User;
  file?: Express.Multer.File;
}

class ProfileController {
  /**
   * Get user profile
   */
  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          phoneNumber: true,
          birthdate: true,
          gender: true,
          image: true,
          referralCode: true,
          points: true,
          pointsUpdatedAt: true, 
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Hitung sisa waktu expired poin
      const now = new Date();
      const pointsUpdatedAt = new Date(user.pointsUpdatedAt || user.createdAt);
      const expiryDate = new Date(pointsUpdatedAt);
      expiryDate.setMonth(expiryDate.getMonth() + 3);

      const remainingTime = expiryDate.getTime() - now.getTime(); // Dalam milidetik
      const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24))); // Dalam hari

      return res.status(200).json({
        status: "success",
        data: {
          ...user,
          remainingDays, // Tambahkan sisa hari expired poin
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, birthdate, gender } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      let imageFilename = undefined;
      if (req.file) {
        imageFilename = req.file.filename;

        // Delete old profile image if it exists
        const oldUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { image: true },
        });
        if (oldUser?.image) {
          const oldImagePath = path.join(__dirname, "..", "..", "public", "images", oldUser.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: phoneNumber || undefined,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          gender: gender || undefined,
          image: imageFilename,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Use referral code to award points
   */
  useReferralCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { referralCode } = req.body;
      const userId = req.user?.id;

      if (!userId || !referralCode) {
        return res.status(400).json({
          status: "error",
          message: "User ID or referral code is missing",
        });
      }

      // Find the user associated with the referral code
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!referrer) {
        return res.status(404).json({
          status: "error",
          message: "Referrer not found",
        });
      }

      // Prevent user from using their own referral code
      if (referrer.id === userId) {
        return res.status(400).json({
          status: "error",
          message: "You cannot use your own referral code",
        });
      }

      // Check if the user has already used a referral code
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { referrerId: true },
      });

      if (user?.referrerId) {
        return res.status(400).json({
          status: "error",
          message: "You have already used a referral code",
        });
      }

      // Update the referrer's points and pointsUpdatedAt
      const updatedReferrer = await prisma.user.update({
        where: { id: referrer.id },
        data: {
          points: {
            increment: 10000,
          },
          pointsUpdatedAt: new Date(), // Perbarui waktu poin ditambahkan
        },
      });

      // Update the current user's referrerId
      await prisma.user.update({
        where: { id: userId },
        data: { referrerId: referrer.id },
      });

      return res.status(200).json({
        status: "success",
        message: "Referral code used successfully, points awarded",
        data: updatedReferrer,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
