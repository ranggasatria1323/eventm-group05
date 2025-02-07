import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}login`, {
      email,
      password,
    });

    if (response.status === 200) {
      const { token } = response.data.data;

      if (token) {
        Cookies.set('token', token, { expires: 1 / 24 }); // Simpan token di cookie
        toast.success('Login berhasil!');
        return { success: true, token };
      } else {
        console.error('Token tidak ditemukan dalam respons');
        toast.error('Login gagal: Token tidak ditemukan.');
        return { success: false };
      }
    } else {
      toast.error('Login gagal: Email atau password salah');
      return { success: false };
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat login:', error);
    toast.error('Terjadi kesalahan: Email atau password salah');
    return { success: false };
  }
};

export const registerUser = async (values: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}register`, values);
    const data = response.data;

    if (data.status === 'success') {
      // Simpan token di cookie
      Cookies.set('token', data.data.token, { expires: 1 / 24 });
      toast.success('Registrasi berhasil! Silakan pilih minat Anda.');
      return { success: true, token: data.data.token };
    } else {
      toast.error(data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage === 'Email sudah terdaftar') {
          toast.warn('Email sudah terdaftar. Silakan gunakan email lain.');
        } else {
          toast.error(
            errorMessage ||
              'Terjadi kesalahan saat registrasi. Silakan coba lagi.',
          );
        }
      } else if (error.request) {
        toast.error(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        );
      } else {
        toast.error('Terjadi kesalahan saat memproses permintaan Anda.');
      }
    } else {
      toast.error(
        'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti.',
      );
    }
    return { success: false };
  }
};
