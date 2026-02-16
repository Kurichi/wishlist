CREATE TABLE `wishlist_items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`timeframe` text NOT NULL,
	`category` text NOT NULL,
	`budget` integer,
	`priority` text NOT NULL,
	`status` text DEFAULT 'unstarted' NOT NULL,
	`memo` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
