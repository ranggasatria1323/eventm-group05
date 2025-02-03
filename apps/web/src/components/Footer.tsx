import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-[#152455] text-white">
      <center>
        <div className='mt-[30px] font-bold text-4xl' >EVENTASY</div>
      </center>
      <div className="mt-8 border-t border-blue-900 py-8 text-center text-sm text-gray-300">
        <p>© 2025 EVENTASY. All rights reserved.</p>
      </div>
    </footer>
  );
}
