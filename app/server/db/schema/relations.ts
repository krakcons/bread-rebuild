import {
	anonymousSessions,
	anonymousSessionsToResources,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourcePhoneNumbers,
	resources,
	resourceTranslations,
} from "./tables";

import { relations } from "drizzle-orm";

import { users } from "./auth";

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

export const providerRelations = relations(providers, ({ many, one }) => ({
	resources: many(resources),
	translations: many(providerTranslations),
	phoneNumbers: many(providerPhoneNumbers),
	user: one(users, {
		fields: [providers.userId],
		references: [users.id],
	}),
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
