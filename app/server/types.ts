import { z } from "zod";

export const ContactSchema = z.object({
	email: z.string().email().optional(),
	website: z.string().url().optional(),
	phoneNumbers: z
		.object({
			phone: z
				.string()
				// Remove non-numeric characters
				.transform((phone) => phone.replace(/\D/g, ""))
				// Validate Canadian phone number
				.refine(
					(phone) => /^1?\d{10}$/.test(phone),
					"Invalid Canadian phone number. Must be 10 digits, optionally starting with 1",
				),
			type: z.enum(["phone", "fax", "toll-free", "tty"]),
		})
		.array()
		.optional(),
});
export type ContactType = z.infer<typeof ContactSchema>;

export const OfferingEnum = z.enum([
	"meal",
	"groceries",
	"delivery",
	"hamper",
	"pantry",
	"drop-in",
	"market",
]);
export type OfferingEnum = z.infer<typeof OfferingEnum>;