import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

import { generateId } from "@/server/auth";
import { db } from "@/server/db";
import {
	dietaryOptions,
	dietaryOptionsTranslations,
	phoneNumbers,
	providers,
	providerTranslations,
	resourceBodyTranslations,
	resources,
	resourceToDietaryOptions,
} from "@/server/db/schema";
import {
	PhoneNumberType,
	ResourceBodyType,
	ResourceType,
} from "@/server/types";
import dietary from "../../data/dietary.json";
import meals from "../../data/meals.json";
import { translate } from "../../lib/language";

type LocalizedFieldType = {
	en: string;
	fr: string;
};

// Helper function to create localized fields
export const createLocalizedField = (enValue: string): LocalizedFieldType => {
	return {
		en: enValue,
		fr: translate(enValue, "fr") || "",
	};
};

// Helper function to parse contact info from registration notes
// e.g. "call: 403 288 9040 e: svdp@st-peters.ca" -> { phone: "403 288 9040", email: "svdp@st-peters.ca" }
type ContactInfo = {
	phone: string | null;
	email: string | null;
	website: string | null;
};

const parseContactInfo = (notes: string): ContactInfo => {
	if (!notes) return { phone: null, email: null, website: null };
	const result: ContactInfo = { phone: null, email: null, website: null };

	const phoneMatch = notes.match(/call:\s*([0-9\s-]+)/);
	if (phoneMatch) {
		result.phone = phoneMatch[1].trim();
	}

	const emailMatch = notes.match(/e:\s*([^\s]+@[^\s]+)/);
	if (emailMatch) {
		result.email = emailMatch[1].trim();
	}

	return result;
};

const parseHours = (drupalData: any) => {
	return (
		[
			drupalData.attributes.field_avail_mon_bool && {
				day: "Mon",
				open: `${(drupalData.attributes.field_avail_mon_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_mon_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_mon_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_mon_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_tue_bool && {
				day: "Tue",
				open: `${(drupalData.attributes.field_avail_tue_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_tue_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_tue_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_tue_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_wed_bool && {
				day: "Wed",
				open: `${(drupalData.attributes.field_avail_wed_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_wed_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_wed_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_wed_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_thu_bool && {
				day: "Thu",
				open: `${(drupalData.attributes.field_avail_thu_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_thu_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_thu_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_thu_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_fri_bool && {
				day: "Fri",
				open: `${(drupalData.attributes.field_avail_fri_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_fri_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_fri_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_fri_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_sat_bool && {
				day: "Sat",
				open: `${(drupalData.attributes.field_avail_sat_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_sat_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_sat_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_sat_close_min ?? 0).toString().padStart(2, "0")}`,
			},
			drupalData.attributes.field_avail_sun_bool && {
				day: "Sun",
				open: `${(drupalData.attributes.field_avail_sun_open_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_sun_open_min ?? 0).toString().padStart(2, "0")}`,
				close: `${(drupalData.attributes.field_avail_sun_close_hour ?? 0).toString().padStart(2, "0")}${(drupalData.attributes.field_avail_sun_close_min ?? 0).toString().padStart(2, "0")}`,
			},
		]
			.filter(Boolean)
			.map((hour) => `${hour.day} ${hour.open} - ${hour.close}`)
			.join("; ") + "; "
	);
};

export const APIRoute = createAPIFileRoute("/api/seed")({
	GET: async () => {
		try {
			// Convert Drupal meal/pantry to ResourceType
			const convertDrupalToResource = (
				drupalData: (typeof meals)[number],
				providerId: string,
			): {
				resource: ResourceType;
				body: {
					en: Omit<ResourceBodyType, "id">;
					fr: Omit<ResourceBodyType, "id">;
				};
				phoneNumber: PhoneNumberType | null;
				dietaryOptions: string[];
			} => {
				const contactInfo = parseContactInfo(
					drupalData.attributes.field_registration_notes ?? "",
				);
				const hours = parseHours(drupalData);
				const dietaryOptions: string[] = dietary
					.filter((dietary) =>
						drupalData.relationships.field_dietary.data.some(
							({ id }) => dietary.id === id,
						),
					)
					.map((dietary) => dietary.attributes.name);

				const resource: ResourceType = {
					id: generateId(16),
					providerId,
					...contactInfo,
					parkingAvailable:
						drupalData.attributes.field_parking_avail_bool || false,
					preparationRequired:
						drupalData.attributes.field_prep_required_bool || false,
					free: drupalData.attributes.field_price_description
						?.toLowerCase()
						.includes("free"),
					wheelchairAccessible:
						drupalData.attributes.field_wheelchair_acc_bool ||
						false,
					transitAvailable:
						drupalData.attributes.field__near_transit_bool || false,
					registrationRequired:
						drupalData.attributes.field_registration_bool || false,
					offering:
						drupalData.attributes.field_service_type.toLowerCase() as
							| "meal"
							| "pantry"
							| "groceries"
							| "delivery"
							| "hamper"
							| "drop-in",
					street1:
						drupalData.attributes.field_pickup_address
							.address_line1,
					street2:
						drupalData.attributes.field_pickup_address
							.address_line2,
					city: drupalData.attributes.field_pickup_address.locality,
					postalCode:
						drupalData.attributes.field_pickup_address.postal_code,
					province:
						drupalData.attributes.field_pickup_address
							.administrative_area,
					country:
						drupalData.attributes.field_pickup_address.country_code,
					lat: drupalData.attributes.field_geofield?.lat ?? null,
					lng: drupalData.attributes.field_geofield?.lon ?? null,
				};

				const phoneNumber: PhoneNumberType | null = contactInfo.phone
					? {
							id: generateId(16),
							phone: contactInfo.phone,
							name: "Main",
							type: translate("phone", "en"),
							resourceId: resource.id,
						}
					: null;

				const body: {
					en: Omit<ResourceBodyType, "id">;
					fr: Omit<ResourceBodyType, "id">;
				} = {
					en: {
						resourceId: resource.id,
						fees: drupalData.attributes.field_cost_notes,
						language: "en",
						hours,
						eligibility:
							drupalData.attributes.field_registration_notes,
						accessibility:
							drupalData.attributes.field_wheelchair_notes,
						documentsRequired: "",
						applicationProcess:
							!contactInfo.email &&
							!contactInfo.phone &&
							drupalData.attributes.field_registration_notes
								? drupalData.attributes.field_registration_notes
								: "",
						parking: drupalData.attributes.field_parking_notes,
						preparation:
							drupalData.attributes
								.field_preparation_required_notes,
						transit:
							drupalData.attributes.field_transit_nearest_stop,
						capacity: drupalData.attributes.field_resource_capacity,
						wheelchair:
							drupalData.attributes.field_wheelchair_notes,
					},
					fr: {
						resourceId: resource.id,
						fees: drupalData.attributes.field_cost_notes,
						language: "fr",
						hours,
						eligibility:
							drupalData.attributes.field_registration_notes,
						accessibility:
							drupalData.attributes.field_wheelchair_notes,
						documentsRequired: "",
						applicationProcess:
							!contactInfo.email &&
							!contactInfo.phone &&
							drupalData.attributes.field_registration_notes
								? drupalData.attributes.field_registration_notes
								: "",
						parking: drupalData.attributes.field_parking_notes,
						preparation:
							drupalData.attributes
								.field_preparation_required_notes,
						transit:
							drupalData.attributes.field_transit_nearest_stop,
						capacity: drupalData.attributes.field_resource_capacity,
						wheelchair:
							drupalData.attributes.field_wheelchair_notes,
					},
				};

				return {
					resource,
					body,
					phoneNumber,
					dietaryOptions,
				};
			};

			// Clear existing data
			await db.delete(resourceToDietaryOptions);
			await db.delete(dietaryOptionsTranslations);
			await db.delete(dietaryOptions);
			await db.delete(phoneNumbers);
			await db.delete(resourceBodyTranslations);
			await db.delete(resources);
			await db.delete(providerTranslations);
			await db.delete(providers);

			// Create dietary restrictions
			const dietaryMap = new Map();
			const dietaryData = [
				{ en: "Vegetarian", fr: "Vegetarien" },
				{ en: "Halal", fr: "Halal" },
				{ en: "Celiac", fr: "Céliaque" },
				{ en: "Renal Disease", fr: "Maladie Rénale" },
				{ en: "Baby", fr: "Bébé" },
				{ en: "Kosher", fr: "Kosher" },
				{ en: "Gluten Free", fr: "Sans Gluten" },
				{ en: "Pet Food", fr: "Alimentation pour animaux" },
			];

			for (const dietary of dietaryData) {
				const id = generateId(16);
				dietaryMap.set(dietary.en, id);

				await db.insert(dietaryOptions).values({ id });

				await db.insert(dietaryOptionsTranslations).values([
					{
						dietaryOptionId: id,
						language: "en",
						name: dietary.en,
					},
					{
						dietaryOptionId: id,
						language: "fr",
						name: dietary.fr,
					},
				]);
			}

			const providerId = generateId(16);
			await db.insert(providers).values({
				id: providerId,
				website: "https://bread-dev.nuonn.com",
				email: "contact@bread-dev.nuonn.com",
			});

			// Convert and insert resources
			for (const meal of meals) {
				const { resource, body, phoneNumber, dietaryOptions } =
					convertDrupalToResource(meal, providerId);

				// Insert resource
				await db.insert(resources).values(resource);

				// Insert resource body
				await db.insert(resourceBodyTranslations).values(body.en);
				await db.insert(resourceBodyTranslations).values(body.fr);

				// Insert phone numbers
				if (phoneNumber) {
					await db.insert(phoneNumbers).values(phoneNumber);
				}

				// Insert dietary restrictions
				for (const dietary of dietaryOptions) {
					const dietaryId = dietaryMap.get(dietary);
					if (dietaryId) {
						await db.insert(resourceToDietaryOptions).values({
							resourceId: resource.id,
							dietaryOptionId: dietaryId,
						});
					}
				}
			}

			return json({ success: true });
		} catch (error) {
			console.error("Seeding error:", error);
			return json(
				{ success: false, error: error.message },
				{ status: 500 },
			);
		}
	},
});
