import { ResourceAddressType, ResourceType } from "@cords/sdk";
import { createServerFn } from "@tanstack/start";
import meals from "../routes/data.json";

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

const commonTranslations = new Map<string, string>([["Free", "Gratuit"]]);

const translate = (enValue: string, language: "en" | "fr") => {
	if (language === "en") return enValue;
	return commonTranslations.get(enValue) || enValue;
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

// Convert Drupal meal/pantry to ResourceType
export const convertDrupalToResource = (drupalData: any): ResourceType => {
	return {
		id: drupalData.id,
		// trim out any text before the first colon
		name: createLocalizedField(drupalData.attributes.title.split(":")[1] || ""),
		description: createLocalizedField(drupalData.attributes.field_description || ""),
		website: createLocalizedField(drupalData.attributes.field_general_web_site || ""),
		email: createLocalizedField(
			parseContactInfo(drupalData.attributes.field_registration_notes).email || ""
		),
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
		phoneNumbers: parseContactInfo(drupalData.attributes.field_registration_notes).phone
			? [
					{
						phone:
							parseContactInfo(drupalData.attributes.field_registration_notes)
								.phone || "",
						name: "Main",
						type: "phone",
					},
				]
			: [],
		partner: "bread",
		delivery: "local",
		body: {
			en: {
				fees: drupalData.attributes.field_price_description || "",
				hours:
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
						.join("; ") + "; ",
				topics: "",
				twitter: null,
				youtube: null,
				facebook: null,
				linkedin: null,
				instagram: null,
				languages: "",
				eligibility: "",
				recordOwner: "",
				accessibility: drupalData.attributes.field_wheelchair_notes || "",
				documentsRequired: "",
				applicationProcess: drupalData.attributes.field_registration_notes || "",
			},
			fr: {
				fees: translate(drupalData.attributes.field_price_description || "", "fr") || "",
				hours: "",
				topics: "",
				twitter: null,
				youtube: null,
				facebook: null,
				linkedin: null,
				instagram: null,
				languages: "",
				eligibility: "",
				recordOwner: "",
				accessibility: drupalData.attributes.field_wheelchair_notes || "",
				documentsRequired: "",
				applicationProcess: drupalData.attributes.field_registration_notes || "",
			},
		},
		result: null,
	};
};

export const getMeals = createServerFn("GET", async () => {
	const resources = meals.map((meal) => convertDrupalToResource(meal));
	return resources;
});
