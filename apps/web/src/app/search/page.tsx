'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { searchEvents } from '@/api/event';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function Search() {
  const router = useSearchParams()
  const query = router.get('query')

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const getSearch = async (query: string) => {
    try {
      const results = await searchEvents(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (query) {
      getSearch(query);
    }
  }, [query]);

  return (
    <div className="min-h-auto bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        {hasSearched && searchResults.length === 0 && (
          <div className="text-center text-2xl text-gray-600 mt-12">
            <img src='https://static.vecteezy.com/system/resources/previews/005/163/918/non_2x/search-no-result-found-word-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg' alt='No results found' width={718}
              height={404} />
            <p className="text-center text-gray-500">
              Sorry there are no event for this search. Please try another
              phrase.
            </p>
          </div>
          
        )}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((item, index) => (
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
        )}
      </div>
    </div>
  );
}

export default Search;
