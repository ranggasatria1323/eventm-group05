import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getProfileData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error('Gagal mengambil data profil');
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

export const updateProfileData = async (profile:any) => {
  try {
    const token = Cookies.get('token');
    const formData = new FormData();
    formData.append('phoneNumber', profile.phoneNumber || '');
    formData.append(
      'birthdate',
      profile.birthdate ? new Date(profile.birthdate).toISOString() : '',
    );
    formData.append('gender', profile.gender || '');
    if (profile.image instanceof File) {
      formData.append('image', profile.image);
    }

    const response = await axios.put(`${API_BASE_URL}profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan data.');
    console.error('Error saving profile data:', error);
    throw error;
  }
};
