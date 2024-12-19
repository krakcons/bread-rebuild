import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(64),
});

export const login = createServerFn()
	.validator(LoginSchema)
	.handler(async ({ data }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
	});

export const signup = createServerFn()
	.validator(LoginSchema)
	.handler(async ({ data }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
	});
