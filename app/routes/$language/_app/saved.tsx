import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { days } from "@/lib/hours";
import { getTranslations, translate } from "@/lib/language";
import { STYLE } from "@/lib/map";
import { queryClient } from "@/router";
import { getResourcesFn } from "@/server/actions/resource";
import { getSavedFn, resetSavedFn } from "@/server/actions/saved";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	ErrorComponent,
	useNavigate,
} from "@tanstack/react-router";
import { CalendarDays, List, MapIcon } from "lucide-react";
import { useMemo } from "react";
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
	ssr: false,
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
	loader: async () => {
		await resetSavedFn();
		await queryClient.invalidateQueries({
			queryKey: ["saved"],
		});
		const saved = await queryClient.ensureQueryData({
			queryKey: ["saved"],
			queryFn: () => getSavedFn(),
		});
		const resources = await getResourcesFn({
			data: {
				ids: saved.map((savedResource) => savedResource.resourceId),
			},
		});
		return {
			resources,
		};
	},
});

function SavedPage() {
	const { data: saved } = useSuspenseQuery({
		queryKey: ["saved"],
		queryFn: () => getSavedFn(),
	});
	const { language } = Route.useParams();
	const { resources } = Route.useLoaderData();
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list", day = true } = Route.useSearch();

	const translations = getTranslations(language);

	const activeDays = useMemo(
		() =>
			new Set(
				saved.map((savedResource) => savedResource.day ?? "unassigned"),
			),
		[saved],
	);

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
							{Array.from(activeDays)
								.sort((dayA, dayB) => {
									// Put unassigned at the bottom
									if (dayA === "unassigned") return 1;
									if (dayB === "unassigned") return -1;
									// Sort by weekday order
									return (
										days.indexOf(dayA) - days.indexOf(dayB)
									);
								})
								.map((day) => (
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
											{resources
												.filter((resource) => {
													const savedResource =
														saved.find(
															(savedResource) =>
																savedResource.resourceId ===
																resource.id,
														)?.day ?? "unassigned";
													return (
														savedResource === day
													);
												})
												.map((resource) => (
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
							{resources.map((resource) => (
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
						{resources.map((resource) => (
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
