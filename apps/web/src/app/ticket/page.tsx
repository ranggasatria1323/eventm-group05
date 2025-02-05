import React from 'react';
import { Calendar, MapPin, Clock, User, Ticket, QrCode } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Music Festival 2024</h1>
          <p className="text-sm opacity-90 mt-1">Thank you for your purchase!</p>
        </div>
        
        {/* Ticket Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">March 15, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">7:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-semibold">Central Park Arena</p>
                    <p className="text-sm text-gray-500">123 Main Street, City</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ticket Holder</p>
                    <p className="font-semibold">John Doe</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ticket Type</p>
                    <p className="font-semibold">VIP Access</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Section - QR Code */}
            <div className="flex flex-col items-center justify-center p-4 border-l border-gray-200">
              <div className="bg-gray-100 p-4 rounded-lg">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <p className="mt-2 text-sm text-gray-600">Ticket #12345678</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-2xl font-bold text-blue-600">Rp. 500.000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Purchase Date</p>
                <p className="text-sm font-semibold">March 1, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;