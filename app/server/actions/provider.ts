import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { generateId } from "../auth";
import { db } from "../db";
import { providers, providerTranslations } from "../db/schema";
import { languageMiddleware, protectedMiddleware } from "../middleware";

export const ProviderOnboardingSchema = z.object({
	name: z.string().min(1),
	email: z.string().email().optional(),
	website: z.string().url().optional(),
	description: z.string().min(1).optional(),
	phoneNumbers: z
		.object({
			phone: z
				.string()
				// Remove non-numeric characters
				.transform((phone) => phone.replace(/\D/g, ""))
				// Validate Canadian phone number
				.refine(
					(phone) => /^1?\d{10}$/.test(phone),
					"Invalid Canadian phone number. Must be 10 digits, optionally starting with 1",
				),
			type: z.enum(["phone", "fax", "toll-free", "tty"]),
		})
		.array()
		.optional(),
});

export const onboardProviderFn = createServerFn({
	method: "POST",
})
	.middleware([languageMiddleware, protectedMiddleware])
	.validator(ProviderOnboardingSchema)
	.handler(async ({ data, context }) => {
		const { name, email, website, description } = data;
		const providerId = generateId(16);
		await db.insert(providers).values({
			id: providerId,
			userId: context.user.id,
		});
		await db.insert(providerTranslations).values({
			providerId,
			language: context.language,
			name,
			description,
			website,
			email,
		});
		throw redirect({
			to: "/$language/admin",
			params: { language: context.language },
		});
	});
