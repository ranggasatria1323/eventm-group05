"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button'; // Updated import path
import { Input } from './ui/input'; // Updated import path
import { Calendar, Compass, Search } from 'lucide-react';
import { setLoginCookie, removeLoginCookie, getLoginCookie } from '../../utils/cookies';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'; // Updated import path

const defaultAvatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAogMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAQIH/8QALRABAAIBAwIEBgEFAQAAAAAAAAECAwQRIRJRBTFBYSIjQnGBoWIyNIKRsRP/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A+qAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOWtFKza07RHnLN1GotmnbmKx6d/uC3l1mOnFfjt7eX+1W2tyzPERX8bq4CeNZm7xP8AjCSuutv8dKzHtwqANbDlplrFq/mPWEjGra1LdVZ2nvDU02aM2Pf6o4kEoAAAAAAAAAAAAEgq+IX2xRSPqn9M/wA1rxGd80R/FVUAAAAFrw+22a1e8KqxouNTHvEwUaQCAAAAAAAAAAASEgz/ABCPnRPeqqn1mSb5piYj4eIQKAAAACbSf3NPz/xC94sk48kWiInbuUa4QIAAAAAAAAAAAAMvWRtqLe/KFe12G95jJXbaK7TCioAAAAPWOOrJWI9ZeVrRYLTeuX6Y/ZRoesgIAAAAAAAAAAAAOWrFqzWfWNmPas1maz6Ts2VHxDFETGSvG/FgUwFAABrYKf8AnipWfSGfo6RfPG/lHOzUKACAAAAAAAAAAADoOKfiM/LrX1mXvWaicW0UmOqf0z7Wtad7WmZ9wcAUAAWNBO2o27xw0mLEzHkt6TU364pktvWfKZKL4CAAAAAAADxlyVx0m1p2gHs3Z2XW5Jn5cRSO/qgvkvf+u9rfeQaWTVYqfV1T2ryqZNbkvxSOiP2rC4OzMzzM7y4AAAAAAAJsWpyYtoieqO0reLWY77dW9J9/JnBg2a2i0bxMT9pdYsWtWd6zMT7Snpq81fO3XH8jBpiLBnpm324tHnWZSoAADM1lptmtvPFdoiABBPE7AKAAAAAAAAAAAAAAPVZmluqszE15hsVnesT3BAAB/9k="; // Replace with actual placeholder image URL

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    avatarUrl: defaultAvatar, // Set default avatar initially
  });

  useEffect(() => {
    const token = getLoginCookie();
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUser({
          name: response.data.name,
          avatarUrl: response.data.image || defaultAvatar, // Use placeholder if no image
        });
        setIsLoggedIn(true);
      })
      .catch(error => {
        console.error('Gagal mengambil data pengguna', error);
      });
    }
  }, []);

  const handleLogin = () => {
    setLoginCookie("your_token");
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}profile`, {
      headers: {
        Authorization: `Bearer your_token`,
      },
    })
    .then(response => {
      setUser({
        name: response.data.name,
        avatarUrl: response.data.image || defaultAvatar, // Use placeholder if no image
      });
      setIsLoggedIn(true);
    })
    .catch(error => {
      console.error('Gagal mengambil data pengguna', error);
    });
  };

  const handleLogout = () => {
    removeLoginCookie();
    setIsLoggedIn(false);
    setUser({
      name: '',
      avatarUrl: defaultAvatar, // Reset to default avatar on logout
    });
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-[#152455]">
      <div className="flex justify-end h-8 bg-blue-900 px-10">
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          <Link href="/about" className="text-gray-300 transition-colors hover:text-white">Tentang Loket</Link>
          <Link href="/creator" className="text-gray-300 transition-colors hover:text-white">Mulai Jadi Event Creator</Link>
          <Link href="/profile" className="text-gray-300 transition-colors hover:text-white">Biaya</Link>
          <Link href="/blog" className="text-gray-300 transition-colors hover:text-white">Blog</Link>
          <Link href="/contact" className="text-gray-300 transition-colors hover:text-white">Hubungi Kami</Link>
        </nav>
      </div>
      <div className="flex justify-between w-full h-16 items-center px-10">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center">
          <div className="relative w-full max-w-xl">
            <Input type="search" placeholder="Cari event seru di sini" className="w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none" />
          </div>
          <div className="relative w-full">
            <button className="absolute h-full items-center" style={{ bottom: '18px' }}>
              <Search className="p-2 bg-blue-500 rounded-r-sm" style={{ height: 36, width: 35 }} />
            </button>
          </div>
        </div>

        <div className="md:hidden flex-1">
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {isLoggedIn ? (
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center cursor-pointer">
                  <img 
                    src={user.avatarUrl} // Use user avatar or placeholder
                    alt="User Avatar" 
                    className="h-10 w-10 rounded-full border" 
                  />
                  <span className="text-white ml-2">{user.name}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="mt-2 bg-white rounded-lg shadow-lg p-4 w-48 text-left">
                <Link href="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">My Profile</Link>
                <Button onClick={handleLogout} variant="ghost" className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md">Logout</Button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/register">
                <Button variant="outline" className="text-black border-none hover:bg-blue-700 hover:text-white">Daftar</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleLogin}>Masuk</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-opacity-30 border-blue-900">
        <div className="flex ml-48 overflow-x-auto">
          <div className="flex h-10 items-center space-x-4 text-sm whitespace-nowrap">
            <Link href="/promo-indodana" className="text-gray-300 transition-colors hover:text-white">#Promo_Indodana</Link>
            <Link href="/loket-screen" className="text-gray-300 transition-colors hover:text-white">#LOKETScreen</Link>
            <Link href="/loket-promo" className="text-gray-300 transition-colors hover:text-white">#LOKET_Promo</Link>
            <Link href="/loket-attraction" className="text-gray-300 transition-colors hover:text-white">#LoketAttraction</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
