import { z } from "zod";

import type enMessages from "@/messages/en";

export type Messages = typeof enMessages;

export const locales = [
	{ label: "English", value: "en" },
	{ label: "Français", value: "fr" },
];
export const LocaleSchema = z.enum(["en", "fr"]);
export type Locale = z.infer<typeof LocaleSchema>;
