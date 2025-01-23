'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Compass, Search } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginUser = () => {
    // Simulate a login action
    setIsLoggedIn(true);
  };

  const logoutUser = () => {
    // Simulate a logout action
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#152455]">
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
            href="/pricing"
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
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        {/* Search - Hidden on mobile, visible on md and up */}
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
              style={{ bottom: '18px' }}
              className="absolute h-full items-center"
            >
              <Search
                style={{ height: '36', width: '35' }}
                className="p-2 bg-blue-500 rounded-r-sm "
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Button */}
        <div className="md:hidden flex-1">
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation - Hidden on mobile, visible on lg and up */}

        {/* Actions */}
        <div className="ml-auto flex items-center space-x-2">
          <Link href="/dashboard/create-event">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-white hover:bg-blue-700  hover:text-white"
            >
              <Calendar />
              Buat Event
            </Button>
          </Link>
          <Link href="/Jelajah">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-white hover:bg-blue-700  hover:text-white"
            >
              <Compass />
              Jelajah
            </Button>
          </Link>
          {!isLoggedIn ? (
            <>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="text-black border-none hover:bg-blue-700 hover:text-white"
                >
                  Daftar
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={loginUser}
                >
                  Masuk
                </Button>
              </Link>
            </>
          ) : (
            <Button
              onClick={logoutUser}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Hashtag Navigation - Scrollable on mobile */}
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
}
