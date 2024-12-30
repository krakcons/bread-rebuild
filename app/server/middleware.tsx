import { getLanguage } from "@/lib/language/actions";
import { createMiddleware } from "@tanstack/start";
import { getCookie } from "vinxi/http";
import { validateSessionToken } from "./auth";

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
