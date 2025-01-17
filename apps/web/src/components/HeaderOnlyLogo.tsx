import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Compass, Search } from 'lucide-react';

export function HeaderOnlyLogo() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#152455]">
      <div className="flex justify-center w-full h-16 items-center px-10">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENTASY</span>
        </Link>
      </div>
    </header>
  );
}
