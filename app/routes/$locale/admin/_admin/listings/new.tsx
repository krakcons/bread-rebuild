import { ListingForm } from "@/components/forms/Listing";
import { Locale, useTranslations } from "@/lib/locale";
import { getDietaryOptionsFn } from "@/server/actions/dietary";
import { mutateListingFn } from "@/server/actions/listings";
import { getProviderFn } from "@/server/actions/provider";
import {
	createFileRoute,
	ErrorComponent,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/_admin/listings/new")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	loader: async ({ params }) => {
		const provider = await getProviderFn({
			data: {
				locale: params.locale as Locale,
			},
		});
		if (!provider) {
			throw notFound();
		}
		const dietaryOptions = await getDietaryOptionsFn({
			data: {
				locale: params.locale as Locale,
				fallback: true,
			},
		});
		return {
			provider,
			dietaryOptions,
		};
	},
});

function RouteComponent() {
	const router = useRouter();
	const createListing = useServerFn(mutateListingFn);
	const { locale } = Route.useParams();
	const t = useTranslations(locale);
	const { provider, dietaryOptions } = Route.useLoaderData();
	const { editingLocale } = Route.useSearch();

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
					provider={provider}
					onSubmit={async (data) => {
						await createListing({
							data: {
								...data,
								redirect: true,
								locale: editingLocale!,
							},
						});
						await toast.success(t.form.listing.success.create);
						await router.invalidate();
					}}
				/>
			</div>
		</div>
	);
}
