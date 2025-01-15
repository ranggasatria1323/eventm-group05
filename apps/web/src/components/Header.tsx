import Link from "next/link"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0A1128]">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-white">EVENT.WEB</span>
        </Link>

        {/* Search - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari event seru di sini"
              className="w-full pl-8 bg-white/10 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Mobile Search Button */}
        <div className="md:hidden flex-1">
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation - Hidden on mobile, visible on lg and up */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm">
          <Link href="/about" className="text-gray-300 transition-colors hover:text-white">
            Tentang Loket
          </Link>
          <Link href="/creator" className="text-gray-300 transition-colors hover:text-white">
            Mulai Jadi Event Creator
          </Link>
          <Link href="/pricing" className="text-gray-300 transition-colors hover:text-white">
            Biaya
          </Link>
          <Link href="/blog" className="text-gray-300 transition-colors hover:text-white">
            Blog
          </Link>
          <Link href="/contact" className="text-gray-300 transition-colors hover:text-white">
            Hubungi Kami
          </Link>
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" className="hidden sm:inline-flex text-white hover:bg-blue-700">
            <Link href="/create">Buat Event</Link>
          </Button>
          <Button variant="ghost" className="hidden sm:inline-flex text-white hover:bg-blue-700">
            <Link href="/explore">Jelajah</Link>
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-blue-700">
            <Link href="/register">Daftar</Link>
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </div>

      {/* Hashtag Navigation - Scrollable on mobile */}
      <div className="border-t border-blue-900">
        <div className="container overflow-x-auto">
          <div className="flex h-10 items-center space-x-4 text-sm whitespace-nowrap">
            <Link href="/promo-indodana" className="text-gray-300 transition-colors hover:text-white">
              #Promo_Indodana
            </Link>
            <Link href="/loket-screen" className="text-gray-300 transition-colors hover:text-white">
              #LOKETScreen
            </Link>
            <Link href="/loket-promo" className="text-gray-300 transition-colors hover:text-white">
              #LOKET_Promo
            </Link>
            <Link href="/loket-attraction" className="text-gray-300 transition-colors hover:text-white">
              #LoketAttraction
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

