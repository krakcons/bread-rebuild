import { db } from "@/server/db";
import { emailVerifications, passwordResets } from "@/server/db/schema";
import { sendEmail } from "@/server/email";
import { eq } from "drizzle-orm";
import { setCookie } from "vinxi/http";
import { generateId } from "..";

export const createAndSendEmailVerification = async (
	userId: string,
	email: string,
) => {
	await db
		.delete(emailVerifications)
		.where(eq(emailVerifications.userId, userId));
	// Create email verification record
	const [emailVerification] = await db
		.insert(emailVerifications)
		.values({
			id: generateId(16),
			userId,
			// 6 characters, no 0,O,I,1 to avoid confusion
			code: generateId(6, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"),
			// 10 minutes
			expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		})
		.returning();
	// Send verification email
	await sendEmail({
		to: [email],
		subject: "Verify your email",
		content: (
			<div>
				Here is your one time email verification code for Bread:{" "}
				<b>{emailVerification.code}</b>
			</div>
		),
	});
	// Set email verification cookie
	setCookie("email_verification", emailVerification.id, {
		httpOnly: true,
		path: "/",
		secure: process.env.STAGE === "production",
		sameSite: "lax",
		expires: emailVerification.expiresAt,
	});
};

export const createAndSendPasswordReset = async (
	userId: string,
	email: string,
) => {
	await db.delete(passwordResets).where(eq(passwordResets.userId, userId));
	// Create password reset record
	const [passwordReset] = await db
		.insert(passwordResets)
		.values({
			id: generateId(16),
			userId,
			code: generateId(6, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		})
		.returning();
	// Send password reset email
	await sendEmail({
		to: [email],
		subject: "Reset your password",
		content: (
			<div>
				Here is your one time password reset code for Bread:{" "}
				<b>{passwordReset.code}</b>
			</div>
		),
	});
	// Set password reset cookie
	setCookie("password_reset", passwordReset.id, {
		httpOnly: true,
		path: "/",
		secure: process.env.STAGE === "production",
		sameSite: "lax",
		expires: passwordReset.expiresAt,
	});
};
