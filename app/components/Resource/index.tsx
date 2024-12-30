import { formatAddress } from "@/lib/address";
import { getTranslations } from "@/lib/language";
import { FullResourceType } from "@/server/types";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall } from "lucide-react";
import { ResourceActions } from "./Actions";

export const Resource = ({ resource }: { resource: FullResourceType }) => {
	const { language } = useParams({
		from: "/$language",
	});
	const t = getTranslations(language);

	return (
		<Link
			to="/$language/resources/$id"
			params={{
				language,
				id: resource.id,
			}}
			className="flex flex-col items-start gap-2 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
		>
			<p className="text-xl font-semibold">{resource.name}</p>
			{/* Address section */}
			{resource.street1 && (
				<div className="flex items-center gap-2 text-muted-foreground">
					<MapPin size={20} />
					{formatAddress(resource)}
				</div>
			)}
			{/* Call section */}
			{resource.phoneNumbers.map((phone) => (
				<div
					key={phone.phone}
					className="flex items-center gap-2 text-muted-foreground"
				>
					<PhoneCall size={18} />
					<p>{phone.phone}</p>
				</div>
			))}
			{/* Fees section */}
			{resource.free && (
				<div className="mb-2 flex items-center gap-2 text-muted-foreground">
					<DollarSign size={20} />
					{t.free}
				</div>
			)}
			<ResourceActions resource={resource} />
		</Link>
	);
};
