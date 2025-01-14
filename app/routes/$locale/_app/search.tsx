import SearchForm from "@/components/forms/Search";
import { PendingComponent } from "@/components/PendingComponent";
import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/lib/debounce";
import { getTranslations } from "@/lib/locale";
import { STYLE } from "@/lib/map";
import { searchFn, SearchFormSchema } from "@/server/actions/resource";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { List, MapIcon } from "lucide-react";
import { Map } from "react-map-gl/maplibre";
import { z } from "zod";

export const Route = createFileRoute("/$locale/_app/search")({
	component: Home,
	errorComponent: ErrorComponent,
	validateSearch: SearchFormSchema.extend({
		tab: z.enum(["map", "list"]).optional(),
	}),
	head: ({ params: { locale } }) => {
		const t = getTranslations(locale);
		return {
			meta: [
				{
					title: t.title,
				},
				{
					name: "description",
					content: t.description,
				},
			],
		};
	},
});

function Home() {
	const navigate = Route.useNavigate();
	const searchParams = Route.useSearch();
	const { tab = "list" } = searchParams;
	const { t } = Route.useRouteContext();

	const queryForm = useForm({
		defaultValues: {
			query: searchParams.query,
		},
	});
	const query = useStore(queryForm.store, (state) => state.values.query);
	const debouncedQuery = useDebounce(query, 300);

	const { data: resources, isLoading } = useQuery({
		queryKey: ["search", { ...searchParams, query: debouncedQuery }],
		queryFn: () =>
			searchFn({ data: { ...searchParams, query: debouncedQuery } }),
	});

	return (
		<div className="flex flex-col gap-3">
			<SearchForm
				onSubmit={(values) => {
					navigate({
						replace: true,
						search: (prev) => ({ ...prev, ...values }),
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
					<p className="hidden sm:block">{t.list}</p>
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
					<p className="hidden sm:block">{t.map}</p>
				</Button>
			</div>
			{isLoading || query !== debouncedQuery ? (
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
								style={{ width: "100%", height: "80vh" }}
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
		</div>
	);
}
