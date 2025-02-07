"use client"

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, User, Ticket, QrCode } from 'lucide-react';
import { fetchEventById } from '@/api/event'; // Ensure this path is correct
import { getToken } from '@/api/dashboard'; // Ensure this path is correct
import { useParams, useRouter } from 'next/navigation';
import { fetchUserProfile } from '@/api/header';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  event_type: string;
  price: number;
  stock: number;
  createdBy: string;
}

function TicketPage() { // Renamed to avoid conflicts
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<{ name: string }>({
    name: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
          const profile = await fetchUserProfile();
          if (profile) {
            setUser({
              name: profile.name,
            });
          }
        };
    const fetchEvent = async () => {
      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const eventId = Array.isArray(id) ? id[0] : id;

      if (!eventId || !token) {
        console.error('Missing event ID or token');
        return;
      }

      try {
        const eventData = await fetchEventById(eventId, token);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser()
    fetchEvent();
  }, [id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>; // Handle case where event is null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-sm opacity-90 mt-1">Thank you for your purchase!</p>
        </div>
        
        {/* Ticket Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(event.date).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">7:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ticket Holder</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ticket Type</p>
                    <p className="font-semibold">{event.event_type}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Section - QR Code */}
            <div className="flex flex-col items-center justify-center p-4 border-l border-gray-200">
              <div className="bg-gray-100 p-4 rounded-lg">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <p className="mt-2 text-sm text-gray-600">Ticket #{event.id}</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="text-2xl font-bold text-blue-600">Paid off</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketPage; // Updated export name
