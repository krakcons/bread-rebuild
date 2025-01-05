import { ListingForm } from "@/components/forms/Listing";
import { Locale, useTranslations } from "@/lib/locale";
import { getDietaryOptionsFn } from "@/server/actions/dietary";
import { mutateListingFn } from "@/server/actions/listings";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/$locale/admin/_admin/listings/new")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	loader: async ({ params }) => {
		const dietaryOptions = await getDietaryOptionsFn({
			data: {
				locale: params.locale as Locale,
				fallback: true,
			},
		});
		return {
			dietaryOptions,
		};
	},
});

function RouteComponent() {
	const createListing = useServerFn(mutateListingFn);
	const { locale } = Route.useParams();
	const t = useTranslations(locale);
	const { dietaryOptions } = Route.useLoaderData();
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.listings.new.title}</h1>
				<p>{t.admin.listings.new.description}</p>
			</div>
			<div className="flex flex-col gap-2">
				<ListingForm
					locale={locale}
					dietaryOptions={dietaryOptions}
					onSubmit={(data) => {
						createListing({ data: { ...data, redirect: true } });
					}}
				/>
			</div>
		</div>
	);
}
