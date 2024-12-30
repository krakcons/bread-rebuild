import { z } from "zod";
import { english, french } from "./messages";

export const languages = ["en", "fr"];
export const LanguageSchema = z.enum(["en", "fr"]);
export type Language = z.infer<typeof LanguageSchema>;

export const getTranslations = (language: string) => {
	return language === "fr" ? french : english;
};

export type LocalizationObject<T> = {
	en?: T | null;
	fr?: T | null;
};

export const getLocalizedField = <T>(
	obj: LocalizationObject<T>,
	locale: string,
): T | undefined | null => {
	if (locale === "fr" && obj["fr"] !== "") return obj[locale];
	else return obj["en"];
};

export const getLocalizedArray = <T>(obj: T[], locale: string): T => {
	return obj.find((item) => item[locale] !== null) ?? obj[0];
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
	["Vegetarian", "Végétarien"],
	["Halal", "Halal"],
	["Celiac", "Céliaque"],
	["Renal Disease", "Maladie Rénale"],
	["Baby", "Bébé"],
	["Kosher", "Kosher"],
	["Gluten Free", "Sans Gluten"],
	["Pet Food", "Alimentation pour animaux"],
]);

export const translate = (enValue: string, language: "en" | "fr") => {
	if (language === "en") return enValue;
	return commonTranslations.get(enValue) || enValue;
};
