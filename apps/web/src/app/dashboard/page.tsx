'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './../../components/ui/button';
import Navbar from './../../components/navbar-dashboard';
import { getToken, removeToken, fetchUserData } from './../../api/dashboard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {

  const router = useRouter();
  const [userName, setUserName] = useState<string>('EO Name');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getToken();

      if (!token) {
        router.push('/login'); // Redirect ke login jika tidak ada token
        return;
      }

      const userData = await fetchUserData(token);
      if (userData) {
        if (userData.userType !== 'Event Organizer') {
          router.push('/unauthorized'); // Redirect jika bukan Event Organizer
          return;
        }
        setIsLoggedIn(true);
        setUserName(userData.name || 'EO Name');
      } else {
        router.push('/login');
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/login'); // Redirect ke login setelah logout
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
          </aside>

          <main className="p-4 sm:ml-64 mt-5">
            <div className="p-6 bg-[#112240] border border-[#112240] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Total Ticket Sold',
                    desc: 'This month’s ticket sales.',
                  },
                  {
                    title: 'Most Popular Event',
                    desc: 'Highest attended event this month.',
                  },
                  { title: 'Revenue', desc: 'Revenue generated this month.' },
                  { title: 'Total Seat Sold', desc: 'Seats sold this month.' },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-[#0A192F] border border-[#112240] p-4 rounded-lg"
                  >
                    <h5 className="text-lg font-bold mb-2 text-[#64ffda]">
                      {card.title}
                    </h5>
                    <p className="text-sm text-[#8892b0]">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="mt-10">
                <Chart
                  type="bar"
                  width="100%"
                  height={400}
                  series={[
                    {
                      name: 'Event X',
                      data: [190, 200, 322, 343],
                    },
                    {
                      name: 'Event Y',
                      data: [565, 697, 563, 878],
                    },
                    {
                      name: 'Event A',
                      data: [423, 200, 344, 343],
                    },
                    {
                      name: 'Event Z',
                      data: [565, 697, 563, 378],
                    },
                  ]}
                  options={{
                    chart: {
                      toolbar: { show: true },
                      background: '#112240',
                    },
                    colors: ['#64ffda', '#4a90e2', '#50e3c2', '#f5a623'],
                    plotOptions: {
                      bar: { columnWidth: '45%' },
                    },
                    xaxis: {
                      categories: ['Q1', 'Q2', 'Q3', 'Q4'],
                      labels: { style: { colors: '#ccd6f6' } },
                    },
                    legend: {
                      position: 'bottom',
                      labels: { colors: '#ccd6f6' },
                    },
                    responsive: [
                      {
                        breakpoint: 768,
                        options: {
                          chart: {
                            height: 300,
                          },
                          legend: {
                            position: 'bottom',
                          },
                        },
                      },
                    ],
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
