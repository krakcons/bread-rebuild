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
import { getTranslations } from "@/lib/locale";
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
import { useEffect, useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

const SearchParamsSchema = z.object({
	tab: z.enum(["map", "list"]).optional(),
	schedule: z.boolean().optional(),
});

export const Route = createFileRoute("/$locale/_app/saved")({
	component: SavedPage,
	errorComponent: ErrorComponent,
	validateSearch: SearchParamsSchema,
	head: ({ params: { locale } }) => {
		const translations = getTranslations(locale);
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
	const { resources } = Route.useLoaderData();
	const navigate = useNavigate({
		from: Route.fullPath,
	});
	const { tab = "list", schedule = true } = Route.useSearch();

	const { t } = Route.useRouteContext();
	const activeDays = useMemo(
		() =>
			new Set(
				saved.map((savedResource) => savedResource.day ?? "unassigned"),
			),
		[saved],
	);

	useEffect(() => {
		resetSavedFn().then(() => {
			queryClient.invalidateQueries({
				queryKey: ["saved"],
			});
		});
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="no-print flex items-center justify-between gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold">{t.saved.title}</h1>
					<p className="text-muted-foreground">
						{t.saved.description}
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
					<p className="hidden sm:block">{t.list}</p>
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
					<p className="hidden sm:block">{t.map}</p>
				</Button>
				{tab === "list" && (
					<>
						<div className="h-6 w-px bg-gray-300" />
						<Button
							onClick={() =>
								navigate({
									search: (prev) => ({
										...prev,
										schedule:
											prev.schedule === undefined
												? false
												: undefined,
									}),
								})
							}
							active={schedule}
							size="lg"
						>
							<CalendarDays size={18} />
							<p className="hidden sm:block">{t.day}</p>
						</Button>
					</>
				)}
			</div>

			{tab === "list" && (
				<>
					{schedule ? (
						<Accordion
							type="multiple"
							defaultValue={[
								...days.map((day) => day.toLowerCase()),
								"unassigned",
							]}
						>
							{Array.from(activeDays)
								.sort((dayA, dayB) => {
									// Sort by weekday order
									if (dayA === "unassigned") return 1;
									if (dayB === "unassigned") return -1;
									return (
										days.indexOf(dayA) - days.indexOf(dayB)
									);
								})
								.map((day) => (
									<AccordionItem key={day} value={day}>
										<AccordionTrigger className="text-xl font-semibold">
											{day === "unassigned"
												? t.daysOfWeek.unassigned
												: t.daysOfWeek.long[day]}
										</AccordionTrigger>
										<AccordionContent className="flex flex-col gap-3">
											{resources
												.filter((resource) => {
													const resourceDay =
														saved.find(
															(savedResource) =>
																savedResource.resourceId ===
																resource.id,
														)?.day;
													return !resourceDay
														? day === "unassigned"
														: resourceDay === day;
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
