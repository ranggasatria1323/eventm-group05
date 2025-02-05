'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './../../components/ui/button';
import Navbar from './../../components/navbar-dashboard';
import { getToken, removeToken, fetchUserData, fetchTransactions } from './../../api/dashboard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Transaction {
  eventName: string;
  totalTicketsSold: number;
  createdBy: string; // ID dari pengguna yang membuat event
}

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('EO Name');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTicketSold, setTotalTicketSold] = useState<number>(0);
  const [mostPopularEvent, setMostPopularEvent] = useState<string>('No Data');
  const [chartData, setChartData] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getToken();
      console.log('token', token);

      if (!token) {
        router.push('/login');
        return;
      }

      const userData = await fetchUserData(token);
      console.log('userData', userData);
      if (userData) {
        if (userData.userType !== 'Event Organizer') {
          router.push('/unauthorized');
          return;
        }
        setIsLoggedIn(true);
        setUserName(userData.name || 'EO Name');
        setUserId(userData.userId); // Simpan userId dari pengguna yang login

        const transactionsData = await fetchTransactions(token);
        console.log('transactionsData', transactionsData);
        if (transactionsData) {
          
          setTransactions(transactionsData);
          processTransactionData(transactionsData);
        }
      } else {
        router.push('/login');
      }
    };

    checkAuthStatus();
  }, [router]);

  const processTransactionData = (data: Transaction[]) => {
    if (data.length === 0) return;

    // Hitung total tiket terjual
    const totalTickets = data.reduce((sum, index) => sum + index.totalTicketsSold, 0);

    // Hitung event dengan penjualan tiket tertinggi
    const eventSales = data.reduce((acc, txn) => {
      acc[txn.eventName] = (acc[txn.eventName] || 0) + txn.totalTicketsSold;
      return acc;
    }, {} as Record<string, number>);

    const sortedEvents = Object.entries(eventSales).sort((a, b) => b[1] - a[1]);

    // Ambil top 4 event berdasarkan penjualan tiket
    const top4Events = sortedEvents.slice(0, 4);

    // Persiapkan data untuk chart
    const eventNames = top4Events.map(([eventName]) => eventName);
    const eventSalesData = top4Events.map(([eventName, ticketsSold]) => ({
      name: eventName,
      data: [ticketsSold],
    }));

    setTotalTicketSold(totalTickets);
    setMostPopularEvent(top4Events[0]?.[0] || 'No Data');
    setChartData(eventSalesData);
    setCategories(eventNames);
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <div className="bg-[#0A192F] min-h-screen text-[#ccd6f6]">
      {isLoggedIn ? (
        <>
          <Navbar userName={userName} />
          <aside
            className="fixed top-0 left-0 w-64 h-screen pt-20 bg-[#112240] border-r border-[#112240] transition-transform transform -translate-x-full md:translate-x-0"
            aria-label="Sidebar"
          >
            <ul className="px-3 space-y-4">
              <li>
                <Link href="/dashboard">
                  <Button className="w-full text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F]">
                    Dashboard
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/event-list">
                  <Button className="w-full text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F]">
                    Event List
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <Button className="w-full text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F]">
                    Home
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create">
                  <Button className="w-full bg-[#64ffda] text-[#0A192F] font-semibold">
                    Create Event
                  </Button>
                </Link>
              </li>
              <li>
                <Button className="w-full text-[#ccd6f6] bg-transparent hover:bg-[#64ffda] hover:text-[#0A192F]" onClick={handleLogout}>
                  Log Out
                </Button>
              </li>
            </ul>
          </aside>

          <main className="p-4 sm:ml-64 mt-5">
            <div className="p-6 bg-[#112240] border border-[#112240] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0A192F] border border-[#112240] p-4 rounded-lg">
                  <h5 className="text-lg font-bold mb-2 text-[#64ffda]">Total Ticket Sold</h5>
                  <p className="text-sm text-[#8892b0]">{totalTicketSold}</p>
                </div>
                <div className="bg-[#0A192F] border border-[#112240] p-4 rounded-lg">
                  <h5 className="text-lg font-bold mb-2 text-[#64ffda]">Most Popular Event</h5>
                  <p className="text-sm text-[#8892b0]">{mostPopularEvent}</p>
                </div>
              </div>

              <div className="mt-10">
                <Chart
                  type="bar"
                  width="100%"
                  height={400}
                  series={chartData}
                  options={{
                    chart: { toolbar: { show: true }, background: '#112240' },
                    colors: ['#64ffda', '#4a90e2', '#50e3c2', '#f5a623'],
                    plotOptions: { bar: { columnWidth: '45%' } },
                    xaxis: { categories, labels: { style: { colors: '#ccd6f6' } } },
                    legend: { position: 'bottom', labels: { colors: '#ccd6f6' } },
                  }}
                />
              </div>
            </div>
          </main>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen text-[#ccd6f6]">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
