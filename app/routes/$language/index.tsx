import { formatServiceAddress, ResourceType } from "@cords/sdk";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { DollarSign, List, Loader2, MapPin, PhoneCall, Search, Utensils, X } from "lucide-react";
import { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useState } from "react";
import { Map, Marker, Popup } from "react-map-gl/maplibre";
import { z } from "zod";
import { convertDrupalToResource } from "../../lib/bread";
import { useDebounce } from "../../lib/debounce";
import { getLocalizedField, getTranslations, setLanguage } from "../../lib/language";
import { cn } from "../../lib/utils";
import meals from "../data.json";

const getMeals = createServerFn("GET", async () => {
	const resources = meals.map((meal) => convertDrupalToResource(meal));
	return resources;
});

const SearchSchema = z.object({
	query: z.string().optional(),
	tab: z.enum(["map", "list"]).optional(),
	free: z.boolean().optional(),
});

export const Route = createFileRoute("/$language/")({
	component: Home,
	validateSearch: SearchSchema,
	beforeLoad: ({ params }) => {
		setLanguage(params.language as "en" | "fr");
	},
	loader: async () => await getMeals(),
});

const Resource = ({ resource }: { resource: ResourceType }) => {
	const { language } = Route.useParams();
	return (
		<div className="p-4 border border-gray-300 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow flex-col flex gap-2">
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
		</div>
	);
};

const STYLE: StyleSpecification = {
	version: 8,
	sources: {
		"raster-tiles": {
			type: "raster",
			tiles: [
				"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
			],
			tileSize: 256,
		},
	},
	layers: [
		{
			id: "osm-tiles",
			type: "raster",
			source: "raster-tiles",
			minzoom: 0,
			maxzoom: 19,
		},
	],
};

const MapMarker = ({ resource }: { resource: ResourceType }) => {
	const { language } = Route.useParams();
	const [popupOpen, setPopupOpen] = useState<boolean>(false);
	return (
		<>
			<Marker
				latitude={resource.address.lat}
				longitude={resource.address.lng}
				anchor="bottom"
				onClick={() => {
					setPopupOpen(true);
					console.log("clicked");
				}}
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
				>
					<button
						className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none"
						onClick={() => setPopupOpen(false)}
					>
						<X size={18} />
					</button>
					<div className="flex flex-col gap-2 mt-4">
						<p className="text-lg font-semibold">
							{getLocalizedField(resource.name, language)}
						</p>
						{/* Address section */}
						{resource.address && (
							<div className="text-gray-600 text-sm flex items-center gap-2">
								<MapPin size={18} />
								{formatServiceAddress(resource.address)}
							</div>
						)}
						{/* Call section */}
						{resource.phoneNumbers.map((phone) => (
							<div className="text-gray-600 text-sm flex items-center gap-2">
								<PhoneCall size={16} />
								<Link key={phone.phone} href={`tel:${phone.phone}`}>
									{phone.phone}
								</Link>
							</div>
						))}
						{/* Fees section */}
						{getLocalizedField(resource.body, language)?.fees && (
							<div className="mb-2 text-gray-600 text-sm flex items-center gap-2">
								<DollarSign size={18} />
								{getLocalizedField(resource.body, language)?.fees}
							</div>
						)}
					</div>
				</Popup>
			)}
		</>
	);
};

function Home() {
	const navigate = Route.useNavigate();
	const resources = Route.useLoaderData();
	const { language } = Route.useParams();
	const { tab = "list", free = false, query = "" } = Route.useSearch();
	const { debouncedValue: debouncedQuery, isPending } = useDebounce(query, 500);
	const translations = getTranslations(language);

	const results = useMemo(() => {
		return resources.filter(
			(resource) =>
				getLocalizedField(resource.name, language)
					?.toLowerCase()
					.includes(debouncedQuery.toLowerCase()) &&
				(free ? getLocalizedField(resource.body, language)?.fees === "Free" : true)
		);
	}, [debouncedQuery, resources, free]);

	return (
		<div className="p-4 max-w-screen-md mx-auto flex flex-col">
			<div className="flex flex-col py-4 gap-4">
				<header className="flex items-center gap-4 justify-between">
					<span className="flex items-center gap-2">
						<img src="/logo.png" alt="Bread Logo" className="w-12" />
						<p className="text-primary font-semibold text-xl tracking-widest">BREAD</p>
					</span>
					<button
						onClick={() => {
							navigate({
								to: Route.fullPath,
								params: { language: language === "en" ? "fr" : "en" },
								search: (prev) => ({ ...prev }),
							});
						}}
						className="h-10 w-10 rounded-full flex items-center justify-center border border-primary bg-primary/10"
					>
						{language === "en" ? "FR" : "EN"}
					</button>
				</header>
				<div className="flex-1">
					<div className="relative">
						<input
							type="text"
							placeholder={translations.search}
							className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 h-12 focus:outline-blue-300 focus:outline-[1px]"
							value={query}
							onChange={(e) =>
								navigate({
									search: (prev) => ({
										...prev,
										query: e.target.value === "" ? undefined : e.target.value,
									}),
								})
							}
						/>
						<div className="absolute left-3 top-0 h-full flex items-center pr-2">
							<Search size={18} />
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() =>
							navigate({ search: (prev) => ({ ...prev, tab: undefined }) })
						}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							tab === "list" ? "bg-primary/10 border-primary" : "bg-white"
						)}
					>
						<List size={18} />
						{translations.list}
					</button>
					<button
						onClick={() => navigate({ search: (prev) => ({ ...prev, tab: "map" }) })}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							tab === "map" ? "bg-primary/10 border-primary" : "bg-white"
						)}
					>
						<MapPin size={18} />
						{translations.map}
					</button>
					<div className="w-px h-6 bg-gray-300" />
					<button
						onClick={() =>
							navigate({
								search: (prev) => ({
									...prev,
									free: prev.free ? undefined : true,
								}),
							})
						}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							free ? "bg-primary/10 border-primary" : "bg-white"
						)}
					>
						<DollarSign size={18} />
						{translations.free}
					</button>
				</div>
			</div>
			{tab === "list" && (
				<>
					{isPending ? (
						<div className="flex justify-center items-center my-20">
							<Loader2 size={32} className="animate-spin" />
						</div>
					) : results.length === 0 ? (
						<div className="flex justify-center items-center my-20">
							No results found
						</div>
					) : (
						results.map((resource) => (
							<Resource key={resource.id} resource={resource} />
						))
					)}
				</>
			)}
			{tab === "map" && (
				<div className="rounded-lg overflow-hidden border border-gray-300">
					<Map
						initialViewState={{
							longitude: -114.0719,
							latitude: 51.0447,
							zoom: 9,
						}}
						style={{ width: "100%", height: 800 }}
						mapStyle={STYLE}
					>
						{results.map((resource) => (
							<MapMarker key={resource.id} resource={resource} />
						))}
					</Map>
				</div>
			)}
		</div>
	);
}
