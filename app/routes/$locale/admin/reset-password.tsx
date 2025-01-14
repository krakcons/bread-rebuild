import { PasswordStrength } from "@/components/PasswordStrength";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
	isPasswordResetVerified,
	resetPassword,
	ResetPasswordEmailSchema,
	resetPasswordFromEmail,
	ResetPasswordSchema,
} from "@/server/auth/actions";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/$locale/admin/reset-password")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	beforeLoad: async ({ context }) => {
		const verified = await isPasswordResetVerified();
		return { ...context, verified };
	},
	loader: async ({ context }) => {
		return { verified: context.verified };
	},
});

const EmailForm = () => {
	const resetPasswordFromEmailMutation = useServerFn(resetPasswordFromEmail);
	const navigate = Route.useNavigate();
	const { t, locale } = Route.useRouteContext();
	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: ResetPasswordEmailSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				const result = await resetPasswordFromEmailMutation({ data });
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
				to="/$locale/admin/login"
				params={{ locale }}
				className={buttonVariants({
					variant: "link",
					size: "auto",
					className: "self-start",
				})}
			>
				<ArrowLeft size={20} />
				{t.common.back} {t.common.to} {t.admin.auth.login.title}
			</Link>
			<h1>{t.admin.auth.resetPassword.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.resetPassword.emailDescription}
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
								{t.common.email}
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
					<form.Subscribe
						selector={(formState) => [formState.isSubmitting]}
					>
						{([isSubmitting]) => (
							<div className="flex items-start justify-between gap-2">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="animate-spin" />
									)}
									{t.common.submit}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
};

const PasswordForm = () => {
	const resetPasswordMutation = useServerFn(resetPassword);
	const { t, locale } = Route.useRouteContext();
	const form = useForm({
		defaultValues: {
			password: "",
			passwordConfirmation: "",
		},
		validators: {
			onSubmit: ResetPasswordSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				const result = await resetPasswordMutation({ data });
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
			<Link
				to="/$locale/admin/login"
				params={{ locale }}
				className={buttonVariants({
					variant: "link",
					size: "auto",
					className: "self-start",
				})}
			>
				<ArrowLeft size={20} />
				{t.common.back} {t.admin.auth.login.title}
			</Link>
			<h1>{t.admin.auth.resetPassword.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.resetPassword.passwordDescription}
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
						name="password"
						children={(field) => (
							<Label>
								{t.form.auth.password}
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
								<PasswordStrength
									password={field.state.value}
									locale={locale}
								/>
							</Label>
						)}
					/>
					<form.Field
						name="passwordConfirmation"
						children={(field) => (
							<Label>
								{t.form.auth.passwordConfirmation}
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									autoComplete="new-password"
									type="password"
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
									{t.common.submit}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
};

function RouteComponent() {
	const { verified } = Route.useLoaderData();

	if (verified) return <PasswordForm />;
	else return <EmailForm />;
}
