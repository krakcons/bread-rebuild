import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { useTranslations } from "use-intl";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/$locale/admin/_admin/")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	loader: ({ context: { t } }) => {
		return {
			seo: {
				title: t("admin.dashboard.title"),
			},
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return seo(loaderData.seo);
	},
});

function RouteComponent() {
	const t = useTranslations();
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t("admin.dashboard.title")}</h1>
			</div>
			<p>{t("admin.dashboard.explanation")}</p>
			<div className="flex flex-col gap-2">
				<Link
					to="/$locale/admin/listings/list"
					className="flex flex-col gap-2 border p-4"
					from={Route.fullPath}
					search={(prev) => prev}
					params={(prev) => prev}
				>
					<p className="text-lg font-semibold">
						{t("admin.listings.title")}
					</p>
					<p>{t("admin.listings.description")}</p>
				</Link>
				<Link
					to="/$locale/admin/providers/me"
					className="flex flex-col gap-2 border p-4"
					from={Route.fullPath}
					search={(prev) => prev}
					params={(prev) => prev}
				>
					<p className="text-lg font-semibold">
						{t("admin.provider.title")}
					</p>
					<p>{t("admin.provider.description")}</p>
				</Link>
				<Link
					to="/$locale/admin/analytics"
					className="flex flex-col gap-2 border p-4"
					from={Route.fullPath}
					search={(prev) => prev}
					params={(prev) => prev}
				>
					<p className="text-lg font-semibold">
						{t("admin.analytics.title")}
					</p>
					<p>{t("admin.analytics.description")}</p>
				</Link>
			</div>
		</div>
	);
}
