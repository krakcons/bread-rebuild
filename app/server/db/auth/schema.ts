import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	emailVerified: timestamp("email_verified", {
		withTimezone: true,
		mode: "date",
	}),
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date",
	})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
		mode: "date",
	})
		.defaultNow()
		.notNull(),
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

// For sending email verification codes
export const emailVerifications = pgTable("email_verifications", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	code: text("code").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	})
		.$default(() => new Date(Date.now() + 1000 * 60 * 15))
		.notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
