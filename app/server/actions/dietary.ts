import { flattenLocalizedObject } from "@/lib/locale";
import { db } from "@/server/db";
import { createServerFn } from "@tanstack/start";
import {
	DietaryOptionType,
	LocalizedQuerySchema,
	LocalizedQueryType,
} from "../db/types";
import { localeMiddleware } from "../middleware";

export const getDietaryOptionsFn = createServerFn({ method: "GET" })
	.middleware([localeMiddleware])
	.validator(LocalizedQuerySchema)
	.handler(async ({ context, data }): Promise<DietaryOptionType[]> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};

		const dietaryOptions = await db.query.dietaryOptions.findMany({
			with: {
				translations: true,
			},
		});

		return dietaryOptions.map(
			(dietary) => flattenLocalizedObject(dietary, localeOpts)!,
		);
	});
