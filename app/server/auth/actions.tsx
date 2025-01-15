import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { and, eq, isNull } from "drizzle-orm";
import { argon2Verify } from "hash-wasm";
import { getCookie } from "vinxi/http";
import { z } from "zod";
import {
	createSession,
	generateId,
	generateSessionToken,
	invalidateSession,
} from ".";
import { db } from "../db";
import { emailVerifications, passwordResets, users } from "../db/schema/auth";
import { providers } from "../db/schema/tables";
import { authMiddleware, localeMiddleware } from "../middleware";
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
} from "./helpers/cookies";
import { hashPassword } from "./helpers/password";
import {
	createAndSendEmailVerification,
	createAndSendPasswordReset,
} from "./helpers/verification";

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(64),
});

export const login = createServerFn({ method: "POST" })
	.middleware([localeMiddleware])
	.validator(LoginSchema)
	.handler(async ({ data, context }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (!user) return { error: "Invalid email or password" };
		if (!user.passwordHash)
			return { error: "User does not have a password.  " };
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
				to: "/$locale/admin/verify-email",
				params: { locale: context.locale },
			});
		} else {
			throw redirect({
				to: "/$locale/admin",
				params: { locale: context.locale },
			});
		}
	});

// Signup

export const SignupSchema = LoginSchema;
export type SignupSchema = z.infer<typeof SignupSchema>;

export const signup = createServerFn({ method: "POST" })
	.middleware([localeMiddleware])
	.validator(SignupSchema)
	.handler(async ({ data, context }) => {
		// Verify email is not already in use
		const existingUserWithEmail = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (existingUserWithEmail) return { error: "Email already in use" };

		const [user] = await db
			.insert(users)
			.values({
				id: generateId(16),
				email: data.email,
				passwordHash: await hashPassword(data.password),
			})
			.returning();

		await createAndSendEmailVerification(user.id, data.email);

		// Create session
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(sessionToken, session.expiresAt);

		throw redirect({
			to: "/$locale/admin/verify-email",
			params: { locale: context.locale },
		});
	});

// Verify email

export const VerifyEmailSchema = z.object({
	code: z.string().length(6),
});

export const verifyEmail = createServerFn({ method: "POST" })
	.middleware([localeMiddleware, authMiddleware])
	.validator(VerifyEmailSchema)
	.handler(async ({ data, context }) => {
		if (context.session === null) {
			throw redirect({
				to: "/$locale/admin/login",
				params: { locale: context.locale },
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
			to: "/$locale/admin/onboarding",
			params: { locale: context.locale },
		});
	});

export const resendEmailVerification = createServerFn({ method: "POST" })
	.middleware([localeMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.session === null) {
			throw redirect({
				to: "/$locale/admin/login",
				params: { locale: context.locale },
			});
		}
		await createAndSendEmailVerification(
			context.user.id,
			context.user.email,
		);
	});

// Reset password

const validatePasswordResetSession = async () => {
	const resetPasswordCookie = getCookie("password_reset");
	if (!resetPasswordCookie)
		return { error: "Invalid code. Please try again." };

	const passwordReset = await db.query.passwordResets.findFirst({
		where: eq(passwordResets.id, resetPasswordCookie),
		with: {
			user: true,
		},
	});
	if (!passwordReset) return { error: "Invalid code. Please try again." };

	if (passwordReset.expiresAt < new Date())
		return {
			error: "The password reset code was expired. Please request a new password reset.",
		};

	return passwordReset;
};

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email(),
});

export const resetPasswordFromEmail = createServerFn({ method: "POST" })
	.middleware([localeMiddleware])
	.validator(ResetPasswordEmailSchema)
	.handler(async ({ data, context }): Promise<{ error?: string }> => {
		const user = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});
		if (user) {
			await createAndSendPasswordReset(user.id, user.email);
		}
		throw redirect({
			to: "/$locale/admin/verify-email",
			params: { locale: context.locale },
			search: {
				type: "password_reset",
			},
		});
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

export const resetPassword = createServerFn({ method: "POST" })
	.middleware([localeMiddleware])
	.validator(ResetPasswordSchema)
	.handler(async ({ data, context }) => {
		const passwordReset = await validatePasswordResetSession();
		if ("error" in passwordReset) return passwordReset;

		await db
			.update(users)
			.set({
				passwordHash: await hashPassword(data.password),
			})
			.where(eq(users.id, passwordReset.userId));

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, passwordReset.userId);
		setSessionTokenCookie(sessionToken, session.expiresAt);

		await db
			.delete(passwordResets)
			.where(eq(passwordResets.id, passwordReset.id));

		throw redirect({
			to: "/$locale/admin",
			params: { locale: context.locale },
		});
	});

export const verifyPasswordResetEmail = createServerFn({ method: "POST" })
	.middleware([localeMiddleware])
	.validator(VerifyEmailSchema)
	.handler(async ({ data, context }) => {
		const passwordReset = await validatePasswordResetSession();
		if ("error" in passwordReset) return passwordReset;

		if (passwordReset.code !== data.code)
			return { error: "Invalid code. Please try again." };

		// Verify password reset
		await db
			.update(passwordResets)
			.set({
				emailVerified: new Date(),
			})
			.where(eq(passwordResets.id, passwordReset.id));

		// Verify user email if not already verified
		await db
			.update(users)
			.set({
				emailVerified: new Date(),
			})
			.where(
				and(
					eq(users.id, passwordReset.userId),
					isNull(users.emailVerified),
				),
			);
		await db
			.delete(emailVerifications)
			.where(eq(emailVerifications.userId, passwordReset.userId));

		throw redirect({
			to: "/$locale/admin/reset-password",
			params: { locale: context.locale },
		});
	});

export const isPasswordResetVerified = createServerFn({
	method: "GET",
}).handler(async () => {
	const passwordReset = await validatePasswordResetSession();
	if ("error" in passwordReset) return false;

	return passwordReset.emailVerified !== null;
});

export const resendPasswordResetVerification = createServerFn({
	method: "POST",
}).handler(async () => {
	const passwordReset = await validatePasswordResetSession();
	if ("error" in passwordReset) return passwordReset;

	await createAndSendPasswordReset(
		passwordReset.userId,
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
	.middleware([localeMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.user === null) {
			throw redirect({
				to: "/$locale/admin/login",
				params: { locale: context.locale },
			});
		}
		await createAndSendEmailVerification(
			context.user.id,
			context.user.email,
		);
	});

export const logoutFn = createServerFn({ method: "POST" })
	.middleware([localeMiddleware, authMiddleware])
	.handler(async ({ context }) => {
		if (context.session) {
			await invalidateSession(context.session.id);
			deleteSessionTokenCookie();
			throw redirect({
				to: "/$locale/admin/login",
				params: { locale: context.locale },
			});
		}
	});

export const getUserNeedsOnboarding = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		if (context.user === null) return false;

		// Check if user has a provider
		const provider = await db.query.providers.findFirst({
			where: eq(providers.userId, context.user.id),
		});

		return !provider;
	});
