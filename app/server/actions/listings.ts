import { flattenLocalizedObject } from "@/lib/locale";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "../auth";
import { db } from "../db";
import {
	resourcePhoneNumbers,
	resources,
	resourceToDietaryOptions,
	resourceTranslations,
} from "../db/schema/tables";
import {
	BaseResourceType,
	LocalizedInputSchema,
	LocalizedQuerySchema,
	LocalizedQueryType,
	ResourceTranslationType,
	ResourceType,
} from "../db/types";
import { localeMiddleware, providerMiddleware } from "../middleware";
import { ContactSchema, OfferingEnum } from "../types";

export const ListingFormSchema = z.object({
	// Contact
	email: ContactSchema.shape.email,
	website: ContactSchema.shape.website,
	phoneNumbers: ContactSchema.shape.phoneNumbers,

	// Dietary options
	dietaryOptions: z.array(z.string()).optional(),

	// Resource
	parking: z.boolean().optional(),
	transit: z.boolean().optional(),
	preparation: z.boolean().optional(),
	registration: z.boolean().optional(),
	free: z.boolean().optional(),
	wheelchair: z.boolean().optional(),
	offering: OfferingEnum,
	hours: z.string().optional(),

	// Address
	street1: z.string().min(1, "Street is required"),
	street2: z.string().optional(),
	city: z.string().min(1, "City is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	province: z.string().min(1, "Province is required"),
	country: z.string().min(1, "Country is required"),
	lat: z.number(),
	lng: z.number(),

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

export const mutateListingFn = createServerFn({
	method: "POST",
})
	.middleware([localeMiddleware, providerMiddleware])
	.validator(
		ListingFormSchema.extend({
			id: z.string().optional(),
			redirect: z.boolean(),
		}).and(LocalizedInputSchema),
	)
	.handler(async ({ context, data }) => {
		const { dietaryOptions, phoneNumbers, ...rest } = data;
		const listingId = data.id ?? generateId(16);

		const resource: Omit<BaseResourceType, "createdAt"> = {
			id: listingId,
			providerId: context.provider.id,
			city: rest.city,
			postalCode: rest.postalCode,
			province: rest.province,
			country: rest.country,
			lat: rest.lat,
			lng: rest.lng,
			street1: rest.street1,
			street2: rest.street2 ?? null,
			offering: rest.offering ?? "meal",
			hours: rest.hours ?? null,
			free: rest.free ?? null,
			wheelchair: rest.wheelchair ?? null,
			parking: rest.parking ?? null,
			transit: rest.transit ?? null,
			preparation: rest.preparation ?? null,
			registration: rest.registration ?? null,
			updatedAt: new Date(),
		};

		const translation: ResourceTranslationType = {
			resourceId: listingId,
			locale: rest.locale ?? context.locale,
			description: rest.description ?? null,
			email: rest.email ?? null,
			website: rest.website ?? null,
			fees: rest.fees ?? null,
			eligibility: rest.eligibility ?? null,
			parkingNotes: rest.parkingNotes ?? null,
			transitNotes: rest.transitNotes ?? null,
			preparationNotes: rest.preparationNotes ?? null,
			registrationNotes: rest.registrationNotes ?? null,
			wheelchairNotes: rest.wheelchairNotes ?? null,
			capacityNotes: rest.capacityNotes ?? null,
		};

		await db.transaction(async (tx) => {
			await tx
				.insert(resources)
				.values(resource)
				.onConflictDoUpdate({
					target: [resources.id],
					set: resource,
				});
			await tx
				.insert(resourceTranslations)
				.values(translation)
				.onConflictDoUpdate({
					target: [
						resourceTranslations.resourceId,
						resourceTranslations.locale,
					],
					set: translation,
				});

			if (dietaryOptions && dietaryOptions.length > 0) {
				await tx
					.delete(resourceToDietaryOptions)
					.where(eq(resourceToDietaryOptions.resourceId, listingId));
				await tx.insert(resourceToDietaryOptions).values(
					dietaryOptions.map((option) => ({
						dietaryOptionId: option,
						resourceId: listingId,
					})),
				);
			}

			if (phoneNumbers && phoneNumbers.length > 0) {
				await tx
					.delete(resourcePhoneNumbers)
					.where(eq(resourcePhoneNumbers.resourceId, listingId)),
					await tx.insert(resourcePhoneNumbers).values(
						phoneNumbers.map((phoneNumber) => ({
							...phoneNumber,
							resourceId: listingId,
						})),
					);
			}
		});

		if (data.redirect) {
			throw redirect({
				to: `/$locale/admin/listings`,
				params: {
					locale: context.locale,
				},
			});
		}
	});

export const deleteListingFn = createServerFn({
	method: "POST",
})
	.middleware([localeMiddleware, providerMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ context, data }) => {
		await db
			.delete(resources)
			.where(
				and(
					eq(resources.id, data.id),
					eq(resources.providerId, context.provider.id),
				),
			);
		throw redirect({
			to: `/$locale/admin/listings`,
			params: (prev) => ({
				...prev,
				locale: context.locale,
			}),
		});
	});
