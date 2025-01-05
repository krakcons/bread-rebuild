import { ListingForm } from "@/components/forms/Listing";
import { useTranslations } from "@/lib/locale";
import { createListingFn } from "@/server/actions/listings";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/$locale/admin/_admin/listings/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const createListing = useServerFn(createListingFn);
	const { locale } = Route.useParams();
	const t = useTranslations(locale);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.listings.new.title}</h1>
				<p>{t.admin.listings.new.description}</p>
			</div>
			<div className="flex flex-col gap-2">
				<ListingForm
					locale={locale}
					onSubmit={(data) => {
						createListing({ data });
					}}
				/>
			</div>
		</div>
	);
}
