import { flattenLocalizedObject } from "@/lib/locale";
import { db } from "@/server/db";
import {
	dietaryOptions,
	dietaryOptionsTranslations,
	providers,
	providerTranslations,
	resources,
} from "@/server/db/schema";
import {
	LocalizedQuerySchema,
	LocalizedQueryType,
	ResourceType,
} from "@/server/db/types";
import { localeMiddleware } from "@/server/middleware";
import { createServerFn } from "@tanstack/start";
import { and, eq, exists, ilike, inArray } from "drizzle-orm";
import { z } from "zod";

export const SearchParamsSchema = z.object({
	query: z.string().optional(),
	tab: z.enum(["map", "list"]).optional(),
	free: z.boolean().optional(),
	preparationRequired: z.boolean().optional(),
	parkingAvailable: z.boolean().optional(),
	transitAvailable: z.boolean().optional(),
	wheelchairAccessible: z.boolean().optional(),
	dietaryOptionsIds: z.string().array().optional(),
});

export const searchFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware])
	.validator(SearchParamsSchema.and(LocalizedQuerySchema))
	.handler(async ({ context, data }): Promise<ResourceType[]> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		const resourceList = await db.query.resources.findMany({
			where: and(
				data.query
					? exists(
							db
								.select()
								.from(providers)
								.fullJoin(
									providerTranslations,
									eq(
										providers.id,
										providerTranslations.providerId,
									),
								)
								.where(
									ilike(
										providerTranslations.name,
										`%${data.query}%`,
									),
								),
						)
					: undefined,
				data.free ? eq(resources.free, true) : undefined,
				data.preparationRequired
					? eq(resources.preparation, true)
					: undefined,
				data.parkingAvailable ? eq(resources.parking, true) : undefined,
				data.transitAvailable ? eq(resources.transit, true) : undefined,
				data.wheelchairAccessible
					? eq(resources.wheelchair, true)
					: undefined,
				data.dietaryOptionsIds && data.dietaryOptionsIds.length > 0
					? exists(
							db
								.select()
								.from(dietaryOptions)
								.fullJoin(
									dietaryOptionsTranslations,
									eq(
										dietaryOptions.id,
										dietaryOptionsTranslations.dietaryOptionId,
									),
								)
								.where(
									inArray(
										dietaryOptionsTranslations.dietaryOptionId,
										data.dietaryOptionsIds,
									),
								),
						)
					: undefined,
			),
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

export const getResourceFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware])
	.validator(z.object({ id: z.string() }).and(LocalizedQuerySchema))
	.handler(async ({ data, context }): Promise<ResourceType | undefined> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		const resource = await db.query.resources.findFirst({
			where: eq(resources.id, data.id),
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
		if (!resource) return undefined;
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
		);
	});

export const getResourcesFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware])
	.validator(z.object({ ids: z.string().array() }).and(LocalizedQuerySchema))
	.handler(async ({ context, data }): Promise<ResourceType[]> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		const resourceList = await db.query.resources.findMany({
			where: inArray(resources.id, data.ids),
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
