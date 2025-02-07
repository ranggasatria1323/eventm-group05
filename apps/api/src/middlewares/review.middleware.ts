// import { NextFunction, Request, Response } from "express";
// import prisma from "../prisma";
// import { User } from "@prisma/client";

// interface AuthRequest extends Request {
//   user?: User;
// }

// export const verifyReviewEligibility = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.user?.id;

//     // Pastikan req.body tidak kosong dan memiliki eventId
//     if (!req.body || typeof req.body !== "object") {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid request body",
//       });
//     }

//     const { eventId } = req.body;

//     if (!eventId) {
//       return res.status(400).json({ status: "error", message: "Event ID is required" });
//     }

//     if (!userId) {
//       return res.status(401).json({ status: "error", message: "Unauthorized" });
//     }

//     // Cek apakah event sudah selesai
//     const event = await prisma.event.findUnique({
//       where: { id: Number(eventId) },
//       select: { date: true },
//     });

//     if (!event) {
//       return res.status(404).json({ status: "error", message: "Event not found" });
//     }

//     if (!event.date || new Date(event.date) > new Date()) {
//       return res.status(400).json({
//         status: "error",
//         message: "Cannot review an event that has not ended yet",
//       });
//     }

//     // Cek apakah user telah membeli tiket untuk event ini
//     const transaction = await prisma.transaction.findFirst({
//       where: {
//         userId: userId,
//         eventId: Number(eventId),
//       },
//     });

//     if (!transaction) {
//       return res.status(403).json({
//         status: "error",
//         message: "You must have purchased a ticket for this event to leave a review",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Error in verifyReviewEligibility middleware:", error);
//     return res.status(500).json({
//       status: "error",
//       message: "Internal Server Error",
//     });
//   }
// };
