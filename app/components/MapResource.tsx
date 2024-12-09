import { getLocalizedField, getTranslations } from "@/lib/language";
import useSaved from "@/lib/saved";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { DollarSign, MapPin, PhoneCall, Utensils, X } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { ResourceActions } from "./Resource/Actions";

export const MapResource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({ from: "/$language" });
	const [popupOpen, setPopupOpen] = useState<boolean>(false);
	const saved = useSaved();
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
					className="text-base"
				>
					<button
						className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none"
						onClick={() => setPopupOpen(false)}
					>
						<X size={18} />
					</button>
					<div className="mt-4 flex flex-col gap-2">
						<Link
							to={`/${language}/resources/${resource.id}`}
							className="text-lg font-semibold hover:underline"
						>
							{getLocalizedField(resource.name, language)}
						</Link>
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
								{
									getLocalizedField(resource.body, language)
										?.fees
								}
							</div>
						)}
						<ResourceActions resource={resource}>
							<Link
								to={`/${language}/resources/${resource.id}`}
								className="flex items-center gap-2 rounded-full border border-gray-300 px-2.5 py-1.5 transition-colors hover:bg-gray-50/50"
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
