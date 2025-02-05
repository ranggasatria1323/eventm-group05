'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrganizerEvents } from './../../../api/event';
import { getToken, removeToken } from './../../../api/dashboard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
    };
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

  const handleLogout = () => {
      removeToken();
      setIsLoggedIn(false);
      router.push('/login'); // Redirect ke login setelah logout
    };

  return (
    <div className="p-6 bg-[#112240] border border-[#112240] rounded-lg md:h-[100vh] h-[100%]">
      <h2 className="text-2xl font-bold text-[#64ffda] mb-6 ">My Events</h2>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-[20px] right-[30px] flex ml-[113px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Menu />
        </button>
        {/* Auth Drawer */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#112240] shadow-lg transition-transform duration-300 ${
              isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b flex justify-between items-center text-white">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="bg-[#112240]">
              <ul className="px-3 space-y-4">
                <li>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/event-list">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Event List
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Home
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/create">
                    <Button className="w-full bg-[#64ffda] text-[#0A192F] font-semibold hover:bg-opacity-80 transition-colors duration-200">
                      Create Event
                    </Button>
                  </Link>
                </li>

                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
                  <strong>Price:</strong> {!event.price ? "Free" : `Rp ${event.price.toLocaleString()}`}
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
