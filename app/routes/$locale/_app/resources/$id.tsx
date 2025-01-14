import { Contact } from "@/components/Contact";
import { NotFound } from "@/components/NotFound";
import { ResourceActions } from "@/components/Resource/Actions";
import { Badge } from "@/components/ui/Badge";
import { formatAddress } from "@/lib/address";
import { DayOfWeek, formatTime, useHours } from "@/lib/hours";
import { STYLE } from "@/lib/map";
import { formatPhoneNumber } from "@/lib/phone";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { getResourceFn } from "@/server/actions/resource";
import {
	createFileRoute,
	ErrorComponent,
	notFound,
} from "@tanstack/react-router";
import {
	Accessibility,
	BadgeCheck,
	Bus,
	Car,
	DollarSign,
	File,
	Globe,
	Mail,
	MapPin,
	PhoneCall,
	Users,
	Utensils,
	UtensilsCrossed,
} from "lucide-react";
import { useMemo } from "react";
import { Map, Marker } from "react-map-gl/maplibre";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/$locale/_app/resources/$id")({
	component: ResourceDetail,
	notFoundComponent: NotFound,
	errorComponent: ErrorComponent,
	loader: async ({ params: { id }, context }) => {
		const resource = await getResourceFn({ data: { id } });
		if (!resource) throw notFound();
		return {
			resource,
			seo: {
				title: resource.name ?? resource.provider.name,
				description:
					formatAddress(resource) +
					", " +
					resource.phoneNumbers
						.map((phone) => phone.phone)
						.join(", ") +
					", " +
					Object.values(resource).join(", ").slice(0, 155),
			},
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return seo(loaderData.seo);
	},
});

function ResourceDetail() {
	const { locale } = Route.useParams();
	const { resource } = Route.useLoaderData();
	const t = useTranslations();

	const hours = useHours(resource.hours || "", locale);

	const todaysDayOfWeek = new Date().toLocaleDateString("en-US", {
		weekday: "short",
	});

	const tags = useMemo(() => {
		let tags: string[] = [
			...resource.offerings.map((offering) =>
				offering === "other" && resource.offeringsOther
					? resource.offeringsOther
					: t(`offeringTypes.${offering}`),
			),
		];
		if (resource.free) {
			tags.push(t("free"));
		}
		if (resource.preparation) {
			tags.push(t("preparation"));
		}
		if (resource.parking) {
			tags.push(t("parking"));
		}
		if (resource.transit) {
			tags.push(t("transit"));
		}
		if (resource.wheelchair) {
			tags.push(t("wheelchair"));
		}
		return tags;
	}, [resource, t]);

	const contactInfo = useMemo(() => {
		return {
			email: resource.email ?? resource.provider.email,
			phoneNumbers:
				resource.phoneNumbers.length > 0
					? resource.phoneNumbers
					: resource.provider.phoneNumbers,
			website: resource.website ?? resource.provider.website,
		};
	}, [resource]);

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-4 py-8">
			{/* Header */}
			<h1 className="text-3xl font-bold">
				{resource.name ?? resource.provider.name}
			</h1>
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
				{resource.description && (
					<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
						<h2 className="mb-4 text-xl font-bold">
							{t("form.common.description")}
						</h2>
						<p className="text-muted-foreground">
							{resource.description}
						</p>
					</div>
				)}
				<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
					<h2 className="mb-4 text-xl font-bold">{t("contact")}</h2>
					{/* Address */}
					<Contact
						label={t("address")}
						value={formatAddress(resource)}
						link={`https://maps.google.com/?q=${formatAddress(
							resource,
						)}`}
						icon={
							<MapPin
								size={20}
								className="text-muted-foreground"
							/>
						}
					/>

					{/* Email */}
					<Contact
						label={t("common.email")}
						value={contactInfo.email}
						link={`mailto:${contactInfo.email}`}
						icon={
							<Mail size={20} className="text-muted-foreground" />
						}
					/>

					{/* Website */}
					<Contact
						label={t("website")}
						value={contactInfo.website}
						link={contactInfo.website}
						icon={
							<Globe
								size={20}
								className="text-muted-foreground"
							/>
						}
					/>

					{/* Phone Numbers */}
					{contactInfo.phoneNumbers.length > 0 &&
						contactInfo.phoneNumbers.map((phone) => (
							<Contact
								key={phone.phone}
								label={t(`phoneTypes.${phone.type}`)}
								value={formatPhoneNumber(phone.phone)}
								link={`tel:${phone.phone}`}
								icon={
									<PhoneCall
										size={20}
										className="text-muted-foreground"
									/>
								}
							/>
						))}
				</div>
				{(resource.fees ||
					resource.eligibility ||
					resource.capacity ||
					resource.registrationNotes ||
					resource.parkingNotes ||
					resource.preparationNotes ||
					resource.transitNotes ||
					resource.wheelchairNotes ||
					resource.dietaryOptions.length > 0) && (
					<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
						<h2 className="mb-4 text-xl font-bold">
							{t("additionalInfo")}
						</h2>
						{/* Eligibility */}
						<Contact
							label={t("eligibility")}
							value={resource.eligibility}
							icon={<BadgeCheck size={20} />}
						/>

						{/* Capacity */}
						<Contact
							label={t("form.listing.capacity.title")}
							value={resource.capacity}
							icon={<Users size={20} />}
						/>

						{/* Fees */}
						<Contact
							label={t("fees")}
							value={resource.fees}
							icon={
								<DollarSign
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Dietary Options */}
						<Contact
							label={t("dietaryOptions")}
							value={
								resource.dietaryOptions
									.map((option) =>
										option === "other" &&
										resource.dietaryOptionsOther
											? resource.dietaryOptionsOther
											: t(`dietaryOptionTypes.${option}`),
									)
									.filter(Boolean)
									.join(", ") || undefined
							}
							icon={
								<Utensils
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Wheelchair Accessible */}
						<Contact
							label={t("wheelchair")}
							value={resource.wheelchairNotes}
							icon={
								<Accessibility
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Application Process */}
						<Contact
							label={t("applicationProcess")}
							value={resource.registrationNotes}
							icon={
								<File
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Parking */}
						<Contact
							label={t("parking")}
							value={resource.parkingNotes}
							icon={
								<Car
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Preparation Required */}
						<Contact
							label={t("preparation")}
							value={resource.preparationNotes}
							icon={
								<UtensilsCrossed
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
						{/* Transit */}
						<Contact
							label={t("transit")}
							value={resource.transitNotes}
							icon={
								<Bus
									size={20}
									className="text-muted-foreground"
								/>
							}
						/>
					</div>
				)}
				{hours.length > 0 && (
					<div className="flex flex-col gap-2 rounded-lg border bg-white p-4">
						<h2 className="mb-4 text-xl font-bold">{t("hours")}</h2>
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
										{t(
											`daysOfWeek.long.${hour.day.toLowerCase() as DayOfWeek}`,
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
