'use client';

import { Card } from './../../components/ui/card';
import { Carousel, CarouselItem } from './../../components/ui/carousel';
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
      <Carousel className="grid grid-cols-5 gap-y-6">
      {events.map((item: any, index) => (
          <CarouselItem
            key={index}
            className="md:basis-2/4 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="p-2 ">
              <Link href={''}>
                <Card className="xl:w-[250px] h-full md:w-[210px]">
                  <img src={item.image} className='rounded-t-[10px]' style={{width:"100%", height:'150px', objectFit:'cover', objectPosition:'top'}} />
                  <div className="xl:border-b-2 md:border-b-2 md:leading-4 md:p-3 xl:p-5 xl:leading-4">
                    <p style={{ fontWeight: 'bold' }} className='mb-4'>{item.title}</p>
                    <p className='mb-4'>{item.description}</p>
                    <p className='mb-4'>{new Date(item.date).toLocaleString("en-GB",{
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}</p>
                    <p>Rp. {item.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="flex justify-center items-center font-light xl:text-2xl md:text-xl">
                      PT. Konser Musik
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
}
