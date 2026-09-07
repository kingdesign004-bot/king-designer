// src/server/routers/messages.ts - تحديث مسار الرسائل
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const messagesRouter = router({
  // الحصول على قائمة المحادثات مع آخر رسالة والحالة
  getConversations: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new Error('Not authenticated');

    const conversations = await ctx.db.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        participants: {
          where: { id: { not: userId } },
          include: {
            lastSeen: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return conversations.map(conv => ({
      id: conv.id,
      participantId: conv.participants[0]?.id,
      participantName: conv.participants[0]?.name,
      participantAvatar: conv.participants[0]?.avatar,
      lastMessage: conv.messages[0] || null,
      lastSeen: conv.participants[0]?.lastSeen,
      isOnline: conv.participants[0]?.isOnline || false,
    }));
  }),

  // تحديث حالة آخر ظهور
  updateLastSeen: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Not authenticated');

      await ctx.db.user.update({
        where: { id: userId },
        data: {
          lastSeen: new Date(),
        },
      });

      return { success: true };
    }),

  // الحصول على حالة الرسالة
  getMessageStatus: publicProcedure
    .input(z.object({ messageId: z.string() }))
    .query(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.messageId },
        include: {
          readBy: true,
        },
      });

      if (!message) return null;

      let status: 'pending' | 'sent' | 'delivered' | 'read' = 'sent';

      if (message.readBy.length > 0) {
        status = 'read';
      } else if (message.deliveredAt) {
        status = 'delivered';
      }

      return {
        id: message.id,
        status,
        deliveredAt: message.deliveredAt,
        readBy: message.readBy,
      };
    }),
});
