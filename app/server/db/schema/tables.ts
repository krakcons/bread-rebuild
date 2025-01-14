import {
	boolean,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { generateId } from "../../auth";
import { users } from "./auth";

// Enums
const localeEnum = text("locale", { enum: ["en", "fr"] }).notNull();
const offeringsEnum = text("offerings", {
	enum: [
		"meal",
		"groceries",
		"delivery",
		"hamper",
		"pantry",
		"drop-in",
		"market",
		"other",
	],
})
	.array()
	.notNull();
const phoneNumberTypeEnum = text("type", {
	enum: ["phone", "fax", "toll-free", "tty"],
})
	.default("phone")
	.notNull();
export const dietaryOptionsEnum = text("dietary_options", {
	enum: [
		"vegetarian",
		"vegan",
		"halal",
		"kosher",
		"celiac",
		"gluten-free",
		"renal-disease",
		"baby",
		"pet",
		"other",
	],
})
	.array()
	.notNull();
const dayEnum = text("day", {
	enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
});
const providerStatusEnum = text("status", {
	enum: ["pending", "approved", "rejected"],
})
	.default("pending")
	.notNull();

// Providers
export const providers = pgTable("providers", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId(16)),
	userId: text("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
	status: providerStatusEnum,
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
		locale: localeEnum,
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
	type: phoneNumberTypeEnum,
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
	offerings: offeringsEnum,
	dietaryOptions: dietaryOptionsEnum,
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
	type: phoneNumberTypeEnum,
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
		locale: localeEnum,

		// Info
		name: text("name"),
		description: text("description"),
		capacity: text("capacity"),

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
		offeringsOther: text("offerings_other"),
		dietaryOptionsOther: text("dietary_options_other"),
	},
	(t) => [primaryKey({ columns: [t.resourceId, t.locale] })],
);

// Anonymous Users

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
		day: dayEnum,
		seen: boolean("seen").notNull().default(false),
	},
	(t) => [primaryKey({ columns: [t.anonymousSessionId, t.resourceId] })],
);
