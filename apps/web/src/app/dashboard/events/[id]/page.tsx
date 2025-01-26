'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchEventById } from '../../../../api/event';
import { getToken } from '../../../../api/dashboard';
import LoadingSpinner from '../../../../components/loading';

export default function EventDetail() {
  const { id } = useParams(); // Mengambil ID event dari URL
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const token = getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const eventId = Array.isArray(id) ? id[0] : id; // Mengkonversi id ke string

      try {
        const eventData = await fetchEventById(eventId, token);
        setEvent(eventData);
        setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#ccd6f6] flex items-center justify-center">
      {/* Detail Acara */}
      <div className="bg-[#112240] w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
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
                RP.{event.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tombol Back */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/dashboard/event-list')}
              className="px-6 py-3 bg-[#64ffda] text-[#0A192F] font-semibold rounded-md hover:bg-opacity-80"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
