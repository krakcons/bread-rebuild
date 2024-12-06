import { createServerFn } from "@tanstack/start";
import { getCookie, getEvent, getHeader, setCookie } from "vinxi/http";
import { english, french } from "./messages";

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

const commonTranslations = new Map<string, string>([
	["Free", "Gratuit"],
	["Mon", "Lun"],
	["Tue", "Mar"],
	["Wed", "Mer"],
	["Thu", "Jeu"],
	["Fri", "Ven"],
	["Sat", "Sam"],
	["Sun", "Dim"],
]);

export const translate = (enValue: string, language: "en" | "fr") => {
	if (language === "en") return enValue;
	return commonTranslations.get(enValue) || enValue;
};
