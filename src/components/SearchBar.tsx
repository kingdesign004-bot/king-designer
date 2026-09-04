'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'ابحث...',
  isMobile = false,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className={`absolute ${isMobile ? 'left-3 top-2.5' : 'left-4 top-3'} text-gray-400 pointer-events-none`}
        size={isMobile ? 18 : 20}
      />
      <Input
        type="text"
        placeholder={placeholder}
        className={`${isMobile ? 'pl-9 py-2 text-sm' : 'pl-12 py-3'} w-full rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute ${isMobile ? 'right-3 top-2.5' : 'right-4 top-3'} text-gray-400 hover:text-gray-600`}
        >
          <X size={isMobile ? 16 : 18} />
        </button>
      )}
    </div>
  );
}
