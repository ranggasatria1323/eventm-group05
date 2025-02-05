'use client';

import { X, Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { removeToken } from '@/api/dashboard';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  userName: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
    };
  });

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/login'); // Redirect ke login setelah logout
  };

  return (
    <nav className="max-sm:flex sm:flex fixed top-0 z-50 w-full bg-[#0A192F] border-b border-[#112240]">
      <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard">
            <span className="text-xl font-bold text-[#64ffda]">EVENTASY</span>
          </Link>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="md:hidden absolute right-[10px] flex ml-[113px] bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Menu />
        </button>
        {/* Auth Drawer */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#112240] shadow-lg transition-transform duration-300 ${
              isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="bg-[#112240]">
              <ul className="px-3 space-y-4">
                <li>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/event-list">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Event List
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    >
                      Home
                    </Button>
                  </Link>
                </li>

                <li>
                  <Link href="/dashboard/create">
                    <Button className="w-full bg-[#64ffda] text-[#0A192F] font-semibold hover:bg-opacity-80 transition-colors duration-200">
                      Create Event
                    </Button>
                  </Link>
                </li>

                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F] transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Display user name or default */}
        <h1 className="max-sm:absolute md:absolute sm:right-[30px] max-sm:right-[70px] font-bold text-lg text-[#ccd6f6]">
          {userName}
        </h1>
      </div>
    </nav>
  );
}
