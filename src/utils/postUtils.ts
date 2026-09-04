import { Post } from '@/types';

export const filterPostsByBlockList = (
  posts: Post[],
  userId: string,
  blockedUsers: string[]
): Post[] => {
  return posts.filter(post => !blockedUsers.includes(post.userId));
};

export const formatPostDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'للتو';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  
  return new Date(date).toLocaleDateString('ar-SA');
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
