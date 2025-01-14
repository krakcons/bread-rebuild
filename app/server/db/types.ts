import { LocaleSchema } from "@/lib/locale";
import { FlattenedLocalized } from "@/lib/locale/helpers";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { PhoneNumberType } from "../types";
import {
	anonymousSessionsToResources,
	providers,
	providerTranslations,
	resources,
	resourceTranslations,
} from "./schema";

// Provider types

export const ProviderSchema = createSelectSchema(providers);
export type BaseProviderType = z.infer<typeof ProviderSchema>;

export const ProviderTranslationSchema =
	createSelectSchema(providerTranslations);
export type ProviderTranslationType = z.infer<typeof ProviderTranslationSchema>;

export type ProviderType = FlattenedLocalized<
	BaseProviderType & {
		translations: ProviderTranslationType[];
		phoneNumbers: PhoneNumberType[];
	},
	ProviderTranslationType
>;

// Resource types

export const ResourceSchema = createSelectSchema(resources);
export type BaseResourceType = z.infer<typeof ResourceSchema>;

export const ResourceTranslationSchema =
	createSelectSchema(resourceTranslations);
export type ResourceTranslationType = z.infer<typeof ResourceTranslationSchema>;

export type ResourceType = FlattenedLocalized<
	BaseResourceType & {
		translations: ResourceTranslationType[];
		provider: ProviderType;
		phoneNumbers: PhoneNumberType[];
	},
	ResourceTranslationType
>;

// Saved resource types

export const SavedResourceSchema = createSelectSchema(
	anonymousSessionsToResources,
).omit({
	anonymousSessionId: true,
});
export type SavedResourceType = z.infer<typeof SavedResourceSchema>;

// Localization types

export const LocalizedQuerySchema = z
	.object({
		locale: LocaleSchema.optional(),
		fallback: z.boolean().default(true),
	})
	.optional();
export type LocalizedQueryType = z.infer<typeof LocalizedQuerySchema>;

export const LocalizedInputSchema = z.object({ locale: LocaleSchema });
export type LocalizedInputType = z.infer<typeof LocalizedInputSchema>;
