import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


export const getToken = () => {
  return Cookies.get('token');
};

export const removeToken = () => {
  Cookies.remove('token');
};


export const fetchUserData = async (token :any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
      },
    });

    if (response.status === 200 && response.data?.data?.name) {
      return { name: response.data.data.name };
    }

    return null; // Data tidak ditemukan
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error);
    return null; // Gagal mengambil data pengguna
  }
};
