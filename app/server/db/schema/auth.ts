import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const roleEnum = text("role", { enum: ["admin", "member"] })
	.default("member")
	.notNull();

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash"),
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
	role: roleEnum,
});

export const usersRelations = relations(users, ({ many }) => ({
	emailVerifications: many(emailVerifications),
}));

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

// For sending email verification codes
export const emailVerifications = pgTable("email_verifications", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	code: text("code").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	})
		.$default(() => new Date(Date.now() + 1000 * 60 * 15))
		.notNull(),
});

export const emailVerificationsRelations = relations(
	emailVerifications,
	({ one }) => ({
		user: one(users, {
			fields: [emailVerifications.userId],
			references: [users.id],
		}),
	}),
);

export const passwordResets = pgTable("password_resets", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	code: text("code").notNull(),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	})
		.$default(() => new Date(Date.now() + 1000 * 60 * 60 * 24))
		.notNull(),
	emailVerified: timestamp("email_verified", {
		withTimezone: true,
		mode: "date",
	}),
});

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
	user: one(users, {
		fields: [passwordResets.userId],
		references: [users.id],
	}),
}));

export type UserType = InferSelectModel<typeof users>;
export type SessionType = InferSelectModel<typeof sessions>;
