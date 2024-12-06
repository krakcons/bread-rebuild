import { NotFound } from "@/components/NotFound";
import { getMeal } from "@/lib/bread";
import { useHours } from "@/lib/hours";
import { getLocalizedField, getTranslations, translate } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { cn } from "@/lib/utils";
import { formatServiceAddress } from "@cords/sdk";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Accessibility, DollarSign, File, Mail, MapPin, PhoneCall, Utensils } from "lucide-react";
import { Map, Marker } from "react-map-gl/maplibre";

export const Route = createFileRoute("/$language/resources/$id")({
	component: ResourceDetail,
	notFoundComponent: NotFound,
	loader: async ({ params: { id } }) => {
		const resource = await getMeal(id);
		if (!resource) notFound();
		return resource;
	},
	meta: ({ loaderData, params: { language } }) => {
		const description =
			formatServiceAddress(loaderData.address) +
			", " +
			loaderData.phoneNumbers.map((phone) => phone.phone).join(", ") +
			", " +
			Object.values(getLocalizedField(loaderData.body, language) || {})
				.join(", ")
				.slice(0, 155);
		return [
			{
				title: getLocalizedField(loaderData.name, language),
			},
			{
				name: "description",
				content: description,
			},
		];
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
			{icon}
			<div>
				<h3 className="font-medium mb-1">{label}</h3>
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

	const hours = useHours(getLocalizedField(resource.body, language)?.hours || "");

	const todaysDayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "short" });

	return (
		<div className="max-w-3xl mx-auto py-8">
			{/* Header */}
			<h1 className="text-3xl font-bold mb-6">
				{getLocalizedField(resource.name, language)}
			</h1>

			<div className="flex flex-col gap-3">
				{/* Map */}
				<div className="rounded-lg overflow-hidden border border-gray-300 h-[300px]">
					<Map
						initialViewState={{
							longitude: resource.address.lng,
							latitude: resource.address.lat,
							zoom: 14,
						}}
						style={{ width: "100%", height: "100%" }}
						mapStyle={STYLE} // Use the same STYLE object from your index page
					>
						<Marker
							latitude={resource.address.lat}
							longitude={resource.address.lng}
							anchor="bottom"
						>
							<div className="bg-white rounded-full p-2 shadow-sm">
								<Utensils size={18} />
							</div>
						</Marker>
					</Map>
				</div>
				<div className="flex flex-col gap-2 bg-white p-6 rounded-lg border border-gray-200">
					<h2 className="text-xl font-bold mb-4">{translations.contact}</h2>
					{/* Address */}
					<Contact
						label={translations.address}
						value={formatServiceAddress(resource.address)}
						icon={<MapPin size={20} className="text-gray-500 mt-1" />}
					/>

					{/* Email */}
					{getLocalizedField(resource.email, language) && (
						<Contact
							label={translations.email}
							value={getLocalizedField(resource.email, language)}
							icon={<Mail size={20} className="text-gray-500" />}
						/>
					)}

					{/* Phone Numbers */}
					{resource.phoneNumbers.length > 0 &&
						resource.phoneNumbers.map((phone) => (
							<Contact
								label={translations.phoneTypes[phone.type]}
								value={resource.phoneNumbers.map((phone) => phone.phone).join(", ")}
								icon={<PhoneCall size={20} className="text-gray-500" />}
							/>
						))}

					{/* Fees */}
					{getLocalizedField(resource.body, language)?.fees && (
						<Contact
							label={translations.fees}
							value={getLocalizedField(resource.body, language)?.fees}
							icon={<DollarSign size={20} className="text-gray-500" />}
						/>
					)}
				</div>
				{(getLocalizedField(resource.body, language)?.accessibility ||
					getLocalizedField(resource.body, language)?.applicationProcess) && (
					<div className="flex flex-col gap-2 bg-white p-6 rounded-lg border border-gray-200">
						<h2 className="text-xl font-bold mb-4">{translations.additionalInfo}</h2>
						{/* Accessibility */}
						{getLocalizedField(resource.body, language)?.accessibility && (
							<Contact
								label={translations.accessibility}
								value={getLocalizedField(resource.body, language)?.accessibility}
								icon={<Accessibility size={20} className="text-gray-500" />}
							/>
						)}

						{/* Application Process */}
						{getLocalizedField(resource.body, language)?.applicationProcess && (
							<Contact
								label={translations.applicationProcess}
								value={
									getLocalizedField(resource.body, language)?.applicationProcess
								}
								icon={<File size={20} className="text-gray-500" />}
							/>
						)}
					</div>
				)}
				{hours.length > 0 && (
					<div className="flex flex-col gap-2 bg-white p-6 rounded-lg border border-gray-200">
						<h2 className="text-xl font-bold mb-4">{translations.hours}</h2>
						{/* Hours */}
						{hours &&
							hours.map((hour) => (
								<div
									key={hour.day}
									className={"flex items-center gap-3 w-64 justify-between"}
								>
									<h3
										className={cn(
											"font-medium",
											hour.day === todaysDayOfWeek && "font-bold"
										)}
									>
										{translate(hour.day, language as "en" | "fr")}
									</h3>
									<p
										className={cn(
											"text-gray-600",
											hour.day === todaysDayOfWeek && "font-semibold"
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
