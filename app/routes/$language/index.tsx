import { MapResource } from "@/components/MapResource";
import { Resource } from "@/components/Resource";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { dietaryOptions as breadDietaryOptions, getMeals } from "@/lib/bread";
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
	MapIcon,
	Search,
	Utensils,
	UtensilsCrossed,
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
	dietaryOptions: z.string().array().optional(),
});

const filterIcons = {
	free: <DollarSign size={18} />,
	preparationRequired: <UtensilsCrossed size={18} />,
	parkingAvailable: <Car size={18} />,
	nearTransit: <Bus size={18} />,
	wheelchairAccessible: <Accessibility size={18} />,
	dietaryOptions: <Utensils size={18} />,
};

export const Route = createFileRoute("/$language/")({
	component: Home,
	validateSearch: SearchParamsSchema,
	beforeLoad: async ({ search }) => {
		return search;
	},
	loader: async ({
		params: { language },
		context: { query, tab, dietaryOptions = [], ...filters },
	}) => {
		const meals = await getMeals();
		return meals
			.map((meal) => {
				const isFree = meal.body?.en?.fees === "Free";
				return {
					...meal,
					body: {
						en: {
							...meal.body?.en,
							free: isFree,
						},
						fr: {
							...meal.body?.fr,
							free: isFree,
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
						return value
							? getLocalizedField(resource.body, language)?.[name]
							: true;
					}) &&
					(dietaryOptions?.length === 0 ||
						resource.body?.en?.dietaryOptions?.filter((option) => {
							return dietaryOptions!.includes(option);
						})?.length === dietaryOptions?.length),
			);
	},
	head: ({ params: { language } }) => {
		const translations = getTranslations(language);
		return {
			meta: [
				{
					title: translations.title,
				},
				{
					name: "description",
					content: translations.description,
				},
			],
		};
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
		dietaryOptions = [],
	} = Route.useSearch();
	const meals = Route.useLoaderData();
	const translations = getTranslations(language);

	const filters: Record<string, boolean> = {
		free,
		preparationRequired,
		parkingAvailable,
		nearTransit,
		wheelchairAccessible,
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="no-print flex flex-col gap-3">
				<div className="flex-1">
					<div className="relative">
						<input
							type="text"
							placeholder={translations.search}
							className="h-12 w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
							value={query}
							onChange={(e) =>
								navigate({
									search: (prev) => ({
										...prev,
										query:
											e.target.value === ""
												? undefined
												: e.target.value,
									}),
								})
							}
						/>
						<div className="absolute left-3 top-0 flex h-full items-center pr-2">
							<Search size={18} />
						</div>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<button
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, tab: undefined }),
							})
						}
						className={cn(
							"flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2",
							tab === "list"
								? "border-primary bg-primary-background"
								: "bg-white transition-colors hover:bg-gray-50/50",
						)}
					>
						<List size={18} />
						<p className="hidden sm:block">{translations.list}</p>
					</button>
					<button
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, tab: "map" }),
							})
						}
						className={cn(
							"flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2",
							tab === "map"
								? "border-primary bg-primary-background"
								: "bg-white transition-colors hover:bg-gray-50/50",
						)}
					>
						<MapIcon size={18} />
						<p className="hidden sm:block">{translations.map}</p>
					</button>
					<div className="h-6 w-px bg-gray-300" />
					<Dialog>
						<DialogTrigger asChild>
							<button
								className={cn(
									"flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2",
									Object.values(filters).some(
										(filter) => filter,
									) || dietaryOptions.length > 0
										? "border-primary bg-primary-background"
										: "transition-colors hover:bg-gray-50/50",
								)}
							>
								<Filter size={18} />
								<p className="hidden sm:block">
									{translations.filters.title}
								</p>
							</button>
						</DialogTrigger>
						<DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
							<div className="flex flex-col gap-2">
								<h2 className="text-lg font-medium">
									{translations.filters.title}
								</h2>
								{Object.entries(filters).map(
									([name, value]) => (
										<button
											key={name}
											onClick={() =>
												navigate({
													search: (prev) => ({
														...prev,
														[name]:
															!value || undefined,
													}),
												})
											}
											className={cn(
												"flex w-full items-center gap-2 rounded-md border border-gray-300 px-4 py-2",
												value
													? "border-primary bg-primary-background"
													: "bg-white transition-colors hover:bg-gray-50/50",
											)}
										>
											{filterIcons[name]}
											{translations.filters[name]}
										</button>
									),
								)}
								<h2 className="mt-4 text-lg font-medium">
									{translations.dietaryOptions}
								</h2>
								<div className="flex flex-wrap gap-2">
									{breadDietaryOptions.map((option) => (
										<button
											key={
												option[
													language === "en" ? 0 : 1
												]
											}
											onClick={() =>
												navigate({
													search: (prev) => ({
														...prev,
														dietaryOptions:
															dietaryOptions.includes(
																option[0],
															)
																? dietaryOptions.filter(
																		(o) =>
																			o !==
																			option[0],
																	)
																: [
																		...dietaryOptions,
																		option[0],
																	],
													}),
												})
											}
											className={cn(
												"flex flex-grow items-center gap-2 rounded-md border border-gray-300 px-4 py-2",
												dietaryOptions.includes(
													option[0],
												)
													? "border-primary bg-primary-background"
													: "bg-white transition-colors hover:bg-gray-50/50",
											)}
										>
											<Utensils size={18} />
											{option[language === "en" ? 0 : 1]}
										</button>
									))}
								</div>
							</div>
						</DialogContent>
					</Dialog>
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
				<div className="flex-1 overflow-hidden rounded-lg border border-gray-300">
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
							<MapResource
								key={resource.id}
								resource={resource}
							/>
						))}
					</Map>
				</div>
			)}
		</div>
	);
}
