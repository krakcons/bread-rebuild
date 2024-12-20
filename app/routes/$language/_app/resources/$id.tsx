import { NotFound } from "@/components/NotFound";
import { ResourceActions } from "@/components/Resource/Actions";
import { getMeal } from "@/lib/bread";
import { useHours } from "@/lib/hours";
import { getLocalizedField, getTranslations, translate } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { cn } from "@/lib/utils";
import { formatServiceAddress } from "@cords/sdk";
import { createFileRoute, notFound } from "@tanstack/react-router";
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
	loader: async ({ params: { id } }) => {
		const resource = await getMeal({ data: id });
		if (!resource) throw notFound();
		return resource;
	},
	head: ({ loaderData, params: { language } }) => {
		if (!loaderData) return {};
		const description =
			formatServiceAddress(loaderData.address) +
			", " +
			loaderData.phoneNumbers.map((phone) => phone.phone).join(", ") +
			", " +
			Object.values(getLocalizedField(loaderData.body, language) || {})
				.join(", ")
				.slice(0, 155);
		return {
			meta: [
				{
					title: getLocalizedField(loaderData.name, language) || "",
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
	value: string;
	icon: React.ReactNode;
}) => {
	return (
		<div className="flex items-center gap-3">
			<div className="flex min-w-8 items-center justify-center">
				{icon}
			</div>
			<div>
				<p className="mb-1 font-medium">{label}</p>
				<p className="text-gray-600">{value}</p>
			</div>
		</div>
	);
};

function ResourceDetail() {
	const { language } = Route.useParams();
	const resource = Route.useLoaderData();
	const translations = getTranslations(language);

	console.log(getLocalizedField(resource.body, language)?.hours);

	const hours = useHours(
		getLocalizedField(resource.body, language)?.hours || "",
	);

	const todaysDayOfWeek = new Date().toLocaleDateString("en-US", {
		weekday: "short",
	});

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-4 py-8">
			{/* Header */}
			<h1 className="text-3xl font-bold">
				{getLocalizedField(resource.name, language)}
			</h1>
			<ResourceActions resource={resource} />
			<div className="flex flex-col gap-3">
				{/* Map */}
				<div className="overflow-hidden rounded-lg border">
					<Map
						initialViewState={{
							longitude: resource.address.lng!,
							latitude: resource.address.lat!,
							zoom: 14,
						}}
						style={{ width: "100%", height: 300 }}
						mapStyle={STYLE} // Use the same STYLE object from your index page
					>
						<Marker
							latitude={resource.address.lat!}
							longitude={resource.address.lng!}
							anchor="bottom"
						>
							<div className="rounded-full bg-white p-2 shadow-sm">
								<Utensils size={18} />
							</div>
						</Marker>
					</Map>
				</div>
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">
						{translations.contact}
					</h2>
					{/* Address */}
					<Contact
						label={translations.address}
						value={formatServiceAddress(resource.address)}
						icon={<MapPin size={20} className="text-gray-500" />}
					/>

					{/* Email */}
					{getLocalizedField(resource.email, language) && (
						<Contact
							label={translations.email}
							value={getLocalizedField(resource.email, language)!}
							icon={<Mail size={20} className="text-gray-500" />}
						/>
					)}

					{/* Phone Numbers */}
					{resource.phoneNumbers.length > 0 &&
						resource.phoneNumbers.map((phone) => (
							<Contact
								key={phone.phone}
								label={translations.phoneTypes[phone.type]}
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
						{translations.additionalInfo}
					</h2>{" "}
					{/* Dietary Options */}
					{getLocalizedField(resource.body, language)
						?.dietaryOptions && (
						<Contact
							label={translations.dietaryOptions}
							value={
								getLocalizedField(
									resource.body,
									language,
								)?.dietaryOptions?.join(", ") || ""
							}
							icon={
								<Utensils size={20} className="text-gray-500" />
							}
						/>
					)}
					{/* Accessibility */}
					{getLocalizedField(resource.body, language)
						?.accessibility && (
						<Contact
							label={translations.accessibility}
							value={
								getLocalizedField(resource.body, language)!
									.accessibility
							}
							icon={
								<Accessibility
									size={20}
									className="text-gray-500"
								/>
							}
						/>
					)}
					{/* Application Process */}
					{getLocalizedField(resource.body, language)
						?.applicationProcess && (
						<Contact
							label={translations.applicationProcess}
							value={
								getLocalizedField(resource.body, language)!
									.applicationProcess
							}
							icon={<File size={20} className="text-gray-500" />}
						/>
					)}
					{/* Parking */}
					{getLocalizedField(resource.body, language)
						?.parkingAvailable && (
						<Contact
							label={translations.parking}
							value={
								getLocalizedField(resource.body, language)!
									.parkingNotes!
							}
							icon={<Car size={20} className="text-gray-500" />}
						/>
					)}
					{/* Preparation Required */}
					{getLocalizedField(resource.body, language)
						?.preparationRequired! && (
						<Contact
							label={translations.preparationRequired}
							value={
								getLocalizedField(resource.body, language)!
									.preparationNotes!
							}
							icon={
								<UtensilsCrossed
									size={20}
									className="text-gray-500"
								/>
							}
						/>
					)}
					{/* Transit */}
					{getLocalizedField(resource.body, language)
						?.transitStop && (
						<Contact
							label={translations.transit}
							value={
								getLocalizedField(resource.body, language)!
									.transitStop!
							}
							icon={<Bus size={20} className="text-gray-500" />}
						/>
					)}
					{/* Fees */}
					{getLocalizedField(resource.body, language)?.fees && (
						<Contact
							label={translations.fees}
							value={
								getLocalizedField(resource.body, language)!
									.fees +
								(getLocalizedField(resource.body, language)!
									.costNotes
									? ". " +
										getLocalizedField(
											resource.body,
											language,
										)!.costNotes
									: "")
							}
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
						<h2 className="mb-4 text-xl font-bold">
							{translations.hours}
						</h2>
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
