// src/components/NotificationCenter.tsx - مركز الإشعارات المحسّن
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'system';
  title: string;
  body: string;
  avatar?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // تحديث عدد الإشعارات غير المقروءة
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons: Record<Notification['type'], string> = {
      follow: '👥',
      like: '❤️',
      comment: '💬',
      message: '📨',
      system: 'ℹ️',
    };
    return icons[type];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gold-100 transition-colors"
      >
        <Bell size={24} className="text-charcoal-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-96 max-h-96 bg-white rounded-2xl shadow-xl border border-gold-200 z-50 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-gold-50 to-ivory-50 p-4 border-b border-gold-100 flex justify-between items-center">
            <h2 className="font-bold text-charcoal-900">الإشعارات</h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-gold-600 hover:text-gold-700 font-medium"
              >
                وضع علامة على الكل كمقروء
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-charcoal-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p>لا توجد إشعارات جديدة</p>
            </div>
          ) : (
            <div className="divide-y divide-gold-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-ivory-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-gold-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal-900">{notification.title}</p>
                      <p className="text-sm text-charcoal-600">{notification.body}</p>
                      <span className="text-xs text-charcoal-500">
                        {notification.timestamp.toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-gold-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
