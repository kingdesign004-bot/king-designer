import { randomInt } from "node:crypto";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { comments, conversationMembers, conversations, follows, notifications, postLikes, postMedia, postShares, posts, splashSlides, users, blocks, messages, commentLikes, reports, creditLedger, payments, subscriptions, aiProviders, aiModels, pricingPlans, rewards, adminAuditLogs, mediaViews, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { const client = postgres(process.env.DATABASE_URL, { prepare: false }); _db = drizzle(client); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const existing = await getUserByOpenId(user.openId);
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  if (user.openId === ENV.ownerOpenId) {
    values.publicId = "10000"; updateSet.publicId = "10000";
  } else if (!existing?.publicId) {
    let publicId = String(randomInt(10001, 999999));
    while ((await db.select({ id: users.id }).from(users).where(eq(users.publicId, publicId)).limit(1))[0]) publicId = String(randomInt(10001, 999999));
    values.publicId = publicId; updateSet.publicId = publicId;
  }
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0];
}

export async function getProfile(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const [profile] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!profile) return undefined;
  const [followers, following] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(follows).where(and(eq(follows.followingId, userId), eq(follows.status, "accepted"))),
    db.select({ count: sql<number>`count(*)` }).from(follows).where(and(eq(follows.followerId, userId), eq(follows.status, "accepted"))),
  ]);
  const activeSubscription = (await db.select({ plan: subscriptions.plan }).from(subscriptions).where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"), or(isNull(subscriptions.endsAt), gt(subscriptions.endsAt, new Date())))).limit(1))[0];
  return { ...profile, plan: activeSubscription?.plan ?? "free", followersCount: Number(followers[0]?.count ?? 0), followingCount: Number(following[0]?.count ?? 0) };
}

export function getMutualBlockedIds(rows: Array<{ blockerId: number; blockedId: number }>, viewerId: number) {
  return new Set(rows.flatMap(row => [row.blockerId, row.blockedId]).filter(id => id !== viewerId));
}

export function filterBlockedRecords<T>(items: T[], blockedIds: Set<number>, getUserId: (item: T) => number) {
  return items.filter(item => !blockedIds.has(getUserId(item)));
}

export function filterSearchResults<TUser extends { id: number }, TPost extends { author: { id: number } }>(usersResult: TUser[], postsResult: TPost[], blockedIds: Set<number>) {
  return { users: filterBlockedRecords(usersResult, blockedIds, user => user.id), posts: filterBlockedRecords(postsResult, blockedIds, post => post.author.id) };
}

export function filterNotificationRows<T extends { actor: { id: number } }>(rows: T[], blockedIds: Set<number>) {
  return filterBlockedRecords(rows, blockedIds, row => row.actor.id);
}

export function filterInboxParticipants<T extends { participant: { id: number } }>(items: T[], blockedIds: Set<number>) {
  return filterBlockedRecords(items, blockedIds, item => item.participant.id);
}

export function filterInboxItems<T extends { conversationId: number }>(items: T[], memberConversationIds: number[]) {
  const allowed = new Set(memberConversationIds);
  return items.filter(item => allowed.has(item.conversationId));
}

export function sortInboxItems<T extends { updatedAt: Date | string }>(items: T[]) {
  return [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function countPostShares(db: ReturnType<typeof drizzle>, postId: number) {
  const result = await db.select({ count: sql<number>`count(*)` }).from(postShares).where(eq(postShares.postId, postId));
  return Number(result[0]?.count ?? 0);
}

export async function listFeed(viewerId?: number) {
  const db = await getDb(); if (!db) return [];
  const rows = await db.select({ post: posts, author: users }).from(posts).innerJoin(users, eq(posts.authorId, users.id)).orderBy(desc(posts.createdAt)).limit(30);
  let visibleRows = rows;
  if (viewerId) {
    const blockedRows = await db.select().from(blocks).where(or(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, viewerId)));
    const blockedIds = getMutualBlockedIds(blockedRows, viewerId);
    visibleRows = rows.filter(({ post }) => !blockedIds.has(post.authorId));
  }
  return Promise.all(visibleRows.map(async ({ post, author }) => {
    const [likes, commentsCount, shares, media] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(postLikes).where(eq(postLikes.postId, post.id)),
      db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.postId, post.id)),
      countPostShares(db, post.id),
      db.select().from(postMedia).where(eq(postMedia.postId, post.id)),
    ]);
    let liked = false;
    if (viewerId) liked = Boolean((await db.select({ id: postLikes.id }).from(postLikes).where(and(eq(postLikes.postId, post.id), eq(postLikes.userId, viewerId))).limit(1))[0]);
    let shared = false;
    if (viewerId) shared = Boolean((await db.select({ id: postShares.id }).from(postShares).where(and(eq(postShares.postId, post.id), eq(postShares.userId, viewerId))).limit(1))[0]);
    const activeSubscription = (await db.select({ plan: subscriptions.plan }).from(subscriptions).where(and(eq(subscriptions.userId, author.id), eq(subscriptions.status, "active"), or(isNull(subscriptions.endsAt), gt(subscriptions.endsAt, new Date())))).limit(1))[0];
    return { ...post, author: { ...author, plan: activeSubscription?.plan ?? "free" }, media, likesCount: Number(likes[0]?.count ?? 0), commentsCount: Number(commentsCount[0]?.count ?? 0), sharesCount: shares, liked, shared };
  }));
}

export async function createNotification(recipientId: number, actorId: number, type: "follow" | "like" | "comment" | "reply" | "share" | "message", postId?: number, commentId?: number, body?: string) {
  const db = await getDb(); if (!db || recipientId === actorId) return;
  await db.insert(notifications).values({ recipientId, actorId, type, postId, commentId, body });
}

export async function isBlocked(a: number, b: number) {
  const db = await getDb(); if (!db) return false;
  const result = await db.select({ id: blocks.id }).from(blocks).where(or(and(eq(blocks.blockerId, a), eq(blocks.blockedId, b)), and(eq(blocks.blockerId, b), eq(blocks.blockedId, a)))).limit(1);
  return Boolean(result[0]);
}

export async function getConversation(userId: number, otherUserId: number) {
  const db = await getDb(); if (!db) return undefined;
  const mine = await db.select({ conversationId: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, userId));
  const theirs = await db.select({ conversationId: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, otherUserId));
  const ids = new Set(mine.map(x => x.conversationId));
  return theirs.find(x => ids.has(x.conversationId))?.conversationId;
}

export { comments, conversationMembers, conversations, follows, notifications, postLikes, postMedia, postShares, posts, splashSlides, users, blocks, messages, commentLikes, reports, creditLedger, payments, subscriptions, aiProviders, aiModels, pricingPlans, rewards, adminAuditLogs, mediaViews };
