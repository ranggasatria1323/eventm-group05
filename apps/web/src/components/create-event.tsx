'use client';

import React, { ChangeEvent, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from './ui/input';
import { eventCreateProcess } from '../api/event';
import { Header } from './Header';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getUserRole = () => {
  return 'Event Organizer';
};

export default function CreateEvent() {
  const userRole = getUserRole();
  const router = useRouter();

  if (userRole !== 'Event Organizer') {
    return <p>You do not have permission to create an event.</p>;
  }

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventPrice, setEventPrice] = useState('');
  const [eventMaxDiscount, setEventMaxDiscount] = useState('');
  const [eventType, setEventType] = useState('Paid');
  const [eventCategory, setEventCategory] = useState('');
  const [eventStock, setEventStock] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', eventName);
    formData.append('description', eventDescription);
    if (eventImage) {
      if (eventImage.size <= 10 * 1024 * 1024) {
        // 10MB dalam byte
        formData.append('file', eventImage);
      } else {
        toast.error('File gambar kegedean!');
        formData.append('file', eventImage);
      }
    }
    formData.append('location', eventLocation);
    formData.append('date', eventDate);
    if (eventType !== 'Free') {
      formData.append('price', Number(eventPrice).toString());
    }
    formData.append(
      'max_voucher_discount',
      Number(eventMaxDiscount).toString(),
    );
    formData.append('event_type', eventType);
    formData.append('category', eventCategory);
    formData.append('stock', Number(eventStock).toString());

    try {
      await eventCreateProcess(formData);
      toast.success('Event created successfully!');
      setTimeout(() => {
        router.push('/dashboard/event-list');
      }, 2000);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleEventTypeChange = (selectedType: string) => {
    setEventType(selectedType);
    if (selectedType === 'Free') {
      setEventPrice('');
    }
  };

  const handlePriceChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEventPrice(e.target.value);
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="px-3 py-2 md:px-20 md:py-10 ">
        <div className="border p-4 rounded-xl bg-gray-50">
          <div className="space-y-12 ">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-blue-900">
                Create Event
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Create the Event you want!
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="judul event"
                      className="block w-[50%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="date"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Date
                  </label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="block w-[150px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm/6 text-gray-600">
                    Describe your event briefly and clearly.
                  </p>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="location"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Lokasi Event"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      required
                      className="block w-[50%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4 w-[50%]">
                  <label
                    htmlFor="price"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Price
                  </label>
                  <div className="mt-2 ">
                    <Input
                      type="text"
                      value={eventPrice.replace(/[^0-9]/g, '')}
                      onChange={handlePriceChange}
                      disabled={eventType === 'Free'}
                      required
                      className="outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="event type"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Event Type
                  </label>
                  <Select
                    value={eventType}
                    onValueChange={handleEventTypeChange}
                    required
                  >
                    <SelectTrigger className="w-[180px] mt-2 outline outline-1 -outline-offset-1 outline-gray-300">
                      <SelectValue placeholder="Select a event type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white ">
                      <SelectGroup>
                        <SelectLabel>Event Type</SelectLabel>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Free">Free</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="category"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <Select
                    value={eventCategory}
                    onValueChange={setEventCategory}
                    required
                  >
                    <SelectTrigger className="w-[180px] mt-2 outline outline-1 -outline-offset-1 outline-gray-300">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Exhibition">Exhibition</SelectItem>
                        <SelectItem value="Sport">Sport</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-4 w-[16%] ">
                  <label
                    htmlFor="max_discount"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Max Discount
                  </label>
                  <Input
                    type="text"
                    value={eventMaxDiscount.replace(/[^0-9]/g, '')}
                    onChange={(e) => setEventMaxDiscount(e.target.value)}
                    required
                    className="outline outline-1 -outline-offset-1 outline-gray-300"
                  />
                </div>
                <div className="sm:col-span-4 w-[10%]">
                  <label
                    htmlFor="stock"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Stock
                  </label>
                  <div className="mt-2 ">
                    <Input
                      type="text"
                      value={eventStock.replace(/[^0-9]/g, '')}
                      onChange={(e) => setEventStock(e.target.value)}
                      required
                      className="outline outline-1 -outline-offset-1 outline-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-full mt-8">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Event Poster
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center flex-col">
                      {eventImage ? (
                        <img
                          className="md:h-[320px]"
                          src={URL.createObjectURL(eventImage)}
                        />
                      ) : (
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto size-12 text-gray-300"
                        />
                      )}
                      <div className="mt-4 flex justify-center text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="eventImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEventImage(e.target.files?.[0] || null)
                            }
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
