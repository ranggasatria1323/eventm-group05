'use client';

import Link from 'next/link';

interface NavbarProps {
  userName: string;
}

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0A192F] border-b border-[#112240]">
      <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard">
            <span className="text-xl font-bold text-[#64ffda]">EVENTASY</span>
          </Link>
        </div>
        {/* Display user name or default */}
        <h1 className="font-bold text-lg text-[#ccd6f6]">{userName}</h1>
      </div>
    </nav>
  );
}
