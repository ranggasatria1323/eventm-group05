'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchEventById } from '../../../api/event';
import { getToken } from '../../../api/dashboard';

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<string[]>([]);
  const [newReview, setNewReview] = useState<string>('');

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  const handleBuyTicket = () => {
    router.push(`/transaction?eventId=${id}`);
  };

  const handleAddReview = () => {
    if (newReview.trim() !== '') {
      setReviews((prevReviews) => [...prevReviews, newReview.trim()]);
      setNewReview('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <p>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="h-16"></div>

      {/* Kotak Buram */}
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white/70 backdrop-blur-lg rounded-lg shadow-lg">
        {/* Gambar dan Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gambar Acara */}
          <div className="flex justify-center items-center">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${event.image}`}
              alt={event.title}
              className="w-full max-w-lg h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Detail Acara */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-gray-700 mb-6">{event.description}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Date</h2>
                  <p className="text-black">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">
                    Location
                  </h2>
                  <p className="text-black">{event.location}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">
                    Event Type
                  </h2>
                  <p className="text-black">{event.event_type}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Price</h2>
                  <p className="text-black">
                    RP.{event.price.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <h2 className="text-sm font-semibold text-gray-500">
                    Created By
                  </h2>
                  <p className="text-black">{event.createdBy || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleBuyTicket}
                className="px-6 py-3 bg-[#ff5a5f] text-white font-semibold rounded-md hover:bg-opacity-90"
              >
                Buy Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-black mb-6">Reviews</h2>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
              className="w-full border border-gray-400 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]"
              placeholder="Write your review here..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddReview}
                className="px-6 py-3 bg-[#ff5a5f] text-white font-semibold rounded-md hover:bg-[#e04a4f] shadow-lg transition duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Display Reviews */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="mb-3 border-b pb-2">
                  <p className="text-gray-700">{review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
}
