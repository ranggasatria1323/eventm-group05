'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  profileImage: string | File;
}

function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    profileImage: ''
  });

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    try {
      const response = await axios.get('/api/profile'); // Adjust to your actual API
      const data = response.data;
      setProfile(data);
      if (typeof data.profileImage === 'string') {
        setProfileImage(data.profileImage);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfile(prev => ({
        ...prev,
        profileImage: file // Save file object for upload
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('birthDate', profile.birthDate);
    formData.append('gender', profile.gender);

    if (profile.profileImage instanceof File) {
      formData.append('profileImage', profile.profileImage);
    }

    try {
      const response = await axios.post('/api/profile/update', formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Informasi Dasar</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={profileImage}
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
            <p className="text-sm text-gray-500 mt-2">
              Ukuran maksimum file: 1MB. Format: JPG, PNG
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={profile.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
