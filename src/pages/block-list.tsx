'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Search, X } from 'lucide-react';

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  blockedAt: string;
}

export default function BlockListPage() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      name: 'محمد أحمد',
      email: 'user1@example.com',
      blockedAt: '2026-09-01',
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'user2@example.com',
      blockedAt: '2026-08-25',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblock = (userId: string) => {
    setBlockedUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUser(null);
    setIsConfirmOpen(false);
  };

  const handleOpenConfirm = (user: BlockedUser) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-white border-b border-gray-200 sticky top-0 z-40 ${isMobile ? 'p-3' : 'p-6'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-4`}>
            قائمة الحظر
          </h1>

          {/* Search */}
          <div className="relative">
            <Search className={`absolute ${isMobile ? 'left-3 top-2.5' : 'left-4 top-3'} text-gray-400`} size={isMobile ? 18 : 20} />
            <Input
              type="text"
              placeholder={isMobile ? "ابحث..." : "ابحث عن مستخدم..."}
              className={`${isMobile ? 'pl-9 py-2 text-sm' : 'pl-12 py-3'} w-full rounded-full border-2 border-gray-300 focus:border-red-500 focus:outline-none`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-4xl mx-auto ${isMobile ? 'p-3 space-y-3' : 'p-6 space-y-4'}`}>
        {filteredUsers.length === 0 ? (
          <Card className={`text-center ${isMobile ? 'p-6' : 'p-12'}`}>
            {blockedUsers.length === 0 ? (
              <>
                <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500 mb-2`}>
                  قائمة الحظر فارغة
                </p>
                <p className="text-sm text-gray-400">
                  لم تقم بحظر أي مستخدمين حتى الآن
                </p>
              </>
            ) : (
              <>
                <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-500`}>
                  لم يتم العثور على نتائج
                </p>
              </>
            )}
          </Card>
        ) : (
          <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
            {filteredUsers.map((user) => (
              <Card key={user.id} className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-red-300 to-red-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 truncate`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      تم الحظر في: {new Date(user.blockedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleOpenConfirm(user)}
                  className={isMobile ? 'ml-2 h-8 w-8 p-0' : 'ml-3'}
                >
                  {isMobile ? (
                    <X size={16} />
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-1" />
                      إلغاء الحظر
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Unblock Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className={isMobile ? 'max-w-full mx-2' : ''}>
          <DialogHeader>
            <DialogTitle>إلغاء الحظر</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في إلغاء حظر <strong>{selectedUser?.name}</strong>؟
              <br />
              سيتمكن من رؤية منشوراتك والتفاعل معها.
            </DialogDescription>
          </DialogHeader>

          <div className={`flex gap-3 ${isMobile ? 'flex-col-reverse' : ''}`}>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className={isMobile ? 'w-full' : ''}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleUnblock(selectedUser.id)}
              className={isMobile ? 'w-full' : ''}
            >
              إلغاء الحظر
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
