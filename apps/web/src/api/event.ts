import axios from 'axios';
import Cookies from 'js-cookie';

const base_url = 'http://localhost:1234'; // Adjust the URL as needed

interface IEventsDto {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  event_type: string;
  price: number;
  stock: number,
  max_voucher_discount: number;
  category: string;
}

export async function eventListProcess(data?: { type: string }) {
  try {
    const response = await axios.get(base_url + '/events?type=' + data?.type);
    console.log('API response:', response.data);

    if (response?.status === 200) {
      console.log('Events data:', response.data.data);
      return response.data.data;
    } else {
      console.error('Unexpected status code:', response.data.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function eventCreateProcess(data: FormData) {
  try {
    let newToken = '';
    if (Cookies.get('token')) {
      newToken = 'Bearer ' + Cookies.get('token');
    }

    return await axios.post(base_url + '/event', data, {
      headers: {
        Authorization: newToken,
      },
    });
  } catch (err: any) {
    console.error('Error creating event:', err); // Added error handling
  }
}

export async function eventEditProcess(id: string, data: IEventsDto) {
  try {
    let newToken = '';
    if (Cookies.get('token')) {
      newToken = 'Bearer ' + Cookies.get('token');
    }

    const reqBody = {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      date: data.date,
      price: data.price,
      image: data.image,
      stock: data.stock,
      event_type: data.event_type,
      max_voucher_discount: data.max_voucher_discount
    }

    return await axios.patch(`${base_url}/events/${id}`, reqBody, {
      headers: {
        Authorization: newToken,
      },
    });
  } catch (err: any) {
    console.error('Error editing event:', err);
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const fetchOrganizerEvents = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}organizer-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data; // Data event
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch organizer events:', error);
    return [];
  }
};

export const fetchEventById = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch event details:', error);
    return null;
  }
};

export const searchEvents = async (query: string) => {
  try {
    const response = await axios.get(`${base_url}/search`, {
      params: { search: query },
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching events:', error);
    return [];
  }
};

export const softDeleteEvent = async (eventId: number): Promise<void> => {
  try {
    let newToken = '';
    if (Cookies.get('token')) {
      newToken = 'Bearer ' + Cookies.get('token');
    }
    return await axios.delete(`${base_url}/events/${eventId}`, {
      headers: {
        Authorization: newToken,
      },
    });
  } catch (error) {
    console.error('Error soft deleting event:', error);
    throw error; // Propagate error to be handled in UI
  }
};
