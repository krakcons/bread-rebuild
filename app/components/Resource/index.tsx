import { getLocalizedField } from "@/lib/language";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall } from "lucide-react";
import { ResourceActions } from "./Actions";

export const Resource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({
		from: "/$language",
	});
	return (
		<Link
			to={`/${language}/resources/${resource.id}`}
			className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow flex-col flex gap-2"
		>
			<p className="text-xl font-semibold">{getLocalizedField(resource.name, language)}</p>
			{/* Address section */}
			{resource.address && (
				<div className="text-gray-600 flex items-center gap-2">
					<MapPin size={20} />
					{formatServiceAddress(resource.address)}
				</div>
			)}
			{/* Call section */}
			{resource.phoneNumbers.map((phone) => (
				<div key={phone.phone} className="text-gray-600 flex items-center gap-2">
					<PhoneCall size={18} />
					<p>{phone.phone}</p>
				</div>
			))}
			{/* Fees section */}
			{getLocalizedField(resource.body, language)?.fees && (
				<div className="mb-2 text-gray-600 flex items-center gap-2">
					<DollarSign size={20} />
					{getLocalizedField(resource.body, language)?.fees}
				</div>
			)}
			<ResourceActions resource={resource} />
		</Link>
	);
};
