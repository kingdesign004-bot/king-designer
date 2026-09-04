'use client';

import React from 'react';
import { useRouter } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Settings, Bell, BookmarkIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  isMobile?: boolean;
}

export default function Navbar({ isMobile = false }: NavbarProps) {
  const [router, navigate] = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className={`max-w-7xl mx-auto ${isMobile ? 'px-3 py-2' : 'px-6 py-4'} flex items-center justify-between`}>
        {/* Logo */}
        <div
          onClick={() => navigate('/feed')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold`}>
            KD
          </div>
          {!isMobile && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              King Designer
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-6 flex-1 ml-8">
            <button
              onClick={() => navigate('/feed')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              الرئيسية
            </button>
            <button
              onClick={() => navigate('/create-post')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              إنشاء منشور
            </button>
            <button
              onClick={() => navigate('/saved')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
            >
              <BookmarkIcon size={18} />
              المحفوظات
            </button>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/feed')}>
                  الرئيسية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-post')}>
                  إنشاء منشور
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/saved')}>
                  <BookmarkIcon size={16} className="mr-2" />
                  المحفوظات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/block-list')}>
                  قائمة الحظر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/logout')} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop User Menu */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
                  U
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  الإعدادات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/block-list')}>
                  قائمة الحظر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/logout')} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
