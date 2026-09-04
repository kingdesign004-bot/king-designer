// User Block List
export interface BlockList {
  userId: string;
  blockedUsers: string[];
}

// Post/Content
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  contentPreview?: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  likes?: number;
  comments?: number;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  blockedUsers?: string[];
}

// Comment
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes?: number;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'report';
  message: string;
  fromUserId: string;
  fromUserName: string;
  relatedPostId?: string;
  read: boolean;
  createdAt: Date;
}
