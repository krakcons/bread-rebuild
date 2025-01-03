import { flattenLocalizedObject } from "@/lib/locale";
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { resources } from "../db/schema";
import {
	LocalizedQuerySchema,
	LocalizedQueryType,
	ResourceType,
} from "../db/types";
import { localeMiddleware, providerMiddleware } from "../middleware";
import { ContactSchema, OfferingEnum } from "../types";

export const ListingFormSchema = z.object({
	// Contact
	email: ContactSchema.shape.email,
	website: ContactSchema.shape.website,
	phoneNumbers: ContactSchema.shape.phoneNumbers,

	// Resource
	parking: z.boolean().optional(),
	transit: z.boolean().optional(),
	preparation: z.boolean().optional(),
	registration: z.boolean().optional(),
	free: z.boolean().optional(),
	wheelchair: z.boolean().optional(),
	offering: OfferingEnum.optional(),
	hours: z.string().optional(),

	// Address
	street1: z.string().optional(),
	street2: z.string().optional(),
	city: z.string().optional(),
	postalCode: z.string().optional(),
	province: z.string().optional(),
	country: z.string().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),

	// Description
	description: z.string().optional(),

	// Additional details (CORDS)
	fees: z.string().optional(), // If free is false
	eligibility: z.string().optional(),

	// Additional details
	parkingNotes: z.string().optional(), // If parking is true
	transitNotes: z.string().optional(), // If transit is true
	preparationNotes: z.string().optional(), // If preparation is true
	registrationNotes: z.string().optional(), // If registration is true
	wheelchairNotes: z.string().optional(), // If wheelchair is true
	capacityNotes: z.string().optional(),
});

export const getListingsFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware, providerMiddleware])
	.validator(LocalizedQuerySchema)
	.handler(async ({ context, data }): Promise<ResourceType[]> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		const resourceList = await db.query.resources.findMany({
			where: eq(resources.providerId, context.provider.id),
			with: {
				provider: {
					with: {
						translations: true,
					},
				},
				translations: true,
				phoneNumbers: true,
				resourceToDietaryOptions: {
					with: {
						dietaryOption: {
							with: {
								translations: true,
							},
						},
					},
				},
			},
		});
		return resourceList.map((resource) => {
			const { provider, resourceToDietaryOptions, ...rest } = resource;
			return flattenLocalizedObject(
				{
					...rest,
					provider: flattenLocalizedObject(provider, localeOpts),
					dietaryOptions: resourceToDietaryOptions.map((r) =>
						flattenLocalizedObject(r.dietaryOption, localeOpts),
					),
				},
				localeOpts,
			)!;
		});
	});
