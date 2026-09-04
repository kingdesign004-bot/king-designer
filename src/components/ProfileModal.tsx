'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Link as LinkIcon, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserBadge from '@/components/UserBadge';
import UserReportModal from '@/components/UserReportModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserType } from '@/types/advanced';

interface ProfileModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  isFollowing?: boolean;
  onFollow?: () => void;
}

export default function ProfileModal({
  user,
  isOpen,
  onClose,
  currentUserId,
  isFollowing = false,
  onFollow,
}: ProfileModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  const isOwnProfile = user.id === currentUserId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <Card className={`${isMobile ? 'w-full rounded-t-2xl' : 'max-w-md'} bg-white`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">الملف الشخصي</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              {user.isVerified && <UserBadge user={user} size="md" showLabel={true} />}
            </div>
            {user.bio && <p className="text-gray-600 text-center mt-2">{user.bio}</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b border-gray-200">
            <div>
              <p className="text-2xl font-bold text-gray-900">125</p>
              <p className="text-sm text-gray-500">متابعون</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-500">يتابعهم</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">42</p>
              <p className="text-sm text-gray-500">منشورات</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!isOwnProfile && (
              <>
                <Button
                  onClick={onFollow}
                  className={`w-full ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? '✓ متابع' : '+ متابعة'}
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  💬 إرسال رسالة
                </Button>
              </>
            )}

            {/* Menu */}
            {!isOwnProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <MoreVertical size={18} className="mr-2" />
                    المزيد
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    حظر
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsReportOpen(true)}
                    className="cursor-pointer text-red-600"
                  >
                    إبلاغ عن المستخدم
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </Card>

      {/* Report Modal */}
      <UserReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={user.id}
        reportedUserName={user.name}
      />
    </div>
  );
}
