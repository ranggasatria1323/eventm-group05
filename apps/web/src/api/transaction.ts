import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Fungsi untuk mengambil event berdasarkan ID
export const fetchEventById = async (id: string) => {
  try {
    const token = Cookies.get("token") || ""; // Ambil token dari cookies

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
    console.error("Failed to fetch event details:", error);
    return null;
  }
};

// Fungsi untuk mengambil daftar diskon
export const fetchDiscounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}profile`);

    if (response.status === 200) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch discounts:", error);
    return [];
  }
};

// Fungsi untuk mengambil user points
export const fetchUserPoints = async () => {
  try {
    const token = Cookies.get("token") || ""; // Ambil token dari cookies

    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch user points:", error);
    return null;
  }
};
