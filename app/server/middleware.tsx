import { getLocale } from "@/lib/locale/actions";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { getCookie } from "vinxi/http";
import { validateSessionToken } from "./auth";
import { db } from "./db";
import { providers } from "./db/schema";

export const localeMiddleware = createMiddleware().server(async ({ next }) => {
	const locale = await getLocale();
	return next({
		context: {
			locale,
		},
	});
});

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const token = getCookie("session") ?? null;
	console.log(token);
	if (token === null) {
		return next({
			context: {
				session: null,
				user: null,
				providerId: null,
			},
		});
	}
	const result = await validateSessionToken(token);
	if (result.session === null) {
		console.log("deleting session token cookie");
		// await deleteSessionTokenCookie();
	}
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
	.middleware([localeMiddleware, protectedMiddleware])
	.server(async ({ next, context }) => {
		const provider = await db.query.providers.findFirst({
			where: eq(providers.userId, context.user.id),
		});

		if (!provider) {
			throw redirect({
				to: "/$locale/admin/onboarding",
				params: { locale: context.locale },
			});
		}

		return next({
			context: {
				provider,
			},
		});
	});
