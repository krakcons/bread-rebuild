import { ListingForm } from "@/components/forms/Listing";
import { NotFound } from "@/components/NotFound";
import { useTranslations } from "@/lib/locale";
import { mutateListingFn } from "@/server/actions/listings";
import { getResourceFn } from "@/server/actions/resource";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/$locale/admin/_admin/listings/$id")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	notFoundComponent: NotFound,
	loaderDeps: ({ search }) => ({ editingLocale: search.editingLocale }),
	loader: async ({ params, deps }) => {
		const listing = await getResourceFn({
			data: {
				id: params.id,
				locale: deps.editingLocale,
				fallback: false,
			},
		});
		return { listing };
	},
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { listing } = Route.useLoaderData();
	const updateListing = useServerFn(mutateListingFn);
	const { locale } = Route.useParams();
	const { editingLocale } = Route.useSearch();
	const t = useTranslations(locale);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.listings.edit.title}</h1>
				<p>{t.admin.listings.edit.description}</p>
			</div>
			<div className="flex flex-col gap-2">
				<ListingForm
					key={editingLocale}
					locale={locale}
					defaultValues={listing}
					onSubmit={(data) => {
						updateListing({
							data: { ...data, id, redirect: false },
						});
					}}
				/>
			</div>
		</div>
	);
}
