import { getLocalizedArray } from "@/lib/language";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "../auth";
import { db } from "../db";
import {
	providerPhoneNumbers,
	providers,
	providerTranslations,
} from "../db/schema";
import {
	languageMiddleware,
	protectedMiddleware,
	providerMiddleware,
} from "../middleware";
import { FullProviderType } from "../types";

export const ProviderFormSchema = z.object({
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
export type ProviderFormSchema = z.infer<typeof ProviderFormSchema>;

export const getProviderFn = createServerFn({
	method: "GET",
})
	.middleware([languageMiddleware, protectedMiddleware])
	.handler(async ({ context }): Promise<FullProviderType> => {
		const provider = await db.query.providers.findFirst({
			where: eq(providers.userId, context.user.id),
			with: {
				providerTranslations: true,
				providerPhoneNumbers: true,
			},
		});

		if (!provider) {
			throw redirect({
				to: "/$language/admin/onboarding",
				params: { language: context.language },
			});
		}

		return {
			...getLocalizedArray(
				provider.providerTranslations,
				context.language,
			),
			phoneNumbers: provider.providerPhoneNumbers,
			id: provider.id,
			userId: provider.userId,
		};
	});

export const onboardProviderFn = createServerFn({
	method: "POST",
})
	.middleware([languageMiddleware, protectedMiddleware])
	.validator(ProviderFormSchema)
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

export const editProviderFn = createServerFn({
	method: "POST",
})
	.middleware([providerMiddleware])
	.validator(ProviderFormSchema)
	.handler(async ({ data, context }) => {
		const { name, email, website, description, phoneNumbers } = data;

		await db
			.update(providerTranslations)
			.set({
				name,
				email,
				website,
				description,
			})
			.where(eq(providerTranslations.providerId, context.provider.id));

		if (phoneNumbers) {
			await db
				.delete(providerPhoneNumbers)
				.where(
					eq(providerPhoneNumbers.providerId, context.provider.id),
				);
			await db.insert(providerPhoneNumbers).values(
				phoneNumbers.map((phoneNumber) => ({
					providerId: context.provider.id,
					phone: phoneNumber.phone,
					type: phoneNumber.type,
				})) ?? [],
			);
		}
	});
