import { formatAddress } from "@/lib/address";
import { getTranslations } from "@/lib/locale";
import { ResourceType } from "@/server/types";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall } from "lucide-react";
import { ResourceActions } from "./Actions";

export const Resource = ({ resource }: { resource: ResourceType }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const t = getTranslations(locale);

	return (
		<Link
			to="/$locale/resources/$id"
			params={{
				locale,
				id: resource.id,
			}}
			className="flex flex-col items-start gap-2 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
		>
			<p className="text-xl font-semibold">{resource.provider.name}</p>
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
