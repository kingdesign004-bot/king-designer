'use client';

import React from 'react';
import { USER_LEVELS } from '@/constants/advanced';
import { User } from '@/types/advanced';

interface UserBadgeProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function UserBadge({
  user,
  size = 'md',
  showLabel = true,
}: UserBadgeProps) {
  if (user.userLevel === 'user' && !user.isVerified) {
    return null;
  }

  const level = USER_LEVELS[user.userLevel];
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white ${
        sizeClasses[size]
      }`}
      style={{ backgroundColor: level.color }}
      title={`${level.label}${user.isVerified ? ' ✓' : ''}`}
    >
      {showLabel && level.label}
      {user.isVerified && '✓'}
    </span>
  );
}
