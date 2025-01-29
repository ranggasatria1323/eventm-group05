import React, { useState, useEffect } from 'react';

export default function CarouselSlide() {
  const heroImages = [
    'https://cdn.evbstatic.com/s3-build/fe/build/images/69483a6795b18c6d44143f9a6399142c-valentine_dating_desktop.webp',
    'https://assets.loket.com/images/ss/1736246040_igLJpP.jpg',
    'https://cdn.evbstatic.com/s3-build/fe/build/images/bb8b2f325ba34836306ead1ce1e3abfd-valentine_nightlife_desktop.webp',
    'https://assets.loket.com/images/ss/1736334570_GzlUBO.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='mx-3 my-3 w-auto md:w-full md:mx-0 md:my-0'>
    <div className="rounded-[10px] md:rounded-none relative bg-blue-600 h-[150px] md:h-[500px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out ${
              index === currentImageIndex
                ? 'translate-x-0'
                : index < currentImageIndex
                  ? '-translate-x-full'
                  : 'translate-x-full'
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-fit"
            />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
