'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Edit, X, MoreVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Message } from '@/types/advanced';
import { MESSAGE_EDIT_TIME_LIMIT } from '@/constants/advanced';
import UserBadge from '@/components/UserBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  user: any;
  isMobile?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export default function MessageItem({
  message,
  isOwn,
  user,
  isMobile = false,
  onEdit,
  onDelete,
  onViewProfile,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [canEdit, setCanEdit] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // تحديد إمكانية التعديل
  useEffect(() => {
    if (!isOwn) return;

    const checkEditability = () => {
      const now = new Date();
      const canEditUntil = new Date(message.canEditUntil);
      const diff = canEditUntil.getTime() - now.getTime();

      if (diff <= 0) {
        setCanEdit(false);
        setTimeLeft('');
        return;
      }

      setCanEdit(true);
      const seconds = Math.floor(diff / 1000);
      setTimeLeft(`(${seconds}ث متبقية)`);
    };

    checkEditability();
    const interval = setInterval(checkEditability, 1000);
    return () => clearInterval(interval);
  }, [isOwn, message.canEditUntil]);

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit?.(message.id, editContent);
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onViewProfile?.(message.senderId)}
      >
        {user?.name?.charAt(0) || 'U'}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} flex-1 max-w-xs`}>
        {/* User Info */}
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => onViewProfile?.(message.senderId)}
            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {user?.name}
          </button>
          {user?.isVerified && <UserBadge user={user} size="sm" />}
        </div>

        {/* Message Bubble */}
        {!isEditing ? (
          <div
            className={`relative group rounded-lg px-4 py-2 ${isMobile ? 'text-sm' : ''} ${
              isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
            }`}
          >
            <p className="break-words">{message.content}</p>
            {message.isEdited && (
              <span className={`text-xs mt-1 block ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                (تم التعديل)
              </span>
            )}

            {/* Edit/Delete Menu */}
            {isOwn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  >
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Edit size={14} className="mr-2" />
                      تعديل {timeLeft}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete?.(message.id)}
                    className="cursor-pointer text-red-600"
                  >
                    <X size={14} className="mr-2" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-sm flex-1"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditContent(message.content);
              }}
              className="h-8"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.createdAt).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
