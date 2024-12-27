import { getLanguage } from "@/lib/language";
import { createMiddleware, registerGlobalMiddleware } from "@tanstack/start";
import { getCookie, getRequestIP, setResponseHeader } from "vinxi/http";
import { validateSessionToken } from "./auth";
import { redis } from "./redis";

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

const rateLimitByKey = async (
	key: string,
	{
		limit,
		window,
	}: {
		limit: number;
		window: number;
	},
) => {
	const result = await redis.get(key);

	if (result === null) {
		await redis.setex(key, window, 0);
	}

	const count = await redis.incr(key);
	if (count > limit) {
		throw new Error("Too many requests");
	}

	const time = await redis.ttl(key);

	setResponseHeader("X-RateLimit-Remaining", limit - count);
	setResponseHeader("X-RateLimit-Limit", limit);
	setResponseHeader("X-RateLimit-Reset", time);
};

export const rateLimitMiddleware = ({
	limit,
	window,
}: {
	limit: number;
	window: number;
}) => {
	return createMiddleware()
		.middleware([authMiddleware])
		.server(async ({ next, context }) => {
			if (context.user) {
				await rateLimitByKey(context.user.id, { limit, window });
			} else {
				const ip = getRequestIP();

				if (!ip) {
					throw new Error("IP not found");
				}

				await rateLimitByKey(ip, { limit, window });
			}

			return next();
		});
};

registerGlobalMiddleware({
	middleware: [rateLimitMiddleware({ limit: 100, window: 60 })],
});
