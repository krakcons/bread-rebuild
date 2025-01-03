import { ResourceType } from "@/server/types";

import { formatServiceAddress } from "@cords/sdk";

export const formatAddress = (address: ResourceType) => {
	return formatServiceAddress({
		street1: address.street1 ?? "",
		street2: address.street2 ?? "",
		city: address.city ?? "",
		postalCode: address.postalCode ?? "",
		province: address.province ?? "",
		country: address.country ?? "",
		lat: address.lat ?? 0,
		lng: address.lng ?? 0,
	});
};
