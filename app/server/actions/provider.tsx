import { flattenLocalizedObject } from "@/lib/locale";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateId } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";
import {
	providerPhoneNumbers,
	providers,
	providerTranslations,
} from "../db/schema/tables";
import {
	LocalizedInputSchema,
	LocalizedQuerySchema,
	LocalizedQueryType,
	ProviderType,
} from "../db/types";
import { sendEmail } from "../email";
import {
	adminMiddleware,
	localeMiddleware,
	protectedMiddleware,
} from "../middleware";
import { ContactSchema } from "../types";

export const ProviderFormSchema = z.object({
	name: z.string().min(1),
	email: ContactSchema.shape.email,
	website: ContactSchema.shape.website,
	phoneNumbers: ContactSchema.shape.phoneNumbers,
	description: z.string().min(1).optional(),
});
export type ProviderFormSchema = z.infer<typeof ProviderFormSchema>;

export const getMyProviderFn = createServerFn({
	method: "GET",
})
	.middleware([localeMiddleware, protectedMiddleware])
	.validator(LocalizedQuerySchema)
	.handler(async ({ context, data }): Promise<ProviderType | undefined> => {
		const localeOpts: Required<LocalizedQueryType> = {
			locale: data?.locale ?? context.locale,
			fallback: data?.fallback ?? true,
		};
		console.log(process.env);
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

export const mutateProviderFn = createServerFn({
	method: "POST",
})
	.middleware([localeMiddleware, protectedMiddleware])
	.validator(
		ProviderFormSchema.extend({
			id: z.string().optional(),
			redirect: z.boolean().optional(),
		}).and(LocalizedInputSchema),
	)
	.handler(async ({ data, context }) => {
		const { name, email, website, description, phoneNumbers } = data;

		const isOnboarding = data.id === undefined;

		const providerId = data.id ?? generateId(16);
		await db.transaction(async (tx) => {
			await tx
				.insert(providers)
				.values({
					id: providerId,
					userId: context.user.id,
				})
				.onConflictDoUpdate({
					target: providers.id,
					set: {
						updatedAt: new Date(),
					},
				});
			await tx
				.insert(providerTranslations)
				.values({
					providerId,
					locale: data.locale,
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
				await tx
					.delete(providerPhoneNumbers)
					.where(eq(providerPhoneNumbers.providerId, providerId));
				await tx.insert(providerPhoneNumbers).values(
					phoneNumbers.map((phoneNumber) => ({
						providerId,
						phone: phoneNumber.phone,
						type: phoneNumber.type,
					})) ?? [],
				);
			}
		});
		if (isOnboarding) {
			const admins = await db.query.users.findMany({
				where: eq(users.role, "admin"),
			});
			await sendEmail({
				to: admins.map((admin) => admin.email),
				subject: "Verification Required",
				content: (
					<div>
						<h1>Verification Required</h1>
						<p>
							A new provider has been onboarded, please review the
							provider details within the link below and approve
							or reject the provider.
						</p>
						<p>
							You can view the provider{" "}
							<a
								href={`${process.env.SITE_URL}/admin/providers/${providerId}`}
							>
								here
							</a>
						</p>
					</div>
				),
			});
		}
		if (data.redirect) {
			throw redirect({
				to: "/$locale/admin",
				params: { locale: context.locale },
			});
		}
	});

export const getProvidersFn = createServerFn({
	method: "GET",
})
	.middleware([adminMiddleware])
	.validator(LocalizedQuerySchema)
	.handler(async ({ context }) => {
		const providerList = await db.query.providers.findMany({
			with: {
				translations: true,
				user: true,
			},
		});
		return providerList.map(
			(provider) =>
				flattenLocalizedObject(provider, {
					locale: context.locale,
					fallback: true,
				})!,
		);
	});

export const getProviderFn = createServerFn({
	method: "GET",
})
	.middleware([adminMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data, context }) => {
		const provider = await db.query.providers.findFirst({
			where: eq(providers.id, data.id),
			with: {
				translations: true,
				user: true,
				phoneNumbers: true,
			},
		});
		return flattenLocalizedObject(provider, {
			locale: context.locale,
			fallback: true,
		});
	});

export const updateProviderStatusFn = createServerFn({
	method: "POST",
})
	.middleware([adminMiddleware])
	.validator(
		z.object({
			id: z.string(),
			status: z.enum(["pending", "approved", "rejected"]),
		}),
	)
	.handler(async ({ data }) => {
		const { id, status } = data;
		await db.update(providers).set({ status }).where(eq(providers.id, id));
	});