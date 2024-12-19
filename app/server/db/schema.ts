import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
