import { getLocalizedField, getTranslations } from "@/lib/language";
import useSaved from "@/lib/saved";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { Bookmark, DollarSign, MapPin, PhoneCall, Utensils, X } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";

export const MapResource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({ from: "/$language" });
	const [popupOpen, setPopupOpen] = useState<boolean>(false);
	const saved = useSaved();
	const translations = getTranslations(language);

	return (
		<>
			<Marker
				latitude={resource.address.lat}
				longitude={resource.address.lng}
				anchor="bottom"
				onClick={() => setPopupOpen(true)}
			>
				<div className="bg-white rounded-full p-2 shadow-sm">
					<Utensils size={18} />
				</div>
			</Marker>
			{popupOpen && (
				<Popup
					latitude={resource.address.lat}
					longitude={resource.address.lng}
					onClose={() => setPopupOpen(!popupOpen)}
					anchor="bottom"
					offset={36}
					closeOnClick={false}
					closeButton={false}
					style={{
						padding: 0,
						borderRadius: 100,
					}}
					maxWidth="400px"
					className="text-base"
				>
					<button
						className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none"
						onClick={() => setPopupOpen(false)}
					>
						<X size={18} />
					</button>
					<div className="flex flex-col gap-2 mt-4">
						<Link
							to={`/${language}/resources/${resource.id}`}
							className="text-lg font-semibold hover:underline"
						>
							{getLocalizedField(resource.name, language)}
						</Link>
						{/* Address section */}
						{resource.address && (
							<div className="text-gray-600 flex items-center gap-2">
								<MapPin size={20} />
								{formatServiceAddress(resource.address)}
							</div>
						)}
						{/* Call section */}
						{resource.phoneNumbers.map((phone) => (
							<div
								key={phone.phone}
								className="text-gray-600 flex items-center gap-2"
							>
								<PhoneCall size={18} />
								<Link href={`tel:${phone.phone}`}>{phone.phone}</Link>
							</div>
						))}
						{/* Fees section */}
						{getLocalizedField(resource.body, language)?.fees && (
							<div className="mb-2 text-gray-600 flex items-center gap-2">
								<DollarSign size={20} />
								{getLocalizedField(resource.body, language)?.fees}
							</div>
						)}
						<div className="flex items-center gap-2 no-print">
							<Link
								to={`/${language}/resources/${resource.id}`}
								className="flex items-center gap-2 border border-gray-300 rounded-full px-2.5 py-1.5 hover:bg-gray-50/50 transition-colors"
							>
								{translations.viewMore}
							</Link>
							<button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (saved.savedIds.includes(resource.id)) {
										saved.setSavedIds(
											saved.savedIds.filter((id) => id !== resource.id)
										);
									} else {
										saved.setSavedIds([...saved.savedIds, resource.id]);
									}
								}}
								className="flex items-center gap-2 border border-gray-300 rounded-full px-2.5 py-1.5 hover:bg-gray-50/50 transition-colors"
							>
								<Bookmark
									size={18}
									className={
										saved.savedIds.includes(resource.id)
											? "fill-primary text-primary"
											: "fill-none"
									}
								/>
								{saved.savedIds.includes(resource.id)
									? translations.saved.saved
									: translations.saved.save}
							</button>
						</div>
					</div>
				</Popup>
			)}
		</>
	);
};
