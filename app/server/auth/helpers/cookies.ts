import { setCookie } from "vinxi/http";

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
	setCookie("session", token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.STAGE === "production",
		expires: expiresAt,
	});
}

export function deleteSessionTokenCookie(): void {
	setCookie("session", "", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.STAGE === "production",
	});
}
