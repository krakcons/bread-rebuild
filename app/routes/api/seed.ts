import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

import { generateId } from "@/server/auth";
import { db } from "@/server/db";
import {
	anonymousSessionsToResources,
	dietaryOptions,
	dietaryOptionsTranslations,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourcePhoneNumbers,
	resources,
	resourceToDietaryOptions,
	resourceTranslations,
} from "@/server/db/schema";
import {
	BaseResourceType,
	ResourceSchema,
	ResourceTranslationType,
	ResourceType,
} from "@/server/db/types";

type LocalizedFieldType = {
	en: string;
	fr: string;
};

// Helper function to create localized fields
export const createLocalizedField = (enValue: string): LocalizedFieldType => {
	return {
		en: enValue,
		fr: enValue,
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
	const hours = [
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
		.map((hour) => `${hour.day} ${hour.open} - ${hour.close}`);

	return hours.length > 0 ? hours.join("; ") + "; " : null;
};

export const APIRoute = createAPIFileRoute("/api/seed")({
	GET: async () => {
		let meals: any[] = [];
		let mealPage = 0;
		while (true) {
			const mealsResponse = await fetch(
				`https://bread.help/api/meals?page[limit]=50&page[offset]=${mealPage * 50}`,
			);
			const mealsData = await mealsResponse.json();
			console.log("meals", mealsData.data.data.length);
			if (mealsData.data.data.length === 0) {
				break;
			}
			meals.push(...mealsData.data.data);
			mealPage++;
		}

		let organizations: any[] = [];
		let organizationPage = 0;
		while (true) {
			const organizationsResponse = await fetch(
				`https://drupal.bread.help/jsonapi/taxonomy_term/organization?page[limit]=50&page[offset]=${organizationPage * 50}`,
			);
			const organizationsData = await organizationsResponse.json();
			console.log(organizationsData.data.length);
			if (organizationsData.data.length === 0) {
				break;
			}
			organizations.push(...organizationsData.data);
			organizationPage++;
		}

		const dietaryOptionsResponse = await fetch(
			"https://bread.help/api/dietary",
		);
		const dietary = await dietaryOptionsResponse.json();

		// Convert Drupal meal/pantry to ResourceType
		const convertDrupalToResource = (
			drupalData: any,
			providerId: string,
		): {
			resource: Omit<BaseResourceType, "createdAt" | "updatedAt">;
			body: {
				en: Omit<ResourceTranslationType, "id">;
				fr: Omit<ResourceTranslationType, "id">;
			};
			phone: string | null;
			dietaryOptions: string[];
		} => {
			const contactInfo = parseContactInfo(
				drupalData.attributes.field_registration_notes ?? "",
			);
			const hours = parseHours(drupalData);
			const dietaryOptions: string[] = dietary.data
				.filter((dietary) =>
					drupalData.relationships.field_dietary.data.some(
						({ id }) => dietary.id === id,
					),
				)
				.map((dietary) => dietary.attributes.name);

			let offering: ResourceType["offering"];
			const offeringParsed = ResourceSchema.shape.offering.safeParse(
				drupalData.attributes.field_service_type.toLowerCase(),
			);
			if (offeringParsed.success) {
				offering = offeringParsed.data;
			} else {
				offering = "meal";
			}

			const resource: Omit<BaseResourceType, "createdAt" | "updatedAt"> =
				{
					id: generateId(16),
					providerId,
					...contactInfo,
					parking:
						drupalData.attributes.field_parking_avail_bool || false,
					preparation:
						drupalData.attributes.field_prep_required_bool || false,
					free: drupalData.attributes.field_price_description
						?.toLowerCase()
						.includes("free"),
					wheelchair:
						drupalData.attributes.field_wheelchair_acc_bool ||
						false,
					transit:
						drupalData.attributes.field__near_transit_bool || false,
					registration:
						drupalData.attributes.field_registration_bool || false,
					offering,
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
					hours,
					country:
						drupalData.attributes.field_pickup_address.country_code,
					lat: drupalData.attributes.field_geofield?.lat ?? null,
					lng: drupalData.attributes.field_geofield?.lon ?? null,
				};

			const body: {
				en: Omit<ResourceTranslationType, "id">;
				fr: Omit<ResourceTranslationType, "id">;
			} = {
				en: {
					resourceId: resource.id,
					email: contactInfo.email,
					website: contactInfo.website,
					fees: drupalData.attributes.field_cost_notes,
					locale: "en",
					registrationNotes:
						drupalData.attributes.field_registration_notes,
					parkingNotes: drupalData.attributes.field_parking_notes,
					preparationNotes:
						drupalData.attributes.field_preparation_required_notes,
					transitNotes:
						drupalData.attributes.field_transit_nearest_stop,
					capacityNotes:
						drupalData.attributes.field_resource_capacity ===
						"Not specified"
							? null
							: drupalData.attributes.field_resource_capacity,
					wheelchairNotes:
						drupalData.attributes.field_wheelchair_notes,
					description: drupalData.attributes.field_description,
					eligibility: drupalData.attributes.field_eligibility,
				},
				fr: {
					resourceId: resource.id,
					email: contactInfo.email,
					website: contactInfo.website,
					fees: drupalData.attributes.field_cost_notes,
					locale: "fr",
					registrationNotes:
						drupalData.attributes.field_registration_notes,
					parkingNotes: drupalData.attributes.field_parking_notes,
					preparationNotes:
						drupalData.attributes.field_preparation_required_notes,
					transitNotes:
						drupalData.attributes.field_transit_nearest_stop,
					capacityNotes:
						drupalData.attributes.field_resource_capacity ===
						"Not specified"
							? null
							: drupalData.attributes.field_resource_capacity,
					wheelchairNotes:
						drupalData.attributes.field_wheelchair_notes,
					description: drupalData.attributes.field_description,
					eligibility: drupalData.attributes.field_eligibility,
				},
			};

			return {
				resource,
				body,
				dietaryOptions,
				phone: contactInfo.phone,
			};
		};

		// Clear existing data in correct order (dependent tables first)
		await db.delete(resourceToDietaryOptions);
		await db.delete(providerPhoneNumbers);
		await db.delete(dietaryOptionsTranslations);
		await db.delete(dietaryOptions);
		await db.delete(resourcePhoneNumbers);
		await db.delete(resourceTranslations);
		await db.delete(providerTranslations);
		await db.delete(anonymousSessionsToResources);
		await db.delete(resources); // Move resources delete after its dependent tables
		await db.delete(providers); // Move providers delete last

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
					locale: "en",
					name: dietary.en,
				},
				{
					dietaryOptionId: id,
					locale: "fr",
					name: dietary.fr,
				},
			]);
		}

		const providerMap = new Map();
		const providerIdMap = new Map();

		for (const organization of organizations) {
			const existing = providerMap.get(organization.attributes.name);
			if (existing) {
				providerIdMap.set(organization.id, existing.id);
				continue;
			}
			const id = generateId(16);
			providerMap.set(organization.attributes.name, {
				id,
				name: organization.attributes.name,
				email: organization.attributes.field_primary_contact_email_addr,
			});
			providerIdMap.set(organization.id, id);
		}

		for (const provider of providerMap.values()) {
			await db.insert(providers).values(provider);
			await db.insert(providerTranslations).values({
				providerId: provider.id,
				locale: "en",
				name: provider.name,
				email: provider.email,
			});
			await db.insert(providerTranslations).values({
				providerId: provider.id,
				locale: "fr",
				name: provider.name,
				email: provider.email,
			});
		}

		// Convert and insert resources
		for (const meal of meals) {
			const providerId: any = providerIdMap.get(
				meal.relationships.field_organization_name.data.id,
			);
			console.log("providerId", providerId);
			if (!providerId) {
				console.warn(
					`No provider found for meal ${meal.id} (org: ${meal.relationships.field_organization_name.data?.id})`,
				);
				continue;
			}
			const { resource, body, phone, dietaryOptions } =
				convertDrupalToResource(meal, providerId);

			// Insert resource
			await db.insert(resources).values(resource);

			// Insert resource body
			await db.insert(resourceTranslations).values(body.en);
			await db.insert(resourceTranslations).values(body.fr);

			// Insert phone numbers
			if (phone) {
				await db.insert(providerPhoneNumbers).values({
					providerId,
					phone,
					type: "phone",
				});
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
	},
});
