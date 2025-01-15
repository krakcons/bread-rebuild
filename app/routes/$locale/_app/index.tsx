import SearchForm from "@/components/forms/Search";
import { PendingComponent } from "@/components/PendingComponent";
import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import { Button, buttonVariants } from "@/components/ui/Button";
import { STYLE } from "@/lib/map";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { searchFn, SearchFormSchema } from "@/server/actions/resource";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { List, MapIcon } from "lucide-react";
import { Map } from "react-map-gl/maplibre";
import { useTranslations } from "use-intl";
import { z } from "zod";

export const Route = createFileRoute("/$locale/_app/")({
	component: RouteComponent,
	validateSearch: SearchFormSchema.extend({
		view: z.enum(["wizard", "search"]).optional(),
		tab: z.enum(["map", "list"]).optional(),
	}),
	loader: ({ context: { t } }) => {
		return {
			seo: {
				title: t("title"),
				description: t("description"),
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
	const navigate = Route.useNavigate();
	const searchParams = Route.useSearch();
	const { tab = "list", view = "wizard" } = searchParams;

	const { data: resources, isLoading } = useQuery({
		queryKey: ["search", { ...searchParams, query: searchParams.query }],
		queryFn: () =>
			searchFn({ data: { ...searchParams, query: searchParams.query } }),
	});

	return (
		<div
			className={cn(
				"flex flex-col justify-center gap-4",
				view === "wizard" && "sm:[my-10vh] my-[5vh] items-center",
			)}
		>
			{view === "wizard" && (
				<div className="flex items-center gap-2">
					<img src="/logo.png" alt="BREAD" className="h-20 w-20" />
					<h1 className="text-6xl font-medium tracking-wide text-primary">
						BREAD
					</h1>
				</div>
			)}
			<div className="max-w-lg">
				<SearchForm
					hide={{
						filters: view === "search",
						submit: view === "search",
						query: view === "wizard",
					}}
					onSubmit={(values) => {
						navigate({
							replace: true,
							search: (prev) => ({
								...prev,
								...values,
								view: "search",
							}),
						});
					}}
					defaultValues={{
						query: searchParams.query,
						free: searchParams.free,
						preparation: searchParams.preparation,
						parking: searchParams.parking,
						transit: searchParams.transit,
						wheelchair: searchParams.wheelchair,
						dietaryOptions: searchParams.dietaryOptions,
					}}
				/>
			</div>
			{view === "wizard" ? (
				<>
					<div className="flex flex-col items-center gap-2 sm:flex-row">
						<div className="flex items-center gap-2">
							<p className="text-sm">{t("poweredBy")}</p>
							<a
								href="https://technologyhelps.org"
								target="_blank"
								className="flex items-center gap-2"
							>
								<img
									src="/tech-helps-logo.png"
									alt="Technology Helps Logo"
									className="h-16 w-16"
								/>
							</a>
						</div>
						<div className="h-[1px] w-4 bg-border sm:h-4 sm:w-px" />
						<div className="flex items-center text-sm">
							<Link
								from={Route.fullPath}
								to="/$locale/privacy-policy"
								className={cn(
									buttonVariants({
										variant: "link",
									}),
									"px-1",
								)}
							>
								{t("privacy")}
							</Link>
							<Link
								from={Route.fullPath}
								to="/$locale/terms"
								className={cn(
									buttonVariants({
										variant: "link",
									}),
									"px-1",
								)}
							>
								{t("terms")}
							</Link>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							onClick={() =>
								navigate({
									search: (prev) => ({
										...prev,
										tab: undefined,
									}),
								})
							}
							size="lg"
							active={tab === "list"}
						>
							<List size={18} />
							<p className="hidden sm:block">{t("list")}</p>
						</Button>
						<Button
							onClick={() =>
								navigate({
									search: (prev) => ({ ...prev, tab: "map" }),
								})
							}
							size="lg"
							active={tab === "map"}
						>
							<MapIcon size={18} />
							<p className="hidden sm:block">{t("map")}</p>
						</Button>
					</div>
					{isLoading ? (
						<PendingComponent />
					) : (
						<>
							{tab === "list" && (
								<>
									<div className="flex flex-col gap-3">
										{resources?.map((resource) => (
											<Resource
												key={resource.id}
												resource={resource}
											/>
										))}
									</div>
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
										style={{
											width: "100%",
											height: "80vh",
										}}
										mapStyle={STYLE}
									>
										{resources?.map((resource) => (
											<MapResource
												key={resource.id}
												resource={resource}
											/>
										))}
									</Map>
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}
