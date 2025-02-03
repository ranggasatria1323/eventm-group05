'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { fetchEventById, eventEditProcess } from '@/api/event';
import Cookies from 'js-cookie';
import { PhotoIcon } from '@heroicons/react/24/solid';

const EditEventPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    date: '',
    event_type: '',
    price: 0,
    stock:0,
    max_voucher_discount: 0,
    category: '',
  });

  const [eventCategory, setEventCategory] = useState('');
  const [eventMaxDiscount, setEventMaxDiscount] = useState(0);
  const [eventPrice, setEventPrice] = useState(0);
  const [eventStock, setEventStock] = useState(0);
  const [eventImage, setEventImage] = useState(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token is undefined. Please log in again.');
        return; // Handle accordingly
      }
      const data = await fetchEventById(id as string, token);
      if (data) {
        setEventData(data);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      console.error('Token is undefined. Please log in again.');
      return; // Handle accordingly
    }
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('image', eventData.image);
    formData.append('location', eventData.location);
    formData.append('date', eventData.date);
    formData.append('event_type', eventData.event_type);
    formData.append('price', eventData.price.toString());
    formData.append('stock', eventData.stock.toString());
    if (eventData.max_voucher_discount !== null && eventData.max_voucher_discount !== undefined) {
      formData.append('max_voucher_discount', eventData.max_voucher_discount.toString());
  } else {
      formData.append('max_voucher_discount', '');
  }
    formData.append('category', eventData.category);

    if (file) {
      formData.append('image', file);
  }

    try {
      await eventEditProcess(id as string, formData);
      router.push('/dashboard/event-list'); // Redirect after successful edit
    } catch (error) {
      console.error('Error updating event:', error);
      // Provide user feedback here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-3 py-2 md:px-20 md:py-10 ">
      <div className="border p-4 rounded-xl bg-gray-50">
        <div className="space-y-12 ">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-blue-900">
              Edit Event
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Update the Event details!
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
                    placeholder="Title"
                    className="block w-[50%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    value={eventData.title}
                    onChange={handleChange}
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
                  name="date"
                  value={eventData.date} onChange={handleChange}
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
                    value={eventData.description} onChange={handleChange} placeholder="Description"
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
                    value={eventData.location} onChange={handleChange} placeholder="Location"
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
                    name="price" value={eventData.price ? eventData.price.toString().replace(/[^0-9]/g, '') : ''} onChange={handleChange} placeholder="Price"
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
                  name="event_type" value={eventData.event_type} onValueChange={setEventCategory}
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
                  value={eventData.category}
                  onValueChange={setEventCategory}
                  required
                >
                  <SelectTrigger className="w-[180px] mt-2 outline outline-1 -outline-offset-1 outline-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="Musik">Musik</SelectItem>
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
                  name='max_voucher_discount'
                  value={eventData.max_voucher_discount}
                  onChange={handleChange}
                  placeholder='max_voucher_discount'
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
                    name="stock"
                    value={eventData.stock}
                    onChange={handleChange}
                    placeholder='Stock'
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
                  <div className="text-center">
                    {file ? (
                      <img className="h-[320px]" src={URL.createObjectURL(file)} />
                    ) : (
                      eventData?.image ? <img className='h-[300px]' src={`${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${eventData?.image}`} /> : <></>
                    )}
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
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
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditEventPage;
