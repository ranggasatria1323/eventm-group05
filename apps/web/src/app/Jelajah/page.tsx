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
            <div className="p-1 ">
              <Link href={''}>
                <Card className="xl:w-[250px] xl:h-[350px] md:h-[250px] md:w-[210px]">
                  <div
                    className="xl:w-auto xl:h-[130px] md:w-auto md:h-[80px]"
                    style={{
                      backgroundImage:
                        'url(https://marketplace.canva.com/EAFs0GMlUi8/1/0/1143w/canva-biru-kuning-modern-pop-konser-musik-poster-dicpZ-CfyKo.jpg)',
                      backgroundSize: 'cover',
                      borderRadius: '10px 10px 0px 0px',
                      backgroundPosition: 'top',
                    }}
                  />
                  <div className="xl:border-b-2 md:border-d-2 md:leading-[35px] md:p-3 xl:p-8 xl:leading-[35px]">
                    <p style={{ fontWeight: 'bold' }}>{item.title}</p>
                    <p>{item.date}</p>
                    <p>{item.price}</p>
                  </div>
                  <div>
                    <p className="flex justify-center items-center font-light xl:text-3xl md:text-xl">
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
