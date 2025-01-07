import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

import { generateId } from "@/server/auth";
import { db } from "@/server/db";
import {
	anonymousSessionsToResources,
	providerPhoneNumbers,
	providers,
	providerTranslations,
	resourcePhoneNumbers,
	resources,
	resourceTranslations,
} from "@/server/db/schema";
import { BaseResourceType, ResourceTranslationType } from "@/server/db/types";
import {
	DietaryOptionType,
	OfferingSchema,
	OfferingType,
} from "@/server/types";
import { and, eq } from "drizzle-orm";

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
		} => {
			const contactInfo = parseContactInfo(
				drupalData.attributes.field_registration_notes ?? "",
			);
			const hours = parseHours(drupalData);
			const dietaryOptions = dietary.data
				.filter((dietary) =>
					drupalData.relationships.field_dietary.data.some(
						({ id }) => dietary.id === id,
					),
				)
				.map((dietary) =>
					dietary.attributes.name.toLowerCase().replace(" ", "-"),
				) as DietaryOptionType[];

			let offering: OfferingType;
			const offeringParsed = OfferingSchema.safeParse(
				drupalData.attributes.field_service_type.toLowerCase(),
			);
			if (offeringParsed.success) {
				offering = offeringParsed.data;
			} else {
				offering = "meal";
			}

			console.log(dietaryOptions);

			const resource: Omit<BaseResourceType, "createdAt" | "updatedAt"> =
				{
					id: generateId(16),
					providerId,
					...contactInfo,
					dietaryOptions,
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
					offerings: [offering],
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
					name: null,
					offeringsOther: null,
					dietaryOptionsOther: null,
					fees: drupalData.attributes.field_cost_notes,
					locale: "en",
					capacity: drupalData.attributes.field_resource_capacity,
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
					name: null,
					offeringsOther: null,
					dietaryOptionsOther: null,
					fees: drupalData.attributes.field_cost_notes,
					locale: "fr",
					capacity: drupalData.attributes.field_resource_capacity,
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
				phone: contactInfo.phone,
			};
		};

		// Clear existing data in correct order (dependent tables first)
		await Promise.all([
			db.delete(providerPhoneNumbers),
			db.delete(resourcePhoneNumbers),
			db.delete(resourceTranslations),
			db.delete(providerTranslations),
			db.delete(anonymousSessionsToResources),
			db.delete(resources), // Move resources delete after its dependent tables
			db.delete(providers), // Move providers delete last
		]);

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

		const promises: Promise<any>[][] = [[], []];

		for (const provider of providerMap.values()) {
			promises[0].push(db.insert(providers).values(provider));
			promises[1].push(
				db.insert(providerTranslations).values({
					providerId: provider.id,
					locale: "en",
					name: provider.name,
					email: provider.email,
				}),
			);
			promises[1].push(
				db.insert(providerTranslations).values({
					providerId: provider.id,
					locale: "fr",
					name: provider.name,
					email: provider.email,
				}),
			);
		}

		// Convert and insert resources
		for (const meal of meals) {
			const providerId: any = providerIdMap.get(
				meal.relationships.field_organization_name.data.id,
			);
			if (!providerId) {
				console.warn(
					`No provider found for meal ${meal.id} (org: ${meal.relationships.field_organization_name.data?.id})`,
				);
				continue;
			}
			const { resource, body, phone } = convertDrupalToResource(
				meal,
				providerId,
			);

			// Insert resource
			promises[0].push(db.insert(resources).values(resource));

			// Insert resource body
			promises[1].push(db.insert(resourceTranslations).values(body.en));
			promises[1].push(db.insert(resourceTranslations).values(body.fr));

			// Insert phone numbers
			if (phone) {
				const existing = await db.query.providerPhoneNumbers.findFirst({
					where: and(
						eq(providerPhoneNumbers.providerId, providerId),
						eq(providerPhoneNumbers.phone, phone),
					),
				});
				if (!existing) {
					promises[1].push(
						db.insert(providerPhoneNumbers).values({
							providerId,
							phone,
							type: "phone",
						}),
					);
				}
			}
		}

		await Promise.all(promises[0]);
		await Promise.all(promises[1]);

		return json({ success: true });
	},
});
