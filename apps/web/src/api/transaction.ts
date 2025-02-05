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
    const token = Cookies.get("token") || ""; // Ambil token dari cookies

    const response = await axios.get(`${API_BASE_URL}discounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export const getUserProfile = async () => {
  try {
    const token = Cookies.get("token") || ""; // Ambil token dari cookies

    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data; // Pastikan ini mengembalikan data profil pengguna termasuk userType
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};

export const createTransaction = async (transactionData: any) => {
  try {
    const token = Cookies.get("token") || ""; // Ambil token dari cookies
    console.log("Token:", token); // Log token untuk debugging

    const response = await axios.post(`${API_BASE_URL}transactions`, transactionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pastikan token dikirim
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const getTickets = async (ticketId: number) => {
  try {
    const token = Cookies.get("token") || ""; // Ambil token dari cookies
    console.log("Token:", token); // Log token untuk debugging

    const response = await axios.get(`${API_BASE_URL}tickets/${ticketId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pastikan token dikirim
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};