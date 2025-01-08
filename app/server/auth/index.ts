import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { sha256 } from "@oslojs/crypto/sha2";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, SessionType, users, UserType } from "../db/schema/auth";
import { providers } from "../db/schema/tables";
import { BaseProviderType } from "../db/types";

const random: RandomReader = {
	read(bytes) {
		crypto.getRandomValues(bytes);
	},
};

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(
	token: string,
	userId: string,
): Promise<SessionType> {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token)),
	);
	const session: SessionType = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await db.insert(sessions).values(session);
	return session;
}

export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token)),
	);
	const result = await db
		.select({ user: users, session: sessions, provider: providers })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.leftJoin(providers, eq(providers.userId, users.id))
		.where(eq(sessions.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null, provider: null };
	}
	const { user, session, provider } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null, provider: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessions)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(sessions.id, session.id));
	}
	const { passwordHash, ...safeUser } = user;
	return { session, user: safeUser, provider };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export type SessionValidationResult =
	| {
			session: SessionType;
			user: Omit<UserType, "passwordHash">;
			provider: BaseProviderType | null;
	  }
	| { session: null; user: null; provider: null };

export function generateId(length: number, alphabet?: string): string {
	return generateRandomString(
		random,
		alphabet ??
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		length,
	);
}
