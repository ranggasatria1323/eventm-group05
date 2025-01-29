"use client"

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Music, Code, Palette, Utensils, Briefcase, Shirt, Gamepad, FlaskRound as Flask } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Event categories data
const categories = [
  {
    id: 1,
    name: "Teknologi",
    icon: Code,
    description: "Konferensi teknologi, lokakarya, dan hackathon",
    color: "bg-blue-500",
    eventCount: 12
  },
  {
    id: 2,
    name: "Musik",
    icon: Music,
    description: "Konser, festival, dan pertunjukan langsung",
    color: "bg-purple-500",
    eventCount: 8
  },
  {
    id: 3,
    name: "Seni & Budaya",
    icon: Palette,
    description: "Pameran, galeri, dan lokakarya kreatif",
    color: "bg-pink-500",
    eventCount: 15
  },
  {
    id: 4,
    name: "Kuliner",
    icon: Utensils,
    description: "Festival makanan, pencicipan anggur, dan acara kuliner",
    color: "bg-orange-500",
    eventCount: 10
  },
  {
    id: 5,
    name: "Bisnis",
    icon: Briefcase,
    description: "Konferensi, jaringan, dan seminar",
    color: "bg-green-500",
    eventCount: 18
  },
  {
    id: 6,
    name: "Fashion",
    icon: Shirt,
    description: "Pertunjukan mode, pameran desain, dan trunk show",
    color: "bg-yellow-500",
    eventCount: 6
  },
  {
    id: 7,
    name: "Gaming",
    icon: Gamepad,
    description: "Turnamen game, konvensi, dan pertemuan",
    color: "bg-red-500",
    eventCount: 9
  },
  {
    id: 8,
    name: "Ilmu Pengetahuan",
    icon: Flask,
    description: "Pameran sains, kuliah, dan pameran",
    color: "bg-indigo-500",
    eventCount: 14
  }
];

// Sample event data
const events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    time: "09:00 AM - 05:00 PM",
    location: "Convention Center",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
    category: "Technology"
  },
  {
    id: 2,
    title: "Music Festival",
    date: "March 20, 2024",
    time: "02:00 PM - 11:00 PM",
    location: "City Park",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=2070",
    category: "Music"
  },
  // ... (previous events data)
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEvents = selectedCategory
    ? events.filter(event => event.category === selectedCategory)
    : events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Event Categories</h1>
          <p className="text-blue-600 max-w-2xl mx-auto">
            Discover amazing events across different categories. Click on a category to explore related events.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'ring-2 ring-blue-500 shadow-lg transform -translate-y-1'
                    : 'hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600/80 text-sm mb-2">{category.description}</p>
                  <div className="text-sm font-medium text-blue-900">
                    {category.eventCount} Events
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Events Section */}
        {selectedCategory && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900">
                {selectedCategory} Events
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Categories
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-blue-800 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-blue-800 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-blue-800 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm font-medium">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
