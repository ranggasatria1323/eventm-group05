'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Menu, Search, SearchIcon, X } from 'lucide-react';
import { fetchUserProfile, loginUser, logoutUser } from '../api/header';
import { useRouter } from 'next/navigation'; // Import useRouter

const defaultAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_FXy4YZZT1e7rhjFmME4WVyH4VUwGdM0iQ&s';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; image: string }>({
    name: '',
    image: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerSearch, setIsDrawerSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); // Initialize useRouter

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirect to search results page
  };

  const handleLogin = async () => {
    const profile = await loginUser();
    if (profile) {
      setUser({
        name: profile.name,
        image: profile.image,
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
    setIsDrawerOpen(!isDrawerOpen);
    setIsDrawerSearch(!isDrawerSearch);
  };

  return (
    <header className="h-auto md:h-auto top-0 z-50 w-full border-b bg-[#152455]">
      <div
        id="tentang"
        className="md:flex justify-end h-8 bg-blue-900 px-4 md:px-10"
      ></div>
      <div className="flex flex-row md:flex-row justify-between w-full md:h-16 items-center px-4 md:px-10">
        <Link
          id="logo"
          href="/"
          className="md:mr-6 md:flex items-center space-x-2"
        >
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="hidden mt-2 md:flex items-center w-[1200px]"
        >
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Look for exciting events here"
              className="rounded-l-[5px] w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative bottom-[18px] ml-[255px] md:relative md:bottom-0 md:ml-0 w-full">
            <button
              type="submit"
              className="absolute h-full items-center"
              style={{ bottom: '18px' }}
            >
              <Search
                className="p-2 bg-blue-500 rounded-r-[5px]"
                style={{ height: 36, width: 35 }}
              />
            </button>
          </div>
        </form>

        <div className="md:ml-auto md:flex md:items-center md:space-x-2">
          {isLoggedIn ? (
            <>
              {/* Drawer */}
            <button style={{color:'white'}} className='md:hidden absolute right-[80px] top-4' onClick={() => setIsDrawerSearch(true)}>
                <div className="flex items-center cursor-pointer">
                  <SearchIcon />
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
                  isDrawerSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDrawerSearch(false)}
              >
                <div
                  className={`fixed right-0 top-0 h-auto w-full max-w-md bg-white shadow-lg transition-transform duration-300 ${
                    isDrawerSearch ? 'translate-y-0' : 'translate-y-[-100%]'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Search</h2>
                    <button
                      onClick={() => setIsDrawerSearch(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-6 flex flex-col space-y-4">
                  <form
          onSubmit={handleSubmit}
          className="mt-2 md:flex items-center w-[250px]"
        >
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Look for exciting events here"
              className="rounded-l-[5px] w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative bottom-[18px] ml-[240px] md:relative md:bottom-0 md:ml-0 w-full">
            <button
              type="submit"
              className="absolute h-full items-center"
              style={{ bottom: '18px' }}
            >
              <Search
                className="p-2 bg-blue-500 rounded-r-[5px]"
                style={{ height: 36, width: 35 }}
              />
            </button>
          </div>
        </form>
                  </div>
                </div>
              </div>
              {/* Drawer */}
              <button onClick={() => setIsDrawerOpen(true)}>
                <div className="mt-1 flex items-center cursor-pointer">
                  <img
                    src={
                      user.image
                        ? `${process.env.NEXT_PUBLIC_BASE_API_URL}images/${user.image}`
                        : defaultAvatar
                    }
                    alt="User Avatar"
                    className="h-10 w-10 max-sm:h-10 max-sm:mt-[3px] max-sm:w-10 max-sm:mr-1 rounded-full border object-cover"
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
              {/* Drawer */}
              <button
                style={{ color: 'white' }}
                className="md:hidden absolute right-[70px] top-2"
                onClick={() => setIsDrawerSearch(true)}
              >
                <div className="flex items-center cursor-pointer">
                  <SearchIcon />
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
                  isDrawerSearch
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDrawerSearch(false)}
              >
                <div
                  className={`fixed right-0 top-0 h-auto w-full max-w-md bg-white shadow-lg transition-transform duration-300 ${
                    isDrawerSearch ? 'translate-y-0' : 'translate-y-[-100%]'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Search</h2>
                    <button
                      onClick={() => setIsDrawerSearch(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-6 flex flex-col space-y-4">
                    <form
                      onSubmit={handleSubmit}
                      className="mt-2 md:flex items-center w-[250px]"
                    >
                      <div className="relative w-full">
                        <Input
                          type="search"
                          placeholder="Look for exciting events here"
                          className="rounded-l-[5px] w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="relative bottom-[18px] ml-[240px] md:relative md:bottom-0 md:ml-0 w-full">
                        <button
                          type="submit"
                          className="absolute h-full items-center"
                          style={{ bottom: '18px' }}
                        >
                          <Search
                            className="p-2 bg-blue-500 rounded-r-[5px]"
                            style={{ height: 36, width: 35 }}
                          />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex ml-[140px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <p className='hidden md:block'>Login</p>
                <Menu className='md:hidden' />
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
                    <h2 className="text-xl font-semibold">Login or Register</h2>
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
                        Login
                      </button>
                    </a>
                    <a href="/register">
                      <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium">
                        Register
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
          <div className="flex h-10 items-center space-x-4 text-sm whitespace-nowrap"></div>
        </div>
      </div>
    </header>
  );
};
