import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Timer, Search } from 'lucide-react';

// Mock data for tickets
const tickets = [
  {
    id: "T-1001",
    title: "Website Performance Issues",
    status: "open",
    priority: "high",
    created: "2024-03-15",
    dueDate: "2024-03-20",
  },
  {
    id: "T-1002",
    title: "Login Authentication Error",
    status: "in-progress",
    priority: "medium",
    created: "2024-03-14",
    dueDate: "2024-03-19",
  },
  {
    id: "T-1003",
    title: "Update User Documentation",
    status: "completed",
    priority: "low",
    created: "2024-03-13",
    dueDate: "2024-03-18",
  },
  {
    id: "T-1004",
    title: "Mobile App Crash Report",
    status: "open",
    priority: "high",
    created: "2024-03-12",
    dueDate: "2024-03-17",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'open':
      return <AlertCircle className="w-5 h-5 text-blue-600" />;
    case 'in-progress':
      return <Timer className="w-5 h-5 text-blue-400" />;
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
    default:
      return <Clock className="w-5 h-5 text-blue-300" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-blue-50 text-blue-600';
    case 'low':
      return 'bg-white text-blue-500 border border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function MyTickets() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-blue-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white">My Tickets</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          {ticket.title}
                        </div>
                        <div className="text-sm text-blue-500">{ticket.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(ticket.status)}
                      <span className="ml-2 text-sm text-blue-700 capitalize">
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {ticket.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {ticket.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyTickets;