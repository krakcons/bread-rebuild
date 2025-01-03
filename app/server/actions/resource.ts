import { getLocalizedArray } from "@/lib/locale";
import { db } from "@/server/db";
import {
	dietaryOptions,
	dietaryOptionsTranslations,
	providers,
	providerTranslations,
	resources,
} from "@/server/db/schema";
import { localeMiddleware } from "@/server/middleware";
import { FullResourceType } from "@/server/types";
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
	.validator(SearchParamsSchema)
	.handler(
		async ({
			context: { locale },
			data: { query, dietaryOptionsIds = [], ...filters },
		}): Promise<FullResourceType[]> => {
			const meals = await db.query.resources.findMany({
				where: and(
					query
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
											`%${query}%`,
										),
									),
							)
						: undefined,
					filters.free ? eq(resources.free, true) : undefined,
					filters.preparationRequired
						? eq(resources.preparationRequired, true)
						: undefined,
					filters.parkingAvailable
						? eq(resources.parkingAvailable, true)
						: undefined,
					filters.transitAvailable
						? eq(resources.transitAvailable, true)
						: undefined,
					filters.wheelchairAccessible
						? eq(resources.wheelchairAccessible, true)
						: undefined,
					dietaryOptionsIds.length > 0
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
											dietaryOptionsIds,
										),
									),
							)
						: undefined,
				),
				with: {
					provider: {
						with: {
							providerTranslations: true,
						},
					},
					bodyTranslations: true,
					phoneNumbers: true,
					resourceToDietaryOptions: {
						with: {
							dietaryOption: {
								with: {
									dietaryOptionsTranslations: true,
								},
							},
						},
					},
				},
			});
			return meals.map((meal) => ({
				...meal,
				name: getLocalizedArray(
					meal.provider.providerTranslations,
					locale,
				).name,
				body: getLocalizedArray(meal.bodyTranslations, locale),
				dietaryOptions: meal.resourceToDietaryOptions.map((r) =>
					getLocalizedArray(
						r.dietaryOption.dietaryOptionsTranslations,
						locale,
					),
				),
			}));
		},
	);

export const getResourceFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(
		async ({
			data: { id },
			context: { locale },
		}): Promise<FullResourceType | undefined> => {
			const resource = await db.query.resources.findFirst({
				where: eq(resources.id, id),
				with: {
					provider: {
						with: {
							providerTranslations: true,
						},
					},
					bodyTranslations: true,
					phoneNumbers: true,
					resourceToDietaryOptions: {
						with: {
							dietaryOption: {
								with: {
									dietaryOptionsTranslations: true,
								},
							},
						},
					},
				},
			});
			if (!resource) return undefined;
			return {
				...resource,
				name: getLocalizedArray(
					resource.provider.providerTranslations,
					locale,
				).name,
				body: getLocalizedArray(resource.bodyTranslations, locale),
				dietaryOptions: resource.resourceToDietaryOptions.map((r) =>
					getLocalizedArray(
						r.dietaryOption.dietaryOptionsTranslations,
						locale,
					),
				),
			};
		},
	);

export const getResourcesFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware])
	.validator(z.object({ ids: z.string().array() }))
	.handler(async ({ context: { locale }, data: { ids } }) => {
		const resourceList = await db.query.resources.findMany({
			where: inArray(resources.id, ids),
			with: {
				provider: {
					with: {
						providerTranslations: true,
					},
				},
				bodyTranslations: true,
				phoneNumbers: true,
				resourceToDietaryOptions: {
					with: {
						dietaryOption: {
							with: {
								dietaryOptionsTranslations: true,
							},
						},
					},
				},
			},
		});
		return resourceList.map((resource) => ({
			...resource,
			name: getLocalizedArray(
				resource.provider.providerTranslations,
				locale,
			).name,
			body: getLocalizedArray(resource.bodyTranslations, locale),
			dietaryOptions: resource.resourceToDietaryOptions.map((r) =>
				getLocalizedArray(
					r.dietaryOption.dietaryOptionsTranslations,
					locale,
				),
			),
		}));
	});
