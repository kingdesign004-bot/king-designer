// src/components/BottomNavbar.tsx - شريط التنقل الثابت بالأسفل
import React, { useState } from 'react';
import { Home, MessageSquare, Bell, Search, User, Menu } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

export function BottomNavbar() {
  const [activeRoute, setActiveRoute] = useState('home');

  const navItems: NavItem[] = [
    { icon: <Home size={24} />, label: 'الرئيسية', href: '/' },
    { icon: <Search size={24} />, label: 'البحث', href: '/search' },
    { icon: <Bell size={24} />, label: 'الإشعارات', href: '/notifications', badge: 3 },
    { icon: <MessageSquare size={24} />, label: 'الرسائل', href: '/messages', badge: 5 },
    { icon: <User size={24} />, label: 'الملف', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 h-20">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActiveRoute(item.label)}
            className="flex flex-col items-center justify-center gap-1 relative text-charcoal-700 hover:text-gold-500 transition-colors"
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}
