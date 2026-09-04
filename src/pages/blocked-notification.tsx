'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AdminContactModal from '@/components/AdminContactModal';

interface BlockedNotificationProps {
  isPermanent: boolean;
  unblockAt?: Date;
  reason?: string;
  onContactAdmin: () => void;
}

export default function BlockedNotificationPage({
  isPermanent,
  unblockAt,
  reason,
}: BlockedNotificationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // عداد تنازلي
  useEffect(() => {
    if (isPermanent || !unblockAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(unblockAt).getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('انتهى الحظر');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(`${days}د ${hours}س ${minutes}د ${seconds}ث`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPermanent, unblockAt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className={`${isMobile ? 'p-6 max-w-full' : 'p-8 max-w-2xl'} bg-white`}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-red-600 mb-2`}>
              حسابك مُحظور
            </h1>
            <p className="text-gray-600">
              {isPermanent ? 'تم حظر حسابك بشكل دائم' : 'تم حظر حسابك مؤقتاً'}
            </p>
          </div>
        </div>

        {/* Reason */}
        {reason && (
          <Card className="bg-red-50 border-red-200 p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>السبب:</strong> {reason}
            </p>
          </Card>
        )}

        {/* Block Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">محظور من الدخول</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">تقييد المنشورات</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">إخفاء صورة البروفيل</span>
          </div>
        </div>

        {/* Countdown Timer */}
        {!isPermanent && unblockAt && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={20} className="text-blue-600" />
              <p className="text-blue-900 font-semibold">وقت الحظر المتبقي</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 text-center py-2">
              {timeRemaining}
            </p>
          </div>
        )}

        {/* Permanent Notice */}
        {isPermanent && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-900 font-semibold text-center">
              🔴 الحظر دائم ويمكن تغييره من قبل إدارة الموقع فقط
            </p>
          </div>
        )}

        {/* Contact Admin Button */}
        <Button
          onClick={() => setIsContactOpen(true)}
          className={`${isMobile ? 'w-full mb-3' : 'mb-4'} bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2`}
        >
          <Mail size={20} />
          التواصل مع الإدارة
        </Button>

        {/* Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>إذا كنت تعتقد أن هناك خطأ، يمكنك التواصل مع فريق الدعم</p>
        </div>
      </Card>

      {/* Contact Modal */}
      <AdminContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        userId="current-user-id"
        type="appeal"
      />
    </div>
  );
}
