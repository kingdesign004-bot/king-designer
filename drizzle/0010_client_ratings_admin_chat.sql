ALTER TABLE `users` ADD COLUMN `clientCompany` varchar(180) NULL, ADD COLUMN `clientBudget` varchar(120) NULL, ADD COLUMN `clientNeeds` text NULL;
ALTER TABLE `conversation_members` ADD COLUMN `isPinned` int NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `reviewerId` int NOT NULL,
  `designerId` int NOT NULL,
  `score` int NOT NULL,
  `body` text NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
