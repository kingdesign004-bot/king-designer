// src/server/routers/follow.ts - تحديث نظام المتابعة
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const followRouter = router({
  // متابعة مستخدم
  follow: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.userId;
      if (!currentUserId) throw new Error('Not authenticated');

      // التحقق من عدم المتابعة المتبادلة
      const existingFollow = await ctx.db.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: input.userId,
        },
      });

      if (existingFollow) {
        return { success: false, message: 'Already following' };
      }

      await ctx.db.follow.create({
        data: {
          followerId: currentUserId,
          followingId: input.userId,
        },
      });

      return { success: true, message: 'Followed successfully' };
    }),

  // إلغاء المتابعة
  unfollow: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.userId;
      if (!currentUserId) throw new Error('Not authenticated');

      await ctx.db.follow.deleteMany({
        where: {
          followerId: currentUserId,
          followingId: input.userId,
        },
      });

      return { success: true, message: 'Unfollowed successfully' };
    }),

  // التحقق من حالة المتابعة
  isFollowing: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.userId;
      if (!currentUserId) return false;

      const follow = await ctx.db.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: input.userId,
        },
      });

      return !!follow;
    }),

  // الحصول على المتابعين (باستثناء المتابعة المتبادلة من الاقتراحات)
  getSuggestions: publicProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.userId;
    if (!currentUserId) throw new Error('Not authenticated');

    // استخراج المستخدمين الذين لم يتم متابعتهم وليس لديهم متابعة متبادلة
    const suggestions = await ctx.db.user.findMany({
      where: {
        AND: [
          {
            followers: {
              none: {
                followerId: currentUserId,
              },
            },
          },
          {
            following: {
              none: {
                followingId: currentUserId,
              },
            },
          },
          { id: { not: currentUserId } },
        ],
      },
      take: 10,
    });

    return suggestions;
  }),
});
