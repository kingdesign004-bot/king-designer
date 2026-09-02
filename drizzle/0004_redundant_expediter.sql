CREATE TABLE `adminAuditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(120) NOT NULL,
	`entity` varchar(80) NOT NULL,
	`entityId` varchar(80),
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminAuditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiModels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`modelKey` varchar(180) NOT NULL,
	`pricingCents` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 0,
	CONSTRAINT `aiModels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiProviders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`apiUrl` text,
	`isActive` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiProviders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditLedger` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`kind` enum('welcome','daily','purchase','spend','refund','reward','adjustment') NOT NULL,
	`referenceId` varchar(160),
	`createdById` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditLedger_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` varchar(60) NOT NULL,
	`providerPaymentId` varchar(180),
	`amountCents` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`status` enum('initiated','succeeded','failed','refunded') NOT NULL DEFAULT 'initiated',
	`refundId` varchar(180),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_providerPaymentId_unique` UNIQUE(`providerPaymentId`)
);
--> statement-breakpoint
CREATE TABLE `pricingPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(60) NOT NULL,
	`name` varchar(120) NOT NULL,
	`credits` int NOT NULL DEFAULT 0,
	`amountCents` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	CONSTRAINT `pricingPlans_id` PRIMARY KEY(`id`),
	CONSTRAINT `pricingPlans_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`targetType` enum('user','post','comment','message') NOT NULL,
	`targetId` int NOT NULL,
	`reason` text NOT NULL,
	`status` enum('open','reviewed','dismissed','resolved') NOT NULL DEFAULT 'open',
	`reviewerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('welcome','daily','referral','manual') NOT NULL,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','pro','vip') NOT NULL DEFAULT 'free',
	`status` enum('active','canceled') NOT NULL DEFAULT 'active',
	`startsAt` timestamp NOT NULL DEFAULT (now()),
	`endsAt` timestamp,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `publicId` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `countryLocked` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verified` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_publicId_unique` UNIQUE(`publicId`);