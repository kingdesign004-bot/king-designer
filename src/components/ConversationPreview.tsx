// src/components/ConversationPreview.tsx - معاينة آخر رسالة والحالة
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CheckCheck, Clock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  senderId: string;
}

interface ConversationPreviewProps {
  userId: string;
  userName: string;
  avatar?: string;
  lastMessage?: Message;
  lastSeen?: Date;
  isOnline?: boolean;
}

export function ConversationPreview({
  userId,
  userName,
  avatar,
  lastMessage,
  lastSeen,
  isOnline,
}: ConversationPreviewProps) {
  const getStatusIcon = () => {
    if (!lastMessage) return null;

    switch (lastMessage.status) {
      case 'pending':
        return <Clock size={16} className="text-charcoal-400" />;
      case 'sent':
        return <CheckCheck size={16} className="text-charcoal-400" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-charcoal-600" />;
      case 'read':
        return <CheckCheck size={16} className="text-gold-500" />;
      default:
        return null;
    }
  };

  const getLastSeenText = () => {
    if (isOnline) return 'نشط الآن';
    if (!lastSeen) return '';

    return `آخر ظهور: ${formatDistanceToNow(lastSeen, {
      addSuffix: false,
      locale: ar,
    })}`;
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-ivory-50 transition-colors">
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatar || '/default-avatar.png'}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-charcoal-900 truncate">{userName}</h3>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <p className="text-sm text-charcoal-600 truncate flex-1">
            {lastMessage?.content || 'لا توجد رسائل'}
          </p>
        </div>
        <p className="text-xs text-charcoal-500 mt-1">{getLastSeenText()}</p>
      </div>

      {/* Time */}
      {lastMessage && (
        <span className="text-xs text-charcoal-500 flex-shrink-0">
          {formatDistanceToNow(lastMessage.createdAt, {
            addSuffix: false,
            locale: ar,
          })}
        </span>
      )}
    </div>
  );
}
