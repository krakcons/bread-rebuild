import { NotFound } from "@/components/NotFound";
import { ResourceActions } from "@/components/Resource/Actions";
import { Badge } from "@/components/ui/Badge";
import { formatAddress } from "@/lib/address";
import { formatTime, useHours } from "@/lib/hours";
import { translate, useTranslations } from "@/lib/locale";
import { STYLE } from "@/lib/map";
import { cn } from "@/lib/utils";
import { getResourceFn } from "@/server/actions/resource";
import {
	createFileRoute,
	ErrorComponent,
	notFound,
} from "@tanstack/react-router";
import {
	Accessibility,
	Bus,
	Car,
	DollarSign,
	File,
	Mail,
	MapPin,
	PhoneCall,
	Utensils,
	UtensilsCrossed,
} from "lucide-react";
import { useMemo } from "react";
import { Map, Marker } from "react-map-gl/maplibre";

export const Route = createFileRoute("/$locale/_app/resources/$id")({
	component: ResourceDetail,
	notFoundComponent: NotFound,
	errorComponent: ErrorComponent,
	loader: async ({ params: { id } }) => {
		const resource = await getResourceFn({ data: { id } });
		if (!resource) throw notFound();
		return resource;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const description =
			formatAddress(loaderData) +
			", " +
			loaderData.phoneNumbers.map((phone) => phone.phone).join(", ") +
			", " +
			Object.values(loaderData).join(", ").slice(0, 155);
		return {
			meta: [
				{
					title: loaderData.provider.name,
				},
				{
					name: "description",
					content: description,
				},
			],
		};
	},
});

const Contact = ({
	label,
	value,
	icon,
}: {
	label: string;
	value: string | null;
	icon: React.ReactNode;
}) => {
	return (
		<div className="flex items-center gap-3">
			<div className="flex min-w-8 items-center justify-center">
				{icon}
			</div>
			<div>
				<p className="mb-1 font-medium">{label}</p>
				<p className="text-gray-600">{value || "-"}</p>
			</div>
		</div>
	);
};

function ResourceDetail() {
	const { locale } = Route.useParams();
	const resource = Route.useLoaderData();
	const t = useTranslations(locale);

	const hours = useHours(resource.hours || "", locale);

	const todaysDayOfWeek = new Date().toLocaleDateString("en-US", {
		weekday: "short",
	});

	const tags = useMemo(() => {
		let tags: string[] = [];
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
		<div className="mx-auto flex max-w-3xl flex-col gap-4 py-8">
			{/* Header */}
			<h1 className="text-3xl font-bold">{resource.provider.name}</h1>
			<div className="flex flex-wrap items-end justify-between gap-2">
				<ResourceActions resource={resource} />
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Badge key={tag} variant="outline">
							{tag}
						</Badge>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				{/* Map */}
				<div className="overflow-hidden rounded-lg border">
					<Map
						initialViewState={{
							longitude: resource.lng!,
							latitude: resource.lat!,
							zoom: 14,
						}}
						style={{ width: "100%", height: 300 }}
						mapStyle={STYLE} // Use the same STYLE object from your index page
					>
						<Marker
							latitude={resource.lat!}
							longitude={resource.lng!}
							anchor="bottom"
						>
							<div className="rounded-full bg-white p-2 shadow-sm">
								<Utensils size={18} />
							</div>
						</Marker>
					</Map>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">{t.contact}</h2>
					{/* Address */}
					<Contact
						label={t.address}
						value={formatAddress(resource)}
						icon={<MapPin size={20} className="text-gray-500" />}
					/>

					{/* Email */}
					{resource.email && (
						<Contact
							label={t.email}
							value={resource.email}
							icon={<Mail size={20} className="text-gray-500" />}
						/>
					)}

					{/* Phone Numbers */}
					{resource.phoneNumbers.length > 0 &&
						resource.phoneNumbers.map((phone) => (
							<Contact
								key={phone.phone}
								label={phone.type ?? t.phoneTypes.phone}
								value={resource.phoneNumbers
									.map((phone) => phone.phone)
									.join(", ")}
								icon={
									<PhoneCall
										size={20}
										className="text-gray-500"
									/>
								}
							/>
						))}
				</div>
				{(resource.fees ||
					resource.registrationNotes ||
					resource.parkingNotes ||
					resource.preparationNotes ||
					resource.transitNotes ||
					resource.wheelchairNotes ||
					resource.dietaryOptions.length > 0) && (
					<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
						<h2 className="mb-4 text-xl font-bold">
							{t.additionalInfo}
						</h2>
						{/* Fees */}
						{resource.fees && (
							<Contact
								label={t.fees}
								value={resource.fees}
								icon={
									<DollarSign
										size={20}
										className="text-gray-500"
									/>
								}
							/>
						)}
						{/* Dietary Options */}
						{resource.dietaryOptions.length > 0 && (
							<Contact
								label={t.dietaryOptions}
								value={
									resource.dietaryOptions
										.map((option) => option.name)
										.join(", ") || ""
								}
								icon={
									<Utensils
										size={20}
										className="text-gray-500"
									/>
								}
							/>
						)}
						{/* Wheelchair Accessible */}
						{resource.wheelchairNotes && (
							<Contact
								label={t.wheelchair}
								value={resource.wheelchairNotes}
								icon={
									<Accessibility
										size={20}
										className="text-gray-500"
									/>
								}
							/>
						)}
						{/* Application Process */}
						{resource.registrationNotes && (
							<Contact
								label={t.applicationProcess}
								value={resource.registrationNotes}
								icon={
									<File size={20} className="text-gray-500" />
								}
							/>
						)}
						{/* Parking */}
						{resource.parkingNotes && (
							<Contact
								label={t.parking}
								value={resource.parkingNotes}
								icon={
									<Car size={20} className="text-gray-500" />
								}
							/>
						)}
						{/* Preparation Required */}
						{resource.preparationNotes && (
							<Contact
								label={t.preparation}
								value={resource.preparationNotes}
								icon={
									<UtensilsCrossed
										size={20}
										className="text-gray-500"
									/>
								}
							/>
						)}
						{/* Transit */}
						{resource.transitNotes && (
							<Contact
								label={t.transit}
								value={resource.transitNotes}
								icon={
									<Bus size={20} className="text-gray-500" />
								}
							/>
						)}
					</div>
				)}
				{hours.length > 0 && (
					<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
						<h2 className="mb-4 text-xl font-bold">{t.hours}</h2>
						{/* Hours */}
						{hours &&
							hours.map((hour) => (
								<div
									key={hour.day}
									className={
										"flex w-64 items-center justify-between gap-3"
									}
								>
									<p
										className={cn(
											"font-medium",
											hour.day === todaysDayOfWeek &&
												"font-bold",
										)}
									>
										{translate(
											hour.day,
											locale as "en" | "fr",
										)}
									</p>
									<p
										className={cn(
											"text-gray-600",
											hour.day === todaysDayOfWeek &&
												"font-semibold",
										)}
									>
										{formatTime(hour.open, locale)} -{" "}
										{formatTime(hour.close, locale)}
									</p>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}
