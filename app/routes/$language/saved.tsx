import { Resource } from "@/components/Resource";
import { getMeals } from "@/lib/bread";
import useSaved from "@/lib/saved";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/$language/saved")({
	component: SavedPage,
	loader: async () => await getMeals(),
});

function SavedPage() {
	const { language } = Route.useParams();
	const saved = useSaved();
	const meals = Route.useLoaderData();

	const results = useMemo(() => {
		return saved.savedIds.map((id) => meals.find((meal) => meal.id === id));
	}, [saved]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-4 no-print">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-semibold">Saved</h1>
					<p className="text-gray-500">
						You can save resources here to find them later. Press the print button above
						to print out your saved resources.
					</p>
				</div>
			</div>
			{results.map((resource) => (
				<Resource key={resource.id} resource={resource} />
			))}
		</div>
	);
}
