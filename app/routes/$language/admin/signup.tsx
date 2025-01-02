import { PasswordStrength } from "@/components/PasswordStrength";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getTranslations } from "@/lib/language";
import { cn } from "@/lib/utils";
import { signup, SignupSchema } from "@/server/auth/actions";
import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/$language/admin/signup")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const signupMutation = useServerFn(signup);
	const { language } = Route.useParams();
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			passwordConfirmation: "",
		},
		validators: {
			onSubmit: SignupSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			try {
				const result = await signupMutation({ data });
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
				to="/$language"
				params={{ language }}
				className={buttonVariants({
					variant: "link",
					class: "self-start",
					size: "auto",
				})}
			>
				<ArrowLeft size={20} />
				{t.common.back} {t.common.to} {t.common.bread}
			</Link>
			<h1>{t.admin.auth.signup.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.signup.switch.preface}
				<Link
					to="/$language/admin/login"
					params={{ language }}
					className={cn(
						buttonVariants({
							variant: "link",
						}),
						"px-2",
					)}
				>
					{t.admin.auth.signup.switch.link}
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
								{t.admin.auth.signup.form.email}
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
								{t.admin.auth.signup.form.password}
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
									language={language}
								/>
							</Label>
						)}
					/>
					<form.Field
						name="passwordConfirmation"
						children={(field) => (
							<Label>
								{t.admin.auth.signup.form.passwordConfirmation}
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
}
