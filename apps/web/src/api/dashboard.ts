import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getToken = () => {
  return Cookies.get('token');
};

export const removeToken = () => {
  Cookies.remove('token');
};

interface UserData {
  name: string;
  userType: string;
  userId: string; // Pastikan userId termasuk dalam tipe yang dikembalikan
}

export const fetchUserData = async (
  token: string,
): Promise<UserData | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
      },
    });

    console.log('Response:', response.data);
    const userData = response.data?.data;
    console.log('Parsed userData:', userData);

    if (
      response.status === 200 &&
      userData.name &&
      userData.userType &&
      userData.id
    ) {
      return {
        name: response.data.data.name,
        userType: response.data.data.userType,
        userId: response.data.data.id,
      };
    }

    return null; // Data tidak ditemukan
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error);
    return null; // Gagal mengambil data pengguna
  }
};

// Fungsi baru untuk mengambil data transaksi
export const fetchTransactions = async (
  token: string,
): Promise<any[] | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}transactions`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
      },
    });
    console.log('status transaksi:', response.status);
    console.log('Response transaksi:', response.data);

    if (response.status === 200) {
      console.log('Status 200: OK');
    } else {
      console.warn('Status bukan 200:', response.status);
    }

    if (response.data) {
      console.log('Response data ada:', response.data);
      return response.data
    } else {
      console.warn('Response data tidak ada');
    }

    // if (response.data) {
    //   console.log('Data transaksi:', response.data.data); // Tambahkan log ini
    //   return response.data.data; // Asumsikan bahwa data transaksi ada di dalam response.data.data
    // } else {
    //   console.warn(
    //     'Tidak ada data transaksi yang ditemukan dalam response.data.data',
    //   );
    // }

    return null; // Data tidak ditemukan
  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error);
    return null; // Gagal mengambil data transaksi
  }
};
