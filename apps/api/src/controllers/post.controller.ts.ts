import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type User = {
  email: string;
  role: string;
  id: string;
};

export const getPosts = async (req: Request, res: Response) => {
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

export const createPosts = async (req: Request, res: Response) => {
  const {
    title,
    description,
    image,
    location,
    date,
    time,
    event_type,
    price,
    max_voucher_discount,
    category,
  } = req.body;

  const user = req.user as User;

  try {
    const newPost = await prisma.event.create({
      data: {
        title: title || '',
        description: description || '',
        image: image || '',
        location: location || '',
        date: new Date(date) || '',
        event_type: event_type || '',
        price: price || 0,
        max_voucher_discount: max_voucher_discount || 0,
        category: category || '',
        created_by: parseInt(user.id),
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'post success',
      data: newPost,
    });
  } catch (err) {}
};
