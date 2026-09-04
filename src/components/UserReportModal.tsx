'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Paperclip, Send, X, Play, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REPORT_REASONS } from '@/constants/advanced';
import { Attachment } from '@/types/advanced';

interface UserReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
}

export default function UserReportModal({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
}: UserReportModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف يجب أن لا يتجاوز 10 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        let attachmentType: 'image' | 'video' | 'document' = 'document';
        
        if (file.type.startsWith('image/')) attachmentType = 'image';
        else if (file.type.startsWith('video/')) attachmentType = 'video';

        setAttachments((prev) => [...prev, {
          type: attachmentType,
          url,
          name: file.name,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !description.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Send to API
      console.log({ reportedUserId, reason, description, attachments });
      alert('تم إرسال البلاغ بنجاح. سيتم مراجعته من قبل فريق الدعم');
      setReason('');
      setDescription('');
      setAttachments([]);
      onClose();
    } catch (error) {
      alert('حدث خطأ في الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={isMobile ? 'max-w-full mx-2' : 'max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>
              الإبلاغ عن المستخدم: <strong>{reportedUserName}</strong>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سبب البلاغ *
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر سبب البلاغ" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تفاصيل البلاغ *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وضح لنا المزيد عن هذا البلاغ..."
                rows={6}
                className={isMobile ? 'text-sm' : ''}
                disabled={isSubmitting}
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المرفقات (صور، فيديو، مستندات - اختياري)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-500 transition-colors">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Paperclip className="text-gray-400 mb-2" size={32} />
                    <p className={`${isMobile ? 'text-sm' : ''} text-gray-600 mb-1`}>
                      اضغط لإضافة ملفات
                    </p>
                    <p className="text-xs text-gray-500">الحد الأقصى للفيديو: دقيقة واحدة</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">المرفقات ({attachments.length})</p>
                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {attachments.map((attachment, index) => (
                    <Card
                      key={index}
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setPreviewAttachment(attachment)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {attachment.type === 'image' && (
                          <img src={attachment.url} alt={attachment.name} className="w-10 h-10 object-cover rounded" />
                        )}
                        {attachment.type === 'video' && (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Play size={16} className="text-gray-600" />
                          </div>
                        )}
                        {attachment.type === 'document' && (
                          <FileText size={20} className="text-blue-600" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} className="text-gray-400" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAttachments((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="ml-2 text-red-600 hover:bg-red-50 rounded p-1"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className={`flex gap-3 ${isMobile ? 'flex-col-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className={isMobile ? 'w-full' : ''}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className={`${isMobile ? 'w-full' : ''} bg-red-600 hover:bg-red-700 flex items-center gap-2`}
                disabled={isSubmitting || !reason || !description.trim()}
              >
                <Send size={18} />
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال البلاغ'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewAttachment} onOpenChange={() => setPreviewAttachment(null)}>
        <DialogContent className={isMobile ? 'max-w-full mx-2' : 'max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>معاينة</DialogTitle>
          </DialogHeader>
          {previewAttachment?.type === 'image' && (
            <img src={previewAttachment.url} alt={previewAttachment.name} className="w-full rounded-lg" />
          )}
          {previewAttachment?.type === 'video' && (
            <video src={previewAttachment.url} controls className="w-full rounded-lg" />
          )}
          {previewAttachment?.type === 'document' && (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText size={48} className="text-blue-600 mb-4" />
              <p className="text-lg font-semibold text>{previewAttachment.name}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
