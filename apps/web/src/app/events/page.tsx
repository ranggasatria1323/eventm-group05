'use client';

import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { eventListProcess } from '@/api/event';

export default function Jelajah() {
  const [events, setEvents] = useState<any[]>([]);

  const getEventList = async () => {
    const eventsData = await eventListProcess();
    setEvents(eventsData);
  };

  useEffect(() => {
    getEventList();
  }, []);

  return (
    <>
      <div className="min-h-auto bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Event List</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                <div className="aspect-video relative">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${item.image}` ||
                      'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                    }
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-blue-800 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span>
                      {new Date(item.date).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-800 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-blue-600 text-sm">
                    <span>
                      {!item.price
                        ? 'Free'
                        : `Rp ${item.price.toLocaleString()}`}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/events/${item.id}`}>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm font-medium">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
