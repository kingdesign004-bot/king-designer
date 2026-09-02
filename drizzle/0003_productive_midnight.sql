ALTER TABLE `users` ADD `handle` varchar(80);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_handle_unique` UNIQUE(`handle`);