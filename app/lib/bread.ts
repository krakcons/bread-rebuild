import {
	ResourceAddressType,
	ResourceBodyType,
	ResourceType,
} from "@cords/sdk";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import dietary from "../data/dietary.json";
import meals from "../data/meals.json";
import { translate } from "./language";
type LocalizedFieldType = {
	en: string;
	fr: string;
};

// Helper function to convert address fields
export const convertAddress = (drupalAddress: any): ResourceAddressType => {
	return {
		street1: drupalAddress.address_line1 || "",
		street2: drupalAddress.address_line2 || "",
		city: drupalAddress.locality || "",
		postalCode: drupalAddress.postal_code || "",
		province: drupalAddress.administrative_area || "",
		country: drupalAddress.country_code || "",
		lat: drupalAddress.field_geofield?.lat || null,
		lng: drupalAddress.field_geofield?.lon || null,
	};
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
	phone?: string;
	email?: string;
};

const parseContactInfo = (notes: string): ContactInfo => {
	if (!notes) return {};
	const result: ContactInfo = {};

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

// "field_preparation_required_notes": "Bring re-usable bags (will be told how many during intake)",
// "field_prep_required_bool": true,
// "field_price_description": "Free",
// "field_registration_bool": true,
// "field_registration_notes": "Requires Intake meeting (can be done over the phone or in person)",
// "field_requirements_other": null,
// "field_resource_capacity": "Appointments are 30 mins long, Wednesday, Thursday and Friday bi-monthly",
// "field_service_type": "pantry",
// "field_transit_nearest_stop": "20, 38",
// "field_verification_period": null,
// "field_verified": true,
// "field_verified_date": null,
// "field_wheelchair_acc_bool": true,
// "field_wheelchair_notes": "Parking ramps, access to elevator",
// "field__near_transit_bool": true
// "field_parking_avail_bool": true,
// "field_parking_notes": "Parking at the front of building and roadside",

// Convert Drupal meal/pantry to ResourceType
export const convertDrupalToResource = (
	drupalData: any,
): ResourceType & {
	body: {
		en: ResourceBodyType & {
			parkingNotes?: string;
			parkingAvailable?: boolean;
			preparationNotes?: string;
			preparationRequired?: boolean;
			registrationNotes?: string;
			transitStop?: string;
			costNotes?: string;
			nearTransit?: boolean;
			wheelchairAccessible?: boolean;
			dietaryOptions?: string[];
		};
		fr: ResourceBodyType & {
			parkingNotes?: string;
			parkingAvailable?: boolean;
			preparationNotes?: string;
			preparationRequired?: boolean;
			registrationNotes?: string;
			transitStop?: string;
			costNotes?: string;
			nearTransit?: boolean;
			wheelchairAccessible?: boolean;
			dietaryOptions?: string[];
		};
	};
} => {
	const contactInfo = parseContactInfo(
		drupalData.attributes.field_registration_notes,
	);
	const hours = parseHours(drupalData);
	const dietaryOptions = dietary
		.filter((dietary) =>
			drupalData.relationships.field_dietary.data.some(
				({ id }) => dietary.id === id,
			),
		)
		.map((dietary) => dietary.attributes.name);

	return {
		id: drupalData.id,
		// trim out any text before the first colon
		name: createLocalizedField(
			drupalData.attributes.title.split(":")[1] || "",
		),
		description: createLocalizedField(
			drupalData.attributes.field_description || "",
		),
		website: createLocalizedField(
			drupalData.attributes.field_general_web_site || "",
		),
		email: createLocalizedField(contactInfo.email || ""),
		address: convertAddress({
			...drupalData.attributes.field_pickup_address,
			field_geofield: drupalData.attributes.field_geofield,
		}),
		addresses: [
			convertAddress({
				...drupalData.attributes.field_pickup_address,
				field_geofield: drupalData.attributes.field_geofield,
			}),
		],
		phoneNumbers: contactInfo.phone
			? [
					{
						phone: contactInfo.phone,
						name: "Main",
						type: translate("phone", "en"),
					},
				]
			: [],
		partner: "bread",
		delivery: "local",
		body: {
			en: {
				fees: drupalData.attributes.field_price_description || "",
				hours,
				topics: "",
				twitter: null,
				youtube: null,
				facebook: null,
				linkedin: null,
				instagram: null,
				languages: "",
				eligibility: "",
				recordOwner: "",
				accessibility:
					drupalData.attributes.field_wheelchair_notes || "",
				documentsRequired: "",
				applicationProcess:
					!contactInfo.email &&
					!contactInfo.phone &&
					drupalData.attributes.field_registration_notes
						? drupalData.attributes.field_registration_notes
						: "",
				parkingNotes: drupalData.attributes.field_parking_notes || "",
				parkingAvailable:
					drupalData.attributes.field_parking_avail_bool || false,
				preparationNotes:
					drupalData.attributes.field_preparation_required_notes ||
					"",
				preparationRequired:
					drupalData.attributes.field_prep_required_bool || false,
				registrationNotes:
					drupalData.attributes.field_registration_notes || "",
				transitStop:
					drupalData.attributes.field_transit_nearest_stop || "",
				costNotes: drupalData.attributes.field_cost_notes || "",
				nearTransit:
					drupalData.attributes.field__near_transit_bool || false,
				wheelchairAccessible:
					drupalData.attributes.field_wheelchair_acc_bool || false,
				dietaryOptions,
			},
			fr: {
				fees:
					translate(
						drupalData.attributes.field_price_description || "",
						"fr",
					) || "",
				hours,
				topics: "",
				twitter: null,
				youtube: null,
				facebook: null,
				linkedin: null,
				instagram: null,
				languages: "",
				eligibility: "",
				recordOwner: "",
				accessibility:
					drupalData.attributes.field_wheelchair_notes || "",
				documentsRequired: "",
				applicationProcess:
					!contactInfo.email &&
					!contactInfo.phone &&
					drupalData.attributes.field_registration_notes
						? drupalData.attributes.field_registration_notes
						: "",
				parkingNotes: drupalData.attributes.field_parking_notes || "",
				parkingAvailable:
					drupalData.attributes.field_parking_avail_bool || false,
				preparationNotes:
					drupalData.attributes.field_preparation_required_notes ||
					"",
				preparationRequired:
					drupalData.attributes.field_prep_required_bool || false,
				registrationNotes:
					drupalData.attributes.field_registration_notes || "",
				transitStop:
					drupalData.attributes.field_transit_nearest_stop || "",
				costNotes: drupalData.attributes.field_cost_notes || "",
				nearTransit:
					drupalData.attributes.field__near_transit_bool || false,
				wheelchairAccessible:
					drupalData.attributes.field_wheelchair_acc_bool || false,
				dietaryOptions: dietaryOptions.map((option) =>
					translate(option, "fr"),
				),
			},
		},
		result: null,
	};
};

export const dietaryOptions = [
	["Vegetarian", "Vegetarien"],
	["Halal", "Halal"],
	["Celiac", "Céliaque"],
	["Renal Disease", "Maladie Rénale"],
	["Baby", "Bébé"],
	["Kosher", "Kosher"],
	["Gluten Free", "Sans Gluten"],
	["Pet Food", "Alimentation pour animaux"],
];

export const getMeals = createServerFn({
	method: "GET",
}).handler(async () => {
	const resources = meals.map((meal) => convertDrupalToResource(meal));
	return resources;
});

export const getMeal = createServerFn({
	method: "GET",
})
	.validator(z.string())
	.handler(async ({ data: id }) => {
		const resource = meals.find((meal) => meal.id === id);
		return resource ? convertDrupalToResource(resource) : null;
	});
