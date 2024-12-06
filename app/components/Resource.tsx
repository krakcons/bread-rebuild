import { getLocalizedField } from "@/lib/language";
import useSaved from "@/lib/saved";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { Bookmark, DollarSign, MapPin, PhoneCall } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

export const Resource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({
		from: "/$language",
	});
	const saved = useSaved();
	return (
		<Link
			to="/$language/resource/$resourceId"
			params={{
				language,
				resourceId: resource.id,
			}}
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
				<div className="text-gray-600 flex items-center gap-2">
					<PhoneCall size={18} />
					<Link key={phone.phone} href={`tel:${phone.phone}`}>
						{phone.phone}
					</Link>
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
				<button
					onClick={(e) => {
						e.preventDefault();
						if (saved.savedIds.includes(resource.id)) {
							saved.setSavedIds(saved.savedIds.filter((id) => id !== resource.id));
						} else {
							saved.setSavedIds([...saved.savedIds, resource.id]);
						}
					}}
					className="flex items-center gap-2 border border-gray-300 rounded-full px-2 py-1.5 hover:bg-gray-50/50 transition-colors"
				>
					<Bookmark
						size={18}
						className={
							saved.savedIds.includes(resource.id)
								? "fill-primary text-primary"
								: "fill-none"
						}
					/>
					{saved.savedIds.includes(resource.id) ? "Saved" : "Save"}
				</button>
			</div>
		</Link>
	);
};
