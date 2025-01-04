import { ProviderForm } from "@/components/forms/Provider";
import { getTranslations } from "@/lib/locale";
import { editProviderFn, getProviderFn } from "@/server/actions/provider";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

export const Route = createFileRoute("/$locale/admin/_admin/provider")({
	component: RouteComponent,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps: { editingLocale } }) => {
		const provider = await getProviderFn({
			data: {
				locale: editingLocale,
				fallback: false,
			},
		});
		return {
			provider,
		};
	},
});

function RouteComponent() {
	const router = useRouter();
	const editProvider = useServerFn(editProviderFn);
	const { provider } = Route.useLoaderData();
	const { locale } = Route.useParams();
	const { editingLocale } = Route.useSearch();
	const t = getTranslations(locale);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t.admin.provider.title}</h1>
				<p>{t.admin.provider.description}</p>
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
