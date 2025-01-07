import { z } from "zod";

export const ContactSchema = z.object({
	email: z.string().email().optional(),
	website: z
		.string()
		.url()
		.startsWith("https://", { message: "Must start with https://" })
		.optional(),
	phoneNumbers: z
		.object({
			phone: z
				.string()
				// Remove non-numeric characters
				.transform((phone) => phone.replace(/\D/g, ""))
				// Validate Canadian phone number
				.refine(
					(phone) => /^1?\d{10}$/.test(phone),
					"Invalid Canadian phone number. Must be 10 digits, optionally starting with a +1",
				),
			type: z.enum(["phone", "fax", "toll-free", "tty"]),
		})
		.array()
		.optional(),
});
export type ContactType = z.infer<typeof ContactSchema>;

export const OfferingSchema = z.enum([
	"meal",
	"groceries",
	"delivery",
	"hamper",
	"pantry",
	"drop-in",
	"market",
	"other",
]);
export type OfferingType = z.infer<typeof OfferingSchema>;

export const DietaryOptionSchema = z.enum([
	"vegetarian",
	"vegan",
	"halal",
	"kosher",
	"celiac",
	"gluten-free",
	"renal-disease",
	"baby",
	"pet",
	"other",
]);
export type DietaryOptionType = z.infer<typeof DietaryOptionSchema>;
