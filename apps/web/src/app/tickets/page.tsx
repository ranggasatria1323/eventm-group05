"use client"

import React, { useEffect, useState } from 'react';
import { getTickets } from '@/api/transaction'; // Import API call
import { useRouter } from 'next/navigation';

interface Ticket {
  id: number;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
  };
  ticketType: string;
  transactionStatus: string;
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getTickets(ticketId);

        // Filter hanya tiket dengan transaksi sukses
        const successfulTickets = response.data.data.filter(
          (ticket: Ticket) => ticket.transactionStatus === 'success'
        );

        setTickets(successfulTickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-700 text-center">My Tickets</h1>

        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading tickets...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No tickets available.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="p-4 border rounded-md shadow-md bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">{ticket.event.title}</h3>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(ticket.event.date).toLocaleDateString('id-ID')}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {ticket.event.location}
                </p>
                <p className="text-gray-600">
                  <strong>Ticket Type:</strong> {ticket.ticketType}
                </p>
                <button
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  View Ticket
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TicketList;
