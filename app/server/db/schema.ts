import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { generateId } from "../auth";
import { users } from "./auth/schema";

// Enums
export const localeEnum = pgEnum("locale", ["en", "fr"]);
export const offeringEnum = pgEnum("offering", [
	"meal",
	"groceries",
	"delivery",
	"hamper",
	"pantry",
	"drop-in",
	"market",
]);

export const phoneNumberTypeEnum = pgEnum("phone_number_type", [
	"phone",
	"fax",
	"toll-free",
	"tty",
]);

// Providers
export const providers = pgTable("providers", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	userId: text("user_id").references(() => users.id),

	// Timestamps
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const providerTranslations = pgTable(
	"provider_translations",
	{
		providerId: text("provider_id")
			.notNull()
			.references(() => providers.id, {
				onDelete: "cascade",
			}),
		locale: localeEnum("locale").notNull(),
		name: text("name").notNull(),
		description: text("description"),
		website: text("website"),
		email: text("email"),
	},
	(t) => [primaryKey({ columns: [t.providerId, t.locale] })],
);

// Provider Phone Numbers
export const providerPhoneNumbers = pgTable("provider_phone_numbers", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	providerId: text("provider_id")
		.notNull()
		.references(() => providers.id, {
			onDelete: "cascade",
		}),
	phone: text("phone").notNull(),
	type: phoneNumberTypeEnum("type").notNull(),
});

// Base Table
export const resources = pgTable("resources", {
	id: text("id").primaryKey(),
	providerId: text("provider_id")
		.notNull()
		.references(() => providers.id, {
			onDelete: "cascade",
		}),

	// Info
	parking: boolean("parking"),
	transit: boolean("transit"),
	preparation: boolean("preparation"),
	registration: boolean("registration"),
	free: boolean("free"),
	wheelchair: boolean("wheelchair"),
	offering: offeringEnum("offering"),
	hours: text("hours"),

	// Address
	street1: text("street1").notNull(),
	street2: text("street2"),
	city: text("city").notNull(),
	postalCode: text("postal_code").notNull(),
	province: text("province").notNull(),
	country: text("country").notNull(),
	lat: real("lat"),
	lng: real("lng"),

	// Timestamps
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Phone Numbers
export const resourcePhoneNumbers = pgTable("resource_phone_numbers", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	resourceId: text("resource_id")
		.notNull()
		.references(() => resources.id, {
			onDelete: "cascade",
		}),
	phone: text("phone").notNull(),
	type: phoneNumberTypeEnum("type").notNull(),
});

// Extended Resource Info
export const resourceTranslations = pgTable(
	"resource_translations",
	{
		resourceId: text("resource_id")
			.notNull()
			.references(() => resources.id, {
				onDelete: "cascade",
			}),
		locale: localeEnum("locale").notNull(),

		// Description
		description: text("description"),

		// Contact
		email: text("email"),
		website: text("website"),

		// Additional details (CORDS)
		fees: text("fees"), // If free is false
		eligibility: text("eligibility"),

		// Additional details
		parkingNotes: text("parking_notes"), // If parking is true
		transitNotes: text("transit_notes"), // If transit is true
		preparationNotes: text("preparation_notes"), // If preparation is true
		registrationNotes: text("registration_notes"), // If registration is true
		wheelchairNotes: text("wheelchair_notes"), // If wheelchair is true
		capacityNotes: text("capacity_notes"),
	},
	(t) => [primaryKey({ columns: [t.resourceId, t.locale] })],
);

// Dietary Options
export const resourceToDietaryOptions = pgTable(
	"resource_to_dietary_options",
	{
		resourceId: text("resource_id")
			.notNull()
			.references(() => resources.id, {
				onDelete: "cascade",
			}),
		dietaryOptionId: text("dietary_option_id")
			.notNull()
			.references(() => dietaryOptions.id, {
				onDelete: "cascade",
			}),
	},
	(t) => [primaryKey({ columns: [t.resourceId, t.dietaryOptionId] })],
);

export const dietaryOptions = pgTable("dietary_options", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
});

export const dietaryOptionsTranslations = pgTable(
	"dietary_options_translations",
	{
		dietaryOptionId: text("dietary_option_id")
			.notNull()
			.references(() => dietaryOptions.id, {
				onDelete: "cascade",
			}),
		locale: localeEnum("locale").notNull(),
		name: text("name").notNull(),
	},
	(t) => [primaryKey({ columns: [t.dietaryOptionId, t.locale] })],
);

// Anonymous Users
export const daysEnum = pgEnum("days", [
	"unassigned",
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
	"sun",
]);

export const anonymousSessions = pgTable("anonymous_sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
});

export const anonymousSessionsToResources = pgTable(
	"anonymous_sessions_to_resources",
	{
		anonymousSessionId: text("anonymous_session_id")
			.notNull()
			.references(() => anonymousSessions.id, {
				onDelete: "cascade",
			}),
		resourceId: text("resource_id")
			.notNull()
			.references(() => resources.id, {
				onDelete: "cascade",
			}),
		day: daysEnum("day").notNull().default("unassigned"),
		seen: boolean("seen").notNull().default(false),
	},
	(t) => [primaryKey({ columns: [t.anonymousSessionId, t.resourceId] })],
);

// Relations
export const anonymousSessionsToResourcesRelations = relations(
	anonymousSessionsToResources,
	({ one }) => ({
		anonymousSession: one(anonymousSessions, {
			fields: [anonymousSessionsToResources.anonymousSessionId],
			references: [anonymousSessions.id],
		}),
		resource: one(resources, {
			fields: [anonymousSessionsToResources.resourceId],
			references: [resources.id],
		}),
	}),
);

export const anonymousSessionsRelations = relations(
	anonymousSessions,
	({ many }) => ({
		anonymousSessionsToResources: many(anonymousSessionsToResources),
	}),
);

export const providerRelations = relations(providers, ({ many }) => ({
	resources: many(resources),
	translations: many(providerTranslations),
	phoneNumbers: many(providerPhoneNumbers),
}));

export const providerTranslationsRelations = relations(
	providerTranslations,
	({ one }) => ({
		provider: one(providers, {
			fields: [providerTranslations.providerId],
			references: [providers.id],
		}),
	}),
);

export const providerPhoneNumbersRelations = relations(
	providerPhoneNumbers,
	({ one }) => ({
		provider: one(providers, {
			fields: [providerPhoneNumbers.providerId],
			references: [providers.id],
		}),
	}),
);

export const resourceRelations = relations(resources, ({ many, one }) => ({
	translations: many(resourceTranslations),
	phoneNumbers: many(resourcePhoneNumbers),
	provider: one(providers, {
		fields: [resources.providerId],
		references: [providers.id],
	}),
	resourceToDietaryOptions: many(resourceToDietaryOptions),
	anonymousSessionsToResources: many(anonymousSessionsToResources),
}));

export const resourceTranslationsRelations = relations(
	resourceTranslations,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourceTranslations.resourceId],
			references: [resources.id],
		}),
	}),
);

export const resourcePhoneNumbersRelations = relations(
	resourcePhoneNumbers,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourcePhoneNumbers.resourceId],
			references: [resources.id],
		}),
	}),
);

export const resourceToDietaryOptionsRelations = relations(
	resourceToDietaryOptions,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourceToDietaryOptions.resourceId],
			references: [resources.id],
		}),
		dietaryOption: one(dietaryOptions, {
			fields: [resourceToDietaryOptions.dietaryOptionId],
			references: [dietaryOptions.id],
		}),
	}),
);

export const dietaryOptionsRelations = relations(
	dietaryOptions,
	({ many }) => ({
		resourceToDietaryOptions: many(resourceToDietaryOptions),
		translations: many(dietaryOptionsTranslations),
	}),
);

export const dietaryOptionsTranslationsRelations = relations(
	dietaryOptionsTranslations,
	({ one }) => ({
		dietaryOption: one(dietaryOptions, {
			fields: [dietaryOptionsTranslations.dietaryOptionId],
			references: [dietaryOptions.id],
		}),
	}),
);
