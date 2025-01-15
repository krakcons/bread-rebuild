import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics } from "@/server/actions/provider";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useTranslations } from "use-intl";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/$locale/admin/_admin/analytics")({
	component: RouteComponent,
	loader: async ({ context: { t } }) => {
		const analytics = await getAnalytics();
		return {
			seo: {
				title: t("admin.analytics.title"),
				description: t("admin.analytics.description"),
			},
			analytics,
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return seo(loaderData.seo);
	},
});

function RouteComponent() {
	const { analytics } = Route.useLoaderData();
	const t = useTranslations();

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t("admin.analytics.title")}</h1>
				<p>{t("admin.analytics.description")}</p>
			</div>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-base font-medium">
						{t("admin.analytics.cards.savedResources.title")}
					</CardTitle>
					<Heart size={18} className="text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">
						{analytics.savedResources}
					</p>
					<p className="text-sm text-muted-foreground">
						{t("admin.analytics.cards.savedResources.description")}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
