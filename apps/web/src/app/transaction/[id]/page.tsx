'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchDiscounts, fetchEventById, fetchUserPoints } from '@/api/transaction';

interface PaymentMethod {
  id: string;
  name: string;
}

const formatRupiah = (amount: number) => {
  return amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

const paymentMethods: PaymentMethod[] = [
  { id: "dana", name: "Dana" },
  { id: "shopeepay", name: "ShopeePay" },
  { id: "gopay", name: "GoPay" },
  { id: "mandiri", name: "Mandiri" },
  { id: "bsi", name: "BSI" },
  { id: "bca", name: "BCA" },
  { id: "bri", name: "BRI" },
  { id: "linkaja", name: "LinkAja" },
];

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id"); // Get event ID from URL
  const [eventDetail, setEventDetail] = useState<any>(null);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [useAllPoints, setUseAllPoints] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null); // Added state for payment method

  // Fetch data from API when the component first renders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!eventId) {
          console.error("Event ID not found in URL");
          return;
        }

        // Fetch all data in parallel
        const [eventData, discountData, pointsData] = await Promise.all([
          fetchEventById(eventId),
          fetchDiscounts(),
          fetchUserPoints(),
        ]);

        if (eventData) {
          setEventDetail(eventData);
          setTotalPrice(eventData.price);
        }
        
        setDiscounts(discountData);
        setUserPoints(pointsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Calculate total price based on ticket quantity, discount, and points
  useEffect(() => {
    if (eventDetail) {
      let basePrice = eventDetail.price * ticketQuantity;

      // If a discount is selected
      if (selectedDiscount) {
        const discount = discounts.find((d) => d.id === selectedDiscount);
        if (discount) {
          if (discount.type === "Percentage") {
            basePrice -= (discount.value / 100) * basePrice;
          } else if (discount.type === "Fixed") {
            basePrice -= discount.value;
          }
        }
      }

      // Deduct user points if the checkbox is active
      if (userPoints && useAllPoints) {
        basePrice -= userPoints.points;
      }

      setTotalPrice(basePrice > 0 ? basePrice : 0);
    }
  }, [ticketQuantity, selectedDiscount, useAllPoints, eventDetail, userPoints]);

  const handleProceedToPayment = () => {
    // Implement payment processing logic here
    console.log("Proceeding to payment with method:", selectedPaymentMethod);
};

  return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">Transaction</h2>
      
            {/* Event Details & Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Event Details */}
              <div className="bg-gray-50 p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Event Details</h3>
                {eventDetail ? (
                  <>
                    <p className="mt-2"><strong>Event:</strong> {eventDetail.title}</p>
                    <p className="mt-1"><strong>Date:</strong> {eventDetail.date}</p>
                    <p className="mt-1"><strong>Location:</strong> {eventDetail.location}</p>
                  </>
                ) : (
                  <p>Loading event details...</p>
                )}
                
                {/* Select ticket quantity with + - buttons */}
                <div className="mt-3">
                  <label className="block font-medium text-gray-600">Select Ticket Quantity</label>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-300 px-3 py-2 rounded-l-md text-lg"
                      onClick={() => setTicketQuantity(ticketQuantity > 1 ? ticketQuantity - 1 : 1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={ticketQuantity}
                      readOnly
                      className="w-16 text-center border p-2"
                    />
                    <button
                      className="bg-gray-300 px-3 py-2 rounded-r-md text-lg"
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
      
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Your Order</h3>
                <table className="w-full mt-4 border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Total Price ({ticketQuantity} Tickets)</td>
                      <td className="border border-gray-300 p-2">{formatRupiah(totalPrice)}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Select Discount</td>
                      <td className="border border-gray-300 p-2">
                        <select
                          value={selectedDiscount || ""}
                          onChange={(e) => setSelectedDiscount(e.target.value ? Number(e.target.value) : null)}
                          className="w-40 border p-2 rounded-md"
                        >
                          <option value="">No Discount</option>
                          {discounts.map((discount) => (
                            <option key={discount.id} value={discount.id}>
                              {discount.type === "Percentage" ? `${discount.value}% Off` : `${formatRupiah(discount.value)} Off`}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Use All Points ({userPoints ? formatRupiah(userPoints.points) : '0'} available)</td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="checkbox"
                          checked={useAllPoints}
                          onChange={() => setUseAllPoints(!useAllPoints)}
                          className="mr-2"
                        />
                        <label>{useAllPoints ? `-${userPoints ? formatRupiah(userPoints.points) : '0'} applied` : "Use all points"}</label>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-semibold">Total</td>
                      <td className="border border-gray-300 p-2 text-green-600 font-bold">{formatRupiah(totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
      
            {/* Payment Method */}
            <div className="bg-gray-50 p-4 rounded-md shadow-md mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Payment Method</h3>
              <div className="mt-4 space-y-3">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center cursor-pointer p-2 border rounded-md hover:bg-gray-100">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => setSelectedPaymentMethod(method.id)}
                      className="mr-2"
                    />
                    {method.name}
                  </label>
                ))}
              </div>
            </div>
      
            <button
              className="w-full bg-green-600 text-white font-semibold py-3 mt-6 rounded-md hover:bg-green-700 transition"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      );
      };
      
      export default TransactionPage;
      