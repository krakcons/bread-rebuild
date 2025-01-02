import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	real,
	text,
} from "drizzle-orm/pg-core";
import { generateId } from "../auth";
import { users } from "./auth/schema";

// Enums
export const languageEnum = pgEnum("language", ["en", "fr"]);
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
});

export const providerTranslations = pgTable("provider_translations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	providerId: text("provider_id")
		.notNull()
		.references(() => providers.id, {
			onDelete: "cascade",
		}),
	language: languageEnum("language").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	website: text("website"),
	email: text("email"),
});

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

	// Contact
	email: text("email"),
	website: text("website"),

	// Info
	parkingAvailable: boolean("parking_available"),
	transitAvailable: boolean("transit_available"),
	preparationRequired: boolean("preparation_required"),
	registrationRequired: boolean("registration_required"),
	free: boolean("free"),
	wheelchairAccessible: boolean("wheelchair_accessible"),
	offering: offeringEnum("offering"),

	// Address
	street1: text("street1").notNull(),
	street2: text("street2"),
	city: text("city").notNull(),
	postalCode: text("postal_code").notNull(),
	province: text("province").notNull(),
	country: text("country").notNull(),
	lat: real("lat"),
	lng: real("lng"),
});

// Phone Numbers
export const phoneNumbers = pgTable("phone_numbers", {
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
export const resourceBodyTranslations = pgTable("resource_body_translations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	resourceId: text("resource_id")
		.notNull()
		.references(() => resources.id, {
			onDelete: "cascade",
		}),
	language: languageEnum("language").notNull(),

	// Basic info
	fees: text("fees"),
	hours: text("hours"),

	// Additional details
	eligibility: text("eligibility"),
	accessibility: text("accessibility"),
	documentsRequired: text("documents_required"),
	applicationProcess: text("application_process"),

	// Bread Info
	parking: text("parking"),
	transit: text("transit"),
	preparation: text("preparation"),
	wheelchair: text("wheelchair"),
	capacity: text("capacity"),
});

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
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId(16)),
		dietaryOptionId: text("dietary_option_id")
			.notNull()
			.references(() => dietaryOptions.id, {
				onDelete: "cascade",
			}),
		language: languageEnum("language").notNull(),
		name: text("name").notNull(),
	},
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
	providerTranslations: many(providerTranslations),
	providerPhoneNumbers: many(providerPhoneNumbers),
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
	bodyTranslations: many(resourceBodyTranslations),
	phoneNumbers: many(phoneNumbers),
	provider: one(providers, {
		fields: [resources.providerId],
		references: [providers.id],
	}),
	resourceToDietaryOptions: many(resourceToDietaryOptions),
	anonymousSessionsToResources: many(anonymousSessionsToResources),
}));

export const resourceBodyTranslationsRelations = relations(
	resourceBodyTranslations,
	({ one }) => ({
		resource: one(resources, {
			fields: [resourceBodyTranslations.resourceId],
			references: [resources.id],
		}),
	}),
);

export const phoneNumbersRelations = relations(phoneNumbers, ({ one }) => ({
	resource: one(resources, {
		fields: [phoneNumbers.resourceId],
		references: [resources.id],
	}),
}));

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
		dietaryOptionsTranslations: many(dietaryOptionsTranslations),
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
