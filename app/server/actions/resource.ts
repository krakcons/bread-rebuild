import { flattenLocalizedObject } from "@/lib/locale";
import { db } from "@/server/db";
import {
	providers,
	providerTranslations,
	resources,
	resourceTranslations,
} from "@/server/db/schema";
import {
	LocalizedQuerySchema,
	LocalizedQueryType,
	ResourceType,
} from "@/server/db/types";
import { localeMiddleware } from "@/server/middleware";
import { createServerFn } from "@tanstack/start";
import { and, eq, exists, ilike, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import { DietaryOptionSchema } from "../types";

export const SearchParamsSchema = z.object({
	query: z.string().optional(),
	tab: z.enum(["map", "list"]).optional(),
	free: z.boolean().optional(),
	preparation: z.boolean().optional(),
	parking: z.boolean().optional(),
	transit: z.boolean().optional(),
	wheelchair: z.boolean().optional(),
	dietaryOptions: DietaryOptionSchema.array().optional(),
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
				// Search
				data.query
					? or(
							exists(
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
										and(
											eq(
												providers.id,
												resources.providerId,
											),
											ilike(
												providerTranslations.name,
												`%${data.query}%`,
											),
										),
									),
							),
							exists(
								db
									.select()
									.from(resourceTranslations)
									.where(
										and(
											eq(
												resourceTranslations.resourceId,
												resources.id,
											),
											ilike(
												resourceTranslations.name,
												`%${data.query}%`,
											),
										),
									),
							),
						)
					: undefined,
				// Filters
				data.free ? eq(resources.free, true) : undefined,
				data.preparation ? eq(resources.preparation, true) : undefined,
				data.parking ? eq(resources.parking, true) : undefined,
				data.transit ? eq(resources.transit, true) : undefined,
				data.wheelchair ? eq(resources.wheelchair, true) : undefined,
				data.dietaryOptions && data.dietaryOptions.length > 0
					? sql.raw(
							`dietary_options @> '{${data.dietaryOptions
								?.map((option) => `"${option}"`)
								.join(", ")}}'`,
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
			},
		});
		return resourceList.map((resource) => {
			const { provider, ...rest } = resource;
			return flattenLocalizedObject(
				{
					...rest,
					provider: flattenLocalizedObject(provider, localeOpts),
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
						phoneNumbers: true,
					},
				},
				translations: true,
				phoneNumbers: true,
			},
		});
		if (!resource) return undefined;
		const { provider, ...rest } = resource;
		return flattenLocalizedObject(
			{
				...rest,
				provider: flattenLocalizedObject(provider, localeOpts),
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
			},
		});
		return resourceList.map((resource) => {
			const { provider, ...rest } = resource;
			return flattenLocalizedObject(
				{
					...rest,
					provider: flattenLocalizedObject(provider, localeOpts),
				},
				localeOpts,
			)!;
		});
	});
