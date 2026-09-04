import { Router } from 'express';
import { db } from '../db';
import { users, posts, blockList } from '../db/schema';
import { eq, and, notInArray } from 'drizzle-orm';

const router = Router();

// Get all posts visible to user (excluding blocked users' posts)
router.get('/posts', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    // Get user's block list
    const userBlocks = await db
      .select()
      .from(blockList)
      .where(eq(blockList.userId, userId));
    
    const blockedUserIds = userBlocks.map(b => b.blockedUserId);
    
    // Get posts excluding blocked users
    let query = db.select().from(posts);
    
    if (blockedUserIds.length > 0) {
      query = query.where(notInArray(posts.userId, blockedUserIds));
    }
    
    const allPosts = await query.orderBy(posts.createdAt);
    
    // Also exclude posts from users who blocked current user
    const usersWhoBlockedMe = await db
      .select()
      .from(blockList)
      .where(eq(blockList.blockedUserId, userId));
    
    const filteredPosts = allPosts.filter(
      post => !usersWhoBlockedMe.some(b => b.userId === post.userId)
    );
    
    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post
router.post('/posts', async (req, res) => {
  try {
    const { userId, title, content, image } = req.body;
    
    const newPost = await db.insert(posts).values({
      userId,
      title,
      content,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, image } = req.body;
    
    const updated = await db
      .update(posts)
      .set({
        title,
        content,
        image,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    await db.delete(posts).where(eq(posts.id, postId));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Block user
router.post('/block/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.body.currentUserId;
    
    // Check if already blocked
    const existing = await db
      .select()
      .from(blockList)
      .where(
        and(
          eq(blockList.userId, currentUserId),
          eq(blockList.blockedUserId, userId)
        )
      );
    
    if (existing.length === 0) {
      await db.insert(blockList).values({
        userId: currentUserId,
        blockedUserId: userId,
      });
    }
    
    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Get user's block list
router.get('/block-list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const blocks = await db
      .select()
      .from(blockList)
      .where(eq(blockList.userId, userId));
    
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch block list' });
  }
});

// Unblock user
router.delete('/block/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.body.currentUserId;
    
    await db
      .delete(blockList)
      .where(
        and(
          eq(blockList.userId, currentUserId),
          eq(blockList.blockedUserId, userId)
        )
      );
    
    res.json({ success: true, message: 'User unblocked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Report post
router.post('/report/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, reason } = req.body;
    
    // TODO: Save report to database
    
    res.json({ success: true, message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

export default router;
