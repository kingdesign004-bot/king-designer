'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, MoreVertical, ArrowRight, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MessageItem from '@/components/MessageItem';
import UserReportModal from '@/components/UserReportModal';
import UserBadge from '@/components/UserBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message, User } from '@/types/advanced';

interface ChatPageProps {
  conversationId: string;
  otherUser: User;
  currentUserId: string;
  isFollowing: boolean;
}

export default function ChatPage({
  conversationId,
  otherUser,
  currentUserId,
  isFollowing,
}: ChatPageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [canSendMessage, setCanSendMessage] = useState(isFollowing);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showFollowWarning, setShowFollowWarning] = useState(!isFollowing);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !canSendMessage) return;

    // TODO: Send to API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    // TODO: Update message in API
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              content: newContent,
              isEdited: true,
              editedAt: new Date(),
            }
          : m
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    // TODO: Delete from API
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const handleViewProfile = (userId: string) => {
    // TODO: Open profile modal
    console.log('Viewing profile:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className={`${isMobile ? 'p-3' : 'p-4'} flex items-center justify-between`}>
          <div className="flex items-center gap-3 flex-1">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowRight size={20} />
            </Button>
            <div
              className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleViewProfile(otherUser.id)}
            >
              {otherUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewProfile(otherUser.id)}
                  className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate`}
                >
                  {otherUser.name}
                </button>
                {otherUser.isVerified && <UserBadge user={otherUser} size="sm" />}
              </div>
              <p className="text-xs text-gray-500">نشط قبل دقيقة</p>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleViewProfile(otherUser.id)} className="cursor-pointer">
                عرض الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsReportOpen(true)} className="cursor-pointer text-red-600">
                <Flag size={16} className="mr-2" />
                إبلاغ عن المستخدم
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">لا توجد رسائل بعد</p>
            <p className="text-gray-400 text-sm">ابدأ المحادثة الآن</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                user={message.senderId === currentUserId ? { id: currentUserId, isVerified: true, userLevel: 'user', name: 'You' } : otherUser}
                isMobile={isMobile}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Follow Warning */}
      {showFollowWarning && !isFollowing && (
        <div className="bg-amber-50 border-t border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            👤 يجب عليك متابعة هذا المستخدم لإرسال رسائل
          </p>
        </div>
      )}

      {/* Message Input */}
      <div className={`bg-white border-t border-gray-200 ${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={canSendMessage ? "اكتب رسالة..." : "يجب أن تتابع هذا المستخدم أولاً"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!canSendMessage}
            className={isMobile ? 'text-sm' : ''}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
          >
            {isMobile ? '➤' : 'إرسال'}
          </Button>
        </div>
      </div>

      {/* Report Modal */}
      <UserReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={otherUser.id}
        reportedUserName={otherUser.name}
      />
    </div>
  );
}
