'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { editEventProcess , fetchEventById  } from '@/api/event';

interface Event {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  event_type: string;
  price: number;
  stock: number,
  max_voucher_discount: number;
  category: string;
}

function EditEvent() {
  const [event, setEvent] = useState<Event>({
    title: "",
  description: "",
  image: "",
  location: "",
  date: "",
  event_type: "",
  price: 0,
  stock: 0,
  max_voucher_discount: 0,
  category: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  

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

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvent((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { title, value } = e.target;
    if (title === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '');
      setEvent((prev) => ({
        ...prev,
        [title]: numericValue,
      }));
      return;
    }
    setEvent((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', event.title || '');
      formData.append(
        'date',
        event.date ? new Date(event.date).toISOString() : '',
      );
      formData.append('location', event.location || '');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await editEventProcess(formData);
      if (response.status === 'success') {
        toast.success('Data berhasil disimpan!');
        const updatedData = await fetchEventById();
        if (updatedData.status === 'success') {
          setEvent(updatedData.data);
        }
      } else {
        toast.error('Gagal menyimpan data.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await fetchEventById();
        if (data.status === 'success') {
          setProfile({
            ...data.data,
            birthdate: data.data.birthdate
              ? new Date(data.data.birthdate).toISOString().split('T')[0]
              : null,
            remainingDays: data.data.remainingDays || 0,
          });
        }
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div classtitle="min-h-screen bg-gray-50">
      <div classtitle="max-w-4xl mx-auto py-8 px-4">
        <h1 classtitle="text-2xl font-bold text-gray-900 mb-8">
          Informasi Dasar
        </h1>
        <div classtitle="bg-white rounded-lg shadow p-6">
          {/* Profile Image */}
          <div classtitle="flex flex-col items-center mb-8">
            <div classtitle="relative group">
              <div classtitle="w-32 h-32 rounded-full overflow-hidden">
              { imageFile ? <img src={URL.createObjectURL(imageFile)} />  : profile?.image ?  <img src={`${process.env.NEXT_PUBLIC_BASE_API_URL}images/${profile?.image}`} /> : <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_G0N9CN_iM6-kvF6qpZFibDRcR-t25KVQQA&s' />
                  }
              </div>
              <label classtitle="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer group-hover:bg-blue-700 transition-colors">
                <Camera classtitle="w-5 h-5 text-white" />
                <input
                  type="file"
                  classtitle="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div classtitle="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Nama
              </label>
              <input
                type="text"
                id="title"
                title="title"
                value={profile.title}
                readOnly
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* location */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="location"
              >
                location
              </label>
              <input
                type="location"
                id="location"
                title="location"
                value={profile.location}
                readOnly
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipe Pengguna */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="description"
              >
                Tipe Pengguna
              </label>
              <input
                type="text"
                id="description"
                title="description"
                value={profile.description}
                readOnly
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="phoneNumber"
              >
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phoneNumber"
                title="phoneNumber"
                value={profile.phoneNumber || ''}
                onChange={handleInputChange}
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="birthdate"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="birthdate"
                title="birthdate"
                value={profile.birthdate || ''}
                onChange={handleInputChange}
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label
                classtitle="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="gender"
              >
                Jenis Kelamin
              </label>
              <select
                id="gender"
                title="gender"
                value={profile.gender || ''}
                onChange={handleInputChange}
                classtitle="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Points Section */}
          <div classtitle="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div classtitle="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 hover:shadow-md transition duration-200">
              <h2 classtitle="text-lg font-semibold text-blue-700 mb-2">
                Referral Code
              </h2>
              <p classtitle="text-sm text-gray-700">
                Gunakan kode ini untuk mengundang teman:
              </p>
              <div classtitle="mt-4 flex items-center justify-between">
                <span classtitle="text-xl font-bold text-blue-900">
                {profile.referralCode || "Tidak ada referral code"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.referralCode);
                    toast.success('Kode referral berhasil disalin!');
                  }}
                  classtitle="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Salin
                </button>
              </div>
            </div>
            <div classtitle="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 hover:shadow-md transition duration-200">
              <h2 classtitle="text-lg font-semibold text-green-700 mb-2">
                Points
              </h2>
              <p classtitle="text-sm text-gray-700">
                Anda memiliki jumlah poin berikut:
              </p>
              <div classtitle="mt-4 flex items-center">
                <span classtitle="text-3xl font-bold text-green-900">
                  {profile.points.toLocaleString()}
                </span>
                <span classtitle="ml-2 text-sm text-gray-500">poin</span>
              </div>
              <p classtitle="mt-2 text-sm text-gray-600">
                Sisa waktu sebelum poin kadaluarsa:{' '}
                <span classtitle="font-semibold text-green-800">
                  {profile.remainingDays} hari
                </span>
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div classtitle="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              classtitle="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditEvent;
