import { MapResource } from "@/components/MapResource";
import { Resource } from "@/components/Resource";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { getMeals } from "@/lib/bread";
import { getLocalizedField, getTranslations } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
	Accessibility,
	Bus,
	Car,
	DollarSign,
	Filter,
	List,
	MapPin,
	Search,
	Utensils,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

const SearchParamsSchema = z.object({
	query: z.string().optional(),
	tab: z.enum(["map", "list"]).optional(),
	free: z.boolean().optional(),
	preparationRequired: z.boolean().optional(),
	parkingAvailable: z.boolean().optional(),
	nearTransit: z.boolean().optional(),
	wheelchairAccessible: z.boolean().optional(),
});

const filterIcons = {
	free: <DollarSign size={18} />,
	preparationRequired: <Utensils size={18} />,
	parkingAvailable: <Car size={18} />,
	nearTransit: <Bus size={18} />,
	wheelchairAccessible: <Accessibility size={18} />,
};

export const Route = createFileRoute("/$language/")({
	component: Home,
	validateSearch: SearchParamsSchema,
	beforeLoad: async ({ search }) => {
		return search;
	},
	loader: async ({ params: { language }, context: { query, ...filters } }) => {
		const meals = await getMeals();
		return meals
			.map((meal) => {
				return {
					...meal,
					body: {
						en: {
							...meal.body?.en,
							free: meal.body?.en?.fees === "Free",
						},
						fr: {
							...meal.body?.fr,
							free: meal.body?.fr?.fees === "Free",
						},
					},
				};
			})
			.filter(
				(resource) =>
					(query
						? getLocalizedField(resource.name, language)
								?.toLowerCase()
								.includes(query.toLowerCase())
						: true) &&
					Object.entries(filters).every(([name, value]) => {
						return value ? getLocalizedField(resource.body, language)?.[name] : true;
					})
			);
	},
	meta: ({ params: { language } }) => {
		const translations = getTranslations(language);
		return [
			{
				title: translations.title,
			},
			{
				name: "description",
				content: translations.description,
			},
		];
	},
});

function Home() {
	const navigate = Route.useNavigate();
	const { language } = Route.useParams();
	const {
		tab = "list",
		query = "",
		free = false,
		preparationRequired = false,
		parkingAvailable = false,
		nearTransit = false,
		wheelchairAccessible = false,
	} = Route.useSearch();
	const meals = Route.useLoaderData();
	const translations = getTranslations(language);

	const filters = {
		free,
		preparationRequired,
		parkingAvailable,
		nearTransit,
		wheelchairAccessible,
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3">
				<div className="flex-1">
					<div className="relative">
						<input
							type="text"
							placeholder={translations.search}
							className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 h-12 focus:outline-primary focus:outline-[1px]"
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
				<div className="flex items-center gap-2 flex-wrap">
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
					<Popover>
						<PopoverTrigger asChild>
							<button
								className={cn(
									"flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300",
									Object.values(filters).some((filter) => filter) &&
										"bg-primary/10 border-primary"
								)}
							>
								<Filter size={18} />
								{translations.filters.title}
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="flex flex-col gap-2">
								{Object.entries(filters).map(([name, value]) => (
									<button
										key={name}
										onClick={() =>
											navigate({
												search: (prev) => ({
													...prev,
													[name]: !value || undefined,
												}),
											})
										}
										className={cn(
											"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 w-full",
											value ? "bg-primary/10 border-primary" : "bg-white"
										)}
									>
										{filterIcons[name]}
										{translations.filters[name]}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			{tab === "list" && (
				<>
					<div className="flex flex-col gap-3">
						{meals.map((resource) => (
							<Resource key={resource.id} resource={resource} />
						))}
					</div>
				</>
			)}
			{tab === "map" && (
				<div className="rounded-lg overflow-hidden border border-gray-300 flex-1">
					<Map
						initialViewState={{
							longitude: -114.0719,
							latitude: 51.0447,
							zoom: 9,
						}}
						style={{ width: "100%", height: "80vh" }}
						mapStyle={STYLE}
					>
						{meals.map((resource) => (
							<MapResource key={resource.id} resource={resource} />
						))}
					</Map>
				</div>
			)}
		</div>
	);
}
