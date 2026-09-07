// src/components/UserCard.tsx - بطاقة المستخدم المحسّنة
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { UserPlus, UserCheck } from 'lucide-react';

interface UserCardProps {
  userId: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export function UserCard({ userId, name, avatar, bio }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const followMutation = trpc.follow.follow.useMutation();
  const unfollowMutation = trpc.follow.unfollow.useMutation();

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync({ userId });
        setIsFollowing(false);
      } else {
        await followMutation.mutateAsync({ userId });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gold-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        {avatar && <img src={avatar} alt={name} className="w-16 h-16 rounded-full" />}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-charcoal-900">{name}</h3>
          {bio && <p className="text-sm text-charcoal-600">{bio}</p>}
        </div>
      </div>

      {/* لا تظهر زر المتابعة إذا كانت المتابعة متبادلة */}
      {!isFollowing && (
        <button
          onClick={handleFollowToggle}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          متابعة
        </button>
      )}

      {isFollowing && (
        <button
          disabled
          className="w-full bg-gray-100 text-gray-500 font-semibold py-2 rounded-lg cursor-default flex items-center justify-center gap-2"
        >
          <UserCheck size={20} />
          متابع
        </button>
      )}
    </div>
  );
}
