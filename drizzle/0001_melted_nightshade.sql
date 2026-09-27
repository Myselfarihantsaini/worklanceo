ALTER TABLE `records` ADD `admin_notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `follow_up` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `review_version` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `reviewed_at` integer;--> statement-breakpoint
CREATE INDEX `idx_records_owner_created` ON `records` (`owner`,`created`);--> statement-breakpoint
CREATE INDEX `idx_records_kind_created` ON `records` (`kind`,`created`);