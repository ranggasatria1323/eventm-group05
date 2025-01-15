import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function LandingPage() {
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
      <div className="md:ml-[90px] lg:ml-[280px] xl:ml-[260px]">
        <p className="text-3xl py-8">Event Pilihan</p>
      </div>
      <div className="">
        <Carousel
          opts={{
            align: 'start',
          }}
          className="flex justify-center"
        >
          <CarouselContent className="w-[320px] md:min-w-[700px] xl:min-w-[1400px]">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-2/4 lg:basis-1/2 xl:basis-1/4"
              >
                <div className="p-1 ">
                  <Card className="w-[326px] h-[400px]">
                    <div
                      className="w-auto h-[180px]"
                      style={{
                        backgroundImage:
                          'url(https://marketplace.canva.com/EAFs0GMlUi8/1/0/1143w/canva-biru-kuning-modern-pop-konser-musik-poster-dicpZ-CfyKo.jpg)',
                        backgroundSize: 'cover',
                        borderRadius: '10px 10px 0px 0px',
                        backgroundPosition: 'top',
                      }}
                    />
                    <div
                      style={{ lineHeight: '35px' }}
                      className="p-8 border-b-2"
                    >
                      <p style={{ fontWeight: 'bold' }}>Jakarta</p>
                      <p>21 Januari 2025</p>
                      <p>Rp. 120.000</p>
                    </div>
                    <div>
                      <p
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontWeight: 'lighter',
                          fontSize: '32px',
                        }}
                      >
                        PT. Konser Musik
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
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
            height: '200px',
            width: '1244px',
            backgroundPosition: '40px 470px',
            backgroundSize: '1170px',
            backgroundImage:
              "url('https://quotefancy.com/media/wallpaper/3840x2160/23550-Friedrich-Nietzsche-Quote-Without-music-life-would-be-a-mistake.jpg')",
            borderRadius: '20px',
            marginTop: '30px',
          }}
        />
      </div>
    </div>
  );
}
