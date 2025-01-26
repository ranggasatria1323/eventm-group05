"use client"

import { useState } from 'react';

export default function NumberInput() {
  const [value, setValue] = useState('');

  return (
    <form>
      <input
        type="text"
        id="number"
        name="number"
        value={value.replace(/[^0-9]/g, '')}
        onChange={(e) => setValue(e.target.value)}
        className="block w-[50%] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
    </form>
  )
};