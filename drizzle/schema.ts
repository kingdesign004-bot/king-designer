import { serial, text, timestamp, varchar, pgEnum, pgTable, integer, uniqueIndex, index } from "drizzle-orm/pg-core";

const roleEnum = pgEnum("user_role", ["user", "admin"]);
const visibilityEnum = pgEnum("post_visibility", ["public", "followers", "private"]);
const layoutEnum = pgEnum("post_layout", ["grid", "carousel", "masonry", "single", "split"]);
const mediaTypeEnum = pgEnum("media_type", ["image", "video", "audio", "gif", "svg"]);
const followStatusEnum = pgEnum("follow_status", ["pending", "accepted"]);
const notifTypeEnum = pgEnum("notif_type", ["follow", "like", "comment", "reply", "share", "message"]);
const msgTypeEnum = pgEnum("msg_type", ["text", "image", "video", "audio"]);
const reportTargetEnum = pgEnum("report_target", ["user", "post", "comment", "message"]);
const reportStatusEnum = pgEnum("report_status", ["open", "reviewed", "dismissed", "resolved"]);
const creditKindEnum = pgEnum("credit_kind", ["welcome", "daily", "purchase", "spend", "refund", "reward", "adjustment"]);
const payStatusEnum = pgEnum("pay_status", ["initiated", "succeeded", "failed", "refunded"]);
const subPlanEnum = pgEnum("sub_plan", ["free", "pro", "vip"]);
const subStatusEnum = pgEnum("sub_status", ["active", "canceled"]);
const rewardTypeEnum = pgEnum("reward_type", ["welcome", "daily", "referral", "manual"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  handle: varchar("handle", { length: 80 }).unique(),
  publicId: varchar("publicId", { length: 20 }).unique(),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  coverUrl: text("coverUrl"),
  bio: text("bio"),
  country: varchar("country", { length: 120 }),
  countryLocked: integer("countryLocked").default(1).notNull(),
  specialty: varchar("specialty", { length: 160 }),
  level: varchar("level", { length: 80 }),
  verified: integer("verified").default(0).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  badgeColor: varchar("badgeColor", { length: 50 }),
  nameColor: varchar("nameColor", { length: 50 }),
  nameGradient: varchar("nameGradient", { length: 120 }),
  isBanned: integer("isBanned").default(0).notNull(),
  banUntil: timestamp("banUntil"),
  banReason: text("banReason"),
  bannedBy: integer("bannedBy"),
  deviceFingerprint: varchar("deviceFingerprint", { length: 255 }),
  experience: text("experience"),
  skills: text("skills"),
  tools: text("tools"),
  portfolioUrl: varchar("portfolioUrl", { length: 500 }),
  yearsOfExperience: varchar("yearsOfExperience", { length: 20 }),
  availability: varchar("availability", { length: 100 }),
  isOnline: integer("isOnline").default(0).notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: integer("authorId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  hashtags: text("hashtags"),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  layoutType: layoutEnum("layoutType").default("grid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const postShares = pgTable("post_shares", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postMedia = pgTable("post_media", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  duration: integer("duration"),
  caption: text("caption"),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("followerId").notNull(),
  followingId: integer("followingId").notNull(),
  status: followStatusEnum("status").default("accepted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  blockerId: integer("blockerId").notNull(),
  blockedId: integer("blockedId").notNull(),
  isPermanent: integer("isPermanent").default(0).notNull(),
  unblockAt: timestamp("unblockAt"),
  reason: text("reason"),
  isAdminBan: integer("isAdminBan").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  authorId: integer("authorId").notNull(),
  parentId: integer("parentId"),
  body: text("body").notNull(),
  mediaUrl: text("mediaUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("commentId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  recipientId: integer("recipientId").notNull(),
  actorId: integer("actorId").notNull(),
  type: notifTypeEnum("type").notNull(),
  postId: integer("postId"),
  commentId: integer("commentId"),
  body: text("body"),
  isRead: integer("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mediaViews = pgTable("media_views", {
  id: serial("id").primaryKey(),
  mediaId: integer("mediaId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const conversationMembers = pgTable("conversation_members", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  userId: integer("userId").notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull(),
  senderId: integer("senderId").notNull(),
  messageType: msgTypeEnum("messageType").default("text").notNull(),
  body: text("body"),
  mediaUrl: text("mediaUrl"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const splashSlides = pgTable("splash_slides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("imageUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  isActive: integer("isActive").default(1).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporterId").notNull(),
  targetType: reportTargetEnum("targetType").notNull(),
  targetId: integer("targetId").notNull(),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").default("open").notNull(),
  reviewerId: integer("reviewerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const creditLedger = pgTable("credit_ledger", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  amount: integer("amount").notNull(),
  kind: creditKindEnum("kind").notNull(),
  referenceId: varchar("referenceId", { length: 160 }),
  createdById: integer("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  provider: varchar("provider", { length: 60 }).notNull(),
  providerPaymentId: varchar("providerPaymentId", { length: 180 }).unique(),
  amountCents: integer("amountCents").notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  status: payStatusEnum("status").default("initiated").notNull(),
  refundId: varchar("refundId", { length: 180 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  plan: subPlanEnum("plan").default("free").notNull(),
  status: subStatusEnum("status").default("active").notNull(),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt"),
});

export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  apiUrl: text("apiUrl"),
  isActive: integer("isActive").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  providerId: integer("providerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  modelKey: varchar("modelKey", { length: 180 }).notNull(),
  pricingCents: integer("pricingCents").default(0).notNull(),
  isActive: integer("isActive").default(0).notNull(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  credits: integer("credits").default(0).notNull(),
  amountCents: integer("amountCents").default(0).notNull(),
  isActive: integer("isActive").default(1).notNull(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: rewardTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("adminId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PostShare = typeof postShares.$inferSelect;
