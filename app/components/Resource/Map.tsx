import { getLocalizedField, getTranslations } from "@/lib/language";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall, Utensils, X } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { Button, buttonVariants } from "../ui/Button";
import { ResourceActions } from "./Actions";

export const MapResource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({ from: "/$language" });
	const [popupOpen, setPopupOpen] = useState<boolean>(false);
	const translations = getTranslations(language);

	return (
		<>
			<Marker
				latitude={resource.address.lat!}
				longitude={resource.address.lng!}
				anchor="bottom"
				onClick={() => setPopupOpen(true)}
			>
				<div className="rounded-full bg-white p-2 shadow-sm">
					<Utensils size={18} />
				</div>
			</Marker>
			{popupOpen && (
				<Popup
					latitude={resource.address.lat!}
					longitude={resource.address.lng!}
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
							to={`/${language}/resources/${resource.id}`}
							className="text-lg font-semibold hover:underline"
						>
							{getLocalizedField(resource.name, language)}
						</Link>
						{/* Address section */}
						{resource.address && (
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin size={20} />
								{formatServiceAddress(resource.address)}
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
						{getLocalizedField(resource.body, language)?.fees && (
							<div className="mb-2 flex items-center gap-2 text-muted-foreground">
								<DollarSign size={20} />
								{
									getLocalizedField(resource.body, language)
										?.fees
								}
							</div>
						)}
						<ResourceActions resource={resource}>
							<Link
								to={`/${language}/resources/${resource.id}`}
								className={buttonVariants()}
							>
								{translations.viewMore}
							</Link>
						</ResourceActions>
					</div>
				</Popup>
			)}
		</>
	);
};
