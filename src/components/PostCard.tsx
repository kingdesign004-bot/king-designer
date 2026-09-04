'use client';

import React, { useState } from 'react';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, MoreVertical, Flag, Ban, Eye, Edit, Trash2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { truncateText, formatPostDate } from '@/utils/postUtils';

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  isMobile?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onDownload?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onReport?: (postId: string) => void;
  onBlock?: (userId: string) => void;
}

export default function PostCard({
  post,
  isOwner = false,
  isMobile = false,
  onEdit,
  onDelete,
  onDownload,
  onFollow,
  onReport,
  onBlock,
}: PostCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isMobile ? 'p-3' : 'p-5'}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold`}>
              {post.userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 truncate`}>
                {post.userName}
              </p>
              <p className="text-xs text-gray-500">{formatPostDate(new Date(post.createdAt))}</p>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isOwner ? (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(post.id)} className="cursor-pointer">
                    <Edit size={16} className="mr-2" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(post.id)} className="cursor-pointer text-red-600">
                    <Trash2 size={16} className="mr-2" />
                    حذف
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload?.(post.id)} className="cursor-pointer">
                    <Download size={16} className="mr-2" />
                    تنزيل
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => onFollow?.(post.userId)} className="cursor-pointer">
                    متابعة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReport?.(post.id)} className="cursor-pointer">
                    <Flag size={16} className="mr-2" />
                    إبلاغ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBlock?.(post.userId)} className="cursor-pointer text-red-600">
                    <Ban size={16} className="mr-2" />
                    حظر
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 mb-2`}>
          {post.title}
        </h3>

        {/* Content */}
        <p
          className={`${isMobile ? 'text-sm line-clamp-2' : 'text-base line-clamp-3'} text-gray-700 mb-3 cursor-pointer hover:text-blue-600 transition-colors`}
          onClick={() => setIsPreviewOpen(true)}
        >
          {truncateText(post.content)}
        </p>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className={`w-full ${isMobile ? 'h-48' : 'h-64'} object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setIsPreviewOpen(true)}
          />
        )}

        {/* Interactions */}
        <div className={`flex gap-4 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 border-t border-gray-200 pt-3`}>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-red-600 transition-colors ${
              isLiked ? 'text-red-600' : ''
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{post.likes || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <MessageCircle size={18} />
            <span>{post.comments || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </Card>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className={isMobile ? 'max-w-full mx-2' : 'max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>{post.title}</DialogTitle>
          </DialogHeader>
          <div className={isMobile ? 'max-h-96 overflow-y-auto' : 'max-h-96 overflow-y-auto'}>
            <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxed">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-lg mb-4"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
