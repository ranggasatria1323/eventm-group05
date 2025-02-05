import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Ticket',
  description: 'Generated by create next app',
};

export default function TicketRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
        {children}
      <Footer />
    </div>
     
  );
}
