import type { Request, Response } from "express"
import prisma from "../prisma"
import { uploadToStorage } from "../utils/storage"

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        userType: true,
        phone: true,
        birthDate: true,
        gender: true,
        profileImage: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      })
    }

    res.json({
      status: "success",
      data: user,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      })
    }

    // Only allow updating these specific fields
    const { phone, birthDate, gender } = req.body
    let profileImage = undefined

    // Handle file upload if present
    if (req.file) {
      const imageUrl = await uploadToStorage(req.file)
      profileImage = imageUrl
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        ...(profileImage && { profileImage }),
      },
      select: {
        name: true,
        email: true,
        userType: true,
        phone: true,
        birthDate: true,
        gender: true,
        profileImage: true,
      },
    })

    res.json({
      status: "success",
      data: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

