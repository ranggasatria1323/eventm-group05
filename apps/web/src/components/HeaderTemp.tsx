'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';
import { fetchUserProfile, loginUser, logoutUser } from '../api/header';
import { searchEvents } from '../api/event';

const defaultAvatar =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_FXy4YZZT1e7rhjFmME4WVyH4VUwGdM0iQ&s';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; image: string }>({
    name: '',
    image: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // State to hold search results

  const getSearch = async () => {
    try {
      const results = await searchEvents(searchQuery);
      setSearchResults(results); // Update state with search results
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

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
    getSearch();
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
  };

  return (
    <header className="h-auto md:h-auto top-0 z-50 w-full border-b bg-[#152455]">
      <div className="flex flex-row md:flex-row justify-between w-full md:h-16 items-center px-4 md:px-10">
        <Link id="logo" href="/" className="md:mr-6 md:flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>

        <form onSubmit={handleSubmit} className="hidden mt-2 md:flex items-center w-[1200px]">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Cari event seru di sini"
              className="rounded-l-[5px] w-full pl-4 bg-[#101c46] text-white placeholder:text-gray-400 border-none rounded-r-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative bottom-[18px] ml-[255px] md:relative md:bottom-0 md:ml-0 w-full">
            <button type='submit' className="absolute h-full items-center" style={{ bottom: '18px' }}>
              <Search className="p-2 bg-blue-500 rounded-r-[5px]" style={{ height: 36, width: 35 }} />
            </button>
          </div>
        </form>
      </div>

      {/* Display Search Results */}
      <div>
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((event, index) => (
              <li key={index}>{event.title}</li> // Display event titles
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};
