import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records',{id:text('id').primaryKey(),owner:text('owner').notNull(),kind:text('kind').notNull(),title:text('title').notNull(),status:text('status').notNull().default('Saved'),data:text('data').notNull(),created:integer('created').notNull()});
