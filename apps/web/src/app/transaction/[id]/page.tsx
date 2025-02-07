'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchDiscounts,
  fetchEventById,
  fetchUserPoints,
  getUserProfile,
  createTransaction,
} from '@/api/transaction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PaymentMethod {
  id: string;
  name: string;
}

interface Discount {
  id: number;
  percentage: string; // API mengembalikan string, jadi tetap string
  startDate: string;
  endDate: string;
}

const formatRupiah = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp 0';
  }
  return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const paymentMethods: PaymentMethod[] = [
  { id: 'dana', name: 'Dana' },
  { id: 'shopeepay', name: 'ShopeePay' },
  { id: 'gopay', name: 'GoPay' },
  { id: 'mandiri', name: 'Mandiri' },
  { id: 'bsi', name: 'BSI' },
  { id: 'bca', name: 'BCA' },
  { id: 'bri', name: 'BRI' },
  { id: 'linkaja', name: 'LinkAja' },
];

const TransactionPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [eventDetail, setEventDetail] = useState<any>(null);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [usedDiscounts, setUsedDiscounts] = useState<number[]>([]);
  const [userPoints, setUserPoints] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null,
  );
  const [useAllPoints, setUseAllPoints] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null); // Added state for payment method
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isEventExpired, setIsEventExpired] = useState<boolean>(false);

  // Fetch data from API when the component first renders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!id) {
          console.error('Event ID not found in URL');
          return;
        }

        const [eventData, discountData, pointsData, userProfile] =
          await Promise.all([
            fetchEventById(eventId),
            fetchDiscounts(),
            fetchUserPoints(),
            getUserProfile(),
          ]);

        if (eventData) {
          setEventDetail(eventData);
          setTotalPrice(eventData.price);

          const eventDate = new Date(eventData.date);
          const now = new Date();
          if (eventDate < now) {
            setIsEventExpired(true);
          }
        }

        // 🔹 Ambil diskon yang sudah digunakan dari localStorage
        const usedDiscounts = JSON.parse(
          localStorage.getItem('usedDiscounts') || '[]',
        );

        // 🔹 Hanya tampilkan diskon yang belum digunakan
        setDiscounts(
          discountData.filter((d: Discount) => !usedDiscounts.includes(d.id)),
        );

        setUserPoints(pointsData);
        setUserRole(userProfile.userType);

        if (userProfile.userType !== 'Customer') {
          toast.error('Only customers can access this page!', {
            position: 'top-center',
          });
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate total price based on ticket quantity, discount, and points
  useEffect(() => {
    if (eventDetail) {
      let basePrice = eventDetail.price * ticketQuantity;

      // Periksa apakah `selectedDiscount` adalah objek sebelum mengambil `percentage`
      if (selectedDiscount && 'percentage' in selectedDiscount) {
        const discountValue = Number(selectedDiscount.percentage); // Konversi ke number
        basePrice -= (discountValue / 100) * basePrice;
      }

      // Terapkan poin pengguna jika dipilih
      if (userPoints && useAllPoints) {
        basePrice -= userPoints.points;
      }

      setTotalPrice(basePrice > 0 ? basePrice : 0);
    }
  }, [ticketQuantity, selectedDiscount, useAllPoints, eventDetail, userPoints]);

  const handleProceedToPayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method!', {
        position: 'top-center',
      });
      return;
    }

    if (!eventDetail || eventDetail.stock < ticketQuantity) {
      toast.error('Not enough tickets available!', { position: 'top-center' });
      return;
    }

    try {
      const transactionData: any = {
        eventId,
        ticketQuantity,
        usePoints: useAllPoints,
        paymentMethod: selectedPaymentMethod,
      };

      if (selectedDiscount) {
        transactionData.discountId = selectedDiscount.id;
      }

      const response = await createTransaction(transactionData);

      toast.success('Payment successful! Redirecting to ticket page...', {
        position: 'top-center',
      });

      setEventDetail((prev: any) => ({
        ...prev,
        stock: prev.stock - ticketQuantity,
      }));

      setTicketQuantity(1);

      // **🔹 Hapus diskon yang sudah digunakan dari state & localStorage**
      if (selectedDiscount) {
        setDiscounts((prev) =>
          prev.filter((d) => d.id !== selectedDiscount.id),
        );
        setSelectedDiscount(null);

        // **🔹 Hapus dari localStorage juga agar tidak muncul setelah reload**
        const usedDiscounts = JSON.parse(
          localStorage.getItem('usedDiscounts') || '[]',
        );
        const updatedUsedDiscounts = [...usedDiscounts, selectedDiscount.id];
        localStorage.setItem(
          'usedDiscounts',
          JSON.stringify(updatedUsedDiscounts),
        );
      }

      setTimeout(() => {
        router.push(`/ticket/${id}`);
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Transaction failed! Please try again.',
        {
          position: 'top-center',
        },
      );
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Transaction
        </h2>

        {/* Event Details & Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Event Details */}
          <div className="bg-gray-50 p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Event Details
            </h3>
            {eventDetail ? (
              <>
                <p className="mt-2">
                  <strong>Event:</strong> {eventDetail.title}
                </p>
                <p className="mt-1">
                  <strong>Date:</strong>{' '}
                  {new Date(eventDetail.date).toLocaleDateString('id-ID')}
                </p>
                <p className="mt-1">
                  <strong>Location:</strong> {eventDetail.location}
                </p>
                <p className="mt-1">
                  <strong>Available Tickets:</strong> {eventDetail.stock}
                </p>
              </>
            ) : (
              <p>Loading event details...</p>
            )}

            {/* Select ticket quantity with + - buttons */}
            <div className="mt-3">
              <label className="block font-medium text-gray-600">
                Select Ticket Quantity
              </label>
              <div className="flex items-center mt-2">
                <button
                  className="bg-gray-300 px-3 py-2 rounded-l-md text-lg"
                  onClick={() =>
                    setTicketQuantity(
                      ticketQuantity > 1 ? ticketQuantity - 1 : 1,
                    )
                  }
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
                  <td className="border border-gray-300 p-2">
                    Total Price ({ticketQuantity} Tickets)
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatRupiah(totalPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">
                    Select Discount
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      value={selectedDiscount ? selectedDiscount.id : ''}
                      onChange={(e) => {
                        const selected =
                          discounts.find(
                            (d) => d.id === Number(e.target.value),
                          ) || null;
                        setSelectedDiscount(selected);
                      }}
                      className="w-40 border p-2 rounded-md"
                    >
                      <option value="">No Discount</option>
                      {discounts.map((discount) => (
                        <option key={discount.id} value={discount.id}>
                          {`${discount.percentage}% Off`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">
                    Use All Points (
                    {userPoints ? formatRupiah(userPoints.points) : '0'}{' '}
                    available)
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="checkbox"
                      checked={useAllPoints}
                      onChange={() => setUseAllPoints(!useAllPoints)}
                      className="mr-2"
                    />
                    <label>
                      {useAllPoints
                        ? `-${userPoints ? formatRupiah(userPoints.points) : '0'} applied`
                        : 'Use all points'}
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">
                    Total
                  </td>
                  <td className="border border-gray-300 p-2 text-green-600 font-bold">
                    {formatRupiah(totalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-md shadow-md mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Payment Method
          </h3>
          <div className="mt-4 space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className="flex items-center cursor-pointer p-2 border rounded-md hover:bg-gray-100"
              >
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

        {isEventExpired ? (
          <div className="mt-6 text-center text-red-600 font-bold">
            This event has already ended. Ticket purchase is no longer
            available.
          </div>
        ) : (
          <button
            className="w-full bg-green-600 text-white font-semibold py-3 mt-6 rounded-md hover:bg-green-700 transition"
            onClick={handleProceedToPayment}
            disabled={eventDetail?.stock === 0}
          >
            {eventDetail?.stock === 0 ? 'Sold Out' : 'Pay'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
