import type { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import type { User } from "@prisma/client";
import { uploader } from "./../../uploader"; // Correct import for the uploader
import path from "path"; // Import path for file handling

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
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user,
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

      let profileImage: string | undefined;

      if (req.file) {
        profileImage = path.join("/images/profiles", req.file.filename); // Store image in public/images
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: phoneNumber || undefined,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          gender: gender || undefined,
          image: profileImage || undefined,
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

      // Update the referrer's points
      const updatedReferrer = await prisma.user.update({
        where: { id: referrer.id },
        data: {
          points: {
            increment: 10000, // Increment points by 10,000
          },
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
