import { getLanguage } from "@/lib/language";
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
