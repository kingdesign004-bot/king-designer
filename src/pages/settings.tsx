'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Lock, Eye } from 'lucide-react';

export default function SettingsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [settings, setSettings] = useState({
    username: 'محمد أحمد',
    email: 'user@example.com',
    bio: 'مصمم جرافيك محترف',
    notifications: {
      email: true,
      push: true,
      comments: true,
    },
    privacy: {
      profilePublic: true,
      allowMessages: true,
    },
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSave = () => {
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`max-w-3xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-6`}>
          الإعدادات
        </h1>

        {/* Account Settings */}
        <Card className={isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-4`}>
            حسابي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
              <Input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className={isMobile ? 'text-sm' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className={isMobile ? 'text-sm' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">السيرة الذاتية</label>
              <Textarea
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                rows={3}
                className={isMobile ? 'text-sm' : ''}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className={isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-4 flex items-center gap-2`}>
            <Bell size={20} />
            الإشعارات
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">إشعارات البريد الإلكتروني</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: e.target.checked },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">إشعارات فورية</span>
            </label>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className={isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-4 flex items-center gap-2`}>
            <Eye size={20} />
            الخصوصية
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.profilePublic}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profilePublic: e.target.checked },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">جعل ملفي الشخصي عام</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowMessages}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, allowMessages: e.target.checked },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">السماح برسائل من أي أحد</span>
            </label>
          </div>
        </Card>

        {/* Save Button */}
        <div className={`flex gap-3 ${isMobile ? 'flex-col-reverse' : ''}`}>
          <Button variant="outline" className={isMobile ? 'w-full' : ''}>
            إلغاء
          </Button>
          <Button onClick={handleSave} className={`${isMobile ? 'w-full' : ''} bg-blue-600 hover:bg-blue-700`}>
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </div>
  );
}
