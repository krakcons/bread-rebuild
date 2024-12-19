import { Button, buttonVariants } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getTranslations } from "@/lib/language";
import { cn } from "@/lib/utils";
import { login, LoginSchema } from "@/server/auth/actions";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/$language/admin/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const { language } = Route.useParams();
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value: data }) => {
			await login({ data });
		},
		validators: {
			onChange: LoginSchema,
		},
	});

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center gap-4 p-4">
			<h1>{t.admin.auth.login.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.login.switch.preface}
				<Link
					href="/$language/admin/signup"
					className={cn(
						buttonVariants({
							variant: "link",
						}),
						"px-2",
					)}
				>
					{t.admin.auth.login.switch.link}
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
					<form.Field
						name="email"
						children={(field) => (
							<Label>
								{t.admin.auth.form.email}
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									autoComplete="email"
								/>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<Label>
								{t.admin.auth.form.password}
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									autoComplete="current-password"
								/>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<div className="flex items-start justify-between gap-2">
						<Button type="submit">{t.form.submit}</Button>
						<Link
							href="/$language/admin/forgot-password"
							className={cn(
								buttonVariants({
									variant: "link",
									size: "auto",
								}),
							)}
						>
							{t.admin.auth.login.forgotPassword}
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
