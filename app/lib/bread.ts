import { db } from "@/server/db";
import { createServerFn } from "@tanstack/start";

export const getDietaryOptions = createServerFn({ method: "GET" }).handler(
	async () => {
		const dietaryOptions = await db.query.dietaryOptions.findMany({
			with: {
				dietaryOptionsTranslations: true,
			},
		});
		return dietaryOptions;
	},
);
