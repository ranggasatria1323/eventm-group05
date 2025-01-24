'use client';

import { PhotoIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function CreateEvent() {

  
  return (
    <form className="px-20 py-10" onSubmit={createPos}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-blue-900">
            Create Event
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Create the Event you want!
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="judul event"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)} // Menambahkan onChange
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="date"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Date
              </label>
              <Popover>
                <PopoverTrigger className="mt-2" asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)} // Menambahkan onChange
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="location"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Location
              </label>
              <div className="mt-2">
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Lokasi Event"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="IDR"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Event Poster
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    aria-hidden="true"
                    className="mx-auto size-12 text-gray-300"
                  />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setImageFile(e.target.files[0])} // Menambahkan onChange untuk file upload
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create
        </button>
      </div>
    </form>
  );
}