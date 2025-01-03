import { flattenLocalizedObject } from "@/lib/locale";
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
	localeMiddleware,
	protectedMiddleware,
	providerMiddleware,
} from "../middleware";
import {
	LocalizedInputSchema,
	LocalizedQuerySchema,
	LocalizedQueryType,
	ProviderType,
} from "../types";

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
	.middleware([localeMiddleware, protectedMiddleware])
	.validator(LocalizedQuerySchema)
	.handler(async ({ context, data }): Promise<ProviderType | undefined> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		const provider = await db.query.providers.findFirst({
			where: eq(providers.userId, context.user.id),
			with: {
				translations: localeOpts.fallback
					? true
					: {
							where: eq(
								providerTranslations.locale,
								localeOpts.locale,
							),
						},
				phoneNumbers: true,
			},
		});

		return flattenLocalizedObject(provider, localeOpts);
	});

export const onboardProviderFn = createServerFn({
	method: "POST",
})
	.middleware([localeMiddleware, protectedMiddleware])
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
			locale: context.locale,
			name,
			description,
			website,
			email,
		});
		throw redirect({
			to: "/$locale/admin",
			params: { locale: context.locale },
		});
	});

export const editProviderFn = createServerFn({
	method: "POST",
})
	.middleware([providerMiddleware])
	.validator(ProviderFormSchema.and(LocalizedInputSchema))
	.handler(async ({ data, context }) => {
		const { name, email, website, description, phoneNumbers, locale } =
			data;

		await db
			.insert(providerTranslations)
			.values({
				providerId: context.provider.id,
				locale,
				name,
				email,
				website,
				description,
			})
			.onConflictDoUpdate({
				target: [
					providerTranslations.providerId,
					providerTranslations.locale,
				],
				set: {
					name,
					email,
					website,
					description,
				},
			});

		if (phoneNumbers && phoneNumbers.length > 0) {
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
