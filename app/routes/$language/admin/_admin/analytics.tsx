import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/server/db";
import { anonymousSessionsToResources, resources } from "@/server/db/schema";
import { providerMiddleware } from "@/server/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { eq, inArray } from "drizzle-orm";
import { Heart } from "lucide-react";

const english = {
	title: "Analytics",
	description: "View your analytics here.",
	cards: {
		savedResources: {
			title: "Saved resources",
			description: "The number of resources actively saved by users.",
		},
	},
};

const french: typeof english = {
	title: "Analytics",
	description: "Voir vos statistiques ici.",
	cards: {
		savedResources: {
			title: "Ressources sauvegardées",
			description:
				"Le nombre de ressources sauvegardées par les utilisateurs.",
		},
	},
};

export const getAnalytics = createServerFn({
	method: "GET",
})
	.middleware([providerMiddleware])
	.handler(async ({ context }) => {
		const providerResources = await db.query.resources.findMany({
			where: eq(resources.providerId, context.provider.id),
		});

		const savedResources = (
			await db.query.anonymousSessionsToResources.findMany({
				where: inArray(
					anonymousSessionsToResources.resourceId,
					providerResources.map((r) => r.id),
				),
			})
		).length;

		return {
			savedResources,
		};
	});

export const Route = createFileRoute("/$language/admin/_admin/analytics")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const analytics = await getAnalytics();
		return {
			pt: params.language === "fr" ? french : english,
			analytics,
		};
	},
});

function RouteComponent() {
	const { pt, analytics } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{pt.title}</h1>
				<p>{pt.description}</p>
			</div>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-base font-medium">
						{pt.cards.savedResources.title}
					</CardTitle>
					<Heart size={18} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">
						{analytics.savedResources}
					</p>
					<p className="text-sm text-muted-foreground">
						{pt.cards.savedResources.description}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
