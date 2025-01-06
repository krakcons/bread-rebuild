import {
	anonymousSessions,
	dietaryOptions,
	dietaryOptionsTranslations,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourcePhoneNumbers,
	resourceToDietaryOptions,
	resourceTranslations,
} from "./tables";

import { relations } from "drizzle-orm";

import { anonymousSessionsToResources, resources } from "./tables";

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
