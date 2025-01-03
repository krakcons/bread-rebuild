import { FlattenedLocalized, LocaleSchema } from "@/lib/locale";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	anonymousSessionsToResources,
	dietaryOptionsTranslations,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourcePhoneNumbers,
	resources,
	resourceTranslations,
} from "./db/schema";
export type SelectResourceType = typeof resources.$inferSelect;

export const ResourceSchema = createSelectSchema(resources);
export type ResourceType = z.infer<typeof ResourceSchema>;

export const ResourceTranslationSchema =
	createSelectSchema(resourceTranslations);
export type ResourceTranslationType = z.infer<typeof ResourceTranslationSchema>;

export const ProviderSchema = createSelectSchema(providers);
export type BaseProviderType = z.infer<typeof ProviderSchema>;

export const ProviderTranslationSchema =
	createSelectSchema(providerTranslations);
export type ProviderTranslationType = z.infer<typeof ProviderTranslationSchema>;

export type ProviderType = FlattenedLocalized<
	BaseProviderType & {
		translations: ProviderTranslationType[];
		phoneNumbers: ProviderPhoneNumberType[];
	},
	ProviderTranslationType
>;
export const PhoneNumberSchema = createSelectSchema(resourcePhoneNumbers);
export type PhoneNumberType = z.infer<typeof PhoneNumberSchema>;

export const ProviderPhoneNumberSchema =
	createSelectSchema(providerPhoneNumbers);
export type ProviderPhoneNumberType = z.infer<typeof ProviderPhoneNumberSchema>;

export const DietaryOptionSchema = createSelectSchema(
	dietaryOptionsTranslations,
);
export type DietaryOptionType = z.infer<typeof DietaryOptionSchema>;

export type FullResourceType = ResourceType & {
	name: string;
	body: ResourceTranslationType;
	phoneNumbers: PhoneNumberType[];
	dietaryOptions: DietaryOptionType[];
};

export const SavedResourceSchema = createSelectSchema(
	anonymousSessionsToResources,
).omit({
	anonymousSessionId: true,
});
export type SavedResourceType = z.infer<typeof SavedResourceSchema>;

export const LocalizedSchema = z
	.object({
		locale: LocaleSchema.optional(),
		fallback: z.boolean().default(true),
	})
	.optional();
export type LocalizedType = z.infer<typeof LocalizedSchema>;

export const LocalizedInputSchema = z.object({ locale: LocaleSchema });
export type LocalizedInputType = z.infer<typeof LocalizedInputSchema>;
