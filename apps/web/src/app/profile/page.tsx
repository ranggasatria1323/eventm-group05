'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

interface UserProfile {
  name: string;
  email: string;
  userType: string;
  phoneNumber: string | null;
  birthdate: string | null;
  gender: string | null;
  image: string | File | null;
  referralCode: string;
  points: number;
}

function ProfilePage() {
  const [image, setimage] = useState<string>('/placeholder.svg');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    userType: '',
    phoneNumber: '',
    birthdate: '',
    gender: '',
    image: null,
    referralCode: '',
    points: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === 'success') {
        const data = response.data.data;
        console.log('Profile data retrieved:', data); // Log the retrieved data
        setProfile({
          ...data,
          birthdate: data.birthdate
            ? new Date(data.birthdate).toISOString().split('T')[0]
            : null,
        });
        if (data.image) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}${data.image}`;
          console.log('Constructed image URL:', imageUrl); // Log the constructed image URL
          setimage(imageUrl);
        }
      }
    } catch (error) {
      toast.error('Gagal mengambil data profil');
      console.error('Error fetching profile data:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Ukuran file harus kurang dari 1MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setimage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfile((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, ''); // Hanya menyimpan angka
      setProfile((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
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
        formData.append('image', profile.image); // Updated field name
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.status === 'success') {
        toast.success('Data berhasil disimpan!');
        getProfileData(); // Refresh profile data, including points
      } else {
        toast.error('Gagal menyimpan data.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data.');
      console.error('Error saving profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Informasi Dasar
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={
                    profile.image
                      ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${profile.image}`
                      : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQArwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgUGB//EAC0QAAICAQIFAwMEAwEAAAAAAAABAgMRBEEFEiExcRMyUSJCYVJigZEzQ6Ej/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APuIAAAAAAAABhtLu0BkEcrUuyyaO6T7JATgrerP5Hqy+cgWQQK57o3jan36eQJAYTzuZAAAAAAAAAAAAAAADILLPtiBvO1LourIJSb79TAAAAAAAAAA2jJx7f0TQsUvJXAFwENVmejJgAAAAAAAAABrOXLFsDS6ePpX8kBlvLMAAAAI7rq6VmyWPxuRa3U+hXhf5Jdl8fk5EpObcpttvu2B0pcTrXtrk/LwZjxOp+6E4/8ATl4AHfrshbHmrkpLfGxscCqyVM+auTizs6W+N9XMu66SXwBMAABYqllde5XMxfK8oC2DCeUmZAAAAAABDe+yJirY8zYGoAAAB9n4A4ept9a+c9s4XgiCAAAACzw6309SltLoysb0Z9evHfmQHeAAAAAT0PMcfBKV6XiaWzLAAAAAABhlV9W2WmVAAAAAADh6mt1aicHsyI7Gt03rwzDHqLtnc5EoyjJxksNPswMAAAWeH1uzVRa7Q+pkEISskowWZPY7Ol0609XLn6n1kwJgAAAAG1fvXktFWHvXktAAAAAABlWXvl5LRXuWJZ+QIwAAAAAiv09V6xZHL2e5LJqKzJ4W7exUs4hTH2Zn47ARS4XF+21ryjaPDIJ/XZJ+FgjfE5fbUl5ZmPE391S/hgXqqa6Y4rjj87m5Vq19E+km4P8Aci0mms7bfkAAAAAA3qWZoskNC65JgAAAAAAR3RzDwSB9gKYN7I8svwaACHVamOnhmXWT7RN7rY01Ssn2RxLbJW2Oc+7AzfdZfLNksraOyIwAAAAE2n1Nmnf0vMf0t9CEAd2i6F8OaH8rdEhw9NfOi1SXb7l8o7cJKcIyj1i1lMDJlGCSqHNLOyAlrjyxS3NwAAAAAAAAANZx5lgrSjystms4KXkDh8VtzOFa7LqygW+JVW16mcrIvll7XsVAAAAAAAAAB0+F25rlU/teUcw6HCabZ3c6TVeGnIDpwi5MsxiorCMRiorCNgAAAAAAAAAAAAADWUIzi4zipJ90zmanhEX100uX9suq/s6oA8xdpb6X9dcl+V1RCj1pDPT02P8A9KoS/LQHmAeifDtI/wDSv7YXDtIuvop+WwPO7/n4LFGi1N3traX6pdEeghRTX/jqhHxElA5ul4VXW1K6XqP42OikkkksJbIyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q=='
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer group-hover:bg-blue-700 transition-colors">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: 'Nama',
                name: 'name',
                value: profile.name,
                readOnly: true,
              },
              {
                label: 'Email',
                name: 'email',
                value: profile.email,
                readOnly: true,
              },
              {
                label: 'Tipe Pengguna',
                name: 'userType',
                value: profile.userType,
                readOnly: true,
              },
              {
                label: 'Nomor Telepon',
                name: 'phoneNumber',
                value: profile.phoneNumber,
                readOnly: false,
                type: 'tel',
              },
              {
                label: 'Tanggal Lahir',
                name: 'birthdate',
                value: profile.birthdate,
                readOnly: false,
                type: 'date',
              },
              {
                label: 'Jenis Kelamin',
                name: 'gender',
                value: profile.gender,
                readOnly: false,
                type: 'select',
              },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.value || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={field.readOnly}
                  >
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    value={field.value || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly={field.readOnly}
                    disabled={field.readOnly}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Points Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Referral Code
              </h2>
              <p className="text-sm text-gray-700">
                Gunakan kode ini untuk mengundang teman:
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-900">
                  {profile.referralCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.referralCode);
                    toast.success('Kode referral berhasil disalin!');
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 hover:shadow-md transition duration-200">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                Points
              </h2>
              <p className="text-sm text-gray-700">
                Anda memiliki jumlah poin berikut:
              </p>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-green-900">
                  {profile.points.toLocaleString()}
                </span>
                <span className="ml-2 text-sm text-gray-500">poin</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProfilePage;
