import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    userType: string | null;
  };
}

type User = {
  id: number;
  name: string;
  email: string;
  userType: string;
};

type EventUpdateInput = Prisma.EventUpdateInput & {
  deleted?: boolean;
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    let events = [];
    if (req.query.type == 'landing') {
      events = await prisma.event.findMany({
        orderBy: {
          date: 'asc',
        },
      });
    } else {
      events = await prisma.event.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });
    }

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
    stock,
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
        stock: Number(price) || 0,
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
        stock: Number(stock) || 0,
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
      return res.status(400).json({
        status: 'error',
        message: 'Event not found',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: {
          ...event,
          createdBy: event.user.name,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
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
        category:true
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

export const searchEvents = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search || '';

    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            title: { contains: searchQuery as string, mode: 'insensitive' },
          },
          {
            description: {
              contains: searchQuery as string,
              mode: 'insensitive',
            },
          },
          {
            location: { contains: searchQuery as string, mode: 'insensitive' },
          },
          {
            category: { contains: searchQuery as string, mode: 'insensitive' },
          },
        ],
      },
    });

    if (events.length === 0) {
      res
        .status(200)
        .json({ status: 'success', message: 'No events found', data: events });
    } else {
      res.status(200).json({ status: 'success', data: events });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(error),
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteEvent = await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      status: 'delete success',
      data: deleteEvent,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
    });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Get event ID from request parameters
    const {
      title,
      description,
      location,
      date,
      event_type,
      price,
      stock,
      max_voucher_discount,
      category,
    } = req.body;
    const {  file } = req 

       // Validate user ID
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is missing',
      });
    }

    // Update the event in the database
    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        created_by:1,
        title,
        description,
        location,
        date: new Date(date),
        event_type,
        price: Number(price),
        stock: Number(stock),
        max_voucher_discount: Number(max_voucher_discount),
        category,
        image:file?.filename
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: JSON.stringify(error),
    });
  }
};
