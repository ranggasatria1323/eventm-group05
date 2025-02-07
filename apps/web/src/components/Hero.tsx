'use client';

import { useState, useEffect } from 'react';
import { eventListProcess } from '../api/event';
import { Calendar, ChevronRight, MapPin, Search } from 'lucide-react';
import CarouselSlide from './CarouselSlide';

export default function Hero() {
  const [events, setEvents] = useState<any[]>([]);
  const [eventsIncoming, setEventsIncoming] = useState<any[]>([]);

  const getEventList = async () => {
    const eventsSelection = await eventListProcess();
    const eventIncoming = await eventListProcess({ type: 'landing' });

    const limitEventsSelection = eventsSelection.slice(0, 4);
    const limitEventsIncoming = eventIncoming.slice(0, 6);
    setEvents(limitEventsSelection);
    setEventsIncoming(limitEventsIncoming);
  };

  useEffect(() => {
    getEventList();
  }, []);

  return (
    <>
      <CarouselSlide />
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Event Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* {[
            'Music',
            'Sport',
            'Workshop',
            'Festival',
            'Seminar',
            'Exhibition',
          ].map((category) => (
            
          ))} */}
          <a href='/search?query=Music' >
          <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Music</h3>
            </div>
            </a>
            <a href='/search?query=Sport' >
            <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Sport</h3>
            </div>
            </a>
            <a href='/search?query=Workshop' >
            <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Workshop</h3>
            </div>
            </a>
            <a href='/search?query=Festival' >
            <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Festival</h3>
            </div>
            </a>
            <a href='/search?query=Seminar' >
            <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Seminar</h3>
            </div>
            </a>
            <a href='/search?query=Exhibition' >
            <div
              className="bg-gray-100 rounded-[7px] p-4 text-center hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="font-medium">Exhibition</h3>
            </div>
            </a>
        </div>
      </div>

      {/* Featured Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Selected Events</h2>
          <a href="/events" className="text-blue-600 flex items-center">
            Find More <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((item: any, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={
                  `${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${item.image}` ||
                  'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                }
                alt="Event"
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(item.date).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  Stock : {item.stock}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-blue-600 font-semibold">
                    {!item.price
                      ? 'Free'
                      : `IDR ${item.price.toLocaleString()},00`}
                  </div>
                  <a
                    href={`/events/${item.id}`}
                    className="text-blue-600 flex items-center"
                  >
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                      Detail
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {eventsIncoming.map((item: any, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden "
              >
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${item.image}` ||
                    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                  }
                  alt="Event"
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(item.date).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-blue-600 font-semibold">
                      {!item.price
                        ? 'Free'
                        : `IDR ${item.price.toLocaleString()},00`}
                    </div>
                    <a href={`/events/${item.id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        Detail
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
