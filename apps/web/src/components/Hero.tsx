import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Hero() {
  return (
    <div className="w-[100%] my-8">
      <div className="flex justify-center">
        <Carousel className="">
          <CarouselContent className="w-[320px] md:min-w-[700px] xl:min-w-[1200px]">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card style={{}}>
                    <CardContent
                      style={{
                        boxShadow: '1px 1px 7px',
                        backgroundImage:
                          "url('https://dtr2k13nvgx2o.cloudfront.net/assets/images/global/deals/tn-deals-25-off-1200x250.jpg')",
                        borderRadius: '10px',
                        backgroundSize: 'cover',
                      }}
                      className="flex h-[120px] md:h-[250px]  items-center justify-center p-6 "
                    ></CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex-col justify-self-center max-w-[1100px] md:max-h-auto">
      <p className="text-3xl py-8">Event Pilihan</p>
        <Carousel
          opts={{
            align: 'start',
          }} 
        >
          <CarouselContent className="w-[320px] md:w-[690px] xl:min-w-[1100px]">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-2/4 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1 ">
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
                    <div
                      className="xl:border-b-2 md:border-d-2 md:leading-[35px] md:p-3 xl:p-8 xl:leading-[35px]"
                    >
                      <p style={{ fontWeight: 'bold' }}>Jakarta</p>
                      <p>21 Januari 2025</p>
                      <p>Rp. 120.000</p>
                    </div>
                    <div>
                      <p
                        className='flex justify-center items-center font-light xl:text-3xl md:text-xl'
                      >
                        PT. Konser Musik
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='' />
          <CarouselNext className='' />
        </Carousel>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundImage:
              "url('https://quotefancy.com/media/wallpaper/3840x2160/23550-Friedrich-Nietzsche-Quote-Without-music-life-would-be-a-mistake.jpg')",
          }} className='xl:h-[200px] xl:w-[1100px] md:h-[130px] md:w-[700px] bg-cover bg-center rounded-[20px] mt-[30px] '
        />
      </div>
    </div>
  );
}
