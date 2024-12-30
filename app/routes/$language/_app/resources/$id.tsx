import { NotFound } from "@/components/NotFound";
import { ResourceActions } from "@/components/Resource/Actions";
import { formatAddress } from "@/lib/address";
import { useHours } from "@/lib/hours";
import { getTranslations, translate } from "@/lib/language";
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
import { Map, Marker } from "react-map-gl/maplibre";

export const Route = createFileRoute("/$language/_app/resources/$id")({
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
			Object.values(loaderData.body).join(", ").slice(0, 155);
		return {
			meta: [
				{
					title: loaderData.name,
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
	const { language } = Route.useParams();
	const resource = Route.useLoaderData();
	const t = getTranslations(language);

	const hours = useHours(resource.body.hours || "");

	const todaysDayOfWeek = new Date().toLocaleDateString("en-US", {
		weekday: "short",
	});

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-4 py-8">
			{/* Header */}
			<h1 className="text-3xl font-bold">{resource.name}</h1>
			<ResourceActions resource={resource} />
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
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">
						{t.additionalInfo}
					</h2>{" "}
					{/* Dietary Options */}
					{resource.dietaryOptions.length > 0 && (
						<Contact
							label={t.dietaryOptions}
							value={resource.dietaryOptions.join(", ") || ""}
							icon={
								<Utensils size={20} className="text-gray-500" />
							}
						/>
					)}
					{/* Accessibility */}
					{resource.body.accessibility && (
						<Contact
							label={t.accessibility}
							value={resource.body.accessibility}
							icon={
								<Accessibility
									size={20}
									className="text-gray-500"
								/>
							}
						/>
					)}
					{/* Application Process */}
					{resource.body.applicationProcess && (
						<Contact
							label={t.applicationProcess}
							value={resource.body.applicationProcess}
							icon={<File size={20} className="text-gray-500" />}
						/>
					)}
					{/* Parking */}
					{resource.parkingAvailable && (
						<Contact
							label={t.parking}
							value={resource.body.parking}
							icon={<Car size={20} className="text-gray-500" />}
						/>
					)}
					{/* Preparation Required */}
					{resource.preparationRequired && (
						<Contact
							label={t.preparationRequired}
							value={resource.body.preparation}
							icon={
								<UtensilsCrossed
									size={20}
									className="text-gray-500"
								/>
							}
						/>
					)}
					{/* Transit */}
					{resource.transitAvailable && (
						<Contact
							label={t.transit}
							value={resource.body.transit}
							icon={<Bus size={20} className="text-gray-500" />}
						/>
					)}
					{/* Fees */}
					{resource.body.fees && (
						<Contact
							label={t.fees}
							value={resource.body.fees}
							icon={
								<DollarSign
									size={20}
									className="text-gray-500"
								/>
							}
						/>
					)}
				</div>
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
											language as "en" | "fr",
										)}
									</p>
									<p
										className={cn(
											"text-gray-600",
											hour.day === todaysDayOfWeek &&
												"font-semibold",
										)}
									>
										{hour.open} - {hour.close}
									</p>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}
