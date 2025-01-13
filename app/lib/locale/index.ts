import { LocalizedQueryType } from "@/server/db/types";
import { z } from "zod";
import { english, french } from "./messages";

export const locales = [
	{ label: "English", value: "en" },
	{ label: "Français", value: "fr" },
];
export const LocaleSchema = z.enum(["en", "fr"]);
export type Locale = z.infer<typeof LocaleSchema>;

export const getTranslations = (locale: string) => {
	return locale === "fr" ? french : english;
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

export type FlattenedLocalized<
	TBase extends { translations: TTranslation[] },
	TTranslation extends { locale: string },
> = Omit<TBase, "translations"> & TTranslation;

export const flattenLocalizedObject = <
	TBase extends { translations: TTranslation[] },
	TTranslation extends { locale: string } & Record<string, any>,
	TResult = FlattenedLocalized<TBase, TTranslation>,
>(
	obj?: TBase,
	options?: LocalizedQueryType,
): TResult | undefined => {
	if (!obj) return undefined;
	const { locale, fallback = true } = options ?? {};

	// Find translation in requested locale or fallback to first
	const translation =
		obj.translations.find((item) => item.locale === locale) ??
		(fallback ? obj.translations[0] : undefined);

	// Create new object without translations array
	const { translations, ...rest } = obj;

	// Return base object merged with translation data
	return {
		...rest,
		...translation,
	} as TResult;
};
