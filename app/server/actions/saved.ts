import { createMiddleware, createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { getCookie, setCookie } from "vinxi/http";
import { generateId } from "../auth";
import { db } from "../db";
import { anonymousSessions, anonymousSessionsToResources } from "../db/schema";
import { SavedResourceSchema } from "../types";

export const anonymousSessionMiddleware = createMiddleware().server(
	async ({ next }) => {
		const token = getCookie("anonymous_session") ?? null;
		if (token === null) {
			const anonymousSessionId = generateId(16);
			setCookie("anonymous_session", anonymousSessionId, {
				path: "/",
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.STAGE === "production",
			});
			await db.insert(anonymousSessions).values({
				id: anonymousSessionId,
			});
			return next({
				context: {
					anonymousSessionId,
				},
			});
		}
		return next({
			context: {
				anonymousSessionId: token,
			},
		});
	},
);

export const toggleSavedFn = createServerFn({ method: "POST" })
	.middleware([anonymousSessionMiddleware])
	.validator(SavedResourceSchema.pick({ resourceId: true }))
	.handler(
		async ({ data: { resourceId }, context: { anonymousSessionId } }) => {
			const existing =
				await db.query.anonymousSessionsToResources.findFirst({
					where: and(
						eq(
							anonymousSessionsToResources.anonymousSessionId,
							anonymousSessionId,
						),
						eq(anonymousSessionsToResources.resourceId, resourceId),
					),
				});
			if (existing) {
				await db
					.delete(anonymousSessionsToResources)
					.where(
						and(
							eq(
								anonymousSessionsToResources.anonymousSessionId,
								anonymousSessionId,
							),
							eq(
								anonymousSessionsToResources.resourceId,
								resourceId,
							),
						),
					);
			} else {
				await db.insert(anonymousSessionsToResources).values({
					anonymousSessionId,
					resourceId,
				});
			}
		},
	);

export const updateSavedFn = createServerFn({ method: "POST" })
	.middleware([anonymousSessionMiddleware])
	.validator(
		SavedResourceSchema.extend({
			day: SavedResourceSchema.shape.day.optional(),
			seen: SavedResourceSchema.shape.seen.optional(),
		}),
	)
	.handler(
		async ({
			data: { resourceId, ...data },
			context: { anonymousSessionId },
		}) => {
			await db
				.update(anonymousSessionsToResources)
				.set(data)
				.where(
					and(
						eq(
							anonymousSessionsToResources.anonymousSessionId,
							anonymousSessionId,
						),
						eq(anonymousSessionsToResources.resourceId, resourceId),
					),
				);
		},
	);

export const resetSavedFn = createServerFn({ method: "POST" })
	.middleware([anonymousSessionMiddleware])
	.handler(async ({ context: { anonymousSessionId } }) => {
		await db
			.update(anonymousSessionsToResources)
			.set({ seen: true })
			.where(
				eq(
					anonymousSessionsToResources.anonymousSessionId,
					anonymousSessionId,
				),
			);
	});

export const getSavedFn = createServerFn({ method: "GET" })
	.middleware([anonymousSessionMiddleware])
	.handler(async ({ context: { anonymousSessionId } }) => {
		return await db.query.anonymousSessionsToResources.findMany({
			where: eq(
				anonymousSessionsToResources.anonymousSessionId,
				anonymousSessionId,
			),
		});
	});
