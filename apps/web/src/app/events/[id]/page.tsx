'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchEventById } from '../../../api/event';
import { getToken } from '../../../api/dashboard';
import { createReview, fetchReviews } from './../../../api/review';
import { getProfileData } from '@/api/profile';

interface Review {
  comment: string;
  rating: number;
  user: {
    name: string;
    image: string | File | null;
  };
  createdAt: string; // Tambahkan createdAt untuk tanggal post
}

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

interface UserProfile {
  image: string | File | null;
}

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5); // Default rating
  const [profile, setProfile] = useState<UserProfile>({
    image:null
  });

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
        const eventReviews = await fetchReviews(eventId, token);
        const eventProfile = await getProfileData();

        setEvent(eventData);
        setReviews(eventReviews);
        setProfile(eventProfile)
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  const isEventExpired = event ? new Date(event.date) < new Date() : false;

  const handleAddReview = async () => {
    const token = getToken();

    if (!token) {
      router.push('/login');
      return;
    }

    if (newReview.trim() === '' || newRating < 1 || newRating > 5) {
      alert('Please enter a valid review and rating (1-5).');
      return;
    }

    try {
      const response = await createReview(event!.id.toString(), newReview, newRating, token);
      const eventReviews = await fetchReviews(event!.id.toString(), token);
      setReviews(eventReviews);

      setNewReview('');
      setNewRating(5);
      
    } catch (error) {
      console.error('Failed to add review:', error);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${event.image}`}
              alt={event.title}
              className="w-full max-w-lg h-[300px] rounded-lg shadow-lg object-cover"
            />
          </div>

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
                  {!event.price ? "Free" : `Rp ${event.price.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Stock</h2>
                  <p className="text-black">
                  {event.stock}
                  </p>
                </div>
                <div>
                <h2 className="text-sm font-semibold text-gray-500">
                    Created By
                  </h2>
                  <p className="text-black">{event.createdBy || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800"
              >
                Back to Homepage
              </button>
              {!isEventExpired ? (
                <button
                  onClick={() => router.push(`/transaction/${event?.id}`)}
                  className="px-6 py-3 bg-[#ff5a5f] text-white font-semibold rounded-md hover:bg-opacity-90"
                >
                  Buy Ticket
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-md cursor-not-allowed"
                >
                  Event Ended
                </button>
              )}
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
            <div className="mt-4">
              <label htmlFor="rating" className="text-gray-700">
                Rating:
              </label>
              <select
                id="rating"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="ml-2 p-2 border rounded-md focus:ring-2 focus:ring-[#ff5a5f]"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddReview}
                className="px-6 py-3 bg-[#ff5a5f] text-white font-semibold rounded-md hover:bg-opacity-90 shadow-lg transition duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
  {reviews.length > 0 ? (
    reviews.map((review, index) => (
      <div key={index} className="flex items-center mb-3 border-b pb-2">
        {/* ✅ Gunakan gambar default jika review.user.image tidak ada */}
        <img
          className="h-10 w-10 rounded-full border object-cover mr-3"
          src={review.user.image 
            ? `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${review.user.image}` 
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_FXy4YZZT1e7rhjFmME4WVyH4VUwGdM0iQ&s"}
          alt={review.user.name || "Anonymous User"}
        />
        
        <div>
          <p className="text-gray-700">{review.comment}</p>
          <p className="text-sm text-gray-500">
            Rating: {review.rating} | By {review.user.name || "Anonymous"} |{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
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