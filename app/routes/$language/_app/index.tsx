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
import { getDietaryOptions } from "@/lib/bread";
import { getLocalizedArray, getTranslations } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { db } from "@/server/db";
import {
	dietaryOptions,
	dietaryOptionsTranslations,
	providers,
	providerTranslations,
	resources,
} from "@/server/db/schema";
import { languageMiddleware } from "@/server/middleware";
import { FullResourceType } from "@/server/types";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { and, eq, exists, ilike, inArray } from "drizzle-orm";
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
	transitAvailable: z.boolean().optional(),
	wheelchairAccessible: z.boolean().optional(),
	dietaryOptionsIds: z.string().array().optional(),
});

const filterIcons = {
	free: <DollarSign size={18} />,
	preparationRequired: <UtensilsCrossed size={18} />,
	parkingAvailable: <Car size={18} />,
	nearTransit: <Bus size={18} />,
	wheelchairAccessible: <Accessibility size={18} />,
	dietaryOptionsIds: <Utensils size={18} />,
};

const searchFn = createServerFn()
	.middleware([languageMiddleware])
	.validator(SearchParamsSchema)
	.handler(
		async ({
			context: { language },
			data: { query, dietaryOptionsIds = [], ...filters },
		}) => {
			const meals = await db.query.resources.findMany({
				where: and(
					query
						? exists(
								db
									.select()
									.from(providers)
									.fullJoin(
										providerTranslations,
										eq(
											providers.id,
											providerTranslations.providerId,
										),
									)
									.where(
										ilike(
											providerTranslations.name,
											`%${query}%`,
										),
									),
							)
						: undefined,
					filters.free ? eq(resources.free, true) : undefined,
					filters.preparationRequired
						? eq(resources.preparationRequired, true)
						: undefined,
					filters.parkingAvailable
						? eq(resources.parkingAvailable, true)
						: undefined,
					filters.transitAvailable
						? eq(resources.transitAvailable, true)
						: undefined,
					filters.wheelchairAccessible
						? eq(resources.wheelchairAccessible, true)
						: undefined,
					dietaryOptionsIds.length > 0
						? exists(
								db
									.select()
									.from(dietaryOptions)
									.fullJoin(
										dietaryOptionsTranslations,
										eq(
											dietaryOptions.id,
											dietaryOptionsTranslations.dietaryOptionId,
										),
									)
									.where(
										inArray(
											dietaryOptionsTranslations.dietaryOptionId,
											dietaryOptionsIds,
										),
									),
							)
						: undefined,
				),
				with: {
					bodyTranslations: true,
					phoneNumbers: true,
				},
			});
			return meals.map((meal) => ({
				...meal,
				body: getLocalizedArray(meal.bodyTranslations, language),
			})) satisfies FullResourceType[];
		},
	);

export const Route = createFileRoute("/$language/_app/")({
	component: Home,
	errorComponent: ErrorComponent,
	validateSearch: SearchParamsSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ params: { language }, deps }) => {
		const meals = await searchFn({ data: deps });
		const dietaryOptions = await getDietaryOptions();
		return { meals, dietaryOptions };
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
		transitAvailable = false,
		wheelchairAccessible = false,
		dietaryOptionsIds = [],
	} = Route.useSearch();
	const { meals, dietaryOptions } = Route.useLoaderData();
	const translations = getTranslations(language);

	const filters: Record<string, boolean> = {
		free,
		preparationRequired,
		parkingAvailable,
		transitAvailable,
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
									) || dietaryOptionsIds.length > 0
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
								{dietaryOptions.map((option) => (
									<Button
										key={option[language === "en" ? 0 : 1]}
										onClick={() =>
											navigate({
												search: (prev) => ({
													...prev,
													dietaryOptionsIds:
														dietaryOptionsIds.includes(
															option[0],
														)
															? dietaryOptionsIds.filter(
																	(o) =>
																		o !==
																		option[0],
																)
															: [
																	...dietaryOptionsIds,
																	option[0],
																],
												}),
											})
										}
										active={dietaryOptionsIds.includes(
											option[0],
										)}
										className="flex-grow justify-start"
									>
										<Utensils size={18} />
										{
											option.dietaryOptionsTranslations.find(
												(translation) =>
													translation.language ===
													language,
											)?.name
										}
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
