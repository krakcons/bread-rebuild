import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { days } from "@/lib/hours";
import { getLocalizedField, getTranslations } from "@/lib/language";
import useSaved from "@/lib/saved";
import { cn } from "@/lib/utils";
import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { Link, useParams } from "@tanstack/react-router";
import { Bookmark, CalendarDays, DollarSign, MapPin, PhoneCall } from "lucide-react";

export const Resource = ({ resource }: { resource: ResourceType }) => {
	const { language } = useParams({
		from: "/$language",
	});
	const saved = useSaved();
	const translations = getTranslations(language);
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
			<div className="flex items-center justify-start gap-2">
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						saved.toggleSaved({
							id: resource.id,
							day: undefined,
						});
					}}
					className="flex items-center gap-2 border border-gray-300 rounded-full px-2.5 py-1.5 hover:bg-gray-50/50 transition-colors no-print"
				>
					<Bookmark
						size={18}
						className={
							saved.isSaved(resource.id) ? "fill-primary text-primary" : "fill-none"
						}
					/>
					{saved.isSaved(resource.id)
						? translations.saved.saved
						: translations.saved.save}
				</button>
				{saved.isSaved(resource.id) && (
					<Select
						value={saved.getDay(resource.id) ?? undefined}
						onValueChange={(value) => {
							saved.updateDay(resource.id, value);
						}}
					>
						<SelectTrigger
							className={cn(
								"gap-2 w-auto shrink",
								saved.getDay(resource.id) ? "" : "no-print"
							)}
						>
							<CalendarDays size={18} />
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{/* @ts-expect-error */}
							<SelectItem value={undefined}>{translations.day}</SelectItem>
							<SelectSeparator />
							<SelectGroup>
								{days.map((day) => (
									<SelectItem key={day} value={day}>
										{day}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			</div>
		</Link>
	);
};
