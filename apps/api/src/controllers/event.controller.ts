import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: User;
}

type User = {
  name: string
  email: string;
  userType: string;
  id: number;
} ;

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

    const { file } = req

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
    })
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
      console.log(" error code : ", err.code)
  }

    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
      data: null,
    });
  }
};
