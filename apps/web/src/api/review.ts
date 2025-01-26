import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// api/review.ts
export const createReview = async (eventId: string,comment:string, rating: number, token: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}reviews`,
        { eventId, comment, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Review Created:", response.data);
      return response.data.data;
    } catch (error:any) {
      console.error("Failed to submit review:", error.response?.data || error);
      throw error;
    }
  };
  
  export const fetchReviews = async (eventId: string, token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}reviews/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Reviews Fetched:", response.data);
      return response.data.data || [];
    } catch (error:any) {
      console.error("Failed to fetch reviews:", error.response?.data || error);
      return [];
    }
  };
  