'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrganizerEvents } from './../../../api/event';
import { getToken } from './../../../api/dashboard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  event_type: string;
  price: number;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [deleteEvent, setDeleteEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = getToken();

      if (!token) {
        router.push('/login'); // Redirect ke login jika tidak ada token
        return;
      }

      const organizerEvents = await fetchOrganizerEvents(token);
      setEvents(organizerEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, [router]);

  // Fungsi untuk menentukan status berdasarkan waktu acara
  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const eventTime = new Date(eventDate);

    if (eventTime < now) {
      return { status: 'Done', color: 'bg-red-500' };
    } else if (
      eventTime.toDateString() === now.toDateString() // Acara pada hari ini
    ) {
      return { status: 'Ongoing', color: 'bg-green-500' };
    } else {
      return { status: 'Coming Soon', color: 'bg-blue-500' };
    }
  };

  // Fungsi untuk menangani klik event dan redirect ke halaman detail
  const handleEventClick = (id: number) => {
    router.push(`/dashboard/events/${id}`); // Redirect ke halaman event detail dengan ID
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-[#ccd6f6]">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#112240] border border-[#112240] rounded-lg h-[100vh]">
        <Link href="/dashboard">
      <h2 className="text-2xl font-bold text-[#64ffda] mb-6 ">My Events</h2>
        </Link>

      {events.length === 0 ? (
        <p className="text-[#8892b0]">You have not created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const { status, color } = getEventStatus(event.date);

            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)} // Redirect saat diklik
                className="bg-[#0A192F] border border-[#64ffda] p-4 rounded-lg shadow cursor-pointer hover:bg-[#112240] transition"
              >
                <h3 className="text-lg font-bold text-[#64ffda]">
                  {event.title}
                </h3>
                <p className="text-sm text-[#8892b0]">
                  <strong>Date:</strong>{' '}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#8892b0]">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-sm text-[#8892b0]">
                  <strong>Type:</strong> {event.event_type}
                </p>
                <p className="text-sm text-[#8892b0]">
                  <strong>Price:</strong> {event.price === 0 ? "Free" : `Rp ${event.price.toLocaleString()}`}
                </p>
                <div className="flex items-center mt-4">
                  <span
                    className={`w-3 h-3 rounded-full ${color} mr-2`}
                    aria-label="Status indicator"
                  ></span>
                  <span className="text-sm font-semibold text-[#ccd6f6]">
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
