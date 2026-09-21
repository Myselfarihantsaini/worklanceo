CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'Saved' NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL
);
