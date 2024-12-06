import { ResourceType, formatServiceAddress } from "@cords/sdk";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { DollarSign, List, Loader2, MapPin, Search, Utensils, X } from "lucide-react";
import { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useState } from "react";
import { Map, Marker, Popup } from "react-map-gl/maplibre";
import { create } from "zustand";
import { convertDrupalToResource } from "../lib/bread";
import { useDebounce } from "../lib/debounce";
import { useHours } from "../lib/hours";
import { cn } from "../lib/utils";
import meals from "./data.json";

const getMeals = createServerFn("GET", async () => {
	const resources = meals.map(convertDrupalToResource);
	return resources;
});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getMeals(),
});

const Resource = ({ resource }: { resource: ResourceType }) => {
	const hours = useHours(resource.body.en.hours);
	return (
		<div className="p-4 border rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow">
			<h2 className="text-xl font-semibold mb-2">{resource.name.en}</h2>

			{/* Address section */}
			{resource.address && (
				<div className="mb-2 text-gray-600">
					<svg
						className="inline w-4 h-4 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{formatServiceAddress(resource.address)}
				</div>
			)}
			{/* Hours section */}
			<div className="text-sm text-gray-600">
				<svg
					className="inline w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div className="grid grid-cols-2 gap-2 mt-1">
					{hours.map((hour) => (
						<div key={hour.day}>
							<span className="font-medium">{hour.day}:</span> {hour.open} -{" "}
							{hour.close}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const useSearch = create<{
	free: boolean;
	query: string;
	mode: "map" | "list";
	setFree: (free: boolean) => void;
	setQuery: (query: string) => void;
	setMode: (mode: "map" | "list") => void;
}>((set) => ({
	free: false,
	query: "",
	mode: "list",
	setFree: (free: boolean) => set({ free }),
	setQuery: (query: string) => set({ query }),
	setMode: (mode: "map" | "list") => set({ mode }),
}));

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
					onClose={() => setPopupOpen(false)}
					anchor="bottom"
					offset={36}
					closeOnClick={false}
					closeButton={false}
					style={{
						padding: 0,
					}}
				>
					<div className="relative pt-3">
						<div className="text-base font-semibold">{resource.name.en}</div>
						<button
							className="absolute -top-3 -right-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
							onClick={() => setPopupOpen(false)}
						>
							<X size={18} />
						</button>
					</div>
				</Popup>
			)}
		</>
	);
};

function Home() {
	const resources = Route.useLoaderData();
	const search = useSearch();
	const { debouncedValue: debouncedQuery, isPending } = useDebounce(search.query, 500);

	const results = useMemo(() => {
		return resources.filter((resource) => resource.name.en.includes(debouncedQuery));
	}, [debouncedQuery, resources]);

	return (
		<div className="p-4 max-w-screen-md mx-auto flex flex-col">
			<div className="flex flex-col py-4 gap-4">
				<div className="flex-1">
					<div className="relative">
						<input
							type="text"
							placeholder="Search"
							className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 h-12 focus:outline-blue-300 focus:outline-[1px]"
							value={search.query}
							onChange={(e) => search.setQuery(e.target.value)}
						/>
						<div className="absolute left-3 top-0 h-full flex items-center pr-2">
							<Search size={18} />
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => search.setMode("list")}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							search.mode === "list" ? "bg-blue-50 border-blue-300" : "bg-white"
						)}
					>
						<List size={18} />
						List
					</button>
					<button
						onClick={() => search.setMode("map")}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							search.mode === "map" ? "bg-blue-50 border-blue-300" : "bg-white"
						)}
					>
						<MapPin size={18} />
						Map
					</button>
					<div className="w-px h-6 bg-gray-300" />
					<button
						onClick={() => search.setFree(!search.free)}
						className={cn(
							"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
							search.free ? "bg-blue-50 border-blue-300" : "bg-white"
						)}
					>
						<DollarSign size={18} />
						Free
					</button>
				</div>
			</div>
			{search.mode === "list" && (
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
			{search.mode === "map" && (
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
