import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-[#152455] text-white">
      <div className="w-full py-8 px-0 md:px-0">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 p-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Tentang LOKET</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-gray-300 hover:text-white transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Event Creator</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                  Buat Event
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-gray-300 hover:text-white transition-colors">
                  Solusi
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Biaya
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Bantuan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Ikuti Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/facebook" className="text-gray-300 hover:text-white transition-colors">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="/twitter" className="text-gray-300 hover:text-white transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="/instagram" className="text-gray-300 hover:text-white transition-colors">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <center><img src="https://purwadhika.com/static/brand/logopwdk-text-white.png" /></center>
      <div className="mt-8 border-t border-blue-900 py-8 text-center text-sm text-gray-300">
          <p>© 2024 LOKET. All rights reserved.</p>
        </div>
    </footer>
  )
}

