import { Button, buttonVariants } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getTranslations } from "@/lib/language";
import { cn } from "@/lib/utils";
import { LoginSchema } from "@/server/auth/actions";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
export const Route = createFileRoute("/$language/admin/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const { language } = Route.useParams();
	const t = getTranslations(language);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: async ({ value: data }) => {
			// await signup({ data });
			console.log(data);
		},
		validators: {
			onSubmit: LoginSchema.extend({
				passwordConfirmation: z.string().min(8).max(64),
			}).refine((data) => data.password === data.passwordConfirmation, {
				message: "Passwords do not match",
				path: ["passwordConfirmation"],
			}),
		},
	});

	return (
		<div className="mx-auto flex h-screen w-screen max-w-[400px] flex-col justify-center gap-4 p-4">
			<h1>{t.admin.auth.signup.title}</h1>
			<p className="text-sm text-muted-foreground">
				{t.admin.auth.signup.switch.preface}
				<Link
					href="/$language/admin/login"
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
					<div className="flex items-start justify-between gap-2">
						<Button type="submit">{t.form.submit}</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
