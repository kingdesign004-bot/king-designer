/*
# Create all KING DESIGNER tables in PostgreSQL

This migration creates the complete database schema for the KING DESIGNER social platform for graphic designers.
The app was previously configured for MySQL via Drizzle ORM but had no database connection.
This migration creates all tables in PostgreSQL (Supabase) and enables RLS on every table.

## Tables created:
1. users - user accounts with profile, ban, badge, CV fields
2. posts - creative works/posts with layout types
3. post_media - media items attached to posts (image, video, audio, gif, svg)
4. post_likes - like interactions
5. post_shares - share tracking
6. comments - comments on posts with nesting
7. comment_likes - likes on comments
8. follows - follow relationships with status
9. blocks - block relationships with temp/permanent ban support
10. notifications - activity notifications with post deep-linking
11. media_views - view tracking for video/audio media
12. conversations - conversation containers
13. conversation_members - conversation participants
14. messages - direct messages with edit/unsend
15. splash_slides - splash screen slides
16. reports - user/post/comment reports
17. credit_ledger - credit transaction history
18. payments - payment records
19. subscriptions - subscription plans
20. ai_providers - AI service providers
21. ai_models - AI model configurations
22. pricing_plans - pricing plan definitions
23. rewards - reward records
24. admin_audit_logs - admin action audit trail

## Security:
- RLS enabled on all tables
- Permissive policies for anon+authenticated since the server (tRPC) handles authorization
*/

-- ============ users ============
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  handle VARCHAR(80) UNIQUE,
  "publicId" VARCHAR(20) UNIQUE,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  "avatarUrl" TEXT,
  "coverUrl" TEXT,
  bio TEXT,
  country VARCHAR(120),
  "countryLocked" INT NOT NULL DEFAULT 1,
  specialty VARCHAR(160),
  level VARCHAR(80),
  verified INT NOT NULL DEFAULT 0,
  "verifiedAt" TIMESTAMP,
  "badgeColor" VARCHAR(50),
  "nameColor" VARCHAR(50),
  "nameGradient" VARCHAR(120),
  "isBanned" INT NOT NULL DEFAULT 0,
  "banUntil" TIMESTAMP,
  "banReason" TEXT,
  "bannedBy" INT,
  "deviceFingerprint" VARCHAR(255),
  experience TEXT,
  skills TEXT,
  tools TEXT,
  "portfolioUrl" VARCHAR(500),
  "yearsOfExperience" VARCHAR(20),
  availability VARCHAR(100),
  "isOnline" INT NOT NULL DEFAULT 0,
  "lastSeenAt" TIMESTAMP NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS users_openId_idx ON users("openId");
CREATE INDEX IF NOT EXISTS users_publicId_idx ON users("publicId");
CREATE INDEX IF NOT EXISTS users_handle_idx ON users(handle);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_users" ON users;
CREATE POLICY "anon_all_users" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ posts ============
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  "authorId" INT NOT NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  hashtags TEXT,
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  "layoutType" VARCHAR(20) NOT NULL DEFAULT 'grid',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_authorId_idx ON posts("authorId");
CREATE INDEX IF NOT EXISTS posts_createdAt_idx ON posts("createdAt" DESC);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_posts" ON posts;
CREATE POLICY "anon_all_posts" ON posts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ post_media ============
CREATE TABLE IF NOT EXISTS post_media (
  id SERIAL PRIMARY KEY,
  "postId" INT NOT NULL,
  "mediaType" VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  "fileKey" TEXT NOT NULL,
  "sortOrder" INT NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  duration INT,
  caption TEXT
);
CREATE INDEX IF NOT EXISTS post_media_postId_idx ON post_media("postId");
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_post_media" ON post_media;
CREATE POLICY "anon_all_post_media" ON post_media FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ post_likes ============
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  "postId" INT NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS post_likes_postId_idx ON post_likes("postId");
CREATE INDEX IF NOT EXISTS post_likes_userId_idx ON post_likes("userId");
CREATE UNIQUE INDEX IF NOT EXISTS post_likes_post_user_unique ON post_likes("postId", "userId");
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_post_likes" ON post_likes;
CREATE POLICY "anon_all_post_likes" ON post_likes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ post_shares ============
CREATE TABLE IF NOT EXISTS post_shares (
  id SERIAL PRIMARY KEY,
  "postId" INT NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS post_shares_postId_idx ON post_shares("postId");
ALTER TABLE post_shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_post_shares" ON post_shares;
CREATE POLICY "anon_all_post_shares" ON post_shares FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ comments ============
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  "postId" INT NOT NULL,
  "authorId" INT NOT NULL,
  "parentId" INT,
  body TEXT NOT NULL,
  "mediaUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_postId_idx ON comments("postId");
CREATE INDEX IF NOT EXISTS comments_authorId_idx ON comments("authorId");
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_comments" ON comments;
CREATE POLICY "anon_all_comments" ON comments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ comment_likes ============
CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  "commentId" INT NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comment_likes_commentId_idx ON comment_likes("commentId");
CREATE UNIQUE INDEX IF NOT EXISTS comment_likes_comment_user_unique ON comment_likes("commentId", "userId");
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_comment_likes" ON comment_likes;
CREATE POLICY "anon_all_comment_likes" ON comment_likes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ follows ============
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  "followerId" INT NOT NULL,
  "followingId" INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'accepted',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS follows_followerId_idx ON follows("followerId");
CREATE INDEX IF NOT EXISTS follows_followingId_idx ON follows("followingId");
CREATE UNIQUE INDEX IF NOT EXISTS follows_follower_following_unique ON follows("followerId", "followingId");
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_follows" ON follows;
CREATE POLICY "anon_all_follows" ON follows FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ blocks ============
CREATE TABLE IF NOT EXISTS blocks (
  id SERIAL PRIMARY KEY,
  "blockerId" INT NOT NULL,
  "blockedId" INT NOT NULL,
  "isPermanent" INT NOT NULL DEFAULT 0,
  "unblockAt" TIMESTAMP,
  reason TEXT,
  "isAdminBan" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blocks_blockerId_idx ON blocks("blockerId");
CREATE INDEX IF NOT EXISTS blocks_blockedId_idx ON blocks("blockedId");
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_blocks" ON blocks;
CREATE POLICY "anon_all_blocks" ON blocks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ notifications ============
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  "recipientId" INT NOT NULL,
  "actorId" INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  "postId" INT,
  "commentId" INT,
  body TEXT,
  "isRead" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_recipientId_idx ON notifications("recipientId");
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_notifications" ON notifications;
CREATE POLICY "anon_all_notifications" ON notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ media_views ============
CREATE TABLE IF NOT EXISTS media_views (
  id SERIAL PRIMARY KEY,
  "mediaId" INT NOT NULL,
  "userId" INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS media_views_mediaId_idx ON media_views("mediaId");
ALTER TABLE media_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_media_views" ON media_views;
CREATE POLICY "anon_all_media_views" ON media_views FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ conversations ============
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_conversations" ON conversations;
CREATE POLICY "anon_all_conversations" ON conversations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ conversation_members ============
CREATE TABLE IF NOT EXISTS conversation_members (
  id SERIAL PRIMARY KEY,
  "conversationId" INT NOT NULL,
  "userId" INT NOT NULL,
  "lastReadAt" TIMESTAMP
);
CREATE INDEX IF NOT EXISTS conversation_members_conversationId_idx ON conversation_members("conversationId");
CREATE INDEX IF NOT EXISTS conversation_members_userId_idx ON conversation_members("userId");
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_conversation_members" ON conversation_members;
CREATE POLICY "anon_all_conversation_members" ON conversation_members FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ messages ============
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  "conversationId" INT NOT NULL,
  "senderId" INT NOT NULL,
  "messageType" VARCHAR(20) NOT NULL DEFAULT 'text',
  body TEXT,
  "mediaUrl" TEXT,
  "deliveredAt" TIMESTAMP,
  "readAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_conversationId_idx ON messages("conversationId");
CREATE INDEX IF NOT EXISTS messages_senderId_idx ON messages("senderId");
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_messages" ON messages;
CREATE POLICY "anon_all_messages" ON messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ splash_slides ============
CREATE TABLE IF NOT EXISTS splash_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  subtitle TEXT,
  "imageUrl" TEXT NOT NULL,
  "fileKey" TEXT NOT NULL,
  "isActive" INT NOT NULL DEFAULT 1,
  "sortOrder" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
ALTER TABLE splash_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_splash_slides" ON splash_slides;
CREATE POLICY "anon_all_splash_slides" ON splash_slides FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ reports ============
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  "reporterId" INT NOT NULL,
  "targetType" VARCHAR(20) NOT NULL,
  "targetId" INT NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  "reviewerId" INT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "reviewedAt" TIMESTAMP
);
CREATE INDEX IF NOT EXISTS reports_target_idx ON reports("targetType", "targetId");
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_reports" ON reports;
CREATE POLICY "anon_all_reports" ON reports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ credit_ledger ============
CREATE TABLE IF NOT EXISTS credit_ledger (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  amount INT NOT NULL,
  kind VARCHAR(30) NOT NULL,
  "referenceId" VARCHAR(160),
  "createdById" INT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credit_ledger_userId_idx ON credit_ledger("userId");
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_credit_ledger" ON credit_ledger;
CREATE POLICY "anon_all_credit_ledger" ON credit_ledger FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ payments ============
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  provider VARCHAR(60) NOT NULL,
  "providerPaymentId" VARCHAR(180) UNIQUE,
  "amountCents" INT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'initiated',
  "refundId" VARCHAR(180),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_userId_idx ON payments("userId");
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_payments" ON payments;
CREATE POLICY "anon_all_payments" ON payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ subscriptions ============
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  plan VARCHAR(10) NOT NULL DEFAULT 'free',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  "startsAt" TIMESTAMP NOT NULL DEFAULT now(),
  "endsAt" TIMESTAMP
);
CREATE INDEX IF NOT EXISTS subscriptions_userId_idx ON subscriptions("userId");
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_subscriptions" ON subscriptions;
CREATE POLICY "anon_all_subscriptions" ON subscriptions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ ai_providers ============
CREATE TABLE IF NOT EXISTS ai_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  "apiUrl" TEXT,
  "isActive" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_ai_providers" ON ai_providers;
CREATE POLICY "anon_all_ai_providers" ON ai_providers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ ai_models ============
CREATE TABLE IF NOT EXISTS ai_models (
  id SERIAL PRIMARY KEY,
  "providerId" INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  "modelKey" VARCHAR(180) NOT NULL,
  "pricingCents" INT NOT NULL DEFAULT 0,
  "isActive" INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS ai_models_providerId_idx ON ai_models("providerId");
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_ai_models" ON ai_models;
CREATE POLICY "anon_all_ai_models" ON ai_models FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ pricing_plans ============
CREATE TABLE IF NOT EXISTS pricing_plans (
  id SERIAL PRIMARY KEY,
  code VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  credits INT NOT NULL DEFAULT 0,
  "amountCents" INT NOT NULL DEFAULT 0,
  "isActive" INT NOT NULL DEFAULT 1
);
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_pricing_plans" ON pricing_plans;
CREATE POLICY "anon_all_pricing_plans" ON pricing_plans FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ rewards ============
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount INT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rewards_userId_idx ON rewards("userId");
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_rewards" ON rewards;
CREATE POLICY "anon_all_rewards" ON rewards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ admin_audit_logs ============
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id SERIAL PRIMARY KEY,
  "adminId" INT NOT NULL,
  action VARCHAR(120) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  "entityId" VARCHAR(80),
  details TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_logs_adminId_idx ON admin_audit_logs("adminId");
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "anon_all_admin_audit_logs" ON admin_audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
