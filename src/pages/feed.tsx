'use client';

import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Heart, MessageCircle, Share2, Eye, Flag, Ban, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  likes?: number;
  comments?: number;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery) ||
    post.content.toLowerCase().includes(searchQuery)
  );

  const handleFollow = (userId: string) => {
    alert(`Following ${userId}`);
  };

  const handleReport = (postId: string) => {
    alert(`Report submitted for post ${postId}`);
  };

  const handleBlock = (userId: string) => {
    alert(`Blocked user ${userId}`);
  };

  const handleEdit = (postId: string) => {
    alert(`Edit post ${postId}`);
  };

  const handleDelete = (postId: string) => {
    alert(`Delete post ${postId}`);
  };

  const handleDownload = (postId: string) => {
    alert(`Download post ${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar - Desktop and Mobile */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className={`${isMobile ? 'p-3' : 'p-4'} max-w-4xl mx-auto`}>
          <div className="relative">
            <Search className={`absolute ${isMobile ? 'left-3 top-2.5' : 'left-4 top-3'} text-gray-400`} size={isMobile ? 18 : 20} />
            <Input
              type="text"
              placeholder={isMobile ? "ابحث..." : "ابحث عن منشورات..."}
              className={`${isMobile ? 'pl-9 py-2 text-sm' : 'pl-12 py-3'} w-full rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className={`max-w-4xl mx-auto ${isMobile ? 'p-3 space-y-3' : 'p-6 space-y-6'}`}>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد منشورات</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${isMobile ? 'p-3' : 'p-5'}`}>
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gray-300 rounded-full flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 truncate`}>{post.userName}</p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleFollow(post.userId)} className="cursor-pointer">
                      متابعة
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReport(post.id)} className="cursor-pointer">
                      <Flag size={16} className="mr-2" />
                      إبلاغ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBlock(post.userId)} className="cursor-pointer text-red-600">
                      <Ban size={16} className="mr-2" />
                      حظر
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Post Title */}
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 mb-2`}>{post.title}</h3>

              {/* Post Content Preview */}
              <p
                className={`${isMobile ? 'text-sm line-clamp-2' : 'text-base line-clamp-3'} text-gray-700 mb-3 cursor-pointer hover:text-blue-600`}
                onClick={() => {
                  setSelectedPost(post);
                  setIsPreviewOpen(true);
                }}
              >
                {post.content}
              </p>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className={`w-full ${isMobile ? 'h-48' : 'h-64'} object-cover rounded-lg mb-4 cursor-pointer`}
                  onClick={() => {
                    setSelectedPost(post);
                    setIsPreviewOpen(true);
                  }}
                />
              )}

              {/* Post Footer - Interactions */}
              <div className={`flex gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mb-4 border-t border-gray-200 pt-3`}>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <Heart size={18} />
                  <span>{post.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <MessageCircle size={18} />
                  <span>{post.comments || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Owner Actions - Edit, Delete, Download */}
              <div className={`flex gap-2 border-t border-gray-200 pt-3 ${isMobile ? 'flex-wrap gap-1' : ''}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${isMobile ? 'text-xs py-1' : ''}`}
                  onClick={() => handleEdit(post.id)}
                >
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${isMobile ? 'text-xs py-1' : ''}`}
                  onClick={() => handleDelete(post.id)}
                >
                  حذف
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${isMobile ? 'text-xs py-1' : ''}`}
                  onClick={() => handleDownload(post.id)}
                >
                  <Download size={16} className="mr-1" />
                  تنزيل
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Content Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className={isMobile ? 'max-w-full mx-2' : 'max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className={isMobile ? 'max-h-96 overflow-y-auto' : 'max-h-96 overflow-y-auto'}>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{selectedPost?.content}</p>
            {selectedPost?.image && (
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full rounded-lg mb-4"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
