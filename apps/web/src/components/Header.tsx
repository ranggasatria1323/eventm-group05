'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, Compass, Search, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { fetchUserProfile, loginUser, logoutUser } from '../api/header';

const defaultAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_FXy4YZZT1e7rhjFmME4WVyH4VUwGdM0iQ&s';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; image: string }>({
    name: '',
    image: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await fetchUserProfile();
      if (profile) {
        setUser({
          name: profile.name,
          image: profile.image,
        });
        setIsLoggedIn(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const profile = await loginUser();
    if (profile) {
      setUser({
        name: profile.name,
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
  };

  return (
    <header className="h-auto md:h-auto top-0 z-50 w-full border-b bg-[#152455]">
      <div
        id="tentang"
        className="md:flex justify-end h-8 bg-blue-900 px-4 md:px-10"
      >
        <nav className="flex items-center space-x-6 md:text-sm overflow-x-auto">
          <Link
            href="/about"
            className="text-gray-300 transition-colors hover:text-white "
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
            href="/transaction"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Transaksi
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
      <div className="flex flex-row md:flex-row justify-between w-full md:h-16 items-center px-4 md:px-10">
        <Link
          id="logo"
          href="/"
          className="md:mr-6 md:flex items-center space-x-2"
        >
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        <div className="hidden mt-2 md:flex items-center w-[1200px]">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Cari event seru di sini"
              className="rounded-l-[5px] w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
            />
          </div>
          <div className="relative bottom-[18px] ml-[255px] md:relative md:bottom-0 md:ml-0 w-full">
            <button
              className="absolute h-full items-center"
              style={{ bottom: '18px' }}
            >
              <Search
                className="p-2 bg-blue-500 rounded-r-[5px]"
                style={{ height: 36, width: 35 }}
              />
            </button>
          </div>
        </div>

        <div className="hidden md:hidden flex-1 ">
          <Button variant="ghost" size="icon" className="text-white ">
            <Search className="h-5 w-5 " />
          </Button>
        </div>

        <div className="md:ml-auto md:flex md:items-center md:space-x-2">
          {isLoggedIn ? (
            <>
              {/* <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-blue-600 max-sm:mr-[30px] flex-col text-white hover:bg-blue-800 border-none"
                >
                  Dashboard
                </Button>
              </Link>
              <Popover>
                <PopoverTrigger>
                  <div className="max-sm:absolute max-sm:right-0 max-sm:top-0 flex items-center cursor-pointer">
                    <img
                      src={ user.image ?
                        `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${user.image}` :
                        defaultAvatar
                      }
                      alt="User Avatar"
                      className="h-10 w-10 max-sm:h-9 max-sm:w-9 max-sm:mr-1 rounded-full border object-cover"
                    />
                    <div className="max-sm:hidden ml-2 text-left">
                      <span className="block font-medium text-white">
                        {user.name}
                      </span>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="mt-2 bg-white rounded-xl shadow-lg p-4 w-48 text-left">
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
              </Popover> */}
              <button onClick={() => setIsDrawerOpen(true)}>
                <div className="max-sm:absolute max-sm:right-0 max-sm:top-0 flex items-center cursor-pointer">
                  <img
                    src={
                      user.image
                        ? `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${user.image}`
                        : defaultAvatar
                    }
                    alt="User Avatar"
                    className="h-10 w-10 max-sm:h-9 max-sm:w-9 max-sm:mr-1 rounded-full border object-cover"
                  />
                  <div className="max-sm:hidden ml-2 text-left">
                    <span className="block font-medium text-white">
                      {user.name}
                    </span>
                  </div>
                </div>
              </button>
              {/* Auth Drawer */}
              <div
                className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
                  isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                <div
                  className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transition-transform duration-300 ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <img
                      src={
                        user.image
                          ? `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${user.image}`
                          : defaultAvatar
                      }
                      alt="User Avatar"
                      className="h-10 w-10 max-sm:h-9 max-sm:w-9 max-sm:mr-1 rounded-full border object-cover"
                    />
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-6 flex flex-col space-y-4">
                    <Link
                      href="/profile"
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/ticket"
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Ticket
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Dashboard
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
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex ml-[113px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Masuk
              </button>
              {/* Auth Drawer */}
              <div
                className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
                  isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                <div
                  className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transition-transform duration-300 ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Masuk atau Daftar</h2>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-6 flex flex-col space-y-4">
                    <a href="/login">
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                        Masuk
                      </button>
                    </a>
                    <a href="/register">
                      <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium">
                        Daftar
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex border-t border-opacity-30 border-blue-900">
        <div className="flex ml-4 md:ml-48 overflow-x-auto">
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
