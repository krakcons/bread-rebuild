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
			className="flex flex-col items-start gap-2 rounded-lg border border-gray-300 p-4 shadow-sm transition-shadow hover:shadow-md"
		>
			<p className="text-xl font-semibold">
				{getLocalizedField(resource.name, language)}
			</p>
			{/* Address section */}
			{resource.address && (
				<div className="flex items-center gap-2 text-gray-600">
					<MapPin size={20} />
					{formatServiceAddress(resource.address)}
				</div>
			)}
			{/* Call section */}
			{resource.phoneNumbers.map((phone) => (
				<div
					key={phone.phone}
					className="flex items-center gap-2 text-gray-600"
				>
					<PhoneCall size={18} />
					<p>{phone.phone}</p>
				</div>
			))}
			{/* Fees section */}
			{getLocalizedField(resource.body, language)?.fees && (
				<div className="mb-2 flex items-center gap-2 text-gray-600">
					<DollarSign size={20} />
					{getLocalizedField(resource.body, language)?.fees}
				</div>
			)}
			<ResourceActions resource={resource} />
		</Link>
	);
};