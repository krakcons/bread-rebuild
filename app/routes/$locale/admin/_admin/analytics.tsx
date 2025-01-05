import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/locale";
import { db } from "@/server/db";
import { anonymousSessionsToResources, resources } from "@/server/db/schema";
import { providerMiddleware } from "@/server/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { eq, inArray } from "drizzle-orm";
import { Heart } from "lucide-react";

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

export const Route = createFileRoute("/$locale/admin/_admin/analytics")({
	component: RouteComponent,
	loader: async () => {
		const analytics = await getAnalytics();
		return {
			analytics,
		};
	},
});

function RouteComponent() {
	const { locale } = Route.useParams();
	const { analytics } = Route.useLoaderData();
	const t = useTranslations(locale);

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.analytics.title}</h1>
				<p>{t.admin.analytics.description}</p>
			</div>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-base font-medium">
						{t.admin.analytics.cards.savedResources.title}
					</CardTitle>
					<Heart size={18} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">
						{analytics.savedResources}
					</p>
					<p className="text-sm text-muted-foreground">
						{t.admin.analytics.cards.savedResources.description}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
