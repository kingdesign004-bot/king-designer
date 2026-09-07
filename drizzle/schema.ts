import { int, text, timestamp, varchar, mysqlEnum, mysqlTable, uniqueIndex, index } from "drizzle-orm/mysql-core";

const roleEnum = (column: string) => mysqlEnum(column, ["user", "admin"] as const);
const visibilityEnum = (column: string) => mysqlEnum(column, ["public", "followers", "private"] as const);
const layoutEnum = (column: string) => mysqlEnum(column, ["grid", "carousel", "masonry", "single", "split"] as const);
const mediaTypeEnum = (column: string) => mysqlEnum(column, ["image", "video", "audio", "gif", "svg", "pdf"] as const);
const followStatusEnum = (column: string) => mysqlEnum(column, ["pending", "accepted"] as const);
const notifTypeEnum = (column: string) => mysqlEnum(column, ["follow", "like", "comment", "reply", "share", "message"] as const);
const msgTypeEnum = (column: string) => mysqlEnum(column, ["text", "image", "video", "audio"] as const);
const reportTargetEnum = (column: string) => mysqlEnum(column, ["user", "post", "comment", "message", "story"] as const);
const reportStatusEnum = (column: string) => mysqlEnum(column, ["open", "reviewed", "dismissed", "resolved"] as const);
const creditKindEnum = (column: string) => mysqlEnum(column, ["welcome", "daily", "purchase", "spend", "refund", "reward", "adjustment"] as const);
const payStatusEnum = (column: string) => mysqlEnum(column, ["initiated", "succeeded", "failed", "refunded"] as const);
const subPlanEnum = (column: string) => mysqlEnum(column, ["free", "pro", "vip"] as const);
const subStatusEnum = (column: string) => mysqlEnum(column, ["active", "canceled"] as const);
const rewardTypeEnum = (column: string) => mysqlEnum(column, ["welcome", "daily", "referral", "manual"] as const);
const accountTypeEnum = (column: string) => mysqlEnum(column, ["client", "designer"] as const);
const verificationStatusEnum = (column: string) => mysqlEnum(column, ["none", "pending", "approved", "rejected"] as const);
const ticketStatusEnum = (column: string) => mysqlEnum(column, ["open", "in_progress", "resolved", "closed"] as const);

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  handle: varchar("handle", { length: 80 }).unique(),
  publicId: varchar("publicId", { length: 20 }).unique(),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  accountType: accountTypeEnum("accountType").default("client").notNull(),
  birthYear: int("birthYear"),
  verificationStatus: verificationStatusEnum("verificationStatus").default("none").notNull(),
  verificationNote: text("verificationNote"),
  idFrontUrl: text("idFrontUrl"),
  idBackUrl: text("idBackUrl"),
  cvUrl: text("cvUrl"),
  avatarUrl: text("avatarUrl"),
  coverUrl: text("coverUrl"),
  bio: text("bio"),
  country: varchar("country", { length: 120 }),
  countryLocked: int("countryLocked").default(1).notNull(),
  specialty: varchar("specialty", { length: 160 }),
  level: varchar("level", { length: 80 }),
  verified: int("verified").default(0).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  badgeColor: varchar("badgeColor", { length: 50 }),
  nameColor: varchar("nameColor", { length: 50 }),
  nameGradient: varchar("nameGradient", { length: 120 }),
  isBanned: int("isBanned").default(0).notNull(),
  banUntil: timestamp("banUntil"),
  banReason: text("banReason"),
  bannedBy: int("bannedBy"),
  deviceFingerprint: varchar("deviceFingerprint", { length: 255 }),
  experience: text("experience"),
  skills: text("skills"),
  tools: text("tools"),
  portfolioUrl: varchar("portfolioUrl", { length: 500 }),
  yearsOfExperience: varchar("yearsOfExperience", { length: 20 }),
  availability: varchar("availability", { length: 100 }),
  clientCompany: varchar("clientCompany", { length: 180 }),
  clientBudget: varchar("clientBudget", { length: 120 }),
  clientNeeds: text("clientNeeds"),
  isOnline: int("isOnline").default(0).notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  hashtags: text("hashtags"),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  layoutType: layoutEnum("layoutType").default("grid").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const postShares = mysqlTable("post_shares", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postMedia = mysqlTable("post_media", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  views: int("views").default(0).notNull(),
  duration: int("duration"),
  caption: text("caption"),
});

export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  status: followStatusEnum("status").default("accepted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const blocks = mysqlTable("blocks", {
  id: int("id").autoincrement().primaryKey(),
  blockerId: int("blockerId").notNull(),
  blockedId: int("blockedId").notNull(),
  isPermanent: int("isPermanent").default(0).notNull(),
  unblockAt: timestamp("unblockAt"),
  reason: text("reason"),
  isAdminBan: int("isAdminBan").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postLikes = mysqlTable("post_likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  parentId: int("parentId"),
  body: text("body").notNull(),
  mediaUrl: text("mediaUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const commentLikes = mysqlTable("comment_likes", {
  id: int("id").autoincrement().primaryKey(),
  commentId: int("commentId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientId: int("recipientId").notNull(),
  actorId: int("actorId").notNull(),
  type: notifTypeEnum("type").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  body: text("body"),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mediaViews = mysqlTable("media_views", {
  id: int("id").autoincrement().primaryKey(),
  mediaId: int("mediaId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const conversationMembers = mysqlTable("conversation_members", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  isPinned: int("isPinned").default(0).notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  messageType: msgTypeEnum("messageType").default("text").notNull(),
  body: text("body"),
  mediaUrl: text("mediaUrl"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const splashSlides = mysqlTable("splash_slides", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("imageUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  targetType: reportTargetEnum("targetType").notNull(),
  targetId: int("targetId").notNull(),
  reason: text("reason").notNull(),
  attachmentUrl: text("attachmentUrl"),
  attachmentType: varchar("attachmentType", { length: 80 }),
  attachmentDuration: int("attachmentDuration"),
  status: reportStatusEnum("status").default("open").notNull(),
  reviewerId: int("reviewerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const verificationRequests = mysqlTable("verification_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  idFrontUrl: text("idFrontUrl").notNull(),
  idBackUrl: text("idBackUrl").notNull(),
  cvUrl: text("cvUrl").notNull(),
  status: verificationStatusEnum("status").default("pending").notNull(),
  note: text("note"),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 180 }).notNull(),
  body: text("body").notNull(),
  attachmentUrl: text("attachmentUrl"),
  attachmentType: varchar("attachmentType", { length: 80 }),
  attachmentDuration: int("attachmentDuration"),
  status: ticketStatusEnum("status").default("open").notNull(),
  adminReply: text("adminReply"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  caption: text("caption"),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storyInteractions = mysqlTable("story_interactions", {
  id: int("id").autoincrement().primaryKey(),
  storyId: int("storyId").notNull(),
  userId: int("userId").notNull(),
  kind: mysqlEnum("kind", ["view", "like", "comment"] as const).notNull(),
  body: text("body"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const creditLedger = mysqlTable("credit_ledger", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  kind: creditKindEnum("kind").notNull(),
  referenceId: varchar("referenceId", { length: 160 }),
  createdById: int("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: varchar("provider", { length: 60 }).notNull(),
  providerPaymentId: varchar("providerPaymentId", { length: 180 }).unique(),
  amountCents: int("amountCents").notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  status: payStatusEnum("status").default("initiated").notNull(),
  refundId: varchar("refundId", { length: 180 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: subPlanEnum("plan").default("free").notNull(),
  status: subStatusEnum("status").default("active").notNull(),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt"),
});

export const aiProviders = mysqlTable("ai_providers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  apiUrl: text("apiUrl"),
  isActive: int("isActive").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const aiModels = mysqlTable("ai_models", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  modelKey: varchar("modelKey", { length: 180 }).notNull(),
  pricingCents: int("pricingCents").default(0).notNull(),
  isActive: int("isActive").default(0).notNull(),
});

export const pricingPlans = mysqlTable("pricing_plans", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  credits: int("credits").default(0).notNull(),
  amountCents: int("amountCents").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
});

export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: rewardTypeEnum("type").notNull(),
  amount: int("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const adminAuditLogs = mysqlTable("admin_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
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

export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  reviewerId: int("reviewerId").notNull(),
  designerId: int("designerId").notNull(),
  score: int("score").notNull(),
  body: text("body"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
