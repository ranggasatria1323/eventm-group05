'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const base_url = 'http://localhost:1234';

interface IEventsDto {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  event_type: string;
  price: number;
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
