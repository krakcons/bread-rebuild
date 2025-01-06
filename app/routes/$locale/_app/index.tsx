import { Resource } from "@/components/Resource";
import { MapResource } from "@/components/Resource/Map";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { getTranslations, useTranslations } from "@/lib/locale";
import { STYLE } from "@/lib/map";
import { getDietaryOptionsFn } from "@/server/actions/dietary";
import { searchFn, SearchParamsSchema } from "@/server/actions/resource";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import {
	Accessibility,
	Bus,
	Car,
	DollarSign,
	Filter,
	List,
	MapIcon,
	Search,
	Utensils,
	UtensilsCrossed,
} from "lucide-react";
import { Map } from "react-map-gl/maplibre";

const filterIcons = {
	free: <DollarSign size={18} />,
	preparation: <UtensilsCrossed size={18} />,
	parking: <Car size={18} />,
	transit: <Bus size={18} />,
	wheelchair: <Accessibility size={18} />,
} as const;

export const Route = createFileRoute("/$locale/_app/")({
	component: Home,
	errorComponent: ErrorComponent,
	validateSearch: SearchParamsSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const resources = await searchFn({ data: deps });
		const dietaryOptions = await getDietaryOptionsFn();
		return { resources, dietaryOptions };
	},
	head: ({ params: { locale } }) => {
		const translations = getTranslations(locale);
		return {
			meta: [
				{
					title: translations.title,
				},
				{
					name: "description",
					content: translations.description,
				},
			],
		};
	},
});

function Home() {
	const navigate = Route.useNavigate();
	const { locale } = Route.useParams();
	const {
		tab = "list",
		query = "",
		free = false,
		preparation = false,
		parking = false,
		transit = false,
		wheelchair = false,
		dietaryOptionIds = [],
	} = Route.useSearch();
	const { resources, dietaryOptions } = Route.useLoaderData();
	const translations = useTranslations(locale);

	const queryForm = useForm({
		defaultValues: {
			query,
		},
		asyncDebounceMs: 300,
		validators: {
			onChangeAsync: ({ value: { query } }) => {
				navigate({
					search: (prev) => ({
						...prev,
						query: query === "" ? undefined : query,
					}),
				});
				if (query === "") {
					return "Query cannot be empty";
				}
			},
		},
	});

	const filtersForm = useForm({
		defaultValues: {
			free,
			preparation,
			parking,
			transit,
			wheelchair,
			dietaryOptionIds,
		},
		onSubmit: ({ value }) => {
			navigate({
				search: (prev) => ({
					...prev,
					free: value.free || undefined,
					preparation: value.preparation || undefined,
					parking: value.parking || undefined,
					transit: value.transit || undefined,
					wheelchair: value.wheelchair || undefined,
					dietaryOptionIds:
						value.dietaryOptionIds.length > 0
							? value.dietaryOptionIds
							: undefined,
				}),
			});
		},
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="no-print flex flex-col gap-3">
				<div className="flex-1">
					<form className="relative">
						<queryForm.Field
							name="query"
							children={(field) => (
								<Input
									type="text"
									placeholder={translations.search}
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									className="h-12 pl-10 !text-base"
								/>
							)}
						/>
						<div className="absolute left-3 top-0 flex h-full items-center pr-2">
							<Search size={18} />
						</div>
					</form>
				</div>
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
						<p className="hidden sm:block">{translations.list}</p>
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
						<p className="hidden sm:block">{translations.map}</p>
					</Button>
					<div className="h-6 w-px bg-gray-300" />
					<Dialog>
						<DialogTrigger asChild>
							<Button
								size="lg"
								active={
									free ||
									preparation ||
									parking ||
									transit ||
									wheelchair ||
									dietaryOptionIds.length > 0
								}
							>
								<Filter size={18} />
								<p className="hidden sm:block">
									{translations.filters.title}
								</p>
							</Button>
						</DialogTrigger>
						<DialogContent className="flex max-h-screen flex-col gap-2 overflow-y-auto sm:max-w-lg">
							<DialogHeader className="flex flex-col items-start text-left">
								<DialogTitle>
									{translations.filters.title}
								</DialogTitle>
								<DialogDescription>
									{translations.filters.description}
								</DialogDescription>
							</DialogHeader>
							<form className="flex flex-col gap-2">
								{Object.keys(filterIcons).map((name) => (
									<filtersForm.Field
										key={name}
										name={name as keyof typeof filterIcons}
										listeners={{
											onChange: () => {
												filtersForm.handleSubmit();
											},
										}}
										children={(field) => (
											<Button
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													field.handleChange(
														!field.state.value,
													);
												}}
												active={field.state.value}
												className="justify-start"
											>
												{
													filterIcons[
														name as keyof typeof filterIcons
													]
												}
												{translations.filters[name]}
											</Button>
										)}
									/>
								))}
								<p className="mt-2 text-lg font-semibold leading-none tracking-tight">
									{translations.dietaryOptions}
								</p>
								<div className="flex flex-wrap gap-2">
									<filtersForm.Field
										name={"dietaryOptionIds"}
										listeners={{
											onChange: () => {
												filtersForm.handleSubmit();
											},
										}}
										children={(field) => (
											<>
												{dietaryOptions.map(
													(option) => (
														<Button
															key={option.id}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																field.handleChange(
																	field.state.value.includes(
																		option.id,
																	)
																		? field.state.value.filter(
																				(
																					id,
																				) =>
																					id !==
																					option.id,
																			)
																		: [
																				...field
																					.state
																					.value,
																				option.id,
																			],
																);
															}}
															active={field.state.value.includes(
																option.id,
															)}
															className="flex-grow justify-start"
														>
															<Utensils
																size={18}
															/>
															{option.name}
														</Button>
													),
												)}
											</>
										)}
									/>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			{tab === "list" && (
				<>
					<div className="flex flex-col gap-3">
						{resources.map((resource) => (
							<Resource key={resource.id} resource={resource} />
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
