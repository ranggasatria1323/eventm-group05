import { Card } from '@/components/ui/card';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';

export default function Jelajah() {
  return (
    <>
      <Carousel className="grid grid-cols-5 gap-y-6">
        {Array.from({ length: 23 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="md:basis-2/4 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="p-1 ">
              <Link href={''}><Card className="xl:w-[250px] xl:h-[350px] md:h-[250px] md:w-[210px]">
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
                  <p style={{ fontWeight: 'bold' }}>Jakarta</p>
                  <p>21 Januari 2025</p>
                  <p>Rp. 120.000</p>
                </div>
                <div>
                  <p className="flex justify-center items-center font-light xl:text-3xl md:text-xl">
                    PT. Konser Musik
                  </p>
                </div>
              </Card></Link>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
}
