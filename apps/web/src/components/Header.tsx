'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, Compass, Search } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { fetchUserProfile, loginUser, logoutUser } from '../api/header';

const defaultAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_FXy4YZZT1e7rhjFmME4WVyH4VUwGdM0iQ&s';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string; image: string }>({
    email: '',
    image: defaultAvatar,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await fetchUserProfile();
      if (profile) {
        setUser({
          email: profile.email,
          image: profile.image || defaultAvatar,
        });
        setIsLoggedIn(true);
      }
    };
    fetchUser(); //Memanggil fungsi untuk menjalanakan fetchUser
  }, []);

  const handleLogin = async () => {
    const profile = await loginUser();
    if (profile) {
      setUser({
        email: profile.email,
        image: profile.image || defaultAvatar,
      });
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    const resetUser = logoutUser();
    setUser(resetUser);
    setIsLoggedIn(false);
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-[#152455]">
      <div className="flex justify-end h-8 bg-blue-900 px-10">
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          <Link
            href="/about"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Tentang Loket
          </Link>
          <Link
            href="/creator"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Mulai Jadi Event Creator
          </Link>
          <Link
            href="/profile"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Biaya
          </Link>
          <Link
            href="/blog"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Hubungi Kami
          </Link>
        </nav>
      </div>
      <div className="flex justify-between w-full h-16 items-center px-10">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        <div className="hidden md:flex flex-1 items-center">
          <div className="relative w-full max-w-xl">
            <Input
              type="search"
              placeholder="Cari event seru di sini"
              className="w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
            />
          </div>
          <div className="relative w-full">
            <button
              className="absolute h-full items-center"
              style={{ bottom: '18px' }}
            >
              <Search
                className="p-2 bg-blue-500 rounded-r-sm"
                style={{ height: 36, width: 35 }}
              />
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
            <>
            <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-blue-600 text-white hover:bg-blue-800 border-none"
                >
                  Dashboard
                </Button>
              </Link>
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center cursor-pointer">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_API_URL}images/${user.image}`|| defaultAvatar}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full border object-cover"
                  />
                  <div className="ml-2 text-left">
                    <span className="block font-medium text-white">
                      {user.email}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="mt-2 bg-white rounded-lg shadow-lg p-4 w-48 text-left">
                <Link
                  href="/profile"
                  className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  My Profile
                </Link>
                <Link href="/login">
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </Button>
                </Link>
              </PopoverContent>
            </Popover>
            </>
          ) : (
            <>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="text-black border-none hover:bg-blue-700 hover:text-white"
                >
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-opacity-30 border-blue-900">
        <div className="flex ml-48 overflow-x-auto">
          <div className="flex h-10 items-center space-x-4 text-sm whitespace-nowrap">
            <Link
              href="/promo-indodana"
              className="text-gray-300 transition-colors hover:text-white"
            >
              #Promo_Indodana
            </Link>
            <Link
              href="/loket-screen"
              className="text-gray-300 transition-colors hover:text-white"
            >
              #LOKETScreen
            </Link>
            <Link
              href="/loket-promo"
              className="text-gray-300 transition-colors hover:text-white"
            >
              #LOKET_Promo
            </Link>
            <Link
              href="/loket-attraction"
              className="text-gray-300 transition-colors hover:text-white"
            >
              #LoketAttraction
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
