'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchEventById, softDeleteEvent } from '../../../../api/event';
import { fetchUserData, getToken, removeToken } from '../../../../api/dashboard';
import LoadingSpinner from '../../../../components/loading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Navbar from '@/components/navbar-dashboard';

export default function EventDetail() {
  const { id } = useParams(); 
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
      const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
      };
    });
  
    const handleLogout = () => {
      removeToken();
      setIsLoggedIn(false);
      router.push('/login'); // Redirect ke login setelah logout
    };

  useEffect(() => {
    const fetchEvent = async () => {
      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const eventId = Array.isArray(id) ? id[0] : id; 

      try {
        const eventData = await fetchEventById(eventId, token);
        const userData : any = await fetchUserData(token)
        setEvent(eventData);
        setIsLoading(false);
        setUserName(userData.name || '');
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    fetchEvent();
  }, [id, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Event not found.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await softDeleteEvent(event.id);
      router.push('/dashboard/event-list');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#ccd6f6] flex items-center justify-center">
      <Navbar userName={userName} />
      {/* Detail Acara */}
      <div className='border-b-2'></div>
      <div className="bg-[#112240] w-full max-w-lg rounded-lg shadow-lg overflow-hidden mt-[53px]">
        {/* Gambar Acara */}
        <div className="relative w-full h-60">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${event.image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Informasi Acara */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#64ffda] mb-4 text-center">
            {event.title}
          </h1>
          <p className="text-center text-lg text-[#8892b0] mb-6">
            {event.description}
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#64ffda] pb-2">
              <h2 className="text-sm font-semibold text-[#64ffda]">Date</h2>
              <p className="text-[#ccd6f6]">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center border-b border-[#64ffda] pb-2">
              <h2 className="text-sm font-semibold text-[#64ffda]">Location</h2>
              <p className="text-[#ccd6f6]">{event.location}</p>
            </div>
            <div className="flex justify-between items-center border-b border-[#64ffda] pb-2">
              <h2 className="text-sm font-semibold text-[#64ffda]">
                Event Type
              </h2>
              <p className="text-[#ccd6f6]">{event.event_type}</p>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-[#64ffda]">Price</h2>
              <p className="text-[#ccd6f6]">
              {!event.price ? "Free" : `Rp ${event.price.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Tombol Back and Delete */}
          <div className="mt-8 text-center flex justify-between">
            <button
              onClick={() => router.push('/dashboard/event-list')}
              className="hidden md:flex px-6 py-3 bg-[#64ffda] text-[#0A192F] font-semibold rounded-md hover:bg-opacity-80"
            >
              Back to Events
            </button>
            <button
              onClick={() => router.push('/dashboard/event-list')}
              className="flex md:hidden px-6 py-3 bg-[#64ffda] text-[#0A192F] font-semibold rounded-md hover:bg-opacity-80"
            >
              Back
            </button>
            <button onClick={() => router.push(`/dashboard/event-list/edit-event/${event.id}`)} className="px-6 py-3 bg-[#64ffda] text-[#0A192F] font-semibold rounded-md hover:bg-opacity-80">Edit</button>
            <button onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
