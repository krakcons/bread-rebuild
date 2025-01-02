import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	anonymousSessionsToResources,
	dietaryOptionsTranslations,
	phoneNumbers,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourceBodyTranslations,
	resources,
} from "./db/schema";
export type SelectResourceType = typeof resources.$inferSelect;

export const ResourceSchema = createSelectSchema(resources);
export type ResourceType = z.infer<typeof ResourceSchema>;

export const ResourceBodySchema = createSelectSchema(resourceBodyTranslations);
export type ResourceBodyType = z.infer<typeof ResourceBodySchema>;

export const ProviderSchema = createSelectSchema(providers);
export type ProviderType = z.infer<typeof ProviderSchema>;

export const ProviderTranslationSchema =
	createSelectSchema(providerTranslations);
export type ProviderTranslationType = z.infer<typeof ProviderTranslationSchema>;

export type FullProviderType = ProviderType &
	ProviderTranslationType & {
		phoneNumbers: ProviderPhoneNumberType[];
	};

export const PhoneNumberSchema = createSelectSchema(phoneNumbers);
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
	body: ResourceBodyType;
	phoneNumbers: PhoneNumberType[];
	dietaryOptions: DietaryOptionType[];
};

export const SavedResourceSchema = createSelectSchema(
	anonymousSessionsToResources,
).omit({
	anonymousSessionId: true,
});
export type SavedResourceType = z.infer<typeof SavedResourceSchema>;
