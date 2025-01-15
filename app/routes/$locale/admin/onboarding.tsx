import { ProviderForm } from "@/components/forms/Provider";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Locale } from "@/lib/locale";
import { seo } from "@/lib/seo";
import { mutateProviderFn } from "@/server/actions/provider";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	redirect,
	useParams,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/$locale/admin/onboarding")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	beforeLoad: async ({ context, params }) => {
		if (context.provider) {
			throw redirect({
				replace: true,
				to: "/$locale/admin",
				params: {
					locale: params.locale,
				},
			});
		}
		return context;
	},
	loader: ({ context: { t } }) => {
		return {
			seo: {
				title: t("admin.onboarding.title"),
				description: t("admin.onboarding.description"),
			},
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		return seo(loaderData.seo);
	},
});

function RouteComponent() {
	const createProvider = useServerFn(mutateProviderFn);
	const t = useTranslations();
	const { locale } = useParams({
		from: "/$locale",
	});
	const navigate = Route.useNavigate();

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[600px] flex-col justify-center gap-4 p-4">
			<Button
				onClick={() => {
					navigate({
						replace: true,
						params: {
							locale: locale === "en" ? "fr" : "en",
						},
						search: (prev) => ({ ...prev }),
					});
				}}
				size="icon"
			>
				{locale === "en" ? "FR" : "EN"}
			</Button>
			<Link
				to="/$locale"
				params={{ locale }}
				className={buttonVariants({
					variant: "link",
					class: "self-start",
					size: "auto",
				})}
			>
				<ArrowLeft size={20} />
				{t("common.back")} {t("common.to")} {t("common.bread")}
			</Link>
			<h1>{t("admin.onboarding.title")}</h1>
			<p className="text-sm text-muted-foreground">
				{t("admin.onboarding.description")}
			</p>
			<ProviderForm
				locale={locale}
				onSubmit={async (data) => {
					await createProvider({
						data: {
							...data,
							locale: locale as Locale,
							redirect: true,
						},
					});
					await toast.success(t("form.provider.success.create"));
				}}
			/>
		</div>
	);
}
