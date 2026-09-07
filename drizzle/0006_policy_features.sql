ALTER TABLE `users`
  ADD COLUMN `accountType` enum('client','designer') NOT NULL DEFAULT 'client',
  ADD COLUMN `birthYear` int,
  ADD COLUMN `verificationStatus` enum('none','pending','approved','rejected') NOT NULL DEFAULT 'none',
  ADD COLUMN `verificationNote` text,
  ADD COLUMN `idFrontUrl` text,
  ADD COLUMN `idBackUrl` text,
  ADD COLUMN `cvUrl` text;

ALTER TABLE `reports`
  ADD COLUMN `attachmentUrl` text,
  ADD COLUMN `attachmentType` varchar(80),
  ADD COLUMN `attachmentDuration` int;

CREATE TABLE `verification_requests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `idFrontUrl` text NOT NULL,
  `idBackUrl` text NOT NULL,
  `cvUrl` text NOT NULL,
  `status` enum('none','pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `note` text,
  `reviewedBy` int,
  `reviewedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `verification_requests_id` PRIMARY KEY(`id`)
);

CREATE TABLE `support_tickets` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `subject` varchar(180) NOT NULL,
  `body` text NOT NULL,
  `attachmentUrl` text,
  `attachmentType` varchar(80),
  `attachmentDuration` int,
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `adminReply` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);

CREATE TABLE `stories` (
  `id` int AUTO_INCREMENT NOT NULL,
  `authorId` int NOT NULL,
  `mediaType` enum('image','video','audio','gif','svg') NOT NULL,
  `mediaUrl` text NOT NULL,
  `fileKey` text NOT NULL,
  `caption` text,
  `visibility` enum('public','followers','private') NOT NULL DEFAULT 'public',
  `expiresAt` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);

CREATE TABLE `story_interactions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `storyId` int NOT NULL,
  `userId` int NOT NULL,
  `kind` enum('view','like','comment') NOT NULL,
  `body` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `story_interactions_id` PRIMARY KEY(`id`)
);
