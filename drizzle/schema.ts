import { int, text, timestamp, varchar, pgEnum, pgTable, uniqueIndex, index } from "drizzle-orm/pg-core";

const roleEnum = (column: string) => pgEnum(column, ["user", "admin"]);
const visibilityEnum = (column: string) => pgEnum(column, ["public", "followers", "private"]);
const layoutEnum = (column: string) => pgEnum(column, ["grid", "carousel", "masonry", "single", "split"]);
const mediaTypeEnum = (column: string) => pgEnum(column, ["image", "video", "audio", "gif", "svg", "pdf"]);
const followStatusEnum = (column: string) => pgEnum(column, ["pending", "accepted"]);
const notifTypeEnum = (column: string) => pgEnum(column, ["follow", "like", "comment", "reply", "share", "message"]);
const msgTypeEnum = (column: string) => pgEnum(column, ["text", "image", "video", "audio"]);
const reportTargetEnum = (column: string) => pgEnum(column, ["user", "post", "comment", "message", "story"]);
const reportStatusEnum = (column: string) => pgEnum(column, ["open", "reviewed", "dismissed", "resolved"]);
const creditKindEnum = (column: string) => pgEnum(column, ["welcome", "daily", "purchase", "spend", "refund", "reward", "adjustment"]);
const payStatusEnum = (column: string) => pgEnum(column, ["initiated", "succeeded", "failed", "refunded"]);
const subPlanEnum = (column: string) => pgEnum(column, ["free", "pro", "vip"]);
const subStatusEnum = (column: string) => pgEnum(column, ["active", "canceled"]);
const rewardTypeEnum = (column: string) => pgEnum(column, ["welcome", "daily", "referral", "manual"]);
const accountTypeEnum = (column: string) => pgEnum(column, ["client", "designer"]);
const verificationStatusEnum = (column: string) => pgEnum(column, ["none", "pending", "approved", "rejected"]);
const ticketStatusEnum = (column: string) => pgEnum(column, ["open", "in_progress", "resolved", "closed"]);

export const users = pgTable("users", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const posts = pgTable("posts", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const postShares = pgTable("post_shares", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postMedia = pgTable("post_media", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: int("postId").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  views: int("views").default(0).notNull(),
  duration: int("duration"),
  caption: text("caption"),
});

export const follows = pgTable("follows", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  status: followStatusEnum("status").default("accepted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const blocks = pgTable("blocks", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  blockerId: int("blockerId").notNull(),
  blockedId: int("blockedId").notNull(),
  isPermanent: int("isPermanent").default(0).notNull(),
  unblockAt: timestamp("unblockAt"),
  reason: text("reason"),
  isAdminBan: int("isAdminBan").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postLikes = pgTable("post_likes", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  parentId: int("parentId"),
  body: text("body").notNull(),
  mediaUrl: text("mediaUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const commentLikes = pgTable("comment_likes", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  commentId: int("commentId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  recipientId: int("recipientId").notNull(),
  actorId: int("actorId").notNull(),
  type: notifTypeEnum("type").notNull(),
  postId: int("postId"),
  commentId: int("commentId"),
  body: text("body"),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mediaViews = pgTable("media_views", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  mediaId: int("mediaId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const conversationMembers = pgTable("conversation_members", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  isPinned: int("isPinned").default(0).notNull(),
  lastReadAt: timestamp("lastReadAt"),
});

export const messages = pgTable("messages", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  messageType: msgTypeEnum("messageType").default("text").notNull(),
  body: text("body"),
  mediaUrl: text("mediaUrl"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const splashSlides = pgTable("splash_slides", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("imageUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const verificationRequests = pgTable("verification_requests", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const supportTickets = pgTable("support_tickets", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const stories = pgTable("stories", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  authorId: int("authorId").notNull(),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  mediaUrl: text("mediaUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  caption: text("caption"),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storyInteractions = pgTable("story_interactions", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  storyId: int("storyId").notNull(),
  userId: int("userId").notNull(),
  kind: pgEnum("story_interaction_kind", ["view", "like", "comment"])("kind").notNull(),
  body: text("body"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const creditLedger = pgTable("credit_ledger", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  kind: creditKindEnum("kind").notNull(),
  referenceId: varchar("referenceId", { length: 160 }),
  createdById: int("createdById"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const subscriptions = pgTable("subscriptions", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: int("userId").notNull(),
  plan: subPlanEnum("plan").default("free").notNull(),
  status: subStatusEnum("status").default("active").notNull(),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt"),
});

export const aiProviders = pgTable("ai_providers", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 120 }).notNull(),
  apiUrl: text("apiUrl"),
  isActive: int("isActive").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const aiModels = pgTable("ai_models", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  providerId: int("providerId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  modelKey: varchar("modelKey", { length: 180 }).notNull(),
  pricingCents: int("pricingCents").default(0).notNull(),
  isActive: int("isActive").default(0).notNull(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  credits: int("credits").default(0).notNull(),
  amountCents: int("amountCents").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
});

export const rewards = pgTable("rewards", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: int("userId").notNull(),
  type: rewardTypeEnum("type").notNull(),
  amount: int("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: varchar("entityId", { length: 80 }),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  reviewerId: int("reviewerId").notNull(),
  designerId: int("designerId").notNull(),
  score: int("score").notNull(),
  body: text("body"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PostShare = typeof postShares.$inferSelect;
