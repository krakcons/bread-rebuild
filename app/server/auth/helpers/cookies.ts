import { getEvent } from "vinxi/http";

import { Resource } from "sst";
import { setCookie } from "vinxi/http";

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
	const event = getEvent();
	setCookie(event, "session", token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: Resource["bread-env"] === "prod",
		expires: expiresAt,
	});
}

export function deleteSessionTokenCookie(): void {
	const event = getEvent();
	setCookie(event, "session", "", {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: Resource["bread-env"] === "prod",
	});
}
