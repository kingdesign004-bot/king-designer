import { pgTable, varchar, text, timestamp, uuid, index, boolean, integer, json } from 'drizzle-orm/pg-core';

// المستخدمون
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatar: text('avatar'),
  bio: text('bio'),
  isVerified: boolean('is_verified').default(false),
  userLevel: varchar('user_level', { length: 50 }).default('user'), // user, pro, vip
  badgeColor: varchar('badge_color', { length: 50 }), // لون الشارة
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// المنشورات
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('posts_user_id_idx').on(table.userId),
}));

// الرسائل والمحادثات
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  attachments: json('attachments'), // [{type, url, name}]
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at'),
  canEditUntil: timestamp('can_edit_until'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  conversationIdIdx: index('messages_conversation_id_idx').on(table.conversationId),
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
}));

// المحادثات
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  participant1Id: uuid('participant1_id').notNull().references(() => users.id),
  participant2Id: uuid('participant2_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  participant1Idx: index('conversations_participant1_idx').on(table.participant1Id),
  participant2Idx: index('conversations_participant2_idx').on(table.participant2Id),
}));

// الرسائل المباشرة
export const directMessages = pgTable('direct_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  recipientId: uuid('recipient_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  attachments: json('attachments'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// قائمة المتابعة
export const follows = pgTable('follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('follower_id').notNull().references(() => users.id),
  followingId: uuid('following_id').notNull().references(() => users.id),
  status: varchar('status', { length: 50 }).default('pending'), // pending, accepted
  createdAt: timestamp('created_at').defaultNow(),
});

// قائمة الحظر
export const blockList = pgTable('block_list', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  blockedUserId: uuid('blocked_user_id').notNull().references(() => users.id),
  reason: text('reason'),
  isPermanent: boolean('is_permanent').default(false),
  unblockAt: timestamp('unblock_at'), // للحظر المؤقت
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('block_list_user_id_idx').on(table.userId),
  blockedUserIdIdx: index('block_list_blocked_user_id_idx').on(table.blockedUserId),
}));

// صندوق التواصل مع الإدارة
export const adminTickets = pgTable('admin_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // complaint, appeal, request
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  attachments: json('attachments'), // [{type: 'image'|'video'|'document', url, name}]
  status: varchar('status', { length: 50 }).default('open'), // open, in_progress, resolved
  response: text('response'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('admin_tickets_user_id_idx').on(table.userId),
  statusIdx: index('admin_tickets_status_idx').on(table.status),
}));

// الإبلاغ عن المستخدمين
export const userReports = pgTable('user_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportedByUserId: uuid('reported_by_user_id').notNull().references(() => users.id),
  reportedUserId: uuid('reported_user_id').notNull().references(() => users.id),
  reason: varchar('reason', { length: 255 }).notNull(),
  description: text('description').notNull(),
  attachments: json('attachments'),
  status: varchar('status', { length: 50 }).default('pending'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  reportedUserIdIdx: index('user_reports_reported_user_id_idx').on(table.reportedUserId),
}));

// التعليقات
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  postIdIdx: index('comments_post_id_idx').on(table.postId),
}));
