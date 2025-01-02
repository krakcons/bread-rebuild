import { getLanguage } from "@/lib/language/actions";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { getCookie } from "vinxi/http";
import { validateSessionToken } from "./auth";
import { db } from "./db";
import { providers } from "./db/schema";

export const languageMiddleware = createMiddleware().server(
	async ({ next }) => {
		const language = await getLanguage();
		return next({
			context: {
				language,
			},
		});
	},
);

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const token = getCookie("session") ?? null;
	if (token === null) {
		return next({
			context: {
				session: null,
				user: null,
			},
		});
	}
	const result = await validateSessionToken(token);
	return next({
		context: result,
	});
});

export const protectedMiddleware = createMiddleware()
	.middleware([authMiddleware])
	.server(async ({ next, context }) => {
		if (context.session === null || context.user === null) {
			throw new Error("Unauthorized");
		}
		return next({
			context: {
				session: context.session,
				user: context.user,
			},
		});
	});

export const providerMiddleware = createMiddleware()
	.middleware([languageMiddleware, protectedMiddleware])
	.server(async ({ next, context }) => {
		const provider = await db.query.providers.findFirst({
			where: eq(providers.userId, context.user.id),
		});

		if (!provider) {
			throw redirect({
				to: "/$language/admin/onboarding",
				params: { language: context.language },
			});
		}

		return next({
			context: {
				provider,
			},
		});
	});
