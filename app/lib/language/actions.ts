import { getCookie } from "vinxi/http";

import { getHeader } from "vinxi/http";

import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { LanguageSchema } from ".";

export const getLanguage = createServerFn({
	method: "GET",
}).handler(() => {
	const language = getCookie("language");
	if (language) {
		return language as "en" | "fr";
	} else {
		const acceptLanguage = getHeader("accept-language")?.split(",")[0];
		const language = acceptLanguage?.startsWith("fr") ? "fr" : "en";
		setCookie("language", language, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		});
		return language;
	}
});

export const setLanguage = createServerFn({
	method: "POST",
})
	.validator(LanguageSchema)
	.handler(({ data: language }) => {
		setCookie("language", language);
	});
