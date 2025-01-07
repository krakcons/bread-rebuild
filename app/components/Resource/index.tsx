import { formatAddress } from "@/lib/address";
import { useTranslations } from "@/lib/locale";
import { formatPhoneNumber } from "@/lib/phone";
import { ResourceType } from "@/server/db/types";
import { Link, useParams } from "@tanstack/react-router";
import { MapPin, PhoneCall } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "../ui/Badge";
import { ResourceActions } from "./Actions";

export const Resource = ({ resource }: { resource: ResourceType }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const t = useTranslations(locale);

	const tags = useMemo(() => {
		let tags: string[] = [
			...resource.offerings.map((offering) => t.offeringTypes[offering]),
		];
		if (resource.free) {
			tags.push(t.free);
		}
		if (resource.preparation) {
			tags.push(t.preparation);
		}
		if (resource.parking) {
			tags.push(t.parking);
		}
		if (resource.transit) {
			tags.push(t.transit);
		}
		if (resource.wheelchair) {
			tags.push(t.wheelchair);
		}
		return tags;
	}, [resource, t]);

	return (
		<div className="flex flex-col items-start rounded-lg border shadow-sm transition-shadow hover:shadow-md">
			<Link
				to="/$locale/resources/$id"
				params={{
					locale,
					id: resource.id,
				}}
				className="flex w-full flex-col items-start gap-2 p-4 pb-0"
			>
				<p className="text-xl font-semibold">
					{resource.name ?? resource.provider.name}
				</p>
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
					</div>
				)}
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
						<p>{formatPhoneNumber(phone.phone)}</p>
					</div>
				))}
			</Link>
			<div className="flex w-full">
				<div className="p-4">
					<ResourceActions resource={resource} />
				</div>
				<Link
					to="/$locale/resources/$id"
					params={{ locale, id: resource.id }}
					className="flex-grow"
				/>
			</div>
		</div>
	);
};
