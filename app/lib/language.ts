import { createServerFn } from "@tanstack/start";
import { getCookie, getEvent, getHeader, setCookie } from "vinxi/http";

export const english = {
	search: "Search",
	free: "Free",
	list: "List",
	map: "Map",
};

export const french: typeof english = {
	search: "Rechercher",
	free: "Gratuit",
	list: "Liste",
	map: "Carte",
};

export const getTranslations = (language: string) => {
	return language === "fr" ? french : english;
};

export const getLanguage = createServerFn("GET", () => {
	const event = getEvent();
	const language = getCookie(event, "language");
	if (language) {
		return language;
	} else {
		const acceptLanguage = getHeader(event, "accept-language")?.split(",")[0];
		const language = acceptLanguage?.startsWith("fr") ? "fr" : "en";
		setCookie(event, "language", language);
		return language;
	}
});

export const setLanguage = createServerFn("POST", (language: "en" | "fr") => {
	setCookie("language", language);
});

export type LocalizationObject<T> = {
	en?: T | null;
	fr?: T | null;
};

export const getLocalizedField = <T>(
	obj: LocalizationObject<T>,
	locale: string
): T | undefined | null => {
	if (locale === "fr" && obj["fr"] !== "") return obj[locale];
	else return obj["en"];
};
