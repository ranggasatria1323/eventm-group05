'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button'; // Button Import
import { Footer } from '@/components/Footer';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false }); // Lazy-loaded Chart

export default function Dashboard() {
  return (
    <div className="bg-[#ffffff] min-h-screen text-[#ccd6f6]">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-[#1A3A6D] border-b border-[#112240]">
        <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold text-[#ffffff]">EVENTASY</span>
            </Link>
          </div>
          <h1 className="font-bold text-lg text-[#ccd6f6]">EO Name</h1>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 w-64 mt h-screen pt-20 bg-[#112240] border-r border-[#112240] transition-transform transform -translate-x-full md:translate-x-0"
        aria-label="Sidebar"
      >
        <ul className="px-3 space-y-4">
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Event List', href: '/event-list' },
            { label: 'Attendant List', href: '/attendant-list' },
            { label: 'Home', href: '/' },
          ].map((item) => (
            <li key={item.label}>
              <Link href={item.href}>
                <Button variant="ghost" className="w-full justify-start text-[#ffffff] hover:bg-[#0A192F]  hover:text-white">
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/dashboard/create">
              <Button className="w-full bg-[#3c20b4] text-[#000000] hover:bg-opacity-80 hover:text-white">Create Event</Button>
            </Link>
          </li>
          <li>
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-[#ffffff] hover:bg-[#0A192F]  hover:text-white">
                Log Out
              </Button>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="p-4 sm:ml-64 ">
        <div className="p-6 bg-[#1A3A6D] border border-[#112240] rounded-lg mt-14">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Ticket Sold', desc: 'This month’s ticket sales.' },
              { title: 'Most Popular Event', desc: 'Highest attended event this month.' },
              { title: 'Revenue', desc: 'Revenue generated this month.' },
              { title: 'Total Seat Sold', desc: 'Seats sold this month.' },
            ].map((card) => (
              <div key={card.title} className="bg-[#0A192F] border border-[#112240] p-4 rounded-lg">
                <h5 className="text-lg font-bold mb-2 text-[#64ffda]">{card.title}</h5>
                <p className="text-sm text-[#8892b0]">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-10 ">
            <Chart
              type="bar"
              width="100%" // Full width responsive
              height={400} // Standard height
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
                  background: '#112240', // Chart background matching theme
                },
                colors: ['#64ffda', '#4a90e2', '#50e3c2', '#f5a623'], // Chart colors
                plotOptions: {
                  bar: { columnWidth: '45%' }, // Adjusted column width
                },
                xaxis: {
                  categories: ['Q1', 'Q2', 'Q3', 'Q4'], // Quarter labels
                  labels: { style: { colors: '#ccd6f6' } }, // X-axis labels color
                },
                legend: {
                  position: 'bottom',
                  labels: { colors: '#ccd6f6' }, // Legend text color
                },
                responsive: [
                  {
                    breakpoint: 768,
                    options: {
                      chart: {
                        height: 300, // Adjust height for smaller screens
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
    </div>
  );
}
