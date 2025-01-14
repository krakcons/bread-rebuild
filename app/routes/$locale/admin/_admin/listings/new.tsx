import { ListingForm } from "@/components/forms/Listing";
import { mutateListingFn } from "@/server/actions/listings";
import { getMyProviderFn } from "@/server/actions/provider";
import {
	createFileRoute,
	ErrorComponent,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/$locale/admin/_admin/listings/new")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	loader: async () => {
		const provider = await getMyProviderFn();
		if (!provider) {
			throw new Error("Provider not found");
		}
		return { provider };
	},
});

function RouteComponent() {
	const router = useRouter();
	const createListing = useServerFn(mutateListingFn);
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});
	const { editingLocale } = Route.useSearch();
	const { provider } = Route.useLoaderData();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t("admin.listings.new.title")}</h1>
				<p>{t("admin.listings.new.description")}</p>
			</div>
			<div className="flex flex-col gap-2">
				<ListingForm
					locale={locale}
					provider={provider}
					onSubmit={async (data) => {
						await createListing({
							data: {
								...data,
								redirect: true,
								locale: editingLocale!,
							},
						});
						await toast.success(t("form.listing.success.create"));
						await router.invalidate();
					}}
				/>
			</div>
		</div>
	);
}
