import { hash, verify } from "@node-rs/argon2";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { getCookie } from "vinxi/http";
import { z } from "zod";
import {
	createSession,
	generateId,
	generateSessionToken,
	invalidateSession,
} from ".";
import { db } from "../db";
import { emailVerifications, users } from "../db/schema";
import { authMiddleware, languageMiddleware } from "../middleware";
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
} from "./helpers/cookies";
import { createAndSendEmailVerification } from "./helpers/verification";

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(64),
});

export const login = createServerFn({ method: "POST" })
	.middleware([languageMiddleware])
	.validator(LoginSchema)
	.handler(async ({ data, context }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (!user) return { error: "Invalid email or password" };
		const passwordVerified = await verify(user.passwordHash, data.password);
		if (!passwordVerified) return { error: "Invalid email or password" };

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);

		if (!user.emailVerified) {
			await createAndSendEmailVerification(user.id, user.email);
			throw redirect({
				to: "/$language/admin/verify-email",
				params: { language: context.language },
			});
		} else {
			throw redirect({
				to: "/$language/admin",
				params: { language: context.language },
			});
		}
	});

// Signup

export const SignupSchema = LoginSchema.extend({
	passwordConfirmation: z.string().min(8).max(64),
}).refine((data) => data.password === data.passwordConfirmation, {
	message: "Passwords do not match",
	path: ["passwordConfirmation"],
});
export type SignupSchema = z.infer<typeof SignupSchema>;

export const signup = createServerFn({ method: "POST" })
	.middleware([languageMiddleware])
	.validator(SignupSchema)
	.handler(async ({ data, context }) => {
		// Verify email is not already in use
		const existingUserWithEmail = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (existingUserWithEmail) return { error: "Email already in use" };

		// Hash password/ create user
		const passwordHash = await hash(data.password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});
		const [user] = await db
			.insert(users)
			.values({
				id: generateId(16),
				email: data.email,
				passwordHash,
			})
			.returning();
		await createAndSendEmailVerification(user.id, data.email);
		// Create session
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);
		throw redirect({
			to: "/$language/admin/verify-email",
			params: { language: context.language },
		});
	});

// Verify email

export const VerifyEmailSchema = z.object({
	code: z.string().length(6),
});

export const verifyEmail = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.validator(VerifyEmailSchema)
	.handler(async ({ data, context }) => {
		if (context.session === null) {
			throw redirect({
				to: "/$language/admin/login",
				params: { language: context.language },
			});
		}

		const verficationCookie = getCookie("email_verification");
		if (!verficationCookie)
			return { error: "Invalid code. Please try again." };

		const emailVerification = await db.query.emailVerifications.findFirst({
			where: and(
				eq(emailVerifications.userId, context.user?.id),
				eq(emailVerifications.id, verficationCookie),
			),
		});
		if (!emailVerification)
			return { error: "Invalid code. Please try again." };

		if (emailVerification.expiresAt < new Date()) {
			await createAndSendEmailVerification(
				context.user.id,
				context.user.email,
			);
			return {
				error: "The verification code was expired. We sent another code to your inbox.",
			};
		}

		if (emailVerification.code !== data.code)
			return { error: "Invalid code. Please try again." };

		await db
			.delete(emailVerifications)
			.where(eq(emailVerifications.id, emailVerification.id));
		await db
			.update(users)
			.set({
				emailVerified: new Date(),
			})
			.where(eq(users.id, context.user.id));

		throw redirect({
			to: "/$language/admin",
			params: { language: context.language },
		});
	});

export const resendEmailVerification = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.session === null) {
			throw redirect({
				to: "/$language/admin/login",
				params: { language: context.language },
			});
		}
		await createAndSendEmailVerification(
			context.user.id,
			context.user.email,
		);
	});

export const getAuth = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return context;
	});

export const sendVerificationEmail = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.user === null) {
			throw redirect({
				to: "/$language/admin/login",
				params: { language: context.language },
			});
		}
		await createAndSendEmailVerification(
			context.user.id,
			context.user.email,
		);
	});

export const logout = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.session) {
			await invalidateSession(context.session.id);
			deleteSessionTokenCookie();
			throw redirect({
				to: "/$language/admin/login",
				params: { language: context.language },
			});
		}
	});