import { ProviderForm } from "@/components/forms/Provider";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Locale, useTranslations } from "@/lib/locale";
import { mutateProviderFn } from "@/server/actions/provider";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	redirect,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
	},
});

function RouteComponent() {
	const createProvider = useServerFn(mutateProviderFn);
	const { locale } = Route.useParams();
	const t = useTranslations(locale);
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
				{t.common.back} {t.common.to} {t.common.bread}
			</Link>
			<h1>{t.admin.onboarding.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.onboarding.description}
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
					await toast.success(t.form.provider.success.create);
				}}
			/>
		</div>
	);
}
