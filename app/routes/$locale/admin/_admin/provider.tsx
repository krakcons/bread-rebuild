import { ProviderForm } from "@/components/forms/Provider";
import { editProviderFn, getProviderFn } from "@/server/actions/provider";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

const english = {
	title: "Provider",
	description: "Manage your provider information here.",
};

const french: typeof english = {
	title: "Fournisseur",
	description: "Gérez vos informations de fournisseur ici.",
};

export const Route = createFileRoute("/$locale/admin/_admin/provider")({
	component: RouteComponent,
	loaderDeps: ({ search }) => search,
	loader: async ({ params, deps: { editingLocale } }) => {
		const provider = await getProviderFn({
			data: {
				locale: editingLocale,
				fallback: false,
			},
		});
		return {
			pt: params.locale === "fr" ? french : english,
			provider,
		};
	},
});

function RouteComponent() {
	const router = useRouter();
	const editProvider = useServerFn(editProviderFn);
	const { pt, provider } = Route.useLoaderData();
	const { locale } = Route.useParams();
	const { editingLocale } = Route.useSearch();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{pt.title}</h1>
				<p>{pt.description}</p>
			</div>
			<ProviderForm
				key={editingLocale}
				locale={locale}
				defaultValues={provider}
				onSubmit={async (data) => {
					await editProvider({
						data: { ...data, locale: editingLocale! },
					});
					router.invalidate();
				}}
			/>
		</div>
	);
}
