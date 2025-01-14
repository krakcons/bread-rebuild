import { ProviderForm } from "@/components/forms/Provider";
import { getMyProviderFn, mutateProviderFn } from "@/server/actions/provider";
import { seo } from "@/lib/seo";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { useTranslations } from "use-intl";
import { toast } from "sonner";

export const Route = createFileRoute("/$locale/admin/_admin/providers/me")({
	component: RouteComponent,
	loaderDeps: ({ search }) => ({ editingLocale: search.editingLocale }),
	loader: async ({ deps: { editingLocale }, context: { t } }) => {
		const provider = await getMyProviderFn({
			data: {
				locale: editingLocale,
				fallback: false,
			},
		});
		return {
			seo: {
				title: t("admin.provider.title"),
				description: t("admin.provider.description"),
			},
			provider,
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return seo(loaderData.seo);
	},
});

function RouteComponent() {
	const router = useRouter();
	const editProvider = useServerFn(mutateProviderFn);
	const { provider } = Route.useLoaderData();
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});
	const { editingLocale } = Route.useSearch();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
				<h1>{t("admin.provider.title")}</h1>
				<p>{t("admin.provider.description")}</p>
			</div>
			<ProviderForm
				key={`${editingLocale}-${provider?.updatedAt.toString()}`}
				defaultValues={provider}
				onSubmit={async (data) => {
					await editProvider({
						data: {
							...data,
							locale: editingLocale!,
							id: provider?.id,
						},
					});
					await toast.success(t("form.provider.success.update"));
					await router.invalidate();
				}}
			/>
		</div>
	);
}
