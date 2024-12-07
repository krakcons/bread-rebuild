import { MapResource } from "@/components/MapResource";
import { Resource } from "@/components/Resource";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordian";
import { getMeals } from "@/lib/bread";
import { days } from "@/lib/hours";
import { getTranslations, translate } from "@/lib/language";
import { STYLE } from "@/lib/map";
import useSaved from "@/lib/saved";
import { cn } from "@/lib/utils";
import { ResourceType } from "@cords/sdk";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, List, MapPin } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

const SearchParamsSchema = z.object({
	tab: z.enum(["map", "list"]).optional(),
	day: z.boolean().optional(),
});

export const Route = createFileRoute("/$language/saved")({
	component: SavedPage,
	validateSearch: SearchParamsSchema,
	meta: ({ params: { language } }) => {
		const translations = getTranslations(language);
		return [
			{
				title: translations.saved.title,
			},
			{
				name: "description",
				content: translations.saved.description,
			},
		];
	},
	loader: async () => await getMeals(),
});

function SavedPage() {
	const { language } = Route.useParams();
	const saved = useSaved();
	const meals = Route.useLoaderData();
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list", day = false } = Route.useSearch();

	const results = useMemo(() => {
		return saved.saved
			.map(({ id, day }) => meals.find((meal) => meal.id === id))
			.filter(Boolean) as ResourceType[];
	}, [saved]);

	const translations = getTranslations(language);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-4 no-print">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold">{translations.saved.title}</h1>
					<p className="text-gray-500">{translations.saved.description}</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={() => navigate({ search: (prev) => ({ ...prev, tab: undefined }) })}
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
								day: prev.day ? undefined : true,
							}),
						})
					}
					className={cn(
						"px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2",
						day ? "bg-primary/10 border-primary" : "bg-white"
					)}
				>
					<CalendarDays size={18} />
					{translations.day}
				</button>
			</div>

			{tab === "list" && (
				<>
					{day ? (
						<Accordion type="multiple" defaultValue={[...days, "unassigned"]}>
							{Object.entries(
								results.reduce(
									(acc, resource) => {
										const day = saved.getDay(resource.id);
										// Group items without a day under "unassigned"
										const key = day || "unassigned";
										if (!acc[key]) acc[key] = [];
										acc[key].push(resource);
										return acc;
									},
									{} as Record<string, ResourceType[]>
								)
							)
								.sort(([dayA], [dayB]) => {
									// Put unassigned at the bottom
									if (dayA === "unassigned") return 1;
									if (dayB === "unassigned") return -1;
									// Sort by weekday order
									return days.indexOf(dayA) - days.indexOf(dayB);
								})
								.map(([day, resources]) => (
									<AccordionItem key={day} value={day}>
										<AccordionTrigger className="text-xl font-semibold">
											{day === "unassigned"
												? translations.unassigned
												: translate(day, language as "fr" | "en")}
										</AccordionTrigger>
										<AccordionContent>
											{resources.map((resource) => (
												<Resource key={resource.id} resource={resource} />
											))}
										</AccordionContent>
									</AccordionItem>
								))}
						</Accordion>
					) : (
						<div className="flex flex-col gap-4">
							{results.map((resource) => (
								<Resource key={resource.id} resource={resource} />
							))}
						</div>
					)}
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
						{results.map((resource) => (
							<MapResource key={resource.id} resource={resource} />
						))}
					</Map>
				</div>
			)}
		</div>
	);
}
