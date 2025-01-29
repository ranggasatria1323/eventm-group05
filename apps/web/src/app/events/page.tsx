'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { eventListProcess } from '@/api/event';
import { useEffect, useState } from "react";
import Link from "next/link";

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
       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">Upcoming Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((item: any) => (
            <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="aspect-video relative">
                <img 
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}event-images/${item.image}` || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-blue-800 text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{new Date(item.date).toLocaleString("en-GB",{
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}</span>
                </div>
                <div className="flex items-center text-blue-800 text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-blue-600 text-sm">
                  <span>{item.price === 0 ? "Free" : `Rp ${item.price.toLocaleString()}`}</span>
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
