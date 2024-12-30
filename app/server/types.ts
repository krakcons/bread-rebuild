import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	anonymousSessionsToResources,
	dietaryOptionsTranslations,
	phoneNumbers,
	providers,
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

export const PhoneNumberSchema = createSelectSchema(phoneNumbers);
export type PhoneNumberType = z.infer<typeof PhoneNumberSchema>;

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
