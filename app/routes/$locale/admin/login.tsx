import { Button, buttonVariants } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { login, LoginSchema } from "@/server/auth/actions";
import { useForm, useStore } from "@tanstack/react-form";
import {
	createFileRoute,
	ErrorComponent,
	Link,
	useParams,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/$locale/admin/login")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const loginMutation = useServerFn(login);
	const { locale } = useParams({
		from: "/$locale",
	});
	const t = useTranslations();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: LoginSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				const result = await loginMutation({ data });
				if (result.error) {
					formApi.setErrorMap({
						onServer: result.error,
					});
				}
			} catch (error) {
				formApi.setErrorMap({
					onServer: "Something went wrong",
				});
			}
		},
	});

	const serverError = useStore(
		form.store,
		(formState) => formState.errorMap.onServer,
	);

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center gap-4 p-4">
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
			<h1>{t("admin.auth.login.title")}</h1>
			<p className="text-sm text-muted-foreground">
				{t("admin.auth.login.switch.preface")}
				<Link
					to="/$locale/admin/signup"
					params={{ locale }}
					className={cn(
						buttonVariants({
							variant: "link",
						}),
						"px-2",
					)}
				>
					{t("admin.auth.login.switch.link")}
				</Link>
			</p>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-4">
					{serverError && (
						<ErrorMessage text={serverError as string} />
					)}
					<form.Field
						name="email"
						children={(field) => (
							<Label>
								{t("common.email")}
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<Label>
								{t("form.auth.password")}
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									type="password"
									autoComplete="new-password"
								/>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Subscribe
						selector={(formState) => [formState.isSubmitting]}
					>
						{([isSubmitting]) => (
							<div className="flex items-start justify-between gap-2">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="animate-spin" />
									)}
									{t("common.submit")}
								</Button>
								<Link
									to="/$locale/admin/reset-password"
									params={{ locale }}
									className={cn(
										buttonVariants({
											variant: "link",
											size: "auto",
										}),
									)}
									preload={false}
								>
									{t("admin.auth.login.forgotPassword")}
								</Link>
							</div>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
