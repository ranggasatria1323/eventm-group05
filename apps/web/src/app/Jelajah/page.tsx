'use client';

import { Card } from '@/components/ui/card';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { eventListProcess } from '@/api/event';
import axios from 'axios';

export default function Jelajah() {
  const [events, setEvents] = useState<any[]>([]);
  const base_url = 'http://localhost:1234';

  const getEventList = async () => {
    try {
      const response = await axios.get(base_url + '/events');
      console.log('API response:', response.data);

      if (response?.status === 200) {
        console.log('Events data:', response.data.data);
        setEvents(response.data.data);
      } else {
        console.error('Unexpected status code:', response.data.status);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
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
                  <img src={item.image} />
                  <div className="xl:border-b-2 md:border-d-2 md:leading-[35px] md:p-3 xl:p-5 xl:leading-[35px]">
                    <p style={{ fontWeight: 'bold' }}>{item.title}</p>
                    <p>{item.description}</p>
                    <p>{item.date}</p>
                    <p>Rp. {item.price}</p>
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
