'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';

export default function CreatePostPage() {
  const [router] = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log('Creating post:', formData);
    setFormData({ title: '', content: '', image: '' });
    setImagePreview('');
    // Redirect to feed
    router.push('/feed');
  };

  const handleClear = () => {
    setFormData({ title: '', content: '', image: '' });
    setImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className={`max-w-2xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
        {/* Header */}
        <div className={`mb-6 ${isMobile ? 'text-center' : ''}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            أنشئ منشور جديد
          </h1>
          <p className="text-gray-600">شارك إبداعاتك مع المجتمع</p>
        </div>

        {/* Form Card */}
        <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white shadow-lg`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="أدخل عنوان المنشور"
                className={isMobile ? 'text-sm' : ''}
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="أكتب محتوى المنشور..."
                rows={6}
                className={isMobile ? 'text-sm' : ''}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة (اختيارية)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <p className={`${isMobile ? 'text-sm' : ''} text-gray-600 mb-1`}>
                      اضغط لتحميل صورة
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF (الحد الأقصى 10 ميجا)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative inline-block w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 ${isMobile ? 'flex-col-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className={isMobile ? 'w-full' : ''}
              >
                مسح
              </Button>
              <Button
                type="submit"
                className={`${isMobile ? 'w-full' : 'flex-1'} bg-blue-600 hover:bg-blue-700`}
              >
                نشر المنشور
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className={`mt-6 ${isMobile ? 'p-3' : 'p-4'} bg-blue-50 border border-blue-200 rounded-lg`}>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800`}>
            💡 تأكد من أن المحتوى يتوافق مع سياسات المجتمع قبل النشر
          </p>
        </div>
      </div>
    </div>
  );
}
