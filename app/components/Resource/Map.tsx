import { formatAddress } from "@/lib/address";
import { formatPhoneNumber } from "@/lib/phone";
import { ResourceType } from "@/server/db/types";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall, Utensils, X } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { useTranslations } from "use-intl";
import { Button, buttonVariants } from "../ui/Button";
import { ResourceActions } from "./Actions";

export const MapResource = ({ resource }: { resource: ResourceType }) => {
	const [popupOpen, setPopupOpen] = useState<boolean>(false);
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<>
			<Marker
				latitude={resource.lat!}
				longitude={resource.lng!}
				anchor="bottom"
				onClick={() => setPopupOpen(true)}
			>
				<div className="rounded-full bg-white p-2 shadow-sm">
					<Utensils size={18} />
				</div>
			</Marker>
			{popupOpen && (
				<Popup
					latitude={resource.lat!}
					longitude={resource.lng!}
					onClose={() => setPopupOpen(!popupOpen)}
					anchor="bottom"
					offset={36}
					closeOnClick={false}
					closeButton={false}
					style={{
						padding: 0,
						borderRadius: 100,
					}}
					maxWidth="350px"
					className="text-base font-normal"
				>
					<Button
						className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full"
						onClick={() => setPopupOpen(false)}
						size="icon"
					>
						<X size={18} />
					</Button>
					<div className="mt-4 flex flex-col gap-2">
						<Link
							to="/$locale/resources/$id"
							params={{
								locale,
								id: resource.id,
							}}
							className="text-lg font-semibold hover:underline"
						>
							{resource.name ?? resource.provider.name}
						</Link>
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
						{/* Fees section */}
						{resource.fees && (
							<div className="mb-2 flex items-center gap-2 text-muted-foreground">
								<DollarSign size={20} />
								{resource.fees}
							</div>
						)}
						<ResourceActions resource={resource}>
							<Link
								to="/$locale/resources/$id"
								params={{
									locale,
									id: resource.id,
								}}
								className={buttonVariants()}
							>
								{t("viewMore")}
							</Link>
						</ResourceActions>
					</div>
				</Popup>
			)}
		</>
	);
};
