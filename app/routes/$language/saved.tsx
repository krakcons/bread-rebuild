import { MapResource } from "@/components/MapResource";
import { Resource } from "@/components/Resource";
import { getMeals } from "@/lib/bread";
import { getTranslations } from "@/lib/language";
import { STYLE } from "@/lib/map";
import useSaved from "@/lib/saved";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { List, MapPin } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

export const Route = createFileRoute("/$language/saved")({
	component: SavedPage,
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
	validateSearch: z.object({
		tab: z.enum(["map", "list"]).optional(),
	}),
});

function SavedPage() {
	const { language } = Route.useParams();
	const saved = useSaved();
	const meals = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { tab = "list" } = Route.useSearch();

	const results = useMemo(() => {
		return saved.savedIds.map((id) => meals.find((meal) => meal.id === id));
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
			</div>

			{tab === "list" && (
				<div className="flex flex-col gap-4">
					{results.map((resource) => (
						<Resource key={resource.id} resource={resource} />
					))}
				</div>
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
