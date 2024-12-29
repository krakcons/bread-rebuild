import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { getMeals } from "@/lib/bread";
import { days } from "@/lib/hours";
import { getTranslations, translate } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { resetSeen, useSaved } from "@/lib/saved";
import { ResourceType } from "@cords/sdk";
import {
	createFileRoute,
	ErrorComponent,
	useNavigate,
} from "@tanstack/react-router";
import { CalendarDays, List, MapIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

const SearchParamsSchema = z.object({
	tab: z.enum(["map", "list"]).optional(),
	day: z.boolean().optional(),
});

export const Route = createFileRoute("/$language/_app/saved")({
	component: SavedPage,
	errorComponent: ErrorComponent,
	validateSearch: SearchParamsSchema,
	head: ({ params: { language } }) => {
		const translations = getTranslations(language);
		return {
			meta: [
				{
					title: translations.saved.title,
				},
				{
					name: "description",
					content: translations.saved.description,
				},
			],
		};
	},
	loader: async () => await getMeals(),
});

function SavedPage() {
	const { language } = Route.useParams();
	const meals = Route.useLoaderData();
	const saved = useSaved();
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list", day = true } = Route.useSearch();

	const results = useMemo(() => {
		return saved
			.map((savedResource) => {
				const resource = meals.find(
					(meal) => meal.id === savedResource.id,
				);
				if (!resource) return null;
				return { ...resource, day: savedResource.day };
			})
			.filter(Boolean) as (ResourceType & { day?: string })[];
	}, [saved]);

	useEffect(() => {
		resetSeen();
	}, [resetSeen]);

	const translations = getTranslations(language);

	return (
		<div className="flex flex-col gap-4">
			<div className="no-print flex items-center justify-between gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold">
						{translations.saved.title}
					</h1>
					<p className="text-gray-500">
						{translations.saved.description}
					</p>
				</div>
			</div>

			<div className="no-print flex items-center gap-2">
				<Button
					onClick={() =>
						navigate({
							search: (prev) => ({ ...prev, tab: undefined }),
						})
					}
					active={tab === "list"}
					size="lg"
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
					active={tab === "map"}
					size="lg"
				>
					<MapIcon size={18} />
					<p className="hidden sm:block">{translations.map}</p>
				</Button>
				<div className="h-6 w-px bg-gray-300" />
				<Button
					onClick={() =>
						navigate({
							search: (prev) => ({
								...prev,
								day: prev.day === undefined ? false : undefined,
							}),
						})
					}
					active={day}
					size="lg"
				>
					<CalendarDays size={18} />
					<p className="hidden sm:block">{translations.day}</p>
				</Button>
			</div>

			{tab === "list" && (
				<>
					{day ? (
						<Accordion
							type="multiple"
							defaultValue={[...days, "unassigned"]}
						>
							{Object.entries(
								results.reduce(
									(acc, resource) => {
										// Group items without a day under "unassigned"
										const key =
											resource.day || "unassigned";
										if (!acc[key]) acc[key] = [];
										acc[key].push(resource);
										return acc;
									},
									{} as Record<
										string,
										(ResourceType & { day?: string })[]
									>,
								),
							)
								.sort(([dayA], [dayB]) => {
									// Put unassigned at the bottom
									if (dayA === "unassigned") return 1;
									if (dayB === "unassigned") return -1;
									// Sort by weekday order
									return (
										days.indexOf(dayA) - days.indexOf(dayB)
									);
								})
								.map(([day, resources]) => (
									<AccordionItem key={day} value={day}>
										<AccordionTrigger className="text-xl font-semibold">
											{day === "unassigned"
												? translations.unassigned
												: translate(
														day,
														language as "fr" | "en",
													)}
										</AccordionTrigger>
										<AccordionContent className="flex flex-col gap-3">
											{resources.map((resource) => (
												<Resource
													key={resource.id}
													resource={resource}
												/>
											))}
										</AccordionContent>
									</AccordionItem>
								))}
						</Accordion>
					) : (
						<div className="flex flex-col gap-4">
							{results.map((resource) => (
								<Resource
									key={resource.id}
									resource={resource}
								/>
							))}
						</div>
					)}
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
						{results.map((resource) => (
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
