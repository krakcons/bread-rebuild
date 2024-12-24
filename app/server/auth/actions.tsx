import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { argon2id, argon2Verify } from "hash-wasm";
import { getCookie } from "vinxi/http";
import { z } from "zod";
import {
	createSession,
	generateId,
	generateSessionToken,
	invalidateSession,
} from ".";
import { db } from "../db";
import { emailVerifications, passwordResets, users } from "../db/schema";
import { authMiddleware, languageMiddleware } from "../middleware";
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
} from "./helpers/cookies";
import {
	createAndSendEmailVerification,
	createAndSendPasswordReset,
} from "./helpers/verification";

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
		const passwordVerified = await argon2Verify({
			hash: user.passwordHash,
			password: data.password,
		});
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
		const passwordHash = await argon2id({
			password: data.password,
			salt: crypto.getRandomValues(new Uint8Array(16)),
			parallelism: 1,
			iterations: 2,
			memorySize: 19456,
			hashLength: 32,
			outputType: "encoded",
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
			search: {
				type: "password_reset",
			},
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

// Reset password

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email(),
});

export const ResetPasswordSchema = z
	.object({
		password: z.string().min(8).max(64),
		passwordConfirmation: z.string().min(8).max(64),
	})
	.refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords do not match",
		path: ["passwordConfirmation"],
	});

export const resetPasswordFromEmail = createServerFn({ method: "POST" })
	.middleware([languageMiddleware])
	.validator(ResetPasswordEmailSchema)
	.handler(async ({ data, context }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (!user) return { error: "Invalid email" };

		await createAndSendPasswordReset(user.id, user.email);
		throw redirect({
			to: "/$language/admin/verify-email",
			params: { language: context.language },
			search: {
				type: "password_reset",
			},
		});
	});

export const resetPassword = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.validator(ResetPasswordSchema)
	.handler(async ({ data, context }) => {
		const verficationCookie = getCookie("password_reset");
		if (!verficationCookie)
			return { error: "Invalid code. Please try again." };

		const passwordReset = await db.query.passwordResets.findFirst({
			where: eq(passwordResets.id, verficationCookie),
		});
		if (!passwordReset) return { error: "Invalid code. Please try again." };

		if (passwordReset.expiresAt < new Date()) {
			return {
				error: "The password reset code was expired. Please request a new password reset.",
			};
		}

		const user = await db.query.users.findFirst({
			where: eq(users.id, passwordReset.userId),
		});
		if (!user) return { error: "Invalid user" };

		await db
			.update(users)
			.set({
				passwordHash: await argon2id({
					password: data.password,
					salt: crypto.getRandomValues(new Uint8Array(16)),
					parallelism: 1,
					iterations: 2,
					memorySize: 19456,
					hashLength: 32,
					outputType: "encoded",
				}),
			})
			.where(eq(users.id, user.id));

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);

		await db
			.delete(passwordResets)
			.where(eq(passwordResets.id, passwordReset.id));

		throw redirect({
			to: "/$language/admin",
			params: { language: context.language },
		});
	});

export const verifyPasswordResetEmail = createServerFn({ method: "POST" })
	.middleware([languageMiddleware, authMiddleware])
	.validator(VerifyEmailSchema)
	.handler(async ({ data, context }) => {
		const verficationCookie = getCookie("password_reset");
		if (!verficationCookie)
			return { error: "Invalid code. Please try again." };

		const passwordReset = await db.query.passwordResets.findFirst({
			where: eq(passwordResets.id, verficationCookie),
			with: {
				user: true,
			},
		});
		if (!passwordReset) return { error: "Invalid code. Please try again." };

		if (passwordReset.expiresAt < new Date()) {
			return {
				error: "The password reset code was expired. Please request a new password reset.",
			};
		}

		if (passwordReset.code !== data.code)
			return { error: "Invalid code. Please try again." };

		await db
			.update(passwordResets)
			.set({
				emailVerified: new Date(),
			})
			.where(eq(passwordResets.id, passwordReset.id));
		await db
			.update(users)
			.set({
				emailVerified: new Date(),
			})
			.where(eq(users.id, passwordReset.userId));

		throw redirect({
			to: "/$language/admin/reset-password",
			params: { language: context.language },
		});
	});

export const isPasswordResetVerified = createServerFn({
	method: "GET",
}).handler(async () => {
	const resetPasswordCookie = getCookie("password_reset");
	if (!resetPasswordCookie) return false;

	const passwordReset = await db.query.passwordResets.findFirst({
		where: eq(passwordResets.id, resetPasswordCookie),
	});
	return passwordReset?.emailVerified ?? false;
});

export const resendPasswordResetVerification = createServerFn({
	method: "POST",
})
	.middleware([languageMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		const resetPasswordCookie = getCookie("password_reset");
		if (!resetPasswordCookie)
			return { error: "No password reset cookie found" };

		const passwordReset = await db.query.passwordResets.findFirst({
			where: eq(passwordResets.id, resetPasswordCookie),
			with: {
				user: true,
			},
		});
		if (!passwordReset) return { error: "Invalid code. Please try again." };

		await createAndSendPasswordReset(
			passwordReset.user.id,
			passwordReset.user.email,
		);
	});

// Other

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
