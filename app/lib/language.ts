import { createServerFn } from "@tanstack/start";
import { useMemo } from "react";
import { setCookie } from "vinxi/http";

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
	const translations = useMemo(() => {
		return language === "fr" ? french : english;
	}, [language]);
	return translations;
};

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
