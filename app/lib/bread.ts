import { ResourceAddressType, ResourceType } from "@cords/sdk";

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
		fr: "", // Since the source data is English-only, leaving French empty
	};
};

// Convert Drupal meal/pantry to ResourceType
export const convertDrupalToResource = (drupalData: any): ResourceType => {
	return {
		id: drupalData.id,
		name: createLocalizedField(drupalData.attributes.title),
		description: createLocalizedField(drupalData.attributes.field_description || ""),
		website: createLocalizedField(drupalData.attributes.field_general_web_site || ""),
		email: createLocalizedField(drupalData.attributes.field_email_address || ""),
		address: convertAddress({
			...drupalData.attributes.field_pickup_address,
			field_geofield: drupalData.attributes.field_geofield,
		}),
		addresses: [], // No additional addresses in source data
		phoneNumbers: drupalData.attributes.field_information_phone_number
			? [
					{
						phone: drupalData.attributes.field_information_phone_number,
						name: "Main",
						type: "phone",
					},
				]
			: [],
		partner: "", // No direct partner mapping in source
		delivery: "local", // Assuming local delivery for these services
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
			fr: null,
		},
		result: null,
	};
};
