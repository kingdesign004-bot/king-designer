export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  userLevel: 'user' | 'pro' | 'vip';
  badgeColor?: string;
  createdAt: Date;
}

export interface UserBadge {
  level: 'user' | 'pro' | 'vip';
  color: string;
  label: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: Attachment[];
  isEdited: boolean;
  editedAt?: Date;
  canEditUntil: Date;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  createdAt: Date;
}

export interface Attachment {
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  duration?: number; // للفيديو بالثواني
}

export interface BlockInfo {
  id: string;
  userId: string;
  blockedUserId: string;
  reason?: string;
  isPermanent: boolean;
  unblockAt?: Date;
  createdAt: Date;
}

export interface AdminTicket {
  id: string;
  userId: string;
  type: 'complaint' | 'appeal' | 'request';
  subject: string;
  content: string;
  attachments?: Attachment[];
  status: 'open' | 'in_progress' | 'resolved';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReport {
  id: string;
  reportedByUserId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  attachments?: Attachment[];
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
}
