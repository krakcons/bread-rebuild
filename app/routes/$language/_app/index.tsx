import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { dietaryOptions as breadDietaryOptions, getMeals } from "@/lib/bread";
import { getLocalizedField, getTranslations } from "@/lib/language";
import { STYLE } from "@/lib/map";
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

export const Route = createFileRoute("/$language/_app/")({
	component: Home,
	validateSearch: SearchParamsSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({
		params: { language },
		deps: { query, tab, dietaryOptions = [], ...filters },
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
							className="h-12 w-full rounded-md border py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none"
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
					<Button
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, tab: undefined }),
							})
						}
						size="lg"
						active={tab === "list"}
					>
						<List size={18} />
						<p className="hidden sm:block">{translations.list}</p>
					</Button>
					<Button
						onClick={() =>
							navigate({
								search: (prev) => ({ ...prev, tab: "map" }),
							})
						}
						size="lg"
						active={tab === "map"}
					>
						<MapIcon size={18} />
						<p className="hidden sm:block">{translations.map}</p>
					</Button>
					<div className="h-6 w-px bg-gray-300" />
					<Dialog>
						<DialogTrigger asChild>
							<Button
								size="lg"
								active={
									Object.values(filters).some(
										(filter) => filter,
									) || dietaryOptions.length > 0
								}
							>
								<Filter size={18} />
								<p className="hidden sm:block">
									{translations.filters.title}
								</p>
							</Button>
						</DialogTrigger>
						<DialogContent className="flex max-h-screen flex-col gap-2 overflow-y-auto sm:max-w-lg">
							<DialogHeader className="flex flex-col items-start text-left">
								<DialogTitle>
									{translations.filters.title}
								</DialogTitle>
								<DialogDescription>
									{translations.filters.description}
								</DialogDescription>
							</DialogHeader>
							{Object.entries(filters).map(([name, value]) => (
								<Button
									key={name}
									onClick={() =>
										navigate({
											search: (prev) => ({
												...prev,
												[name]: !value || undefined,
											}),
										})
									}
									active={value}
									className="justify-start"
								>
									{filterIcons[name]}
									{translations.filters[name]}
								</Button>
							))}
							<p className="mt-2 text-lg font-semibold leading-none tracking-tight">
								{translations.dietaryOptions}
							</p>
							<div className="flex flex-wrap gap-2">
								{breadDietaryOptions.map((option) => (
									<Button
										key={option[language === "en" ? 0 : 1]}
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
										active={dietaryOptions.includes(
											option[0],
										)}
										className="flex-grow justify-start"
									>
										<Utensils size={18} />
										{option[language === "en" ? 0 : 1]}
									</Button>
								))}
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
				<div className="flex-1 overflow-hidden rounded-lg border">
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
