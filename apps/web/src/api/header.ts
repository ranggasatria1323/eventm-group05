import axios from 'axios';
import { getLoginCookie, setLoginCookie, removeLoginCookie } from './../utils/cookies'; // Sesuaikan path

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const defaultAvatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAogMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAQIH/8QALRABAAIBAwIEBgEFAQAAAAAAAAECAwQRIRJRBTFBYSIjQnGBoWIyNIKRsRP/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A+qAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOWtFKza07RHnLN1GotmnbmKx6d/uC3l1mOnFfjt7eX+1W2tyzPERX8bq4CeNZm7xP8AjCSuutv8dKzHtwqANbDlplrFq/mPWEjGra1LdVZ2nvDU02aM2Pf6o4kEoAAAAAAAAAAAAEgq+IX2xRSPqn9M/wA1rxGd80R/FVUAAAAFrw+22a1e8KqxouNTHvEwUaQCAAAAAAAAAAASEgz/ABCPnRPeqqn1mSb5piYj4eIQKAAAACbSf3NPz/xC94sk48kWiInbuUa4QIAAAAAAAAAAAAMvWRtqLe/KFe12G95jJXbaK7TCioAAAAPWOOrJWI9ZeVrRYLTeuX6Y/ZRoesgIAAAAAAAAAAAAOWrFqzWfWNmPas1maz6Ts2VHxDFETGSvG/FgUwFAABrYKf8AnipWfSGfo6RfPG/lHOzUKACAAAAAAAAAAADoOKfiM/LrX1mXvWaicW0UmOqf0z7Wtad7WmZ9wcAUAAWNBO2o27xw0mLEzHkt6TU364pktvWfKZKL4CAAAAAAADxlyVx0m1p2gHs3Z2XW5Jn5cRSO/qgvkvf+u9rfeQaWTVYqfV1T2ryqZNbkvxSOiP2rC4OzMzzM7y4AAAAAAAJsWpyYtoieqO0reLWY77dW9J9/JnBg2a2i0bxMT9pdYsWtWd6zMT7Snpq81fO3XH8jBpiLBnpm324tHnWZSoAADM1lptmtvPFdoiABBPE7AKAAAAAAAAAAAAAAPVZmluqszE15hsVnesT3BAAB/9k="; // Replace with actual placeholder image URL


export const fetchUserProfile = async () => {
  const token = getLoginCookie();
  if (!token) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      email: response.data.email,
      image: response.data.image || null, // Gunakan placeholder jika `image` kosong
    };
  } catch (error) {
    console.error('Gagal mengambil data pengguna', error);
    return null;
  }
};

export const loginUser = async () => {
  try {
    // Simpan token login ke cookie
    setLoginCookie('your_token');

    const response = await axios.get(`${API_BASE_URL}profile`, {
      headers: {
        Authorization: `Bearer your_token`,
      },
    });

    return {
      email: response.data.email,
      image: response.data.image || null,
    };
  } catch (error) {
    console.error('Gagal mengambil data pengguna setelah login', error);
    return null;
  }
};

export const logoutUser = () => {
  removeLoginCookie();
  return {
    email: '',
    image: defaultAvatar, // Reset ke avatar default setelah logout
  };
};
