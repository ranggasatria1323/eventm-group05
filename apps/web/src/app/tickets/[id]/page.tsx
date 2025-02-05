// // src/components/TicketDetail.tsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { getTicketDetail } from '../api';
// import { Ticket } from '../types';

// const TicketDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [ticket, setTicket] = useState<Ticket | null>(null);

//   useEffect(() => {
//     const fetchTicketDetail = async () => {
//       try {
//         const response = await getTicketDetail(Number(id));
//         setTicket(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch ticket details:', error);
//       }
//     };

//     fetchTicketDetail();
//   }, [id]);

//   if (!ticket) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Ticket Detail</h1>
//       <p>Event: {ticket.event.title}</p>
//       <p>Ticket Type: {ticket.ticketType}</p>
//       <p>Price: {ticket.price}</p>
//       <p>Status: {ticket.status}</p>
//       <p>Purchase Date: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
//     </div>
//   );
// };

// export default TicketDetail;
