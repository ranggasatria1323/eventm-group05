import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    userType: string;
  };
}

type User = {
  name: string;
  email: string;
  userType: string;
  id: number;
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany();

    res.status(200).json({
      status: 'success',
      message: 'get post success',
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      message: JSON.stringify(err),
      data: null,
    });
  }
};

export const createEvents = async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    image,
    location,
    date,
    event_type,
    price,
    max_voucher_discount,
    category,
  } = req.body;

  const user = req.user as User;

  try {
    const { file } = req;

    console.log({
      data: {
        title: title || '',
        description: description || '',
        image: file?.filename || '',
        location: location || '',
        date: new Date(date) || '',
        event_type: event_type || '',
        price: price || 0,
        max_voucher_discount: max_voucher_discount || 0,
        category: category || '',
        created_by: user.id,
      },
    });
    const newPost = await prisma.event.create({
      data: {
        title: title || '',
        description: description || '',
        image: file?.filename || '',
        location: location || '',
        date: new Date(date) || '',
        event_type: event_type || '',
        price: Number(price) || 0,
        max_voucher_discount: Number(max_voucher_discount) || 0,
        category: category || '',
        created_by: user.id,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'post success',
      data: newPost,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(' error code : ', err.code);
    }

    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
      data: null,
    });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            userType: true,
          },
        },
      },
    });

    if (!event) {
      res.status(400).json({
        status: 'event not found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          ...event,
          createdBy: event.user.name,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
    });
  }
};

export const getOrganizerEvents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User not logged in',
      });
    }

    const events = await prisma.event.findMany({
      where: {
        created_by: userId, // Event yang dibuat oleh pengguna login
      },
      select: {
        id: true,
        title: true,
        date: true,
        location: true,
        event_type: true,
        price: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events',
    });
  }
};
