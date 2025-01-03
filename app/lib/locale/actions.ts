import { getCookie } from "vinxi/http";

import { getHeader } from "vinxi/http";

import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { LocaleSchema } from ".";

export const getLocale = createServerFn({
	method: "GET",
}).handler(() => {
	const locale = getCookie("locale");
	if (locale) {
		return locale as "en" | "fr";
	} else {
		const acceptlocale = getHeader("accept-locale")?.split(",")[0];
		const locale = acceptlocale?.startsWith("fr") ? "fr" : "en";
		setCookie("locale", locale, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
		});
		return locale;
	}
});

export const setLocale = createServerFn({
	method: "POST",
})
	.validator(LocaleSchema)
	.handler(({ data: locale }) => {
		setCookie("locale", locale);
	});
